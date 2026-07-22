import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

import { config } from 'dotenv'

import { BASE_URL, PORT } from './config'

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
  }
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
