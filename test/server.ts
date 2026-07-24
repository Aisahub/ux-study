import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { BASE_URL, PORT } from './config'
import { schema, testDb } from './db'

config({ path: '.env.local', quiet: true })

/**
 * Brings up the real application against a real Neon test branch.
 *
 * The suite drives the built application through its own server entry point —
 * there is no fake, no in-memory database, and no test-only code path. Applying
 * the migrations here rather than assuming a prepared database means every run
 * proves they still work from whatever state the branch is in.
 */
export default async function setup() {
  const url = process.env.DATABASE_URL_TEST
  if (!url) {
    throw new Error('DATABASE_URL_TEST is not set. Copy .env.example to .env.local.')
  }
  if (url === process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL_TEST points at the branch that serves Learners. Use a test branch.')
  }

  const env = {
    ...process.env,
    DATABASE_URL: url,
    // Dummy OAuth credentials: enough for the sign-in routes to build their
    // redirects, never presented to Google — the handshake itself is verified
    // by hand, not by this suite (#11).
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? 'test-client-id.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? 'test-client-secret',
  }

  await run('npx', ['drizzle-kit', 'migrate'], env)

  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env, stdio: 'inherit' })
  await waitUntilAnswering()

  return async () => {
    server.kill('SIGTERM')
    await sweep()
  }
}

/**
 * Returns the branch to what a migrated database holds before anyone signs in:
 * the two seeded allowlist rows, and nothing else.
 *
 * Sweeping by what survives rather than by what tests create is deliberate.
 * Fixture addresses have drifted over the life of the suite — `learner-`,
 * `someone@`, `arrival-`, and rows left by a `view-` fixture whose test is no
 * longer in the tree — so a rule that enumerates them is a list that goes
 * stale, and this one already had. `added_by = 'seed migration'` (0002) is the
 * one marker the suite never invents, and it cannot be restored by re-running
 * migrations: 0002 is already applied on every branch that has one, so its
 * ON CONFLICT re-runnability only ever helps a fresh branch. Deleting these
 * rows would strand the suite, which is why they are matched precisely.
 *
 * IS DISTINCT FROM, not <>: an entry a test added carries no added_by at all,
 * and NULL <> 'seed migration' is NULL, which deletes nothing.
 *
 * Emptying tables is safe here only because setup() has already refused to run
 * against the branch that serves Learners.
 */
async function sweep() {
  await testDb.execute(sql`
    TRUNCATE TABLE
      ${schema.users}, ${schema.sessions}, ${schema.attempts},
      ${schema.reports}, ${schema.findings}, ${schema.agreements}
    RESTART IDENTITY CASCADE
  `)
  await testDb
    .delete(schema.allowlist)
    .where(sql`${schema.allowlist.addedBy} IS DISTINCT FROM 'seed migration'`)
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`)),
    )
  })
}

async function waitUntilAnswering(attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(BASE_URL)
      if (response.status < 500) return
    } catch {
      // not listening yet
    }
    await sleep(1000)
  }
  throw new Error(`${BASE_URL} did not start answering within ${attempts} seconds`)
}
