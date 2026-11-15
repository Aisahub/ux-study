import { NextResponse, type NextRequest } from 'next/server'

import { db, schema } from '@/db'
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSession } from '@/lib/auth'
import { newDemoEmail } from '@/lib/demo'
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, isLanguage, type Language } from '@/lib/language'

/** Public demo entrance: signs the visitor in as a fresh demo Learner (see lib/demo.ts). */
export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang')
  const lang: Language = isLanguage(langParam) ? langParam : DEFAULT_LANGUAGE

  const email = newDemoEmail()
  await db.insert(schema.users).values({ email, language: lang })
  const { token, expiresAt } = await createSession(email)

  const response = NextResponse.redirect(new URL(`/${lang}/learn`, request.url))
  response.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    expires: expiresAt,
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
  })
  response.cookies.set(LANGUAGE_COOKIE, lang, { path: '/', maxAge: LANGUAGE_COOKIE_MAX_AGE, sameSite: 'lax' })
  return response
}
