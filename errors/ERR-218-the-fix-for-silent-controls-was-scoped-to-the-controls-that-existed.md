# [ERR-218] The fix for silent controls was scoped to the controls that existed

## Summary

Five findings on the Gate Quiz verdict screen, surfaced by an audit of the
per-item explanation card the day it was written. Four are ordinary omissions.
The first is not, and it is the reason this document exists: **the control
added by that feature was silent under a finger, one commit after the fix that
made every control answer a press.**

| what was wrong | who it fails |
| --- | --- |
| the five fold rows had no hover and no pressed state | anyone who presses one |
| the caret's rotation ignored `prefers-reduced-motion` | a Learner who asked for less motion |
| the verdict said `통과` / `미통과` in words alone | a Learner who cannot read a one-syllable difference at a glance |
| a passed attempt had no way onward from the foot of the page | everyone, at the most motivated moment in the programme |
| five source links opened new tabs unannounced, and the Korean card never said its sections are English | a screen-reader Learner; the Korean cohort |

## Root cause

**A global rule was written as a global rule and applied to an enumerated set.**

`ERR-216` established that a control which accepts a press and renders exactly
as it did before has said "nothing happened". Its fix was deliberately global,
in `globals.css`, and its own comment says why:

> Both are here, on the element, for the same reason the focus ring above is
> global — a control that has to remember to answer a press will eventually
> forget.

But the selector it shipped is `:where(button, .press)`. That is not "every
control". It is "every `<button>`, plus every element somebody remembered to
label". The comment claims a property the selector does not have, and the gap
is invisible for exactly as long as nobody adds a control that is neither.

A `<summary>` is neither. Eleven hours after `8b2383e fix: make every control
answer a press before it answers the request` landed, `480d215` added five
pressable `<summary>` rows to the verdict screen, and every one of them
answered a press with nothing. The defect ERR-216 removed was back, in the
same feature area, introduced by the author of the fix.

The same shape explains the caret. `globals.css` carries a
`prefers-reduced-motion` block, and its scope is `:where(button, .press)` —
the same enumeration. The new caret animated a `transform` outside that set, so
it was the only motion in the application that did not answer the preference.
Every other one does: `pending.tsx` carries `motion-reduce:animate-none` on the
spinner, because a Tailwind variant is attached to the thing that moves rather
than to a list of things that are allowed to move.

Underneath all five findings is one habit: **a rule was checked against the
code that existed when it was written, not against the code that would arrive
after.** The verdict screen said its status in one channel while DESIGN.md's
first Do has always been three; the passed branch had no exit while
PRODUCT.md's fifth principle has always required one; the source links were
copied verbatim from a block written before this card existed, carrying their
`aria-hidden` arrow with them. None of these were decisions. They are what a
new surface inherits when it is assembled from the parts nearest to hand.

## Resolution

- `<summary>` carries `press`. One word, and the global rule reaches it — the
  enumeration is still an enumeration, but the new control is now in it.
- The caret carries `motion-reduce:transition-none`: the turn is dropped, the
  turned state is not. Less motion was asked for, not less information.
- `AttemptMark` moved out of the doorstep into `quiz/attempt-mark.tsx` and now
  stands beside the verdict `<h1>` at the route line's `24px`. The verdict is
  told in colour, shape and words, like every other status on the platform.
- A `다음으로` / `Where to next` block closes both branches: back to the
  Competency, back to the overview. Links in pills, not a warm field — passing
  leaves nothing outstanding, and no `next` Competency is named, because Stage
  1 has no order to invent.
- Every source link says `(새 탭에서 열림)` / `(opens in a new tab)` to a screen
  reader, and the Korean review card carries the Competency page's own
  translation notice.

Four tests now hold these: the heading's mark in both verdicts, the foot
navigation's two destinations, `press` on all five summaries, the reduced-motion
class, the spoken new-tab note, and the Korean notice present in `ko` and absent
in `en`.

## Prevention

**The next control that is neither a `<button>` nor labelled `.press` will be
silent too.** The honest fix is to widen the selector — `summary`, `[role=button]`
and `a` drawn as a control are the obvious next arrivals — or to stop claiming
globality in a comment above an enumeration. Recorded here rather than done
here: changing that selector touches every control in the application and wants
its own change with its own verification, not a rider on a verdict screen.

Read together with `ERR-216`, whose fix this document is the sequel to: the
lesson is not "remember the `press` class". It is that a rule enforced by
enumeration silently exempts everything written after it, and that the interval
between the two commits here was eleven hours.
