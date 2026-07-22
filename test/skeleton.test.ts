import { expect, test } from 'vitest'

import { BASE_URL } from './config'
import { visibleText } from './html'

/**
 * The first tests in the repository, so they set the convention: drive the real
 * application over HTTP and assert on what a visitor observes, never on which
 * internal function ran or on how the markup happens to be serialised.
 */
test('the front page answers', async () => {
  const response = await fetch(BASE_URL)

  expect(response.status).toBe(200)
})

test('the front page reports a live database, which it can only know by asking one', async () => {
  const response = await fetch(BASE_URL)
  const text = visibleText(await response.text())

  // The count is rendered from a real query against the Neon test branch. A
  // visitor seeing it is the observable proof of the whole path:
  // request -> application -> Postgres -> rendered page.
  expect(text).toMatch(/allowlist entries: \d+/)
})
