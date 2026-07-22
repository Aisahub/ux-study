import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

/**
 * The single database handle. There is no fake and no test double: tests point
 * DATABASE_URL at a Neon test branch and run against a real Postgres, because
 * behaviour that depends on database guarantees is invisible to a substitute.
 */
function connectionString(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and fill in a Neon connection string.',
    )
  }
  return url
}

export const db = drizzle(neon(connectionString()), { schema })
export { schema }
