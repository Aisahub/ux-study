---
status: accepted
---

# Build a full stateful application rather than a static site plus GitHub Issues

## Background

The programme is self-paced with no deadline, which makes drop-out — not difficulty — the primary failure mode. Each Learner passes through 16 assessment points (12 Gate Quizzes, 4 Self-Audit Reports), and Learners are Aisahub staff, currently a handful of developers and PMs.

Facts constraining the choice:

- Progress state is per-Learner and long-lived; a Learner may be mid-Stage for weeks.
- ~~ADR-0002 places all Gate Quiz grading on judgement of free-text answers, which requires an LLM call rather than a lookup table.~~ **No longer true — see [ADR-0006](0006-objective-gate-quizzes-without-an-llm.md)**, which records the grading-cost and credential analysis that originally sat here and why it ceased to apply.
- The organisation already runs Neon Postgres and Google Workspace, and already builds Next.js applications for clients — this is the team's standard stack, not new ground.
- The repo is already configured for GitHub Issues (`docs/agents/issue-tracker.md`), so an issue-based workflow was available at no setup cost.
- Learners are distributed across Korea and Indonesia, so anything requiring a person to act — a review, a nudge to someone who stalled — spans time zones.

## Decision

Build a full application: **Next.js, Neon Postgres, Google sign-in.**

> **Sign-in superseded by [ADR-0004](0004-access-by-allowlist-over-google-sign-in.md).** This ADR originally restricted sign-in to the `@aisahub.com` Workspace domain. Aisahub also hires in Indonesia, where staff have no company email address, so admission moved to an explicit allowlist over the same Google sign-in. The rest of this ADR stands.

Progress, Gate Quiz submissions and scores, and Self-Audit Report state are stored in Postgres.

> **Grading superseded by [ADR-0006](0006-objective-gate-quizzes-without-an-llm.md).** This ADR originally specified server-side LLM grading of free-text answers via the Claude API, requiring a separately-billed Anthropic account. Gate Quizzes are now objective and scored against a stored answer key; **no external model API is called anywhere in the product**, and the Self-Audit Report pre-screen is removed. The application shape decided here is unchanged.

Boundaries: there is no registration and no role hierarchy. Anyone admitted is a Learner; Reviewer capability is a separate allowlist. (**"Reviewer" is renamed Maintainer by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md)**; occurrences of the old name below are left as written.)

## Rationale

- Under a no-deadline design, feedback latency is a drop-out driver. A Learner who submits a quiz answer and must wait for someone to run a grading job before learning whether they were right has been given a reason to stop.
- ~~Grading free-text answers requires an API key, which cannot be shipped to a static front end. Instant feedback therefore requires a server regardless of how thin the rest of the application is.~~ **Void as of [ADR-0006](0006-objective-gate-quizzes-without-an-llm.md)** — Gate Quizzes are objective and score against a stored answer key, so grading no longer implies a server. The decision stands on the reasons below, which were always independent of it.
- Admission is an allowlist (ADR-0004), which must be enforced server-side; a client cannot be trusted to decide whether it is allowed in.
- Progress is per-Learner and must survive a change of device or a cleared browser, which requires storage the Learner does not control.
- ~~The Self-Audit Report workflow spans two actors — a Learner submits, a Reviewer decides~~ **— superseded by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md)**, which removed the human verdict entirely and renamed the role Maintainer. The dashboard reason below is unaffected, and the decision stands on it: the Maintainer dashboard reads across all Learners, which is not expressible in a client-only application. So does the shared Practice Page and its reference answer, which must not be readable before submission — a client that holds the answers cannot withhold them.
- The usual argument against a full application — that it is disproportionate effort for five users — is weak here, because building this stack is the team's day job. The marginal cost over a static site is far smaller for Aisahub than for a team meeting the stack for the first time.
- Google sign-in reuses an existing identity source, so no credential storage, password reset, or account lifecycle is introduced.

## Considered alternatives

- **Static site with progress in `localStorage`, reports and grading via GitHub Issues.** Strongest benefit: shippable in days, zero operational surface, reuses the issue tracker already configured. Rejected because grading would be manually triggered, removing instant feedback at exactly the point where a self-paced Learner is most likely to disengage; and because PMs would be required to work in GitHub.
- **Light backend for grading only, progress in a database, no sign-in.** Strongest benefit: preserves instant feedback while avoiding an identity layer. Rejected because progress must be attributed to a specific Learner to drive review scheduling and Peer Review pairing, and an unauthenticated link cannot do that reliably.
- **No site at all — markdown in the repo plus GitHub Issues.** Strongest benefit: fastest possible validation of the core assumption. Rejected because it does not resemble a learning platform, and the request was explicitly for a site staff would use.

## Consequences

- The project acquires a deployed service with a database that must be maintained beyond the programme's first cohort.
- The application holds no third-party API credential of any kind (ADR-0006). Its only external dependency is Google sign-in.
- Admission is controlled by data rather than by domain; see ADR-0004 for what that costs and requires.
- Gate Quiz scoring is deterministic, so the same submission always produces the same result and the application has no non-deterministic component to test around.
- MVP scope remains Stage 1 only (4 Competencies). The stack decision does not widen content scope.

## Follow-up work

- ~~Verify the Google Workspace domain restriction actually rejects a non-`@aisahub.com` account before the first Learner is enrolled.~~ **Superseded by ADR-0004** — there is no domain restriction. Verify instead that an allowlisted personal Gmail address is admitted and that any address absent from the allowlist is rejected with an explanation.
- Confirm a Neon project and branch for this application, separate from any client project.
- Sequence the tickets so the readability spike from ADR-0002 completes before content authoring begins; application scaffolding may proceed in parallel with it.
- Confirm a Neon branch is used for tests and is separate from the branch serving Learners.
