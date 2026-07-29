---
status: accepted
---

# Every Stage audits a subject this project authored; own-work auditing does not return

## Background

[ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md) moved Stage 1's Self-Audit Report off the Learner's own client work and onto an authored Practice Page with Planted Defects. It deliberately refused to say where own-work auditing returns, and recorded the refusal in the strongest terms available to it: the obligation to decide "is created here and discharged nowhere — an open item, not a scheduled one." Stage 2 was named as the author's proposal and explicitly not as a decision.

That item has stayed open since 2026-07-22 while Stage 1 was built. It is closed here, in the opposite direction from the proposal.

## Decision

**No Stage of this programme assesses a Learner against a page from their own real client work.** All three Self-Audit Reports take a subject **authored by this project**, carrying Planted Defects, so that the reference answer is a record of what we did rather than an inference about someone else's page.

**Transfer to real work happens through the Principle Glossary, not through an assessment.** The Glossary entry carries a ready-to-say justification sentence and is built to be consulted mid-task; a Learner reaching for it during real client work *is* the programme operating on real work. That path already exists, is already the product's stated point (Product Principle 4), and needs no assessment to carry it.

What this does **not** decide: what Stage 2's and Stage 3's authored subjects actually are. Stage 2's defect class requires interaction to detect, so its subject cannot be a single static page — but whether that is a multi-step flow, a second Practice Page, or an extension of the existing one is untouched here. This ADR fixes only the property every such subject must have: **we wrote it, so we know what is wrong with it.**

## Rationale

- **Own work has no possible reader, and unread work degrades.** ADR-0007 established that a Self-Audit Report needs something to receive it, and that a design with no reader at all fails. The programme has exactly two kinds of reader available: a stored reference answer, and a human. The reference answer exists **only** because we authored the page. The human verdict was removed because Aisahub has nobody qualified to judge whether a finding is a real defect, and [ADR-0006](0006-objective-gate-quizzes-without-an-llm.md) removed the model. Placing own work in any Stage therefore places it in a Stage with no reader — the design ADR-0007 examined and rejected.
- **Comparability is a property of the whole cohort facing identical input.** ADR-0007 gained a controlled cross-location comparison by giving everyone the same page. That gain is not Stage 1's alone; a Stage where five Learners audit five different pages produces five artefacts that cannot be set beside each other, in Seoul or Jakarta or across them.
- **The preventive purpose is carried by vocabulary in daily use, not by an audited artefact.** The programme exists so that a developer proposing a UI change says the named thing instead of "this looks off". That happens in a pull request, not in a submission. Requiring the real page to also pass through the platform adds an assessment without adding the ability.
- **Ground truth now holds across the entire programme rather than its first third.** The one place in this design where the correct answer is a fact rather than a judgement is authorship. Keeping it everywhere costs content-authoring effort and buys the absence of every argument about whether a finding was real.

## Considered alternatives

- **Stage 3, bundled with Peer Review.** Strongest benefit: Stage 3 is the only Stage with a human reader, and CONTEXT.md already defines the peer reviewer as the outside perspective that Stage teaches — real work and a real reader arrive together. Rejected because the reviewer is a fellow Learner with no more UX expertise than the author, so the reader it supplies cannot answer the question own work actually poses ("is this a real defect?"); it can only answer "do I agree?", which ADR-0007 already reclassified as a convergence signal rather than a verdict.
- **Stage 2, as ADR-0007's author proposed.** Strongest benefit: the programme reaches real delivery work earliest, and the preventive purpose is cashed out sooner. Rejected because Stage 2 has neither reader — no reference answer, since the page is not ours, and no Peer Review, which belongs to Stage 3. It is the no-reader design at its most exposed.
- **An optional, un-assessed own-work report available after Stage 1.** Strongest benefit: the cheapest possible way to keep real work in the picture; nothing to grade, nothing to gate. Rejected for the same reason ADR-0007 rejected "own work, form-checked, no verdict": optional work that nobody reads is the case most likely to be skipped, and least likely to be done carefully when it is not.
- **Keep the item open.** Strongest benefit: no decision can be wrong. Rejected because an open item with no owner and no trigger is indistinguishable from a decision made by omission, which is the outcome ADR-0007 wrote its strongest paragraph to prevent.

## Consequences

- **The programme never touches Aisahub's real delivery work as an assessment, and this is now deliberate rather than pending.** ADR-0007 called this its largest cost and left it as a debt; the debt is not paid, it is cancelled. Future work must not reintroduce own-work auditing into any Stage without an ADR superseding this one — reopening it silently would restore an obligation the record says is closed.
- **Nothing in the programme measures whether the ability transfers to real work.** The evidence stops at the platform boundary: we will know which Planted Defects were missed and whether the two locations missed the same ones, and we will not know whether anyone found anything in a real client page. The signal that the programme worked is anecdotal and lives outside the product — a Glossary link in a pull request. This is the real cost of this decision and it is accepted with its eyes open.
- **Every Stage now owes an authored subject, and two of the three do not have one.** The Practice Page becomes a category rather than a single artefact, and the authoring cost that ADR-0007 accepted for Stage 1 is now accepted twice more. This lands on the project's dominant cost centre, already doubled by bilingual authoring.
- **Stage 2's subject must support detection-by-interaction.** Stage 1's follow-up work verified that all six of its Planted Defects are findable from a static screenshot, explicitly assigning anything requiring a click, a wait, or an error to Stage 2. Stage 2's subject therefore inherits a requirement Stage 1's does not have, and a single static page will not satisfy it.
- **Peer Review keeps its Stage 3 role but reviews a report whose reference answer already exists.** It is not the reader that validates the findings; the planted-defect manifest is. What Peer Review contributes is the outside perspective the Stage teaches, which is unchanged — but it must not be specified as a verdict, since no assessment in this programme carries one.
- **`CONTEXT.md`'s Self-Audit Report entry loses its open clause**, and PRODUCT.md's "Open, not undecided-by-omission" list loses its first bullet. Both are amended in the same change as this ADR.
- **ADR-0007's fourth follow-up item is closed by this ADR** and is struck through there, matching how its other items were closed.

## Follow-up work

- Decide and author **Stage 2's subject**: a walkable artefact whose Planted Defects require interaction to detect. Shape undecided — this ADR fixes only that we author it.
- Decide **Stage 3's subject**, and specify how Peer Review pairs with a Stage that already has a reference answer.
- When the first cohort finishes, revisit whether the absence of any real-work signal is tolerable. This ADR accepts that we will not measure transfer; it does not claim that will always be acceptable.
