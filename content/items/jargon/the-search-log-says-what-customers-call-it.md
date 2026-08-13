---
sourceSection: '1. How Many Readers Will Know This Term?'
principles:
  - plain-language
artefact:
  en: >-
    Two things from one product, drawn side by side. On the left, the customer
    account menu, whose four entries are "Orders", "Invoices", "Remittance
    advice" and "Settings". On the right, three months of the site's own search
    log: "payment confirmation" searched 2,140 times, "proof of payment" 1,890,
    "receipt for payment" 1,205, "remittance" 11. A line under the table says
    the log covers customer accounts only, not staff.
  ko: >-
    한 제품에서 가져온 두 가지가 나란히 있습니다. 왼쪽은 고객 계정 메뉴이고,
    항목은 "주문 내역", "세금계산서", "송금통지서", "설정" 네 개입니다. 오른쪽은
    이 사이트 자체 검색 기록 석 달치입니다. "입금 확인"이 2,140번, "결제 증빙"이
    1,890번, "영수증"이 1,205번 검색되었고, "송금통지"는 11번입니다. 표 아래
    한 줄에는 이 기록이 직원이 아니라 고객 계정에서만 모은 것이라고 적혀
    있습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Customer account menu</p>
        <div class="screen">
          <div class="side-item">Orders</div>
          <div class="side-item">Invoices</div>
          <div class="side-item side-item--on">Remittance advice</div>
          <div class="side-item">Settings</div>
        </div>
      </div>
      <div>
        <p class="pane-label">Site search log · last 3 months</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>What was typed</th><th>Times</th></tr></thead>
            <tbody>
              <tr><td>payment confirmation</td><td>2,140</td></tr>
              <tr><td>proof of payment</td><td>1,890</td></tr>
              <tr><td>receipt for payment</td><td>1,205</td></tr>
              <tr><td>remittance</td><td>11</td></tr>
            </tbody>
          </table>
          <p class="note">Customer accounts only. Staff searches are excluded.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">고객 계정 메뉴</p>
        <div class="screen">
          <div class="side-item">주문 내역</div>
          <div class="side-item">세금계산서</div>
          <div class="side-item side-item--on">송금통지서</div>
          <div class="side-item">설정</div>
        </div>
      </div>
      <div>
        <p class="pane-label">사이트 검색 기록 · 최근 3개월</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>입력한 말</th><th>횟수</th></tr></thead>
            <tbody>
              <tr><td>입금 확인</td><td>2,140</td></tr>
              <tr><td>결제 증빙</td><td>1,890</td></tr>
              <tr><td>영수증</td><td>1,205</td></tr>
              <tr><td>송금통지</td><td>11</td></tr>
            </tbody>
          </table>
          <p class="note">고객 계정에서 모은 기록입니다. 직원 검색은 빠져 있습니다.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change should the menu entry make?
  ko: >-
    이 메뉴 항목은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Rename it to the words the customers typed
      reason: >-
        The log already answers how many of these readers know the term, and it
        answers eleven.
      correct: true
    - text: Keep the entry and register the customers' words as search synonyms for it
      reason: >-
        Everybody searching in their own words is then delivered to the right
        page, without renaming anything.
    - text: Keep the entry and add the customers' words underneath it as a subtitle
      reason: >-
        The precise name stays in the menu while the words people actually use
        are on the same line as it.
    - text: Run a usability test before deciding, since search logs do not say whether people understood the page
      reason: >-
        What people type into a box is weaker evidence than watching them try to
        do the task.
  ko:
    - text: 고객들이 실제로 입력한 말로 이름을 바꿉니다
      reason: >-
        이 독자들 가운데 몇 명이나 그 용어를 아는지는 검색 기록이 이미 답하고
        있고, 그 답은 열한 명입니다.
      correct: true
    - text: 항목 이름은 그대로 두고, 고객들이 쓴 말을 검색 동의어로 등록합니다
      reason: >-
        이름을 바꾸지 않고도 자기 말로 검색한 사람이 모두 제 페이지에 도착하게
        됩니다.
    - text: 항목 이름은 그대로 두고, 그 아래 고객들이 쓴 말을 부제로 답니다
      reason: >-
        정확한 이름이 메뉴에 남으면서, 사람들이 실제로 쓰는 말도 같은 줄에서
        보입니다.
    - text: 검색 기록만으로는 페이지를 이해했는지 알 수 없으니, 사용성 테스트를 하고 나서 정합니다
      reason: >-
        검색창에 무엇을 입력했는지는, 실제로 일을 해내는 모습을 지켜보는 것보다
        약한 근거입니다.
---
