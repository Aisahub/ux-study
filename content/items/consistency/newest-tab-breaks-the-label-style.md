---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    The account area of a shopping site. The tab bar reads "Order history",
    "Saved addresses", "Payment methods", "Email preferences" — and then the
    newest tab, added last month: "Gift Cards And Vouchers", with every word
    capitalised. Below the tabs, the page's buttons follow the same style as
    the first four tabs: "Add address", "Set as default", "Remove card".
  ko: >-
    쇼핑 사이트의 계정 영역입니다. 탭 막대에는 "주문 내역", "배송지 관리",
    "결제 수단", "이메일 설정"이 있고 — 지난달에 추가된 가장 새 탭만 "기프트
    카드와 상품권 확인하기"입니다. 탭 아래 페이지의 버튼과 항목 이름들은 앞
    네 탭과 같은 짧은 명사형을 따릅니다. "배송지 추가", "기본으로 지정",
    "카드 삭제".
screen:
  en: |-
    <div class="screen">
      <div class="tabs">
        <div class="tab tab--on">Order history</div>
        <div class="tab">Saved addresses</div>
        <div class="tab">Payment methods</div>
        <div class="tab">Email preferences</div>
        <div class="tab">Gift Cards And Vouchers</div>
      </div>
      <div style="margin-top:16px">
        <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">14 Marine Parade, Singapore 449287</span><button class="btn btn--hairline">Set as default</button></div></div>
        <div class="card" style="margin-bottom:12px"><div class="actions"><span style="margin-right:auto">Visa ending 4417</span><button class="btn btn--hairline">Remove card</button></div></div>
        <button class="btn btn--blue">Add address</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <div class="tabs">
        <div class="tab tab--on">주문 내역</div>
        <div class="tab">배송지 관리</div>
        <div class="tab">결제 수단</div>
        <div class="tab">이메일 설정</div>
        <div class="tab">기프트 카드와 상품권 확인하기</div>
      </div>
      <div style="margin-top:16px">
        <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">서울 마포구 양화로 45, 302호</span><button class="btn btn--hairline">기본으로 지정</button></div></div>
        <div class="card" style="margin-bottom:12px"><div class="actions"><span style="margin-right:auto">비자 4417로 끝나는 카드</span><button class="btn btn--hairline">카드 삭제</button></div></div>
        <button class="btn btn--blue">배송지 추가</button>
      </div>
    </div>
prompt:
  en: >-
    The newest tab is styled unlike the rest. Which style should the tab bar
    settle on?
  ko: >-
    가장 새 탭만 이름 짓는 방식이 다릅니다. 탭 막대는 어느 방식으로 정리해야
    할까요?
options:
  en:
    - text: Rewrite the newest tab in the first four tabs' style
      reason: >-
        Every other label on this page, tabs and buttons alike, already follows
        it, so the one tab written differently is the one to rewrite.
      correct: true
    - text: Rewrite the first four in the newest tab's style
      reason: >-
        Capitalising every word gives the labels more presence, and a tab bar
        is a place worth dressing up.
    - text: Leave the tab bar alone
      reason: >-
        Users read the words, not the styling, so the odd tab costs nothing as
        long as its label is clear.
    - text: Put every tab in all-capitals instead
      reason: >-
        It ends the styling question by giving neither variant the win.
  ko:
    - text: 새 탭을 앞 네 탭의 방식으로 고쳐 씁니다
      reason: >-
        이 페이지의 다른 이름들은 탭이든 버튼이든 이미 전부 그 방식을 따르고
        있으니, 다르게 적힌 탭 하나를 고쳐 쓰는 것이 맞습니다.
      correct: true
    - text: 앞 네 탭을 새 탭의 방식으로 고쳐 씁니다
      reason: >-
        무엇을 하는 곳인지 문장으로 풀어 주는 이름이 더 친절하고, 탭 막대는
        그만큼 공들일 가치가 있는 자리입니다.
    - text: 탭 막대는 그대로 둡니다
      reason: >-
        사용자는 이름 짓는 방식이 아니라 낱말을 읽으니, 뜻만 분명하면 튀는 탭
        하나가 치르게 하는 대가는 없습니다.
    - text: 모든 탭 이름 뒤에 "확인하기"를 붙여 통일합니다
      reason: >-
        그러면 두 방식 중 어느 쪽도 이긴 것이 아니게 됩니다.
---
