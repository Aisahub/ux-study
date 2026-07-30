---
sourceSection: 'Knowledge Is Power'
principles:
  - system-status
  - appropriate-feedback
artefact:
  en: >-
    A costing tool with a menu down the left — Costs, Orders, Suppliers — shown
    at three moments during one recalculation that takes about fifteen minutes.
    In the first, a minute in, Costs is the page on show and a line under its
    heading holds a small ring and the words "Recalculating landed costs · 340
    of 1,240". In the second, three minutes in, Orders is the page on show: a
    heading, a search control and a table of orders, with the menu beside it
    exactly as before. There is no ring, no count and no mention of the
    recalculation anywhere on it. In the third, nine minutes in and back on
    Costs, the ring and the line are there again, now reading "980 of 1,240".
  ko: >-
    왼쪽에 메뉴 — 원가, 주문, 공급사 — 가 있는 원가 도구를, 15분쯤 걸리는 재계산
    한 번 동안 세 시점에 걸쳐 보여 줍니다. 첫 시점은 시작하고 1분 뒤로, 원가
    페이지가 열려 있고 제목 아래 줄에 작은 고리와 함께 "육상원가 재계산 중 ·
    1,240건 중 340건"이 적혀 있습니다. 두 번째 시점은 3분 뒤로, 주문 페이지가
    열려 있습니다. 제목과 검색 입력란과 주문 표가 있고, 옆의 메뉴는 앞과
    똑같습니다. 이 페이지 어디에도 고리도, 건수도, 재계산 이야기도 없습니다.
    세 번째 시점은 9분 뒤에 다시 원가 페이지로 돌아온 순간으로, 고리와 그 줄이
    다시 보이고 이번에는 "1,240건 중 980건"이라고 적혀 있습니다.
sequence:
  - caption:
      en: One minute after the recalculation is started
      ko: 재계산을 시작하고 1분 뒤
    screen:
      en: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">Costs</div>
              <div class="side-item">Orders</div>
              <div class="side-item">Suppliers</div>
            </div>
            <div>
              <h2>Landed costs</h2>
              <p style="margin:0 0 12px"><span class="spinner"></span> <span>Recalculating landed costs · 340 of 1,240</span></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>Part</th><th>Supplier</th><th>Unit cost</th><th>Landed cost</th></tr></thead>
                  <tbody>
                    <tr><td>BR-1140</td><td>Daehan Metals</td><td>$4.10</td><td>$4.86</td></tr>
                    <tr><td>BR-1152</td><td>Daehan Metals</td><td>$9.40</td><td>$10.92</td></tr>
                    <tr><td>CL-2201</td><td>Rimba Packaging</td><td>$0.62</td><td>$0.79</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">원가</div>
              <div class="side-item">주문</div>
              <div class="side-item">공급사</div>
            </div>
            <div>
              <h2>육상원가</h2>
              <p style="margin:0 0 12px"><span class="spinner"></span> <span>육상원가 재계산 중 · 1,240건 중 340건</span></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>부품</th><th>공급사</th><th>단가</th><th>육상원가</th></tr></thead>
                  <tbody>
                    <tr><td>BR-1140</td><td>대한금속</td><td>4,100원</td><td>4,860원</td></tr>
                    <tr><td>BR-1152</td><td>대한금속</td><td>9,400원</td><td>10,920원</td></tr>
                    <tr><td>CL-2201</td><td>림바포장</td><td>620원</td><td>790원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  - caption:
      en: Three minutes in, on the Orders page
      ko: 시작하고 3분 뒤, 주문 페이지에서
    screen:
      en: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item">Costs</div>
              <div class="side-item side-item--on">Orders</div>
              <div class="side-item">Suppliers</div>
            </div>
            <div>
              <h2>Orders</h2>
              <p style="margin:0 0 12px"><input class="control" value="" placeholder="Search orders" style="width:180px"></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Total</th></tr></thead>
                  <tbody>
                    <tr><td>#4471</td><td>Harbour Freight</td><td>2026-07-29</td><td>$1,240</td></tr>
                    <tr><td>#4470</td><td>Setia Print</td><td>2026-07-29</td><td>$310</td></tr>
                    <tr><td>#4469</td><td>Nordwind Tools</td><td>2026-07-28</td><td>$2,050</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item">원가</div>
              <div class="side-item side-item--on">주문</div>
              <div class="side-item">공급사</div>
            </div>
            <div>
              <h2>주문</h2>
              <p style="margin:0 0 12px"><input class="control" value="" placeholder="주문 검색" style="width:180px"></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>주문번호</th><th>고객</th><th>주문일</th><th>금액</th></tr></thead>
                  <tbody>
                    <tr><td>#4471</td><td>항만운송</td><td>2026-07-29</td><td>124만 원</td></tr>
                    <tr><td>#4470</td><td>세티아인쇄</td><td>2026-07-29</td><td>31만 원</td></tr>
                    <tr><td>#4469</td><td>노르드공구</td><td>2026-07-28</td><td>205만 원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  - caption:
      en: Nine minutes in, back on the Costs page
      ko: 시작하고 9분 뒤, 원가 페이지로 돌아와서
    screen:
      en: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">Costs</div>
              <div class="side-item">Orders</div>
              <div class="side-item">Suppliers</div>
            </div>
            <div>
              <h2>Landed costs</h2>
              <p style="margin:0 0 12px"><span class="spinner"></span> <span>Recalculating landed costs · 980 of 1,240</span></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>Part</th><th>Supplier</th><th>Unit cost</th><th>Landed cost</th></tr></thead>
                  <tbody>
                    <tr><td>BR-1140</td><td>Daehan Metals</td><td>$4.10</td><td>$4.91</td></tr>
                    <tr><td>BR-1152</td><td>Daehan Metals</td><td>$9.40</td><td>$11.02</td></tr>
                    <tr><td>CL-2201</td><td>Rimba Packaging</td><td>$0.62</td><td>$0.81</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">원가</div>
              <div class="side-item">주문</div>
              <div class="side-item">공급사</div>
            </div>
            <div>
              <h2>육상원가</h2>
              <p style="margin:0 0 12px"><span class="spinner"></span> <span>육상원가 재계산 중 · 1,240건 중 980건</span></p>
              <div class="scroller">
                <table class="table">
                  <thead><tr><th>부품</th><th>공급사</th><th>단가</th><th>육상원가</th></tr></thead>
                  <tbody>
                    <tr><td>BR-1140</td><td>대한금속</td><td>4,100원</td><td>4,910원</td></tr>
                    <tr><td>BR-1152</td><td>대한금속</td><td>9,400원</td><td>11,020원</td></tr>
                    <tr><td>CL-2201</td><td>림바포장</td><td>620원</td><td>810원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
