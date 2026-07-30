---
sourceSection: 'Communication Creates Trust'
principles:
  - system-status
  - appropriate-feedback
artefact:
  en: >-
    The approval queue of an internal finance tool, shown at three moments. A
    line above the table reads "8 invoices waiting". The table lists five
    invoices with their supplier, amount and state; INV-2213 stands at "Pending"
    and carries an "Approve" button on its row. In the first moment that button
    has just been pressed. In the second, two seconds later, the row still reads
    "Pending", the button is still there in the same style, the count above
    still reads "8 invoices waiting", and no message has appeared anywhere on
    the screen. In the third, ten seconds after the press, every one of those
    things is still exactly as it was.
  ko: >-
    사내 재무 도구의 결재 대기 목록을 세 시점에 걸쳐 보여 줍니다. 표 위에는
    "대기 중인 청구서 8건"이라고 적혀 있습니다. 표에는 청구서 다섯 건이
    공급사, 금액, 상태와 함께 놓여 있고, 그중 INV-2213은 "대기"이며 같은 행에
    "승인" 버튼이 있습니다. 첫 시점은 그 버튼을 막 누른 참입니다. 두 번째
    시점은 2초 뒤인데, 행은 여전히 "대기"이고 버튼도 같은 모양 그대로 있으며,
    위의 건수도 그대로 "대기 중인 청구서 8건"이고, 화면 어디에도 새로 뜬 말은
    없습니다. 세 번째 시점은 누르고 10초 뒤인데, 그 모든 것이 하나도 달라지지
    않은 채입니다.
sequence:
  - caption:
      en: The moment "Approve" is pressed on INV-2213
      ko: INV-2213 행의 "승인"을 누른 순간
    screen:
      en: |-
        <div class="screen">
          <h2>Approval queue</h2>
          <p class="muted" style="margin:0 0 12px">8 invoices waiting</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Invoice</th><th>Supplier</th><th>Amount</th><th>State</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>Daehan Metals</td><td>$1,240</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2212</td><td>Rimba Packaging</td><td>$620</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2213</td><td>Harbour Freight</td><td>$8,900</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2214</td><td>Setia Print</td><td>$310</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2215</td><td>Nordwind Tools</td><td>$2,050</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>결재 대기 목록</h2>
          <p class="muted" style="margin:0 0 12px">대기 중인 청구서 8건</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>청구서</th><th>공급사</th><th>금액</th><th>상태</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>대한금속</td><td>124만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2212</td><td>림바포장</td><td>62만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2213</td><td>항만운송</td><td>890만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2214</td><td>세티아인쇄</td><td>31만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2215</td><td>노르드공구</td><td>205만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
  - caption:
      en: Two seconds after the press
      ko: 누르고 2초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Approval queue</h2>
          <p class="muted" style="margin:0 0 12px">8 invoices waiting</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Invoice</th><th>Supplier</th><th>Amount</th><th>State</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>Daehan Metals</td><td>$1,240</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2212</td><td>Rimba Packaging</td><td>$620</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2213</td><td>Harbour Freight</td><td>$8,900</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2214</td><td>Setia Print</td><td>$310</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2215</td><td>Nordwind Tools</td><td>$2,050</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>결재 대기 목록</h2>
          <p class="muted" style="margin:0 0 12px">대기 중인 청구서 8건</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>청구서</th><th>공급사</th><th>금액</th><th>상태</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>대한금속</td><td>124만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2212</td><td>림바포장</td><td>62만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2213</td><td>항만운송</td><td>890만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2214</td><td>세티아인쇄</td><td>31만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2215</td><td>노르드공구</td><td>205만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
  - caption:
      en: Ten seconds after the press
      ko: 누르고 10초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Approval queue</h2>
          <p class="muted" style="margin:0 0 12px">8 invoices waiting</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Invoice</th><th>Supplier</th><th>Amount</th><th>State</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>Daehan Metals</td><td>$1,240</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2212</td><td>Rimba Packaging</td><td>$620</td><td>Approved</td><td></td></tr>
                <tr><td>INV-2213</td><td>Harbour Freight</td><td>$8,900</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2214</td><td>Setia Print</td><td>$310</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
                <tr><td>INV-2215</td><td>Nordwind Tools</td><td>$2,050</td><td>Pending</td><td><button class="btn btn--hairline">Approve</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>결재 대기 목록</h2>
          <p class="muted" style="margin:0 0 12px">대기 중인 청구서 8건</p>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>청구서</th><th>공급사</th><th>금액</th><th>상태</th><th></th></tr></thead>
              <tbody>
                <tr><td>INV-2211</td><td>대한금속</td><td>124만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2212</td><td>림바포장</td><td>62만 원</td><td>승인됨</td><td></td></tr>
                <tr><td>INV-2213</td><td>항만운송</td><td>890만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2214</td><td>세티아인쇄</td><td>31만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
                <tr><td>INV-2215</td><td>노르드공구</td><td>205만 원</td><td>대기</td><td><button class="btn btn--hairline">승인</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
prompt:
  en: >-
    The server refused this approval two seconds after the press, and INV-2213
    is still owing. Which change should this screen make?
  ko: >-
    이 승인은 누르고 2초 뒤에 서버에서 거절됐고, INV-2213은 여전히 처리해야 할
    건으로 남아 있습니다. 이 화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Say on the row itself that the approval did not go through, and leave Approve ready for another try
      reason: >-
        The row acted on is where the user is looking, and it is the row that
        still has work owing on it.
      correct: true
    - text: Mark the row approved the instant the button is pressed, and put it back if the server refuses
      reason: >-
        The press gets an answer straight away, which is the moment the user is
        actually waiting on.
    - text: Reload the queue every thirty seconds so it always shows the true state
      reason: >-
        The state held on the server reaches the screen without anyone pressing
        anything.
    - text: Grey out Approve for a few seconds after each press so nobody presses twice
      reason: >-
        A second press cannot land while the first one is still in flight.
  ko:
    - text: 승인이 이뤄지지 않았다는 것을 그 행에 적고, "승인"은 다시 누를 수 있게 둡니다
      reason: >-
        사용자가 보고 있는 곳은 자기가 누른 그 행이고, 아직 처리가 남아 있는
        것도 그 행입니다.
      correct: true
    - text: 버튼을 누른 즉시 행을 승인됨으로 바꾸고, 서버가 거절하면 되돌립니다
      reason: >-
        사용자가 실제로 기다리는 순간인 누른 그 순간에 바로 답이 옵니다.
    - text: 30초마다 목록을 다시 불러와 늘 실제 상태가 보이게 합니다
      reason: >-
        아무도 무언가를 누르지 않아도 서버에 있는 상태가 화면까지 옵니다.
    - text: 누른 뒤 몇 초 동안 "승인"을 회색으로 잠가 두 번 눌리지 않게 합니다
      reason: >-
        첫 번째 요청이 도는 동안에는 두 번째 누름이 들어갈 수 없습니다.
---
