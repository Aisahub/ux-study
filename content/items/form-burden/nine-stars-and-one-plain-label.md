---
sourceSection: Mark Required Fields
principles:
  - cognitive-load
artefact:
  en: >-
    A system-access request in an internal IT tool, headed "Request system
    access". Ten fields run down the page: requester, employee number,
    department, manager, system, access level, reason, start date, end date and
    desk extension. Nine of the ten labels carry a small red star immediately
    after the words; the desk-extension label carries nothing. There is no
    legend anywhere on the screen saying what the star means, and no label uses
    the words "required" or "optional". A "Send request" button sits at the
    bottom.
  ko: >-
    사내 IT 도구의 시스템 접근 권한 신청 화면입니다. 제목은 "시스템 접근 권한
    신청"입니다. 칸 열 개가 아래로 이어집니다 — 신청자, 사번, 소속, 승인
    상급자, 시스템, 권한 등급, 사유, 시작일, 종료일, 내선번호입니다. 열 개 중 아홉
    개의 이름표 바로 뒤에는 작고 빨간 별표가 붙어 있고, 내선번호 이름표에는 아무
    것도 붙어 있지 않습니다. 별표가 무슨 뜻인지 알려 주는 안내는 화면 어디에도
    없고, "필수"나 "선택"이라는 말을 쓴 이름표도 없습니다. 맨 아래에 "신청하기"
    버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Request system access</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Requester <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Employee no. <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Department <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Manager <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">System <span class="required">*</span></span><span class="control control--empty">Choose a system &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Access level <span class="required">*</span></span><span class="control control--empty">Choose a level &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Reason <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Start date <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">End date <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Desk extension</span><input class="control" value=""></div>
      <div class="actions"><button class="btn btn--blue">Send request</button></div>
    </div>
  ko: |-
    <div class="screen">
      <h1>시스템 접근 권한 신청</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">신청자 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">사번 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">소속 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">승인 상급자 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">시스템 <span class="required">*</span></span><span class="control control--empty">시스템 선택 &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">권한 등급 <span class="required">*</span></span><span class="control control--empty">등급 선택 &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">사유 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">시작일 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">종료일 <span class="required">*</span></span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">내선번호</span><input class="control" value=""></div>
      <div class="actions"><button class="btn btn--blue">신청하기</button></div>
    </div>
prompt:
  en: >-
    Which change makes what this form actually demands quickest to take in?
  ko: >-
    이 폼이 실제로 무엇을 요구하는지 가장 빨리 알아보게 하려면 무엇을 바꿔야
    할까요?
options:
  en:
    - text: Drop the stars, and write "(optional)" in words after the labels that are not demanded
      reason: >-
        The exception is what has to be found, so the exception is what should
        carry the mark — and stated in words it needs no key to read.
      correct: true
    - text: Keep the stars and add a line above the first field reading "* Required field"
      reason: >-
        The mark is then explained where it is first met, which is the
        convention most forms already follow.
    - text: Make the stars larger and darker so that none of them can be missed
      reason: >-
        Nothing more is demanded than before; the marks simply stop being
        overlooked on a small screen.
    - text: Move the unstarred field to the bottom of the form
      reason: >-
        The starred fields then run as one unbroken block from the top, and the
        reader learns the pattern once.
  ko:
    - text: 별표를 없애고, 요구하지 않는 칸의 이름표 뒤에 "(선택)"이라고 글자로 적습니다
      reason: >-
        찾아내야 하는 쪽은 예외이므로, 표시를 다는 쪽도 예외여야 합니다. 게다가
        글자로 적으면 뜻을 풀이해 줄 안내가 따로 필요 없습니다.
      correct: true
    - text: 별표는 그대로 두고, 첫 칸 위에 "* 필수 입력"이라는 줄을 넣습니다
      reason: >-
        표시를 처음 만나는 자리에서 그 뜻을 알려 주게 되고, 이는 대부분의 폼이
        이미 따르는 관행입니다.
    - text: 별표를 더 크고 진하게 만들어 하나도 놓치지 않게 합니다
      reason: >-
        요구하는 것은 전과 똑같고, 작은 화면에서 표시를 지나치는 일만 없어집니다.
    - text: 별표가 없는 칸을 폼 맨 아래로 내립니다
      reason: >-
        별표가 붙은 칸들이 위에서부터 끊기지 않는 한 덩어리가 되어, 읽는 사람이
        규칙을 한 번만 익히면 됩니다.
---
