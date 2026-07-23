---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    The dashboard of a billing tool. Solid red appears in exactly four places.
    Three of them are problems: a "Payment failed" badge on one invoice, an
    error toast reading "Card declined", and the "Delete account" button at
    the foot of the sidebar. The fourth is a wide banner across the top:
    "Upgrade to Pro — 30% off this week", in the same solid red with white
    text. Nothing about that offer is wrong or urgent; it is a promotion.
  ko: >-
    결제 도구의 대시보드입니다. 꽉 채운 빨강이 정확히 네 곳에 쓰였습니다. 그
    중 셋은 문제 상황입니다. 청구서 하나에 붙은 "결제 실패" 배지, "카드가
    거절되었습니다"라는 오류 토스트, 사이드바 맨 아래의 "계정 삭제" 버튼.
    네 번째는 화면 맨 위를 가로지르는 배너로, "Pro로 업그레이드 — 이번 주
    30% 할인"이 같은 빨강 바탕에 흰 글자로 적혀 있습니다. 이 제안에는
    잘못되거나 급한 것이 전혀 없습니다. 그냥 홍보입니다.
screen:
  en: |-
    <div class="screen">
      <div class="banner banner--red" style="margin-bottom:14px">Upgrade to Pro — 30% off this week</div>
      <div class="app">
        <div class="side">
          <div class="side-item side-item--on">Invoices</div>
          <div class="side-item">Customers</div>
          <div class="side-item">Settings</div>
          <div style="margin-top:24px"><button class="btn btn--danger" style="width:100%">Delete account</button></div>
        </div>
        <div>
          <p class="toast" style="margin:0 0 12px">Card declined</p>
          <table class="table">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>#2841</td><td>Northwind</td><td>$1,240</td><td>Paid</td></tr>
              <tr><td>#2840</td><td>Harbour Ltd</td><td>$615</td><td><span class="badge badge--red">Payment failed</span></td></tr>
              <tr><td>#2839</td><td>Bright Foods</td><td>$730</td><td>Paid</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <div class="banner banner--red" style="margin-bottom:14px">Pro로 업그레이드 — 이번 주 30% 할인</div>
      <div class="app">
        <div class="side">
          <div class="side-item side-item--on">청구서</div>
          <div class="side-item">고객</div>
          <div class="side-item">설정</div>
          <div style="margin-top:24px"><button class="btn btn--danger" style="width:100%">계정 삭제</button></div>
        </div>
        <div>
          <p class="toast" style="margin:0 0 12px">카드가 거절되었습니다</p>
          <table class="table">
            <thead><tr><th>청구서</th><th>고객사</th><th>금액</th><th>상태</th></tr></thead>
            <tbody>
              <tr><td>#2841</td><td>노스윈드</td><td>124만</td><td>완납</td></tr>
              <tr><td>#2840</td><td>하버</td><td>61만</td><td><span class="badge badge--red">결제 실패</span></td></tr>
              <tr><td>#2839</td><td>브라이트푸드</td><td>73만</td><td>완납</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Red is doing two different jobs on this screen. Which job keeps the
    colour?
  ko: >-
    이 화면에서 빨강이 서로 다른 두 가지 일을 하고 있습니다. 어느 쪽이 이
    색을 가져가야 할까요?
options:
  en:
    - text: Recolour the banner and leave red to the problems
      reason: >-
        Three of the four red elements already mean "something needs
        attention", and the banner spends that alarm on an offer.
      correct: true
    - text: Let the banner keep red
      reason: >-
        A promotion lives or dies by being noticed, and red is the strongest
        attention colour this screen has.
    - text: Recolour "Delete account" instead
      reason: >-
        It is a button rather than a status, so once it changes, red splits
        cleanly between errors and the banner.
    - text: Keep all four red and add a megaphone icon to the banner
      reason: >-
        Users can then tell the promotional red from the problem red.
  ko:
    - text: 배너를 다른 색으로 바꾸고 빨강은 문제 상황에 남깁니다
      reason: >-
        빨간 요소 넷 중 셋이 이미 "주의가 필요하다"는 뜻으로 쓰이고 있는데,
        배너는 그 경보를 홍보에 써 버리고 있습니다.
      correct: true
    - text: 배너가 빨강을 가져갑니다
      reason: >-
        홍보는 눈에 띄어야 사는 것이고, 빨강은 이 화면이 가진 가장 강한 주목
        색입니다.
    - text: 대신 "계정 삭제"의 색을 바꿉니다
      reason: >-
        그것은 상태가 아니라 버튼이니, 그것만 바꾸면 빨강이 오류와 배너로
        깔끔하게 나뉩니다.
    - text: 네 곳 모두 빨강을 유지하고 배너에 확성기 아이콘을 더합니다
      reason: >-
        그러면 홍보의 빨강과 문제의 빨강을 구별할 수 있습니다.
---
