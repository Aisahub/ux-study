# [ERR-208] Raising one type step found every number copied out of it

## Summary

The `label` step was raised from `12px` to `13.5px` because it carried every
status word, count and chip on the platform and was the hardest type to read at
arm's length — on a product whose second Competency is Readability.

Changing the token moved three of the seventeen places that render at that
step. The rest had copied the number out of it, or had been derived from it and
then written down as a different number:

- Twelve call sites wrote `text-[12px]` by hand and did not move at all.
- `--bottom-bar: 99px` and `min-h-[34px]` in the bottom navigation were both
  arithmetic on the old step (`12 × 1.4 × 2 = 33.6`), recorded as constants with
  the derivation only in a comment.
- `Micro`, the platform's actual type floor at `11px`, had **no token users at
  all**: all three of its call sites wrote `text-[11px]`, so `--text-micro` was
  declared and never read.
- A further 44 sizes across the same four files were still bare `px`, including
  nine button labels set at the browser's default line height — a line box that
  is not any of the eight steps.

`ERR-206` had introduced the scale as a token four weeks earlier and recorded
the intention that steps are "tokens, not numbers retyped at each call site".
That was true of the declaration and false of the build.

## Root cause

**A token only governs the call sites that ask it, and nothing had checked that
they all did.**

`ERR-206` made the wrong value *spellable-but-conspicuous*; it did not make it
unspellable, and it converted the file it was auditing rather than the app. The
remaining 47 bare sizes were invisible to every check in the repo: the type
checker sees a string, the linter sees a string, the design detector reports
zero, and 129 tests pass because not one of them asserts a rendered size.

The second, worse shape is the derived constant. `99` and `34` were not copies
of `12`; they were *results* of it. Grepping the old value finds neither. They
are only discoverable by reading the comment that explains them — which means
the safeguard against them drifting was a person remembering to read prose at
the moment they changed an unrelated file. That is the same failure `ERR-206`
named, one level further out: the arithmetic was documented, not encoded.

A third contributor is narrower and worth naming because it is invisible in
source. `app/[lang]/layout.tsx` wrapped the language switcher and the account
pill in `flex items-center` with no `min-w-0`. A flex item defaults to
`min-width: auto`, so the row refused to shrink below its contents' own minimum
and the pill's `truncate` could never fire. The guard had been missing since the
row was written; at `12px` the contents happened to fit a `320px` viewport, and
at `13.5px` they did not. The size change did not cause this defect, it dated it.

## Reproduction

Signed in, before the fix:

1. **The step that did not move.** Raise `--text-label` to `0.84375rem` and load
   `/ko/learn/readability`. The status line on the overview grows; the three
   chips at the top of the Competency page do not. They are `text-[12px]`.
2. **The derived constant.** As a Maintainer (six navigation marks), load any
   page at `320px`. One-line labels occupy a `34px` box and two-line labels
   `37.8px`, so the six columns no longer agree — the exact inconsistency the
   comment above `min-h-[34px]` promises the reservation prevents.
3. **The floor that stayed.** `grep -rn "text-micro" app` returns only the three
   declaration lines in `app/globals.css`. Every kicker on screen is `11px`,
   below the step that was just raised for being too small.
4. **The row that would not shrink.** At `320px` on any signed-in page, the
   account pill's role line runs `15px` past the right edge and the document
   scrolls horizontally by `30px`.

All four reproduce with the suite green and the design detector silent.

## Solution

**Every type size in `app/` is now a token; the check is that `grep` finds
none.**

```
grep -rn "text-\[[0-9.]*px\]" app lib   # 47 before, 0 after
```

47 conversions, in two classes kept apart on purpose:

- **37 preserved a rendered value exactly** — the call site's size, line height
  and letter spacing already equalled the token's. `text-[25px]
  leading-[1.2] tracking-[-0.015em]` → `text-headline`, and so on.
- **10 moved one.** Nine button and link labels were `text-[16px] font-bold`
  with no line height at all, so they rendered at the browser's `normal`
  (`24px`) — not a step. They are `title` (`22.4px`) now. The Gate Quiz station
  label is `label`, the step this system already assigns to station meta.

`label` is `13.5px` and `micro` is `13.5px`. The scale is still eight named
steps but now spans **five** distinct sizes — 44, 34, 25, 16, 13.5 — with
`Body-sm`, `Label` and `Micro` separated by weight, tracking and case alone,
exactly as `Title` and `Body` have always been separated by weight at `16px`.

The derived constants are now derived in the comment that carries them and were
re-measured rather than recomputed: `min-h-[38px]` (`13.5 × 1.4 × 2 = 37.8`),
and `--bottom-bar` stays at `99px` — verified on a seeded six-mark Maintainer at
`320 / 360 / 375px`, all six label boxes uniform at `38px`, nothing clipped,
`2px` of slack. The bar did **not** need widening; an arithmetic-only reading
said it did, because it treated a `min-height` inside a `line-clamp-2` box as if
it were a fixed height.

`min-w-0` added to the header's trailing group, so the account pill truncates
instead of the row overflowing.

DESIGN.md is corrected in three places where it had never matched the build:
the `Chips` entry specified `12.5px/600` — a size that is not a step and a
weight the Two Weights Rule says does not exist here — and the `Label` and
`Micro` entries now carry their new values with the reason and the date.

## Prevention checklist

- [ ] Before raising a token, `grep` for its **current rendered value** as a
      literal, not just for the token name. `text-[12px]` is the same decision
      as `text-label` and neither the compiler nor the linter knows it.
- [ ] A constant computed from a token is a copy of that token that `grep`
      cannot find. Put the arithmetic in the comment beside it *and* re-measure
      it on the rendered page when the token moves — `99` and `34` both came
      from `12`, and neither contains a `12`.
- [ ] A token with zero users is not adopted, it is decoration. `--text-micro`
      was declared by `ERR-206` and read by nothing for four weeks. Check
      adoption per step, not per file.
- [ ] Layout conclusions must be measured on the rendered page, not derived from
      the source. Two findings in the review of this change were wrong for that
      reason: a `min-height` was read as a fixed height, and a span with no
      weight class was read as regular when it inherits `font-bold` from its
      parent. Both were confidently argued and both are refuted by one
      `getComputedStyle` call.
- [ ] Any flex row whose children truncate needs `min-w-0` on the row. Without
      it `min-width: auto` silently defeats every `truncate` inside, and the
      bug stays latent until content grows.
- [ ] Raising a step is a two-script, three-width check. Verify at `320`, `375`
      and `768` in **both** Korean and English before calling it done; the
      switcher wrap and the `320px` overflow appeared in one script only.

## Related files

- `app/globals.css`
- `DESIGN.md`
- `app/[lang]/layout.tsx`
- `app/[lang]/nav-rail.tsx`
- `app/[lang]/language-switcher.tsx`
- `app/[lang]/learn/[competency]/page.tsx`
- `app/[lang]/learn/[competency]/quiz/page.tsx`
- `app/[lang]/learn/[competency]/quiz/[attemptId]/page.tsx`
- `app/[lang]/learn/[competency]/quiz/[attemptId]/wizard.tsx`
- `app/[lang]/learn/[competency]/quiz/[attemptId]/screen.tsx`
