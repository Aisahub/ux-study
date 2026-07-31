---
# The Stage 2 reference answer: a record of what we planted, not a judgement
# about what is wrong. Lives beside the markup so the two cannot drift apart;
# the content build fails if an element named here is absent from the subject.
# Revealed to a Learner only after they submit their Self-Audit Report.
#
# Every defect here needs the interface operated to be seen — a click, a wait,
# or a mistake (ADR-0010). Nothing on this list can be found in a still
# screenshot of any one step; that class of defect is Stage 1's.
#
# Each names the step it occurs in, and the element it names is the element
# that should have spoken — the button that gave no sign, the sentence that
# went stale, the control that took work back without warning. A moment cannot
# be clicked once it has passed, but the element that stayed quiet is still on
# screen afterwards.
stage: 2
defects:
  - slug: no-sign-while-availability-is-checked
    step: 1
    element: step1-check-availability
    competency: system-status
    principle: appropriate-feedback
    explanation:
      en: >-
        Checking availability takes six seconds and the interface spends all six
        of them silent. The button does not change, nothing appears beside it,
        and no wait is announced — so the only reading available is that the
        click missed. Most people press it again, and the second press is
        swallowed as quietly as the first. A wait this long needs something that
        keeps saying it is still working: the button held in a busy state, or a
        line under it saying the branch is being checked.
      ko: >-
        차량 확인은 6초가 걸리는데, 인터페이스는 그 6초 내내 아무 말이 없습니다.
        버튼은 그대로고, 옆에 뜨는 것도 없고, 기다리는 중이라는 안내도 없습니다 —
        그러니 클릭이 빗나갔다고 읽는 것 말고는 달리 해석할 여지가 없습니다.
        대부분 한 번 더 누르게 되고, 두 번째 누름도 첫 번째만큼이나 조용히
        삼켜집니다. 이 정도 길이의 기다림에는 아직 진행 중이라고 계속 말해 주는
        것이 필요합니다 — 버튼을 처리 중 상태로 붙들어 두거나, 그 아래에 지점을
        조회하고 있다는 한 줄을 두거나.
  - slug: availability-answer-outlives-the-dates
    step: 1
    element: step1-availability-result
    competency: system-status
    principle: system-status
    explanation:
      en: >-
        The availability sentence names the branch and the dates it answered
        for, and then never changes. Move the pickup date and it still asserts
        three vans on the dates you have just left behind — an answer to a
        question nobody is asking any more, sitting where the current answer
        should be. A state that changes has to be announced rather than
        discovered: either the sentence clears the moment a date moves, or it
        says out loud that it is now out of date and offers to check again.
      ko: >-
        차량 안내 문장은 어느 지점, 어느 날짜에 대한 답인지까지 밝혀 놓고는, 그
        뒤로 한 번도 바뀌지 않습니다. 대여일을 바꿔도 방금 떠나온 날짜에 차량이
        3대 있다고 계속 주장합니다 — 이제 아무도 하지 않는 질문에 대한 답이,
        지금의 답이 있어야 할 자리를 차지하고 있는 셈입니다. 상태가 바뀌면
        사용자가 알아채기 전에 먼저 알려야 합니다. 날짜가 바뀌는 순간 문장을
        지우거나, 지금 이 답은 낡았으니 다시 확인하겠느냐고 말해 주어야 합니다.
  - slug: email-called-wrong-while-still-typed
    step: 2
    element: step2-email-field
    competency: error-handling
    principle: premature-error
    explanation:
      en: >-
        The email field turns red on the first character. Every address in the
        world is invalid halfway through being typed, so the field spends the
        whole of the typing calling the driver wrong and only stops once they
        finish — by which point the message taught them nothing. The check
        itself is worth keeping; its timing is not. Waiting until the field is
        left keeps the help and drops the accusation.
      ko: >-
        이메일 칸은 첫 글자부터 빨갛게 바뀝니다. 세상의 모든 주소는 입력하는
        도중에는 다 틀린 주소이므로, 이 칸은 타이핑하는 내내 운전자에게 틀렸다고
        말하다가 다 치고 나서야 멈춥니다 — 그때쯤이면 그 메시지는 아무것도 가르쳐
        준 게 없습니다. 검사 자체는 남길 만합니다. 남기지 말아야 할 것은 그
        시점입니다. 칸에서 손을 뗄 때까지 기다리면 도움은 그대로 두고 나무라는
        부분만 없앨 수 있습니다.
  - slug: rejection-names-no-field-and-no-fix
    step: 3
    element: step3-error
    competency: error-handling
    principle: error-recovery
    explanation:
      en: >-
        Confirm with the contact number left empty and the whole booking comes
        back as "Booking request rejected (code 422)". It names no field, so the
        driver has to guess which of the six lines above it means; it names no
        fix, so even a right guess leaves them unsure what a correct value looks
        like; and it is written in the words of whatever refused it rather than
        the words of the person reading it. The message should say which field
        is empty, say it beside that field, and say what to put there.
      ko: >-
        연락받을 번호를 비운 채로 예약을 확정하면 예약 전체가 "예약 요청이
        거부되었습니다 (code 422)"로 돌아옵니다. 어느 칸인지 말하지 않으니
        운전자는 위의 여섯 줄 중 무엇을 말하는지 짐작해야 하고, 어떻게 고치라는
        말이 없으니 제대로 짚었다 해도 올바른 값이 어떤 모양인지 알 수 없으며,
        문장은 읽는 사람의 말이 아니라 거부한 쪽의 말로 쓰여 있습니다. 어느 칸이
        비었는지 밝히고, 그 칸 옆에서 말하고, 거기에 무엇을 넣어야 하는지까지
        알려 주어야 합니다.
  - slug: the-email-error-blocks-nothing
    step: 2
    element: step2-continue
    competency: error-handling
    principle: inline-validation
    explanation:
      en: >-
        Type an address the field has just called invalid, then press Continue —
        and it continues. The review step then shows the rejected address back
        as though it were a booking detail. So the message was never a check on
        anything; it was decoration that scolded and then stood aside. An error
        either means the value cannot be used, in which case Continue has to
        say so and wait, or it means nothing and should not have been raised.
        Holding both positions at once teaches a driver to ignore the red.
      ko: >-
        방금 이 칸이 잘못됐다고 말한 주소를 그대로 두고 계속을 누르면 — 그냥
        계속됩니다. 그리고 확인 화면은 그 거절당한 주소를 예약 정보인 양 다시
        보여 줍니다. 결국 그 메시지는 무언가를 걸러 내는 검사가 아니었던
        셈입니다. 나무라고는 옆으로 비켜서는 장식이었을 뿐입니다. 오류란 그 값을
        쓸 수 없다는 뜻이거나 — 그렇다면 계속 버튼이 그렇게 말하고 멈춰 서야
        합니다 — 아무 뜻도 없거나 둘 중 하나이고, 아무 뜻도 없다면 애초에 띄우지
        말았어야 합니다. 두 입장을 동시에 취하면, 운전자는 빨간색을 무시하는
        법을 배웁니다.
  - slug: phone-asked-again-at-the-last-step
    step: 3
    element: step3-phone-field
    competency: form-burden
    principle: smart-defaults
    explanation:
      en: >-
        The mobile number given on the driver step is asked for a second time on
        the last step, under a different label and starting empty. The product
        already holds the answer; asking again is work the driver does on its
        behalf, and it is worse than merely tedious — two numbers now exist for
        one booking and nothing says which one will be rung. The field should
        arrive holding the number already given, editable for the person who
        genuinely wants a different one.
      ko: >-
        운전자 단계에서 받은 휴대전화 번호를 마지막 단계에서 이름만 바꿔 빈 칸으로
        다시 묻습니다. 제품이 이미 답을 갖고 있는데도 다시 묻는 것은, 운전자가
        제품 대신 해 주는 일입니다. 게다가 그저 번거로운 데서 그치지 않습니다 —
        예약 하나에 번호가 둘이 생기는데, 둘 중 어느 쪽으로 전화가 갈지는 아무도
        말해 주지 않습니다. 이 칸은 이미 받은 번호를 담은 채로 나와야 하고, 정말
        다른 번호를 쓰려는 사람만 고칠 수 있으면 됩니다.
  - slug: going-back-empties-the-driver-step
    step: 3
    element: step3-back
    competency: way-back-and-control
    principle: undo
    explanation:
      en: >-
        Back from the last step does return to the driver details — emptied.
        Name, email, mobile number and cover are all gone, with no warning
        before and no way to bring them back after, so the one control offered
        for changing a single answer costs every answer on the step. Going back
        is the ordinary way to check something, and here it cannot itself be
        taken back. It should return the step exactly as it was left; if
        anything genuinely has to be discarded, say so before it happens and
        offer to restore it afterwards.
      ko: >-
        마지막 단계에서 뒤로 가면 운전자 정보로 돌아가기는 합니다 — 텅 빈 채로.
        이름, 이메일, 휴대전화 번호, 보장 선택이 전부 사라지는데, 사전 경고도
        없고 되살릴 방법도 없습니다. 답 하나를 고치라고 마련해 둔 컨트롤이 그
        단계의 답을 전부 대가로 받아 가는 셈입니다. 뒤로 가기는 무언가를 확인하러
        가는 가장 평범한 길인데, 여기서는 그 뒤로 가기 자체를 되돌릴 수 없습니다.
        떠날 때 그대로의 단계로 돌아가야 하고, 정말 버려야 할 것이 있다면 버리기
        전에 말하고 나서 되살릴 길을 함께 주어야 합니다.
---
