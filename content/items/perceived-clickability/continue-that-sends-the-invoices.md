---
sourceSection: "Don't Forget a Useful Button Label"
principles:
  - signifier
artefact:
  en: >-
    The last step of a billing wizard in an internal finance tool. The page
    summarises the run — "45 invoices · $18,300 total" — above two buttons: a
    solid blue "Continue" and an outlined "Back". Clicking Continue emails
    all 45 invoices to customers immediately; there is no later step, and
    nothing on the page says so.
  ko: >-
    사내 재무 도구의 청구서 발송 마법사, 그 마지막 단계입니다. 화면에는
    작업 요약 — "청구서 45건 · 합계 2,430만 원" — 이 있고 그 아래 버튼 두
    개, 파랑 채움의 "계속"과 외곽선의 "뒤로"가 있습니다. "계속"을 누르면
    45건의 청구서가 그 즉시 고객들에게 메일로 나갑니다. 다음 단계는 없고,
    화면 어디에도 그렇다는 말이 없습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Billing run — step 3 of 3</h2>
      <div class="region" style="margin-bottom:16px">
        <p style="font-size:20px;font-weight:600;margin:0">45 invoices · $18,300 total</p>
        <p class="muted" style="margin:6px 0 0">Period 1–30 June · 45 customers</p>
      </div>
      <div class="actions">
        <button class="btn btn--blue">Continue</button>
        <button class="btn btn--outline">Back</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>청구서 발송 — 3단계 중 3단계</h2>
      <div class="region" style="margin-bottom:16px">
        <p style="font-size:20px;font-weight:600;margin:0">청구서 45건 · 합계 2,430만 원</p>
        <p class="muted" style="margin:6px 0 0">6월 1일–30일 · 고객 45곳</p>
      </div>
      <div class="actions">
        <button class="btn btn--blue">계속</button>
        <button class="btn btn--outline">뒤로</button>
      </div>
    </div>
prompt:
  en: >-
    Which change makes the click's consequence visible before anyone clicks?
  ko: >-
    누르기 전에 그 클릭의 결과가 보이게 하려면 무엇을 바꿔야 할까요?
options:
  en:
    - text: Relabel the blue button "Send 45 invoices"
      reason: >-
        The label alone then says what happens, on a screen with no next step
        to catch a mistake.
      correct: true
    - text: Keep the label and add a progress spinner after the click
      reason: >-
        The user then knows the send is under way.
    - text: Keep "Continue" and colour the button red
      reason: >-
        Its weight then warns that this step matters more than the ones before.
    - text: Keep "Continue" and add a confirmation page after it
      reason: >-
        The send is finally described and approved there.
  ko:
    - text: 파란 버튼의 이름을 "청구서 45건 발송"으로 바꿉니다
      reason: >-
        실수를 잡아 줄 다음 단계가 없는 화면이니, 이름표만으로 무슨 일이
        벌어지는지 말하게 합니다.
      correct: true
    - text: 이름표는 두고 누른 뒤에 진행 스피너를 붙입니다
      reason: >-
        그래야 발송이 진행 중임을 사용자가 알 수 있습니다.
    - text: '"계속"은 두고 버튼을 빨강으로 칠합니다'
      reason: >-
        이 단계가 앞 단계들보다 무겁다는 경고가 됩니다.
    - text: '"계속"은 두고 그 뒤에 확인 페이지를 하나 더 붙입니다'
      reason: >-
        발송 내용을 거기서 비로소 설명하고 승인받게 합니다.
---
