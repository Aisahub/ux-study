---
sourceSection: Allow Users to Easily Cancel an Action
principles:
  - emergency-exit
  - undo
artefact:
  en: >-
    Three states of a procurement tool. The first is a form headed "New vendor"
    with a line reading "Step 4 of 5"; Bank name holds "Hana Bank", Account
    number holds "110-4471-88203", Tax ID holds "214-81-77320". Its footer
    carries an underlined "Cancel" on the left and "Back" and a blue "Continue"
    on the right. The second state is the tool's Vendors screen, with the side
    menu back, a blue "New vendor" button and a three-row table of vendors. The
    third state is the form again: same heading, a line reading "Step 1 of 5",
    and two boxes — Vendor name and Business number — both showing a grey "Not
    set", with a blue "Continue" as the only control.
  ko: >-
    구매 도구의 세 상태입니다. 첫 번째는 "신규 협력사"라는 제목의 폼이고 "5단계
    중 4단계"라는 줄이 붙어 있습니다. 은행명에 "하나은행", 계좌번호에
    "110-4471-88203", 사업자등록번호에 "214-81-77320"이 들어 있습니다. 맨 아래에는
    왼쪽에 밑줄 친 "취소", 오른쪽에 "이전"과 파란 "계속"이 있습니다. 두 번째
    상태는 도구의 협력사 화면으로, 왼쪽 메뉴가 다시 보이고 파란 "신규 협력사"
    버튼과 세 줄짜리 협력사 표가 있습니다. 세 번째 상태는 다시 그 폼입니다.
    제목은 같고 "5단계 중 1단계"라는 줄이 붙어 있으며, 상호와 사업자등록번호 두
    칸 모두 회색으로 "미입력"이라고만 적혀 있고, 컨트롤은 파란 "계속" 하나뿐입니다.
sequence:
  - caption:
      en: Step 4 of 5, the moment before Cancel is pressed
      ko: 취소를 누르기 직전, 5단계 중 4단계
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>New vendor</h1>
            <p class="step-mark">Step 4 of 5</p>
            <div class="field"><span class="field-label">Bank name</span><span class="control">Hana Bank</span></div>
            <div class="field"><span class="field-label">Account number</span><span class="control">110-4471-88203</span></div>
            <div class="field"><span class="field-label">Tax ID</span><span class="control">214-81-77320</span></div>
            <div class="actions"><span class="link">Cancel</span><button class="btn btn--outline" style="margin-left:auto">Back</button><button class="btn btn--blue">Continue</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>신규 협력사</h1>
            <p class="step-mark">5단계 중 4단계</p>
            <div class="field"><span class="field-label">은행명</span><span class="control">하나은행</span></div>
            <div class="field"><span class="field-label">계좌번호</span><span class="control">110-4471-88203</span></div>
            <div class="field"><span class="field-label">사업자등록번호</span><span class="control">214-81-77320</span></div>
            <div class="actions"><span class="link">취소</span><button class="btn btn--outline" style="margin-left:auto">이전</button><button class="btn btn--blue">계속</button></div>
          </div>
        </div>
  - caption:
      en: Immediately after Cancel
      ko: 취소를 누른 직후
    screen:
      en: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">Vendors</div>
              <div class="side-item">Purchase orders</div>
              <div class="side-item">Contracts</div>
              <div class="side-item">Payments</div>
            </div>
            <div class="stack">
              <h1>Vendors</h1>
              <div class="actions actions--end"><button class="btn btn--blue">New vendor</button></div>
              <table class="table">
                <tr><th>Vendor</th><th>Status</th></tr>
                <tr><td>Daehan Paper</td><td>Approved</td></tr>
                <tr><td>Nova Logistics</td><td>Approved</td></tr>
                <tr><td>Seorim Print</td><td>In review</td></tr>
              </table>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">협력사</div>
              <div class="side-item">발주서</div>
              <div class="side-item">계약</div>
              <div class="side-item">지급</div>
            </div>
            <div class="stack">
              <h1>협력사</h1>
              <div class="actions actions--end"><button class="btn btn--blue">신규 협력사</button></div>
              <table class="table">
                <tr><th>협력사</th><th>상태</th></tr>
                <tr><td>대한제지</td><td>승인됨</td></tr>
                <tr><td>노바물류</td><td>승인됨</td></tr>
                <tr><td>서림인쇄</td><td>검토 중</td></tr>
              </table>
            </div>
          </div>
        </div>
  - caption:
      en: After pressing New vendor again
      ko: 신규 협력사를 다시 누른 뒤
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>New vendor</h1>
            <p class="step-mark">Step 1 of 5</p>
            <div class="field"><span class="field-label">Vendor name</span><span class="control control--empty">Not set</span></div>
            <div class="field"><span class="field-label">Business number</span><span class="control control--empty">Not set</span></div>
            <div class="actions actions--end"><button class="btn btn--blue">Continue</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>신규 협력사</h1>
            <p class="step-mark">5단계 중 1단계</p>
            <div class="field"><span class="field-label">상호</span><span class="control control--empty">미입력</span></div>
            <div class="field"><span class="field-label">사업자등록번호</span><span class="control control--empty">미입력</span></div>
            <div class="actions actions--end"><button class="btn btn--blue">계속</button></div>
          </div>
        </div>
prompt:
  en: >-
    The user pressed Cancel to get out, and came back to the flow later. Which
    change should it get?
  ko: >-
    사용자는 빠져나오려고 취소를 눌렀고, 나중에 이 플로우로 다시 돌아왔습니다.
    무엇을 바꿔야 할까요?
options:
  en:
    - text: Ask "Discard this vendor?" before Cancel takes effect
      reason: >-
        The user is told what leaving costs before they pay it, and can change
        their mind while the dialog is still open.
    - text: Keep what was entered as a draft, and reopen the flow where it was left
      reason: >-
        Getting out then costs nothing, so a user can leave a step they did not
        mean to be in without weighing it against the work they have done.
      correct: true
    - text: Take Cancel off the step and leave the browser's back button to do the job
      reason: >-
        One fewer control on every screen, and a way back is already sitting in
        the browser above the page.
    - text: Grey out Cancel once a field on the step has been filled
      reason: >-
        A part-finished registration can then only be abandoned deliberately,
        from the step it started on.
  ko:
    - text: 취소가 실행되기 전에 "이 협력사 등록을 버릴까요?"라고 묻습니다
      reason: >-
        나가는 데 무엇을 내놓아야 하는지 미리 알려 주고, 대화상자가 열려 있는 동안
        마음을 바꿀 수도 있습니다.
    - text: 입력한 내용을 임시 저장해 두고, 다시 들어오면 나갔던 자리에서 이어지게 합니다
      reason: >-
        빠져나오는 데 드는 값이 없어지니, 들어올 생각이 없던 단계를 여태 한 일과
        저울질하지 않고 그냥 떠날 수 있습니다.
      correct: true
    - text: 단계에서 취소를 없애고 브라우저 뒤로 가기에 맡깁니다
      reason: >-
        화면마다 컨트롤이 하나씩 줄고, 되돌아갈 길은 이미 페이지 위쪽 브라우저에
        붙어 있습니다.
    - text: 단계의 칸을 하나라도 채우면 취소를 비활성으로 만듭니다
      reason: >-
        절반쯤 채운 등록은 그때부터 시작한 단계로 돌아가 일부러 접어야만 접을 수
        있게 됩니다.
---
