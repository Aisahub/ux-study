# [ERR-226] A rendering rule was reached for where the defect was in the content

## Summary

The other half of [ERR-224], and the reason there is a second document: the
first pass fixed the surface and left the measurement exactly where it found
it.

ERR-224 measured a Learn overview whose rows ran three and a half times one
another's length, and shipped `directoryLine()` — the row prints the
objective's first sentence. It was a correct change and it was verified. What
it did to the number that named the defect:

| | before | after ERR-224 | after this |
| --- | --- | --- | --- |
| longest sentence, ko | 59 units | **59 units** | 36 units |
| longest sentence, en | 80 units | **80 units** | 37 units |
| row length, ko | `70–243자` | `70–214자` | `51–122자` |
| row length, en | `107–473` | `107–390` | `93–211` |
| spread, ko | 3.5× | 3.1× | 2.4× |

The threshold the finding was written against is `longestSentence > 40`, and
after the fix it had not moved by one unit in either language.

## Reproduction

Read the Resolution section of ERR-224. It says so itself — "This does not
close the finding" — which is the honest half. The unhonest half would have
been shipping it and reporting the finding fixed.

## Root cause

**A rendering rule can only choose between sentences that exist.**

Four objectives carried their examples *inside* the claim, behind an em-dash or
a colon:

```
…계획을 읽고 — 실제로 소리 내어 전달될 과제 문장, … — 그 계획이 … 찾아낼 수
있다: 누를 컨트롤을 이름으로 알려 주는 과제, …
```

One sentence, 214자. `directoryLine()` cuts at a sentence end; there is no
sentence end to cut at, so the whole thing is the row. The rule was doing
exactly what it was written to do.

Reaching for the renderer first was the mistake, and it is a tempting one: a
renderer is the half a developer owns outright, and the content is somebody
else's writing. But the defect — a claim and its examples welded into one
sentence — lived in the content, and no rule over that content could take it
out.

## Resolution

The four objectives are re-cut so the claim is one sentence and the examples
are the next. **No word is removed and no wording is changed**: the em-dash or
colon becomes a full stop, and the new sentence takes the connective it needs
(`… 그 인원을 읽는다`, `그 지점은 …다`, `그런 일을 만드는 것은 …이다`,
`그런 말이란 …다`; see the reviewer's note below for how three of those reached
their shipped form). Everything the objective said, it still says, and the
Competency page still prints all of it.

The row therefore shortens through the mechanism ERR-224 already shipped,
which is the sign the two halves belong to one fix.

`test/competencies.test.ts` now holds the shape: an objective's opening
sentence stays under 40 units, which is the line the repository's own ux-audit
checklist draws (`.claude/skills/ux-audit/references/checklist.md`). It fails
on three of the eight strings as they stood before this change, so it is not a
test that cannot go red.

Corrected in passing, inside a sentence being re-cut anyway:
`누를 컨트롤를` → `누를 컨트롤을`.

**Read by a Korean reader before merge, and three of the five connectives came
back.** The grammar was sound in all five, and the fault was one an LLM writing
Korean makes and does not hear:

- `읽는 것은 … 그 인원이다` / `찾는 자리는 … 명단이다` took the English
  pseudo-cleft a phrase at a time, and the copula then welded a thing to a
  person and a place to a list. The em-dash had held the same items loosely, as
  apposition, which hid the clash. Replaced by predicates the author's own voice
  uses — `… 그 인원을 읽는다. … 명단을 찾아낸다.` The English had the same
  stiffness and became `The plan says three things: … Look for …`.
- `그런 일이란 … 컨트롤이다` turned a list of examples into a closed definition
  and equated work with a value. Now `그런 일을 만드는 것은 … 컨트롤이다`.
- `어긋나는 지점은` repeated the previous sentence's whole modifier. Now `그 지점은`.

`그런 말이란 … 약어다` was left exactly as written: there the copula defines
rather than equates, and the reviewer's instruction was to ship the author's
shape rather than an improvement on it.

## Prevention

**When the measurement that named a defect does not move, the fix addressed a
different quantity.** Page height fell 5% and the spread narrowed, both real,
and neither was the finding. Report the number the finding was written against,
before and after, and read it before calling anything closed — a fix that
improves a neighbouring quantity is the easiest kind to mistake for a fix.

**Checklist before closing a finding:**

- [ ] Is the metric in the finding's own statement re-measured, not a related
      one?
- [ ] If it did not move, is that stated in the commit and the report, in those
      words?
- [ ] Does the defect live in the layer being changed? A rule over content
      cannot remove something the content does not separate.
- [ ] Is there a guard that fails on the text as it stood before?

## Related files

- `errors/ERR-224-the-directory-row-carried-a-sentence-that-was-not-an-objective.md`
- `content/competencies/{testing-with-real-users,mental-model-mismatch,form-burden,jargon}.md`
- `test/competencies.test.ts` — the 40-unit ceiling on an objective's claim
- `app/[lang]/learn/page.tsx` — `directoryLine()`, unchanged by this
