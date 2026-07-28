# [ERR-206] The design system could be read but not enforced

## Summary

An audit of the Learn overview found six drifts from DESIGN.md that had all
shipped green: 129 tests passing, the mechanical design detector reporting
nothing, and every one of them visible on the page.

- A ninth type step, `11px/400/1.7`, in the standing visibility notice — a size
  the system does not have, on the most consequential sentence on the page.
- The numbered badge sitting **33px** below the title it numbers between
  `640px` and roughly `1000px`, and **44px** below it on the one row whose
  objective wraps to four lines. The offset moved with content length, so the
  column had no baseline at all.
- The first Competency starting at `y=828` on a `390×844` phone against a fold
  at `745px` — the three Stage cards spent `446px`, 53% of the viewport, to say
  Stage 1 is open and Stages 2 and 3 are not written yet. A Learner's first
  screen contained nothing they could do.
- A Competency name that looked like a `44px` target and answered `22.4px`.
- The `reports` table read twice per request, by two server components that
  cannot see each other.
- A `6px` dot stuck to the corner of the in-progress badge — a second
  vocabulary for a state the Gate Quiz doorstep already drew as a partial fill.

Four of the six are defects this platform's own Stage 1 teaches Learners to
find: visual hierarchy, readability, consistency, perceived clickability. One
per Competency. The first product principle says a defect shipped here is not
embarrassing but disproof; this is the batch that proved the principle needed
a mechanism behind it.

## Root cause

**The system was prose, and prose cannot refuse anything.**

Colour, radius, shadow and the breakpoint were real tokens — `--color-oxblood`,
`--radius-card`, `--shadow-card`, `--breakpoint-wide` — declared once in
`app/globals.css` and read through utilities. Type was not. Every step was an
arbitrary value retyped at the point of use:

```tsx
<h1 className="font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em]">
<p className="mt-1 text-[13.5px] leading-[1.55] text-ink-2">
<p className="mt-3.5 px-2 text-[11px] leading-[1.7]">   // <- the ninth step
```

83 such call sites across 9 files. Nothing in the build could tell the third
line from the first two, because to the build they are all the same kind of
thing: a number someone typed. The rule that was supposed to stop it read:

> **The Seven Steps Rule.** Every piece of type on every screen is one of the
> seven steps above.

It listed eight. A rule whose own name miscounts the thing it governs is not
being checked by anyone either, and the step it existed to prevent had already
shipped.

The same shape explains the rest. `sm:items-center` on a three-column row is
correct while the columns are near-equal height and wrong the moment one wraps
— but "wrong" here is a rendered relationship, not a value, so no token would
have caught it and no test asserted it. `min-h-11` on the heading rather than
on the link inside it is `44px` of layout that is not `44px` of target, and the
two are indistinguishable in source. The dot was drawn without checking what
the doorstep already drew for the same state, because nothing linked them.

The common cause is not carelessness at any one line. It is that **the only
place these rules existed was a document a person had to remember**, and the
one automated check in the repo — the design detector — reports zero on all six
because none of them is a mechanical pattern. Every one needs either a token
that makes the wrong value unspellable, or a pair of eyes on the rendered page
at the width where it breaks.

## Reproduction

Signed in, on the Learn overview, before the fix:

1. **The ninth step and the measure.** At `1280px`, read the notice at the foot
   of the page. It is `11px` against `13.5px` everywhere else, and runs the
   full `880px` of the board — about 160 characters per line, on the page whose
   second Competency is Readability.
2. **The detached badge.** Drag the window to `700px`. `01`–`04` sit level with
   the *second line* of each objective, not with the title. Row `04`, whose
   objective wraps to four lines, sits lower than the other three.
3. **The empty first screen.** At `390×844`, load and do not scroll. Three
   Stage cards fill the screen; `Programme contents` and every Competency are
   below the fold, behind the `99px` bottom bar.
4. **The 22px target.** At any width, aim at the bottom half of a Competency
   name. Nothing happens — the `44px` row is the heading, the target is the
   text.
