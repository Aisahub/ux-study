# Learn Overview Flow Design

## Problem

The Learn overview repeats the same Stage 1 Competencies in a route diagram and a station list. Its responsive ordering also puts the next Gate Quiz before the Learner has seen the programme structure and their current position.

## Decision

Replace the separate route, station list, and future-stage sections with one table of contents. The table of contents appears before the next-action card at every viewport width.

The table of contents:

- expands Stage 1 and lists its four Competencies plus the Self-Audit Report;
- shows the Learner's status, attempt count, and current position in those Stage 1 rows;
- follows Stage 1 with Stage 2 and Stage 3, each marked as in preparation;
- preserves the existing links from each Stage 1 Competency row.

The next-action card retains its existing state-dependent behaviour: it points to the next Gate Quiz, the unlocked Self-Audit Report, or Stage 1 completion.

## Content

The Korean section title is `목차`; the English equivalent is `Programme contents`. Stage labels and existing descriptions remain unchanged. No accordion or new interaction is introduced.

## Layout

The page uses a single reading sequence: heading, programme contents, next action, visibility notice. On wide screens the contents and next action may use different widths, but CSS must not reverse their document order.

## Verification

- An integration test reads the rendered overview and proves that the table of contents precedes the Gate Quiz action.
- The same test proves that the duplicate route and separate future-stage heading are gone.
- Existing progress, language, privacy, and Competency tests remain green.
- Korean and English views are inspected at phone and desktop widths.

## Source

GitHub issue #39.
