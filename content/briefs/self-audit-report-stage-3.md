---
# The brief a Learner reads before auditing the Stage 3 subject (#78).
#
# Sibling to Stage 1's and Stage 2's, differing where the subject differs. The
# Stage 3 subject is a page rather than a flow (ADR-0011: Stage 3's difficulty
# is the perspective required, not the interaction), and it carries a stated
# reader. Every judgement here is made against that person.
#
# Like its siblings it cites no UX Principle by name and never states how many
# defects the subject holds.
#
# It does not repeat who the reader is. That note sits on the subject itself,
# marked `data-audit-chrome`, and ADR-0011 is explicit that the stated user
# describes background and situation and never a vocabulary list — repeating or
# paraphrasing it here risks narrowing it toward a Planted Defect.
#
# Peer Review is described as ADR-0011 settled it: an outside perspective, never
# a verdict, never a gate. The mechanism is separate work; what this brief owes
# is an accurate account, including what a Learner alone at this Stage does,
# which is nothing different.
stage: 3
title:
  en: Audit the page against its reader
  ko: 읽는 사람을 기준으로 페이지 점검하기
intro:
  en: >-
    The subject is a page again, not a flow — but this time somebody is named at
    the top of it, and that note is part of your brief rather than part of the
    page. Read it first, and then read the page as that person: with what they
    know, on the device they are holding, in the situation they are in. What is
    wrong here cannot be found by looking harder than you looked at Stage 1.
    Every defect on this page is only a defect because of who is reading it, and
    the way to find one is to keep asking what that person would make of this
    word, this arrangement, this request. There is no time limit.
  ko: >-
    이번에도 점검할 것은 흐름이 아니라 페이지입니다. 다만 페이지 맨 위에 한
    사람이 지목되어 있고, 그 설명은 페이지의 일부가 아니라 여러분이 받은 안내의
    일부입니다. 그것을 먼저 읽고, 그다음 그 사람이 되어 페이지를 읽으세요. 그
    사람이 아는 만큼만 알고, 그 사람이 든 기기로, 그 사람이 처한 상황에서요.
    여기서 잘못된 것들은 1단계 때보다 더 열심히 들여다본다고 찾아지지 않습니다.
    이 페이지의 결함은 오직 읽는 사람이 누구냐 때문에 결함이며, 찾아내는 방법은
    그 사람이 이 단어를, 이 배치를, 이 요청을 어떻게 받아들일지 계속 묻는
    것뿐입니다. 제한 시간은 없습니다.
whatCounts:
  en: >-
    A complete submission carries at least three Findings, and a Finding has the
    same four parts it has had since Stage 1: the element — selected by pointing
    at it on the page, not described in words; the UX Principle it works against
    — selected from the Glossary; a description of what goes wrong for the
    person named at the top; and a proposed fix. All four are required for every
    Finding, and no two Findings may point at the same element. Write the
    description about that reader specifically. "This is unclear" is a Finding
    about you; "she has never been asked to do this before, so she has no way to
    know what she is agreeing to" is a Finding about her, and only the second
    one tells anybody what to change.
  ko: >-
    제출이 완결로 인정되려면 발견이 세 개 이상 있어야 하고, 발견 하나를 이루는
    네 부분은 1단계 이래로 같습니다. 문제의 요소 — 말로 설명하는 것이 아니라
    페이지에서 직접 가리켜 선택합니다; 그 요소가 어기고 있는 UX 원칙 —
    용어집에서 선택합니다; 맨 위에 지목된 사람에게 무엇이 잘못되는지에 대한
    설명; 그리고 고치는 방법 제안. 네 부분 모두 모든 발견에 필수이며, 두 발견이
    같은 요소를 가리킬 수 없습니다. 설명은 반드시 그 읽는 사람에 대해 쓰세요.
    "이건 불명확하다"는 나에 대한 발견이고, "이런 요청을 받아 본 적이 없는
    사람이라 자기가 무엇에 동의하는 것인지 알 길이 없다"는 그 사람에 대한
    발견입니다. 무엇을 바꿔야 하는지 알려 주는 쪽은 뒤엣것뿐입니다.
