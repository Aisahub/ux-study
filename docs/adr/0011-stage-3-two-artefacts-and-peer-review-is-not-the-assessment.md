---
status: accepted
---

# Stage 3's subject is two artefacts, and Peer Review stops being the assessment

## Background

[ADR-0009](0009-every-stage-audits-an-authored-subject.md) fixed that every Stage
audits a subject this project authored and left two things open together: what
Stage 3's subject is, and "how Peer Review pairs with a Stage that already has a
reference answer." It stated the constraint on the second — Peer Review "must not
be specified as a verdict, since no assessment in this programme carries one" —
without saying what it contributes instead.

[ADR-0001](0001-curriculum-organised-by-defect-type.md) asked the same question
from the other end and has had it open since: "Define the Stage 3 'second person'
mechanism concretely, including what a Learner does when no second person is
available." Its Consequences section had already accepted that "Stage 3
Self-Audit Reports require a second person to exercise the interface, which is an
operational cost the platform must account for." Both items are closed here.

Constraints verified before deciding:

- **Stage 3's four Competencies** are jargon, mental-model mismatch, heuristic
  evaluation, and testing with real users (ADR-0001's amendment). ADR-0001
  describes the Stage as teaching "the two available routes out — becoming the
  outsider for someone else's work, and recruiting real outsiders."
- **The Learner is already an outsider to anything we author.** This is the
  structural oddity of Stage 3 and it has no equivalent in Stages 1 and 2. Stage
  3's defects are "structurally invisible from inside the author's own head," but
  a Learner auditing our page is not inside anyone's head — they have no
  assumptions in the way. A subject that is only a page with defects in it would
  make Stage 3 a harder Stage 1, not a different one.
- **A Learner reaching Stage 3 has already submitted Stage 1's report and been
  shown its Planted Defect manifest.** The Stage 1 Practice Page is therefore an
  artefact whose ground truth this Learner already knows — a property nothing else
  in the programme has, and one this decision uses.
- **The distributed cohort forbids a mechanism that waits on a person.**
  PRODUCT.md: anything requiring one person to notice something about another
  person does not work here, because "just ask them" is unavailable between Seoul
  and Jakarta, and drop-out rather than difficulty is the failure mode.
- **Agreement marks already exist and are already correctly shaped.** The
  `agreements` table records one Learner endorsing another's Finding, and its own
  comment states the rule this ADR must not break: it "Ranks Findings, never
  Learners; nothing anywhere totals these per person."
- **An inconsistency was found and is not resolved here.** ADR-0001's Decision
  section lists Stage 3 as "information architecture and naming, mental-model
  mismatch, accessibility", while its own later amendment enumerates jargon,
  mental-model mismatch, heuristic evaluation and testing with real users —
  accessibility is absent. `PRODUCT.md` and `DESIGN.md` both still assert that
  "accessibility is itself a Stage 3 Competency". The curriculum is ADR-0001's to
  settle, not this ADR's; see Follow-up work.

## Decision

**Stage 3's subject is two authored artefacts, and they do different jobs.**

### Artefact A — a page with a stated user

A single page, in both languages, carrying a short **stated user context**: who
uses it, in what situation, with what background. Its Planted Defects are defects
**relative to that user** — a word that is ordinary inside Aisahub and opaque
outside it; a structure that assumes the reader shares the builder's model of how
the thing works.

The stated user is what makes this Stage 3 rather than a harder Stage 1. A defect
here cannot be found by looking harder; it can only be found by answering "what
does *this* person know?" and getting a different answer than the builder would.

**The stated user describes background and situation, never a vocabulary list.**
"Runs a pharmacy in Jakarta, first time using any stock system, on a phone,
between customers" is the shape. "Does not know the word *reconciliation*" is not
— that hands over a Planted Defect in the brief that is supposed to set up the
hunt for it.

Artefact A is a **page, not a flow.** It does not inherit Stage 2's three-step
shape ([ADR-0010](0010-stage-2-subject-is-a-three-step-flow-that-never-branches.md)).
Stage 3's difficulty is the perspective required, not the interaction, and a
mental-model mismatch shows in naming, grouping and structure — all of which a
single page carries.

### Artefact B — a specimen Self-Audit Report, written about the Stage 1 Practice Page

A Self-Audit Report we authored ourselves, as if by a Learner, of deliberately
mixed quality: some Findings correct and argued against a named Principle; some
naming the right element and citing the wrong Principle; some that are taste in
principle's clothing; and at least one about something that is not a defect at
all.

**It reviews the Stage 1 Practice Page, not artefact A.** That is deliberate and
load-bearing. A specimen report about artefact A would be an answer key for
artefact A. The Stage 1 Practice Page is the one artefact whose manifest this
Learner has already been shown, so a review of it leaks nothing and the Learner
can spend their attention on the quality of the *review* instead of re-finding
defects they were told about a Stage ago.

Artefact B is the artefact the heuristic-evaluation Item Pool draws on, and it is
what a Learner practises reviewing. It is always present, needs nobody, and its
answer is known because we wrote both it and the manifest it is reviewing.

### The Stage 3 Self-Audit Report is unchanged in shape

The Learner audits **artefact A**, unaided, and submits at least three Findings,
each a selected element, a selected Principle, a written defect description and a
written proposed fix. The platform checks form only. The manifest is revealed on
submission and not before.

### Peer Review is not the assessment, and never gates Completion

**Peer Review is reading colleagues' submitted reports, and marking agreement with
individual Findings.** It becomes available to a Learner once they have submitted
their own Stage 3 report, on the same gate the Findings library already uses.

What it contributes is **exposure to how another head framed the same page** —
which elements someone else looked at, which Principle they reached for, which
defect they described in words you would not have used. That is the outside
perspective ADR-0001 named, delivered by artefact rather than by appointment.

What it does not contribute is a judgement about whether a Finding is real. The
Planted Defect manifest answers that, and a fellow Learner has no more UX
expertise than the author.

**When no second person is available, nothing changes.** No Gate Quiz, no report,
and no part of Completion depends on another Learner. A Learner who is the only
person at their Stage reviews artefact B, submits their own report, and reaches
Completion with nothing missing. Reading real colleagues' reports is what the
programme adds when other people happen to be there.

Nothing here totals agreement marks per person, ranks Learners, or gives anyone a
position relative to anyone else.

## Rationale

- **The stated user is the only thing that makes Stage 3's defect class
  detectable in an authored artefact.** Without it, "find the jargon" is a
  vocabulary exercise and "find the mental-model mismatch" has no model to be
  mismatched against. With it, both become the act the Stage exists to teach:
  answering a question about someone who is not you.
- **Assessing against an authored specimen is the only version of Peer Review
  that survives this cohort.** ADR-0001 recorded the second person as an
  "operational cost the platform must account for (scheduling, or an explicit
  lightweight substitute)." Between Seoul and Jakarta, on a self-paced programme
  with no deadline, scheduling is the cost that does not get paid. The substitute
  is not lightweight here — it is better, because it is always available and its
  answer is known.
