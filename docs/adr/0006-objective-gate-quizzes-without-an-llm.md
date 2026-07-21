---
status: accepted
---

# Assess Gate Quizzes with objective scenario items, removing the LLM entirely

## Background

> **Amended 2026-07-21, same day.** Reviewing the resulting spec surfaced a failure mode this ADR had not accounted for: with objective items, showing a failing Learner the correct answers and letting them retry the same items turns the retry into a memory test. The remedy belongs here rather than in a separate ADR, because it is a direct consequence of choosing objective items and it changes this decision's authoring cost. Amendments are marked inline.

The programme was designed around free-text Gate Quiz answers judged by an LLM against a four-criterion rubric, on the principle that understanding is proven by explanation rather than recognition. That design carried a specific operational requirement: a separately-billed Anthropic API account, since a Claude Code subscription cannot authenticate a server (ADR-0003).

Verified facts that shaped this decision:

- The grading spend itself is immaterial — roughly `$2.40` across the entire programme (ADR-0003). The objection was never the amount; it was standing up and maintaining a second billing relationship for an internal training tool.
- The LLM was the source of most of the project's uncertainty: non-deterministic verdicts requiring a repeat-grading check before enrolment, model selection deferred to a pre-launch evaluation, rubric tightening if agreement failed, and — after the cohort expanded — separate verification in Korean and English (ADR-0002).
- The Gate Quiz is not the load-bearing assessment. Ability is proven by the Self-Audit Report, which is human-reviewed regardless of how quizzes are graded.

## Decision

Gate Quiz items are **objective** — the Learner selects among presented options and the platform scores against a stored answer key. **No LLM is called anywhere in the product.** The Self-Audit Report pre-screen is removed with it; a Reviewer reads submitted reports directly.

Items must be **scenario-based**, not recall-based. Every item presents a concrete artefact — a screenshot, a described page, a pair of alternatives — and asks for a judgement about it. Formats that qualify: identify the defect in this screenshot; choose which of these fixes to do first; decide which of two treatments should win. Formats that do not: define this term; which of the following is a principle of X.

Authoring rules:

- Distractors must represent mistakes a Learner could plausibly make, not filler. An item whose wrong answers are obviously wrong tests nothing.
- No "all of the above" or "none of the above".
- Every item remains answerable from the source article's text alone (carried forward from ADR-0002).
- Every item exists in English and Korean, testing the same thing at the same difficulty.

**Retry rules** (amendment). Objective items make a failed attempt convertible into a passed one without any learning in between, which free-text answers did not. Three rules close that, and no mechanism beyond content and storage is needed for any of them:

1. **Items are drawn, not fixed.** Each Competency carries a pool of 8 authored items; an attempt draws 5 at random and records which. Two attempts are never guaranteed to be the same five.
2. **A failed attempt is told which items were wrong and which section of the source article covers each — never which answer was correct.** Every item therefore carries an article-section pointer as a required authored field.
3. **Attempts are unlimited with no cooldown, and the attempt count is shown to the Reviewer** beside the Self-Audit Report.

The pass threshold is 4 of 5. Pool size, draw size, and threshold are content configuration, not code constants.

**Scope of this decision.** It governs the Gate Quiz and nothing else. The Self-Audit Report is unchanged: it was always written by a Learner and read by a human Reviewer, and no LLM was ever proposed for judging it. Only the Report's automated *pre-screen* is removed, because that was the one place an LLM touched it.

> **Superseded in part by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md).** The Self-Audit Report did not stay unchanged for long: the human verdict was removed, the Stage 1 subject became an authored Practice Page whose reference answer is revealed on submission, and the "Reviewer" role was renamed Maintainer. This ADR's own decision — objective Gate Quizzes with no external model API — is untouched, and ADR-0007 extends its logic rather than reversing it. Remaining occurrences of "Reviewer" below are left as written.

Non-goal: free-text answers are not collected **in the Gate Quiz**, in any form. A half-measure — collecting writing in the quiz but grading it later by hand — was considered and rejected below. This says nothing about the Self-Audit Report, whose defect descriptions and proposed fixes are free text by design and are read by a person.

Non-goal: a retry cooldown or attempt limit. Rejected below.

## Rationale

- The stated objection was organisational, not financial, and no amount of cost analysis addresses it. Removing the dependency addresses it completely.
- What the LLM bought was early detection of the fluency illusion — a Learner who recognises the material but cannot produce it. That detection is not lost, only delayed: the Self-Audit Report requires unaided production against a real page, which no amount of recognition can fake. The cost is later feedback on that specific failure mode, not its absence.
- Removing the LLM removes disproportionately more than it costs. Gone with it: the Grader seam and its test double, model selection, the grading-consistency verification, structured outputs, API key custody, the system-failure-versus-failed-attempt distinction, rubric tightening, and per-language grading verification. **No seam remains inside the application**, and every component runs for real in tests. Two qualifications, both added by the amendment below: the item draw is random, and Google's OAuth exchange sits at the edge — neither needs a seam, and the spec records how each is handled.
- Scenario-based objective items test the same action the programme is about. "Find the element whose visual weight does not match its importance, in this screenshot" is the Competency, narrowed to four options. That is a smaller step from the Self-Audit Report than a definition question would be.
- **Withholding correct answers is what carries the retry rule** (amendment); the rotating draw supports it but cannot replace it. Being shown an item without being told its answer leaves the Learner where they started — needing the article. Being shown the answer removes the need for the article entirely, and no amount of item rotation compensates for that on the items that do repeat.
- **A cooldown was the obvious defence and is the wrong one** (amendment). It stops nobody determined to grind, since waiting costs only patience, while it does stop the Learner trying to finish a Competency before they log off. The visible attempt count achieves the actual goal — a Reviewer knowing that someone passed on their sixth try — without penalising anyone.
- The pre-screen was a throughput optimisation for a volume that does not exist. With a handful of Learners, a Reviewer reading the report directly is both faster and better — the pre-screen could only ever check form, never whether a finding was real.