advice:
  en: >-
    The hardest defects here are the ones that read perfectly well to you. A word
    that is ordinary in your work may be a wall to her; a layout that is obvious
    once you know how the product is organised tells her nothing, because she
    does not. When a sentence looks fine, try saying it in her position out loud
    before moving on. When you submit you will immediately see everything that
    was planted here and which of it you found; submission is final, and nobody
    approves it — the platform checks that a report is complete, never whether it
    is right.
  ko: >-
    여기서 가장 어려운 결함은 여러분이 읽기에는 아무 문제 없는 것들입니다.
    여러분의 일에서는 평범한 단어가 그 사람에게는 벽일 수 있고, 제품이 어떻게
    짜여 있는지 아는 사람에게는 당연한 배치가 그 사람에게는 아무것도 말해 주지
    않습니다. 그 사람은 그 구조를 모르니까요. 어떤 문장이 괜찮아 보이면, 넘어가기
    전에 그 사람의 처지에서 소리 내어 한 번 말해 보세요. 제출하면 여기에 심어 둔
    모든 것과 그중 무엇을 찾았는지 곧바로 보게 됩니다. 제출은 한 번뿐이고,
    승인하는 사람은 없습니다. 플랫폼은 보고서가 완결되었는지만 확인하고, 그것이
    옳은지는 판단하지 않습니다.
peerReview:
  en: >-
    Once your own report is in, you can read the reports colleagues have
    submitted about this same page, and mark agreement with individual Findings.
    That is there for one reason: to show you how another head framed the page —
    which element they stopped at, which Principle they reached for, which
    problem they described in words you would not have used. It is not a
    verdict, and nobody is marking your work. Whether a Finding is real is
    answered by the manifest you have already seen, not by a colleague, who
    knows no more about UX than you do. If you are the only person at this Stage
    right now, nothing is missing and nothing is waiting: your Completion does
    not depend on another Learner being there, and it never will.
  ko: >-
    자기 보고서를 제출하고 나면, 같은 페이지에 대해 동료들이 낸 보고서를 읽고
    개별 발견에 동의를 표시할 수 있습니다. 이것이 있는 이유는 하나입니다. 다른
    사람의 머리가 이 페이지를 어떻게 잡았는지 보여 주는 것 — 어느 요소에서
    멈췄는지, 어떤 원칙을 집어 들었는지, 어떤 문제를 내가 쓰지 않았을 말로
    적었는지. 이것은 판정이 아니며, 여러분의 결과물을 채점하는 사람은 없습니다.
    어떤 발견이 실제 결함인지는 이미 본 정답 목록이 답하는 것이지 동료가 답하는
    것이 아닙니다. 동료도 UX에 대해 여러분보다 더 알지 못합니다. 지금 이 단계에
    혼자뿐이라면, 빠진 것도 없고 기다릴 것도 없습니다. 수료는 다른 학습자가
    있어야 이뤄지는 것이 아니고, 앞으로도 그렇지 않습니다.
optionalFix:
  en: >-
    Optional, after submitting: pick one of your Findings and actually fix it,
    then attach a link showing the change. If you write code, a pull request or
    commit works; if you do not, a screenshot of the corrected page is entirely
    sufficient — this step is about seeing your fix exist, not about tooling. It
    does not affect completion either way.
  ko: >-
    제출 후 선택 사항: 작성한 발견 중 하나를 골라 실제로 고쳐 보고, 그 변경을
    보여 주는 링크를 첨부하세요. 코드를 쓴다면 pull request나 commit이면 되고,
    그렇지 않다면 고쳐진 페이지의 스크린샷으로 충분합니다 — 이 단계의 목적은
    자신의 수정이 실재하는 걸 보는 것이지, 도구를 다루는 것이 아닙니다. 첨부
    여부는 수료에 어떤 영향도 주지 않습니다.
---
