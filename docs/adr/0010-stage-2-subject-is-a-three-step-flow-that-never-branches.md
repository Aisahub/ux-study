---
status: accepted
---

# Stage 2's subject is a three-step flow that never branches

## Background

[ADR-0009](0009-every-stage-audits-an-authored-subject.md) fixed that every Stage
audits a subject this project authored, and refused to say what Stage 2's is:
"whether that is a multi-step flow, a second Practice Page, or an extension of the
existing one is untouched here." It fixed one property the subject must have —
Stage 2's defect class is visible only by operating the interface, so a single
static page will not satisfy it — and left the shape open. That item is closed
here.

Constraints verified before deciding:

- **Stage 2's four Competencies** ([ADR-0001](0001-curriculum-organised-by-defect-type.md))
  are system status, error handling, form burden, and way back and control. The
  first three can occur within one screen: a wait, a mistake, a form that asks for
  more than it needs. The fourth cannot. "Tell where they are" presupposes
  somewhere to be, and its source article is on breadcrumbs — orientation within a
  structure the Learner is partway through.
- **What each Competency needs in order to be detectable was checked
  individually**, because it decides how alive the subject has to be. System
  status needs a wait; error handling needs a mistake; form burden needs the form
  to react to what is typed. All three are *within one step*. Way back and control
  needs several steps, but it needs movement between them, not data carried
  between them. **No Stage 2 Competency requires a Learner's entry at one step to
  change what a later step shows.**
- **Stage 1's Planted Defects were deliberately kept static.** ADR-0007's
  follow-up recorded that all six are static visual states and that "anything
  requiring interaction belongs to Stage 2, not Stage 1." Adding behaviour to the
  existing Practice Page would put Stage 2 defects in front of Stage 1 Learners,
  against a manifest that is one file per subject and a defect count that is
  withheld from Learners until submission.
- **The Stage 1 Practice Page cannot be operated at all, by design.** It is served
  by a route handler that injects a click listener running in the capture phase
  with `event.preventDefault()` on every click, commented "the artefact is inert:
  nothing on it navigates or submits." The click is spent entirely on selecting
  the element a Finding names, and on a phone a selection additionally opens the
  Finding composer. A subject that must be *operated* therefore contends for a
  channel Stage 1 has already fully allocated. This was not visible from ADR-0009
  and shapes much of the decision below.
