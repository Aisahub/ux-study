import { randomBytes } from 'node:crypto'

import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LANGUAGE, isLanguage } from '@/lib/language'

/**
 * Starts the Google sign-in (#11): sends the visitor to Google's consent
 * screen. The state parameter is the CSRF guard — random, kept in a short
 * cookie, and required to match on the way back — and it also carries the
 * language of the page the visitor signed in from, so the round trip through
 * Google does not lose their place.
 */
export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return new NextResponse('GOOGLE_CLIENT_ID is not set. See .env.example.', { status: 500 })
  }

  const langParam = request.nextUrl.searchParams.get('lang')
  const lang = isLanguage(langParam) ? langParam : DEFAULT_LANGUAGE
  const state = `${randomBytes(16).toString('hex')}:${lang}`

  const authorize = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', new URL('/api/auth/callback/google', request.url).toString())
  authorize.searchParams.set('response_type', 'code')
  // Email is the identity the allowlist works on; openid makes Google answer
  // with an ID token instead of requiring a second userinfo request.
  authorize.searchParams.set('scope', 'openid email')
  authorize.searchParams.set('state', state)

  const response = NextResponse.redirect(authorize)
  response.cookies.set('oauth-state', state, {
    path: '/api/auth',
    maxAge: 600,
    httpOnly: true,
    sameSite: 'lax',
  })
  return response
}
