# [ERR-225] Every tab said the platform's name and none said its own

## Summary

Found on 2026-09-10 by a `/ux-audit` pass over the shipped `/ko/learn`. It had
been true of every surface since the language layout was written.

`app/[lang]/layout.tsx` returned `title: 'ux-study'`, and no page overrode it.
Seventeen surfaces in two languages therefore shared one name:

```
/ko/learn              ux-study
/ko/learn/readability  ux-study
/ko/learn/readability/quiz   ux-study
/ko/notes              ux-study
/ko/me                 ux-study
```

A Learner with the board, a Gate Quiz and their notes open had three identical
tabs and had to click to find out which was which. Every bookmark and every
history entry came out under the same name too, so the browser's own way back
to a screen could not name the screen.

Nothing is visible on the page itself, which is why an audit that only reads
the render will not find it — and why it survived a UI this closely reviewed.

## Reproduction

Open any two surfaces in two tabs and read the tab strip.

## Root cause

**A default written as a constant, on the one route segment every page shares.**

Next resolves `title` from the nearest ancestor that sets it. The language
layout set a plain string, which is a complete answer: a page that says nothing
inherits it silently and correctly, so no page was ever wrong and none of them
were right either. There was no failure to notice — only an absence, and an
absence has no symptom on the surface that has it.

## Resolution

The layout now sets a template rather than a constant:

```ts
title: { template: '%s · ux-study', default: 'ux-study' }
```

and each surface exports `generateMetadata` naming itself from the `COPY`
table it already renders its own heading from, so the tab and the `h1` cannot
drift apart. `default` catches the two routes that only ever redirect and never
render a heading.

The screen's name leads and the platform's follows, because a tab strip shows
the front of a title and the front is the half that has to differ.

Metadata runs on its own, before any of the page's own data: it holds no
session, opens no query and calls no redirect. Where a title needs a subject —
a Competency's name, a Stage's number — it is read from the content or from the
route, never from the database. `findings/[findingId]` is the one place this
costs something: the Finding's own words would be a better tab name, and the
route is readable only to a Learner whose Stage has been reached, so the title
is the word `발견` and nothing that belongs to one Finding.

## Prevention

**A defect with no visible symptom needs a check, because review will not find
it.** This one is not in a screenshot, not in a squint render, and not in any
accessibility rule. `test/surfaces.test.ts` now walks six Learner surfaces and
asserts that each names itself and that no two of the six agree.

**Checklist when adding a surface:**

- [ ] Does it export `generateMetadata`, and does the title come from the same
      `COPY` entry as its `h1`?
- [ ] Does the title name the screen first and the platform second?
- [ ] Does it avoid anything the route's own gate has not yet allowed — a
      verdict, another Learner's words, a subject behind a permission check?
- [ ] Is it in the list `test/surfaces.test.ts` walks?

## Related files

- `app/[lang]/layout.tsx` — the template and the default
- `test/surfaces.test.ts` — every surface names itself, and no two agree
- `app/[lang]/audit/[stage]/layout.tsx` — one title for the report's two panels
