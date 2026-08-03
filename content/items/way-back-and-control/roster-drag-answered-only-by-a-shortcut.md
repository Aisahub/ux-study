---
sourceSection: Ensure Undo Is Discoverable
principles:
  - undo
  - signifier
artefact:
  en: >-
    Two states of a shift roster in a scheduling tool. Both are headed "Shift
    roster — week 32" and both carry the same strip of controls: "Print",
    "Export", and a blue "Publish" pushed to the right. Under it a table runs
    Staff, Mon, Tue, Wed, Thu. In the first state Y. Jung has a 09:00–17:00
    shift under Tue and nothing else; T. Kang has 13:00–21:00 under Mon and
    09:00–17:00 under Thu. In the second state Y. Jung's shift sits under Wed
    instead, the strip of controls is unchanged, and a dark message under the
    table reads "Roster updated" with nothing in it to press.
  ko: >-
    근무 편성 도구의 시프트 표 두 상태입니다. 둘 다 제목은
    "시프트 편성 — 32주차"이고, 컨트롤 줄도 같습니다 — "인쇄", "내보내기", 그리고 오른쪽 끝으로 밀려 있는
    파란 "게시". 그 아래 표는 직원, 월, 화, 수, 목 순서입니다. 첫 번째 상태에서
    정유나는 화요일에 09:00–17:00 하나뿐이고, 강태오는 월요일에 13:00–21:00,
    목요일에 09:00–17:00이 있습니다. 두 번째 상태에서는 정유나의 시프트가 수요일로
    옮겨져 있고, 컨트롤 줄은 그대로이며, 표 아래 짙은 색 메시지에 "편성이
    갱신되었습니다"라고만 적혀 있을 뿐 누를 것은 없습니다.
sequence:
  - caption:
      en: The roster before Jung's Tuesday shift is dragged onto Wednesday
      ko: 정유나의 화요일 시프트를 수요일로 끌어다 놓기 전
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Shift roster — week 32</h1>
            <div class="toolbar"><button class="btn btn--hairline">Print</button><button class="btn btn--hairline">Export</button><button class="btn btn--blue" style="margin-left:auto">Publish</button></div>
            <div class="scroller">
              <table class="table">
                <tr><th>Staff</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th></tr>
                <tr><td>Y. Jung</td><td>—</td><td><span class="chip">09:00–17:00</span></td><td>—</td><td>—</td></tr>
                <tr><td>T. Kang</td><td><span class="chip">13:00–21:00</span></td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td></tr>
              </table>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>시프트 편성 — 32주차</h1>
            <div class="toolbar"><button class="btn btn--hairline">인쇄</button><button class="btn btn--hairline">내보내기</button><button class="btn btn--blue" style="margin-left:auto">게시</button></div>
            <div class="scroller">
              <table class="table">
                <tr><th>직원</th><th>월</th><th>화</th><th>수</th><th>목</th></tr>
                <tr><td>정유나</td><td>—</td><td><span class="chip">09:00–17:00</span></td><td>—</td><td>—</td></tr>
                <tr><td>강태오</td><td><span class="chip">13:00–21:00</span></td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td></tr>
              </table>
            </div>
          </div>
        </div>
  - caption:
      en: Immediately after the drag
      ko: 끌어다 놓은 직후
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Shift roster — week 32</h1>
            <div class="toolbar"><button class="btn btn--hairline">Print</button><button class="btn btn--hairline">Export</button><button class="btn btn--blue" style="margin-left:auto">Publish</button></div>
            <div class="scroller">
              <table class="table">
                <tr><th>Staff</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th></tr>
                <tr><td>Y. Jung</td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td><td>—</td></tr>
                <tr><td>T. Kang</td><td><span class="chip">13:00–21:00</span></td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td></tr>
              </table>
            </div>
            <div class="toast toast--plain">Roster updated</div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>시프트 편성 — 32주차</h1>
            <div class="toolbar"><button class="btn btn--hairline">인쇄</button><button class="btn btn--hairline">내보내기</button><button class="btn btn--blue" style="margin-left:auto">게시</button></div>
            <div class="scroller">
              <table class="table">
                <tr><th>직원</th><th>월</th><th>화</th><th>수</th><th>목</th></tr>
                <tr><td>정유나</td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td><td>—</td></tr>
                <tr><td>강태오</td><td><span class="chip">13:00–21:00</span></td><td>—</td><td>—</td><td><span class="chip">09:00–17:00</span></td></tr>
              </table>
            </div>
            <div class="toast toast--plain">편성이 갱신되었습니다</div>
          </div>
        </div>
prompt:
  en: >-
    A dragged shift can be put back with Ctrl+Z, and always could. Which change
    should this roster get?
  ko: >-
    끌어다 놓은 시프트는 Ctrl+Z로 되돌릴 수 있고, 처음부터 그랬습니다. 이 편성
    화면에 어떤 변화가 필요할까요?
options:
  en:
    - text: Write the shortcut into the help page and the welcome tour
      reason: >-
        It is then set down where a new joiner is already reading, and nothing
        on the roster has to change.
    - text: Hold the message on screen longer so it is not missed
      reason: >-
        It clears after three seconds, and someone whose eyes are on the grid
        can miss it entirely.
    - text: Put an Undo control into the message that already appears after a change
      reason: >-
        The way back is then offered at the moment it is wanted, by the one
        thing on screen that knows a change has just happened.
      correct: true
    - text: Ask the user to confirm each drag before it takes effect
      reason: >-
        A shift then cannot land on the wrong day by accident in the first
        place.
  ko:
    - text: 단축키를 도움말 페이지와 첫 사용 안내에 적어 둡니다
      reason: >-
        새로 온 사람이 어차피 읽는 자리에 적히고, 편성 화면은 손댈 것이 없습니다.
    - text: 메시지가 화면에 더 오래 머물게 합니다
      reason: >-
        3초면 사라지는 터라 표를 들여다보고 있던 사람은 통째로 놓칠 수 있습니다.
    - text: 변경 뒤에 이미 뜨는 그 메시지 안에 실행 취소를 넣습니다
      reason: >-
        되돌아갈 길이 필요한 바로 그 순간에, 방금 무언가 바뀌었다는 것을 아는 화면
        속 유일한 요소가 그 길을 내밉니다.
      correct: true
    - text: 끌어다 놓을 때마다 확인을 받고 나서 반영합니다
      reason: >-
        애초에 시프트가 엉뚱한 요일에 떨어지는 일 자체가 없어집니다.
---
