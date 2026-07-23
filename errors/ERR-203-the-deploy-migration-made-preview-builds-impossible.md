# [ERR-203] The deploy-time migration made preview builds impossible

## Summary

Wiring `drizzle-kit migrate` into the deploy fixed a real hazard — code
shipping ahead of the schema it expects — and introduced a smaller one in the
same line. The migration ran on *every* Vercel build, and only Production
carries a `DATABASE_URL`. Any push to a branch other than `main` would have
failed at the migrate step, before Next.js was even invoked.

Nothing broke, because no branch was pushed between the two commits. That is
luck, not a mitigation.

## Root cause

`package.json` gained:

```json
"vercel-build": "drizzle-kit migrate && next build"
```

One script, run in two environments with different capabilities. Production has
a database; Preview deliberately does not, and should not — a preview URL is
generated per deployment and cannot be registered as a Google redirect URI, so
nobody can sign in to one, and there is nothing behind the sign-in for a
database to serve. Giving Preview a `DATABASE_URL` would put a live credential
in one more place in exchange for nothing.

The fault is not the missing variable. It is writing a build step as though
"the build" were a single thing, when the platform runs it in environments that
are not equivalent. A step that requires a capability must ask whether it has
it, not assume the richest environment.

The first instinct — and the first thing attempted — was to give Preview a
database so the step would succeed. That is the wrong direction: it treats a
credential as free and satisfies the step rather than questioning it.

## Reproduction

Before the fix, from any branch that is not `main`:

```
git checkout -b anything && git push -u origin anything
```

Vercel starts a Preview build, runs `npm run vercel-build`, and the migrate step
exits non-zero on a missing `DATABASE_URL`. The build fails with an error about
the database, on a deployment that never needed one.

## Solution

The migration is now guarded on the environment Vercel reports:

```json
"vercel-build": "if [ \"$VERCEL_ENV\" = production ]; then drizzle-kit migrate; fi && next build"
```

Three behaviours, all intended:

- **Production, migration succeeds** — `if` returns 0, `next build` runs.
- **Production, migration fails** — `if` returns the failure, `&&` short-circuits,
  the build never happens and the bad deploy never goes live. This is the whole
  point of migrating at build time rather than at startup.
- **Preview** — no branch runs, `if` returns 0, `next build` runs with no
  database anywhere near it.

## Prevention checklist

- [ ] A build script runs in more than one environment. Before adding a step to
      it, name which environments can satisfy that step, and guard it if the
      answer is not "all of them".
- [ ] When a step fails for want of a credential, ask whether the step belongs
      there before supplying the credential. Provisioning is the expensive
      answer and it spreads secrets; a guard is usually the cheap one.
- [ ] Preview deployments of this project cannot authenticate and are not
      expected to. Do not add `DATABASE_URL`, `GOOGLE_CLIENT_ID`, or
      `GOOGLE_CLIENT_SECRET` to the Preview environment to make something
      "work" there.
- [ ] A hazard that has not fired yet is still a defect. This one was invisible
      only because nobody happened to push a branch in the twenty minutes it
      existed.

## Related files

- `package.json`
- `drizzle.config.ts`
