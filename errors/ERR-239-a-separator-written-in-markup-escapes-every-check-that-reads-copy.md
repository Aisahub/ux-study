# [ERR-239] A separator written in markup escapes every check that reads copy

## Summary

Found on 2026-09-14, during a naturalness review of the Maintainer's content
page. Two 줄표 were reaching a Korean screen from the Maintainer's content page,
and every check this repository has for that mark had passed.

```
app/[lang]/maintain/content/defects/page.tsx
  {copy.stage(stage)} — {copy.noSubject}                    → 3단계 — 아직 …
  {copy.stage(subject.stage)} — {copy.cohortsHeading}       → 1단계 — 같은 페이지 …
```

[ERR-228] rules the mark out of Korean screen copy and `CONTEXT.md` records it.
Neither occurrence is *in* Korean copy: both are JSX, joining two strings that
are themselves clean. The mark only becomes Korean when the page renders.

The second one is worse than the first. It sits in a `<caption class="sr-only">`,
so it reaches nobody's eye and every screen reader.

## Reproduction

```bash
# Both checks pass. Neither sees the mark.
node scan-marks.mjs              # scans inside `ko: { … }` records
npm test -- competencies         # koreanCopy() reads the same records

# The mark is nonetheless on the page.
grep -n '} — {' "app/[lang]/maintain/content/defects/page.tsx"
```

## Root cause

Every check for this mark reads **string literals inside `ko:` records**, because
that is where Korean copy lives. `koreanCopy()` in `test/competencies.test.ts`
brace-matches a `ko: {` block and pulls the quoted runs out of it; the throwaway
`scan-marks.mjs` used during the register pass does the same thing.

A separator typed between two JSX expressions is Korean screen text that is in
no string literal at all. It is assembled at render time out of two clean halves
and a character that belongs to neither, so a checker looking at copy has
nothing to find.

The same blind spot has a second entrance, and this page had walked into it
before: a comment inside a `ko:` record. `koreanCopy()` matches quoted runs, so
an apostrophe in an English comment there (`the Maintainer's other screen`) opens
a literal that runs to the next quote and hands whatever sits between it —
including a 줄표 written in that comment — to the banned-mark check as though it
were copy. That direction produces a **false positive**; this one produces a
**false negative**, and a false negative is the one that ships.

## Resolution

Both marks are now `·`, which the Korean headings on the same page already use
and which reads as a separator in English too, so it stays one spelling rather
than becoming two.

Comments inside the `ko:` record of `app/[lang]/maintain/content/copy.ts` now
carry neither an apostrophe nor a dash, and the record says why, so the next
person reaches for a reword instead of punctuation.

## Prevention

The rule to carry forward is about *where* the mark can be, not where the copy
is: **a Korean screen string is whatever the page renders, not whatever is
quoted in a `ko:` record.** Anything that joins two strings in markup —
a separator, a bullet, a dash standing in for an absent value — is screen copy
and is bound by the same rules.

Two concrete habits follow.

- When markup joins two pieces of copy, put the separator in the copy record or
  use `·`. Never type a 줄표 between two JSX expressions.
- A copy check that reads `ko:` records is a check on copy, not on screens. It
  is worth keeping, and it is not a proof. Read the rendered text when the
  question is what a Korean reader sees — `document.body.innerText.includes('—')`
  on the served page is the check that would have caught both of these, and it
  is what caught them in the end.

## Related files

- `app/[lang]/maintain/content/defects/page.tsx`
- `app/[lang]/maintain/content/copy.ts`
- `test/competencies.test.ts` — `koreanCopy()`
- `CONTEXT.md` — the 줄표 ruling
- [ERR-228], [ERR-229] — the ruling and the sweep that applied it
