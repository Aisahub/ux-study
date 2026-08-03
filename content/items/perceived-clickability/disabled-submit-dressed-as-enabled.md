---
sourceSection: 'Disabled State'
principles:
  - disabled-state
  - contrast
artefact:
  en: >-
    An account-creation form in an internal admin tool, five fields long. Two
    of them — "Team" and "Role" — are still empty, each with a small red
    "Required" note beside it. At the bottom, "Create account" is a solid blue
    rounded rectangle with a bold white label, pixel-identical to every
    working primary button in the tool. The team has decided the button stays
    inert until the two fields are filled, and nothing about its look changes
    while it is.
  ko: >-
    사내 관리 도구의 계정 생성 폼으로, 칸이 다섯 개입니다. 그중 "소속
    팀"과 "직무" 두 칸이 아직 비어 있고, 각각 옆에 빨간 "필수" 표시가 작게
    붙어 있습니다. 맨 아래 "계정 만들기"는 파랑으로 꽉 채운 둥근 사각형에
    굵은 흰 글자로, 이 도구에서 실제로 동작하는 주요 버튼들과 px 하나까지
    똑같습니다. 두 칸이 채워질 때까지 버튼이 눌리지 않게 두기로 팀이 정했는데,
    그동안에도 버튼의 겉모습은 아무것도 달라지지 않습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Create account</h2>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Full name</span><input class="control" value="Sam Rivera"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Email</span><input class="control" value="sam@example.com"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Team</span><input class="control control--empty" value="" placeholder="Choose a team"><span class="required">Required</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Role</span><input class="control control--empty" value="" placeholder="Choose a role"><span class="required">Required</span></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Start date</span><input class="control" value="2026-08-01"></div>
      <button class="btn btn--blue">Create account</button>
    </div>
  ko: |-
    <div class="screen">
      <h2>계정 만들기</h2>
      <div class="field" style="margin-bottom:10px"><span class="field-label">이름</span><input class="control" value="한서연"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">이메일</span><input class="control" value="seoyeon@example.com"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">소속 팀</span><input class="control control--empty" value="" placeholder="팀 선택"><span class="required">필수</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">직무</span><input class="control control--empty" value="" placeholder="직무 선택"><span class="required">필수</span></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">입사일</span><input class="control" value="2026-08-01"></div>
      <button class="btn btn--blue">계정 만들기</button>
    </div>
prompt:
  en: >-
    The button stays inert until Team and Role are filled — that decision is
    made. What should its look do in the meantime?
  ko: >-
    소속 팀과 직무가 채워질 때까지 버튼은 눌리지 않습니다 — 그 결정은 이미
    내려졌습니다. 그동안 버튼의 겉모습은 어때야 할까요?
options:
  en:
    - text: Dim it, and say what enables it
      reason: >-
        Desaturate the blue and lower its contrast so it reads as unavailable,
        keep the label legible, and add beside it: "Fill in Team and Role".
      correct: true
    - text: Leave the look as it is
      reason: >-
        Unavailability is communicated through the button's states, so it is
        enough that a press produces no response.
    - text: Hide the button until both fields are filled
      reason: >-
        Nothing unusable is ever shown then.
    - text: Fade the whole button, label included, to the faintest grey
      reason: >-
        Then nobody is tempted to try it.
  ko:
    - text: 흐리게 하고, 무엇이 버튼을 살리는지 적습니다
      reason: >-
        파랑의 채도와 대비를 낮춰 지금은 쓸 수 없다는 것이 보이게 하되 글자는
        읽히게 남기고, 옆에 "소속 팀과 직무를 입력하세요"라고 덧붙입니다.
      correct: true
    - text: 겉모습은 그대로 둡니다
      reason: >-
        쓸 수 없다는 것은 버튼의 상태로 전달되는 것이므로, 눌러도 반응이
        없으면 그것으로 충분합니다.
    - text: 두 칸이 채워질 때까지 버튼을 숨깁니다
      reason: >-
        쓸 수 없는 것은 화면에 아예 보이지 않게 됩니다.
    - text: 글자까지 포함해 버튼 전체를 가장 옅은 회색으로 뺍니다
      reason: >-
        그러면 아무도 눌러 볼 마음이 들지 않습니다.
---
