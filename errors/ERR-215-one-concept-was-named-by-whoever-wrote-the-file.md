# [ERR-215] One concept was named by whoever wrote the file

## Summary

Across the Korean surfaces, one idea had two or three names. A Learner opened
`자가 점검 리포트` on `/learn`, met the same artefact as `셀프 감사 보고서` on
their own page, and saw it called `보고서` in the drawer that writes it. They
were taught to record a `발견` in the Competency articles and then handed a
drawer whose every label said `Finding`. Twenty-odd such splits, none of them a
wrong word — each spelling was defensible where it stood.

Three of the splits contradicted `CONTEXT.md` outright:

- `Finding` is defined there as `발견`, and 24 Korean strings said `Finding`.
- `Maintainer` is `운영자`, with `admin` listed under `_Avoid_`; two surfaces
  said `프로그램 관리자`.
- `heuristic` is reserved for Nielsen's ten specifically; a Competency called
  one of the ten `이 원칙`, which the same line reserves for a UX Principle.

The `감사` split cost more than a name. `감사` is 監査 — the accounting sense —
and a homophone of 感謝. `감사가 열립니다` reads first as *thanks are opening*,
on a card already headed `자가 점검`.

Three items also leaked their answer. In each, the correct option's explanation
was the only one written in 해요체 while its three distractors were 합니다체 —
the answer was visible from the shape of the sentence, without reading it.
`ADR-0006` requires an item to test the Competency rather than the reading of
its own options.

## Root cause

**No authority was consulted at the moment of writing, and none was reachable.**

`CONTEXT.md` is the project glossary and it says so, but it is a document about
*this project's* vocabulary — Learner, Competency, Attempt. The words that
drifted are ordinary ones: control, form, label, the foot of a screen. Nothing
said where those were decided, so each author decided again, correctly, in
isolation. The result is not a mistake anyone made; it is a decision nobody was
in a position to make once.

The English side did not drift, and the reason is instructive: English copy was
written into an existing string table beside its siblings, where the previous
choice was on screen. Korean was written as the second half of a pair, one file
at a time, with the *English* in view rather than the other Korean.

The register leaks have the same shape. Each item's four options were written
together in English and are parallel there. Korean was written per option, so
the parallelism was never a thing anyone looked at.

## Reproduction

```
grep -rh "감사\|점검" content app --include=*.md --include=*.tsx | grep "[가-힣]"
```

Before this change: ten `감사` against five `점검`, for one action.

For the leak, read only the endings of an item's four Korean explanations —
`content/items/perceived-clickability/remove-hiding-as-plain-text.md` before
this change ends the correct one in `~차림으로요` and the other three in
`~습니다`.

## Solution

Every split resolved one way, recorded in a new **Learner-facing Korean**
section of `CONTEXT.md` so the next author has something to consult. The rule
applied, in order:

1. an existing `CONTEXT.md` entry, where one speaks;
2. otherwise the spelling already used most, counted over Korean-bearing lines
   with screens excluded;
3. except where the majority word means something else to a Korean reader
   first — `평문` is cryptographic plaintext, `감사` is an audit of accounts.
   Both departures are named in the document rather than applied quietly.

Two apparent splits were left alone because they are not splits:
`전체 역량 보기` / `학습 개요로` render two different English labels, and
`사용성 조사` renders `a usability study`, not the Competency's name. Checking
the English sibling is what distinguished them from the rest.

## Prevention checklist

- [ ] Before naming something in Korean copy, read the **Learner-facing
      Korean** section of `CONTEXT.md`. Add to it when the answer is not there.
- [ ] A split in the Korean is only a defect if the English sibling does not
      have it too. Check before unifying.
- [ ] Write an item's four options as a set. If one is shaped differently from
      the other three, that shape is the answer.
- [ ] Prefer the plain Korean word over the loanword *unless* the loanword is
      already the majority — and never when the plain word is a homophone of
      something louder.

## Related files

- `CONTEXT.md` — the new **Learner-facing Korean** section
- `app/[lang]/**` — `Finding` → `발견`, `감사` → `점검`, `운영자`
- `content/items/**`, `content/glossary/**`, `content/competencies/**`
- `ERR-214` — the structural half of the same audit
