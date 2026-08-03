# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Learners** are Aisahub developers and PMs, hired in two locations:

- **Korea** — work in Korean, hold `@aisahub.com` Google Workspace accounts.
- **Indonesia** — work in English, have no company email address and sign in with personal Google accounts.

Location determines working language and nothing else. The curriculum, the assessments, and the standard are identical for both cohorts.

The team has **no dedicated designers**. No prior design vocabulary can be assumed of any Learner — a Learner arrives able to build an interface and unable to say, in words that carry weight in a pull request, why one is worse than another.

A **Maintainer** is a Learner-shaped account with a flag on their allowlist entry. They keep the allowlist, the Practice Page, the content, and the watch on defective Quiz Items. They **judge nothing** — since ADR-0007 no assessment in the programme carries a human verdict.

Cohort size is currently a handful of people, not a class.

## Product Purpose

An internal UX learning platform that turns UX principles into **assessable abilities**, so that staff in Seoul and Jakarta judge the same interface against the same standard and describe it in the same words.

The purpose is **preventive, not remedial**. No client has rejected a delivery for usability and none has complained; the programme exists to establish a shared standard and vocabulary *before* the absence of either produces a visible failure. (ADR-0001 records that an earlier, remedial framing was invented during drafting and was corrected on 2026-07-21. Future work must not reintroduce it — the platform may not claim it fixes a problem the company has had.)

The concrete ability being built was named by a team member: without a principle's name, a developer proposing a UI change has only "this looks off", which carries no weight in a review. Success is that Learner saying the named thing instead — in a pull request, in a standup, to a client.

A Learner reaches **Completion** by passing every Gate Quiz and *submitting* a complete Self-Audit Report for each Stage. Submitting, not being approved.

## Positioning

Four mechanisms distinguish this from a generic course platform, and each was decided against a considered alternative:

- **It scaffolds around the source articles; it does not teach the material.** The corpus is NN/g (nngroup.com), which reserves reproduction rights. The platform authors only four things — the Principle Glossary, pre-reading questions, the Gate Quiz, and the Self-Audit Report structure — and links out for everything else. The reason is not only copyright: anything written here and gotten wrong does not stay inside the platform, because Learners quote it to clients.
- **Assessment is objective and calls no model.** Gate Quiz items are scenario-based selections scored against a stored answer key. **No LLM is called anywhere in the product** — no API account, no non-determinism, no per-language grading verification.
- **Stage 1 is assessed against a Practice Page this project authored**, carrying deliberately Planted Defects. The correct answer is therefore *known* rather than inferred, which is what makes a verdict-free assessment survivable.
- **The Principle Glossary is a working tool, not a study aid.** Each entry carries a ready-to-say justification sentence, in both languages, meant to be used during real client work. This is why every page carries its language in the URL (ADR-0008): a Glossary link pasted into a pull request is an artefact with a life outside the programme, and an address that renders differently per viewer is not reportable.

## Operating Context

