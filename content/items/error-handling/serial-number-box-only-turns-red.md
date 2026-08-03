---
sourceSection: 'Visibility Guidelines: Use noticeable, redundant, and accessible indicators'
principles:
  - error-recovery
artefact:
  en: >-
    An equipment-register form in two states. In the first, "Type" holds
    "Laptop", the cursor sits in the "Serial number" box, which holds
    "MBP-2024-7741", and "Assigned to" shows its placeholder. "Cancel" and
    "Register" sit at the foot. In the second state the cursor has moved to
    "Assigned to", and the serial-number box — same value, same size, same
    position — now has a red border. No text has appeared anywhere, no mark
    sits beside the box, and "Register" is unchanged.
  ko: >-
    장비 등록 폼을 두 시점에서 보여 줍니다. 첫 번째에서는 "종류"에 "노트북"이
    들어 있고, 커서는 "MBP-2024-7741"이 적힌 "일련번호" 칸에 있으며,
    "사용 담당자"에는 안내 문구만 보입니다. 맨 아래에는 "취소"와 "등록"이 있습니다.
    두 번째 시점에서는 커서가 "사용 담당자"로 옮겨 갔고, 일련번호 칸은 값도
    크기도 자리도 그대로인 채 테두리만 빨갛게 바뀌었습니다. 어디에도 글자는
    나타나지 않았고, 칸 옆에 붙은 표시도 없으며, "등록"도 그대로입니다.
sequence:
  - caption:
      en: While the serial number is being typed, with the cursor in the box
      ko: 일련번호를 입력하는 중, 커서가 그 칸에 있는 동안
    screen:
      en: |-
        <div class="screen">
          <h1>Register equipment</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Type</span><span class="control">Laptop</span></div>
            <div class="field"><span class="field-label">Serial number</span><input class="control" style="width:240px;border-color:#2563eb" value="MBP-2024-7741"></div>
            <div class="field"><span class="field-label">Assigned to</span><input class="control control--empty" style="width:240px" value="Not chosen"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Register</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>장비 등록</h1>
          <div class="stack">
            <div class="field"><span class="field-label">종류</span><span class="control">노트북</span></div>
            <div class="field"><span class="field-label">일련번호</span><input class="control" style="width:240px;border-color:#2563eb" value="MBP-2024-7741"></div>
            <div class="field"><span class="field-label">사용 담당자</span><input class="control control--empty" style="width:240px" value="선택 안 함"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">등록</button></div>
          </div>
        </div>
  - caption:
      en: After the cursor has moved to the next box
      ko: 커서가 다음 칸으로 옮겨 간 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>Register equipment</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Type</span><span class="control">Laptop</span></div>
            <div class="field"><span class="field-label">Serial number</span><input class="control" style="width:240px;border-color:#dc2626" value="MBP-2024-7741"></div>
            <div class="field"><span class="field-label">Assigned to</span><input class="control control--empty" style="width:240px;border-color:#2563eb" value="Not chosen"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Register</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>장비 등록</h1>
          <div class="stack">
            <div class="field"><span class="field-label">종류</span><span class="control">노트북</span></div>
            <div class="field"><span class="field-label">일련번호</span><input class="control" style="width:240px;border-color:#dc2626" value="MBP-2024-7741"></div>
            <div class="field"><span class="field-label">사용 담당자</span><input class="control control--empty" style="width:240px;border-color:#2563eb" value="선택 안 함"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">등록</button></div>
          </div>
        </div>
prompt:
  en: >-
    What should change about the way this box reports the serial number?
  ko: >-
    이 칸이 일련번호에 대해 알리는 방식에서 무엇을 바꿔야 할까요?
options:
  en:
    - text: Thicken the red border and add a red glow around the box
      reason: >-
        The box becomes harder to walk past at a glance.
    - text: Put a red warning icon inside the box, at the right-hand end
      reason: >-
        A mark that is not colour joins the colour, so the box still reads for
        someone who cannot pick red out.
    - text: Put a line under the box naming what is wrong and what this register expects, marked as well as coloured
      reason: >-
        A red edge says that something is wrong but not what, so the person is
        left retyping a serial that looks perfectly reasonable to them.
      correct: true
    - text: Clear the box so the rejected value cannot reach the register
      reason: >-
        Nothing invalid is left sitting in a form that might still be
        submitted.
  ko:
    - text: 빨간 테두리를 더 굵게 하고 칸 둘레에 빨간 번짐 효과를 더합니다
      reason: >-
        한눈에 지나치기 어려운 칸이 됩니다.
    - text: 칸 안 오른쪽 끝에 빨간 경고 아이콘을 넣습니다
      reason: >-
        색이 아닌 표시가 색과 함께 붙으므로, 빨강을 가려내지 못하는 사람에게도
        칸이 읽힙니다.
    - text: 칸 아래에 무엇이 잘못됐고 이 대장이 무엇을 원하는지 적은 줄을 두되, 색과 함께 표시도 답니다
      reason: >-
        빨간 테두리는 무언가 잘못됐다고만 하고 무엇이 잘못됐는지는 말하지
        않습니다. 사용자에게는 멀쩡해 보이는 일련번호를 계속 다시 칠 수밖에
        없습니다.
      correct: true
    - text: 거절된 값이 대장에 들어가지 않도록 칸을 비웁니다
      reason: >-
        그대로 제출될 수도 있는 폼에 잘못된 값이 남아 있지 않게 됩니다.
---
