---
sourceSection: '3. Grouping: Proximity and Common Regions'
principles:
  - common-region
  - proximity
artefact:
  en: >-
    A report screen. At the top, three summary cards sit together inside one
    bordered panel with a pale background. Under that panel, five controls
    float in a row — a date range, a client picker, a status picker, a currency
    picker and a Reset link — with nothing drawn around them and 16px of space
    above and below, the same gap this page uses everywhere else. Then the
    report table, and under the table the pagination.
  ko: >-
    리포트 화면입니다. 맨 위에는 요약 카드 세 장이 옅은 배경의 테두리 패널
    하나 안에 함께 들어 있습니다. 그 패널 아래에는 컨트롤 다섯 개가 한 줄로
    떠 있습니다 — 기간, 고객사, 상태, 통화, 그리고 초기화 링크. 주위에 그려진
    것은 아무것도 없고 위아래 여백은 16px로, 이 페이지가 다른 곳에서 쓰는
    간격과 똑같습니다. 그 아래에 리포트 표가 있고, 표 밑에 페이지 이동이
    있습니다.
screen:
  en: |-
    <div class="screen stack">
      <h1>Billing report</h1>
      <div class="region">
        <div class="stats stats--three">
          <div><p class="stat-label">Invoiced</p><p class="stat-value">$48,200</p></div>
          <div><p class="stat-label">Collected</p><p class="stat-value">$41,150</p></div>
          <div><p class="stat-label">Outstanding</p><p class="stat-value">$7,050</p></div>
        </div>
      </div>
      <div class="actions">
        <span class="control">1 Jun – 31 Jul</span>
        <span class="control">All clients</span>
        <span class="control">All statuses</span>
        <span class="control">USD</span>
        <span class="link">Reset</span>
      </div>
      <table class="table">
        <thead><tr><th>Client</th><th>Invoiced</th><th>Collected</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Northwind</td><td>$12,400</td><td>$12,400</td><td>Paid</td></tr>
          <tr><td>Lakeside Co</td><td>$9,800</td><td>$4,000</td><td>Part paid</td></tr>
          <tr><td>Bright Foods</td><td>$7,300</td><td>$7,300</td><td>Paid</td></tr>
          <tr><td>Harbour Ltd</td><td>$6,150</td><td>$0</td><td>Overdue</td></tr>
        </tbody>
      </table>
      <p class="muted">1–4 of 128 · Previous · Next</p>
    </div>
  ko: |-
    <div class="screen stack">
      <h1>청구 리포트</h1>
      <div class="region">
        <div class="stats stats--three">
          <div><p class="stat-label">청구액</p><p class="stat-value">4,820만</p></div>
          <div><p class="stat-label">수금액</p><p class="stat-value">4,115만</p></div>
          <div><p class="stat-label">미수금</p><p class="stat-value">705만</p></div>
        </div>
      </div>
      <div class="actions">
        <span class="control">6월 1일 – 7월 31일</span>
        <span class="control">전체 고객사</span>
        <span class="control">전체 상태</span>
        <span class="control">KRW</span>
        <span class="link">초기화</span>
      </div>
      <table class="table">
        <thead><tr><th>고객사</th><th>청구액</th><th>수금액</th><th>상태</th></tr></thead>
        <tbody>
          <tr><td>노스윈드</td><td>1,240만</td><td>1,240만</td><td>완납</td></tr>
          <tr><td>레이크사이드</td><td>980만</td><td>400만</td><td>부분 납부</td></tr>
          <tr><td>브라이트푸드</td><td>730만</td><td>730만</td><td>완납</td></tr>
          <tr><td>하버</td><td>615만</td><td>0</td><td>연체</td></tr>
        </tbody>
      </table>
      <p class="muted">128건 중 1–4 · 이전 · 다음</p>
    </div>
prompt:
  en: >-
    The five controls do not read as one set. What is the smallest change that
    groups them?
  ko: >-
    이 컨트롤 다섯 개가 한 묶음으로 읽히지 않습니다. 이들을 묶는 가장 작은
    변경은 무엇일까요?
options:
  en:
    - text: >-
        Put the five controls inside a single bordered region, the way the
        summary cards already are, and leave the rest of the page alone.
      correct: true
    - text: >-
        Give each of the five controls its own bordered box, so it is clear
        where one control ends and the next begins.
    - text: >-
        Wrap every part of the page — heading, controls, table, pagination — in
        a panel of its own, so the whole structure becomes explicit.
    - text: >-
        Put a bright amber background behind the row of controls so it
        separates itself from the table below.
  ko:
    - text: >-
        요약 카드가 이미 그렇듯 컨트롤 다섯 개를 테두리 영역 하나에 담고,
        페이지의 나머지는 그대로 둡니다.
      correct: true
    - text: >-
        컨트롤 다섯 개에 각각 테두리 상자를 둘러서, 어디까지가 한 컨트롤인지
        분명하게 만듭니다.
    - text: >-
        제목, 컨트롤, 표, 페이지 이동까지 페이지의 모든 부분을 각자의 패널에
        넣어 구조를 눈에 보이게 만듭니다.
    - text: >-
        컨트롤 줄 뒤에 선명한 주황색 배경을 깔아서 아래 표와 확실히 갈라
        놓습니다.
---
