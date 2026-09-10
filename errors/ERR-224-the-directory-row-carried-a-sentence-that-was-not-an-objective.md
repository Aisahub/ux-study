# [ERR-224] The directory row carried a sentence that was not an objective

## Summary

Found on 2026-09-10 by a `/ux-audit` pass over the shipped `/ko/learn`, not by
any check. It had been true since the Learn overview first rendered an
objective.

The Learn overview lists thirteen peers and exists so a Learner can pick one.
Six of the twelve Competency objectives end in a sentence that names no action
at all — it draws the boundary with the neighbouring Competency:

```
error-handling  여기서 다루는 것은 무언가 잘못됐을 때의 답변이다.
                아무것도 잘못되지 않은 길에서 치르는 비용은 폼 부담의 몫이다.
form-burden     이것은 아무것도 잘못되지 않은 길에서 치르는 비용이다.
                무언가 잘못됐을 때 인터페이스가 하는 말은 오류 처리의 몫이다.
```

Six rows carried that tail and seven did not, so a page whose whole job is
comparison set its rows at three and a half times one another's length:

| | before | after |
| --- | --- | --- |
| description length, ko | `70–243자` | `70–214자` |
| description length, en | `107–473` chars | `107–390` chars |
| page height, 1280px | `3352px` | `3198px` |
| page height, 390px | `7093px` | `6758px` |

## Reproduction

`/ko/learn` or `/en/learn`, any Learner. Read the `오류 처리` row against the
`가독성` row two above it: one is a single line, the other four, and the extra
three say where this Competency stops rather than what it trains.

## Root cause

**One field was doing two jobs, and only one of them was written down.**

`Competency.objective` is documented as "What the Learner can be seen to do
afterwards — an observable action, never knowledge held". Two surfaces print
it: the Competency page under `마치고 나면 할 수 있는 것`, where a boundary
sentence is exactly what a Learner who has already chosen wants; and the
directory row, where it is prose in the way of a choice.

Because the second surface never asked for anything narrower, the boundary
prose was written into the objective itself — which is knowledge held, the one
thing the field's own comment forbids. Nothing checked it, and DESIGN.md's
`Body-sm` step names its use as "a row's **one-line** objective", so the step
was sized for a line and shipped a paragraph.

## Resolution

`directoryLine()` in `app/[lang]/learn/page.tsx`: the row prints the
objective's first sentence, the Competency page keeps all of it. An objective
with no sentence end inside it is returned untouched rather than cut
mid-clause.

The cut is by sentence and never by em-dash, and that limit is the reason it is
safe. Five objectives spend an em-dash on a trailing list of examples, which
belongs to the claim; `testing-with-real-users` spends its two on a
mid-sentence aside, and cutting there would leave `계획을 읽고` — an
incomplete clause. A rule the content does not uniformly support is not a rule.

**This does not close the finding.** Two objectives are single sentences of
`214자` and `243자`, and the longest sentence on the board is unchanged at 59
units against a threshold of 40. What is left is content — rewriting an
objective in two languages — and is not a change the renderer can make.

## Prevention

**A field with two readers needs both of them written into its comment.** The
objective's comment describes what the field is for and names no surface. Both
its readers were free to assume theirs was the one it was written for, and the
directory's silence is what let boundary prose accumulate in a field whose own
first line forbids it.

**Checklist for copy that more than one surface prints:**

- [ ] Does the field's comment name every surface that prints it, and what each
      one needs from it?
- [ ] On a surface that lists peers, are the entries within about twice one
      another's length? A three-and-a-half-times spread is not a style; it is
      the reader being asked to compare unlike things.
- [ ] Does a step's documented use ("a row's one-line objective") still
      describe what the build puts in it?

## Related files

- `app/[lang]/learn/page.tsx` — `directoryLine()` and the row
- `app/[lang]/learn/[competency]/page.tsx` — where the whole objective stays
- `lib/content.ts` — `Competency.objective` and its comment
- `DESIGN.md` — the `Body-sm` step
- `test/learn.test.ts` — the claim is on the row, the tail is not, the
  Competency page has both
