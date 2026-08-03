---
sourceSection: 'Efficiency Guidelines: Reduce error-correction effort'
principles:
  - inline-validation
  - error-recovery
artefact:
  en: >-
    A three-step wizard for creating a price list, shown at three moments. The
    first is step 1 of 3, "Details", where "Name" holds "Q3 Jakarta Retail" and
    "Currency" holds IDR, with "Cancel" and "Next" at the foot; nothing on the
    step remarks on the name. The second is step 3 of 3, "Review", a bordered
    summary listing the same name and currency, 41 products priced with 6
    excluded, and rounding to the nearest 500, with "Back" and "Save price
    list" at the foot. The third is step 1 again: the name is still in its box,
    the box now has a red border, a red line under it reads "This name is
    already used by another price list. Pick a different one.", and the foot
    once again offers "Cancel" and "Next".
  ko: >-
    가격표를 만드는 3단계 마법사를 세 시점에서 보여 줍니다. 첫 번째는 1/3단계
    "기본 정보"로, "이름"에 "3분기 강남 소매"가, "통화"에 KRW가 들어 있고 맨
    아래에 "취소"와 "다음"이 있습니다. 이 단계에서 이름에 대해 언급하는 것은
    아무것도 없습니다. 두 번째는 3/3단계 "검토"로, 테두리가 둘린 요약 안에
    같은 이름과 통화, 상품 41개 적용에 6개 제외, 500원 단위 반올림이 적혀
    있고 맨 아래에 "이전"과 "가격표 저장"이 있습니다. 세 번째는 다시
    1단계입니다. 이름은 칸에 그대로 남아 있고 칸에는 빨간 테두리가 생겼으며, 그
    아래 빨간 줄에 "이미 다른 가격표가 쓰고 있는 이름입니다. 다른 이름을
    고르세요."라고 적혀 있고, 맨 아래에는 다시 "취소"와 "다음"이 있습니다.
sequence:
  - caption:
      en: Step 1, with the name typed and Next about to be pressed
      ko: 1단계, 이름을 입력하고 다음을 누르기 직전
    screen:
      en: |-
        <div class="screen">
          <h1>New price list</h1>
          <p class="muted">Step 1 of 3 &middot; Details</p>
          <div class="stack">
            <div class="field"><span class="field-label">Name</span><input class="control" style="width:260px" value="Q3 Jakarta Retail"></div>
            <div class="field"><span class="field-label">Currency</span><span class="control">IDR</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Next</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 가격표</h1>
          <p class="muted">1/3단계 &middot; 기본 정보</p>
          <div class="stack">
            <div class="field"><span class="field-label">이름</span><input class="control" style="width:260px" value="3분기 강남 소매"></div>
            <div class="field"><span class="field-label">통화</span><span class="control">KRW</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">다음</button></div>
          </div>
        </div>
  - caption:
      en: Step 3, once the two steps in between have been filled in
      ko: 그 사이 두 단계를 채우고 도착한 3단계
    screen:
      en: |-
        <div class="screen">
          <h1>New price list</h1>
          <p class="muted">Step 3 of 3 &middot; Review</p>
          <div class="stack">
            <div class="region stack">
              <div class="field"><span class="field-label">Name</span><span>Q3 Jakarta Retail</span></div>
              <div class="field"><span class="field-label">Currency</span><span>IDR</span></div>
              <div class="field"><span class="field-label">Products</span><span>41 priced, 6 excluded</span></div>
              <div class="field"><span class="field-label">Rounding</span><span>Nearest 500</span></div>
            </div>
            <div class="actions actions--end"><span class="btn btn--outline">Back</span><button class="btn btn--blue">Save price list</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 가격표</h1>
          <p class="muted">3/3단계 &middot; 검토</p>
          <div class="stack">
            <div class="region stack">
              <div class="field"><span class="field-label">이름</span><span>3분기 강남 소매</span></div>
              <div class="field"><span class="field-label">통화</span><span>KRW</span></div>
              <div class="field"><span class="field-label">상품</span><span>41개 적용, 6개 제외</span></div>
              <div class="field"><span class="field-label">반올림</span><span>500원 단위</span></div>
            </div>
            <div class="actions actions--end"><span class="btn btn--outline">이전</span><button class="btn btn--blue">가격표 저장</button></div>
          </div>
        </div>
  - caption:
      en: One second after Save price list is pressed
      ko: 가격표 저장을 누르고 1초 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>New price list</h1>
          <p class="muted">Step 1 of 3 &middot; Details</p>
          <div class="stack">
            <div>
              <div class="field"><span class="field-label">Name</span><input class="control" style="width:260px;border-color:#dc2626" value="Q3 Jakarta Retail"></div>
              <p class="field-msg field-msg--red">This name is already used by another price list. Pick a different one.</p>
            </div>
            <div class="field"><span class="field-label">Currency</span><span class="control">IDR</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Next</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 가격표</h1>
          <p class="muted">1/3단계 &middot; 기본 정보</p>
          <div class="stack">
            <div>
              <div class="field"><span class="field-label">이름</span><input class="control" style="width:260px;border-color:#dc2626" value="3분기 강남 소매"></div>
              <p class="field-msg field-msg--red">이미 다른 가격표가 쓰고 있는 이름입니다. 다른 이름을 고르세요.</p>
            </div>
            <div class="field"><span class="field-label">통화</span><span class="control">KRW</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">다음</button></div>
          </div>
        </div>
prompt:
  en: >-
    The name was refused. What should this wizard change?
  ko: >-
    이름이 거절됐습니다. 이 마법사는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Offer a free name in the message, so one is ready to accept
      reason: >-
        The person is handed something that will work instead of guessing at
        what is already taken.
    - text: Save the list under the taken name with a number added, and say so
      reason: >-
        Nothing built across the three steps is lost, and the list exists
        afterwards.
    - text: Show the same message on step 3 rather than dropping back to step 1
      reason: >-
        The person stays where they pressed the button instead of being thrown
        to the start.
    - text: Check the name against the existing lists as soon as step 1 is left, and refuse it there
      reason: >-
        Everything needed to know the name was taken was on screen at step 1;
        running the check at the end charges two more steps of work before
        saying so.
      correct: true
  ko:
    - text: 메시지에 아직 쓰이지 않은 이름을 제안해서 바로 받아들일 수 있게 합니다
      reason: >-
        무엇이 이미 쓰이고 있는지 짐작하는 대신, 통과할 이름을 손에 쥐게
        됩니다.
    - text: 쓰이고 있는 이름 뒤에 번호를 붙여 저장하고 그 사실을 알립니다
      reason: >-
        세 단계에 걸쳐 만든 것이 하나도 사라지지 않고, 가격표도 남습니다.
    - text: 1단계로 되돌리지 말고 3단계에서 같은 메시지를 보여 줍니다
      reason: >-
        버튼을 누른 자리에 그대로 머무를 뿐, 맨 앞으로 던져지지 않습니다.
    - text: 1단계를 벗어나는 순간 기존 가격표들과 이름을 대조해서 거기서 거절합니다
      reason: >-
        이름이 이미 쓰이고 있다는 사실은 1단계 화면만으로 알 수 있었습니다.
        검사를 맨 끝에서 돌리는 바람에 그 말을 듣기까지 두 단계의 일을 더
        치르게 했습니다.
      correct: true
---
