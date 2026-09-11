# [ERR-230] The route line ran three pixels above the stations it joins

## Summary

Found on 2026-09-11 by the person reading a shipped Gate Quiz screen, not by
any check: "점이 원 중앙에 위치해야 함". It had been true since the wizard's
station line was written.

The Gate Quiz draws its items as stations on a line. Measured on
`system-status`, item 2 of five, at `1280px`:

| | before | after |
| --- | --- | --- |
| station mark's centre | `46px` | `46px` |
| connector line's centre | `43px` | `46px` |

Three pixels, and on a `24px` mark that is a quarter of its radius. The line
met every ring above the middle, and the dotted track's first dot — which
starts at the previous station's centre — sat on the current station's upper
edge instead of behind its middle.

It is loudest while the pointer is on the station: hover tints the mark's white
centre, and the stray dot then reads as a badly-placed dot *inside* the ring,
which is how it was reported.

## Reproduction

Any Gate Quiz with an open attempt, any item but the first. Zoom to 400%.

```
mark   top 34 + 24/2  → centre 46
line   top 41 + 4/2   → centre 43
```

## Root cause

**Three numbers derived from each other, and only one of them written down.**

```tsx
<div className="relative pt-[34px] …">          // the station sits 34px down
  …
  <span className="… size-6 rounded-full …" />  // and is 24px across
```

so a mark's centre is `34 + 12 = 46`. The connector is a `4px` rule positioned
from the same top edge, and it was set at `top-[41px]`, which centres it on
`43`. Nothing in the file said 46, so nothing said 41 was wrong; the two were
tuned by eye, separately, and the line landed a little high.

It is invisible at 100% and it survives a careful review, because a line
crossing a ring three pixels high still reads as a line crossing a ring. What
made it visible was a Learner looking closely at the one place the page puts a
"현재 위치" pointer, which is exactly where the eye is sent.

## Resolution

`TRACK` and `TRACK_AHEAD`: `top-[41px]` → `top-[44px]`, which is `46 - 4/2`.
Both marks' states are the same geometry, so the answered and unanswered rings
are both centred now, and the dotted track's first dot falls behind the middle
of the ring rather than on its edge.

The comment above the two constants now carries the arithmetic, so that moving
`pt-[34px]` or `size-6` shows up as a number that has to move with them rather
than as a line that drifts.

## Prevention

**A coordinate derived from two others is a defect waiting for one of them to
change.** Neither `34` nor `24` appears near `41`, and the only thing tying
them together was somebody's eye at the moment it was written.

**Checklist for a rule, a connector or a caret placed against another element:**

- [ ] Is its position written as the arithmetic that produces it, in a comment
      or in the code, rather than as a tuned constant?
- [ ] Was it checked at 400%? Three pixels is invisible at 100% and obvious at
      four times that.
- [ ] Does it hold in every state of the thing it points at — answered and
      unanswered, hovered and not?
- [ ] If the element it aligns to changes size or offset, does anything fail?

## Related files

- `app/[lang]/learn/[competency]/quiz/[attemptId]/wizard.tsx` — `TRACK`,
  `TRACK_AHEAD`, and the station mark they are centred on
