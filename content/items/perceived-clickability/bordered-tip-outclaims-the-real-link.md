---
sourceSection: 'Button States Explained'
principles:
  - signifier
artefact:
  en: >-
    The help area at the foot of a reporting tool. On the left, a callout box
    with rounded corners, a thin blue border and a pale blue fill reads "Tip:
    reports can be exported as CSV." It is purely informational — clicking it
    does nothing, and there is nowhere for it to go. Beside it, the words
    "Contact support" appear in the same small dark-grey text as the copyright
    line next to them; that plain text is the actual link that opens the
    support form. New users click the tip box and never find the link.
  ko: >-
    리포트 도구 하단의 도움말 영역입니다. 왼쪽에는 모서리가 둥글고 가는
    파란 테두리에 옅은 파란 바탕을 깐 안내 상자가 있고, "팁: 보고서는
    CSV로 내보낼 수 있습니다."라고 적혀 있습니다. 순수한 안내문이라 눌러도
    아무 일도 없고, 이동할 곳 자체가 없습니다. 그 옆의 "고객 지원 문의"는
    바로 옆 저작권 표시줄과 똑같은 작은 짙은 회색 글자인데, 그 평문이야말로
    지원 요청 폼을 여는 진짜 링크입니다. 새 사용자들은 안내 상자를 눌러
    보고, 링크는 끝내 찾지 못합니다.
screen:
  en: |-
    <div class="screen">
      <table class="table" style="margin-bottom:20px">
        <thead><tr><th>Report</th><th>Period</th><th>Rows</th></tr></thead>
        <tbody>
          <tr><td>Revenue by client</td><td>June</td><td>128</td></tr>
          <tr><td>Refunds</td><td>June</td><td>14</td></tr>
        </tbody>
      </table>
      <div style="border-top:1px solid #eceef1;padding-top:14px">
        <div class="actions">
          <div class="callout" style="max-width:340px">Tip: reports can be exported as CSV.</div>
          <span style="font-size:13px;color:#4b5563">Contact support</span>
          <span style="font-size:13px;color:#4b5563">© 2026 Aisahub</span>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <table class="table" style="margin-bottom:20px">
        <thead><tr><th>보고서</th><th>기간</th><th>행 수</th></tr></thead>
        <tbody>
          <tr><td>고객사별 매출</td><td>6월</td><td>128</td></tr>
          <tr><td>환불</td><td>6월</td><td>14</td></tr>
        </tbody>
      </table>
      <div style="border-top:1px solid #eceef1;padding-top:14px">
        <div class="actions">
          <div class="callout" style="max-width:340px">팁: 보고서는 CSV로 내보낼 수 있습니다.</div>
          <span style="font-size:13px;color:#4b5563">고객 지원 문의</span>
          <span style="font-size:13px;color:#4b5563">© 2026 Aisahub</span>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change puts the signals where they belong?
  ko: >-
    신호를 제자리에 돌려놓으려면 무엇을 바꿔야 할까요?
options:
  en:
    - text: Move the signifiers onto the element that can act
      reason: >-
        Style "Contact support" as a link or button, and flatten the tip to
        plain text on the page background so its box stops claiming a click.
      correct: true
    - text: Leave both as they are
      reason: >-
        The tip box shows no cursor change or hover response, and that absence
        is how users learn it is not clickable.
    - text: Make the tip box clickable
      reason: >-
        Have it open the CSV export page, so the promise its border makes is
        honoured.
    - text: Enlarge "Contact support" until it is the biggest text in the help area
      reason: >-
        Then it can no longer be overlooked.
  ko:
    - text: 시그니파이어를 동작할 수 있는 요소로 옮깁니다
      reason: >-
        "고객 지원 문의"를 링크나 버튼답게 입히고, 안내 상자는 배경에 그대로
        얹힌 평문으로 눕혀서 그 테두리가 클릭을 주장하지 못하게 합니다.
      correct: true
    - text: 둘 다 그대로 둡니다
      reason: >-
        안내 상자 위에서는 커서도 바뀌지 않고 아무 반응도 없는데, 바로 그
        무반응이 눌리지 않는다는 것을 배우게 하는 방법입니다.
    - text: 안내 상자를 실제로 눌리게 만듭니다
      reason: >-
        CSV 내보내기 화면이 열리게 해서, 테두리가 한 약속을 지키게 합니다.
    - text: '"고객 지원 문의"를 도움말 영역에서 가장 큰 글자로 키웁니다'
      reason: >-
        그러면 더는 지나칠 수 없습니다.
---
