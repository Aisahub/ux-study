---
status: accepted
---

# Organise the curriculum by UX defect type, staged by detection difficulty

## Background

> **Correction, 2026-07-21.** ~~The programme's Learning Purpose is to reduce rework caused by clients finding delivered interfaces hard to use~~ — **this was false and was invented during drafting.** No client has reported this and no delivery has been rejected for it. The actual Learning Purpose is **preventive**: to bring a cross-national team to one standard for judging an interface and one vocabulary for describing it, before the absence of either produces a visible failure. The correction was applied to every other document at the time and missed this one. It does not change this ADR's decision — organising by defect type serves the real purpose at least as well — but it invalidates the framing below.

> **Amended 2026-07-21 with the corpus analysis this ADR's own follow-up work called for.** All twelve Competencies are now enumerated with their source articles; see "Curriculum" below.

The programme's Learning Purpose is to let staff justify design decisions with named principles rather than personal taste. Learners are Aisahub developers and PMs; the team has no dedicated designers, so no prior design vocabulary can be assumed.

Constraints verified before deciding:

- The reference corpus, <https://www.nngroup.com/articles/>, exposes **40+ topic categories** (Accessibility, Eyetracking, Research Methods, Managing UX Teams, …) across at least 10 pages of listings. The taxonomy is organised for UX researchers locating literature by discipline.
- Article bodies are freely readable without login, but the site reserves reproduction rights (`Copyright © 1998-2026 Nielsen Norman Group, All Rights Reserved`), so the corpus can be cited and linked but not restructured wholesale into our own pages.
- Assessment was already fixed: a Gate Quiz per Competency, plus four Self-Audit Reports (one per Stage, one final). ~~A Self-Audit Report requires the Learner to scan a page from their own real client work and find defects unaided.~~ **— superseded by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md) for Stage 1 and by [ADR-0009](0009-every-stage-audits-an-authored-subject.md) for the rest**: every Stage's subject is authored by this project. Unaided detection is unchanged, and this ADR's decision rests only on that.

## Decision

Competencies are grouped by **type of UX defect**, and the three Stages are ordered by **how hard that defect is to detect**:

1. **Stage 1 — visible at a glance**: visual hierarchy, readability, consistency, perceived clickability. Auditable from a screenshot.
2. **Stage 2 — visible by walking the flow**: navigation and orientation, forms, feedback and waiting, error states, empty states. Requires operating the interface.
3. **Stage 3 — visible only to someone else**: information architecture and naming, mental-model mismatch, accessibility. Requires stepping outside the author's own perspective.

The Learner's accumulated Competencies **are** their audit checklist; no separate checklist artefact will be produced.

### Curriculum (added by amendment)

Twelve Competencies, four per Stage, each anchored to a freely-readable article on nngroup.com. Only titles and URLs are recorded here; no source text is reproduced anywhere in this project.

**Stage 1 — visible at a glance.** Auditable from a static screenshot; no interaction required.

1. **Visual hierarchy** — say where a first-time user's eye lands, and name an element whose visual weight does not match its importance. `/articles/visual-hierarchy-ux-definition/`, supported by `/articles/f-shaped-pattern-reading-web-content/` and `/articles/layer-cake-pattern-scanning/`.
2. **Readability** — find text that is not comfortably readable and state the specific change. `/articles/legibility-readability-comprehension/`.
3. **Consistency** — find two places doing the same thing differently and say which should win. `/articles/ten-usability-heuristics/` (heuristic 4).
4. **Perceived clickability** — find an element users would not realise is interactive, or one that looks interactive and is not. `/articles/button-states-communicate-interaction/`.

**Stage 2 — visible by walking the flow.** Requires operating the interface: clicking, waiting, or making a mistake. A screenshot cannot show any of these.

5. **System status** — say whether the interface tells the user what is happening while it happens. `/articles/visibility-system-status/`.
6. **Error handling** — judge when an error appears, what it says, and whether it says how to recover. `/articles/errors-forms-design-guidelines/`, `/articles/error-message-guidelines/`, `/articles/hostile-error-messages/`.
7. **Form burden** — find work the form imposes that it did not need to. `/articles/4-principles-reduce-cognitive-load/`, `/articles/dropdown-list/`.
8. **Way back and control** — check that a user can leave, undo, and tell where they are. `/articles/user-control-and-freedom/`, `/articles/breadcrumbs/`.

