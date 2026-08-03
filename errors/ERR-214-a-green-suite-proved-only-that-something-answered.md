# [ERR-214] A green suite proved only that something answered

## Summary

On 2026-07-29 a run of `npm test` reported 129 passed, exit code 0, against a
server it had never started.

A `next dev -p 3100` belonging to a separate working session held the port. The
suite's own `next start -p 3100` was spawned, collided, and died on
`EADDRINUSE` in under a second. `waitUntilAnswering()` then polled
`http://127.0.0.1:3100`, got a 200 from the stranger, and declared the
application ready. All 129 tests ran against a different build, from a
different tree, at a different commit — and passed.

Every assertion in that run was correct. Not one of them was pointed at the
thing it was written to check.

The teardown then made it destructive as well as false. `sweep()` TRUNCATEs six
tables on the test branch on the way out, and it did so underneath a live dev
server reading the same branch, emptying state that session was mid-way through
using.

What makes this worth a document is not the collision. It is that the
repository had no instrument that could see it:

- **The exit code was 0.** Identical to a real pass.
- **The pass count was plausible.** 129 was the right number that day; the
  tests all ran, they were simply asking a stranger.
- **The one true signal was a single `EADDRINUSE` line** printed above a green
  summary, by a spawned process whose `stdio` is `inherit` — visible, and
  therefore scrolled past. Nobody reads the output above a green run.
- **CI structurally cannot reproduce it.** `.github/workflows/test.yml` puts
  every run in one `integration-suite` concurrency group precisely so two runs
  never share the branch, and a fresh runner has nothing on 3100. So the check
  that gates the merge is the one place the defect cannot appear, and the
  developer machine — where the decision to open the PR is actually made — is
  the only place it can.

It was found by a two-axis review of an unrelated typography change (`ERR-208`,
label 12px → 13.5px). The suite's job that day was to say whether that change
was safe. It said yes, about a build that did not contain it.

## Root cause

**The readiness check used an address as an identity.**

`waitUntilAnswering()` asked "is anything answering at `127.0.0.1:3100`". The
question setup actually needed answered was "is the server I just started
answering". Those coincide on every ordinary run, which is why the check
survived from the first commit of the suite, and they come apart in exactly the
case where the answer matters. A liveness probe was doing an identity check's
job, and a liveness probe cannot fail this way loudly, because a stranger
answering looks precisely like success.

Two further gaps let it run all the way to green:

**The loudest available signal had no listener.** `spawn()` returns a
`ChildProcess`, and this one emitted `exit` with an `EADDRINUSE` message about
one second in. Nothing was subscribed to `exit` or `error`. A dying server was
therefore indistinguishable from a slow one, and the sixty-second poll was
where the suite went to find out — the wrong place, since the port's occupancy
was knowable before the spawn, and the death was knowable the moment it
happened.

**Teardown inherited setup's ownership claim without re-establishing it.**
`sweep()` is the most destructive act in the suite and sits at the furthest
point from the checks that would justify it. Its comment reasons carefully
about *which branch* it is safe to empty and never about *whether the suite
still owns what is serving that branch*. Setup never established that
ownership, so there was nothing for teardown to inherit; even once setup does
establish it, a server that dies mid-run silently ends it.

## Reproduction

On the tree before this change, run on 2026-08-03 and green:

```bash
# The stranger: a dev server from another session, on the same test branch.
DATABASE_URL="$DATABASE_URL_TEST" npx next dev -p 3100 &

npx vitest run
# -> Error: listen EADDRINUSE: address already in use :::3100   (line 9 of 22)
# -> Test Files  13 passed (13)
# -> Tests  179 passed (179)
# -> exit code 0
```

The suite's own `next start` is dead before the first test runs. All 179 tests
pass against the dev server, and the branch is swept on the way out regardless.

The stranger has to be a real server for the run to go green — a `node -e`
one-liner answering a fixed string reproduces the ownership failure but fails
82 tests on the way, which is the accident that makes this defect survivable
most of the time and invisible when it is not. A colleague's dev server on the
same application is exactly the case where every assertion still passes.

