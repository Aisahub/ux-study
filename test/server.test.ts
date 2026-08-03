import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createSocketServer, type Server } from 'node:net'

import { afterEach, expect, test } from 'vitest'

import { assertPortIsFree, assertStillOurServer, waitUntilOwnServerAnswers } from './server'

/**
 * The suite's guards against testing a server it did not start (#52).
 *
 * On 2026-07-29 a `next dev` from another working session held port 3100, the
 * suite's own `next start` died on `EADDRINUSE`, and 129 tests passed against
 * that stranger's build. Every one of those tests was correct; the thing they
 * were pointed at was wrong, and nothing in the run could say so. These tests
 * are pointed at the part that could not: the ownership check itself.
 *
 * They deliberately never touch port 3100. That port belongs to the server
 * this suite is running against right now, and a test that bound it, held it,
 * or killed it would be doing the exact thing #52 is about. Each test takes an
 * ephemeral port of its own instead.
 */
const openedHere: Array<Server | ChildProcess> = []

afterEach(async () => {
  await Promise.all(
    openedHere.splice(0).map(async (opened) => {
      if ('kill' in opened) {
        if (opened.exitCode === null && opened.signalCode === null) {
          opened.kill('SIGKILL')
          await once(opened, 'exit')
        }
        return
      }
      opened.close()
      await once(opened, 'close')
    }),
  )
})

/** A port the operating system has just confirmed is free, released again. */
async function freePort(): Promise<number> {
  const socket = createSocketServer()
  socket.listen(0)
  await once(socket, 'listening')
  const address = socket.address()
  if (address === null || typeof address === 'string') throw new Error('expected a TCP address')
  socket.close()
  await once(socket, 'close')
  return address.port
}

/** A stranger: something that answers 200 on the port and is not our server. */
async function somethingAnsweringOn(port: number): Promise<void> {
  const stranger = createHttpServer((_, response) => response.end('a different build, from a different tree'))
  openedHere.push(stranger)
  stranger.listen(port)
  await once(stranger, 'listening')
}

/** A process the suite started, taken through its whole life before we look. */
async function aServerThatAlreadyDied(): Promise<ChildProcess> {
  const server = spawn(process.execPath, ['-e', 'process.exit(1)'])
  openedHere.push(server)
  await once(server, 'exit')
  return server
}

test('a run that starts while another process holds the port fails there, naming the port', async () => {
  const port = await freePort()
  await somethingAnsweringOn(port)

  await expect(assertPortIsFree(port)).rejects.toThrow(
    new RegExp(`(?=.*\\b${port}\\b)(?=.*another process)`, 's'),
  )
})

test('a port nothing holds is not read as held', async () => {
  await expect(assertPortIsFree(await freePort())).resolves.toBeUndefined()
})

test('a stranger answering on the port is not mistaken for the server the suite started', async () => {
  // 2026-07-29, in miniature: something answers 200, and the process the suite
  // started is not the one answering. The old check asked only the port, so it
  // returned green here and let 129 tests run against the stranger.
  const port = await freePort()
  await somethingAnsweringOn(port)
  const server = await aServerThatAlreadyDied()

  await expect(waitUntilOwnServerAnswers(server, port)).rejects.toThrow(
    new RegExp(`(?=.*\\b${port}\\b)(?=.*exited)`, 's'),
  )
})

test('a server that dies on the way up ends the run at once rather than being polled for a minute', async () => {
  const port = await freePort()
  const server = spawn(process.execPath, ['-e', 'setTimeout(() => process.exit(1), 200)'])
  openedHere.push(server)

  const startedAt = Date.now()
  await expect(waitUntilOwnServerAnswers(server, port)).rejects.toThrow(/exited/)

  // The poll it replaces would have spent its full sixty seconds here before
  // reporting a timeout, and reported the wrong cause when it got there.
  expect(Date.now() - startedAt).toBeLessThan(10_000)
})

test('the branch is not swept when the server the suite started is already gone', async () => {
  const server = await aServerThatAlreadyDied()

  expect(() => assertStillOurServer(server, 3999)).toThrow(
    new RegExp('(?=.*\\b3999\\b)(?=.*exited)', 's'),
  )
})

test('the branch is swept when the server the suite started is still the one serving it', async () => {
  const server = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 30_000)'])
  openedHere.push(server)

  expect(() => assertStillOurServer(server, 3999)).not.toThrow()
})
