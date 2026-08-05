# [ERR-216] The only answer to a press was the screen that replaced it

## Summary

A Learner reported that the button on the Gate Quiz doorstep did not work. It
worked. Measured on the running application, `다시 도전` held for **3.5 seconds**
between the press and the screen it opens, and in those 3.5 seconds nothing on
the button changed — not its colour, not its size, not its label. There was no
hover state, no pressed state, and no indication that a request was in flight.

The report is the correct reading of what was shown. A control that accepts a
press and then renders exactly as it did before has said "nothing happened",
and the reasonable response to that is to press it again — which on
`restartAttempt` means discarding an open attempt and drawing a second time.

Three states were absent, and each was absent for a different reason:

| what was missing | where it should have come from |
| --- | --- |
| hover | `DESIGN.md` specifies it; 2 of ~30 controls implemented it |
| pressed | never specified anywhere |
| in flight | implemented once, on the quiz wizard's submit, and nowhere else |

## Root cause

**Latency was treated as a property of the server rather than as something the
interface has to narrate.**

Every Learner-facing route in this application is `force-dynamic` and most are a
Neon round trip away. The doorstep is the slowest of them by construction: it
reads the attempt history, draws a set, writes a row, and then redirects to a
page that renders authored item screens. Roughly 2–3.5 seconds is the normal,
correct behaviour of that button — not a regression, not a slow query. It was
always going to take that long, and nothing in the interface was ever built to
say so.

Two smaller failures sit underneath it.

The first is that `DESIGN.md` has carried this line since the system was written:

> **Hover / Focus:** Oxblood deepens; focus shows a visible ring — never
> removed, this platform teaches keyboard operability.

Focus was implemented globally, in `globals.css`, with a comment saying it is
global *so that no component can forget it*. Hover from the same sentence was
left to each call site, and thirty-odd call sites duly forgot it. Two links on
the Learn overview carried `transition-[filter] hover:brightness-90`; every
other control in the application carried nothing. The same sentence, split
across two mechanisms, got two outcomes — and the mechanism that scaled is the
one that was never allowed to be forgotten.

The second is that the one in-flight state that did exist was drawn as a
*disabled* state. The wizard's submit set `disabled:opacity-40` and kept it
while scoring, so at the exact moment the button most needed to say "working" it
faded to the value this system uses for "not available". Being pressed made it
look more dead, not less.

The platform teaches this defect. Perceived clickability is a Stage 1
Competency here, and the standing failure was on the button that gates it.
`ERR-211` recorded the same class of error on the row above — an affordance
spent on a state half the platform cannot enter. This is its sibling: an
affordance that existed at rest and then went silent for the whole interaction.

## Reproduction

1. Sign in as a Learner with one submitted attempt and no open attempt on a
   Competency, so the doorstep offers `다시 도전`.
2. Open `/ko/learn/<competency>/quiz` and press the button once.
3. Observe the button for the next three seconds. Nothing about it changes.
4. The next screen arrives with no warning. Measured with a 50 ms DOM poll:
   first change at `navigated away`, t = 3576 ms.
5. Press it twice in that window, as someone who believes it did not register
   would, and two attempts are drawn.

## Solution

Three states, each put where it cannot be forgotten again.

**Hover and press, in `globals.css`, on the element.** One rule, keyed on
`button` and on a `.press` class for the `<Link>`s this system draws as pills:
`brightness(0.93)` on hover, `brightness(0.86)` and `scale(0.98)` on
`:active`, over a 120 ms transition. Deepening is `filter` rather than a second
background colour, which is what lets one declaration cover the oxblood
primary, the white pill, the sunk chip and the rail's marks without any of them
declaring a hover of its own. `prefers-reduced-motion` drops the transition and
the scale and keeps the deepening, which is a colour change and not motion.

This follows the focus ring immediately above it in the same file, for the
reason that comment already gives.

**In flight, in `app/[lang]/pending.tsx`.** CSS cannot answer this one — only
React knows when a form action or a navigation has finished. `SubmitButton`
reads `useFormStatus` and swaps its label, shows a turning ring, sets
`aria-busy`, and disables itself for the duration; `LinkPending` reads
`useLinkStatus` and does the same for the CTA links, positioned absolutely so
the label does not move under the finger. Idle, `SubmitButton` renders exactly
what the plain `<button>` rendered — same classes, same children — so nothing
about the resting screen moved.

Disabling while in flight is not decoration. `restartAttempt` deletes the open
attempt and draws a new one; two presses of a button that looked dead after the
first ran that twice.

**The wizard's submit, split in two.** Held back for unanswered items it stays
faded, because it is genuinely not yet available. Scoring, it is at full
strength with the ring. Two reasons a control refuses a press, drawn as two
different things.

## Prevention checklist

- [ ] A control on a `force-dynamic` route must report its own flight. Ask how
      long the action takes on a real connection before deciding it does not
      need to; anything past ~300 ms is a wait the interface has to narrate.
- [ ] `disabled` and `busy` are not the same state and may not share a
      treatment. Fading a control the instant it is pressed says it died.
- [ ] A press must be answered before the request is. The answer belongs in
      CSS, where it costs nothing and cannot arrive late.
- [ ] When `DESIGN.md` states a behaviour for a *class* of component, implement
      it once for the class. A rule left to each call site is a rule that holds
      for as long as someone remembers it — the focus ring and the hover state
      in this system came from one sentence and got opposite outcomes.
- [ ] Before concluding a control is broken, measure the gap between the press
      and the next paint. "It does not work" and "it does not say anything for
      three seconds" look identical from the outside and have different fixes.
- [ ] A `<Link>` drawn as a button is a button to everyone except the parser.
      It takes the same states.

## Related files

- `app/globals.css` — the hover and press rules, beside the focus ring they follow
- `app/[lang]/pending.tsx` — `Spinner`, `SubmitButton`, `LinkPending`
- `app/[lang]/learn/[competency]/quiz/page.tsx` — the doorstep the report came from
- `app/[lang]/learn/[competency]/quiz/[attemptId]/wizard.tsx` — the disabled/busy split
- `app/[lang]/maintain/allowlist/page.tsx` — add and remove, both server actions
- `DESIGN.md` — the Buttons section, whose Hover/Focus line this finally implements
- `errors/ERR-211-the-only-way-in-was-a-hover-state.md` — the same class, one row up
