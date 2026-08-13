---
sourceSection: 'When to Conduct a Heuristic Evaluation'
principles:
  - realistic-task
  - named-heuristic
artefact:
  en: >-
    The research section of a launch plan for a new bank-account opening flow,
    six weeks before it goes live. It reads: "Research: two UX specialists will
    run a heuristic evaluation of the full flow in week 2 and we will fix
    everything they raise by week 4. We have dropped the usability sessions
    that were scheduled for week 3 — the heuristic evaluation covers the same
    ground faster and does not need recruiting, which was the part at risk. We
    will monitor drop-off after launch." Below it, the timeline shows week 2
    "Heuristic evaluation", week 4 "Fixes", week 6 "Launch".
  ko: >-
    새 계좌 개설 흐름의 출시 계획 가운데 리서치 부분으로, 출시 6주 전 시점입니다.
    내용은 이렇습니다. "리서치: 2주 차에 UX 전문가 두 명이 전체 흐름을 휴리스틱
    평가하고, 여기서 나온 것은 4주 차까지 모두 고칩니다. 3주 차에 잡혀 있던 사용성
    테스트는 뺐습니다 — 휴리스틱 평가가 같은 범위를 더 빨리 훑고, 위험 요소였던
    참가자 모집도 필요 없습니다. 출시 후에는 이탈률을 관찰합니다." 아래 일정표에는
    2주 차 "휴리스틱 평가", 4주 차 "수정", 6주 차 "출시"가 적혀 있습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Account opening — launch plan</h2>
      <div class="prose">
        <p><strong>Research:</strong> two UX specialists will run a heuristic evaluation of the full flow in week 2 and we will fix everything they raise by week 4.</p>
        <p>We have dropped the usability sessions that were scheduled for week 3 — the heuristic evaluation covers the same ground faster and does not need recruiting, which was the part at risk. We will monitor drop-off after launch.</p>
      </div>
      <table class="table" style="margin-top:12px">
        <thead><tr><th>Week</th><th>What happens</th></tr></thead>
        <tbody>
          <tr><td>2</td><td>Heuristic evaluation</td></tr>
          <tr><td>4</td><td>Fixes</td></tr>
          <tr><td>6</td><td>Launch</td></tr>
        </tbody>
      </table>
    </div>
  ko: |-
    <div class="screen">
      <h2>계좌 개설 — 출시 계획</h2>
      <div class="prose">
        <p><strong>리서치:</strong> 2주 차에 UX 전문가 두 명이 전체 흐름을 휴리스틱 평가하고, 여기서 나온 것은 4주 차까지 모두 고칩니다.</p>
        <p>3주 차에 잡혀 있던 사용성 테스트는 뺐습니다 — 휴리스틱 평가가 같은 범위를 더 빨리 훑고, 위험 요소였던 참가자 모집도 필요 없습니다. 출시 후에는 이탈률을 관찰합니다.</p>
      </div>
      <table class="table" style="margin-top:12px">
        <thead><tr><th>주차</th><th>내용</th></tr></thead>
        <tbody>
          <tr><td>2</td><td>휴리스틱 평가</td></tr>
          <tr><td>4</td><td>수정</td></tr>
          <tr><td>6</td><td>출시</td></tr>
        </tbody>
      </table>
    </div>
prompt:
  en: >-
    Which change should this plan make?
  ko: >-
    이 계획은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Keep the evaluation in week 2 and put the sessions back in week 3, on the flow as fixed
      reason: >-
        An evaluation finds what breaks a rule; only somebody opening a real
        account finds what they cannot do, and no amount of expertise substitutes.
      correct: true
    - text: Move the evaluation to week 1 and use the time saved to run the sessions in week 3
      reason: >-
        Both are kept and the fixes get two more weeks, which is where the plan
        was tightest.
    - text: Keep the plan and add a third evaluator, since two is below the recommended number
      reason: >-
        A larger panel finds more of the problems that are there to be found,
        for a fraction of what recruiting costs.
    - text: Keep the plan and treat the post-launch drop-off numbers as the test
      reason: >-
        Real customers on the real flow is the strongest evidence available, and
        it costs nothing to collect.
  ko:
    - text: 2주 차 평가는 그대로 두고, 3주 차 사용성 테스트를 되살리되 수정이 반영된 흐름으로 진행합니다
      reason: >-
        평가가 찾아내는 것은 규칙을 어긴 자리이고, 실제로 계좌를 만들어 보는 사람만이
        무엇을 못 해내는지 찾아내며, 전문성으로 대신할 수 있는 것이 아닙니다.
      correct: true
    - text: 평가를 1주 차로 당기고, 아낀 시간으로 3주 차에 사용성 테스트를 합니다
      reason: >-
        둘 다 지키면서 수정 기간이 2주 늘어나는데, 이 계획에서 가장 빠듯했던
        부분이 거기입니다.
    - text: 계획은 그대로 두고 평가자를 한 명 늘립니다. 두 명은 권장 인원에 못 미치니까요
      reason: >-
        평가단이 커질수록 찾아낼 수 있는 문제를 더 많이 찾아내고, 비용도 참가자
        모집에 비하면 얼마 되지 않습니다.
    - text: 계획은 그대로 두고, 출시 후 이탈률 수치를 테스트로 삼습니다
      reason: >-
        실제 흐름 위의 실제 고객이야말로 가장 강력한 근거이고, 모으는 데 드는
        비용도 없습니다.
---