- **Reviewing the Stage 1 Practice Page costs almost nothing and leaks nothing.**
  It reuses a page, a stylesheet and a manifest that already exist, and the one
  Learner property nobody else could use: by Stage 3, they have already seen that
  page's answer. Writing the specimen about a fresh artefact would cost a third
  subject and would have to be gated behind submission anyway.
- **Keeping Peer Review as exposure rather than as judgement is what ADR-0009
  required, stated positively.** ADR-0009 said what Peer Review must not be. The
  reason it cannot be a verdict — the reviewer is a peer with no more expertise —
  is also the reason it is worth having: what a peer *can* offer is a different
  pair of eyes on the same page, and that is a fact about their report, not a
  claim about yours.
- **Artefact A stays a page because Stage 3's difficulty is not interaction.**
  ADR-0010 accepted a large authoring cost for Stage 2 because that Stage's defect
  class is defined by operation. Paying it again where it buys nothing would land
  on the project's dominant cost centre for no gain.

## Considered alternatives

- **One artefact only: a page with a stated user, and Peer Review left as it is.**
  Strongest benefit: by far the cheapest, and it reuses every Stage 1 mechanism
  unchanged — one page, one manifest, one report. Rejected because heuristic
  evaluation then has no artefact of its own. The Competency is judging an
  evaluation against named heuristics rather than taste, and an item cannot ask
  that without an evaluation in front of it.
- **A colleague's real Self-Audit Report as the subject.** Strongest benefit: it
  is what CONTEXT.md already describes, it needs no authoring at all, and the
  outside perspective is genuinely another person's rather than a simulation of
  one. Rejected because ADR-0009 requires every Stage's subject to be authored by
  this project so the reference answer is known, and because it makes Completion
  wait on a colleague — the exact dependency this cohort cannot carry.
- **Peer Review as the assessment for heuristic evaluation.** Strongest benefit:
  it matches CONTEXT.md's current definition most closely, and it is the most
  honest version of "becoming the outsider for someone else's work" — a real
  stranger's page, a real reader. Rejected on availability, and on ADR-0009's
  finding that a peer can only answer "do I agree?", which is a convergence signal
  and not a verdict. `CONTEXT.md`'s Peer Review entry is amended by this ADR.
