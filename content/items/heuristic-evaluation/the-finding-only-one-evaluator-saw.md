---
sourceSection: 'Step 3: Consolidate Identified Issues'
principles:
  - independent-evaluation
artefact:
  en: >-
    The consolidation sheet after three evaluators walked a pensions dashboard
    separately. Five findings are listed, each with a tick under the evaluators
    who raised it. Four of them carry two or three ticks. The fifth, "The
    projected income figure changes when the page is reloaded, and nothing says
    why", carries one tick — Sara's. A note beside it reads "Sara has worked on
    pensions products before; the other two have not."
  ko: >-
    평가자 세 명이 연금 대시보드를 따로따로 훑은 뒤 정리한 표입니다. 발견 다섯
    개가 나열되어 있고, 각 발견을 지적한 평가자 칸에 표시가 되어 있습니다. 그중
    넷은 표시가 두세 개씩 있습니다. 다섯 번째인 "예상 수령액 숫자가 페이지를 다시
    불러올 때마다 달라지는데, 왜 그런지 어디에도 적혀 있지 않다"에는 표시가 하나,
    사라의 것뿐입니다. 옆에는 "사라는 전에 연금 상품 일을 해 본 적이 있고, 나머지
    둘은 없다"라는 메모가 붙어 있습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Consolidation — pensions dashboard</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>Finding</th><th>Priya</th><th>Tom</th><th>Sara</th></tr></thead>
          <tbody>
            <tr><td>Contribution history has no column headings on a phone</td><td>✓</td><td>✓</td><td>✓</td></tr>
            <tr><td>"Transfer out" and "Move your pot" name the same action</td><td>✓</td><td>✓</td><td></td></tr>
            <tr><td>No way back from the risk questionnaire once started</td><td>✓</td><td></td><td>✓</td></tr>
            <tr><td>Currency shown without a symbol on the summary tile</td><td></td><td>✓</td><td>✓</td></tr>
            <tr><td>Projected income changes on reload, and nothing says why</td><td></td><td></td><td>✓</td></tr>
          </tbody>
        </table>
      </div>
      <p class="note">Sara has worked on pensions products before; the other two have not.</p>
    </div>
  ko: |-
    <div class="screen">
      <h2>정리 — 연금 대시보드</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>발견</th><th>프리야</th><th>톰</th><th>사라</th></tr></thead>
          <tbody>
            <tr><td>납입 내역에 휴대폰에서 열 제목이 없음</td><td>✓</td><td>✓</td><td>✓</td></tr>
            <tr><td>"이전 출금"과 "적립금 옮기기"가 같은 동작을 가리킴</td><td>✓</td><td>✓</td><td></td></tr>
            <tr><td>위험 성향 설문을 시작하면 되돌아갈 길이 없음</td><td>✓</td><td></td><td>✓</td></tr>
            <tr><td>요약 타일에 통화 기호 없이 숫자만 표시됨</td><td></td><td>✓</td><td>✓</td></tr>
            <tr><td>예상 수령액이 새로고침할 때마다 달라지는데 이유가 없음</td><td></td><td></td><td>✓</td></tr>
          </tbody>
        </table>
      </div>
      <p class="note">사라는 전에 연금 상품 일을 해 본 적이 있고, 나머지 둘은 없습니다.</p>
    </div>
prompt:
  en: >-
    What should the team do with the fifth finding?
  ko: >-
    이 팀은 다섯 번째 발견을 어떻게 해야 할까요?
options:
  en:
    - text: Take it to the team who built it and find out whether the figure really does change, before ranking it
      reason: >-
        One tick says one person saw it, not that it is small — and this is the
        one finding where whether it is real can simply be established.
      correct: true
    - text: Rank it below the other four, since agreement across evaluators is what severity is built from
      reason: >-
        The findings more than one person reached independently are the ones
        most users are most likely to meet.
    - text: Drop it — a single tick out of three is the weakest evidence on the sheet
      reason: >-
        A list that keeps everything anybody said stops being a shortlist of
        what to fix.
    - text: Keep it and mark it as domain expertise, so the team knows it came from the one evaluator who knows pensions
      reason: >-
        Where a finding came from is recorded honestly, and a reader can weigh
        it knowing that.
  ko:
    - text: 순위를 매기기 전에, 만든 팀에게 가져가 그 숫자가 실제로 달라지는지 확인합니다
      reason: >-
        표시가 하나라는 것은 한 사람이 봤다는 뜻이지 사소하다는 뜻이 아니고, 이
        발견만큼은 사실인지 아닌지를 그냥 확인해 볼 수 있습니다.
      correct: true
    - text: 나머지 넷보다 아래로 내립니다. 심각도는 평가자들의 일치에서 나오니까요
      reason: >-
        여러 사람이 따로 도달한 발견일수록 실제 사용자가 부딪힐 가능성이 큽니다.
    - text: 뺍니다 — 셋 중 하나는 이 표에서 가장 약한 근거입니다
      reason: >-
        누가 무슨 말을 했든 다 남기는 목록은 무엇을 고칠지 추린 목록이 아니게
        됩니다.
    - text: 남기되 도메인 지식에서 나온 발견이라고 표시해, 연금을 아는 평가자에게서 나왔음을 알립니다
      reason: >-
        발견이 어디서 나왔는지가 솔직하게 남고, 읽는 사람은 그것을 알고 무게를
        가늠할 수 있습니다.
---
