---
sourceSection: Sort Questions and Options in a Logical Order
principles:
  - smart-defaults
  - cognitive-load
artefact:
  en: >-
    A purchase requisition in an internal procurement tool, headed "New purchase
    requisition", shown at three moments. In the first, "Requested by" holds a
    name and the second field, "Approver", is an unopened dropdown reading
    "Choose an approver". Below them a "Line items" table is empty and the total
    at the foot reads as a dash. In the second, the approver dropdown reads "Dana
    Whitfield — Team lead"; the table is still empty and the total is still a
    dash. In the third, the table holds three lines — docking stations, monitor
    arms and cable kits — and the total reads $1,240.00. Beneath the total a
    boxed line has appeared, saying that requests over $1,000.00 are approved by
    the Finance Director. The approver field still reads "Dana Whitfield — Team
    lead", and a "Send for approval" button sits at the bottom.
  ko: >-
    사내 구매 도구의 구매 요청 화면입니다. 제목은 "구매 요청"이고, 세 시점의 모습을
    보여 줍니다. 첫 번째에서 "요청자"에는 이름이 들어 있고, 두 번째 칸인 "결재자"는
    "결재자 선택"이라고 적힌 닫힌 드롭다운입니다. 그 아래 "품목" 표는 비어 있고, 표
    아래 합계 자리에는 줄표가 있습니다. 두 번째에서는 결재자 드롭다운이 "박서연 —
    팀장"으로 바뀌어 있습니다. 표는 여전히 비어 있고 합계도 여전히 줄표입니다. 세
    번째에서는 표에 세 줄이 들어 있고 — 도킹 스테이션, 모니터 암, 케이블 키트 —
    합계는 1,240,000원입니다. 합계 아래에는 100만 원이 넘는 요청은 재무 이사가
    결재한다는 내용의 상자 한 줄이 새로 나타나 있습니다. 결재자 칸은 그대로 "박서연 —
    팀장"이고, 맨 아래에 "결재 요청" 버튼이 있습니다.
sequence:
  - caption:
      en: The requisition as it opens
      ko: 요청서가 열린 직후
    screen:
      en: |-
        <div class="screen">
          <h1>New purchase requisition</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Requested by</span><input class="control" value="Sam Rivera"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Approver</span><span class="control control--empty">Choose an approver &#9662;</span></div>
          <h2>Line items</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>Item</th><th>Qty</th><th>Cost</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">No line items yet</td></tr></tbody>
          </table>
          <div class="actions"><button class="btn btn--outline">Add line</button><span style="margin-left:auto;font-weight:600">Total &mdash;</span></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>구매 요청</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">요청자</span><input class="control" value="한서연"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">결재자</span><span class="control control--empty">결재자 선택 &#9662;</span></div>
          <h2>품목</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>품목</th><th>수량</th><th>금액</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">아직 품목이 없습니다</td></tr></tbody>
          </table>
          <div class="actions"><button class="btn btn--outline">품목 추가</button><span style="margin-left:auto;font-weight:600">합계 &mdash;</span></div>
        </div>
  - caption:
      en: After the approver has been chosen
      ko: 결재자를 고른 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>New purchase requisition</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Requested by</span><input class="control" value="Sam Rivera"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Approver</span><span class="control">Dana Whitfield &mdash; Team lead &#9662;</span></div>
          <h2>Line items</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>Item</th><th>Qty</th><th>Cost</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">No line items yet</td></tr></tbody>
          </table>
          <div class="actions"><button class="btn btn--outline">Add line</button><span style="margin-left:auto;font-weight:600">Total &mdash;</span></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>구매 요청</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">요청자</span><input class="control" value="한서연"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">결재자</span><span class="control">박서연 &mdash; 팀장 &#9662;</span></div>
          <h2>품목</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>품목</th><th>수량</th><th>금액</th></tr></thead>
            <tbody><tr><td colspan="3" class="muted">아직 품목이 없습니다</td></tr></tbody>
          </table>
          <div class="actions"><button class="btn btn--outline">품목 추가</button><span style="margin-left:auto;font-weight:600">합계 &mdash;</span></div>
        </div>
  - caption:
      en: After the last line item has been entered
      ko: 마지막 품목을 입력한 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>New purchase requisition</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Requested by</span><input class="control" value="Sam Rivera"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Approver</span><span class="control">Dana Whitfield &mdash; Team lead &#9662;</span></div>
          <h2>Line items</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>Item</th><th>Qty</th><th>Cost</th></tr></thead>
            <tbody>
              <tr><td>Docking stations</td><td>4</td><td>$720.00</td></tr>
              <tr><td>Monitor arms</td><td>4</td><td>$340.00</td></tr>
              <tr><td>Cable kits</td><td>6</td><td>$180.00</td></tr>
            </tbody>
          </table>
          <div class="actions" style="margin-bottom:14px"><button class="btn btn--outline">Add line</button><span style="margin-left:auto;font-weight:600">Total $1,240.00</span></div>
          <p class="callout" style="margin-bottom:16px">Requests over $1,000.00 are approved by the Finance Director.</p>
          <div class="actions"><button class="btn btn--blue">Send for approval</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>구매 요청</h1>
          <div class="field" style="margin-bottom:10px"><span class="field-label">요청자</span><input class="control" value="한서연"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">결재자</span><span class="control">박서연 &mdash; 팀장 &#9662;</span></div>
          <h2>품목</h2>
          <table class="table" style="margin-bottom:14px">
            <thead><tr><th>품목</th><th>수량</th><th>금액</th></tr></thead>
            <tbody>
              <tr><td>도킹 스테이션</td><td>4</td><td>720,000원</td></tr>
              <tr><td>모니터 암</td><td>4</td><td>340,000원</td></tr>
              <tr><td>케이블 키트</td><td>6</td><td>180,000원</td></tr>
            </tbody>
          </table>
          <div class="actions" style="margin-bottom:14px"><button class="btn btn--outline">품목 추가</button><span style="margin-left:auto;font-weight:600">합계 1,240,000원</span></div>
          <p class="callout" style="margin-bottom:16px">1,000,000원이 넘는 요청은 재무 이사가 결재합니다.</p>
          <div class="actions"><button class="btn btn--blue">결재 요청</button></div>
        </div>
