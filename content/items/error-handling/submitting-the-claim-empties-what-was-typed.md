---
sourceSection: "Efficiency Guidelines: Preserve the user's input"
principles:
  - error-recovery
  - cognitive-load
artefact:
  en: >-
    An expense-claim form in two states. In the first, four boxes are filled in
    — a date, a category, an amount, and a description of three taxi trips to a
    plant — and the fifth, "Approver", still shows its placeholder. "Save draft"
    and "Submit" sit at the foot. In the second state a red strip has appeared
    across the top reading "Claims over Rp 500,000 need an approver. Choose one
    and submit again", and every one of the five boxes now shows its
    placeholder: the date, the category, the amount and the description are all
    gone along with the approver that was never chosen.
  ko: >-
    지출 결의 폼을 두 시점에 걸쳐 보여 줍니다. 첫 번째에서는 날짜, 분류, 금액,
    그리고 공장까지 택시를 세 번 탔다는 내용까지 네 칸이 채워져 있고, 다섯 번째
    "결재자" 칸만 아직 안내 문구 상태입니다. 맨 아래에는 "임시 저장"과
    "제출"이 있습니다. 두 번째 시점에서는 맨 위에 "500,000원이 넘는 지출은
    결재자가 필요합니다. 결재자를 고르고 다시 제출하세요"라는 빨간 띠가
    생겼고, 다섯 칸 모두가 안내 문구 상태로 돌아가 있습니다. 고르지 않았던
    결재자와 함께 날짜와 분류, 금액, 내용까지 모두 사라졌습니다.
sequence:
  - caption:
      en: With the claim filled in, the moment before Submit is pressed
      ko: 내용을 다 채우고 제출을 누르기 직전
    screen:
      en: |-
        <div class="screen">
          <h1>Expense claim</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Date</span><input class="control" style="width:200px" value="2026-07-24"></div>
            <div class="field"><span class="field-label">Category</span><input class="control" style="width:200px" value="Travel"></div>
            <div class="field"><span class="field-label">Amount</span><input class="control" style="width:200px" value="Rp 812,000"></div>
            <div class="field"><span class="field-label">Description</span><input class="control" style="width:340px" value="Taxi to Cikarang plant, three trips"></div>
            <div class="field"><span class="field-label">Approver</span><input class="control control--empty" style="width:200px" value="Not chosen"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Save draft</span><button class="btn btn--blue">Submit</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>지출 결의</h1>
          <div class="stack">
            <div class="field"><span class="field-label">날짜</span><input class="control" style="width:200px" value="2026-07-24"></div>
            <div class="field"><span class="field-label">분류</span><input class="control" style="width:200px" value="교통비"></div>
            <div class="field"><span class="field-label">금액</span><input class="control" style="width:200px" value="812,000원"></div>
            <div class="field"><span class="field-label">내용</span><input class="control" style="width:340px" value="판교 공장까지 택시 세 번"></div>
            <div class="field"><span class="field-label">결재자</span><input class="control control--empty" style="width:200px" value="선택 안 함"></div>
            <div class="actions actions--end"><span class="btn btn--outline">임시 저장</span><button class="btn btn--blue">제출</button></div>
          </div>
        </div>
  - caption:
      en: The page as it comes back, one second after Submit
      ko: 제출하고 1초 뒤 돌아온 화면
    screen:
      en: |-
        <div class="screen">
          <h1>Expense claim</h1>
          <div class="stack">
            <p class="banner banner--red">Claims over Rp 500,000 need an approver. Choose one and submit again.</p>
            <div class="field"><span class="field-label">Date</span><input class="control control--empty" style="width:200px" value="dd/mm/yyyy"></div>
            <div class="field"><span class="field-label">Category</span><input class="control control--empty" style="width:200px" value="Not chosen"></div>
            <div class="field"><span class="field-label">Amount</span><input class="control control--empty" style="width:200px" value="Rp 0"></div>
            <div class="field"><span class="field-label">Description</span><input class="control control--empty" style="width:340px" value="What was this for?"></div>
            <div class="field"><span class="field-label">Approver</span><input class="control control--empty" style="width:200px" value="Not chosen"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Save draft</span><button class="btn btn--blue">Submit</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>지출 결의</h1>
          <div class="stack">
            <p class="banner banner--red">500,000원이 넘는 지출은 결재자가 필요합니다. 결재자를 고르고 다시 제출하세요.</p>
            <div class="field"><span class="field-label">날짜</span><input class="control control--empty" style="width:200px" value="연-월-일"></div>
            <div class="field"><span class="field-label">분류</span><input class="control control--empty" style="width:200px" value="선택 안 함"></div>
            <div class="field"><span class="field-label">금액</span><input class="control control--empty" style="width:200px" value="0원"></div>
            <div class="field"><span class="field-label">내용</span><input class="control control--empty" style="width:340px" value="어디에 쓴 비용인가요?"></div>
            <div class="field"><span class="field-label">결재자</span><input class="control control--empty" style="width:200px" value="선택 안 함"></div>
            <div class="actions actions--end"><span class="btn btn--outline">임시 저장</span><button class="btn btn--blue">제출</button></div>
          </div>
        </div>
prompt:
  en: >-
    What should this page do differently when it comes back carrying that
    message?
  ko: >-
    이 페이지가 그 메시지를 안고 돌아올 때, 무엇을 달리해야 할까요?
options:
  en:
    - text: Move the message from the top of the page to just under Approver
      reason: >-
        It lands in the place where the missing value has to be chosen.
    - text: Mark Approver as required, with the red marker the rest of the tool uses
      reason: >-
        The requirement is known before the work is done rather than after it.
    - text: Check the approver rule as soon as the amount goes over the limit
      reason: >-
        The rule surfaces while the amount is still being typed, so the refusal
        is never a surprise at the end.
    - text: Bring the page back with everything that was typed still in place, and the cursor in Approver
      reason: >-
        Four correct values were thrown away over a fifth that was missing, and
        the interface already had all four.
      correct: true
  ko:
    - text: 메시지를 페이지 맨 위에서 결재자 칸 바로 아래로 옮깁니다
      reason: >-
        비어 있는 값을 골라야 하는 바로 그 자리에 메시지가 놓입니다.
    - text: 결재자를 필수 항목으로 표시합니다 — 도구의 다른 곳과 같은 빨간 표시로
      reason: >-
        일을 다 한 뒤가 아니라 하기 전에 그 조건을 알게 됩니다.
    - text: 금액이 기준을 넘는 순간 결재자 규칙을 검사합니다
      reason: >-
        금액을 입력하는 중에 규칙이 드러나므로, 마지막에 거절당해 놀랄 일이
        없어집니다.
    - text: 입력했던 값을 모두 그대로 둔 채로 페이지를 돌려주고, 커서를 결재자 칸에 둡니다
      reason: >-
        비어 있는 다섯 번째 하나 때문에 제대로 채운 네 값을 버렸습니다. 그 네
        값은 인터페이스가 이미 가지고 있었습니다.
      correct: true
---
