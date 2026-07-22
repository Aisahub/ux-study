---
status: accepted
---

# Assess Stage 1 against an authored practice page with planted defects, and remove the human verdict

## Background

[ADR-0006](0006-objective-gate-quizzes-without-an-llm.md) made Gate Quizzes objective and removed every external model API from the product. It left the Self-Audit Report untouched: a Learner audits a page from their own real work, and a human Reviewer accepts or rejects it.

That remainder turned out to be unstaffable, for two reasons that only became visible when the role was described concretely:

- **Aisahub has no UX specialists.** A Reviewer asked to judge whether a finding is a real defect needs expertise nobody on the team has.
- **The role bundled two very different workloads.** Authoring all the content (tens of hours) and reading reports (about an hour per Stage) were assigned to one person, which made the whole role look impossible when only the first half actually was.

Unbundling helped: content authoring is an *offline* activity that a language model can do outside the product, on an existing subscription, with no API account and no runtime dependency. What remained was reading five reports per Stage.

Removing even that verdict — accepting a well-formed report without judging it — was considered and is what this ADR builds on, but on its own it fails: **work nobody reads degrades.** The first report is written carefully, the third is not, and the Self-Audit Report is the programme's only evidence of ability.

A fixed practice page resolves both problems at once, and was proposed by the decision-maker.

## Decision

**Stage 1's Self-Audit Report is performed against a Practice Page authored by this project**, not against the Learner's own work.

- The Practice Page is built by us and carries **Planted Defects** — defects deliberately introduced, one or more per Stage 1 Competency. Stage 1 plants **six** across the four Competencies, so the count carries no hint about how they are distributed. **The number is not disclosed until after submission.**
- A Learner examines the page unaided, submits at least three Findings, and **on submission immediately sees the full list of Planted Defects** with an explanation of each.
- Each Finding records the **page element** as a structured selection, the **UX Principle** as a Glossary selection, plus a free-text defect description and proposed fix.
- **There is no verdict and no human reviewer.** The platform checks form only: three or more Findings, each naming a distinct element, each citing a Principle that exists.
- The Practice Page's **source is published on GitHub**. A Learner may optionally fix a defect and submit an issue showing the corrected interface; the platform stores the issue link. This is not required for Completion, and a screenshot satisfies it — no code is necessary.
- **The reference answer is what we planted, not what a model inferred.** No page is analysed to discover what is wrong with it; we know, because we put it there.

**Consequently, the Reviewer role no longer reviews anything and is renamed Maintainer** (운영자). What remains is administration: the access allowlist, watching per-item pass rates for defective Quiz Items, and keeping the Practice Page and content current.

**Auditing the Learner's own real work is out of scope for Stage 1.** Where it returns is **not decided here.** Stage 2 is the obvious candidate and is what this ADR's author proposes, but that is a proposal, not a decision: Stage 2's design has not been taken up, and nothing in this ADR should be read as having settled it. What *is* decided is only that Stage 1 does not do it.

This distinction matters because the deferral is the largest cost of this decision. Recording it as "moved to Stage 2" would make it look handled. It is not handled; it is open.

## Rationale

- **Feedback becomes immediate and specific, at zero human cost.** "You found three of six; you missed the readability defect in the help text" is better feedback than a human verdict days later, and it is the drop-out driver ([ADR-0003](0003-full-application-not-static-scaffold.md)) that the no-verdict design would have made worse.
- **Planting beats analysing.** If a model is asked what is wrong with an existing page, the reference answer is an inference: it may invent a defect, and it will miss ones a Learner then gets marked down for finding. Because we author the page, the reference answer is a fact about our own work with no failure mode. This is the one place in the design where ground truth is available, and taking it is free.
- **Authoring the page also guarantees coverage.** A real page may contain three readability problems and no hierarchy problem at all. A planted page contains exactly what Stage 1 teaches, which no real page can be relied on to do.
- **The detection skill the programme exists to build survives.** What the Learner loses is only the choice of page. Nothing on the Practice Page is annotated or pointed at; finding the defects is still unaided, which is the property that distinguishes this from a Gate Quiz.
- **Everyone facing identical input makes the cohort comparable for the first time.** Which defects were missed, and whether Seoul and Jakarta missed the same ones, becomes measurable. This turns the convergence question the spec previously called unmeasurable into a controlled comparison, at no extra cost.
- **Submitting a fixed interface is a stronger demonstration than describing a fix.** Describing and doing are separated by a real gap. Accepting a screenshot in an issue keeps this open to PMs, who cannot be asked for a pull request.
- **The rename is not cosmetic.** This project exists to make a team name the same thing the same way. Leaving a term in its own glossary that describes work the role no longer performs would undercut the premise on the first page.

## Considered alternatives

