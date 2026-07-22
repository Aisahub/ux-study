import { NextResponse, type NextRequest } from 'next/server'

import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, guessLanguage, isLanguage } from '@/lib/language'

/**
 * The only unlocalised address in the application, and the place a reader's
 * language is remembered.
 *
 * Remembering it here, from the path, rather than from a switch event means the
 * preference and the address can never disagree: whatever page a Learner is
 * actually reading is what gets saved. It also means the switcher needs no
 * JavaScript — it is a link, and following it is what records the choice.
 *
 * When sign-in arrives (#11) a signed-in Learner's stored language seeds this
 * cookie, and the resolution order below is unchanged: a saved preference
 * first, the browser's guess only when there is nothing saved.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const saved = request.cookies.get(LANGUAGE_COOKIE)?.value

  if (pathname === '/') {
    const language = isLanguage(saved) ? saved : guessLanguage(request.headers.get('accept-language'))
    return NextResponse.redirect(new URL(`/${language}`, request.url))
  }

  const language = pathname.split('/')[1]
  if (!isLanguage(language)) return NextResponse.next()

  const response = NextResponse.next()
  response.cookies.set(LANGUAGE_COOKIE, language, {
    path: '/',
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
  return response
}

export const config = {
  // Everything a reader navigates to, and nothing the framework serves itself.
  matcher: ['/((?!_next/|favicon.ico).*)'],
}
