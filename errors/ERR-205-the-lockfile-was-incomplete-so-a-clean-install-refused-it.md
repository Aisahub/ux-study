# [ERR-205] The lockfile was incomplete, so a clean install refused it

## Summary

The first CI run — the very workflow meant to gate deploys — failed in five
seconds, at `npm ci`, before a single test ran. `package-lock.json` was missing
the entire `node_modules/tsx` subtree that `drizzle-kit@0.25` depends on, and
with it `esbuild@0.28.1` and its per-platform binaries. The lock still
described drizzle-kit's older resolution, `@esbuild-kit/*` on `esbuild@0.18.20`
— the dependency had been upgraded and `node_modules` moved with it, but the
lock was only half-rewritten.

Nothing broke locally, ever, because local development never runs the command
that checks. `npm install` resolves the gap on the fly; `npm ci` compares
against the lock exactly and stops. The defect had been sitting in the repo
across several commits and was invisible until a machine that starts from
nothing was finally asked to build.

It took two tries to fix, because the first fix was pushed without running the
one command that would have proved it. Completing the lock (below) cleared the
"missing" error and surfaced a second, unrelated one underneath it — a
lockfile the strict installer still could not read. Both are recorded here as
the one story they are: the lockfile was wrong, in two different ways, and
neither way was visible to `npm install`.

## Root cause

`npm install` and `npm ci` do not enforce the same thing. `npm install` treats
the lockfile as a strong hint and reconciles it with `package.json` on each run,
writing back what it had to resolve — so a partially-stale lock quietly works
and can even stay stale if the already-installed `node_modules` satisfies the
request. `npm ci` treats the lockfile as the source of truth: it builds the
ideal tree from `package.json`, compares it to the lock, and fails if anything
the tree needs is absent from the lock. The suite's authors run `npm test`
locally, which never calls `npm ci`, so the lock's incompleteness could not
surface on the machine where the work happened.

The half-rewrite itself is the ordinary hazard of upgrading a dependency whose
own dependencies changed shape. `drizzle-kit` moved from `@esbuild-kit/esm-loader`
to `tsx`; the top-level `esbuild` entry was updated to `0.25.12`, but the new
`tsx` node and its nested `esbuild@0.28.1` were never written into the lock. A
lockfile is only a snapshot if it is taken whole.

## Reproduction

On any machine without this project's `node_modules` already populated:

```
rm -rf node_modules && npm ci
```

Before the fix this exits non-zero with `npm error code EUSAGE`,
`Missing: esbuild@0.28.1 from lock file`, and one `Missing: @esbuild/<platform>@0.28.1`
line per target. It never reaches `next build`. `npm install` in the same state
succeeds, which is why the gap was never noticed.

## Solution

Regenerated the lockfile from scratch — `rm -rf node_modules package-lock.json && npm install`
— so it captures the whole current tree, including `tsx@4.23.1` and its
`esbuild@0.28.1`. No declared dependency range in `package.json` changed; the
diff is the transitive tree the lock had never recorded.

That completed lock was still unbuildable by `npm ci`, in a second and separate
way, and pushing it without checking is what turned one round-trip into two.
The regeneration ran under npm 11.7.0, which has a lockfile-generation bug:
where one optional package appears more than once in the tree, a duplicate can
lose its `optional` flag. `vitest`'s nested `esbuild` recorded
`@esbuild/aix-ppc64@0.28.1` and its sibling platform binaries as required
rather than optional, so `npm ci` tried to install an AIX binary on Linux (and
on this arm64 Mac) and exited `EBADPLATFORM`. `npm install` again did not hit
it, because it never installs what the current platform cannot use.

The lock was regenerated once more with `npx npm@10 install`. npm 10 marks
every per-platform `esbuild` package `optional: true`, so `npm ci` skips the
ones that do not match the host. A correct lockfile reads the same under either
npm major — only its *generation* was version-sensitive. `npm ci` and then
`npm test` both pass locally against it.

## Prevention checklist

- [ ] The command that proves a lockfile is `npm ci`, not `npm install`. When a
      dependency is upgraded — or a lockfile is regenerated — run
      `rm -rf node_modules && npm ci` once before committing it. This was
      written after the first fix, and the second fault is exactly what
      skipping it looks like: a regenerated lock pushed on the strength of
      `npm install` alone, still unbuildable.
- [ ] Generate lockfiles with an npm whose major matches CI's, or verify with
      `npm ci` afterwards regardless. npm 11 can write an optional dependency
      as required where it is duplicated in the tree; the result installs fine
      with `npm install` and fails `npm ci` with `EBADPLATFORM` on a foreign
      platform binary. A correct lock is npm-major-agnostic to *read* but not
      to *write*.
- [ ] After bumping a dependency whose sub-dependencies change (a new bundler, a
      new loader), inspect the lock diff for a new subtree, not just a version
      number. A missing subtree is silent locally.
- [ ] A defect that only a clean environment can see is still a defect. The lock
      was wrong for as long as it took anyone to build from nothing, which until
      there was CI was never.

## Related files

- `package-lock.json`
- `.github/workflows/test.yml`