prompt:
  en: >-
    One requisition in three raised here has to be sent back and put in front of
    a different approver. Which change fixes that?
  ko: >-
    이곳에서 올라온 요청 세 건 중 한 건은 되돌아와 다른 결재자에게 다시 올라갑니다.
    무엇을 바꿔야 그것이 없어질까요?
options:
  en:
    - text: Ask for the approver below the line items, and fill it from the total — right by default, still changeable
      reason: >-
        The question is then put at the first moment its answer is knowable, and
        most people never have to answer it at all.
      correct: true
    - text: Leave the approver where it is and put the routing rule in help text underneath it
      reason: >-
        The rule is stated before the choice is made, which is where a rule about
        the choice belongs.
    - text: Refuse the requisition at submit when the approver does not match the total, and name the one that does
      reason: >-
        Nothing wrongly routed leaves the screen, and the person is told exactly
        who it should have gone to.
    - text: Sort the approver list so the people who can sign off the largest amounts come first
      reason: >-
        Anyone raising a large request meets the right name first, instead of
        scrolling past a dozen team leads to reach it.
  ko:
    - text: 결재자를 품목 아래에서 묻고, 합계에서 채워 넣습니다 — 기본값은 맞게, 바꿀 수는 있게
      reason: >-
        답을 알 수 있게 되는 첫 순간에 질문이 놓이고, 대부분의 사람은 그 질문에
        아예 답하지 않아도 됩니다.
      correct: true
    - text: 결재자 칸은 그대로 두고, 그 아래 도움말에 결재선 규칙을 적습니다
      reason: >-
        선택하기 전에 규칙이 적혀 있게 되는데, 그 선택에 관한 규칙이라면 바로 그
        자리가 맞습니다.
    - text: 제출할 때 결재자가 합계와 맞지 않으면 되돌리고, 맞는 사람을 알려 줍니다
      reason: >-
        잘못 올라간 요청이 화면을 떠나지 않고, 누구에게 갔어야 하는지도 정확히
        알려 줍니다.
    - text: 결재자 목록을 큰 금액을 결재할 수 있는 사람부터 오도록 정렬합니다
      reason: >-
        큰 요청을 올리는 사람이 팀장 열두 명을 지나쳐 내려가지 않고 맞는 이름을
        먼저 만납니다.
---