- **Self-paced, no deadline.** Drop-out — not difficulty — is the primary failure mode. A Learner may sit mid-Stage for weeks.
- **Distributed across time zones.** Anything that requires a person to notice something about another person does not work here; "just ask them" is unavailable between Seoul and Jakarta. This is why progress is displayed rather than discussed.
- **Learning happens beside real work.** A Learner is a working developer or PM, not a student. The Glossary in particular is consulted mid-task.
- **Both desktop and mobile are primary** (confirmed 2026-07-23). Learners advance the programme on their work machine *and* in fragments away from it. Every flow must complete on a phone — including answering a Gate Quiz and writing a Finding. The hardest case is the Self-Audit Report: examining the Practice Page for defects while composing Findings about it is a two-surface task that a phone gives one surface for. That case was answered on 2026-07-27 (#37) and the answer is in `DESIGN.md`: below `1100px` the report becomes a finding-at-a-time flow, the Practice Page owning the screen until an element is selected. The obligation the sentence recorded still binds every future two-surface flow — a desktop-only escape is not an answer to one.
- The programme runs on the team's standard stack — Next.js, Neon Postgres, Google sign-in — deliberately, so it is not new operational ground.

## Capabilities and Constraints

**Structure.** Twelve Competencies across three Stages, ordered by how hard the defect is to detect: visible at a glance (Stage 1) → visible by walking the flow (Stage 2) → visible only to someone else (Stage 3). Each Stage ends in a Self-Audit Report. A Learner's accumulated Competencies *are* their audit checklist; no separate checklist artefact will ever be produced.

**Assessment.** Per Competency: an Item Pool of 8 authored items, 5 drawn per Attempt, 4 correct to pass. A retry is a new Attempt drawing from the pool, never a replay — which is why the pool is larger than the draw. Attempts are never overwritten. A Self-Audit Report requires at least 3 Findings; each Finding is a selected page element + a selected Glossary Principle + a written defect description + a written proposed fix. The platform checks **form only**.

**Bilingual parity is a hard constraint.** Every Competency, Quiz Item, brief, Glossary entry, and the Practice Page exists in English and Korean, testing the same thing at the same difficulty. Routes are `/<lang>/…` with no unlocalised page, including sign-in. The language switcher goes to the counterpart of the current page, never to a section root. Both Practice Page variants must expose an **identical set of element identifiers**, enforced by the content build. `ko` and `en` are the only published languages.

**Access.** Google sign-in for everyone, authorised against an explicit allowlist (an email address, or the wildcard `@aisahub.com`). A signed-in address that is not on the list is refused **with an explanation**, never a blank failure.

**Deliberate absences — future work must not add these:**

- No LLM or external model API, anywhere, at runtime.
- No email delivery of any kind; no registration form, password, verification, or reset.
- No ranking or leaderboard, and **no cumulative per-person score**. A leaderboard gives every Learner a position and therefore has a bottom. (The board of most-agreed-with Findings is permitted precisely because most Learners appear nowhere on it, and appearing nowhere is not a rank.)
- No role hierarchy. Maintainer is a flag, not a tier.
- No reproduction of NN/g article text or images. Cite and link only.
- No disclosure of the Planted Defect count before submission — the Learner must look at the page rather than count toward a number.
- The Findings library is unreachable until the reader has submitted their own report; before that it is an answer key.
- No assessment against a Learner's own real client work, at any Stage. Every Self-Audit subject is authored by this project so the reference answer is known rather than inferred (ADR-0009). Reaching real work is the Glossary's job — a justification sentence used in a pull request — not a submission's.

**Terminology is owned by `CONTEXT.md`** and is binding on interface copy. It carries an explicit _Avoid_ list per term — "student", "admin", "grader", "test", "homework", "question", "bug", and others are wrong in this product, not merely off-tone. English is canonical; Korean is the other Learner-facing language; Chinese glosses in `CONTEXT.md` are for the project team and never appear in the interface.

**Open, not undecided-by-omission:**

- Stage 2 and Stage 3 content is not authored yet. Only Stage 1's four Competencies exist, and neither later Stage has an authored subject for its Self-Audit Report — Stage 2's must additionally support detection by interaction (ADR-0009). Stage 2's subject now has a decided shape and no artefact: a three-step flow that may remember what a Learner entered but may never branch (ADR-0010). Stage 3's subject likewise has a decided shape and no artefact: a page carrying a stated user, plus a specimen Self-Audit Report about the Stage 1 Practice Page (ADR-0011).
- Peer Review is no longer an assessment (ADR-0011). It is optional exposure to a colleague's submitted report, it gates nothing, and it is not built.

## Brand Commitments

**Confirmed 2026-07-23: none exist.** There is no binding Aisahub identity, logo, palette, or typeface this platform must inherit, and no requirement to resemble any other internal system. The visual world is free to be designed for this product specifically.

The product name in code and metadata is `ux-study`.

The one identity constraint that *is* real is behavioural rather than visual: this platform teaches people to detect UX defects, and its own interface is the first thing they will practise on. An existing source comment already states the intent — labels match the headings of the pages they lead to "rather than being shortened for the bar — the platform should not fail the Consistency lesson it teaches."

## Evidence on Hand

Real, authored, in-repo:

- **32 Quiz Items** — 8 per Stage 1 Competency, under `content/items/`, each rendering a real screen rather than describing one (`content/items/item-screen.css`).
- **4 Competency definitions** — `content/competencies/`.
- **11 Principle Glossary entries** — `content/glossary/`.
- **The Practice Page** — `content/practice-page/{en,ko}.html` plus its `manifest.md` of Planted Defects and `practice-page.css`. Stage 1 plants **six** defects across four Competencies, so the count carries no hint about their distribution.
- **The Self-Audit Report brief** — `content/briefs/`.
- **Fixed quantities** — `content/config.md` (pool 8, draw 5, pass 4, minimum 3 Findings). These are content configuration; changing one is an edit there, not a code change.
- **Product truth** — `CONTEXT.md` (the domain glossary) and `docs/adr/0001`–`0008`, which record not only what was decided but what was reversed and why.

**Absences that must never be fabricated:** no customers, testimonials, case studies, press, or logos. No usage metrics, completion rates, cohort statistics, or before/after results — the programme has not run. No launch date. No client complaint or rejected delivery (see Product Purpose). No pricing, licensing, or public availability: this is internal and not a product anyone buys.

## Product Principles

1. **The platform is the first thing it will be audited against.** Its own Learners are being trained, week by week, to spot exactly the defects it might commit. A defect shipped here is not embarrassing, it is disproof.
2. **Two languages, one standard.** Nothing may exist, or work well, in only one of them. Parity is not translation coverage — it is equal difficulty, equal legibility, and an address that says which language it is.
3. **Report, never judge; show, never rank.** The platform states what happened — attempts, position, time since last activity — and assigns no verdict to a person and no position relative to another.
4. **What a Learner takes away must survive leaving the platform.** The Glossary entry pasted into a pull request, read by someone who never enrolled, is the product working — not a side effect of it.
5. **The Learner must always be able to see where they are and resume.** Self-paced with no deadline makes drop-out the failure mode, and an unclear "what now" is how drop-out starts.

## Accessibility & Inclusion

**WCAG 2.2 AA is a requirement, confirmed 2026-07-23** — colour contrast, complete keyboard operation, visible focus, and correct screen-reader semantics. The standard is not aspirational here. Accessibility is **not** one of the twelve Competencies — ADR-0001's amendment settles Stage 3 as two defect types plus the two routes out of the author's own head, and a fifth entry would break that structure (settled 2026-08-03, ADR-0011's follow-up). It is a hard line on the platform itself, which is the stronger claim of the two: Product Principle 1 applies in full, so a barrier shipped here is disproof of what this platform teaches rather than an oversight in it. Treat AA as a hard acceptance line on every surface, not a late audit.

Additionally:

- The `lang` attribute must be truthful per page — a screen reader picks its voice from it, and ADR-0008's language-in-the-path exists partly so it can never be a lie.
- Korean and English set side by side: any typeface chosen must carry full Hangul coverage, and layouts must survive both scripts' differing line-breaking and text length without either being the afterthought.
- Every Learner is a colleague, and the reason someone is admitted individually rather than by domain (the Indonesia cohort has no company email) must never surface as second-class treatment in the interface.
