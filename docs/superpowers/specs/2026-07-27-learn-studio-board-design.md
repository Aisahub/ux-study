# Learn Studio Board Design

**Date:** 2026-07-27  
**Surface:** `/<lang>/learn`  
**Status:** Approved visual direction; awaiting written-spec review

## Problem

The Learn overview now has the correct non-linear information architecture, but
its visual expression is too plain. One large white card, repeated dividers,
and uniformly compact rows make the page read like a document rather than a
learning product. The page has little visual rhythm beyond its title and does
not make the programme feel like a set of practical exercises.

## Goals

- Give the overview a recognisable “studio task board” character.
- Preserve non-linear access to all four Stage 1 Competencies.
- Make the three Stages visible as the programme’s big picture.
- Keep progress, Quiz status, and the Self-Audit Report gate truthful.
- Improve scanning without turning the page into a generic card grid.
- Preserve Korean and English parity and mobile usability.

## Non-goals

- No changes to Quiz routes, progress calculation, or report gating.
- No new ordering or prerequisite relationship between Stage 1 Competencies.
- No new course content, illustration system, animation library, or dashboard
  metrics.
- No redesign of the global navigation, account controls, or other routes.

## Chosen Direction

The chosen direction is **Studio Board**. It treats each Competency as a
practical task the Learner can enter, while the Stage strip explains the
programme’s larger structure.

The production version deliberately differs from the visual comparison in one
important way: it does not fill an entire “current” Competency panel with
oxblood. More than one Quiz can be in progress, so a full-card highlight could
reintroduce the false idea that one Competency is uniquely current. Oxblood
remains attached to real status and action affordances instead.

## Page Structure

### 1. Page introduction

The existing title and detached fact chips become one composed introduction:

- `Learn / 학습` remains the display heading.
- A short supporting sentence explains that the four Competencies may be
  entered in any order.
- A compact horizontal progress bar shows Stage 1 completion.
- The progress label remains explicit (`0 / 5`, localized) so colour is never
  the only signal.

This introduction is not a separate floating card. It should read as the
heading of the board below it.

### 2. Stage strip

The three Stages appear in one responsive strip above the Competency panels.
Each Stage uses the same internal structure:

- Stage number and localized name;
- one-line description;
- state label.

Stage 1 uses a white elevated surface with an oxblood state mark to communicate
that it is open. Stage 2 and Stage 3 use the sunk neutral surface with
`In preparation / 준비 중`. They are informational, not interactive: no
chevrons, hover treatment, or button semantics. The strip does not use sand,
because the overview has no single next action.

On narrow screens the strip stacks or wraps into a single column. It must not
create horizontal scrolling.

### 3. Competency task panels

Stage 1 contains four distinct task panels in source order. The panels form one
vertical rhythm, not an equal-height multi-column card grid.

Each panel contains:

- a large two-digit Competency number;
- localized Competency name;
- localized objective;
- explicit Quiz status and attempt count;
- one localized Gate Quiz action.

The whole descriptive area links to the Competency page. The Quiz action remains
a separate link, so no interactive element is nested inside another.

Visual treatment:

- white surface and the existing card elevation;
- more space between panels than inside a panel;
- no full-width divider lines between unrelated panels;
- a strong number cell or status mark creates identity without colouring the
  entire card;
- Quiz actions use the established pill vocabulary and preserve a minimum
  `44px` touch height;
- hover and focus states reinforce clickability without changing layout.

Passed, in-progress, and unstarted states continue to use colour, shape, and
words together. Multiple in-progress panels must remain visually valid.

### 4. Self-Audit Report panel

The report is the final panel in the Stage 1 stack but is not presented as a
fifth Competency:

- it keeps the document mark rather than a two-digit number;
- while locked, the panel explains that all four Gate Quizzes must pass;
- it has no action while locked;
- once unlocked, it exposes the existing report action;
- after submission, it retains the submitted label and the report link.

Its shape and spacing match the task panels, while its mark and state copy
communicate a different kind of destination.

### 5. Progress visibility notice

The maintainer-visibility notice remains after the board. It receives enough
top spacing and a readable measure, but it does not become another card or
compete with the learning actions.

## Visual System

The redesign uses the existing committed system:

- oxblood for actions and completed/in-progress state marks;
- blue-grey and sunk white for future or unstarted states;
- white elevation plus an oxblood mark for the open Stage 1 state;
- Gowun Batang display type for the page heading;
- Pretendard for product UI and course content;
- existing `22px` content radius, pill controls, and elevation tokens.

No new palette, gradient text, decorative illustration, or glass card layer is
introduced. Personality comes from composition, spacing, number scale, and
the Stage strip rather than ornamental effects.

## Responsive Behaviour

### Desktop

- The board remains centred at the established `max-w-4xl` reading width.
- The introduction places the heading on the left and progress on the right.
- Stage items share one horizontal strip.
- Each Competency panel uses a content column and a compact action/status
  column.

### Mobile

- The introduction becomes one column.
- The progress bar remains full-width and labelled.
- Stage items stack without horizontal scrolling.
- Each Competency panel becomes one column.
- Status and Quiz action sit below the objective.
- Every interactive target remains at least `44px` high.
- Long Korean and English objectives wrap without clipping.

## Accessibility and Interaction

- Heading order remains `h1` followed by the programme/Stage structure.
- Status is always written in text; colour is supplemental.
- Focus rings use the existing global visible focus treatment.
- Informational Stage items are not announced as controls.
- The layout supports zoom and narrow viewports without horizontal overflow.
- Motion is limited to existing short hover/focus state transitions and must
  respect `prefers-reduced-motion`.

## Acceptance Criteria

- The page no longer reads as one uninterrupted white document card.
- Stage 1, Stage 2, and Stage 3 are visible before the four task panels.
- All four Gate Quiz links remain independently available.
- No copy or styling identifies one Competency as the required next one.
- Multiple in-progress Competencies render without visual conflict.
- The Self-Audit Report action remains absent until all four Gate Quizzes pass.
- Korean and English layouts work at desktop and narrow widths.
- The page has no horizontal overflow at a `390px` CSS viewport.
- Interactive actions are at least `44px` high.
- Existing Learn and audit integration tests remain green, with visual
  structure assertions added where they protect the new hierarchy.
