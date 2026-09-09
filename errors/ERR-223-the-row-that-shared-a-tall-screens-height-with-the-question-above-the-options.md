# [ERR-223] The row shared a tall screen's height with the question above the options

## Summary

Found on 2026-09-09 by the person reading the shipped screen, not by any check:
"질문과 문항 간에 왜 큰 공백이 있는거야?" It had been in production since
`a2f58db` merged the same day.

The Gate Quiz item card lays the drawn screen down the left and the question
above the options on the right, from a `1200px` window. Measured on
`system-status`, item 1, at `1200px`:

| | before | after |
| --- | --- | --- |
| first row track | `213px` | `90px` |
| question's own height | `90px` | `90px` |
| question to options | `150px` | `26px` |

`26px` is the card's own gap. The other `124px` was empty.

It is not a rounding error or a stray margin: the options sat a sixth of a
screen below the question they belong to, on the one card whose whole job is to
hold a question and its answers together, on a platform whose first Competency
is Visual hierarchy.

## Reproduction

Any item whose screen is taller than its question and options together — every
`sequence` item qualifies, and they are the majority of the drawn pool — at a
window of `1200px` or wider.

```
질문   top 316, height 90
그림   top 316, height 884
보기   top 555          ← 150px below the question
```

## Root cause

**A grid item that spans several rows has its height shared out across the
tracks it spans, and the tracks were implicit.**

```tsx
// the row, as shipped
min-[1200px]:grid-cols-[minmax(0,var(--item-screen-floor))_minmax(400px,1fr)]
min-[1200px]:items-start
```

Three children: the question (column 2, row 1), the screen (column 1, spanning
rows 1–2), the options (column 2, row 2). No `grid-template-rows`, so both rows
are `auto`, and an `auto` track's size is negotiated against everything in it —
including a spanning item. The screen's `884px` is more than the question and
options need, and the surplus is distributed across both tracks rather than
landing in either one. Row 1 grew from `90px` to `213px`; the question was
top-aligned inside it by `items-start`, so the growth appeared underneath it as
a gap.

`items-start` is what made this look handled and was never the relevant lever:
it says where an item sits *inside* its track. It has nothing to say about how
big the track is.

## Resolution

```tsx
min-[1200px]:grid-rows-[min-content_minmax(0,1fr)]
```

`min-content` holds row 1 to exactly the question. `minmax(0,1fr)` gives row 2
everything left over, which is where a tall screen's surplus belongs — beside
the options, not above them. Gap `150px → 26px`; the options rise `123px`.

## Prevention

**A measured coordinate is not a look.** Every width in this arrangement was
checked, and this is the one that was checked *as numbers*: the verification
recorded `question top 316 / options top 718` and read it as "question above
options, correct". The 402px between them was in the reading and went unread,
and the screenshots taken afterwards showed the gap plainly and were used as
evidence that the layout worked rather than looked at. DESIGN.md already asks
for this — "look at the render (faint dividers, clipped labels) before
handoff" — and the render was produced and not looked at.

**Checklist for a multi-row grid where one item spans rows:**

- [ ] Are `grid-template-rows` explicit? An implicit `auto auto` under a
      spanning item is this defect.
- [ ] Is the gap between two adjacent items equal to the container's `gap`?
      Measure the difference, not the two positions.
- [ ] Was the arrangement looked at, at the width where the spanning item is
      tallest — not only at the width where it is shortest? Item 1 of a
      `readability` draw has a `210px` screen and shows no gap at all; the
      defect needs a `sequence` item to appear.

## Related files

- `app/[lang]/learn/[competency]/quiz/[attemptId]/wizard.tsx` — the row
- `DESIGN.md` — the wizard's arrangement, and the three responsive bands
