# [ERR-211] The only way into a Competency was a hover state

## Summary

On the Learn overview, the Competency page was reachable from its row through
exactly one target: the Competency's name, set as a link with
`underline-offset-4 hover:underline`. The underline exists only under a cursor.

A phone has no cursor. On touch, the row rendered a heading, a description, a
status line, and one oxblood pill reading `관문 퀴즈 열기` — and the pill was
the only thing on the row that looked pressable. Learners were reported not
knowing the Competency page existed.

The second-order effect is worse than the missing page. The one visible action
on the directory jumped straight to the assessment, past the objective, the
pre-reading questions and the source article — the three things `PRODUCT.md`
says this platform is built to scaffold. The row was quietly recommending that
the reading be skipped.

## Root cause

**The affordance was spent entirely on a state that half the platform cannot
enter.**

`hover:underline` is not a weak signal; on a desktop it is a good one. The error
is that it was the *only* signal. Nothing about the link said "link" at rest:
it was ink-coloured, at the `title` step, sitting where a heading sits, in a
system whose links are otherwise oxblood. Strip the hover and what remains is a
heading — which is exactly what a touch device renders, permanently.

`DESIGN.md`'s Studio Board Rule had already specified the parts of this row:

> Each open Competency gets one white task panel with a Learning Objective,
> status, Attempt count, **Competency link**, and separate Gate Quiz action.

So the link was not forgotten in the design; it was specified, built, and then
built in a way that only one input device could see. The document names the
part, not its visibility, and nothing checked the difference.

The platform teaches this defect. Perceived clickability is a Stage 1
Competency here. The Learn overview was failing its own curriculum on the row
that lists it.

## Reproduction

1. Sign in as a Learner and open `/ko/learn` on a touch device, or in a desktop
   browser with device emulation and hover disabled.
2. Look at any Competency row. The name renders as plain ink text with no
   underline, no colour, and no other affordance.
3. The only element that reads as pressable is the oxblood pill, which navigates
   to `/ko/learn/<competency>/quiz`.
4. There is no visible route to `/ko/learn/<competency>` from this page.

## Solution

A second way in, worded for the state the row already reports, placed to the
left of the quiz pill:

- `시작 전` → `시작하기 →`
- `진행 중` → `이어서 하기 →`
- `통과` → `복습하기 →`

It is a **link and not a second button**. `DESIGN.md` allows one repeated
primary button per directory row and says never alongside a second
differently-weighted one; oxblood at the `label` step is what this system
already makes links out of. The arrow is what makes it read as a way in rather
than as a word.

The label varies per row while the button does not, and that is the right way
round: the Row Action Exception is about the repeated *action*, and this column
already varies per row — the status and the attempt count are the two things in
it that do.

### The second defect, found while verifying the first

Laid out as a row, the two labels starved the column beside them. The
description cell is `minmax(0,1fr)`, whose `0` minimum means it yields rather
than pushing back: on a `560px` card the English objective measured **93px**
wide and ran to twelve lines of ribbon — on the row whose own Competency is
Readability.

The fix is a container query, not a viewport breakpoint. `DESIGN.md` allows
three viewport bands and no fourth, and says a component with a width of its own
asks the container it stands in. The card carries `@container`; the link sits
beside the pill from `@min-[780px]` and stacks above it below that, where the
column is the button's width again — what it was before the link existed.

`780px` is where the description still has ~390px at the moment the row forms,
measured on the English labels, which are the wider pair.

## Prevention checklist

- [ ] A new interactive element must be legible as interactive **at rest**.
      `hover:`, `focus:` and `group-hover:` are additions to an affordance,
      never the whole of it. Ask what the element looks like with the cursor
      removed, because that is what every phone renders.
- [ ] When `DESIGN.md` names a part of a component ("Competency link"), check
      the built part is *visible*, not merely present in the DOM. A specified
      part can be shipped invisible and still satisfy a reading of the document.
- [ ] Any new element added to a row whose neighbour is `minmax(0,1fr)` must be
      measured against that neighbour, not eyeballed. `1fr` with a `0` minimum
      does not push back; it disappears, and it does so silently in whichever
      language has the longer words.
- [ ] Verify layout in **both** languages. Korean labels here were 223px of
      action column and English 343px; only English broke, and only English
      would have been caught by looking.
- [ ] A component that needs a width threshold of its own asks its container.
      Reach for a fourth viewport band only after `DESIGN.md` has been amended
      to allow one.

## Related files

- `app/[lang]/learn/page.tsx` — the row, its action column, and the container query
- `DESIGN.md` — the Studio Board Rule, the Row Action Exception, the three-band rule
- `CONTEXT.md` — the Gate Quiz entry, whose Korean gloss was corrected in the same change
