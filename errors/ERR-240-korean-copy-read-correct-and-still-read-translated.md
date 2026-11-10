# [ERR-240] Korean copy read correct and still read translated

## Summary

Found on 2026-11-10, when the owner reported that the Korean interface still
read awkwardly after several register and punctuation passes (#95, #96, #157,
#162, #163). A full reading of every Korean surface, chrome and briefs, by
three `korean-naturalness` passes returned 89 findings. None of them was a
spelling or grammar error, and every check in the suite was green.

The worst of them changed meaning rather than tone:

- All three Self-Audit briefs rendered "write the description *for* the
  person using the page" as `그 페이지를 사용하는 사람이 읽으라고 쓰세요`,
  which tells a Learner the description is addressed to the end user.
- The empty notes page sent Learners to a place between the article and the
  Gate Quiz that has not held the notes since they moved to their own tab on
  2026-08-12. The English was stale in the same way.
- `단계` meant both the Stage and a step of Stage 2's flow inside one brief.
- A Finding nobody had agreed with read `동료 0명이 동의했습니다`.
- Two 줄표 had reached Korean screens again through JSX, the exact route
  ERR-239 described: the reveal's fix line and the board's link text.

## Root cause

Two gaps, one per kind of defect.

1. **Translationese is not a vocabulary problem**, and every Korean check here
   was a vocabulary check: banned marks, banned terms, particle agreement. A
   sentence built in English order with Korean words passes all of them. The
   only thing that has caught this class is a reader, and a reader was run
   only when someone remembered to ask for one.
2. **ERR-239's prevention was a habit, not a check.** It recommended reading
   the rendered page for the 줄표, and nothing in the suite did, so the same
   route shipped two more.

## Resolution

- Every finding with a rewrite was applied across 19 chrome files and the
  three briefs. 보고서 became 리포트 everywhere, 흐름 became 플로우, the step
  sense of 단계 became 화면, and `CONTEXT.md` now spells Attempt, Competency
  and Completion the way the screens already did (시도, 역량, 수료).
- `test/korean.ts` holds a short list of constructions whose rewrite is always
  better (`에 의해`, `되어지다`, `것이 가능하다`, `가지고 있다` and seven
  marketing words). `competencies.test.ts` holds every `ko:` record and every
  Learner-facing content field to it, and five content sentences that already
  carried one were rewritten.
- `surfaces.test.ts` now fetches fourteen Korean surfaces as a submitted
  Maintainer and fails on a 줄표, a 낫표 or a listed construction in the title
  or the visible text. That is the rendered-page check ERR-239 asked for.

## Prevention

- `CONTEXT.md` gains a **Translationese** section. The suite refuses any list
  entry that is not written there, so the rule and the check cannot drift.
- `AGENTS.md` makes the `korean-naturalness` agent a step of landing any
  change to Korean copy, with high and medium findings fixed in the same pull
  request. The mechanical list is deliberately short (`에 대해` and `을 통해`
  are lawful Korean, ERR-229), so the reader is the check for everything else.

## Related files

- `test/korean.ts`, `test/competencies.test.ts`, `test/surfaces.test.ts`
- `CONTEXT.md`, `AGENTS.md`
- `content/briefs/*.md`
- [ERR-229], [ERR-239]
