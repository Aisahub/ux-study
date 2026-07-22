import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

import { db, schema } from '@/db'
import { SESSION_COOKIE } from '@/lib/auth'
import { DEFAULT_LANGUAGE, isLanguage } from '@/lib/language'

/**
 * Ends the session on the server, not just in the browser: the row is deleted,
 * so the cookie value is worthless even if it was copied somewhere. POST
 * because signing out changes state — a GET would let any image tag do it.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.token, token))

  const langParam = request.nextUrl.searchParams.get('lang')
  const lang = isLanguage(langParam) ? langParam : DEFAULT_LANGUAGE
  const response = NextResponse.redirect(new URL(`/${lang}`, request.url), 303)
  response.cookies.delete(SESSION_COOKIE)
  return response
}
