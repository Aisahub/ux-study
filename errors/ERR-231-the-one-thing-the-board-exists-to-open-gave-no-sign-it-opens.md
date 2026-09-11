# [ERR-231] The one thing the board exists to open gave no sign it opens

## Summary

Found on 2026-09-11 by a `/ux-audit` pass over the shipped `/ko/findings`,
probed at the deployed commit through a local server on the test branch. It
had been true since the board first rendered a Finding.

Every Finding on the board is a link, and the probe measured zero resting
cues on all of them:

| cue | before | after |
| --- | --- | --- |
| underline | none — `hover:` only | at rest |
| colour vs prose | same ink | same ink |
| weight vs prose | same weight | same weight |

The pointer was the only way to discover that the line opens, and the phone —
where the bottom bar says this platform expects to be read — has no pointer.
A reader on a phone was shown a shelf of cards with nothing on them that
looks pressable, on the platform whose Stage 1 practice page plants exactly
this defect (`tax-invoice-link`, no signifier) for Learners to find.

## Reproduction

`/ko/findings`, any Learner with an earned Stage. Read a card without moving
the mouse: nothing distinguishes its first line from the author line below
it, except that one of them happens to navigate.

## Root cause

**The underline's offset was written down and the underline was not.** The
link's classes were `underline-offset-4 hover:underline` — a resting offset
for a decoration that only exists under the pointer. Each card also puts only
its first line inside the `<a>`, so the card's own surface answers nothing;
that part stands, because a card whose whole face is a link would swallow the
author line's future affordances, but it makes the first line's own cue the
only cue there is — and there was none.

## Resolution

`underline underline-offset-4` on the board's Finding links: the underline is
now at rest, where a touch reader can see it before committing a tap.

## Prevention

**A link's cue must survive the pointer being taken away.** `hover:` variants
are feedback, not affordance.

- [ ] Does every link show at least one resting cue — underline, colour, or
      weight against the prose around it?
- [ ] Was the check made with the pointer nowhere near the element, and once
      at 390px where there is no pointer at all?

## Related files

- `app/[lang]/findings/page.tsx` — the board's Finding links
- `content/practice-page/stage-1/*.html` — the planted defect this one mirrors
