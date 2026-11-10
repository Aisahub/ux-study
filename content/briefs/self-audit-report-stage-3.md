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
    이번에는 플로우가 아니라 다시 페이지를 점검합니다. 다만 페이지 맨 위에
    한 사람이 소개되어 있습니다. 그 소개는 페이지의 일부가 아니라 이 브리프의 일부입니다. 소개를 먼저 읽고, 그다음 그 사람이 되어 페이지를
    읽어 보세요. 아는 것도, 쓰는 기기도, 처한 상황도 그 사람과 같다고 여기고 읽는 것입니다. 여기서 잘못된 것들은 1단계 때보다
    더 열심히 들여다본다고 찾아지지 않습니다. 이 페이지에 있는 결함은 하나같이, 읽는 사람이 누구인지에 따라 결함이 되는 것들입니다. 찾는 방법은 하나, 그
    사람이 이 단어와 이 배치, 이 요청을 어떻게 받아들일지 계속 묻는
    것입니다. 제한 시간은 없습니다.
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
    제출하려면 발견이 세 개 이상 있어야 하고, 발견 하나를 이루는 네
    부분은 1단계부터 같습니다. 문제의 요소, 그 요소가 어기는 UX 원칙,
    맨 위에 소개된 사람이 겪는 문제를 적은 설명, 고치는 방법 제안입니다.
    요소는 말로 설명하지 않고 페이지에서 직접 가리켜 고르고, 원칙은
    용어집에서 고릅니다. 발견마다 네 부분을 모두 채워야 하며, 한 요소를
    두 발견이 함께 가리킬 수는 없습니다. 설명은 반드시 맨 위의 그 사람
    이야기로 써 주세요. "이건 불명확하다"는 내 느낌을 적은 발견이고,
    "이런 요청을 받아 본 적이 없는 사람이라 자기가 무엇에 동의하는지 알
    길이 없다"는 그 사람의 처지를 적은 발견입니다. 무엇을 바꿔야 하는지
    알려 주는 쪽은 뒤엣것뿐입니다.
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
    여기서 가장 찾기 어려운 결함은 여러분이 읽기에는 아무 문제 없는
    것들입니다. 여러분의 일에서는 평범한 단어가 그 사람에게는 벽일 수
    있고, 제품 구조를 아는 사람에게는 당연한 배치도 그 사람에게는 아무
    단서가 되지 못합니다. 그 사람은 그 구조를 모르기 때문입니다. 어떤
    문장이 괜찮아 보이면, 넘어가기 전에 그 사람의 처지에서 소리 내어 한
    번 읽어 보세요. 제출하면 여기에 심어둔 결함 전체와 그중 무엇을
    찾았는지 바로 보입니다. 제출은 한 번뿐이고, 승인하는 사람은 없습니다.
    플랫폼은 리포트가 빠짐없이 작성되었는지만 확인하고, 내용이 옳은지는
    판단하지 않습니다.
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
    여러분의 리포트를 제출하고 나면, 같은 페이지를 점검한 동료들의 리포트를
    읽고 발견마다 동의를 표시할 수 있습니다. 이 기능을 둔 이유는 하나,
    다른 사람은 이 페이지를 어떻게 보았는지 보여 주기 위해서입니다. 어느
    요소에서 멈췄는지, 어떤 원칙을 골랐는지, 어떤 문제를 여러분이라면 쓰지
    않았을 말로 적었는지 말입니다. 동료 리뷰는 판정이 아니며, 여러분의
    결과물을 채점하는 사람은 없습니다. 어떤 발견이 실제 결함인지는 제출
    직후 본 결함 목록이 알려 줍니다. 동료가 정해 주는 것이 아닙니다.
    동료도 UX를 여러분보다 더 잘 아는 것은 아닙니다. 지금 이 단계에
    혼자뿐이어도 놓치는 것은 없고, 누구를 기다릴 필요도 없습니다. 다른 학습자가 없어도
    수료할 수 있으며, 앞으로도 마찬가지입니다.
optionalFix:
  en: >-
    Optional, after submitting: pick one of your Findings and actually fix it,
    then attach a link showing the change. If you write code, a pull request or
    commit works; if you do not, a screenshot of the corrected page is entirely
    sufficient — this step is about seeing your fix exist, not about tooling. It
    does not affect completion either way.
  ko: >-
    제출 후 선택 사항: 작성한 발견 중 하나를 골라 실제로 고쳐 보고,
    바뀐 결과를 보여 주는 링크를 첨부해 주세요. 코드를 쓴다면 pull request(풀 리퀘스트)나 commit(커밋)이면 되고, 그렇지 않다면 고친 페이지의
    스크린샷으로 충분합니다. 이 과정의 목적은 내가 고친 결과를 직접
    확인하는 것이지, 도구를 익히는 것이 아닙니다. 첨부 여부는 수료에
    영향을 주지 않습니다.
---
