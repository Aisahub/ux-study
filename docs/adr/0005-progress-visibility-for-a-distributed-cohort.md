---
status: accepted
---

# Build progress mechanics and a Reviewer dashboard, reversing an earlier exclusion

> **Renamed by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md).** "Reviewer" throughout this ADR is now **Maintainer** — the role stopped reviewing anything when the human verdict was removed, but every reason for the dashboard survives unchanged, because none of them was ever about judging a report. The dashboard gains one panel there: which Planted Defects are most often missed.

## Background

An earlier scoping pass excluded gamification and an administrative dashboard from the MVP, for two stated reasons:

- A leaderboard among a handful of colleagues demotivates whoever is last, and the programme's value proposition is fewer interface defects, not a score.
- With so few Learners, asking someone how they are getting on is faster than building a dashboard to display it.

Both arguments were sound. Both rested on the same unstated premise: **that the cohort was a single colocated team whose members see each other daily.**

That premise no longer holds. Aisahub hires in Korea and in Indonesia; Learners are distributed across countries, time zones, and — for the Indonesia cohort — outside the company's Google Workspace entirely. The facts that change the conclusion:

- "Just ask them" is not available across locations. A Reviewer in Seoul cannot notice that a Learner in Jakarta stalled three weeks ago.
- Social dynamics differ. A ranking among five people at adjacent desks reads as a public verdict on a colleague; the same ranking across a distributed cohort of near-strangers behaves like ordinary progress feedback.
- The programme is self-paced with no deadline, which makes drop-out the primary failure mode (ADR-0003). Distribution removes the ambient social pressure that partly substituted for explicit progress mechanics.

## Decision

Both are in scope for the MVP.

**Progress mechanics** show a Learner their own advancement — Competencies cleared, Stage completion, streaks or equivalent — and are calculated from existing assessment records. Comparative display (any ranking of one Learner against another) is **excluded**: the argument that it demotivates the person at the bottom was never contingent on colocation, and remains valid.

> **Amended 2026-07-21.** A board of the **Findings** most Learners agreed with is now in scope, with the author's name attached. This is not the exclusion above being reversed, and the difference is mechanical rather than a matter of framing: **a leaderboard assigns every Learner a position and therefore has a bottom; a board of highlighted Findings does not.** Most Learners appear nowhere on it, and appearing nowhere is not a rank. Progress remains unranked, and agreements are still **never totalled per person** — a cumulative per-person score is additive, and an additive score makes ten mediocre Findings beat three good ones. What the board rewards is a Finding expressed clearly enough that colleagues recognised it, which is the ability the programme exists to build.

**A Reviewer dashboard** shows, across all Learners: position in the programme, time since last activity, and pass rates. Its purpose is to surface a stalled Learner and a badly-worded quiz item — not to rank people.

> **Amended 2026-07-21 by [ADR-0006](0006-objective-gate-quizzes-without-an-llm.md).** Pass rates are reported **per item**, not per Competency: a Competency-level rate cannot identify which item is defective, and identifying that is the whole purpose. Each rate is shown beside the number of times the item was drawn, since items are drawn from a pool rather than presented to everyone. The dashboard also shows how many attempts each Competency took, which is what makes an unlimited-retry Gate Quiz safe to offer.

Non-goals: no notification or email of any kind, no Learner-visible view of another Learner's progress, no export or reporting surface.

## Rationale

- The two original arguments were premise-dependent, and the premise was falsified. Keeping the conclusion after its supporting facts changed would be inertia, not consistency.
- Drop-out is the failure mode this programme is most exposed to. In a colocated team, noticing a stalled colleague is free; distributed, it requires either a dashboard or nothing. Nothing is not acceptable when the programme's whole value depends on people finishing.
- Pass rates are diagnostic, not managerial. A question everyone fails is far more likely to be a badly-worded question than four badly-prepared Learners — and there is no other way to notice that, since a Learner who fails assumes the fault is theirs.
- Excluding comparative ranking preserves the part of the original reasoning that still holds. The reversal is scoped to what the changed premise actually invalidated, not applied wholesale.

## Considered alternatives

- **Keep both excluded and rely on asking.** Strongest benefit: no build cost, and the original reasoning stays intact. Rejected because the mechanism it depends on — informal daily contact — does not exist across two countries.
- **Dashboard only, no progress mechanics.** Strongest benefit: solves the Reviewer's visibility problem, which is the harder one, at half the cost. Rejected because it addresses drop-out only after the fact: it tells a Reviewer that someone stopped, without giving the Learner a reason to continue.
- **Include a leaderboard.** Strongest benefit: the strongest motivational pull of the available mechanics. Rejected on the original argument, which distribution does not repair — a visible ranking still tells the person at the bottom, in front of colleagues, that they are last.

## Consequences

- MVP scope grows by two surfaces beyond the original boundary, on top of the bilingual authoring load from ADR-0002. Stage 1 remains four Competencies; the platform around it is larger.
- Progress mechanics are read-only projections over assessment records, consistent with ADR-0003's "progress is derived" decision. They introduce no new source of truth and cannot drift from the underlying attempts.
- The dashboard exposes one Learner's activity to a Reviewer. With a small internal cohort this is proportionate, but it is a real change in what the platform reveals about individuals, and Learners should not discover it by accident.
- Motivational mechanics are hard to withdraw. Once Learners see points or streaks, removing them reads as a downgrade — so the shape chosen now is close to permanent, even though the code is not.

## Follow-up work

- Confirm no Learner-facing surface exposes another Learner's progress, including through the dashboard route or its data layer.
- Tell Learners that a Reviewer can see their progress and inactivity, rather than leaving them to infer it.
- After the first cohort, check whether any Gate Quiz item has a pass rate low enough to indicate a wording defect rather than a knowledge gap, and rewrite it.
