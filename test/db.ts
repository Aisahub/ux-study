import { randomBytes } from 'node:crypto'

import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '../db/schema'

config({ path: '.env.local', quiet: true })

/**
 * The test suite's own line to the test branch — the same database the
 * server under test reads. Tests use it to arrange state a visitor cannot
 * arrange over HTTP (a session row, an allowlist entry) and to observe what a
 * response must not reveal. The OAuth handshake itself is deliberately not
 * driven by tests (#11): a session row plus its cookie stands in for it.
 */
const url = process.env.DATABASE_URL_TEST
if (!url) throw new Error('DATABASE_URL_TEST is not set. Copy .env.example to .env.local.')

export const testDb = drizzle(neon(url), { schema })
export { schema }

/** A signed-in visitor, minted directly: the Cookie header a fetch presents. */
export async function sessionCookieFor(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await testDb.insert(schema.sessions).values({
    token,
    email: email.toLowerCase(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  })
  return `session=${token}`
}
