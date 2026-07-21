# ux-study

An internal UX learning platform for Aisahub staff (developers and PMs, no dedicated designers), hired in both Korea and Indonesia. It turns UX principles into assessable abilities, so that staff in both locations judge an interface against the same standard and describe it in the same words.

Terms are given as `English (한국어 / 中文)`. English is canonical — it is what appears in code and issue titles. This glossary is the project's own vocabulary and is not Learner-facing; Learner-facing surfaces are English and Korean (see ADR-0002).

## Language

**Learner** (학습자 / 学员):
An Aisahub developer or PM working through the programme, in either location. Korea-based Learners work in Korean; Indonesia-based Learners work in English. Location determines working language and nothing else — the curriculum, assessments, and standard are identical.
_Avoid_: student, user, trainee

**Maintainer** (운영자 / 运营者):
The member of staff who keeps the programme running: the access allowlist, the Practice Page, the content, and the watch on defective Quiz Items. Distinguished from a Learner by a flag on their allowlist entry, not by a role hierarchy. **Judges nothing** — no assessment in this programme has a human verdict. Renamed from "Reviewer" by ADR-0007, which removed the only thing that role reviewed.
_Avoid_: reviewer, admin, grader, instructor, teacher

**Competency** (능력점 / 能力点):
One UX ability a Learner is expected to acquire, small enough to be assessed on its own. Stated as an observable action ("can find and fix X"), never as knowledge held.
_Avoid_: knowledge point, lesson, chapter, module, topic

**UX Principle** (UX 원칙 / UX 原则):
A single teachable rule sourced from the UX literature, which a Learner cites by name when justifying a finding. Content, not structure — many Principles feed one Competency. Every Principle carries one canonical name per Learner-facing language, so that a finding written in Seoul and a finding written in Jakarta name the same thing.
_Avoid_: rule, guideline, heuristic (reserve "heuristic" for Nielsen's ten specifically)

**Principle Glossary** (원칙 용어집 / 原则术语表):
The paired English and Korean names for every UX Principle, with its one-line definition **and a ready-to-say justification sentence** — the words a Learner can put in a pull request or a standup to propose a change. Learner-facing and usable during real work, not only while studying. It is the platform's primary authored asset, and the justification sentence exists because a team member reported feeling unable to express UI changes during development: without a named principle, a developer has only "this looks off", which carries no weight.
_Avoid_: dictionary, term table, vocabulary list (reserve "glossary" for this specifically; `CONTEXT.md` is the *project* glossary and a different thing)

**Stage** (단계 / 阶段):
A group of Competencies sharing one level of detection difficulty. There are three — visible at a glance, visible by walking the flow, visible only to someone else — and each ends with a Self-Audit Report. See ADR-0001.
_Avoid_: phase, level, unit

**Gate Quiz** (관문 테스트 / 关卡测验):
The assessment attached to a single Competency, testing whether the Learner *understands* it. Objective items scored against a stored answer key; the problem is already framed for them. A Gate Quiz is not a fixed set of questions — each attempt draws its items from the Competency's Item Pool. See ADR-0006.
_Avoid_: test, exam, assessment (too broad — those cover both instruments)

**Quiz Item** (문항 / 测验题):
One question inside a Gate Quiz. Presents a concrete artefact — a screenshot, a described page, a pair of alternatives — and asks for a judgement about it. An item that can be answered without examining the artefact is not a Quiz Item; it is a definition question, and does not belong. Every item names the section of the source article it derives from, which is what a Learner who gets it wrong is given in place of the answer.
_Avoid_: question, MCQ, problem

**Item Pool** (문항 풀 / 题池):
The full set of Quiz Items authored for one Competency, larger than the number any single attempt presents. It exists so that a Learner who retries is tested on the Competency rather than on the items they already saw. Sized by the retry rules in ADR-0006, not by how much there is to ask about.
_Avoid_: question bank, item set

**Attempt** (응시 / 作答):
One pass through a Gate Quiz by one Learner. Records which items were drawn, what was selected for each, and the verdict. Attempts are never overwritten — a retry is a new Attempt, and the count of them is visible to a Maintainer.
_Avoid_: try, submission, run

**Self-Audit Report** (자가 점검 리포트 / 自查报告):
The artefact a Learner produces at the end of a Stage, testing whether they can *apply* what they know. Nobody frames the problem for them — finding it is the assessment. In Stage 1 the subject is the Practice Page. Whether and when the subject becomes a page from the Learner's own real client work is an open question, not a settled part of the design (ADR-0007). Written in the Learner's working language, but its Findings are structurally comparable across both languages because the element and the Principle are selections rather than typed text.
_Avoid_: assignment, homework, project, final exam

**Finding** (발견 / 发现):
One defect a Learner reports inside a Self-Audit Report. Four parts: the page element (selected), the UX Principle it violates (selected from the Glossary), a description of the defect, and a proposed fix. The two selected parts are what make one Learner's Finding comparable to another's; the two written parts are what make it useful.
_Avoid_: issue, item, observation, comment

**Practice Page** (연습 페이지 / 练习页):
The page Stage 1 Learners audit — authored by this project rather than taken from real work, so that it contains exactly what Stage 1 teaches and so that the correct answer is known rather than inferred. Its source is published; a Learner may fix a defect and show the result. See ADR-0007.
_Avoid_: sample, demo, test page, sandbox

**Planted Defect** (심어둔 결함 / 埋设缺陷):
A defect deliberately introduced into the Practice Page. The list of them is the Stage 1 reference answer, and it is a record of what we did rather than a judgement about what is wrong — which is the entire reason the Practice Page is authored instead of found. Revealed to the Learner the moment they submit, never before.
_Avoid_: bug, seeded error, answer key (reserve "answer key" for Gate Quiz scoring)

**Peer Review** (동료 리뷰 / 同伴互评):
One Learner assessing another Learner's Self-Audit Report. Used from Stage 3 onward, where it is not a staffing compromise but the Competency itself — the reviewer is the outside perspective the Stage is about acquiring.
_Avoid_: cross-check, buddy review, marking

**Completion** (결업 / 结业):
The state a Learner reaches after passing every Gate Quiz and **submitting** a complete Self-Audit Report for each Stage. Submission, not approval — since ADR-0007 no assessment carries a human verdict, and a Report is complete when it is well-formed, not when someone agrees with it.
_Avoid_: graduation, certification, done

**Learning Objective** (학습 목표 / 学习目标):
An observable action the Learner can be seen to perform after the programme. Derived from the organisation's Learning Purpose; every Competency traces back to one.
_Avoid_: goal, outcome, aim

**Learning Purpose** (학습 목적 / 学习目的):
The organisational pain the programme exists to relieve. Stated once, and the anchor every Learning Objective is checked against.
_Avoid_: mission, rationale, why
