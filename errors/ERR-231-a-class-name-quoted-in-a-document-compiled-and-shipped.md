# [ERR-231] A class name quoted in a document compiled and shipped

## Summary

Found on 2026-09-11 while verifying [ERR-230] on production. The deployed
stylesheet was checked for the rule that fix adds, and it was there — alongside
a rule for the coordinate that fix *removes*:

```css
.before\:top-\[44px\]:before { top:44px }   /* the wizard uses this */
.top-\[41px\]                { top:41px }   /* nothing uses this  */
```

`top-[41px]` appears in exactly one file in the repository: the ERR-230
document, which quotes the old value twice while explaining why it was wrong.
Tailwind read the prose, found something shaped like a class name, and compiled
it.

Not a one-off. This repository writes an ERR document for every fix and most of
them name the utility they changed, so every such document has been able to add
dead rules to what Learners download. Removing the discovery took **5,577 bytes
(4.1%)** off the static CSS, and that is the accumulated cost, not one rule's.

## Reproduction

```bash
npx next build
cat $(find .next/static -name '*.css') | grep -o 'top-.41px.'
grep -rl 'top-\[41px\]' app lib     # nothing
grep -rl 'top-\[41px\]' errors      # ERR-230
```

## Root cause

**Tailwind v4 finds class names by looking for strings that look like class
names, in every file it can reach.**

`app/globals.css` opened with a bare `@import "tailwindcss";`, which leaves
automatic source detection on: everything under the project root that is not
ignored or binary. Markdown is neither, so `errors/`, `CONTEXT.md`, `DESIGN.md`
and the rest were all scanned, and a utility written inside backticks is
indistinguishable from one written in a `className`.

It is a leak that only grows. The one thing this repository does after every
fix is write a document naming what changed, which means the mechanism that
records a defect was also the mechanism that added weight to every page.

## Resolution

```css
@import "tailwindcss" source(none);
@source "../app";
@source "../lib";
```

Discovery off, and the two trees that actually render named. Nothing else goes
through Tailwind: the practice pages and the item screens carry their own
semantic classes (`reader-note`, `page-head`) and their own stylesheets, which
is why `content/` is not on the list — verified by grepping it for utility-
shaped classes and finding none.

| | before | after |
| --- | --- | --- |
| static CSS | `136,942 B` | `131,365 B` |

`test/skeleton.test.ts` holds it, in the file that already asserts against the
*served* stylesheet rather than the markup. The canary is the same quotation:
`top-[41px]` stays in ERR-230 for good, appears in no source file, and must not
be defined in the stylesheet. The test also asserts the wizard's own
`before:top-[44px]` **is** defined, so it cannot pass by the stylesheet having
lost its arbitrary-value utilities altogether.

Checked both ways: with `source(none)` removed and the project rebuilt, the
test goes red on exactly that assertion; restored, it is green.

## Prevention

**A tool that reads your files does not know which of them are prose.** The
scanner's rule is "looks like a class name", and documentation about class
names is made of strings that look like class names. Any build step with
automatic discovery — a bundler's entry detection, a test runner's glob, a
type generator's include — is worth asking the same question of: does it reach
files nobody meant it to read?

**Checklist when a build tool discovers its own inputs:**

- [ ] Are the inputs named, or found? Naming them costs three lines and cannot
      widen by accident.
- [ ] Does the project hold prose *about* the thing the tool looks for? Docs
      about CSS, tests about SQL, examples about imports.
- [ ] Was the built artefact ever read, rather than the source? This was found
      by grepping production CSS for a rule that should be there, and noticing
      one that should not.
- [ ] If the scope widens again, does anything fail? A test that cannot go red
      is not holding the rule — rebuild between states to find out, because the
      suite runs against a build and editing the source proves nothing on its
      own.

## Related files

- `app/globals.css` — `source(none)` and the two `@source` lines
- `test/skeleton.test.ts` — the canary, beside the `prefers-color-scheme` assertion
- `errors/ERR-230-the-route-line-ran-three-pixels-above-the-stations-it-joins.md`
  — where the canary lives
