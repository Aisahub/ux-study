import { eq } from 'drizzle-orm'
import { expect, test } from 'vitest'

import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * Sign-in, the allowlist, and sessions (#11). The OAuth handshake itself is
 * not driven here — tests mint session rows directly and present the cookie,
 * exactly as the ticket prescribes. What is tested is everything around the
 * handshake: the seed, the redirects, the rejection page, and that a session
 * ends on the server.
 */

test('a clean database was seeded with exactly the wildcard Learner entry and Chloe as Maintainer', async () => {
  const rows = await testDb.select().from(schema.allowlist)
  const wildcard = rows.find((row) => row.pattern === '@aisahub.com')
  const chloe = rows.find((row) => row.pattern === 'chloe@aisahub.com')

  expect(wildcard?.isMaintainer).toBe(false)
  expect(chloe?.isMaintainer).toBe(true)
})

test('the sign-in page exists in both languages, like every other page', async () => {
  const en = await fetch(`${BASE_URL}/en/signin`)
  const ko = await fetch(`${BASE_URL}/ko/signin`)

  expect(visibleText(await en.text())).toContain('Continue with Google')
  expect(visibleText(await ko.text())).toContain('Google로 계속하기')
})

test('starting sign-in hands the visitor to Google, carrying our client and a state guard', async () => {
  const response = await fetch(`${BASE_URL}/api/auth/google?lang=ko`, { redirect: 'manual' })
  const location = response.headers.get('location') ?? ''

  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.status).toBeLessThan(400)
  expect(location).toContain('https://accounts.google.com/o/oauth2/v2/auth')
  expect(location).toContain('client_id=')
  expect(location).toContain('state=')
  expect(response.headers.get('set-cookie')).toContain('oauth-state=')
})

test('a forged callback — no state that started here — is refused', async () => {
  const response = await fetch(`${BASE_URL}/api/auth/callback/google?code=x&state=forged`, {
    redirect: 'manual',
  })

  expect(response.status).toBe(400)
})

test('the not-enrolled page explains rather than erroring, in both languages', async () => {
  const en = await fetch(`${BASE_URL}/en/not-enrolled`)
  const ko = await fetch(`${BASE_URL}/ko/not-enrolled`)

  expect(en.status).toBe(200)
  expect(visibleText(await en.text())).toContain('not enrolled')
  expect(visibleText(await ko.text())).toContain('등록되지 않은 주소')
})

test('an already-signed-in visitor opening the sign-in page is sent home', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const response = await fetch(`${BASE_URL}/en/signin`, {
    headers: { cookie },
    redirect: 'manual',
  })

  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.status).toBeLessThan(400)
  expect(response.headers.get('location')).toContain('/en')
})

test('signing out deletes the session row — the cookie value is dead even if it was copied', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')
  const token = cookie.split('=')[1]

  const response = await fetch(`${BASE_URL}/api/auth/signout?lang=en`, {
    method: 'POST',
    headers: { cookie },
    redirect: 'manual',
  })

  expect(response.status).toBe(303)
  const rows = await testDb.select().from(schema.sessions).where(eq(schema.sessions.token, token))
  expect(rows).toHaveLength(0)
})

test('an expired session is not a session', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')
  const token = cookie.split('=')[1]
  await testDb
    .update(schema.sessions)
    .set({ expiresAt: new Date(Date.now() - 1000) })
    .where(eq(schema.sessions.token, token))

  // The sign-in page bounces signed-in visitors, so rendering it while
  // presenting the expired cookie proves the session no longer counts.
  const response = await fetch(`${BASE_URL}/en/signin`, { headers: { cookie }, redirect: 'manual' })

  expect(response.status).toBe(200)
})