**Stage 3 — visible only to someone else.** These defects are *structurally* invisible from inside the author's own head: knowing how it works is exactly what prevents seeing them. Stage 3 therefore teaches the two available routes out — becoming the outsider for someone else's work, and recruiting real outsiders.

9. **Jargon** — find words that are clear to the team and opaque to the user. You cannot detect your own jargon by reading it, which is what makes this Stage 3. `/articles/technical-jargon/`, `/articles/plain-language-experts/`.
10. **Mental-model mismatch** — find where the interface assumes the user's model matches the builder's. `/articles/mental-models/`.
11. **Heuristic evaluation** — audit an interface you did not build, against named heuristics rather than taste. This is the Competency that makes Peer Review possible, and it *is* Peer Review in practice. `/articles/how-to-conduct-a-heuristic-evaluation/`.
12. **Testing with real users** — get a genuine outside head cheaply, and know how few it takes. `/articles/why-you-only-need-to-test-with-5-users/`, `/articles/usability-testing-101/`.

Verification status: every URL above was returned by NN/g's own index or site search during this analysis, and the corpus is readable without login. Each is re-checked at authoring time for the Competency that cites it, not before.

Non-goals: the curriculum does not mirror the NN/g topic taxonomy, does not organise by UI component, and does not attempt to cover UX research practice (recruiting, eyetracking, study design) — those serve a role Aisahub does not staff.

## Rationale

- A Learner opens this platform at one moment: *"this page ships next week — is anything wrong with it?"* A discipline-based taxonomy requires knowing which discipline a defect belongs to before it can be looked up, which is precisely the knowledge the Learner lacks.
- Because assessment is a page scan, a defect-type spine doubles as the scan checklist. Curriculum progress and audit coverage become the same list, removing an artefact that would otherwise drift out of sync with the lessons.
- Ordering by detection difficulty makes Self-Audit Report difficulty escalate on its own: Stage 1 reports need a screenshot, Stage 3 reports need another person to try the interface. No separate difficulty schedule is needed.
- Stage 3 (seeing past one's own assumptions) is the same capacity required to explain a design decision to a client, so the hardest rung sits directly under the Learning Purpose's second half.

## Considered alternatives

- **Mirror the NN/g topic taxonomy.** Strongest benefit: one-to-one mapping to source articles, making citation trivial. Rejected because that taxonomy is built for researchers browsing by discipline; it demands the Learner already classify their problem before they can find the material.
- **Organise by the staff workflow** (take requirements → map flows → build UI → self-audit → explain to client). Strongest benefit: matches the moment of use. Rejected because UX judgement concentrates almost entirely in the "build UI" step, which would make the Stages severely lopsided and leave two Stages nearly empty.
- **Organise by UI component** (forms, tables, navigation, modals). Strongest benefit: matches how developers already think, so uptake is fastest. Rejected because it degrades into a component style guide — the Learner acquires rules for specific widgets without the underlying judgement needed for a widget the guide never covered.

## Consequences

- Competency definitions must be written as observable actions tied to a defect type; a Competency that cannot be spotted on a real page does not belong in the curriculum.
- Stage 3 Self-Audit Reports require a second person to exercise the interface, which is an operational cost the platform must account for (scheduling, or an explicit lightweight substitute).
- NN/g articles are referenced per Competency as external citations rather than reproduced, so the platform must carry its own Korean-language explanation for every Competency. Content authoring is the dominant cost of this project, not engineering.
- Some NN/g material (research methods, UX team management) falls outside every Stage and is deliberately unreachable through this curriculum.
- Reversing this decision after content is authored means rewriting every Competency, since Competency boundaries are drawn along defect lines.

## Follow-up work

- Enumerate the Competencies for each Stage and confirm every one is stated as an observable action; reject any that cannot be assessed on a real page.
- For each Competency, identify the NN/g articles it cites and record their URLs, verifying each resolves and is readable without login.
- Define the Stage 3 "second person" mechanism concretely, including what a Learner does when no second person is available.
