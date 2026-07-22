---
status: accepted
---

# Admit Learners by an explicit allowlist over Google sign-in, not by email domain

## Background

ADR-0003 restricted sign-in to the `@aisahub.com` Google Workspace domain, on the assumption that every Learner held a company Workspace account. That assumption does not hold.

Verified facts:

- Aisahub hires developers in Indonesia as well as Korea. Indonesia-based staff are employees, not contractors or an external party.
- Indonesia-based staff have **no company email address**; they use personal accounts, reported as Gmail.
- Domain-based authorisation is therefore impossible for that cohort: there is no domain that identifies them.
- Google sign-in is not restricted to Workspace accounts — any Google account, including a personal Gmail account, can authenticate through it. The Workspace restriction in ADR-0003 was our own rule layered on top, not a property of the mechanism.

The initial request was for "account and password login with registration" so that staff without a company domain could get in. That names a mechanism; the underlying need is admitting a known set of people who cannot be identified by domain.

## Decision

**Authentication stays Google sign-in for everyone.** One button, one flow. Korea-based Learners use their `@aisahub.com` Workspace account; Indonesia-based Learners use their personal Google account.

> **The "Reviewer" role in this ADR is renamed Maintainer by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md).** Managing the allowlist is one of the responsibilities that survived; only the name changed. Occurrences below are left as written.

**Authorisation moves from a domain rule to an explicit allowlist**, stored in the database and editable by a Reviewer. An entry is an email address or the wildcard `@aisahub.com`, so the Korean cohort remains covered by one line while Indonesian colleagues are listed individually. A successful Google sign-in whose email is not on the allowlist is rejected with an explanation, not a blank failure.

Explicit non-goals: **no password storage, no registration form, no email verification, no password reset, and no email delivery of any kind.** Removing a Learner is removing their allowlist entry.

Boundary: this assumes every Indonesia-based Learner has a Google account. If any use a non-Google provider, this ADR must be revisited — a one-time email link would be the fallback, and it reintroduces the email-delivery dependency this decision avoids.

> **Amended 2026-07-21. The assumption is accepted rather than confirmed, and sign-in is built on it.** The Background above already records that Indonesia-based staff use personal accounts "reported as Gmail", so what is being accepted is a report, not a guess; what is being skipped is the per-person check before first enrolment.
>
> The trade is deliberate. Holding the largest piece of the MVP until every Learner has been individually confirmed stalls a build on an answer that changes nothing about how the build proceeds, while the recovery if the assumption is wrong for one person is that they create a free Google account — minutes of work, no cost, no code. **A risk whose worst case is a two-minute task is not worth blocking a build on**, and the failure surfaces at that Learner's first sign-in rather than silently.
>
> The documented fallback is unchanged and is still not being built. If a Learner cannot or will not hold a Google account, this ADR is revisited and the one-time email link under "Considered alternatives" is the route, along with the email-delivery dependency it brings back.

## Rationale

- The need is *admitting known people*, and authentication mechanism is orthogonal to it. Reaching for passwords conflates the two: a password proves identity, it does not decide who is allowed. The allowlist is the part that actually does the work, and it is required under any mechanism because personal email addresses cannot be pattern-matched.
- Passwords are a strict superset of the work, not an alternative to it. Password registration still requires email delivery — for verification, and again for reset — so it does not escape the email dependency; it adds a registration form, a verification flow, a reset flow, strength rules, and lockout policy on top. The "forgot password" flow *is* a one-time email link with an extra step appended.
- Google sign-in removes email delivery entirely, which also removes its failure modes: spam filtering, delivery latency, and a login path that depends on infrastructure we neither own nor monitor.
- Not storing credentials means no credential-breach surface and no password-handling responsibility for a small internal tool. This is the single largest security reduction available here, and it costs nothing.
- The allowlist is honest about what it models. With a handful of staff on personal addresses, someone must decide who is in — encoding that as data with an owner is clearer than inferring it from an email suffix that half the cohort does not have.

## Considered alternatives

- **Open registration with email and password.** Strongest benefit: no allowlist to maintain, and new staff self-serve. Rejected because an internal training platform with self-service signup admits anyone who can type an email address, which is a larger exposure than the problem warrants; and because it is more implementation work than the chosen option, not less.
- **Invite-only with passwords.** Strongest benefit: closed like the chosen option, and familiar to users. Rejected because it keeps every cost of password handling — delivery, reset, storage via a provider — while the allowlist already solves the admission problem on its own.
- **One-time email link (magic link).** Strongest benefit: no passwords, and works for Learners without a Google account. Rejected as the primary mechanism because it reintroduces email delivery and its failure modes for no gain when every Learner already has a Google account. Retained as the documented fallback if that turns out to be false.
- **Issue Google Workspace accounts to Indonesian staff.** Strongest benefit: restores the clean domain rule. Rejected as out of the project's control and disproportionate — per-seat licensing for an entire cohort to simplify one internal tool's sign-in.

## Consequences

- Onboarding an Indonesia-based Learner requires a Reviewer to add their address first. There is no self-service path, which is deliberate but does mean a new hire is blocked until someone acts.
- The allowlist becomes a small piece of state that must be maintained and audited. Nothing prunes it automatically; a departed employee's personal Google account keeps working until their entry is removed.
- Learners cannot be identified by email domain anywhere in the system, and location is deliberately not stored either — nothing in the design reads it, and language preference, which the Learner sets, carries everything that varies between the two cohorts. A future feature that genuinely needs location must add a field and ask, not infer one from an address.
- If the no-Google-account assumption fails for even one Learner, a second authentication path must be added, and the "no email delivery" property of this decision is lost.
- ADR-0003's sign-in decision is superseded by this one; the rest of ADR-0003 stands.

## Follow-up work

- ~~Confirm every Indonesia-based Learner has a Google account before the first enrolment; if any do not, revisit this ADR before building sign-in.~~ **Closed 2026-07-21 by the amendment above** — accepted rather than confirmed, so sign-in is no longer blocked on it. A Learner without a Google account now surfaces at their own first sign-in, and the response is the amendment's, not this check's.
- Verify that an address absent from the allowlist is rejected after a successful Google authentication, and that the Learner sees why rather than a blank error.
- Verify that the `@aisahub.com` wildcard entry admits a Workspace account not listed individually.
- ~~Define who owns allowlist maintenance and where removal happens in the offboarding process.~~ **Closed 2026-07-22 by decision in issue #7** — Chloe owns the allowlist and removes entries by hand as people leave, personal-account entries included; removal is not tied to a step in a formal offboarding process.
