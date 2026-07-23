---
sourceSection: The Squint Test
principles:
  - visual-hierarchy
  - contrast
artefact:
  en: >-
    A checkout page, shown beside the same page blurred until not a word on it
    can be read. Three shapes survive the blur: a wide dark band across the
    top, a large dark rectangle below it on the right, and a thin pale outline
    near the bottom left. At full sharpness the band is a "Free shipping over
    $40" promo, the rectangle is a "Join our newsletter" card, and the pale
    outline is the "Place order" button.
  ko: >-
    결제 페이지와, 글자를 하나도 읽을 수 없을 만큼 흐리게 뭉갠 같은 페이지를
    나란히 놓았습니다. 흐린 쪽에서도 형태 세 개는 살아남습니다. 맨 위를
    가로지르는 넓고 짙은 띠, 그 아래 오른쪽의 크고 짙은 사각형, 그리고 왼쪽
    아래의 가늘고 옅은 윤곽선입니다. 선명한 쪽에서 보면 띠는 "4만원 이상
    무료배송" 홍보이고, 사각형은 "뉴스레터 구독" 카드이며, 옅은 윤곽선은
    "결제하기" 버튼입니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Sharp</p>
        <div class="screen">
          <div class="banner banner--navy">Free shipping over $40</div>
          <div class="split" style="margin-top:12px">
            <div>
              <p class="muted" style="margin:0 0 6px">Your order</p>
              <p style="font-size:13px;margin:0">Cleanser · $18.00</p>
              <p style="font-size:13px;margin:0">Toner · $22.00</p>
              <p style="font-size:13px;margin:8px 0 0"><strong>Total · $40.00</strong></p>
            </div>
            <div style="background:#1e3a5f;color:#ffffff;border-radius:6px;padding:18px;min-height:92px">
              <p style="font-weight:600;margin:0 0 6px">Join our newsletter</p>
              <p style="font-size:13px;margin:0">10% off your next order</p>
            </div>
          </div>
          <div class="actions" style="margin-top:16px">
            <button class="btn" style="border-color:#e5e7eb;color:#b6bcc4">Place order</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">Blurred</p>
        <div class="screen blur">
          <div class="banner banner--navy">Free shipping over $40</div>
          <div class="split" style="margin-top:12px">
            <div>
              <p class="muted" style="margin:0 0 6px">Your order</p>
              <p style="font-size:13px;margin:0">Cleanser · $18.00</p>
              <p style="font-size:13px;margin:0">Toner · $22.00</p>
              <p style="font-size:13px;margin:8px 0 0"><strong>Total · $40.00</strong></p>
            </div>
            <div style="background:#1e3a5f;color:#ffffff;border-radius:6px;padding:18px;min-height:92px">
              <p style="font-weight:600;margin:0 0 6px">Join our newsletter</p>
              <p style="font-size:13px;margin:0">10% off your next order</p>
            </div>
          </div>
          <div class="actions" style="margin-top:16px">
            <button class="btn" style="border-color:#e5e7eb;color:#b6bcc4">Place order</button>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">선명</p>
        <div class="screen">
          <div class="banner banner--navy">4만원 이상 무료배송</div>
          <div class="split" style="margin-top:12px">
            <div>
              <p class="muted" style="margin:0 0 6px">주문 내역</p>
              <p style="font-size:13px;margin:0">클렌저 · 18,000원</p>
              <p style="font-size:13px;margin:0">토너 · 22,000원</p>
              <p style="font-size:13px;margin:8px 0 0"><strong>합계 · 40,000원</strong></p>
            </div>
            <div style="background:#1e3a5f;color:#ffffff;border-radius:6px;padding:18px;min-height:92px">
              <p style="font-weight:600;margin:0 0 6px">뉴스레터 구독</p>
              <p style="font-size:13px;margin:0">다음 주문 10% 할인</p>
            </div>
          </div>
          <div class="actions" style="margin-top:16px">
            <button class="btn" style="border-color:#e5e7eb;color:#b6bcc4">결제하기</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">흐림</p>
        <div class="screen blur">
          <div class="banner banner--navy">4만원 이상 무료배송</div>
          <div class="split" style="margin-top:12px">
            <div>
              <p class="muted" style="margin:0 0 6px">주문 내역</p>
              <p style="font-size:13px;margin:0">클렌저 · 18,000원</p>
              <p style="font-size:13px;margin:0">토너 · 22,000원</p>
              <p style="font-size:13px;margin:8px 0 0"><strong>합계 · 40,000원</strong></p>
            </div>
            <div style="background:#1e3a5f;color:#ffffff;border-radius:6px;padding:18px;min-height:92px">
              <p style="font-weight:600;margin:0 0 6px">뉴스레터 구독</p>
              <p style="font-size:13px;margin:0">다음 주문 10% 할인</p>
            </div>
          </div>
          <div class="actions" style="margin-top:16px">
            <button class="btn" style="border-color:#e5e7eb;color:#b6bcc4">결제하기</button>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What does the blurred view tell the team about this page?
  ko: >-
    이 흐린 화면은 팀에게 무엇을 말해 주고 있을까요?
options:
  en:
    - text: The page's weight sits on the wrong elements
      reason: >-
        The two shapes that survive the blur are things the shopper did not
        come for, and the one thing they did come for is the faintest.
      correct: true
    - text: Nothing useful
      reason: >-
        No text can be read at that blur, so there is no way to judge the
        hierarchy from it.
    - text: The grouping works
      reason: >-
        Three separate blocks survive the blur, so the page's structure is
        doing its job.
    - text: Only that the "Place order" button is small
      reason: >-
        Widening it is the whole of what this view asks for.
  ko:
    - text: 페이지의 무게가 엉뚱한 곳에 실려 있습니다
      reason: >-
        흐린 뒤에도 남은 두 형태는 손님이 찾아온 이유가 아닌 것들이고, 정작
        찾아온 이유인 하나가 가장 흐립니다.
      correct: true
    - text: 알아낼 수 있는 것이 없습니다
      reason: >-
        그 정도로 흐리면 글자를 읽을 수 없으니 위계를 판단할 근거도 없습니다.
    - text: 묶임은 잘 되어 있습니다
      reason: >-
        흐린 뒤에도 블록 세 개가 따로 남으니 페이지의 구조는 제 역할을 하고
        있습니다.
    - text: '"결제하기" 버튼이 작다는 것뿐입니다'
      reason: >-
        버튼을 넓히면 이 화면이 요구하는 것은 다 한 셈입니다.
---
