---
sourceSection: 'Button States vs. Button Styles'
principles:
  - consistency
  - signifier
artefact:
  en: >-
    Three list pages of one admin tool, each with its create action in the
    top-right corner. On Customers, "Add customer" is a solid blue rounded
    button with a white label. On Products, "+ Add product" is plain teal
    text — no border, no underline, no fill. On Orders, "Add order" is a
    white rectangle with a thin grey border. The three actions do the same
    rank of job on their pages.
  ko: >-
    한 관리 도구의 목록 페이지 세 곳으로, 각 페이지의 오른쪽 위에 새로
    만들기 동작이 있습니다. 고객 페이지의 "고객 추가"는 파랑으로 채운 둥근
    버튼에 흰 글자입니다. 상품 페이지의 "+ 상품 추가"는 테두리도 밑줄도
    채움도 없는 청록색 평문입니다. 주문 페이지의 "주문 추가"는 가는 회색
    테두리를 두른 흰 사각형입니다. 세 동작은 각자의 페이지에서 같은 급의
    일을 합니다.
screen:
  en: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">Customers</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">Customers</h3><button class="btn btn--blue">Add customer</button></div>
          <table class="table"><tbody><tr><td>Northwind</td></tr><tr><td>Lakeside Co</td></tr><tr><td>Bright Foods</td></tr></tbody></table>
        </div>
      </div>
      <div>
        <p class="pane-label">Products</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">Products</h3><span class="btn btn--ghost-teal">+ Add product</span></div>
          <table class="table"><tbody><tr><td>Cleanser</td></tr><tr><td>Toner</td></tr><tr><td>Serum</td></tr></tbody></table>
        </div>
      </div>
      <div>
        <p class="pane-label">Orders</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">Orders</h3><button class="btn btn--hairline" style="border-radius:0">Add order</button></div>
          <table class="table"><tbody><tr><td>#2841</td></tr><tr><td>#2840</td></tr><tr><td>#2839</td></tr></tbody></table>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">고객</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">고객</h3><button class="btn btn--blue">고객 추가</button></div>
          <table class="table"><tbody><tr><td>노스윈드</td></tr><tr><td>레이크사이드</td></tr><tr><td>브라이트푸드</td></tr></tbody></table>
        </div>
      </div>
      <div>
        <p class="pane-label">상품</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">상품</h3><span class="btn btn--ghost-teal">+ 상품 추가</span></div>
          <table class="table"><tbody><tr><td>클렌저</td></tr><tr><td>토너</td></tr><tr><td>세럼</td></tr></tbody></table>
        </div>
      </div>
      <div>
        <p class="pane-label">주문</p>
        <div class="screen">
          <div class="actions" style="margin-bottom:12px"><h3 style="margin:0 auto 0 0">주문</h3><button class="btn btn--hairline" style="border-radius:0">주문 추가</button></div>
          <table class="table"><tbody><tr><td>#2841</td></tr><tr><td>#2840</td></tr><tr><td>#2839</td></tr></tbody></table>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change lets a user who has learned one of these pages trust the
    other two?
  ko: >-
    한 페이지에 익숙해진 사용자가 나머지 두 페이지도 믿고 쓰게 하려면
    무엇을 바꿔야 할까요?
options:
  en:
    - text: >-
        Give the same-rank action one primary style everywhere — the solid
        blue button — so the clickability learned on Customers carries to
        Products and Orders unchanged.
      correct: true
    - text: >-
        Each page is already right — a page's primary action should be its
        most prominent element, and on each of the three it is.
    - text: >-
        Keep the three styles and add the "+" prefix to all three labels, so
        the shared symbol ties them together.
    - text: >-
        Unify all three on the plain teal text, the quietest of the three
        styles, so no page's corner shouts.
  ko:
    - text: >-
        같은 급의 동작에는 어디서나 하나의 주요 버튼 스타일 — 파랑 채움
        버튼 — 을 입힙니다. 고객 페이지에서 익힌 '눌리는 모양'이 상품과
        주문 페이지에서도 그대로 통하게요.
      correct: true
    - text: >-
        세 페이지 모두 지금이 맞습니다 — 페이지의 주요 동작은 그 페이지에서
        가장 도드라진 요소여야 하는데, 세 곳 다 이미 그렇습니다.
    - text: >-
        세 가지 스타일은 유지하고 세 이름표 모두에 "+" 기호를 붙여서, 공통
        기호가 셋을 묶어 주게 합니다.
    - text: >-
        셋 중 가장 조용한 청록색 평문으로 셋을 통일해서, 어느 페이지의
        구석도 소리치지 않게 합니다.
---
