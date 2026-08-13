---
sourceSection: 'Why Usability Test?'
principles:
  - five-participants
artefact:
  en: >-
    The summary slide from a study of a charity's donation page, as it will be
    shown to the board. Three lines are set large: "80% of users could not find
    the Gift Aid checkbox", "40% abandoned before completing a donation", and
    "Average time to donate: 3 minutes 40 seconds". A line at the foot, set
    small, reads "Qualitative study, 5 participants, moderated remote,
    March". Beneath the slide is the raw session log: four of the five did not
    find the checkbox, two stopped before finishing, and the five completion
    times were 1:10, 2:05, 3:30, 5:15 and 6:40.
  ko: >-
    한 자선단체 기부 페이지 연구의 요약 슬라이드로, 이사회에 보고할 자료입니다.
    큰 글씨로 세 줄이 적혀 있습니다. "사용자의 80%가 기부금 세액공제 체크박스를
    찾지 못함", "40%가 기부를 마치기 전에 이탈", "평균 기부 소요 시간 3분 40초".
    맨 아래에는 작은 글씨로 "정성 연구, 참가자 5명, 원격 진행, 3월"이라고 적혀
    있습니다. 슬라이드 아래에는 실제 세션 기록이 있습니다. 다섯 중 넷이 체크박스를
    찾지 못했고, 둘은 끝내기 전에 그만두었으며, 완료 시간은 각각 1:10, 2:05,
    3:30, 5:15, 6:40이었습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">The slide for the board</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-value">80%</p><p class="stat-label">could not find Gift Aid</p></div>
            <div><p class="stat-value">40%</p><p class="stat-label">abandoned</p></div>
            <div><p class="stat-value">3:40</p><p class="stat-label">average to donate</p></div>
          </div>
          <p class="note">Qualitative study, 5 participants, moderated remote, March</p>
        </div>
      </div>
      <div>
        <p class="pane-label">The session log</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>Found Gift Aid</th><th>Finished</th><th>Time</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>No</td><td>Yes</td><td>1:10</td></tr>
              <tr><td>2</td><td>No</td><td>Yes</td><td>2:05</td></tr>
              <tr><td>3</td><td>Yes</td><td>Yes</td><td>3:30</td></tr>
              <tr><td>4</td><td>No</td><td>No</td><td>5:15</td></tr>
              <tr><td>5</td><td>No</td><td>No</td><td>6:40</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">이사회 보고 슬라이드</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-value">80%</p><p class="stat-label">체크박스를 못 찾음</p></div>
            <div><p class="stat-value">40%</p><p class="stat-label">이탈</p></div>
            <div><p class="stat-value">3:40</p><p class="stat-label">평균 소요 시간</p></div>
          </div>
          <p class="note">정성 연구, 참가자 5명, 원격 진행, 3월</p>
        </div>
      </div>
      <div>
        <p class="pane-label">세션 기록</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>체크박스 찾음</th><th>완료</th><th>시간</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>아니오</td><td>예</td><td>1:10</td></tr>
              <tr><td>2</td><td>아니오</td><td>예</td><td>2:05</td></tr>
              <tr><td>3</td><td>예</td><td>예</td><td>3:30</td></tr>
              <tr><td>4</td><td>아니오</td><td>아니오</td><td>5:15</td></tr>
              <tr><td>5</td><td>아니오</td><td>아니오</td><td>6:40</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change should this slide make before the board sees it?
  ko: >-
    이 슬라이드는 이사회에 보이기 전에 무엇을 바꿔야 할까요?
options:
  en:
    - text: Say it as counts of people — four of five, two of five — and drop the average time
      reason: >-
        A percentage invites a reader to treat five sessions as a measurement of
        everybody, and an average over five times that far apart measures nothing.
      correct: true
    - text: Keep the percentages and set the sample size in the same size type as them
      reason: >-
        Nothing is hidden, and a reader who sees "5 participants" as loudly as
        "80%" can weigh the two together.
    - text: Keep the slide and add a confidence interval to each figure
      reason: >-
        The uncertainty around each number is stated in the way the board is
        used to seeing uncertainty stated.
    - text: Replace the figures with the strongest quote from each session
      reason: >-
        A qualitative study's evidence is what people said and did, and the
        board hears it in the participants' own words.
  ko:
    - text: 사람 수로 적습니다 — 다섯 중 넷, 다섯 중 둘 — 그리고 평균 시간은 뺍니다
      reason: >-
        백분율은 다섯 번의 세션을 전체에 대한 측정처럼 읽게 만들고, 이만큼 벌어진
        다섯 개의 평균은 아무것도 재지 못합니다.
      correct: true
    - text: 백분율은 그대로 두되, 표본 수를 같은 크기의 글씨로 적습니다
      reason: >-
        감추는 것이 없어지고, "참가자 5명"을 "80%"만큼 크게 본 사람은 둘을 함께
        저울질할 수 있습니다.
    - text: 슬라이드는 그대로 두고 각 수치에 신뢰구간을 붙입니다
      reason: >-
        수치마다 얼마나 불확실한지가, 이사회가 익숙한 방식으로 적히게 됩니다.
    - text: 수치를 빼고 세션마다 가장 인상적인 발언을 대신 넣습니다
      reason: >-
        정성 연구의 근거는 사람들이 한 말과 행동이고, 이사회는 그것을 참가자의
        말 그대로 듣게 됩니다.
---
