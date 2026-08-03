---
sourceSection: Legibility
principles:
  - readability
  - contrast
artefact:
  en: >-
    The same refund policy, set two ways, one above the other. Version A:
    12px, line height 1.15, lines around 100 characters, pure black #000000
    on white. Version B: 16px, line height 1.55, lines around 65
    characters, dark grey #333333 on white. A colleague argues for A on the
    grounds that black on white is the strongest contrast a page can have.
  ko: >-
    같은 환불 규정 전문을 두 가지로 조판해 위아래로 놓았습니다. A안: 12px,
    행간 1.15, 한 줄 65자 안팎, 흰 배경 위 완전한 검정 #000000. B안: 16px, 행간
    1.55, 한 줄 38자 안팎, 흰 배경 위 짙은 회색 #333333. 한 동료는 흰 바탕에
    검정이 페이지가 가질 수 있는 가장 강한 대비라는 이유로 A안을 밀고
    있습니다.
screen:
  en: |-
    <div class="stack">
      <div>
        <p class="pane-label">Version A</p>
        <div class="screen">
          <div class="prose" style="font-size:12px;line-height:1.15;max-width:100ch;color:#000000">
            <p>You may return any unopened item within thirty days of delivery for a full refund. Items must be in their original packaging, with seals intact.</p>
            <p>Opened skincare cannot be returned for hygiene reasons, unless it arrived damaged or faulty — in which case we replace it or refund it in full, whichever you prefer.</p>
            <p>Refunds are issued to the payment method used for the order, and take three to five working days to appear depending on your bank.</p>
            <p>Return postage is paid by us when the item is faulty, and by you when you have changed your mind. Start a return from the order in your account, or write to support with your order number.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">Version B</p>
        <div class="screen">
          <div class="prose" style="font-size:16px;line-height:1.55;max-width:65ch;color:#333333">
            <p>You may return any unopened item within thirty days of delivery for a full refund. Items must be in their original packaging, with seals intact.</p>
            <p>Opened skincare cannot be returned for hygiene reasons, unless it arrived damaged or faulty — in which case we replace it or refund it in full, whichever you prefer.</p>
            <p>Refunds are issued to the payment method used for the order, and take three to five working days to appear depending on your bank.</p>
            <p>Return postage is paid by us when the item is faulty, and by you when you have changed your mind. Start a return from the order in your account, or write to support with your order number.</p>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="stack">
      <div>
        <p class="pane-label">A안</p>
        <div class="screen">
          <div class="prose" style="font-size:12px;line-height:1.15;max-width:none;color:#000000">
            <p>개봉하지 않은 상품은 배송 완료 후 30일 이내에 반품하시면 전액 환불해 드립니다. 상품은 봉인이 손상되지 않은 원래 포장 상태여야 합니다.</p>
            <p>개봉한 스킨케어 제품은 위생상의 이유로 반품이 어렵습니다. 다만 파손되었거나 하자가 있는 상태로 도착한 경우에는 교환과 전액 환불 중 원하시는 쪽으로 처리해 드립니다.</p>
            <p>환불은 주문 시 사용하신 결제 수단으로 이루어지며, 은행에 따라 영업일 기준 3~5일 뒤에 확인됩니다.</p>
            <p>반품 배송비는 상품에 하자가 있는 경우 저희가, 단순 변심인 경우 고객님이 부담합니다. 반품은 계정의 주문 내역에서 시작하시거나, 주문번호와 함께 고객지원으로 문의해 주십시오.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">B안</p>
        <div class="screen">
          <div class="prose" style="font-size:16px;line-height:1.55;max-width:38em;color:#333333">
            <p>개봉하지 않은 상품은 배송 완료 후 30일 이내에 반품하시면 전액 환불해 드립니다. 상품은 봉인이 손상되지 않은 원래 포장 상태여야 합니다.</p>
            <p>개봉한 스킨케어 제품은 위생상의 이유로 반품이 어렵습니다. 다만 파손되었거나 하자가 있는 상태로 도착한 경우에는 교환과 전액 환불 중 원하시는 쪽으로 처리해 드립니다.</p>
            <p>환불은 주문 시 사용하신 결제 수단으로 이루어지며, 은행에 따라 영업일 기준 3~5일 뒤에 확인됩니다.</p>
            <p>반품 배송비는 상품에 하자가 있는 경우 저희가, 단순 변심인 경우 고객님이 부담합니다. 반품은 계정의 주문 내역에서 시작하시거나, 주문번호와 함께 고객지원으로 문의해 주십시오.</p>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which version should win, and why?
  ko: >-
    어느 안이 이겨야 하고, 그 이유는 무엇일까요?
options:
  en:
    - text: B
      reason: >-
        Both versions clear the bar for telling characters apart; what
        separates them is the block. A's tight leading and 100-character lines
        punish sustained reading, and no amount of contrast buys that back.
      correct: true
    - text: A, for its contrast
      reason: >-
        High contrast between characters and background is the stated
        requirement, and #000000 on white meets it more fully than #333333
        does.
    - text: A, for fitting above the fold
      reason: >-
        It holds the whole policy without scrolling, and a page the reader
        never has to scroll asks less of them than one they do.
    - text: Neither, yet
      reason: >-
        A judgement like this cannot be made from looking; measure reading
        speed on both versions and let the numbers decide.
  ko:
    - text: B안
      reason: >-
        글자를 구별하는 문턱은 두 안 모두 넘습니다. 둘을 가르는 것은 덩어리
        쪽입니다. A안의 좁은 행간과 65자짜리 줄은 이어 읽기를 힘들게 만드는데,
        대비를 아무리 높여도 그 손해는 메워지지 않습니다.
      correct: true
    - text: A안 — 대비 때문에
      reason: >-
        글자와 배경 사이의 높은 대비가 명시된 요구이고, 흰 바탕의 #000000이
        #333333보다 그것을 더 온전히 충족합니다.
    - text: A안 — 한 화면에 들어가기 때문에
      reason: >-
        규정 전문이 스크롤 없이 들어가는데, 스크롤이 필요 없는 페이지는 필요한
        페이지보다 독자에게 덜 요구합니다.
    - text: 아직은 어느 쪽도 아닙니다
      reason: >-
        이런 판단은 눈으로 봐서 내릴 수 없으니, 두 안의 읽기 속도를 측정해
        숫자가 결정하게 해야 합니다.
---
