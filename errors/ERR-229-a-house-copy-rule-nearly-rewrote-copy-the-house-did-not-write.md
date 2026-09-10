# [ERR-229] A house copy rule nearly rewrote copy the house did not write

## Summary

Found on 2026-09-10, partway through applying [ERR-228]'s rule (Korean screen
copy uses no 줄표) to the authored content. An accurate inventory puts the
remaining marks at **250 occurrences in 169 strings**, and the largest single
field is `artefact.ko` with **64** — the narration of the screen a Gate Quiz
item asks a Learner to judge.

That narration is not this platform speaking about itself. It quotes the
fictional product **verbatim**, and in at least one item the mark is the
evidence the question turns on:

```
content/items/form-burden/approver-chosen-before-the-total-is-known.md
  아래 합계 자리에는 줄표가 있습니다.
  … 결재자 드롭다운이 "박서연 — 팀장"으로 바뀌어 있습니다.
  표는 여전히 비어 있고 합계도 여전히 줄표입니다.
```

Two different things, both of which a blanket sweep would have destroyed:

- `"박서연 — 팀장"` is a string the fictional dropdown displays. Changing it
  changes what the Learner is shown.
- `합계 자리에는 줄표가 있습니다` **names the mark as an observation**. The item's
  whole point is that an approver has already been picked while the total is
  still empty, and the dash is how the screen says "empty". Take it out and the
  question loses the fact it is about.

A second item, `trip-dates-typed-again-on-the-third-screen.md`, does the same
thing with the same word.

## Reproduction

```bash
grep -rn "줄표" content/items/
```

## Root cause

**A copy rule was scoped by language rather than by voice.**

The rule was written as "Korean screen copy", and every Korean string in
`content/` looked like Korean screen copy. But this repository holds two
Korean voices, and only one of them is the house's:

- **This platform's voice** — a Competency's objective, a brief, a glossary
  definition, an option's reason. These are the house's words and the rule
  governs them.
- **The specimen's voice** — `screen.ko` and the parts of `artefact.ko` that
  describe or quote it. These are a *defective product's* words, written to be
  judged. A house style rule has no authority over them, and applying one edits
  the exam.

`test/competencies.test.ts` already knew this boundary and says so twice —
screens are excluded from the banned-word sweep because "a fictional product
may lawfully call somebody a 학생 on a screen about a school". The em-dash rule
was written without reading that line.

## Resolution

72 replaced so far, all of them the [ERR-228] shape — a whole sentence hung off
the end of another, becoming a full stop with no word added. None touched a
quoted UI string: the rule requires a Korean sentence ending on both sides of
the mark, and `"박서연 ` is not one. The two items above are untouched, verified
by `git diff --quiet`.

The remaining 175 are held while the boundary is settled, because `artefact.ko`
sits on both sides of it: the same field narrates in the platform's voice and
quotes the specimen's. It needs reading case by case, not a rule.

**What is proposed, and what is open.** The boundary this repository already
draws — the house's voice is in scope, the specimen's is not — is the one to
keep. Whether `artefact.ko`'s narration counts as the house's voice when it is
*describing* a defective screen is the open question, and it is the programme
maintainer's to answer, not a sweep's.

## Prevention

**Scope a copy rule by whose voice it is, never by which language it is in.** A
repository that ships a deliberately defective artefact holds strings that look
exactly like its own and are not. The test file had the boundary written down
and the new rule did not go looking for it.

**Checklist before applying a copy rule across content:**

- [ ] Does this repository contain copy it did not author — a specimen, a
      quotation, a user's own words?
- [ ] Is there already a boundary written down for it? `test/competencies.test.ts`
      excludes `screen` from every other copy rule.
- [ ] Does any exercise's answer turn on the thing being changed? Grep the
      content for the *name* of the mark, not only the mark.
- [ ] Is a field single-voiced? `artefact.ko` is not.

## Related files

- `errors/ERR-228-an-english-writing-habit-punctuated-two-hundred-korean-sentences.md`
- `content/items/form-burden/approver-chosen-before-the-total-is-known.md`
- `content/items/form-burden/trip-dates-typed-again-on-the-third-screen.md`
- `test/competencies.test.ts` — where the boundary was already written down
