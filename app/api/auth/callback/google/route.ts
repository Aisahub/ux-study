import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

import { db, schema } from '@/db'
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSession, resolveAccess } from '@/lib/auth'
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, isLanguage, type Language } from '@/lib/language'

/**
 * The way back from Google (#11). Google has verified who the visitor is;
 * this route decides whether they are enrolled, and the two must not be
 * conflated — a rejected address authenticated fine, it just is not on the
 * allowlist, and the page it lands on says so instead of showing an error.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const expected = request.cookies.get('oauth-state')?.value
  const state = query.get('state')

  // A missing or mismatched state means this request did not start at our
  // sign-in route — a forged or replayed callback. It gets no detail.
  if (!state || !expected || state !== expected) {
    return new NextResponse('Sign-in did not start here. Go back and try again.', { status: 400 })
  }
  const langPart = state.split(':')[1]
  const lang: Language = isLanguage(langPart) ? langPart : DEFAULT_LANGUAGE

  const code = query.get('code')
  if (!code) {
    // The visitor declined at Google's consent screen; back to sign-in.
    return NextResponse.redirect(new URL(`/${lang}/signin`, request.url))
  }

  const email = await exchangeCodeForEmail(code, new URL('/api/auth/callback/google', request.url).toString())
  if (!email) {
    return new NextResponse('Google did not confirm the sign-in. Go back and try again.', { status: 502 })
  }

  const access = await resolveAccess(email)
  if (!access.allowed) {
    // Told, not errored: the address authenticated but is not enrolled. The
    // address travels in a short-lived cookie rather than the URL, so it is
    // never in a history entry or a pasted link.
    const response = NextResponse.redirect(new URL(`/${lang}/not-enrolled`, request.url))
    response.cookies.set('not-enrolled-email', email, { path: '/', maxAge: 300, httpOnly: true, sameSite: 'lax' })
    return response
  }

  // Enrolled. Remember the person, open the session, and let a stored
  // language preference from an earlier device win over this device's guess
  // (#12) — falling back to seeding the preference from where they are now.
  const [user] = await db
    .insert(schema.users)
    .values({ email: email.toLowerCase(), language: lang })
    .onConflictDoUpdate({
      target: schema.users.email,
      // No-op update so the row comes back either way; a stored language is
      // deliberately not overwritten by this device's path.
      set: { email: email.toLowerCase() },
    })
    .returning()
  const preferred: Language = isLanguage(user.language) ? user.language : lang

  const { token, expiresAt } = await createSession(email)
  // Where a Learner lands: the Stage 1 overview (#20).
  const response = NextResponse.redirect(new URL(`/${preferred}/learn`, request.url))
  response.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    expires: expiresAt,
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  })
  response.cookies.set(LANGUAGE_COOKIE, preferred, { path: '/', maxAge: LANGUAGE_COOKIE_MAX_AGE, sameSite: 'lax' })
  response.cookies.delete('oauth-state')
  return response
}

/**
 * Trades the one-time code for Google's ID token and reads the verified
 * address out of it. The token arrives directly from Google over TLS, so its
 * payload is trusted without re-verifying the signature — the signature
 * exists for tokens that passed through other hands.
 */
async function exchangeCodeForEmail(code: string, redirectUri: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  let payload: { id_token?: string }
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    if (!response.ok) return null
    payload = (await response.json()) as { id_token?: string }
  } catch {
    return null
  }
  if (!payload.id_token) return null

  try {
    const claims = JSON.parse(Buffer.from(payload.id_token.split('.')[1], 'base64url').toString()) as {
      email?: string
      email_verified?: boolean
    }
    // An unverified address could be anyone claiming it; the allowlist must
    // only ever see addresses Google itself stands behind.
    if (!claims.email || claims.email_verified !== true) return null
    return claims.email
  } catch {
    return null
  }
}