5. **The double read.** Load any Learner surface with query logging on. The
   `reports` table is selected twice: once by `progressFor`, once by
   `PlatformNav`.

All five reproduce with the suite green.

## Solution

**The scale is now a token, and it is in `rem`.** The eight steps live once in
`app/globals.css` as `--text-display` … `--text-micro`, each carrying its own
size, line height and letter spacing:

```css
--text-body-sm: 0.84375rem; /* 13.5px */
--text-body-sm--line-height: 1.55;
--text-body-sm--letter-spacing: -0.008em;
```

`text-body-sm` is now spellable and `text-[11px]` is now conspicuous. Weight
stays an explicit `font-bold` so the token and the utility never fight over
which declaration wins.

`rem` rather than `px` is the second half. At the browser default `1rem` is
`16px` and every step renders at exactly the pixel size the system already
specified — verified: `44 / 16 / 16 / 13.5 / 13.5` before and after. At a
`20px` root the page answers with `55 / 20 / 20 / 16.875 / 16.875`, where
before it did not move at all. Accessibility is a Stage 3 Competency here, and
a scale nailed to `px` ignores the one accessibility preference a reader sets
before they ever arrive.

The rest, each fixed at its own level:

- `sm:items-start` on both directory rows. Measured after: badge-to-title
  offset `0` on all four rows, at every objective length.
- The Stage strip is three cards in a row from `sm` and three rows inside one
  card below it. `446px → 239px`; the first Competency's title now sits above
  the fold on a `390×844` phone.
- The `44px` moved from the heading onto the link: `117.7×22.4 → 71×44`.
- `reportFor` wrapped in React's `cache`, shared by the page and the
  navigation.
- The dot is gone; in-progress is an oxblood ring with its base thickened to
  `5px`, so the mark reads as filling from the bottom and says its state with
  its own shape rather than by wearing a second object.
- The notice is `text-body-sm` at `max-w-[56ch]`, full ink.

DESIGN.md gained the rules the build had been following without them —
`The Fixed Scale Rule`, `The Reader's Size Rule`, `The Row Action Exception`,
`The Stage Strip Rule`, `The Target Is The Link Rule`, `The Filling Mark Rule`
— and the miscount in the old rule's name is corrected in place, with the
reason it mattered.

One test asserted `aria-label="Programme stages"`, the mechanism rather than
the guarantee. It now asserts the labelling relationship, so the section is
still required to be named and still required to hold nothing interactive.

## Prevention checklist

- [ ] A design rule that only exists in prose will be broken. If a value is
      enumerable — sizes, spacings, radii, shadows — put it in `@theme` and let
      the wrong value be unspellable. Reserve the document for the rules that
      cannot be encoded.
- [ ] Before writing a size, a mark, or a state treatment, look for where this
      product already draws that thing. The dot and the doorstep's partial fill
      were two vocabularies for one state, invented four weeks apart in the
      same repo.
- [ ] `items-center` across columns is a bet that they stay the same height.
      Check it against the longest real content, not the shortest.
- [ ] A row height is not a target size. Put `min-h-11` on the element that
      answers the tap, and measure the rendered box rather than reading the
      class.
- [ ] Load the primary mobile surface and do not scroll. If the first screen
      carries no action, orientation has eaten the work — on a self-paced
      programme where drop-out is the failure mode, that is a defect and not a
      layout preference.
- [ ] The design detector reporting zero is not evidence of quality. None of
      the six findings here is a mechanical pattern. Inspect the render at the
      band where content length changes, in both scripts.
- [ ] Two server components asking the same question in one request will each
      ask the database. Wrap the shared read in `cache` when a surface is
      `force-dynamic`.

## Related files

- `app/globals.css`
- `app/[lang]/learn/page.tsx`
- `app/[lang]/layout.tsx`
- `app/[lang]/nav-rail.tsx`
- `app/[lang]/language-switcher.tsx`
- `app/[lang]/platform-nav.tsx`
- `lib/progress.ts`
- `test/learn.test.ts`
- `DESIGN.md`
