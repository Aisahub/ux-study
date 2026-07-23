---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    An order-history table with eleven rows and an "Ordered on" column. Nine
    rows show their date as "2026-07-12" style; the two rows that arrived
    through a newer import job show "12/07/2026" style. Above the table, the
    date-range filter reads "From 2026-06-01 to 2026-07-31", and the export
    banner underneath says "Includes orders up to 2026-07-31".
  ko: >-
    열한 행짜리 주문 내역 표에 "주문일" 열이 있습니다. 아홉 행은 날짜를
    "2026-07-12" 꼴로 보여 주는데, 새로 만든 가져오기 기능을 거쳐 들어온 두
    행만 "12/07/2026" 꼴입니다. 표 위의 기간 필터에는 "2026-06-01부터
    2026-07-31까지"라고 적혀 있고, 표 아래 내보내기 안내문에는 "2026-07-31
    까지의 주문 포함"이라고 적혀 있습니다.
screen:
  en: |-
    <div class="screen">
      <p style="margin:0 0 12px"><span class="control">From 2026-06-01 to 2026-07-31</span></p>
      <table class="table">
        <thead><tr><th>Order</th><th>Customer</th><th>Ordered on</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>#2841</td><td>Ayu Lestari</td><td>2026-07-12</td><td>$64.00</td></tr>
          <tr><td>#2840</td><td>Grace Tan</td><td>2026-07-12</td><td>$27.50</td></tr>
          <tr><td>#2839</td><td>Putri Andini</td><td>12/07/2026</td><td>$112.00</td></tr>
          <tr><td>#2838</td><td>Daniel Wong</td><td>2026-07-11</td><td>$45.90</td></tr>
          <tr><td>#2837</td><td>Sari Dewi</td><td>2026-07-11</td><td>$88.20</td></tr>
          <tr><td>#2836</td><td>Chen Wei</td><td>2026-07-10</td><td>$31.00</td></tr>
          <tr><td>#2835</td><td>Nadia Rahman</td><td>11/07/2026</td><td>$76.40</td></tr>
          <tr><td>#2834</td><td>Kim Jiwoo</td><td>2026-07-09</td><td>$52.10</td></tr>
          <tr><td>#2833</td><td>Arif Santoso</td><td>2026-07-09</td><td>$19.90</td></tr>
          <tr><td>#2832</td><td>Lee Minsu</td><td>2026-07-08</td><td>$140.00</td></tr>
          <tr><td>#2831</td><td>Rina Halim</td><td>2026-07-08</td><td>$38.60</td></tr>
        </tbody>
      </table>
      <p class="note">Includes orders up to 2026-07-31</p>
    </div>
  ko: |-
    <div class="screen">
      <p style="margin:0 0 12px"><span class="control">2026-06-01부터 2026-07-31까지</span></p>
      <table class="table">
        <thead><tr><th>주문번호</th><th>고객</th><th>주문일</th><th>금액</th></tr></thead>
        <tbody>
          <tr><td>#2841</td><td>김지우</td><td>2026-07-12</td><td>64,000원</td></tr>
          <tr><td>#2840</td><td>박서연</td><td>2026-07-12</td><td>27,500원</td></tr>
          <tr><td>#2839</td><td>이도현</td><td>12/07/2026</td><td>112,000원</td></tr>
          <tr><td>#2838</td><td>정하윤</td><td>2026-07-11</td><td>45,900원</td></tr>
          <tr><td>#2837</td><td>최시우</td><td>2026-07-11</td><td>88,200원</td></tr>
          <tr><td>#2836</td><td>강예린</td><td>2026-07-10</td><td>31,000원</td></tr>
          <tr><td>#2835</td><td>윤서준</td><td>11/07/2026</td><td>76,400원</td></tr>
          <tr><td>#2834</td><td>임하늘</td><td>2026-07-09</td><td>52,100원</td></tr>
          <tr><td>#2833</td><td>오지호</td><td>2026-07-09</td><td>19,900원</td></tr>
          <tr><td>#2832</td><td>한도윤</td><td>2026-07-08</td><td>140,000원</td></tr>
          <tr><td>#2831</td><td>신유진</td><td>2026-07-08</td><td>38,600원</td></tr>
        </tbody>
      </table>
      <p class="note">2026-07-31까지의 주문 포함</p>
    </div>
prompt:
  en: >-
    One date format has to go. Which one, and why that one?
  ko: >-
    두 날짜 표기 중 하나는 없어져야 합니다. 어느 쪽을 남겨야 하고, 왜
    그쪽일까요?
options:
  en:
    - text: >-
        Keep "2026-07-12" — nine of the eleven rows, the filter above the
        table and the banner below it already use it; only the two imported
        rows disagree with the rest of the screen.
      correct: true
    - text: >-
        Keep "12/07/2026" — day-first reads more like how people say dates
        aloud, so it is the friendlier of the two for a customer-facing table.
    - text: >-
        Leave both — every row is still legible either way, so this is worth a
        note to the team but not worth a change.
    - text: >-
        Replace both with relative dates like "3 days ago", which sidesteps
        the format question entirely.
  ko:
    - text: >-
        "2026-07-12" 꼴을 남깁니다 — 열한 행 중 아홉 행과 표 위의 필터, 표
        아래 안내문까지 이미 그 표기를 쓰고 있습니다. 화면의 나머지와 어긋난
        것은 가져온 두 행뿐입니다.
      correct: true
    - text: >-
        "12/07/2026" 꼴을 남깁니다 — 일이 먼저 오는 표기가 날짜를 소리 내어
        말하는 순서에 가까워서, 고객이 보는 표에는 더 친근합니다.
    - text: >-
        둘 다 그대로 둡니다 — 어느 표기든 읽는 데 지장은 없으니, 팀에 메모만
        남기고 고치지는 않아도 됩니다.
    - text: >-
        둘 다 "3일 전" 같은 상대 날짜로 바꿔서, 표기를 고르는 문제 자체를
        피해 갑니다.
---
