---
status: accepted
---

# A Quiz Item draws an interaction as stacked, captioned stills

## Background

Every Stage 1 Quiz Item draws a real screen rather than describing one, which
is a large part of why an item cannot be answered from memory of the article
([ADR-0006](0006-objective-gate-quizzes-without-an-llm.md): "a good scenario
item needs a real screenshot"). The drawing is an HTML fragment in the item's
front matter, styled by `content/items/item-screen.css` and rendered in a
sandboxed frame so the platform's own typeface and colours cannot inherit into
the thing being judged.

Stage 2's entire defect class is invisible in a still.
[ADR-0001](0001-curriculum-organised-by-defect-type.md) defines the Stage as
"visible by walking the flow", and the four Competencies authored in #65 each
require time to pass: a wait with no sign of itself, an error arriving at the
wrong moment, a form's cost discovered while filling it, a step that cannot be
left. A single frame cannot show a wait, a state change, or a mistake being
made.

This is decided before any Stage 2 pool is authored. Thirty-two bilingual items
written under an ad-hoc convention and then re-cut is the cost this decision
exists to avoid.

## Decision

An item may carry a **`sequence`** instead of a `screen`: an ordered list of
states, each with its own drawn HTML and its own caption, in both languages.

**Every state renders at once, stacked top to bottom in time order.** Nothing
moves, nothing auto-advances, and there is no control to operate.

**The caption says when the state is, never what changed.** "Three seconds
after tapping Save" is a caption; "no spinner appears" is the answer. The rule
and its failing examples live in `content/items/AUTHORING.md`, next to the
pools, because that is what the next author opens.

Two states is the floor — one state is a `screen` and already has a spelling.
`screen` and `sequence` are mutually exclusive, and the content build refuses
an item carrying both.

## Rationale

- **Comparison is usually the judgement.** An item asking what the interface
  failed to say between two moments requires both moments in front of the
  Learner. A player showing one state at a time removes exactly the thing being
  assessed and replaces it with a memory test.
- **Motion would put the assessment behind a capability.** WCAG 2.2 AA is a
  hard line on every surface (PRODUCT.md), and accessibility is taught inside
  this programme. An item a Learner has to watch is an item some Learners
  cannot answer, and there is no accessible fallback that is not simply this
  design.
- **Inert keeps an Attempt reproducible.** Scoring is objective and calls no
  model ([ADR-0006](0006-objective-gate-quizzes-without-an-llm.md)). A drawing
  that renders identically on every open, for every Learner, in a sandbox with
  no network, keeps the artefact a fact rather than a performance.
- **Down rather than across, because two columns cannot carry an order.**
  Reading order forks at the top of every row, so the only way to say "this
  comes after that" is to put it after it — the same reasoning that made the
  Competency page one numbered column. Side by side would also multiply the
  720px screen floor by the number of states.
- **It reuses the machinery already proving itself.** The sandbox, the height
  handshake and the pan-rather-than-reflow rule are shared with the single
  screen that thirty-two live items already exercise. What is new is a list, a
  caption and a stacking rule.

## Considered alternatives

- **A player with next/previous controls.** Strongest benefit: unlimited states
  at no vertical cost, and stepping through mimics using the real interface.
  Rejected because it hides the comparison the item is asking for, adds a
  control a Learner can be mid-way through when they answer — so two Learners
  see different things at the moment of judgement — and puts operable UI inside
  an artefact whose whole point is that it is inert.
- **An animated GIF or a short video.** Strongest benefit: shows real motion,
  including easing and duration, which some status defects genuinely are.
  Rejected on three counts already settled elsewhere: it needs re-cutting for
  both languages, it cannot be diffed in review, and it fails the no-motion
  requirement outright.
- **CSS animation inside the existing sandbox.** Strongest benefit: no new
  authoring shape at all — the frame already runs a script. Rejected because
  what the Learner judges would depend on when they looked, `prefers-reduced-
  motion` would produce a different artefact for different people, and an
  Attempt would stop being reproducible.
- **Prose alone: describe the interaction in `artefact`.** Strongest benefit:
  free, and the format ADR-0006 already allows. Rejected because a description
  of a defect is the definition question this programme keeps ruling out — the
  Learner would be scoring a paragraph, not an interface.
- **A side-by-side strip of states.** Strongest benefit: the whole sequence in
  one glance, no scrolling. Rejected for the ordering and width reasons above.

## Consequences

- **Stage 2's pools can be authored** (#66–#69), and their items will mostly
  carry sequences rather than screens.
- **A sequence item is taller than a screen item**, and on a phone it is
  several panned frames stacked. This is accepted: the alternative arrangements
  all cost either the ordering or the comparison.
- **The caption rule is the one thing here a build cannot check.** It is prose
  in `AUTHORING.md` with worked failing examples, and it is the first thing to
  look at when reviewing a Stage 2 pool. If items start passing review with
  answer-carrying captions, the honest fix is a review checklist item, not a
  regex.
- **Nothing about existing items changes.** A `screen` is authored, loaded and
  rendered exactly as before, and the Stage 1 pools are untouched.
- **The first rendered sequence arrives with the first Stage 2 pool.** This
  decision ships the shape, the loader's refusals and the component; no
  authored item exercises it yet, because a pool must hold a full draw and
  authoring one is #66.
