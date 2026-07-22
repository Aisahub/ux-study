# [ERR-200] Migrations never reached the development branch, and a green test suite hid it

## Summary

`npm run db:migrate` — the documented way to apply migrations — never saw a
connection string, so migrations only ever reached the **test** branch. Opening
the application in a browser returned a 500 (`relation "allowlist" does not
exist`) while `npm test` reported 2/2 passing.

The two facts were true at the same time, and that combination is the point of
this document.

## Root cause

Two independent decisions met:

1. `drizzle.config.ts` began with `import 'dotenv/config'`, which loads **`.env`**.
   This project has no `.env` — Next.js keeps local secrets in **`.env.local`**.
   `process.env.DATABASE_URL` was therefore `undefined` whenever drizzle-kit was
   invoked from the shell.

2. `test/server.ts` builds its own environment (`{ ...process.env, DATABASE_URL:
   url }`) and passes it to the spawned `drizzle-kit migrate`. Under test the
   value was already present in the child process, so the config file's failure
   to load anything never mattered.

The test path provisions its own environment, which is a deliberate and correct
property — it is what makes migrations reproducible on every run. The cost is
that the suite verifies the application against an environment the suite itself
created, and says nothing about the environment a developer actually uses.

## Reproduction

Before the fix, from a clean checkout with a populated `.env.local`:

1. `npm run db:migrate` → drizzle-kit exits without applying anything; no
   connection string was ever read.
2. `npm run dev`, open `http://localhost:3000` → **500**, server log reads
   `NeonDbError: relation "allowlist" does not exist`.
3. `npm test` → **passes**, because the suite migrates the test branch itself.

## Solution

`drizzle.config.ts` now loads the file the project actually uses, matching what
`test/server.ts` already did:

```ts
import { config } from 'dotenv'
config({ path: '.env.local', quiet: true })
```

The fix carries a hazard that was checked rather than assumed. If `dotenv`
overrode an already-set variable, the suite's `drizzle-kit migrate` would apply
migrations to the **Learner-serving** branch instead of the test branch — and
the suite would still pass, so nothing would surface it. `dotenv` does not
override by default; this was confirmed by presetting a sentinel value and
observing that it survived, not by reading the documentation.

## Prevention checklist

- [ ] When a config file reads environment variables, confirm **which file**
      the loader actually opens. `dotenv/config` means `.env`, which is not the
      file a Next.js project keeps secrets in.
- [ ] A suite that provisions its own environment does not prove the developer
      path works. Open the application in a browser before calling a database
      task done.
- [ ] Before changing where a connection string comes from, check whether the
      change can redirect a test-time migration onto a production branch. Verify
      override behaviour by experiment; a passing suite cannot detect this.
- [ ] Keep the guard in `test/server.ts` that refuses to run when
      `DATABASE_URL_TEST` is absent or equal to `DATABASE_URL`. It is the last
      line of defence for the hazard above.

## Related files

- `drizzle.config.ts`
- `test/server.ts`
- `db/index.ts`
- `.env.local` (untracked)
