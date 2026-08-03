# [ERR-213] The reading measure was written in a unit that cannot measure Korean

## Summary

Every paragraph of Korean prose on the platform wrapped at roughly half the line
length it was designed for. The standing visibility notice on `/learn` — the one
page every Learner lands on — broke after about thirty characters with the board
still empty to its right, and the same was true of every Competency objective,
every Gate Quiz rule, and every explanatory paragraph on the Maintainer surfaces.

`DESIGN.md` names `56ch` as the reading measure and repeats it three times. The
value is a good one for English: the `ch` unit is the advance width of a `0`, so
`56ch` is about 56 English characters, the middle of the 45–75 band. Applied to
Korean it means something else entirely. In Pretendard a `0` is roughly half an
em while Hangul is full-width, so the same declaration renders as **~30 Korean
characters** — under the 35–40 that Korean body copy reads at, and half the line
the number was chosen to give.

Half this platform's Learners read Korean, and the second Stage 1 Competency it
teaches is Readability. The measure was wrong on the majority language, on a
platform that grades people on noticing exactly this.

## Root cause

**A unit was mistaken for the thing it counts.**

`ch` looks like it means "characters" and does not; it means "the width of one
particular glyph". That glyph is a Latin digit, so a value written in `ch` is
implicitly a statement about Latin text, and carries no meaning at all in a
script whose glyphs are twice as wide. The measure was authored once, in one
language, by someone reading it in that language — and the wrong value is
invisible to anyone reading English, because in English it is correct.

The second cause is that the measure was never a token. `DESIGN.md` declared it,
but no `--measure` existed: the number was retyped at nineteen call sites, plus
a `58ch` that this document has never named and that had drifted into four more.
That is the same failure `ERR-208` recorded for the type scale, in a value the
scale-guard grep was never pointed at: a rule that lives only in prose cannot
refuse a variant, and nothing in the repo could see that a second measure had
appeared.

## Reproduction

1. Open `/ko/learn` on a viewport of 1280px signed in as any Learner.
2. Read the grey notice at the foot of the page.

Before: the paragraph is 450px wide and breaks into three lines, the first
ending at `마지막`, with roughly 400px of empty board to its right.
After: 540px, two lines, the first running to `마지막 활동이 얼마나`.

`/en/learn` is unchanged at 450px and three lines, which is the point — the
English measure was never wrong.

## Solution

One token, two values, chosen by the language the page is already declaring:

```css
:root { --measure: 56ch; }
:root:lang(ko) { --measure: 40em; }
```

`em` is the honest unit for Korean, because one em is one Hangul character —
`40em` is 40 characters, the top of the band. Both values are relative to the
text's own size, so a step down the type scale narrows the column with it rather
than pinning it to a pixel count. The swap is a plain `:lang()` rule keyed off
the `lang` attribute the shell already sets per ADR-0008, so no component makes
the decision and no conditional exists in TSX.

Exposed to Tailwind as `--container-measure: var(--measure)` inside
`@theme inline` — `inline` is what makes the utility emit `var(--measure)`
rather than baking a value in, which is what lets `:lang()` reset it — and every
call site now reads `max-w-measure`.

The four `58ch` sites were folded into the same token. `DESIGN.md` never named a
58, so this is a correction toward the written spec rather than a new decision;
it narrows four English intro paragraphs by about 19px.

## Prevention checklist

- [ ] A length that counts characters is written in `em`, not `ch`, unless the
      text it measures is known to be Latin. `ch` measures a `0`; in Korean and
      Chinese it undercounts by about half.
- [ ] `grep -rn "max-w-\[[0-9]*\(ch\|em\)\]" app lib` returns nothing. The
      measure is `max-w-measure` and lives in `globals.css`, like the type scale.
- [ ] A value `DESIGN.md` names as *the* measure has exactly one definition. A
      second spelling that the document does not mention is drift, not a variant.
- [ ] Layout verified in **both** languages before it is called done. A value
      that is correct in English can be wrong in Korean without changing, and
      the reviewer reading English will not see it.

## Related files

- `app/globals.css` — the `--measure` token, the `:lang(ko)` override, and the
  `--container-measure` mapping that exposes `max-w-measure`
- `DESIGN.md` — **The One Measure Rule**, added under Named Rules; the three
  places that hard-coded `56ch` in prose now point at it
- `app/[lang]/learn/page.tsx`, `app/[lang]/learn/[competency]/page.tsx`,
  `app/[lang]/learn/[competency]/quiz/page.tsx`,
  `app/[lang]/learn/[competency]/quiz/[attemptId]/page.tsx`,
  `app/[lang]/learn/[competency]/quiz/[attemptId]/wizard.tsx`,
  `app/[lang]/maintain/content/page.tsx`,
  `app/[lang]/maintain/allowlist/page.tsx`,
  `app/[lang]/maintain/learners/page.tsx` — the 23 converted call sites
- `ERR-208` — the same failure in the type scale: a rule written down but not
  made a token, and the numbers copied out of it
