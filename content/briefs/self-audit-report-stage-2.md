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
  ko: 연습 흐름 점검하기
intro:
  en: >-
    This time the subject is not a page but a short flow — three steps, start to
    finish, the way somebody would actually go through it. Walk it as they
    would: fill it in, press things, go back, change your mind. Most of what is
    wrong here cannot be seen by looking at any one screen, because it only
    happens between one moment and the next. There is no time limit and nothing
    is watching how long you take.
  ko: >-
    이번에 살펴볼 것은 페이지가 아니라 짧은 흐름입니다 — 처음부터 끝까지 세
    단계이고, 실제로 누군가 거쳐 갈 법한 순서 그대로입니다. 그 사람이 하듯이
    직접 걸어 보세요. 입력해 보고, 눌러 보고, 뒤로 가 보고, 마음을 바꿔 보세요.
    여기서 잘못된 것들은 대부분 어느 한 화면만 봐서는 보이지 않습니다. 한
    순간과 다음 순간 사이에서만 일어나기 때문입니다. 제한 시간은 없고, 얼마나
    걸리는지 아무도 재지 않습니다.
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
    제출이 완결로 인정되려면 발견이 세 개 이상 있어야 합니다. 발견 하나를
    이루는 네 부분은 지난번과 같습니다. 문제의 요소 — 말로 설명하는 것이 아니라
    흐름 안에서 직접 가리켜 선택합니다; 그 요소가 어기고 있는 UX 원칙 —
    용어집에서 선택합니다; 그것을 쓰는 사람에게 무엇이 잘못되는지에 대한 설명;
    그리고 고치는 방법 제안. 네 부분 모두 모든 발견에 필수이며, 두 발견이 같은
    요소를 가리킬 수 없습니다. 여러 단계에 걸쳐 나오는 컨트롤은 단계마다 서로
    다른 요소이므로, 같은 버튼의 서로 다른 두 순간은 하나가 아니라 두 개의
    발견입니다.
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
    판단하기 전에 한 번 더 해 보세요. 한 번은 의도된 대로, 또 한 번은 사람들이
    실제로 하는 대로 — 잘못 넣었다가 고치고, 앞 단계로 돌아가 보고, 정했던 것을
    나중에 바꿔 보는 식으로요. 그 두 번째 시도에서 흐름이 어떻게 구는지를 보세요.
    설명은 우리가 읽으라고 쓰는 것이 아니라, 그 흐름을 걸어가는 사람이 읽으라고
    쓰세요 — 그 사람에게 무엇이, 어느 순간에 잘못되는지. 고치는 방법은 기발할
    필요가 없습니다. 문제를 없애는 가장 작은 변경이 가장 좋은 답입니다.
    제출하면 여기에 심어 둔 모든 것과 그중 무엇을 찾았는지 곧바로 보게 됩니다.
    제출은 한 번뿐이니, 충분히 걸어 봤다고 확신할 때 누르세요.
optionalFix:
  en: >-
    Optional, after submitting: pick one of your Findings and actually fix it,
    then attach a link showing the change. If you write code, a pull request or
    commit works; if you do not, a screenshot of the corrected step is entirely
    sufficient — this step is about seeing your fix exist, not about tooling. It
    does not affect completion either way.
  ko: >-
    제출 후 선택 사항: 작성한 발견 중 하나를 골라 실제로 고쳐 보고, 그 변경을
    보여 주는 링크를 첨부하세요. 코드를 쓴다면 pull request나 commit이면 되고,
    그렇지 않다면 고쳐진 단계의 스크린샷으로 충분합니다 — 이 단계의 목적은
    자신의 수정이 실재하는 걸 보는 것이지, 도구를 다루는 것이 아닙니다. 첨부
    여부는 수료에 어떤 영향도 주지 않습니다.
---
