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
One UX ability a Learner is expected to acquire, small enough to be assessed on its own. Stated as an observable action ("can find and fix X"), never as knowledge held. Learner-facing copy names a Competency's position in its Stage **Lesson N (레슨 N)** — amended 2026-08-03, when the Korean word that stood there, "역", turned out to read as an abbreviation of 역량 on a screen that also says 전체 역량 보기. "Lesson" stays out of this document's own vocabulary and out of every other surface: it names a place in the route, not the ability.
_Avoid_: knowledge point, chapter, module, topic

**UX Principle** (UX 원칙 / UX 原则):
A single teachable rule sourced from the UX literature, which a Learner cites by name when justifying a finding. Content, not structure — many Principles feed one Competency. Every Principle carries one canonical name per Learner-facing language, so that a finding written in Seoul and a finding written in Jakarta name the same thing.
_Avoid_: rule, guideline, heuristic (reserve "heuristic" for Nielsen's ten specifically)

**Principle Glossary** (원칙 용어집 / 原则术语表):
The paired English and Korean names for every UX Principle, with its one-line definition **and a ready-to-say justification sentence** — the words a Learner can put in a pull request or a standup to propose a change. Learner-facing and usable during real work, not only while studying. It is the platform's primary authored asset, and the justification sentence exists because a team member reported feeling unable to express UI changes during development: without a named principle, a developer has only "this looks off", which carries no weight.
_Avoid_: dictionary, term table, vocabulary list (reserve "glossary" for this specifically; `CONTEXT.md` is the *project* glossary and a different thing)

**Stage** (단계 / 阶段):
A group of Competencies sharing one level of detection difficulty. There are three — visible at a glance, visible by walking the flow, visible only to someone else — and each ends with a Self-Audit Report. See ADR-0001.
_Avoid_: phase, level, unit

**Gate Quiz** (퀴즈 / 关卡测验):
The assessment attached to a single Competency, testing whether the Learner *understands* it. Objective items scored against a stored answer key; the problem is already framed for them. A Gate Quiz is not a fixed set of questions — each attempt draws its items from the Competency's Item Pool. See ADR-0006.
_Avoid_: test, exam, assessment (too broad — those cover both instruments), 관문 테스트, 관문 퀴즈

The Korean is the bare noun on purpose (2026-07-31). This entry had read `관문 테스트` while the build shipped `관문 퀴즈`, and the gloss used the very word the line above it rules out. `관문` is a heavier register than `퀴즈` and the pair read as two words pulling against each other; the gating it was carrying is said by the status beside every quiz and by the Competency page's `마지막 관문` kicker, neither of which needs the name to repeat it. English keeps **Gate Quiz** — it is the term this repo's docs, ADRs and tests are written in, and the register clash is Korean's alone.

**Quiz Item** (문항 / 测验题):
One question inside a Gate Quiz. Presents a concrete artefact — a screenshot, a described page, a pair of alternatives — and asks for a judgement about it. An item that can be answered without examining the artefact is not a Quiz Item; it is a definition question, and does not belong. Every item names the section of the source article it derives from, which is what a Learner who gets it wrong is given in place of the answer on a failed attempt. On a passed one every drawn item is given both, since there is no retry left for the answer to convert (ADR-0006, amended 2026-08-05).
_Avoid_: question, MCQ, problem

**Item Pool** (문항 풀 / 题池):
The full set of Quiz Items authored for one Competency, larger than the number any single attempt presents. It exists so that a Learner who retries is tested on the Competency rather than on the items they already saw. Sized by the retry rules in ADR-0006, not by how much there is to ask about.
_Avoid_: question bank, item set

**Attempt** (응시 / 作答):
One pass through a Gate Quiz by one Learner. Records which items were drawn, what was selected for each, and the verdict. Attempts are never overwritten — a retry is a new Attempt, and the count of them is visible to a Maintainer.
_Avoid_: try, submission, run

**Self-Audit Report** (자가 점검 리포트 / 自查报告):
The artefact a Learner produces at the end of a Stage, testing whether they can *apply* what they know. Nobody frames the problem for them — finding it is the assessment. In Stage 1 the subject is the Practice Page. Every Stage's subject is authored by this project so that the reference answer is known; auditing a page from the Learner's own real client work is not part of the programme at any Stage (ADR-0009). Written in the Learner's working language, but its Findings are structurally comparable across both languages because the element and the Principle are selections rather than typed text.
_Avoid_: assignment, homework, project, final exam

**Finding** (발견 / 发现):
One defect a Learner reports inside a Self-Audit Report. Four parts: the page element (selected), the UX Principle it violates (selected from the Glossary), a description of the defect, and a proposed fix. The two selected parts are what make one Learner's Finding comparable to another's; the two written parts are what make it useful.
_Avoid_: issue, item, observation, comment

**Brief** (브리프 / 任务说明):
The instructions a Learner reads before auditing the Practice Page, in both Learner-facing languages, stating what a complete Self-Audit Report requires: the minimum of three Findings and the four parts of a Finding. It never states how many Planted Defects the page contains — the count is withheld until submission so the Learner looks at the page rather than counting toward a number. It also describes the optional fix-and-show step, for which a screenshot is sufficient from a non-developer. Every UX Principle it cites exists in the Principle Glossary in both languages.
_Avoid_: instructions, prompt, assignment sheet, task description

**Practice Page** (연습 페이지 / 练习页):
The page Stage 1 Learners audit — authored by this project rather than taken from real work, so that it contains exactly what Stage 1 teaches and so that the correct answer is known rather than inferred. Its source is published; a Learner may fix a defect and show the result. See ADR-0007.
_Avoid_: sample, demo, test page, sandbox

**Planted Defect** (심어둔 결함 / 埋设缺陷):
A defect deliberately introduced into the Practice Page. The list of them is the Stage 1 reference answer, and it is a record of what we did rather than a judgement about what is wrong — which is the entire reason the Practice Page is authored instead of found. Revealed to the Learner the moment they submit, never before.
_Avoid_: bug, seeded error, answer key (reserve "answer key" for Gate Quiz scoring)

**Peer Review** (동료 리뷰 / 同伴互评):
One Learner reading another Learner's submitted Self-Audit Report, and marking agreement with individual Findings. Available from Stage 3 onward, once the reader has submitted their own report. What it offers is exposure to how another head framed the same page — never a judgement about whether a Finding is real, which the Planted Defect manifest answers. It gates nothing: a Learner with nobody else at their Stage reaches Completion with nothing missing, because the outsider's work they are assessed on is an authored specimen report rather than a colleague's. Redefined by ADR-0011, which removed the claim that this is the Competency itself.
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

## Learner-facing Korean

The entries above name concepts this project talks about. This section settles
the ordinary words the Korean surfaces use for the same thing — the drift that
does not show up as a wrong term, only as two names for one idea.

The rule that produced this list: an entry above wins where it speaks;
otherwise the spelling the repository already used most, counted over
Korean-bearing lines. Two departures from the count are marked, both because
the majority word means something else to a Korean reader before it means what
we intended.

**점검**, never 감사, for what a Learner does to a page. `감사` is 監査, the
accounting sense, and is a homophone of 感謝 — on a card headed
`자가 점검 리포트` it made one action read as two.

**발견**, never the English `Finding`, in Korean copy. The Competency articles
already taught 발견 while the drawer a Learner writes into said `Finding`.
`Finding` stays the record's name in code, issues and English copy.

**컨트롤** for a control (over 조작 장치, 조작부). **칸** for an input
(over 입력란). **폼** for a form (over 양식). **맨 아래** for the foot of a
screen — `바닥` is a floor. **이름표** for a label (over 라벨, 레이블).
**결재자** for whoever approves a request; `관리자` is the system
administrator, and a Korean approval flow does not use it for a person.
**px**, not 픽셀, matching what the screens' own CSS says.
**플로우** for a flow, where the word means the sequence of steps.
**A안 / B안** for `Version A/B`, **시안 A / 시안 B** for `Draft A/B` —
English draws that line and Korean had drawn it three ways.

Departing from the count:

- **글자만 있는**, not 평문, for unstyled text. 평문 is cryptographic
  plaintext to a Korean reader, and the alternative was already in use.
- **점검** above, which 감사 outnumbered.

Two differences that look like drift and are not: `전체 역량 보기` and
`학습 개요로` render two different English labels (`All Competencies`,
`Back to the overview`), and `사용성 조사` renders `a usability study`, which
is not the Competency's name. Both were left alone.

### Writing Korean that a slot can fill

A Principle's justification sentence is said out loud with a `[slot]` filled in,
so no slot may be followed by a particle that agrees with the word filling it
(을/를, 은/는, 이/가, 와/과, 으로/로). Put a fixed noun after the slot, or let
the clause end on a copula. The content build refuses the rest. See ERR-214.
