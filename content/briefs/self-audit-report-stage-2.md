---
# The brief a Learner reads before auditing the Stage 2 subject (#71).
#
# Stage 1's sibling and deliberately close to it in voice, differing only where
# the subject differs: Stage 2's is walked rather than read (ADR-0010), so most
# of what is wrong with it does not exist in any single still. The brief says
# that, because a Learner who reads this page the way they read Stage 1's will
# find almost nothing.
#
# Like Stage 1's it cites no UX Principle by name — the brief is read while the
# defects are still hidden — and it never states how many defects the subject
# contains. The count is withheld until submission.
#
# It does not tell the Learner that elements are named per step. That is true
# and load-bearing (`step1-…`, `step2-…`, each identifier unique, which is what
# lets one element locate one moment) but it is a fact about the markup, and a
# Learner selects by pointing rather than by typing an identifier.
stage: 2
title:
  en: Audit the practice flow
  ko: 연습 플로우 점검하기
intro:
  en: >-
    This time the subject is not a page but a short flow — three steps, start to
    finish, the way somebody would actually go through it. Walk it as they
    would: fill it in, press things, go back, change your mind. Most of what is
    wrong here cannot be seen by looking at any one screen, because it only
    happens between one moment and the next. There is no time limit and nothing
    is watching how long you take.
  ko: >-
    이번에 살펴볼 것은 페이지가 아니라 짧은 플로우입니다. 처음부터 끝까지
    화면 세 개로 이어지고, 실제로 누군가 거쳐 갈 법한 순서 그대로입니다.
    그 사람처럼 직접 따라가 보세요. 입력해 보고, 눌러 보고, 뒤로 가
    보고, 마음을 바꿔 보세요. 여기서 잘못된 것들은 대부분 어느 한 화면만
    봐서는 보이지 않습니다. 한 화면에서 다음 화면으로 넘어가는 사이에만
    생기기 때문입니다. 제한 시간은 없고, 얼마나 걸리는지 아무도 재지
    않습니다.
whatCounts:
  en: >-
    A complete submission carries at least three Findings. Each Finding has the
    same four parts as before: the element — selected by pointing at it in the
    flow, not described in words; the UX Principle it works against — selected
    from the Glossary; a description of what goes wrong for the person using
    it; and a proposed fix. All four are required for every Finding, and no two
    Findings may point at the same element. A control that appears at more than
    one step is a different element at each of them, so two moments of the same
    button are two Findings, not one.
  ko: >-
    제출하려면 발견이 세 개 이상 있어야 합니다. 발견 하나를 이루는 네
    부분은 지난번과 같습니다. 문제의 요소, 그 요소가 어기는 UX 원칙,
    플로우를 사용하는 사람이 겪는 문제를 적은 설명, 고치는 방법
    제안입니다. 요소는 말로 설명하지 않고 플로우 안에서 직접 가리켜
    고르고, 원칙은 용어집에서 고릅니다. 발견마다 네 부분을 모두 채워야
    하며, 한 요소를 두 발견이 함께 가리킬 수는 없습니다. 여러 화면에
    나오는 컨트롤은 화면마다 다른 요소로 봅니다. 같은 버튼이라도 화면이
    다르면 발견을 따로 씁니다.
advice:
  en: >-
    Do a thing twice before you judge it: once the way it was meant to go, and
    once the way people actually behave — a wrong answer corrected, a step
    revisited, a decision changed after it was made. Watch what the flow does
    with the second run. Write the description for the person walking it, not
    for us: what goes wrong for them, and at which moment. A fix does not need
    to be clever — the smallest change that removes the problem is the best
    answer. When you submit you will immediately see everything that was
    planted here and which of it you found; submission is final, so walk it
    until you are satisfied before you press it.
  ko: >-
    판단하기 전에 한 번 더 해 보세요. 한 번은 의도된 대로, 또 한 번은
    사람들이 실제로 하는 대로입니다. 잘못 넣었다가 고치고, 앞 화면으로
    돌아가 보고, 정했던 것을 나중에 바꿔 보는 식입니다. 두 번째 시도에서
    플로우가 어떻게 반응하는지 보세요. 설명은 우리 입장이 아니라 그
    플로우를 따라가는 사람의 입장에서 써 주세요. 그 사람이 어느 순간에,
    무엇 때문에 막히는지를 적으면 됩니다. 고치는 방법은 기발할 필요가
    없습니다. 문제를 없애는 가장 작은 변경이 가장 좋은 답입니다. 제출하면
    여기에 심어둔 결함 전체와 그중 무엇을 찾았는지 바로 보입니다. 제출은
    한 번뿐이니, 충분히 따라가 봤다는 확신이 들 때 제출 버튼을 눌러
    주세요.
optionalFix:
  en: >-
    Optional, after submitting: pick one of your Findings and actually fix it,
    then attach a link showing the change. If you write code, a pull request or
    commit works; if you do not, a screenshot of the corrected step is entirely
    sufficient — this step is about seeing your fix exist, not about tooling. It
    does not affect completion either way.
  ko: >-
    제출 후 선택 사항: 작성한 발견 중 하나를 골라 실제로 고쳐 보고,
    바뀐 결과를 보여 주는 링크를 첨부해 주세요. 코드를 쓴다면 pull
    request나 commit이면 되고, 그렇지 않다면 고친 화면의
    스크린샷으로 충분합니다. 이 과정의 목적은 내가 고친 결과를 직접
    확인하는 것이지, 도구를 익히는 것이 아닙니다. 첨부 여부는 수료에
    영향을 주지 않습니다.
---
