---
sourceSection: 'Step 2: Evaluate Independently'
principles:
  - independent-evaluation
artefact:
  en: >-
    The note a team wrote at the top of their evaluation report. It reads: "The
    three of us went through the booking flow together on a call on Tuesday
    afternoon. Priya shared her screen and drove; Tom and Sara called out
    problems as they saw them and Priya wrote them into the sheet. We got
    through the whole flow in fifty minutes and agreed on nine issues. There
    was nothing we disagreed about, which gives us confidence the list is
    right." Under the note is the sheet: nine findings, each marked "agreed by
    all three".
  ko: >-
    한 팀이 평가 보고서 맨 위에 적어 둔 메모입니다. 내용은 이렇습니다. "셋이서
    화요일 오후에 통화하며 예약 흐름을 함께 훑었습니다. 프리야가 화면을 공유하며
    진행했고, 톰과 사라가 눈에 띄는 문제를 말하면 프리야가 문서에 적었습니다.
    흐름 전체를 50분 만에 끝냈고 아홉 가지에 합의했습니다. 서로 엇갈린 것이 하나도
    없었기에, 이 목록이 맞다고 확신합니다." 메모 아래에는 문서가 있는데, 발견
    아홉 개가 하나하나 "셋 모두 동의"로 표시되어 있습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Booking flow — heuristic evaluation</h2>
      <div class="prose">
        <p>The three of us went through the booking flow together on a call on Tuesday afternoon. Priya shared her screen and drove; Tom and Sara called out problems as they saw them and Priya wrote them into the sheet.</p>
        <p>We got through the whole flow in fifty minutes and agreed on nine issues. There was nothing we disagreed about, which gives us confidence the list is right.</p>
      </div>
      <table class="table" style="margin-top:12px">
        <thead><tr><th>#</th><th>Finding</th><th>Support</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>No confirmation after the deposit is taken</td><td>Agreed by all three</td></tr>
          <tr><td>2</td><td>Date picker opens on today, not on the search date</td><td>Agreed by all three</td></tr>
          <tr><td>3</td><td>"Guests" and "Party size" used on adjacent steps</td><td>Agreed by all three</td></tr>
        </tbody>
      </table>
    </div>
  ko: |-
    <div class="screen">
      <h2>예약 흐름 — 휴리스틱 평가</h2>
      <div class="prose">
        <p>셋이서 화요일 오후에 통화하며 예약 흐름을 함께 훑었습니다. 프리야가 화면을 공유하며 진행했고, 톰과 사라가 눈에 띄는 문제를 말하면 프리야가 문서에 적었습니다.</p>
        <p>흐름 전체를 50분 만에 끝냈고 아홉 가지에 합의했습니다. 서로 엇갈린 것이 하나도 없었기에, 이 목록이 맞다고 확신합니다.</p>
      </div>
      <table class="table" style="margin-top:12px">
        <thead><tr><th>#</th><th>발견</th><th>근거</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>보증금 결제 뒤 확인 화면이 없음</td><td>셋 모두 동의</td></tr>
          <tr><td>2</td><td>날짜 선택기가 검색한 날짜가 아니라 오늘로 열림</td><td>셋 모두 동의</td></tr>
          <tr><td>3</td><td>붙어 있는 두 단계에서 "인원"과 "예약 인원"을 섞어 씀</td><td>셋 모두 동의</td></tr>
        </tbody>
      </table>
    </div>
prompt:
  en: >-
    The sentence the team is proudest of is the one to look at. What should
    they do before this report goes anywhere?
  ko: >-
    이 팀이 가장 자랑스러워하는 문장이 바로 들여다볼 곳입니다. 이 보고서를
    내보내기 전에 무엇을 해야 할까요?
options:
  en:
    - text: Have each of the three walk the flow alone and write their findings down before comparing
      reason: >-
        Nine findings nobody disagreed about is what you get when two people
        hear the third one first, and it is not evidence of anything.
      correct: true
    - text: Keep the nine and have a fourth person evaluate alone, to see what the call missed
      reason: >-
        The list already made is not thrown away, and a pass nobody influenced
        says whether anything was left out.
    - text: Keep the nine and mark them as agreed by one evaluator rather than three
      reason: >-
        The report then claims only the support it actually has, without anybody
        redoing the work.
    - text: Keep the nine and add the severity each of the three would give, scored separately
      reason: >-
        The independent judgement missing from the walkthrough is recovered at
        the point where it changes what gets fixed first.
  ko:
    - text: 셋이 각자 혼자 흐름을 훑고, 견주기 전에 자기 발견을 먼저 적게 합니다
      reason: >-
        아무도 이견을 내지 않은 발견 아홉 개는 두 사람이 나머지 한 사람의 말을
        먼저 들었을 때 나오는 결과이고, 그것은 아무것의 근거도 되지 않습니다.
      correct: true
    - text: 아홉 개는 그대로 두고, 네 번째 사람이 혼자 평가해 통화에서 놓친 것을 보게 합니다
      reason: >-
        이미 만든 목록을 버리지 않으면서, 아무에게도 영향받지 않은 한 번의
        훑기가 빠뜨린 것이 있는지 말해 줍니다.
    - text: 아홉 개는 그대로 두되, 근거를 "셋 동의"가 아니라 "평가자 1인"으로 고칩니다
      reason: >-
        아무도 작업을 다시 하지 않고도, 보고서가 실제로 가진 만큼만 주장하게
        됩니다.
    - text: 아홉 개는 그대로 두고, 셋이 각자 매긴 심각도를 따로 받아 덧붙입니다
      reason: >-
        함께 훑는 동안 빠졌던 독립적인 판단을, 무엇을 먼저 고칠지가 갈리는
        지점에서 되찾게 됩니다.
---