- **A specimen report about artefact A rather than about the Stage 1 Practice
  Page.** Strongest benefit: one subject for the whole Stage, so a Learner holds a
  single page in their head and the specimen's findings are immediately checkable
  against the artefact in front of them. Rejected because it is an answer key for
  artefact A, and gating it behind submission would put the heuristic-evaluation
  Gate Quiz after the Self-Audit Report — inverting the order every other
  Competency follows.
- **A stated user attached to Stages 1 and 2 as well, for consistency.** Strongest
  benefit: one authoring convention across all three subjects, and arguably better
  Stage 1 and 2 defects too. Rejected as a change to Stages that are already
  authored and, for Stage 1, already run against. The absence of a stated user is
  part of what makes Stage 1 assessable from a screenshot.
- **An artefact A that is a flow, matching Stage 2.** Strongest benefit: symmetry
  with ADR-0010, and a mental-model mismatch is often clearest across steps.
  Rejected as cost with no matching gain: Stage 3's defects are defined by the
  perspective needed, not by operation, and a page carries naming, grouping and
  structure perfectly well.

## Consequences

- **Stage 3 owes two authored artefacts instead of one**, but the second is
  cheaper than any subject so far — it is prose about a page that already exists.
  The stated user is a new authoring form with no precedent here and needs both
  languages describing the same person.
- **`CONTEXT.md`'s Peer Review entry is now wrong** and is amended in the same
  change as this ADR. It currently reads "One Learner assessing another Learner's
  Self-Audit Report… it is not a staffing compromise but the Competency itself."
  After this ADR, Peer Review is exposure to a colleague's report and is not the
  Competency's assessment.
- **ADR-0001's Consequences overstate the operational cost it named.** The line
  "Stage 3 Self-Audit Reports require a second person to exercise the interface"
  is no longer true of this design; the requirement is discharged by artefact B.
- **Writing a deliberately mediocre report is a strange authoring job and is the
  main risk in this decision.** Too weak and every flaw is obvious; too strong and
  there is nothing to judge. It also has to be mediocre *equally* in both
  languages, which is harder than authoring two good ones.
- **Nothing in Stage 3 measures whether a Learner can review a real colleague.**
  We will know they can judge a specimen we wrote. That is the same trade
  ADR-0009 accepted for real-work transfer, made a second time, and accepted for
  the same reason: a known answer is worth more here than a realistic one.
- **The stated user is a new thing a Learner could report as a defect.** It is part
  of the brief rather than part of the page, and must be served so that it cannot
  be mistaken for the artefact — the same rule that keeps the platform's own
  chrome out of the Practice Page response.
- **Artefact A must still meet WCAG 2.2 AA except where a Planted Defect
  deliberately does not**, and any such defect must be in the manifest. An
  accidental accessibility failure in the subject is indistinguishable from a
  planted one, which would make the reference answer wrong rather than incomplete.

## Follow-up work

- Author artefact A, its stated user, and its manifest (issue #77), and author
  artefact B (currently inside issue #75's scope — split it out if the specimen
  turns out to be larger than an Item Pool ticket).
- ~~**Settle whether accessibility is a Stage 3 Competency.**~~ **Settled
  2026-08-03: it is not.** The two records are not equal in standing. ADR-0001's
  Decision section named accessibility in a three-item sketch; the amendment
  that followed reworked that sketch into the enumerated curriculum and replaced
  two of its three items — "information architecture and naming" became jargon,
  and accessibility was dropped — so its absence is a rework, not an omission.
  The amendment also gave Stage 3 a stated structure that a fifth entry would
  break: two defect types that are structurally invisible from inside the
  author's own head (jargon, mental-model mismatch), plus the two routes out of
  it (heuristic evaluation, testing with real users). The amendment supersedes
  the sketch. This was therefore the documentation correction rather than the
  curriculum change: `PRODUCT.md` and `DESIGN.md` asserted the sketch and were
  corrected, `content/config.md`'s four slugs were already right, and WCAG 2.2
  AA remains a hard acceptance line on the platform itself — a stronger
  obligation than a Competency, and a different one.
- Amend `CONTEXT.md`'s Peer Review entry and ADR-0001's Consequences line in the
  same change as this ADR.
- Confirm artefact A's Planted Defects are undetectable without the stated user —
  if a defect can be found by someone who never read it, it belongs to an earlier
  Stage.
- After the first cohort reaches Stage 3, check whether anyone reads a colleague's
  report at all once it gates nothing. If nobody does, Peer Review is a feature
  with no users and should be removed rather than encouraged.
