---
sourceSection: 'Appropriate Feedback'
principles:
  - system-status
  - appropriate-feedback
artefact:
  en: >-
    A purchase-order detail screen in an internal procurement tool, shown at
    three moments. In the first, the buyer has changed the delivery date to
    2026-08-14 and has just pressed "Save changes"; the button is the same
    filled blue it was before the press, and "Cancel" sits beside it. In the
    second, four seconds later, the screen is identical in every part — the
    same fields, the same values, the same button in the same style, and no
    mark anywhere that anything is under way. In the third, eleven seconds
    after the press, the fields are unchanged and a small grey line has
    appeared under the buttons reading "Saved 09:41".
  ko: >-
    사내 구매 도구의 발주서 상세 화면을 세 시점에 걸쳐 보여 줍니다. 첫 시점에서
    구매 담당자는 납기일을 2026-08-14로 고친 뒤 "변경 저장"을 막 누른
    참입니다. 버튼은 누르기 전과 똑같이 파랑으로 꽉 차 있고, 옆에는 "취소"가
    있습니다. 두 번째 시점은 4초 뒤인데, 화면은 어느 한 곳도 다르지 않습니다 —
    같은 입력란, 같은 값, 같은 모양의 같은 버튼, 그리고 무언가 진행 중이라는
    표시는 어디에도 없습니다. 세 번째 시점은 누르고 11초 뒤로, 입력란은
    그대로이고 버튼 아래에 "저장됨 09:41"이라는 옅은 회색 한 줄이 새로
    나타나 있습니다.
sequence:
  - caption:
      en: The moment "Save changes" is pressed
      ko: '"변경 저장"을 누른 순간'
    screen:
      en: |-
        <div class="screen">
          <h2>Purchase order PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Supplier</span><span>Daehan Metals</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Delivery date</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Quantity</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">Save changes</button>
            <button class="btn btn--outline">Cancel</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>발주서 PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">공급사</span><span>대한금속</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">납기일</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">수량</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">변경 저장</button>
            <button class="btn btn--outline">취소</button>
          </div>
        </div>
  - caption:
      en: Four seconds after the press
      ko: 누르고 4초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Purchase order PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Supplier</span><span>Daehan Metals</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Delivery date</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Quantity</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">Save changes</button>
            <button class="btn btn--outline">Cancel</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>발주서 PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">공급사</span><span>대한금속</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">납기일</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">수량</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">변경 저장</button>
            <button class="btn btn--outline">취소</button>
          </div>
        </div>
  - caption:
      en: Eleven seconds after the press
      ko: 누르고 11초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Purchase order PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Supplier</span><span>Daehan Metals</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Delivery date</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Quantity</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">Save changes</button>
            <button class="btn btn--outline">Cancel</button>
          </div>
          <p class="note">Saved 09:41</p>
        </div>
      ko: |-
        <div class="screen">
          <h2>발주서 PO-4471</h2>
          <div class="field" style="margin-bottom:10px"><span class="field-label">공급사</span><span>대한금속</span></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">납기일</span><input class="control" value="2026-08-14"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">수량</span><input class="control" value="120"></div>
          <div class="actions">
            <button class="btn btn--blue">변경 저장</button>
            <button class="btn btn--outline">취소</button>
          </div>
          <p class="note">저장됨 09:41</p>
        </div>
prompt:
  en: >-
    Storing this change takes eleven seconds and the team cannot make it
    quicker. Which change should the screen make?
  ko: >-
    이 변경을 저장하는 데 11초가 걸리고, 팀이 그 시간을 줄일 방법은 없습니다.
    화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Put the button into a working state for as long as the save runs
      reason: >-
        Its label says it is saving and it stops accepting a second press, so
        the wait is read off the control the buyer just used.
      correct: true
    - text: Add a line confirming the change was stored once the save lands
      reason: >-
        The buyer then gets a plain statement that the delivery date is now the
        one on screen.
    - text: Cover the screen with a blocking layer until the save returns
      reason: >-
        Nothing can be touched while the work is in flight, so no half-edited
        order can be submitted.
    - text: Save each field the moment it loses focus and drop the button
      reason: >-
        There is then no press to answer for, and the buyer never waits on one.
  ko:
    - text: 저장이 도는 동안 버튼을 작업 중 상태로 둡니다
      reason: >-
        버튼 글자가 저장 중이라고 말하고 두 번째 누름을 받지 않으니, 방금 누른
        그 버튼에서 기다림이 읽힙니다.
      correct: true
    - text: 저장이 끝나면 변경이 반영됐다는 한 줄을 덧붙입니다
      reason: >-
        화면에 보이는 납기일이 이제 실제 값이라는 것을 담당자가 분명히 알게
        됩니다.
    - text: 저장이 끝날 때까지 화면 전체를 덮는 층을 씌웁니다
      reason: >-
        작업이 도는 동안에는 아무것도 건드릴 수 없으니, 반쯤 고쳐진 발주서가
        올라갈 일이 없습니다.
    - text: 입력란에서 커서가 빠질 때마다 바로 저장하고 버튼은 없앱니다
      reason: >-
        답해 줘야 할 누름 자체가 사라지니, 담당자가 무언가를 기다릴 일도
        없습니다.
---