## Considered alternatives

- **Keep LLM grading of free text.** Strongest benefit: immediate, specific feedback on a Learner's own explanation, which is the highest-quality signal available. Rejected because it requires the separate billing relationship that motivated this decision, and because it carries the project's largest cluster of unresolved risk for a checkpoint that is not the load-bearing assessment.
- **Objective items plus one free-text question, stored and read by the Reviewer at report time.** Strongest benefit: preserves writing as a *learning* act — articulating an idea is itself instruction, not merely assessment — at zero API cost. Rejected by the decision-maker as unnecessary complexity: it adds an assessment artefact with no verdict attached, delayed feedback the Learner cannot act on, and reading load on the Reviewer.
- **A freshly authored quiz for every retry** (amendment). Strongest benefit: a retry shares nothing with the failed attempt, so the loophole closes completely. Rejected because it doubles the item count on the project's dominant cost centre, which bilingual authoring has already doubled once. The pool of 8 buys most of the benefit at 60% of the cost.
- **A retry cooldown, or a cap on attempts** (amendment). Strongest benefit: a hard stop on grinding, and trivial to implement. Rejected — see the rationale; it asymmetrically penalises the Learner who is engaged right now, and the visible attempt count gives a Reviewer better information than a lock gives anyone.
- **Objective items plus free-text graded by a human in the moment.** Strongest benefit: best feedback quality with no LLM. Rejected because a self-paced programme across two time zones cannot block a Learner on a person being awake; waiting is the primary drop-out driver (ADR-0003).

## Consequences

- **Item quality becomes the load-bearing risk of the assessment.** A badly-authored objective item is worse than a badly-authored open question, because it can be passed by elimination without any understanding. There is no grader to compensate for a weak item.
- Authoring cost per item rises. A good scenario item needs a real screenshot and three plausible distractors, each representing a specific misjudgement. This is harder than writing an open question, and it lands on the project's dominant cost centre, already doubled by bilingual authoring.
- **The item count per Competency rises again, from 5 to 8, to fund the retry rules** (amendment). Item artefacts are shared between the two language variants wherever they carry no readable text, which is the only discount available on this.
- **Every item gains a required authored field**: the section of the source article it derives from. Without it there is nothing to tell a failed Learner except that they were wrong (amendment).
- **The draw is random, which is the only non-determinism in the product** (amendment). It does not weaken the determinism that matters — scoring a recorded attempt is a pure function of its drawn set and selections — and it needs no seam, because a test reads the drawn set from the attempt record rather than assuming one.
- **A pool of 8 drawn 5 at a time exposes most of the pool within a few attempts** (amendment). If first-cohort attempt counts run high, the pool size is the number to raise; it is content configuration, so raising it is authoring work rather than a change to the application.
- **The pass rate in the Reviewer dashboard (ADR-0005) is promoted from a nice-to-have to the primary quality control, and its granularity moves from per-Competency to per-item.** It is the only mechanism that can reveal a defective item, and a Competency-level rate cannot: an item everyone passes is not discriminating; an item everyone fails is probably badly worded rather than genuinely hard. Because items are drawn rather than fixed, the rate is reported beside its draw count — a rate from three draws is not yet a signal.
- ADR-0003's rationale that "grading free-text answers requires an API key, which cannot be shipped to a static front end" is void. That ADR's decision stands on its remaining reasons — allowlist enforcement, per-Learner persistence across devices, the report and review workflow, and the Reviewer dashboard all require a server.
- Learners never practise articulating a UX principle in their own words before the Self-Audit Report. The first time they produce rather than select is the assessment that matters most.
- Reversing this decision after Stage 1 content is authored means rewriting every quiz item, since scenario items and open questions share no structure.

## Follow-up work

- Draft the first Competency's items and check each one against the scenario-not-recall rule; discard any item that can be answered without looking at the artefact.
- Verify each item's distractors by asking someone who has not read the article to attempt it — an item they can pass by elimination needs better distractors.
- After the first cohort, review per-item pass rates and rewrite any item at or near 100% or 0%, once it has been drawn often enough for the rate to mean anything.
- Confirm no code path calls an external model API before shipping, so the no-LLM property is a fact about the system rather than an intention.
- Cover the withheld-answer rule with a test that fails loudly, so a later improvement to the feedback screen cannot quietly reopen the loophole.
- After the first cohort, review attempt counts alongside per-item pass rates. High attempt counts with high eventual pass rates mean the pool is too small, not that Learners are weak.
