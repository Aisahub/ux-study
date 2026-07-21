---
status: accepted
---

# Scaffold around the source articles rather than teaching the material ourselves

## Background

> **Amended 2026-07-21.** This ADR originally assumed every Learner was Korean-speaking. Aisahub also hires developers in Indonesia who work in English, so Learner-facing content is bilingual and the machine-translation dependency applies to the Korean cohort only. The central decision — scaffold, do not teach — is unchanged. Amendments are marked inline.

ADR-0001 established that authoring content for every Competency is the dominant cost of this project. Two further facts constrain how that content can be produced:

- NN/g reserves reproduction rights, so source articles may be cited and linked but not republished or wholesale translated onto our own pages.
- The entire source corpus is English. **Korea-based Learners do not work in English; Indonesia-based Learners do.** The language barrier is therefore real for one cohort and absent for the other.

A representative article (<https://www.nngroup.com/articles/ten-usability-heuristics/>) was inspected to test whether machine translation is viable:

- ~2,800–3,200 words of body prose, carried in HTML text rather than images.
- 8 conceptual illustrations, each with an HTML text caption; captions translate along with the prose.
- Embedded short videos ("3-minute video", "2-minute video") whose content is **not** present in the surrounding text and is therefore unreachable by page translation.

Anything we write ourselves and get wrong does not stay inside the platform: Learners quote it to clients when justifying design decisions.

## Decision

For the MVP, the platform **does not explain the material**. It scaffolds around the source articles and supplies only four things, **each authored in both English and Korean** (amended — originally Korean only):

1. The Principle Glossary: the canonical English and Korean name for each UX Principle, with a one-line definition.
2. Pre-reading questions for each Competency.
3. The Gate Quiz.
4. The Self-Audit Report brief and its rubric.
5. **The Practice Page and its Planted Defect manifest** (amended by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md)). Stage 1's assessment subject is a page this project authors, so the correct answer is known rather than inferred. This is the only authored asset that is *not* language-paired: one page, audited by both cohorts, which is what makes their results comparable. Only its explanatory text is bilingual.

Learners read the source articles in English. Indonesia-based Learners read them directly. Korea-based Learners use their browser's built-in page translation. We do not host, generate, or distribute any translation of NN/g prose.

A Learner works in one language throughout — interface, questions, answers, and report. Language is a display preference, not a separate track: both languages present the same Competencies, the same questions, and the same bar.

Authoring rule: **every pre-reading question and Gate Quiz item must be answerable from the article's text alone.** Nothing may depend on an embedded video.

Explicit non-goal for the MVP, but an anticipated extension: each Competency carries an `explanation` field, empty in the MVP. Adding written explanations later is additive and must not require restructuring Competencies.

## Rationale

- Substance comes from the original authors, so the platform cannot teach a UX principle incorrectly — the failure mode that would propagate to clients.
- No NN/g prose is copied, hosted, or redistributed; translation happens client-side in the reader's own browser, which is ordinary personal reading.
- The verified page structure supports it: the explanation lives in translatable HTML text, and the illustrations carry translatable captions.
- Machine translation's real weakness is terminology drift — the same term rendered inconsistently across articles and across readers. Pinning canonical names is therefore both the cheapest thing we can build and the highest-value one. The division of labour is clean: NN/g owns the substance, the browser removes the language barrier for the Korean cohort, we own the vocabulary and the assessment.
- **Bilingual authoring is what makes a two-country cohort possible at all** (amendment). The programme exists to bring both locations to one standard; two locations that name the same defect differently cannot be held to one standard, no matter how good the material is. The Principle Glossary is the mechanism, which is why it is authored in both languages and surfaced outside the lesson flow.
- Nothing is lost by not translating for the Indonesia cohort: they read the source in its original language, which is the ideal case this ADR was trying to approximate for everyone.
- The videos are supplementary rather than load-bearing, so excluding them costs little, whereas assessing on them would strand Learners at the point of greatest language difficulty.

## Considered alternatives

- **AI-drafted Korean explanations with human review.** Strongest benefit: Learners never leave the platform, and reading load drops sharply. Rejected for the MVP because review cannot be skipped on teaching content that Learners will repeat to clients, which puts a per-Competency human bottleneck on the largest cost centre before anything has been validated.
- **Korean summary plus English deep read (hybrid).** Strongest benefit: lowers the entry barrier without giving up source authority. Rejected for the MVP as a dual-track content set requiring the summary and the source to be kept consistent — deferred rather than dismissed, and reachable through the `explanation` field.
- **Fully human-authored Korean course material.** Strongest benefit: maximum quality control. Rejected because 12 Competencies of Korean material plus assessments is a months-long effort competing directly with client delivery work.

## Consequences

- The Principle Glossary is promoted from a by-product to the MVP's core asset and its main authoring deliverable.
- **The scaffold now includes one page of our own** (amendment). "We do not teach the material" still holds — the Practice Page teaches nothing, it is something to look at. But it is the first artefact where we author the subject rather than only the questions about it, and it carries a maintenance cost the other four do not: real markup that must stay in sync with its manifest.
- **Authoring volume doubles** (amendment): every Competency needs its questions, quiz items, rubric, and glossary entries in two languages. This lands entirely on the dominant cost centre. It is not a translation pass bolted on at the end — a Korean quiz item and its English counterpart must test the same thing at the same difficulty, which is authoring work, not translation work.
- **Quiz Items must be authored, not translated, in both languages** (amendment). A Korean item and its English counterpart must test the same judgement at the same difficulty; a literal translation of a well-worded item in one language is frequently a badly-worded item in the other, and with objective items (ADR-0006) there is no grader to absorb the difference.
- Learner reading load is real and must be planned for: roughly 15–20 minutes per article, at one article per Competency.
- The Korea cohort depends on a browser feature we do not control. If a Learner's browser lacks page translation, they face untranslated English; the platform should state the requirement rather than silently assume it. The Indonesia cohort has no such dependency.
- Machine-translation quality for NN/g Korean output has **not** been measured end to end — only the page structure has been verified as translatable. This is an open risk, and it is now scoped to the Korea cohort alone.
- Video content in the source corpus is unreachable for assessment purposes and is out of scope.

## Follow-up work

- Have one **Korea-based** Learner read one translated article end to end and report whether the Korean output is comprehensible; record the result and revisit this ADR if it is not. The Indonesia cohort does not need this check.
- Confirm the browsers actually in use by the Korea cohort offer built-in page translation, and document the requirement for those Learners.
- When drafting each Gate Quiz, verify every item is answerable from article text alone by checking it against the article with videos disregarded — in both languages.
- Check each Quiz Item's two language variants against each other for equal difficulty before enrolment; a variant that is easier in one language silently lowers the bar for that cohort.
