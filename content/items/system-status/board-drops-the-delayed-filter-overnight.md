---
sourceSection: 'Communication Creates Trust'
principles:
  - system-status
artefact:
  en: >-
    The shipment board of an internal logistics tool, shown at two moments. In
    the first, yesterday at 17:40, a chip under the heading reads "Delayed
    only", a line beside it reads "12 shipments", and the table holds twelve
    rows, every one of them at "Delayed". In the second, when the same person
    opens the board the next morning, the heading and the columns are exactly
    as they were, the chip is gone, the line beside the heading reads "340
    shipments", and the rows on show are a mixture of "On time", "In transit"
    and "Delayed". Nothing on the second screen refers to the filter or to the
    view the board was left in.
  ko: >-
    사내 물류 도구의 배송 보드를 두 시점에 걸쳐 보여 줍니다. 첫 시점은 어제
    17시 40분으로, 제목 아래에 "지연 건만"이라는 칩이 붙어 있고 그 옆에 "배송
    12건"이 적혀 있으며, 표에는 열두 행이 모두 "지연" 상태로 놓여 있습니다.
    두 번째 시점은 같은 사람이 다음 날 아침에 보드를 연 순간입니다. 제목과 열은
    어제와 똑같은데 칩은 사라졌고, 제목 옆의 줄은 "배송 340건"이라고 되어
    있으며, 보이는 행들은 "정상", "운송 중", "지연"이 뒤섞여 있습니다. 두 번째
    화면 어디에도 필터나 어제 남겨 둔 보기에 대한 말은 없습니다.
sequence:
  - caption:
      en: Yesterday at 17:40, the last time the board was looked at
      ko: 어제 17시 40분, 보드를 마지막으로 본 시점
    screen:
      en: |-
        <div class="screen">
          <h2>Shipment board</h2>
          <p style="margin:0 0 12px"><span class="chip">Delayed only</span> <span class="muted">12 shipments</span></p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Shipment</th><th>Destination</th><th>Carrier</th><th>Due</th><th>State</th></tr></thead>
              <tbody>
                <tr><td>SH-8814</td><td>Busan</td><td>Harbour Freight</td><td>2026-07-28</td><td>Delayed</td></tr>
                <tr><td>SH-8809</td><td>Surabaya</td><td>Nordwind</td><td>2026-07-28</td><td>Delayed</td></tr>
                <tr><td>SH-8802</td><td>Medan</td><td>Harbour Freight</td><td>2026-07-29</td><td>Delayed</td></tr>
                <tr><td>SH-8797</td><td>Incheon</td><td>Setia Lines</td><td>2026-07-29</td><td>Delayed</td></tr>
                <tr><td>SH-8791</td><td>Jakarta</td><td>Nordwind</td><td>2026-07-30</td><td>Delayed</td></tr>
              </tbody>
            </table>
          </div>
          <p class="note">5 of 12 shown</p>
        </div>
      ko: |-
        <div class="screen">
          <h2>배송 보드</h2>
          <p style="margin:0 0 12px"><span class="chip">지연 건만</span> <span class="muted">배송 12건</span></p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>배송번호</th><th>도착지</th><th>배송사</th><th>마감일</th><th>상태</th></tr></thead>
              <tbody>
                <tr><td>SH-8814</td><td>부산</td><td>항만운송</td><td>2026-07-28</td><td>지연</td></tr>
                <tr><td>SH-8809</td><td>수라바야</td><td>노르드윈드</td><td>2026-07-28</td><td>지연</td></tr>
                <tr><td>SH-8802</td><td>메단</td><td>항만운송</td><td>2026-07-29</td><td>지연</td></tr>
                <tr><td>SH-8797</td><td>인천</td><td>세티아라인</td><td>2026-07-29</td><td>지연</td></tr>
                <tr><td>SH-8791</td><td>자카르타</td><td>노르드윈드</td><td>2026-07-30</td><td>지연</td></tr>
              </tbody>
            </table>
          </div>
          <p class="note">12건 중 5건 표시</p>
        </div>
  - caption:
      en: The moment the board is opened the next morning
      ko: 다음 날 아침 보드를 연 순간
    screen:
      en: |-
        <div class="screen">
          <h2>Shipment board</h2>
          <p style="margin:0 0 12px"><span class="muted">340 shipments</span></p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Shipment</th><th>Destination</th><th>Carrier</th><th>Due</th><th>State</th></tr></thead>
              <tbody>
                <tr><td>SH-8846</td><td>Busan</td><td>Setia Lines</td><td>2026-07-31</td><td>On time</td></tr>
                <tr><td>SH-8845</td><td>Jakarta</td><td>Nordwind</td><td>2026-07-31</td><td>In transit</td></tr>
                <tr><td>SH-8844</td><td>Incheon</td><td>Harbour Freight</td><td>2026-07-31</td><td>On time</td></tr>
                <tr><td>SH-8843</td><td>Medan</td><td>Setia Lines</td><td>2026-08-01</td><td>Delayed</td></tr>
                <tr><td>SH-8842</td><td>Surabaya</td><td>Nordwind</td><td>2026-08-01</td><td>On time</td></tr>
              </tbody>
            </table>
          </div>
          <p class="note">5 of 340 shown</p>
        </div>
      ko: |-
        <div class="screen">
          <h2>배송 보드</h2>
          <p style="margin:0 0 12px"><span class="muted">배송 340건</span></p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>배송번호</th><th>도착지</th><th>배송사</th><th>마감일</th><th>상태</th></tr></thead>
              <tbody>
                <tr><td>SH-8846</td><td>부산</td><td>세티아라인</td><td>2026-07-31</td><td>정상</td></tr>
                <tr><td>SH-8845</td><td>자카르타</td><td>노르드윈드</td><td>2026-07-31</td><td>운송 중</td></tr>
                <tr><td>SH-8844</td><td>인천</td><td>항만운송</td><td>2026-07-31</td><td>정상</td></tr>
                <tr><td>SH-8843</td><td>메단</td><td>세티아라인</td><td>2026-08-01</td><td>지연</td></tr>
                <tr><td>SH-8842</td><td>수라바야</td><td>노르드윈드</td><td>2026-08-01</td><td>정상</td></tr>
              </tbody>
            </table>
          </div>
          <p class="note">340건 중 5건 표시</p>
        </div>
