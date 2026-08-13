---
sourceSection: 'Online Shopping Carts'
principles:
  - mental-model
artefact:
  en: >-
    A shop's cart, at two moments. In the first, one pair of boots sits in the
    cart at £89, the line above the list reads "1 item", and the buttons are
    "Checkout" and "Keep shopping". In the second, forty minutes later, the
    same page is open and untouched: the list is empty, the line above it reads
    "0 items", the boots are gone, a grey sentence says "Your cart was cleared
    because items are only reserved for 30 minutes", and the only button left
    is "Keep shopping".
  ko: >-
    쇼핑몰 장바구니를 두 시점에 걸쳐 보여 줍니다. 첫 시점에는 부츠 한 켤레가
    89,000원에 담겨 있고, 목록 위에는 "상품 1개"라고 적혀 있으며, 버튼은
    "주문하기"와 "쇼핑 계속하기"입니다. 두 번째 시점은 40분 뒤인데, 같은 페이지를
    그대로 열어 둔 채입니다. 목록은 비었고, 위에는 "상품 0개"라고 적혀 있으며,
    부츠는 사라졌습니다. 회색 글씨로 "상품은 30분간만 예약되므로 장바구니가
    비워졌습니다"라고 적혀 있고, 남은 버튼은 "쇼핑 계속하기" 하나뿐입니다.
sequence:
  - caption:
      en: The moment the boots are added
      ko: 부츠를 담은 순간
    screen:
      en: |-
        <div class="screen">
          <h2>Your cart</h2>
          <p class="muted" style="margin:0 0 12px">1 item</p>
          <table class="table">
            <thead><tr><th>Item</th><th>Size</th><th>Price</th></tr></thead>
            <tbody><tr><td>Harlow ankle boot</td><td>39</td><td>£89.00</td></tr></tbody>
          </table>
          <div class="actions actions--start" style="margin-top:14px">
            <button class="btn btn--blue">Checkout</button>
            <button class="btn btn--hairline">Keep shopping</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>장바구니</h2>
          <p class="muted" style="margin:0 0 12px">상품 1개</p>
          <table class="table">
            <thead><tr><th>상품</th><th>사이즈</th><th>가격</th></tr></thead>
            <tbody><tr><td>할로우 앵클부츠</td><td>245</td><td>89,000원</td></tr></tbody>
          </table>
          <div class="actions actions--start" style="margin-top:14px">
            <button class="btn btn--blue">주문하기</button>
            <button class="btn btn--hairline">쇼핑 계속하기</button>
          </div>
        </div>
  - caption:
      en: Forty minutes later, the page untouched
      ko: 40분 뒤, 페이지는 그대로 둔 채
    screen:
      en: |-
        <div class="screen">
          <h2>Your cart</h2>
          <p class="muted" style="margin:0 0 12px">0 items</p>
          <table class="table">
            <thead><tr><th>Item</th><th>Size</th><th>Price</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">Nothing here</td></tr></tbody>
          </table>
          <p class="muted" style="margin:10px 0 0">Your cart was cleared because items are only reserved for 30 minutes.</p>
          <div class="actions actions--start" style="margin-top:14px">
            <button class="btn btn--hairline">Keep shopping</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>장바구니</h2>
          <p class="muted" style="margin:0 0 12px">상품 0개</p>
          <table class="table">
            <thead><tr><th>상품</th><th>사이즈</th><th>가격</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">담긴 상품이 없습니다</td></tr></tbody>
          </table>
          <p class="muted" style="margin:10px 0 0">상품은 30분간만 예약되므로 장바구니가 비워졌습니다.</p>
          <div class="actions actions--start" style="margin-top:14px">
            <button class="btn btn--hairline">쇼핑 계속하기</button>
          </div>
        </div>
prompt:
  en: >-
    Support hears the same sentence from these shoppers every week: "your site
    lost my order". Which change should the cart make?
  ko: >-
    고객센터에는 이 구매자들에게서 매주 같은 말이 들어옵니다. "사이트가 제 주문을
    날렸어요." 이 장바구니는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Keep the boots in the cart, and mark the line if the size is no longer held for them
      reason: >-
        A cart is a place shoppers believe they are putting things, so taking
        things out of it is the site losing them.
      correct: true
    - text: Show a countdown on the cart so the shopper can see the reservation running out
      reason: >-
        Nothing then disappears without warning, and a shopper who wants the
        boots knows how long they have.
    - text: Email the shopper when the reservation expires, with a link back to the cart
      reason: >-
        The shopper is told even when the tab is closed, which is where most of
        those forty minutes are actually spent.
    - text: Extend the reservation to twenty-four hours and clear the cart after that
      reason: >-
        Almost every shopping session finishes well inside a day, so almost
        nobody meets the emptying at all.
  ko:
    - text: 부츠를 장바구니에 그대로 두고, 그 사이즈가 더는 확보되지 않으면 그 줄에 표시합니다
      reason: >-
        구매자가 물건을 넣어 둔 곳이라고 믿는 자리가 장바구니이므로, 거기서
        물건을 빼는 것은 사이트가 잃어버린 것이 됩니다.
      correct: true
    - text: 장바구니에 남은 시간을 표시해, 예약이 줄어드는 것을 볼 수 있게 합니다
      reason: >-
        예고 없이 사라지는 것이 없어지고, 부츠를 살 생각인 사람은 시간이 얼마나
        남았는지 알게 됩니다.
    - text: 예약이 끝나면 장바구니로 돌아오는 링크와 함께 메일을 보냅니다
      reason: >-
        탭을 닫아 둔 동안에도 알 수 있고, 그 40분의 대부분은 실제로 탭을 닫아 둔
        시간입니다.
    - text: 예약 시간을 24시간으로 늘리고, 그 뒤에 장바구니를 비웁니다
      reason: >-
        쇼핑은 대개 하루 안에 끝나므로, 비워지는 일을 겪는 사람 자체가 거의
        없어집니다.
---
