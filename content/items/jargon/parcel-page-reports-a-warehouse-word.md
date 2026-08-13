---
sourceSection: 'If the Term Is Not Important'
principles:
  - plain-language
artefact:
  en: >-
    The order-tracking page a shopper opens from a delivery notification. It
    shows the order number and the item count, then a card headed "Consignment
    status" whose single line of state reads "MANIFESTED", with the time it was
    last updated underneath. Two buttons sit below the card: "Notify me on
    arrival" and "Contact seller".
  ko: >-
    배송 알림을 눌러 들어온 주문 조회 페이지입니다. 주문번호와 상품 개수가 있고,
    그 아래 "운송 상태"라는 제목의 카드 안에 상태가 한 줄로
    "적하목록 제출 완료"라고만 적혀 있으며, 마지막 갱신 시각이 그 밑에 있습니다. 카드 아래에는
    "도착 시 알림 받기"와 "판매자에게 문의" 두 개의 버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Track your order</h1>
      <p class="muted" style="margin:0 0 12px">Order #4417-2290 · 2 items</p>
      <div class="card">
        <h2>Consignment status</h2>
        <p><strong>MANIFESTED</strong></p>
        <p class="muted">Updated 14:20 today</p>
      </div>
      <div class="actions actions--start" style="margin-top:14px">
        <button class="btn btn--blue">Notify me on arrival</button>
        <button class="btn btn--hairline">Contact seller</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h1>주문 배송 조회</h1>
      <p class="muted" style="margin:0 0 12px">주문번호 4417-2290 · 상품 2개</p>
      <div class="card">
        <h2>운송 상태</h2>
        <p><strong>적하목록 제출 완료</strong></p>
        <p class="muted">오늘 14:20 갱신</p>
      </div>
      <div class="actions actions--start" style="margin-top:14px">
        <button class="btn btn--blue">도착 시 알림 받기</button>
        <button class="btn btn--hairline">판매자에게 문의</button>
      </div>
    </div>
prompt:
  en: >-
    This page is read by shoppers waiting on a parcel. Nothing else they will
    ever see from this company uses that word. Which change should the page
    make?
  ko: >-
    이 페이지를 읽는 사람은 택배를 기다리는 구매자입니다. 이 회사가 구매자에게
    보여 주는 다른 어떤 화면에도 저 말은 나오지 않습니다. 이 페이지는 무엇을
    바꿔야 할까요?
options:
  en:
    - text: Say the state in the shopper's words — the parcel is packed and booked onto its flight
      reason: >-
        The shopper is deciding whether to keep waiting, and that is the thing
        the state tells them.
      correct: true
    - text: Keep the word and put its definition in a tooltip on the card
      reason: >-
        The exact term stays on the page, and its meaning is one hover away for
        anyone who wants it.
    - text: Write it as "Booked onto a flight (manifested)"
      reason: >-
        Both kinds of reader are served at once, with the plain words leading
        and the precise word still available.
    - text: Keep the word and add an entry for it to the help centre's glossary
      reason: >-
        One definition written once then serves every page in the product that
        uses the term.
  ko:
    - text: 상태를 구매자의 말로 적습니다 — 물건이 실려 비행기에 실릴 예약까지 끝났다는 뜻으로
      reason: >-
        구매자가 지금 정하려는 것은 더 기다릴지 말지이고, 이 상태가 알려 주는
        것이 바로 그것입니다.
      correct: true
    - text: 말은 그대로 두고, 카드에 마우스를 올리면 뜻이 뜨도록 설명을 답니다
      reason: >-
        정확한 용어는 화면에 그대로 남고, 뜻이 궁금한 사람은 한 번만 올려 보면
        됩니다.
    - text: "\"비행기 적재 예약 완료(적하목록 제출 완료)\"처럼 나란히 적습니다"
      reason: >-
        쉬운 말을 앞에 두어 두 부류의 독자를 한 번에 챙기면서, 정확한 용어도
        화면에 남습니다.
    - text: 말은 그대로 두고, 고객센터 용어집에 항목을 하나 추가합니다
      reason: >-
        한 번 써 둔 설명 하나가 그 용어를 쓰는 제품의 모든 페이지에 두루
        쓰입니다.
---
