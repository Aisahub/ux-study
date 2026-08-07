import { expect, test } from 'vitest'

import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The first tests in the repository, so they set the convention: drive the real
 * application over HTTP and assert on what a visitor observes, never on which
 * internal function ran or on how the markup happens to be serialised.
 *
 * What they observe changed once there was a platform to arrive at. These
 * originally asserted a rendered allowlist count, as the visible proof that
 * request -> application -> Postgres -> page was live. That proof is now made
 * many times over by every surface in the suite — each renders what it read
 * and could not render it otherwise — so the front page is free to do its
 * actual job, which is to get out of the way.
 */
test('the front page answers, and sends an arriving visitor somewhere useful', async () => {
  const response = await fetch(BASE_URL, { redirect: 'manual' })

  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.status).toBeLessThan(400)
  expect(response.headers.get('location')).toMatch(/\/(en|ko)$/)
})

test('a visitor who is not signed in is sent to the door', async () => {
  const response = await fetch(`${BASE_URL}/en`, { redirect: 'manual' })

  expect(response.headers.get('location')).toContain('/en/signin')
})

test('a signed-in Learner is sent to where the programme starts', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const response = await fetch(`${BASE_URL}/en`, { headers: { cookie }, redirect: 'manual' })

  expect(response.headers.get('location')).toContain('/en/learn')
})

test('nothing on the door repaints itself when the visitor\'s system is dark', async () => {
  // This world is light-only and says so in three places — DESIGN.md's Don't,
  // the note above the tokens, and the deleted `prefers-color-scheme` block in
  // `globals.css`. None of them stopped `dark:` variants living on in the
  // scaffold-era pages, which repainted individual elements against a
  // background that stays light: the sign-in button went white on near-white
  // and could not be found (ERR-219).
  //
  // The served stylesheet is what is asserted, not the markup. Tailwind emits
  // this at-rule only if a `dark:` variant survives somewhere in the source, so
  // one assertion here covers every page and every variant typed after it — a
  // grep for `dark:` in the files that exist today would not.
  const html = await (await fetch(`${BASE_URL}/en/signin`)).text()
  const hrefs = [...html.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"/g)].map((match) => match[1])
  expect(hrefs.length).toBeGreaterThan(0)
  const css = (
    await Promise.all(hrefs.map(async (href) => (await fetch(new URL(href, BASE_URL))).text()))
  ).join('\n')

  expect(css).not.toContain('prefers-color-scheme')
})

test('the application still reads from a real database on the way through', async () => {
  // Not a rendered number any more: an allowlist row is inserted here and the
  // sign-in it admits is observable only if the application read it back.
  const email = `arrival-${Date.now()}@example.com`
  await testDb.insert(schema.allowlist).values({ pattern: email }).onConflictDoNothing()
  const cookie = await sessionCookieFor(email)

  const response = await fetch(`${BASE_URL}/en`, { headers: { cookie }, redirect: 'manual' })

  expect(response.headers.get('location')).toContain('/en/learn')
  expect(visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())).toContain(
    'Stage 1',
  )
})
