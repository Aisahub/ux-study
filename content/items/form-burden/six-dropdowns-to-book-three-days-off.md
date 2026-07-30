---
sourceSection: Follow Conventions for Form Elements
principles:
  - control-fit
  - cognitive-load
artefact:
  en: >-
    A leave request in an internal HR tool, headed "Request leave". The first
    row is a leave-type dropdown reading "Annual". The second row, labelled
    "First day", holds three separate dropdowns side by side — a year, a month
    and a day. The third row, labelled "Last day", holds three more of exactly
    the same kind. The fourth row is a cover-colleague dropdown. A "Send
    request" button sits at the bottom. Every one of the six date dropdowns is
    closed, so what each of them contains is behind a tap.
  ko: >-
    사내 인사 도구의 휴가 신청 화면입니다. 제목은 "휴가 신청"입니다. 첫 줄은
    "연차"라고 적힌 휴가 종류 드롭다운입니다. "시작일"이라고 적힌 두 번째 줄에는
    드롭다운 세 개가 나란히 있습니다 — 연, 월, 일입니다. "종료일"이라고 적힌 세
    번째 줄에도 똑같은 종류의 드롭다운이 셋 더 있습니다. 네 번째 줄은 업무 대행자
    드롭다운입니다. 맨 아래에 "신청하기" 버튼이 있습니다. 날짜 드롭다운 여섯 개는
    모두 닫혀 있어서, 각각 무엇이 들어 있는지는 눌러 봐야 알 수 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Request leave</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Leave type</span><span class="control">Annual &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">First day</span><span class="control control--empty">Year &#9662;</span><span class="control control--empty">Month &#9662;</span><span class="control control--empty">Day &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Last day</span><span class="control control--empty">Year &#9662;</span><span class="control control--empty">Month &#9662;</span><span class="control control--empty">Day &#9662;</span></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Cover</span><span class="control control--empty">Choose a colleague &#9662;</span></div>
      <div class="actions"><button class="btn btn--blue">Send request</button></div>
    </div>
  ko: |-
    <div class="screen">
      <h1>휴가 신청</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">휴가 종류</span><span class="control">연차 &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">시작일</span><span class="control control--empty">연도 &#9662;</span><span class="control control--empty">월 &#9662;</span><span class="control control--empty">일 &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">종료일</span><span class="control control--empty">연도 &#9662;</span><span class="control control--empty">월 &#9662;</span><span class="control control--empty">일 &#9662;</span></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">업무 대행자</span><span class="control control--empty">동료 선택 &#9662;</span></div>
      <div class="actions"><button class="btn btn--blue">신청하기</button></div>
    </div>
prompt:
  en: >-
    Most people using this tool are booking a short run of days, a few weeks
    ahead. Which change takes the most work out of that?
  ko: >-
    이 도구를 쓰는 사람들은 대개 몇 주 뒤의 짧은 며칠을 신청합니다. 그 일에서
    수고를 가장 많이 덜어내는 변경은 무엇일까요?
options:
  en:
    - text: Replace the six dropdowns with one date-range field, picked on a calendar or typed straight in
      reason: >-
        A range is one thing, so it should be one control. Two taps on a month
        the user can already see says what six openings said, and the two dates
        stop being six answers that have to agree.
      correct: true
    - text: Keep the first day as three dropdowns and work the last day out from a "number of days" box
      reason: >-
        Half the dropdowns go, and most leave is a run of consecutive days
        anyway, so the second date is usually arithmetic the tool can do.
    - text: Turn the six dropdowns into six typed boxes
      reason: >-
        Anyone who already knows the dates can type them straight through
        without waiting for a menu to open.
    - text: Show the working-day count as soon as both dates are set
      reason: >-
        Nobody counts a weekend by hand, which is where most requests come back
        with the wrong total on them.
  ko:
    - text: 드롭다운 여섯 개를 기간 입력 하나로 바꿔, 달력에서 고르거나 그대로 입력하게 합니다
      reason: >-
        기간은 하나이므로 컨트롤도 하나여야 합니다. 이미 눈앞에 펼쳐진 달에서 두
        번 누르는 것이 여섯 번 여는 것과 같은 말을 하고, 두 날짜는 서로 맞아야 할
        여섯 개의 답이기를 그만둡니다.
      correct: true
    - text: 시작일은 드롭다운 셋으로 두고, 종료일은 "며칠" 칸에서 계산해 냅니다
      reason: >-
        드롭다운이 절반으로 줄고, 어차피 휴가는 대개 이어지는 며칠이라 두 번째
        날짜는 도구가 대신 셈해 줄 수 있는 값입니다.
    - text: 드롭다운 여섯 개를 직접 입력하는 칸 여섯 개로 바꿉니다
      reason: >-
        날짜를 이미 알고 있는 사람은 메뉴가 열리기를 기다리지 않고 그대로 쳐
        내려갈 수 있습니다.
    - text: 두 날짜가 정해지는 즉시 근무일 수를 보여 줍니다
      reason: >-
        주말을 손으로 세는 사람이 없어집니다. 신청이 반려되는 이유는 대개 그
        일수가 틀려서입니다.
---
