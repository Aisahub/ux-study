---
sourceSection: Always Allow Users to Go Back a Step
principles:
  - sense-of-place
  - system-status
artefact:
  en: >-
    Two states of an expense tool, both headed "New expense claim". The first
    carries a line reading "Step 3 of 4", two filled boxes — Category holding
    "Client travel", Amount holding "₩184,000" — and a footer with "Back" on
    the left and a blue "Continue" on the right. The second carries a line
    reading "Step 4 of 6", two boxes — Receipt holding "receipt-0812.pdf",
    Approver holding "S. Yun" — and the same footer.
  ko: >-
    경비 도구의 두 상태이고, 둘 다 제목은 "신규 경비 청구"입니다. 첫 번째에는
    "4단계 중 3단계"라는 줄과 채워진 칸 두 개 — 분류에 "고객사 출장", 금액에
    "₩184,000" — 그리고 왼쪽에 "이전", 오른쪽에 파란 "계속"이 있는 바닥 줄이
    있습니다. 두 번째에는 "6단계 중 4단계"라는 줄과 칸 두 개 — 영수증에
    "receipt-0812.pdf", 결재자에 "윤서진" — 그리고 같은 바닥 줄이 있습니다.
sequence:
  - caption:
      en: The step the claim is on, before Continue is pressed
      ko: 계속을 누르기 직전, 청구가 놓여 있는 단계
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>New expense claim</h1>
            <p class="step-mark">Step 3 of 4</p>
            <div class="field"><span class="field-label">Category</span><span class="control">Client travel</span></div>
            <div class="field"><span class="field-label">Amount</span><span class="control">₩184,000</span></div>
            <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--blue" style="margin-left:auto">Continue</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>신규 경비 청구</h1>
            <p class="step-mark">4단계 중 3단계</p>
            <div class="field"><span class="field-label">분류</span><span class="control">고객사 출장</span></div>
            <div class="field"><span class="field-label">금액</span><span class="control">₩184,000</span></div>
            <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--blue" style="margin-left:auto">계속</button></div>
          </div>
        </div>
  - caption:
      en: The step that opens after Continue
      ko: 계속을 누른 뒤 열리는 단계
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>New expense claim</h1>
            <p class="step-mark">Step 4 of 6</p>
            <div class="field"><span class="field-label">Receipt</span><span class="control">receipt-0812.pdf</span></div>
            <div class="field"><span class="field-label">Approver</span><span class="control">S. Yun</span></div>
            <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--blue" style="margin-left:auto">Continue</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>신규 경비 청구</h1>
            <p class="step-mark">6단계 중 4단계</p>
            <div class="field"><span class="field-label">영수증</span><span class="control">receipt-0812.pdf</span></div>
            <div class="field"><span class="field-label">결재자</span><span class="control">윤서진</span></div>
            <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--blue" style="margin-left:auto">계속</button></div>
          </div>
        </div>
prompt:
  en: >-
    Which change should this flow's step count get?
  ko: >-
    이 플로우의 단계 표시를 어떻게 바꿔야 할까요?
options:
  en:
    - text: Take the step count off the screens
      reason: >-
        A count that cannot be relied on is worse than no count, and the flow
        works perfectly well without one.
    - text: Count every step the claim can contain from the first screen, and never move the total
      reason: >-
        A count is read to decide whether to carry on, and that decision can
        only be made against a number that holds still.
      correct: true
    - text: Show a filling bar instead of numbers
      reason: >-
        A bar can stretch as more steps appear without ever contradicting
        itself.
    - text: Keep the count and add a line saying more steps may appear
      reason: >-
        The user has been warned, so a total that grows is no longer a surprise
        when it does.
  ko:
    - text: 화면에서 단계 표시를 뺍니다
      reason: >-
        믿을 수 없는 숫자는 아예 없는 것만 못하고, 이 플로우는 숫자가 없어도 잘
        돌아갑니다.
    - text: 첫 화면부터 이 청구가 거칠 수 있는 단계를 모두 세고, 전체 수는 다시 움직이지 않게 합니다
      reason: >-
        단계 표시는 계속 갈지 말지 정하려고 읽는 것이고, 그 판단은 가만히 있는
        숫자를 놓고서만 할 수 있습니다.
      correct: true
    - text: 숫자 대신 차오르는 막대를 보여 줍니다
      reason: >-
        막대는 단계가 늘어나는 만큼 늘려 잡아도 스스로 말을 뒤집는 일이 없습니다.
    - text: 숫자는 그대로 두고, 단계가 더 생길 수 있다는 문구를 덧붙입니다
      reason: >-
        미리 알렸으니 전체 수가 늘어나도 더는 뜻밖의 일이 아닙니다.
---
