---
sourceSection: 'Back Button'
principles:
  - mental-model
artefact:
  en: >-
    A four-step claim form, at three moments. In the first, the reader is on
    step 3 of 4, "Damage details", with a description typed into the box and
    two photographs attached. In the second, the browser's back button has just
    been pressed. In the third, the page shows step 1 of 4, "Your policy", with
    every field empty, and a line at the top reading "Start a new claim". The
    description and the photographs are nowhere on the page.
  ko: >-
    네 단계짜리 보험 청구 양식을 세 시점에 걸쳐 보여 줍니다. 첫 시점에서 사용자는
    4단계 중 3단계 "피해 내용"에 있고, 설명을 입력해 두었으며 사진 두 장을
    첨부해 둔 상태입니다. 두 번째 시점은 브라우저의 뒤로 가기를 막 누른
    참입니다. 세 번째 시점에서 화면은 4단계 중 1단계 "계약 정보"이고, 모든 칸이
    비어 있으며, 맨 위에는 "새 청구 시작"이라고 적혀 있습니다. 입력해 둔 설명과
    사진은 화면 어디에도 없습니다.
sequence:
  - caption:
      en: On step 3, with the description typed and two photographs attached
      ko: 3단계에서, 설명을 입력하고 사진 두 장을 첨부해 둔 상태
    screen:
      en: |-
        <div class="screen">
          <p class="step-mark">Step 3 of 4 · Damage details</p>
          <div class="stack">
            <div class="field"><span class="field-label">What happened</span><span class="control">Water came through the kitchen ceiling on the 3rd</span></div>
            <div class="field"><span class="field-label">Photographs</span><span class="control">ceiling-1.jpg, ceiling-2.jpg</span></div>
          </div>
          <div class="actions actions--end" style="margin-top:14px">
            <button class="btn btn--hairline">Previous</button>
            <button class="btn btn--blue">Continue</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <p class="step-mark">4단계 중 3단계 · 피해 내용</p>
          <div class="stack">
            <div class="field"><span class="field-label">무슨 일이 있었나요</span><span class="control">3일에 주방 천장에서 물이 샜습니다</span></div>
            <div class="field"><span class="field-label">사진</span><span class="control">ceiling-1.jpg, ceiling-2.jpg</span></div>
          </div>
          <div class="actions actions--end" style="margin-top:14px">
            <button class="btn btn--hairline">이전</button>
            <button class="btn btn--blue">계속</button>
          </div>
        </div>
  - caption:
      en: The moment the browser's back button is pressed
      ko: 브라우저 뒤로 가기를 누른 순간
    screen:
      en: |-
        <div class="screen">
          <div class="toolbar"><span>←</span><span class="muted">claims.example.com/new</span></div>
          <p class="step-mark" style="margin-top:14px">Step 3 of 4 · Damage details</p>
          <div class="stack">
            <div class="field"><span class="field-label">What happened</span><span class="control">Water came through the kitchen ceiling on the 3rd</span></div>
            <div class="field"><span class="field-label">Photographs</span><span class="control">ceiling-1.jpg, ceiling-2.jpg</span></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="toolbar"><span>←</span><span class="muted">claims.example.com/new</span></div>
          <p class="step-mark" style="margin-top:14px">4단계 중 3단계 · 피해 내용</p>
          <div class="stack">
            <div class="field"><span class="field-label">무슨 일이 있었나요</span><span class="control">3일에 주방 천장에서 물이 샜습니다</span></div>
            <div class="field"><span class="field-label">사진</span><span class="control">ceiling-1.jpg, ceiling-2.jpg</span></div>
          </div>
        </div>
  - caption:
      en: The page that arrives
      ko: 도착한 화면
    screen:
      en: |-
        <div class="screen">
          <h2>Start a new claim</h2>
          <p class="step-mark">Step 1 of 4 · Your policy</p>
          <div class="stack">
            <div class="field"><span class="field-label">Policy number</span><span class="control control--empty">Enter your policy number</span></div>
            <div class="field"><span class="field-label">Postcode</span><span class="control control--empty">Enter your postcode</span></div>
          </div>
          <div class="actions actions--end" style="margin-top:14px">
            <button class="btn btn--blue">Continue</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>새 청구 시작</h2>
          <p class="step-mark">4단계 중 1단계 · 계약 정보</p>
          <div class="stack">
            <div class="field"><span class="field-label">증권번호</span><span class="control control--empty">증권번호를 입력하세요</span></div>
            <div class="field"><span class="field-label">우편번호</span><span class="control control--empty">우편번호를 입력하세요</span></div>
          </div>
          <div class="actions actions--end" style="margin-top:14px">
            <button class="btn btn--blue">계속</button>
          </div>
        </div>
prompt:
  en: >-
    A quarter of the people who reach step 3 never submit a claim at all. Which
    change should the form make?
  ko: >-
    3단계까지 온 사람 가운데 네 명 중 한 명은 끝내 청구를 넣지 않습니다. 이
    양식은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Make the browser's back button land on step 2, with everything already typed still there
      reason: >-
        Back means one step back everywhere else on the web, and this form is
        not where somebody will decide that belief was wrong.
      correct: true
    - text: Show a dialog when back is pressed, asking whether to leave and lose the claim
      reason: >-
        Nothing is destroyed without the person saying so, and the warning
        arrives at the moment the decision is being made.
    - text: Keep the behaviour and put a line above the form saying to use Previous rather than the browser's back
      reason: >-
        The form has its own control for going back, and the line points at it
        before anybody reaches for the wrong one.
    - text: Save the typed answers as a draft, so a person who lands on step 1 can resume from a banner there
      reason: >-
        The work survives the trip, and the way back to it is on the page they
        arrive at.
  ko:
    - text: 브라우저 뒤로 가기가 2단계로, 입력한 내용이 그대로 남은 채 도착하게 합니다
      reason: >-
        웹의 다른 모든 곳에서 뒤로 가기는 한 단계 뒤를 뜻하고, 그 믿음이 틀렸다고
        사람들이 판단하게 될 자리가 이 양식은 아닙니다.
      correct: true
    - text: 뒤로 가기를 누르면 나가면 청구 내용이 사라진다고 묻는 창을 띄웁니다
      reason: >-
        본인이 그러겠다고 하기 전에는 아무것도 지워지지 않고, 경고도 판단하는 바로
        그 순간에 옵니다.
    - text: 동작은 그대로 두고, 양식 위에 브라우저 뒤로 가기 대신 "이전"을 쓰라는 안내를 답니다
      reason: >-
        양식에는 뒤로 가는 자체 버튼이 있고, 안내가 엉뚱한 곳에 손이 가기 전에 그
        버튼을 가리켜 줍니다.
    - text: 입력한 답을 임시 저장해, 1단계에 도착한 사람이 그 화면의 안내 띠에서 이어 하도록 합니다
      reason: >-
        오가는 동안에도 작업이 살아남고, 돌아가는 길도 도착한 화면 위에 있습니다.
---
