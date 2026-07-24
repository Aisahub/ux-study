# [ERR-204] The test suite kept every identity it ever invented

## Summary

The suite mints a fresh Learner for almost every test and never took one back.
Over the life of the branch that accumulated 72 users, 1,660 sessions, 1,249
attempts, 417 reports, 683 findings and 167 allowlist entries, of which exactly
two rows were real: the wildcard and Chloe, both seeded by migration 0002.

The cost was not storage. It was the people half of the Maintainer dashboard
(#27), the one surface built so that a stalled colleague is noticed before they
quietly disappear. Opened against the test branch it showed a cohort of
seventy-one strangers with names like `learner-014884167c1f@aisahub.com`. A
screen whose entire job is to make one real person stand out cannot do it while
buried in invented ones, so the feature could not be looked at during
development at all — the failure was invisible because it degraded a surface
rather than breaking a test.

## Root cause

Two separate decisions, neither wrong alone.

The suite drives the real application against a real Neon branch — no fake, no
in-memory database, no test-only code path. That is deliberate and worth
keeping. It means every test that signs someone in leaves a row behind.

Isolation was then bought with fresh random addresses rather than with cleanup.
The doc comment atop the Learn overview tests said so outright: "The test branch
persists between runs, so every test works as its own freshly-invented
Learner." Each test could only see its own rows, so each test was correct, and
nobody was accountable for the pile.

The fixture naming had also drifted, which is what makes cleanup-by-prefix a
trap. Four conventions were in the branch at once:

- `learner-<hex>@aisahub.com` and `@gmail.com` — the current style, four files
- `someone@aisahub.com` — a fixed address in `auth`, `audit-page`, `skeleton`
- `arrival-<timestamp>@example.com` — `skeleton.test.ts`
- `view-<hex>@aisahub.com` — from a test that **no longer exists in the tree**

That last one is the evidence that matters. Any rule shaped as a list of known
fixture prefixes was already stale before it was written, because a retired test
leaves rows that no surviving code mentions.

## Reproduction

Before the fix, with the suite green:

```
npm test && npm test
```

Then count what is in the test branch. Every table grows, monotonically, run
over run. Nothing fails; nothing warns; `/en/maintain/learners` on the test
branch gets one row longer for each Learner the last run imagined.

## Solution

The teardown that already existed for the server — the function `setup()`
returns to kill it — now also sweeps the branch:

```ts
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
```

The rule is stated in terms of **what survives**, not what tests create, which
is the only form immune to fixture drift — it swept the orphaned `view-` rows
without knowing they existed. Its first run also cleared the whole backlog, so
no one-off cleanup script had to be written or kept.

Two details that are load-bearing:

- **`added_by = 'seed migration'` cannot be restored by re-running migrations.**
  0002 carries `ON CONFLICT DO NOTHING` and reads as re-runnable, but
  `drizzle-kit migrate` only applies migrations not yet recorded, so on any
  branch that has already run it the re-runnability never fires. Deleting those
  two rows would strand the suite permanently. They are matched precisely for
  that reason, not out of caution.
- **`IS DISTINCT FROM`, not `<>`.** An allowlist entry a test added carries no
  `added_by` at all, and `NULL <> 'seed migration'` evaluates to NULL, which
  deletes nothing. The obvious operator would have left every test-created
  allowlist row in place while looking correct.

Emptying tables outright is safe only because `setup()` already refuses to run
when `DATABASE_URL_TEST` matches the branch that serves Learners. That guard
predates this change and is now doing more work than it was written for.

## Prevention checklist

- [ ] A test that writes to a shared, persistent database owns the rows it
      creates. Fresh random identities buy isolation *within* a run; they are
      not a cleanup strategy and must not be described as one.
- [ ] Clean up by naming what survives, never by listing what to delete. A list
      of fixture prefixes goes stale the moment a test is retired, and its rows
      then belong to nothing.
- [ ] Before relying on a migration to restore a row, check whether it would
      actually re-run. `ON CONFLICT DO NOTHING` describes what happens *if* the
      statement executes, not that it will.
- [ ] Comparing a nullable column against a value needs `IS DISTINCT FROM`.
      `<>` silently spares every NULL row.
- [ ] Symptoms that only degrade a surface still count. This one never turned a
      test red and would not have been found by looking at CI.

### On verifying the fix, which went wrong twice

Both mistakes came from one stray `cd` in an unrelated command. The shell's
working directory persists between tool calls, so every later command ran in
the main checkout instead of the worktree.

- [ ] After changing directory for a one-off query, change back — or use `git -C`
      and absolute paths and never move at all. A shell that silently stays
      moved makes every subsequent verification a lie.
- [ ] The first "green" run was green because it exercised the *unmodified*
      code in the main checkout, while the counts in the database went **up**.
      Read the evidence the change was supposed to produce, not the pass/fail
      line. Tests passing is not proof the change ran.
- [ ] `diff -rq test ../../../test` compared the main checkout to itself and
      reported "identical", which was then used to conclude the worktree was up
      to date. It was one commit behind. A verification whose two sides can
      collapse into the same thing proves nothing — make the command name both
      sides absolutely.
- [ ] `EnterWorktree` branches from `origin/<default>`, not from local HEAD.
      Unpushed commits are absent. Check `git rev-parse HEAD` in both trees
      before treating a worktree as current.

## Related files

- `test/server.ts`
- `test/db.ts`
- `test/learn.test.ts`
- `drizzle/0002_seed-allowlist.sql`
- `app/[lang]/maintain/learners/page.tsx`
