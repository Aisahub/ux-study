---
sourceSection: '2. Scale'
principles:
  - scale
artefact:
  en: >-
    Two versions of the same order-detail panel. A warehouse operator opens it
    to check the total against the invoice, then dispatch the order.

    Version A puts the order number "20260714-0093" at the top in 28px bold.
    The customer name, the address and the total "$1,284" all sit at 15px, and
    the "Ship now" button carries a 15px label.

    Version B puts the order number at the top in 13px grey. The customer name
    and address sit at 15px, the total is 28px, and "Ship now" is a filled bar
    with an 18px label, as tall as the total is large.
  ko: >-
    같은 주문 상세 패널의 두 가지 버전입니다. 창고 담당자는 이 패널을 열어
    금액을 명세서와 대조하고 출고 처리를 합니다.

    A안은 맨 위에 주문번호 "20260714-0093"이 28px 굵은 글자로 놓입니다.
    고객 이름과 주소, 금액 "1,284,000원"이 모두 15px이고, "출고 처리" 버튼의
    글자도 15px입니다.

    B안은 맨 위 주문번호가 13px 회색입니다. 고객 이름과 주소는 15px,
    금액은 28px이고, "출고 처리"는 금액 높이만 한 채움 버튼에 18px
    글자입니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Version A</p>
        <div class="screen">
          <p style="font-size:28px;font-weight:700;margin:0 0 12px">20260714-0093</p>
          <p style="font-size:15px;margin:0">Grace Tan</p>
          <p style="font-size:15px;margin:0 0 10px">14 Marine Parade, Singapore 449287</p>
          <p style="font-size:15px;margin:0 0 14px">Total $1,284</p>
          <button class="btn btn--outline" style="font-size:15px">Ship now</button>
        </div>
      </div>
      <div>
        <p class="pane-label">Version B</p>
        <div class="screen">
          <p style="font-size:13px;color:#9ca3af;margin:0 0 12px">20260714-0093</p>
          <p style="font-size:15px;margin:0">Grace Tan</p>
          <p style="font-size:15px;margin:0 0 10px">14 Marine Parade, Singapore 449287</p>
          <p style="font-size:28px;font-weight:700;margin:0 0 14px">Total $1,284</p>
          <button class="btn btn--solid" style="font-size:18px;display:block;width:100%">Ship now</button>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">A 버전</p>
        <div class="screen">
          <p style="font-size:28px;font-weight:700;margin:0 0 12px">20260714-0093</p>
          <p style="font-size:15px;margin:0">김지우</p>
          <p style="font-size:15px;margin:0 0 10px">서울 마포구 양화로 45, 302호</p>
          <p style="font-size:15px;margin:0 0 14px">합계 1,284,000원</p>
          <button class="btn btn--outline" style="font-size:15px">출고 처리</button>
        </div>
      </div>
      <div>
        <p class="pane-label">B 버전</p>
        <div class="screen">
          <p style="font-size:13px;color:#9ca3af;margin:0 0 12px">20260714-0093</p>
          <p style="font-size:15px;margin:0">김지우</p>
          <p style="font-size:15px;margin:0 0 10px">서울 마포구 양화로 45, 302호</p>
          <p style="font-size:28px;font-weight:700;margin:0 0 14px">합계 1,284,000원</p>
          <button class="btn btn--solid" style="font-size:18px;display:block;width:100%">출고 처리</button>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which version's scale matches the operator's job, and for which reason?
  ko: >-
    담당자가 하는 일에 크기가 맞게 쓰인 쪽은 어디이고, 그 이유는 무엇일까요?
options:
  en:
    - text: Version B
      reason: >-
        The two things the job turns on, the total and Ship now, are the two
        largest elements on the panel.
      correct: true
    - text: Version A, for the order number
      reason: >-
        It is what identifies the order, so it has to be the first thing found.
    - text: Version A, because only one element should be largest
      reason: >-
        Version B makes two elements large, and a screen should never have two
        at the top.
    - text: Neither
      reason: >-
        Both versions use three type sizes, and a panel this small should stay
        at one.
  ko:
    - text: B안
      reason: >-
        이 일의 성패가 걸린 두 가지, 금액과 출고 처리 버튼이 패널에서 가장 큰
        요소입니다.
      correct: true
    - text: A안 — 주문번호 때문에
      reason: >-
        주문번호는 어느 주문인지 특정하는 정보이므로 가장 먼저 눈에 들어와야
        합니다.
    - text: A안 — 가장 큰 요소는 하나여야 하므로
      reason: >-
        B안은 큰 요소를 둘이나 두었는데, 한 화면에서 가장 큰 요소는
        하나뿐이어야 합니다.
    - text: 둘 다 아닙니다
      reason: >-
        두 버전 모두 글자 크기를 세 단계 쓰는데, 이만한 패널 하나에는 한
        단계면 충분합니다.
---