- **Own work, human Reviewer** (the previous design). Strongest benefit: the audit produces a real artefact against real client work, which is what the programme is ultimately for. Rejected because the team has nobody qualified to judge whether a finding is real, and because the reports of five people auditing five different pages are not comparable to each other in any way.
- **Own work, LLM judge.** Strongest benefit: no human bottleneck while keeping real work as the subject. Rejected because it reintroduces the separately-billed API account whose avoidance drove ADR-0006, and because a model that has never seen the page cannot verify a finding is real — it can only check form, which is the same check that made the pre-screen worthless.
- **An existing page with a model-generated reference answer.** Strongest benefit: no page to build. Rejected as described in the rationale: an inferred reference answer marks correct findings wrong and invents defects that are not there. Building the page is cheaper than the resulting arguments.
- **Own work, form-checked, no verdict.** Strongest benefit: the simplest possible design, zero human load, real work as the subject. Rejected because unread work degrades, and this design has no reader at all — not a person, not a model, not a reference answer.
- **Drop the Self-Audit Report entirely.** Strongest benefit: the programme reduces to four objective quizzes and needs almost nothing. Rejected because the programme would then measure only recognition, which the problem statement identifies as the thing that does not transfer.

## Consequences

- **Stage 1 no longer requires anyone to look at Aisahub's real products, and nothing yet guarantees that any later Stage will.** This is the real cost, and it is accepted deliberately rather than absorbed silently: the programme is preventive, and prevention eventually has to touch the actual delivery work. **The obligation to decide where that happens is created here and discharged nowhere** — an open item, not a scheduled one.
- **The Practice Page becomes an authored asset with a maintenance cost**, alongside the Quiz Items and the Principle Glossary. It is a real page with real markup, published source, and a planted-defect manifest that must stay in sync with it.
- **Answers leak.** Once one Learner has submitted, they know all six defects and can tell a colleague. There is no certification at stake and two colleagues discussing UX defects is the behaviour the programme wants, so this is tolerated rather than defended against. If a second cohort ever matters, the page is rotated.
- **A planted page is artificial.** Real defects are arguable and entangled; planted ones are clean. Learners will get good at finding planted defects first. The mitigation is to derive each planted defect from something that actually occurred in Aisahub's delivery work, so the artificiality is in the arrangement rather than in the defects themselves.
- **Findings are now structurally comparable across Learners and languages**, because the element and the Principle are both selections rather than typed text. This is what makes the missed-defect statistics possible.
- **Automatic scoring becomes possible and is deliberately not enabled.** Since both the element and the Principle are structured, and we know which elements carry planted defects, the platform could score a Finding as correct or incorrect without any model. The MVP stores the data but attaches no verdict to it, because the decision to gate on it has not been taken. Turning it on later is a policy change, not a schema change.
- **A Learner can still submit three well-formed but wrong Findings and reach Completion.** The reference answer shown immediately afterwards tells them so, but nothing stops them. This is the accepted floor of a design with no verdict.
- **The agreement mechanism changes meaning.** Agreeing with another Learner's Finding is no longer a substitute verdict — the reference answer already provides that. It becomes the cross-location convergence signal, and it is the only place two locations are known to have faced identical input.
- **The Reviewer dashboard becomes the Maintainer dashboard** ([ADR-0005](0005-progress-visibility-for-a-distributed-cohort.md)) and gains one panel: which Planted Defects are most often missed. A defect nobody finds is either badly planted or genuinely hard, and the difference matters.
- **The Self-Audit Report rubric ceases to exist.** A rubric is grading criteria, and nothing is graded. What survives is the brief — a statement of what a complete submission contains. The observable-checklist work that was planned for the rubric is not lost: it becomes the form's own constraints, which the platform enforces rather than a person applying.
- **Report revisions, statuses, and the review queue are all removed.** Each existed only to carry a verdict through its lifecycle. A report is now either absent or submitted.
- **The Competency statements are reworded** from "on a page they built" to "given a page". The ability is unchanged; only Stage 1's subject moved, and a Competency describing something Stage 1 no longer asks for would misdescribe its own assessment.
- **The `Reviewer` term is renamed across `CONTEXT.md`, every ADR, and both specs.** No code exists yet, so the rename costs one pass over the documents. Older ADRs keep the word as originally written, with a note pointing here — rewriting them would falsify the record of what was decided when.

## Follow-up work

- ~~Build the Practice Page, deriving each Planted Defect from a real Aisahub screen rather than inventing it, and keep the manifest in the same commit as the markup.~~ **Closed 2026-07-22 by issue #15** — built at `content/practice-page/`, manifest beside the markup in the same commit. The derive-from-a-real-screen mitigation was waived by the decision-maker during review: the defects are authored from the Stage 1 curriculum's recurring archetypes instead, accepting the artificiality consequence above rather than mitigating it.
- ~~Verify each Planted Defect is findable from a screenshot alone; anything requiring interaction belongs to Stage 2, not Stage 1.~~ **Closed 2026-07-22** — all six are static visual states (contrast, size, spacing, text density, naming, styling); none requires clicking, waiting, or erring.
- ~~Confirm the six planted defects are not evenly one-per-Competency-plus-two, which would let a Learner reason about the distribution instead of looking at the page.~~ **Closed 2026-07-22** — planted 3-1-1-1 (three on visual-hierarchy), and `test/practice-page.test.ts` fails the suite if the spread ever becomes even.
- **Decide where own-work auditing happens, as its own decision.** It is currently nowhere. Stage 2 is the proposal; whether the programme should instead reach real product pages earlier, or alongside Stage 1, is untested and unargued. This item stays open until an ADR closes it.
- After the first cohort, review which Planted Defects were missed most often, and whether the two locations missed the same ones.
