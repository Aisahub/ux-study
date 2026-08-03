import { spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:net'
import { setTimeout as sleep } from 'node:timers/promises'

import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { baseUrlFor, PORT } from './config'
import { schema, testDb } from './db'

config({ path: '.env.local', quiet: true })

/**
 * Brings up the real application against a real Neon test branch.
 *
 * The suite drives the built application through its own server entry point —
 * there is no fake, no in-memory database, and no test-only code path. Applying
 * the migrations here rather than assuming a prepared database means every run
 * proves they still work from whatever state the branch is in.
 *
 * A run has to own the server it tests, and the ownership is established here
 * or not at all (#52). The port is claimed before anything else happens, so a
 * run that cannot have the port never migrates the branch, never sweeps it, and
 * never reports on a build it did not make.
 */
export default async function setup() {
  const url = process.env.DATABASE_URL_TEST
  if (!url) {
    throw new Error('DATABASE_URL_TEST is not set. Copy .env.example to .env.local.')
  }
  if (url === process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL_TEST points at the branch that serves Learners. Use a test branch.')
  }
  await assertPortIsFree(PORT)

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
  await waitUntilOwnServerAnswers(server, PORT)

  return async () => {
    // Asked before the kill, since the kill is itself an exit: the question is
    // whether this server was still the one serving when the run finished.
    try {
      assertStillOurServer(server, PORT)
    } finally {
      server.kill('SIGTERM')
    }
    await sweep()
  }
}

/**
 * Refuses the run when anything already holds the port, before the suite has
 * touched the branch or spawned anything.
 *
 * This is the check that was missing on 2026-07-29. A `next dev` from another
 * working session held 3100; the suite's own `next start` died on EADDRINUSE
 * the moment it was spawned; the readiness poll asked the port whether anyone
 * was answering, got a 200 from the stranger, and 129 tests then passed against
 * a different build from a different tree.
 *
 * Asking by binding rather than by fetching is the point. A fetch can only
 * learn that something answers, which is the question that failed; a bind
 * learns whether the port is the suite's to take, which is the question that
 * matters. Binding the way `next start` does — every interface, not just the
 * loopback the tests fetch — so a stranger on any of them is seen.
 */
export function assertPortIsFree(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = createServer()
    socket.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code !== 'EADDRINUSE' && error.code !== 'EACCES') return reject(error)
      reject(
        new Error(
          `Port ${port} is already in use — another process holds it, so this run would test a ` +
            `server it did not start, and sweep a branch it does not own. Stop whatever is ` +
            `listening on ${port} (\`lsof -ti tcp:${port}\`) and run again.`,
        ),
      )
    })
    socket.listen(port, () => socket.close(() => resolve()))
  })
}

/**
 * Waits for the server the suite started to answer — and for that server
 * specifically, not for the port.
 *
 * Two things together make the answer this server's answer: `assertPortIsFree`
 * has already shown that nothing else held the port at the moment it was
 * spawned, and this process is still running when the answer arrives. Neither
 * alone is enough. A process that has exited cannot be the one answering, so
 * its exit ends the run here rather than being absorbed by the poll — before,
 * `next start` dying was unobserved, and the run went on to spend sixty seconds
 * discovering either a stranger's 200 or a timeout that named the wrong cause.
 */
export function waitUntilOwnServerAnswers(server: ChildProcess, port: number, attempts = 60): Promise<void> {
  return Promise.race([whenItExits(server, port), pollUntilItAnswers(server, port, attempts)])
}

/**
 * The guard `sweep()` sits behind: the suite still owns what it is about to
 * empty, or the run ends without emptying it.
 *
 * `sweep()` TRUNCATEs six tables, which is safe only while the suite owns the
 * server reading them — on 2026-07-29 it ran underneath a colleague's dev
 * server and destroyed state that session was using. Setup establishes that
 * ownership; this is where it is checked to have held, because teardown sits at
 * the greatest distance from the checks that justify it. A server that exited
 * during the run ends it: whatever is on the port afterwards is no longer
 * something the suite started, and the branch is no longer the suite's to empty.
 */
export function assertStillOurServer(server: ChildProcess, port: number): void {
  if (server.exitCode === null && server.signalCode === null) return
  throw new Error(
    `The server the suite started on port ${port} ${describeExit(server)} during the run, so the ` +
      `suite can no longer show that it owns the test branch. Refusing to sweep: something the ` +
      `suite did not start may be serving it.`,
  )
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
 * Emptying tables is safe here on two conditions, both settled before this
 * runs: setup() has refused the branch that serves Learners, and
 * assertStillOurServer() has shown the suite still owns the server reading
 * this one. The second was missing until #52, and its absence emptied six
 * tables under a colleague's live dev server.
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

/** Never resolves; rejects the moment the server the suite started is gone. */
function whenItExits(server: ChildProcess, port: number): Promise<never> {
  return new Promise((_, reject) => {
    const gone = () =>
      reject(
        new Error(
          `The server the suite started on port ${port} ${describeExit(server)} before it ` +
            `answered, so nothing was tested. If it exited on EADDRINUSE, something took the ` +
            `port between the check and the spawn.`,
        ),
      )
    if (server.exitCode !== null || server.signalCode !== null) return gone()
    server.once('exit', gone)
    server.once('error', (error) =>
      reject(new Error(`The server the suite started on port ${port} could not be run: ${error.message}`)),
    )
  })
}

async function pollUntilItAnswers(server: ChildProcess, port: number, attempts: number) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(baseUrlFor(port))
      // An answer counts only while the process that should be giving it is
      // still running. When it is not, the exit has already lost this race.
      if (response.status < 500 && server.exitCode === null && server.signalCode === null) return
    } catch {
      // not listening yet
    }
    await sleep(1000)
  }
  throw new Error(`${baseUrlFor(port)} did not start answering within ${attempts} seconds`)
}

function describeExit(server: ChildProcess) {
  return server.signalCode ? `was killed by ${server.signalCode}` : `exited with code ${server.exitCode}`
}