prompt:
  en: >-
    The board cannot keep a filter past the end of a session — that is settled.
    Which change should it make for the morning?
  ko: >-
    이 보드는 세션이 끝나면 필터를 유지할 수 없습니다 — 그 점은 이미
    정해졌습니다. 그렇다면 아침 화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Say what is in force where the chip used to be — "No filter · every shipment" — with the delayed-only view one press away
      reason: >-
        The view the board is in is then read off the board, instead of being
        remembered from the evening before.
      correct: true
    - text: Keep the count beside the heading so the size of the set is always on screen
      reason: >-
        A set that goes from 12 to 340 is a jump nobody could overlook.
    - text: Open the board on the delayed-only view every morning
      reason: >-
        The dispatch team lands on the view they reach for first anyway.
    - text: Move the filter controls into a panel that opens on demand
      reason: >-
        The board's own space goes to the shipments rather than to the controls
        above them.
  ko:
    - text: 칩이 있던 자리에 지금 걸린 조건을 적습니다 — "필터 없음 · 전체 배송" — 지연 건만 보기는 한 번 누르면 되도록 둡니다
      reason: >-
        지금 보드가 어떤 보기인지를 어젯밤 기억이 아니라 보드에서 바로 읽게
        됩니다.
      correct: true
    - text: 건수를 제목 옆에 계속 두어 지금 몇 건인지 늘 보이게 합니다
      reason: >-
        12건에서 340건으로 뛰는 변화라면 못 보고 넘어갈 사람이 없습니다.
    - text: 아침에는 늘 지연 건만 보기로 열리게 합니다
      reason: >-
        배차 팀이 어차피 가장 먼저 찾는 보기로 바로 들어가게 됩니다.
    - text: 필터 컨트롤를 눌러야 열리는 패널 안으로 옮깁니다
      reason: >-
        보드의 자리를 위쪽 컨트롤가 아니라 배송 건 자체에 내주게 됩니다.
---
