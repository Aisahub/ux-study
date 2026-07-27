# Non-linear Learn Overview Design

## Problem

The Learn overview currently invents a sequence inside Stage 1 by treating the first unpassed Competency as the Learner's current position and presenting one separate next-action card. The product has no such prerequisite: every Stage 1 Competency and Gate Quiz route is independently available.

The full-width contents and action cards also create unnecessarily long reading lines on desktop, while Stage 1, Stage 2, and Stage 3 use different visual structures.

## Decision

The Learn overview becomes a non-linear programme directory.

- Every Stage 1 Competency row links to both its Competency page and its own Gate Quiz.
- Every Gate Quiz entry remains available after passing because retries are preserved and permitted.
- Status and attempt count remain attached to the corresponding Competency.
- The inferred `You are here` and `Next stop` concepts are removed from this surface.
- The separate warm next-action card is removed.
- The Self-Audit Report remains locked until all four Gate Quizzes pass; once unlocked, its row exposes the report action.

## Stage Structure

Stage 1, Stage 2, and Stage 3 share one stage-heading component:

- the same marker column;
- the same name and description column;
- the same right-aligned status column;
- the same type scale and alignment.

Stage 1 shows the Learner's numeric progress and expands its Competencies and report beneath the heading. Stage 2 and Stage 3 remain collapsed, non-interactive commitments marked `In preparation`. Stage 1 children are indented to make the parent-child relationship visible.

## Layout

The entire Learn surface uses a centred `max-w-4xl` reading column on desktop and the available width on smaller screens. Stage groups use a 24px separation; related heading and child content use a tighter 8–12px grouping. List rows use the 4px-based spacing scale.

On desktop, each Competency's status and Gate Quiz action sit at the right of its row. On narrow screens they move below the objective in the content column. Every interactive target is at least 44px high.

The Learn overview deliberately carries no sand next-action card: there is no single next action in a non-linear Stage. Oxblood remains reserved for actionable links and passed states.

## Copy

Quiz row actions use one truthful label regardless of attempt state:

- English: `Open the Gate Quiz`
- Korean: `관문 퀴즈 열기`

This avoids claiming that an `in-progress` projection necessarily has an open attempt; it may instead represent a submitted attempt that did not pass.

## Verification

- Integration tests prove that all four Stage 1 Gate Quiz links are present.
- Integration tests prove that the overview no longer exposes `Next stop` or `You are here`.
- Existing report-lock, completion, language, privacy, and progress behaviour remains green.
- The production page is inspected in Korean and English at narrow and desktop widths.
- The Impeccable layout assessment and detector are re-run with no unresolved findings.