## Solution

Ownership is established in `setup()` or the run does not happen.

- **The port is claimed by binding it, before anything else.** `assertPortIsFree()`
  opens a listening socket on 3100 and closes it again. Asking by binding rather
  than by fetching is the whole point: a fetch can only learn that something
  answers, which is the question that failed; a bind learns whether the port is
  the suite's to take. It runs ahead of `drizzle-kit migrate`, so a run that
  cannot have the port never touches the branch at all.
- **Readiness is tied to the process, not the address.** `waitUntilOwnServerAnswers()`
  races the poll against the child's `exit` and `error` events, and treats an
  answer as this server's answer only while this server is still running. Two
  facts together make it an identity check: nothing held the port at the instant
  of the spawn, and the process spawned there is alive when the answer arrives.
- **An early exit ends the run at once**, with a message that names the port and
  says EADDRINUSE is the likely cause, rather than being absorbed into sixty
  seconds of polling that would then report the wrong cause.
- **`sweep()` sits behind an ownership check.** If the server the suite started
  exited at any point during the run, teardown refuses to sweep and fails the
  run instead. Whatever holds the branch at that moment is not something the
  suite started, and is not the suite's to empty.

The failure message is the deliverable, not the exception:

```
Port 3100 is already in use — another process holds it, so this run would test
a server it did not start, and sweep a branch it does not own. Stop whatever is
listening on 3100 (`lsof -ti tcp:3100`) and run again.
```

What each situation reports, before and after:

| situation | before | after |
| --- | --- | --- |
| stranger holds the port | 179 passed, exit 0 | fails in `setup()`, names the port, no test runs |
| `next start` dies at spawn | unobserved; 60s poll | fails at once, under 0.2s, names the cause |
| server dies mid-run | swept anyway | teardown refuses to sweep, run fails |
| branch on a refused run | migrated and swept | untouched — the check precedes the migration |

Verified by hand in both directions against the same foreign dev server as the
reproduction: green with 3100 free (14 files, 185 tests, exit 0), red with 3100
held (exit 1, zero tests executed, no migration run).

The four guards are covered by `test/server.test.ts`, which never touches port
3100 — a test that bound, held, or killed the port the suite is currently
running against would be committing the defect it is testing for. Each case
takes an ephemeral port of its own.

## Prevention checklist

- [ ] A readiness check must name the thing it is waiting for. "Something
      answered at this address" is not "the process I started is up"; the two
      agree on every run except the one where it matters. Tie the wait to the
      handle you were given — a pid, a `ChildProcess`, a lease — never to a port.
- [ ] Every process the suite spawns must have `exit` and `error` subscribed
      before it is waited on. A spawned process's death is the cheapest, fastest
      and most specific failure signal available, and discarding it converts a
      one-second, correctly-named failure into a sixty-second, wrongly-named one.
- [ ] Check the precondition where it is knowable, not where it becomes
      painful. Port occupancy is knowable before the spawn; discovering it in a
      poll timeout means the message describes the symptom instead of the cause.
- [ ] Order a setup so that the refusable checks come before the irreversible
      acts. Migrating and truncating a shared branch belong after every
      ownership question is settled, so that a refused run leaves no trace.
- [ ] A destructive teardown must re-establish ownership rather than assume
      setup's. It runs at the greatest distance from the checks that justify it,
      and the state it depends on can lapse in between.
- [ ] A green suite is evidence about the suite. `exit 0` and a plausible pass
      count are the same bytes whether the assertions were pointed at the right
      build or the wrong one; the run has to be able to say which.
- [ ] Where CI's isolation is stronger than a developer machine's, CI cannot be
      the only gate. Single-run concurrency and a clean runner make this class
      of defect structurally invisible there, and local is where the decision to
      open the pull request gets made.

## Related files

- `test/server.ts`
- `test/server.test.ts`
- `test/config.ts`
- `.github/workflows/test.yml`
- `errors/ERR-204-the-test-suite-kept-every-identity-it-invented.md`
- `errors/ERR-208-raising-one-step-found-every-number-copied-out-of-it.md`
