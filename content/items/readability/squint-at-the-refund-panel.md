---
sourceSection: Testing Legibility
principles:
  - legibility
  - contrast
artefact:
  en: >-
    A support team's dashboard. Most of it is set in a 14px regular-weight
    sans-serif, #1F1F1F on white. One panel is the exception: the
    refund-deadline box in the corner, where the dates are 10px, in a
    condensed thin-weight face, #9A9A9A on a #F0F0F0 grey card. In session
    recordings, agents lean toward the screen and squint every time they
    consult that panel, and nowhere else.
  ko: >-
    고객지원 팀의 대시보드입니다. 대부분은 14px 보통 굵기 고딕체, 흰 배경 위
    #1F1F1F로 되어 있습니다. 예외가 딱 한 곳 있습니다. 구석의 환불 기한
    패널인데, 날짜가 10px에 폭 좁고 가는 굵기의 서체로, #F0F0F0 회색 카드 위
    #9A9A9A로 적혀 있습니다. 세션 녹화를 보면 상담원들이 그 패널을 확인할
    때마다 화면 쪽으로 몸을 기울이고 눈을 가늘게 뜨는데, 다른 곳에서는 그러지
    않습니다.
screen:
  en: |-
    <div class="screen" style="font-size:14px;color:#1F1F1F">
      <h2>Support queue</h2>
      <div class="split">
        <div>
          <table class="table" style="font-size:14px">
            <thead><tr><th>Ticket</th><th>Customer</th><th>Waiting</th></tr></thead>
            <tbody>
              <tr><td>#8841</td><td>Ayu Lestari</td><td>14 min</td></tr>
              <tr><td>#8840</td><td>Grace Tan</td><td>32 min</td></tr>
              <tr><td>#8839</td><td>Putri Andini</td><td>1 hr 05</td></tr>
              <tr><td>#8838</td><td>Daniel Wong</td><td>2 hr 18</td></tr>
            </tbody>
          </table>
        </div>
        <div style="background:#F0F0F0;border-radius:8px;padding:14px">
          <p style="font-size:14px;font-weight:600;margin:0 0 8px">Refund deadlines</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8841 — closes 2026-07-26</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8840 — closes 2026-07-24</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8839 — closes 2026-07-23</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0">#8838 — closes 2026-07-23</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen" style="font-size:14px;color:#1F1F1F">
      <h2>상담 대기열</h2>
      <div class="split">
        <div>
          <table class="table" style="font-size:14px">
            <thead><tr><th>문의번호</th><th>고객</th><th>대기</th></tr></thead>
            <tbody>
              <tr><td>#8841</td><td>김지우</td><td>14분</td></tr>
              <tr><td>#8840</td><td>박서연</td><td>32분</td></tr>
              <tr><td>#8839</td><td>이도현</td><td>1시간 05분</td></tr>
              <tr><td>#8838</td><td>정하윤</td><td>2시간 18분</td></tr>
            </tbody>
          </table>
        </div>
        <div style="background:#F0F0F0;border-radius:8px;padding:14px">
          <p style="font-size:14px;font-weight:600;margin:0 0 8px">환불 기한</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8841 — 2026-07-26 마감</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8840 — 2026-07-24 마감</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0 0 4px">#8839 — 2026-07-23 마감</p>
          <p style="font-size:10px;font-stretch:condensed;font-weight:200;color:#9A9A9A;margin:0">#8838 — 2026-07-23 마감</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What is the squinting telling the team?
  ko: >-
    눈을 가늘게 뜨는 이 행동은 팀에게 무엇을 말해 주고 있을까요?
options:
  en:
    - text: >-
        That panel's type fails as type — 10px thin strokes in light grey on
        grey give the eye too little to resolve, and squinting is the classic
        sign of a legibility problem.
      correct: true
    - text: >-
        The panel's wording is above the agents' reading level — squinting is
        what readers do when a sentence takes effort to parse.
    - text: >-
        The dashboard's hierarchy is off — squinting is how you check which
        elements survive when detail drops away, so the layout is what needs
        work.
    - text: >-
        Little by itself — people also squint when concentrating, so it needs
        a reading-speed measurement before it counts as a signal.
  ko:
    - text: >-
        그 패널의 글자가 글자로서 실패하고 있다는 뜻입니다 — 회색 위 옅은
        회색, 10px의 가는 획은 눈이 분간할 거리를 거의 주지 않고, 눈을 가늘게
        뜨는 것은 판독성 문제의 전형적인 신호입니다.
      correct: true
    - text: >-
        패널의 문구가 상담원의 독해 수준보다 어렵다는 뜻입니다 — 문장을
        해석하는 데 힘이 들 때 독자는 눈을 가늘게 뜹니다.
    - text: >-
        대시보드의 위계가 어긋났다는 뜻입니다 — 눈을 가늘게 뜨는 것은 세부가
        사라졌을 때 무엇이 살아남는지 확인하는 방법이니, 손봐야 할 것은
        레이아웃입니다.
    - text: >-
        그 자체로는 큰 의미가 없습니다 — 집중할 때도 눈을 가늘게 뜨므로, 읽기
        속도를 측정해 보기 전에는 신호로 칠 수 없습니다.
---