prompt:
  en: >-
    The recalculation runs for a quarter of an hour and the person who started
    it has other work to do. Which change should the tool make?
  ko: >-
    이 재계산은 15분쯤 돌고, 시작한 사람은 그동안 다른 일도 해야 합니다. 이
    도구는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Give the run a strip in the frame every page carries, naming the job and how far it has got
      reason: >-
        A run that outlives the page it was started from has to be readable
        from whichever page the person is on.
      correct: true
    - text: Keep them on the Costs page until the run finishes
      reason: >-
        Nobody can lose sight of a run they are not able to walk away from.
    - text: Put a note beside the count asking users to stay on this page until it finishes
      reason: >-
        The rule is written exactly where the run is started, so it is read
        before anyone leaves.
    - text: Raise a desktop notification when the run finishes
      reason: >-
        The person is told the moment it is done, whatever they happen to be
        doing.
  ko:
    - text: 모든 페이지가 함께 지고 다니는 테두리에 실행 상태 줄을 둡니다. 무슨 작업인지와 어디까지 갔는지를 적습니다
      reason: >-
        시작한 페이지보다 오래 가는 작업이라면, 지금 보고 있는 페이지가
        어디든 그곳에서 읽혀야 합니다.
      correct: true
    - text: 재계산이 끝날 때까지 원가 페이지를 떠나지 못하게 합니다
      reason: >-
        떠날 수 없는 작업이라면 눈에서 놓칠 일도 없습니다.
    - text: 건수 옆에 이 페이지를 떠나지 말아 달라는 안내를 붙입니다
      reason: >-
        작업을 시작하는 바로 그 자리에 규칙이 적혀 있으니, 떠나기 전에 읽게
        됩니다.
    - text: 재계산이 끝나면 데스크톱 알림을 띄웁니다
      reason: >-
        무엇을 하고 있든 끝나는 순간에 바로 알게 됩니다.
---