- **Both desktop and mobile are primary**, and below `1100px` the Self-Audit
  Report is already a finding-at-a-time flow with the subject owning the screen
  (`DESIGN.md`, answered 2026-07-27 in #37).

## Decision

**Stage 2's subject is a walkable flow of exactly three steps, and it never
branches.**

The flow **may be alive**. It may remember what a Learner entered and echo it
later — a confirmation step showing the address typed two steps earlier is
allowed and is wanted. Controls within a step may react to input: validation that
fires, an error that appears, a field that unlocks another, a button that waits.
This is where three of the four Competencies live, and a subject too inert to do
it would be unable to carry them.

What the flow may **never** do is change **which screens and which controls a
Learner meets**. No choice may skip a step, reveal a step, or swap one control for
another. Every walk visits the same three steps and exposes the same set of
`data-element` identifiers, in both languages.

**That rule is stated on the identifier set so it can be checked rather than
remembered.** The content build already requires both language variants of a
subject to expose an identical set of `data-element` identifiers. Because the
flow never branches there is exactly one walk, so the same check extends to it: a
test walks the flow once and compares the identifiers each step exposes against
the authored set. A future edit that introduces a branch makes the walk diverge
from that set, and the build fails.

**Operating the subject and pointing at it are two explicit modes.** The subject
carries a visible control that switches between *Operate* — clicks work the
interface, which is what makes the defects detectable — and *Select* — clicks name
the element a Finding will cite, which is Stage 1's behaviour unchanged. The
active mode is stated in words, not by appearance alone, and is announced to
assistive technology.

**The flow is re-walkable, by an explicit Restart control, and re-walking does not
clear what was entered.** A Learner who wants a clean walk asks for one; the flow
never discards their work on its own.

**A Planted Defect keeps naming a `data-element`, and gains the step it occurs
in.** The element it names is **the element that should have spoken** — the button
that gave no progress signal, the field whose error arrived at the wrong time, the
step with no way back. The manifest is otherwise Stage 1's, so the content build's
existing guarantee holds: an element named in the manifest must exist in the
markup. Identifiers are namespaced by step so they stay unique across the flow.

That choice is what makes the two modes survivable. A Stage 2 defect is often a
*moment* — eight seconds in which nothing was said — and a moment cannot be
clicked once it has passed. The element that should have spoken is still on the
screen afterwards. A Learner walks the flow, notices the silence, walks it again if
they wish, then switches to Select and points at the control that stayed quiet.

**Below `1100px` the flow owns the screen**, as the Practice Page already does, and
both the mode control and Restart are reachable without scrolling. Walking the flow
and composing a Finding remain the two surfaces #37 answered for; nothing here asks
a phone to show both at once.

The subject performs no real work. It makes no network request, writes nothing, and
calls no model — its waits and its errors are authored, not produced.

## Rationale

- **The fourth Competency decides the shape.** Three of the four fit one screen and
  one does not, and a subject that cannot host a quarter of the Stage teaches a
  quarter less. Every alternative shape below either drops that Competency or
  simulates it, and a simulated way-back is not detected by interaction, which is
  the one property ADR-0009 fixed.
- **Branching is the hazard; memory is not.** ADR-0007's controlled cross-location
  comparison rests on every Learner facing identical input. A Learner who cannot
  reach a Planted Defect has not missed it — it was never on their screen — and the
  manifest then describes a walk they did not take. That failure needs a *fork*. A
  step that echoes an address the Learner typed changes what the screen says and
  changes nothing about which defects are reachable. Forbidding all state would pay
  the full realism cost to prevent a hazard only one half of it creates.
- **The realism the Competencies need is local, and the check above confirmed it.**
  A form that reacts to what is typed is exactly what makes form burden and error
  handling detectable at all. None of the four needs data to survive a step
  boundary, so the ban lands precisely where nothing is lost.
- **A rule stated on an identifier set is enforceable; a rule stated in prose is
  not.** `ERR-206` found six design drifts that had shipped green and named the
  cause: the system was prose, and prose cannot refuse anything. "Do not branch" in
  a document would be broken by the first author who adds one more delivery option.
  Stated as an equality between identifier sets, it is a failing build.
- **Two named modes are the only channel split this project may ship.** The cheaper
  split is a hidden gesture — long-press, modifier-click — and this platform's
  fourth Competency is perceived clickability. `ERR-202` recorded the same mistake
  already made once here: a control expressing a rule by disappearing, whose finding
  was that "absence is not a message." A function reachable only by an invisible
  gesture is that defect with the platform's own name on it, and it is also
  unreachable by keyboard, which WCAG 2.2 AA does not permit.
- **Naming the element that should have spoken keeps two Findings comparable.** A
  Finding's element and Principle are selections precisely so that a Finding written
  in Seoul and one written in Jakarta can be set beside each other (`CONTEXT.md`).
  Recording a behavioural defect against the control it belongs to keeps that
  property, and keeps the existing schema — no column changes meaning.
- **Three is the smallest number that is a flow.** Two steps have a between; three
  have a middle, which is where orientation and a way back are actually tested.
  Beyond three, each step costs two authored languages, a phone pass and a keyboard
  pass, on the project's dominant cost centre.

## Considered alternatives

- **A flow that keeps no state at all.** Strongest benefit: the hardest possible
  guarantee, and the cheapest to verify — if nothing is remembered, nothing a
  Learner does can affect anything, so no argument about reachability is even
  available. Rejected because it pays for that guarantee with the realism the
  Competencies need. A form that cannot react to what is typed cannot demonstrate
  form burden or error handling, and the hazard being prevented comes from
  branching alone.
- **A second standalone Practice Page, interactive in place.** Strongest benefit: it
  reuses everything Stage 1 built — the serving route, the manifest shape, the
  content-build checks, the two-surface layout — and would be authorable in a
  fraction of the effort, on a project whose dominant cost is authoring. Rejected
  because way back and control has nowhere to exist on one screen. The honest
  version drops a Competency; the dishonest version keeps it as a cancel button and
  calls that orientation.
- **Add behaviour to the existing Stage 1 Practice Page.** Strongest benefit: one
  artefact, one set of element identifiers, one stylesheet, and a Learner already
  knows the page by Stage 2. Rejected because it puts Stage 2's defects in front of
  Stage 1's Learners, against ADR-0007's follow-up finding that Stage 1's six are
  static on purpose, and because one manifest per subject cannot withhold a count
  per Stage.
- **A recorded walk-through the Learner scrubs, rather than operates.** Strongest
  benefit: perfect determinism — every Learner sees an identical sequence, including
  identical timing, so the reference answer is beyond dispute, and the click channel
  never has to be split at all. Rejected because ADR-0009 requires the defects to be
  detectable *by interaction*; watching is not operating. This option is Stage 1
  with motion, and it answers the requirement by restating it.
- **Allow branching, but require every Planted Defect to sit on the path all walks
  share.** Strongest benefit: full product realism, including the branch points that
  real flows have, with comparability preserved where it actually matters. Rejected
  because the property is not mechanically checkable — "every walk reaches this
  element" needs every walk enumerated, which grows with each branch added, and the
  guarantee would degrade silently as the flow is edited. This is the failure mode
  `ERR-206` and `ERR-208` both describe.
- **A hidden gesture for selection, leaving plain clicks to operate.** Strongest
  benefit: operating feels completely natural, with no mode to forget and no control
  taking space on a phone screen the subject is meant to own. Rejected as the
  signifier defect this platform teaches, and as inoperable by keyboard.
- **Findings name a step rather than an element.** Strongest benefit: it is the most
  truthful record of a Stage 2 defect, which is frequently a gap in a sequence
  rather than a fault in a thing. Rejected for now because it changes what
  `findings.element` means, and every Stage 1 Finding already stored under the old
  meaning would have to keep reading correctly. Naming the element that should have
  spoken captures most of the same information at none of that cost. This is the
  alternative most likely to deserve reopening.

## Consequences

- **Stage 2's subject is the most expensive content artefact in the project so
  far**: three screens, two languages, a phone pass and a keyboard pass each, plus
  authored waits, authored errors and authored validation. ADR-0009 accepted the
  Practice Page's authoring cost twice more; this is the first of those two, and it
  is larger than the original.
- **The content build gains a walk.** Checking the identifier set now means
  exercising the subject rather than reading its markup, which is a new kind of
  check for this project's content tests. It is also the only kind that can see a
  branch.
- **A mode control is a new interface element with no precedent in this product, and
  it appears on the one surface Learners are told to find fault with.** It will be
  audited. It must state its state in words, meet the contrast table in `DESIGN.md`,
  and not be mistaken for part of the artefact — a Learner must never be able to
  report our own chrome, which is why Stage 1's page is served with none of it.
- **Modes carry their own usability cost, and this project cannot pretend
  otherwise.** A Learner who forgets which mode they are in will click a button
  expecting it to work and select it instead. The mitigation is that the active mode
  is always visible and always in words; the residual risk is accepted and is the
  reason the alternative above was weighed rather than dismissed.
- **Two Planted Defects may name the same element in different steps**, since an
  element identifier is namespaced by step. Nothing in the current manifest assumes
  one defect per element, but nothing has tested it either.
- **Stage 3's subject is not decided by this ADR** and does not inherit the
  three-step shape. Stage 3's defects are detectable only by stepping outside the
  author's perspective, which is a different requirement from interaction.
- **`findings.element` keeps its meaning**, so this decision does not widen the
  migration in issue #61.

## Follow-up work

- Author the flow and its manifest (issue #70), and verify each Planted Defect is
  detectable only by operating it — anything findable from a still screenshot
  belongs to Stage 1 and must be removed or moved.
- Build the no-branch check as a walk over the subject, and confirm it fails when a
  branch is deliberately introduced. A check never seen to fail is not known to
  work.
- Confirm the planted defects are spread unevenly across the four Competencies, as
  Stage 1's were, so their count carries no hint about their distribution.
- Walk the flow on a phone in both languages with a keyboard attached, and confirm
  the mode control and Restart are reachable without scrolling and never obscure the
  step they belong to.
- Decide whether the mode control belongs to the subject or to the surrounding audit
  surface. This ADR places it on the subject so that it survives the source being
  published; if that makes the subject unauditable — a control the Learner is meant
  to ignore, on the page they are told to scrutinise — the choice is reversible
  without reopening anything else here.
- Revisit **Findings naming a step** once Stage 2 has run once. If Learners
  repeatedly name the right element for the wrong reason, the record is the thing
  that was wrong, not the Learner.
