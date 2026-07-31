# [ERR-209] A height copied from a neighbour outlived the neighbour

## Summary

The language switcher and the account pill sat side by side in the top bar at
`42px` and `45.77px`. Four visible pixels apart, on every signed-in page, in
both languages, at every width from `640px` up.

The switcher's segments carried `h-[34px]`. That number was not chosen; it was
measured off the account pill on 2026-07-24 and written down. The commit that
introduced it says so:

> The language switcher stood 36px beside a 42px account pill. The pill's height
> comes from its avatar and its two lines and cannot be dialled, so the switcher
> is the one that gives way: its segments carry a fixed height rather than
> vertical padding.

`34 + 8` of wrapper padding was `42`, and `42` was what the account pill
happened to be that day. On 2026-07-29 `ERR-208` raised the `label` step from
`12px` to `13.5px`. The account pill's second line — the role, `운영자` /
`Maintainer` — grew with it, and the pill went to `45.77px`. The switcher did
not move, because nothing about it referred to the pill.

## Root cause

**The switcher was told the answer instead of the question.**

The decision recorded in the comment is sound and still is: the account pill's
height is set by a `30px` avatar and two lines of text and cannot be dialled, so
on this axis the switcher is the one that gives way. What was implemented was
not that decision. It was the decision's *result on one particular day*,
transcribed as a constant, with the relationship it came from surviving only in
prose.

`ERR-208` named this shape one commit earlier — "a constant computed from a
token is a copy of that token that `grep` cannot find" — and this instance still
went through that sweep untouched. `app/[lang]/language-switcher.tsx` is in
`ERR-208`'s own Related files list: the sweep opened this file, converted its
two `text-[12px]` call sites to `text-label`, and left the `34` beside them.

It got through because it is a step further out than the shape `ERR-208`
described, and the checklist item written against that shape does not reach it:

- `34` is not arithmetic on a token. Re-deriving it needs
  `10 + max(30, 13.5 × 1.25 + 13.5 × 1.4)`, which is the *account pill's* box —
  a different element, in a different file, four lines of Tailwind away.
- Grepping the old value finds nothing. `34` does not contain `12`, and the
  pill's `42` is not written down anywhere either; it was only ever a rendered
  height.
- Nothing on the page reads wrong on its own. Both pills are correctly drawn,
  both are legible, both are the right shape. Only the pair is wrong, and only
  by four pixels, which is under the threshold at which a person reviewing a
  diff of a *type token* would look at a header.

## Reproduction

Signed in, at `1280px`, before the fix:

1. Load `/ko/learn` and run in the console:

   ```js
   const sw = document.querySelector('[aria-current="true"]').parentElement
   const acct = sw.parentElement.querySelector('a[href$="/me"]')
   ;[sw, acct].map((e) => e.getBoundingClientRect().height)
   ```

   Returns `[42, 45.77]`. Their top edges differ by `1.88px` and their bottom
   edges by `1.89px`, so the mismatch is split above and below by the row's
   `items-center` and neither edge lines up.

2. `/en/learn` reproduces identically — this one is not script-dependent, which
   is why the two-script check `ERR-208` added did not catch it either.

3. At `375px` and `320px` the account pill and the sign-out control are both
   `min-h-11` (`44px`) and the switcher is `42px`, so the top bar disagrees with
   itself three ways at the width where there is least room to hide it.

Green suite, silent design detector, and `grep -rn "text-\[[0-9.]*px\]" app lib`
still returning nothing. Every check this repo owns passed.

## Solution

**The switcher takes its height from the row instead of remembering it.**

`self-stretch` on the pill, and its two segments lose `h-[34px]` for
`min-h-[34px]`. The segments are flex children of the pill and already stretch
by default, so with the pill stretched to the flex line the whole control is
whatever the tallest thing in that row turns out to be. The relationship the
comment describes is now the thing that runs.

`34` stays, demoted from a height to a floor, and it is doing a different job
there: on the signed-out page the switcher is alone in the row, has no
neighbour to take a height from, and would otherwise collapse to its own line
box — `13.5 × 1.4 + 8 = 26.9px`, a control small enough to be a defect on its
own. The floor holds the signed-out top bar at exactly the `42px` it renders
today, so this change moves nothing for a visitor who has not signed in.

Measured after, on the rendered page rather than from the source:

- `1280px`, `/ko/learn` and `/en/learn`: both pills `45.77px`, same `top`, same
  `bottom`.
- `375px` and `320px`: switcher, account pill and sign-out all `44px`, and
  `document.documentElement.scrollWidth - window.innerWidth` is `0`.
- Signed out, `/ko/signin`: `42px`, unchanged.

The comment above the pill now records the failure rather than restating the
intention, because the intention was never wrong — only its encoding was.

## Prevention checklist

- [ ] A constant that means "the same as that other element" is a defect the day
      it is written, not the day it drifts. If two boxes must match, make one
      take its size from the other (`self-stretch`, a shared grid track, a
      wrapper that sizes both) rather than writing the number twice. Prose
      recording *why* a number was chosen does not make the number follow.
- [ ] This extends `ERR-208`'s "derived constant" item outward: a value can be
      derived from **another element's rendered box**, not just from a token.
      Grepping the token, and grepping the token's old value, finds neither.
- [ ] When a token changes, re-measure the elements *beside* the ones that
      render at it. `ERR-208` re-measured every box that used `label` and got
      each of them right; nothing asked what sits next to those boxes.
- [ ] Alignment is a property of a pair and cannot be reviewed one element at a
      time. For any row of sibling controls, assert the pair — equal `top` and
      equal `bottom` on the rendered page — not that each looks right alone.
- [ ] A four-pixel mismatch is below what a diff review notices and above what a
      reader notices. Two-script and three-width checks did not catch this one
      because it fails in every script and at every width; breadth of coverage
      is not the same as measuring the right thing.

## Related files

- `app/[lang]/language-switcher.tsx`
- `app/[lang]/layout.tsx`
