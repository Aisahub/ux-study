---
sourceSection: 'What Are Mental Models?'
principles:
  - mental-model
artefact:
  en: >-
    A support-ticket reply window inside an agent's console, at three moments.
    In the first, four paragraphs of a reply have been typed and the window
    carries a small × in its top-right corner, a "Send" button and a "Save
    draft" button. In the second, the × has just been pressed. In the third,
    the window is gone, the ticket list is showing, the ticket's row reads "No
    reply yet", and the typed reply is not on the screen or in the drafts
    counter above the list, which still reads "Drafts 0".
  ko: >-
    상담원 콘솔 안에 뜨는 문의 답변 창을 세 시점에 걸쳐 보여 줍니다. 첫 시점에는
    답변을 네 문단쯤 입력해 둔 상태이고, 창 오른쪽 위에는 작은 ×가 있으며
    "보내기"와 "임시 저장" 버튼이 있습니다. 두 번째 시점은 ×를 막 누른
    참입니다. 세 번째 시점에서 창은 사라졌고 문의 목록이 보이며, 그 문의의
    줄에는 "답변 없음"이라고 적혀 있고, 입력해 둔 답변은 화면에도 없고 목록 위의
    임시 저장 개수에도 없습니다. 그 개수는 여전히 "임시 저장 0"입니다.
sequence:
  - caption:
      en: Four paragraphs into the reply
      ko: 답변을 네 문단쯤 쓴 상태
    screen:
      en: |-
        <div class="screen">
          <div class="dialog">
            <div class="actions" style="justify-content:space-between">
              <span class="dialog-title">Reply to #48120</span>
              <span class="link--bare">×</span>
            </div>
            <p class="muted" style="margin:0 0 8px">Thank you for sending the photographs. I have looked at the serial number on the base plate and I can confirm this unit is still inside its warranty…</p>
            <div class="dialog-foot">
              <button class="btn btn--blue">Send</button>
              <button class="btn btn--hairline">Save draft</button>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="dialog">
            <div class="actions" style="justify-content:space-between">
              <span class="dialog-title">#48120 답변</span>
              <span class="link--bare">×</span>
            </div>
            <p class="muted" style="margin:0 0 8px">사진 보내 주셔서 감사합니다. 바닥판의 일련번호를 확인했고, 이 제품은 아직 보증 기간 안에 있는 것으로 확인됩니다…</p>
            <div class="dialog-foot">
              <button class="btn btn--blue">보내기</button>
              <button class="btn btn--hairline">임시 저장</button>
            </div>
          </div>
        </div>
  - caption:
      en: The moment the × is pressed
      ko: ×를 누른 순간
    screen:
      en: |-
        <div class="screen">
          <div class="dialog">
            <div class="actions" style="justify-content:space-between">
              <span class="dialog-title">Reply to #48120</span>
              <span class="link--bare" style="outline:2px solid #2563eb; border-radius:4px; padding:0 4px">×</span>
            </div>
            <p class="muted" style="margin:0 0 8px">Thank you for sending the photographs. I have looked at the serial number on the base plate and I can confirm this unit is still inside its warranty…</p>
            <div class="dialog-foot">
              <button class="btn btn--blue">Send</button>
              <button class="btn btn--hairline">Save draft</button>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="dialog">
            <div class="actions" style="justify-content:space-between">
              <span class="dialog-title">#48120 답변</span>
              <span class="link--bare" style="outline:2px solid #2563eb; border-radius:4px; padding:0 4px">×</span>
            </div>
            <p class="muted" style="margin:0 0 8px">사진 보내 주셔서 감사합니다. 바닥판의 일련번호를 확인했고, 이 제품은 아직 보증 기간 안에 있는 것으로 확인됩니다…</p>
            <div class="dialog-foot">
              <button class="btn btn--blue">보내기</button>
              <button class="btn btn--hairline">임시 저장</button>
            </div>
          </div>
        </div>
  - caption:
      en: The console immediately afterwards
      ko: 그 직후의 콘솔
    screen:
      en: |-
        <div class="screen">
          <h2>Open tickets</h2>
          <p class="muted" style="margin:0 0 12px">Drafts 0</p>
          <table class="table">
            <thead><tr><th>Ticket</th><th>Customer</th><th>State</th></tr></thead>
            <tbody>
              <tr><td>#48119</td><td>R. Okafor</td><td>Replied</td></tr>
              <tr><td>#48120</td><td>M. Lindqvist</td><td>No reply yet</td></tr>
              <tr><td>#48121</td><td>S. Prasetyo</td><td>No reply yet</td></tr>
            </tbody>
          </table>
        </div>
      ko: |-
        <div class="screen">
          <h2>처리 중인 문의</h2>
          <p class="muted" style="margin:0 0 12px">임시 저장 0</p>
          <table class="table">
            <thead><tr><th>문의</th><th>고객</th><th>상태</th></tr></thead>
            <tbody>
              <tr><td>#48119</td><td>오○○</td><td>답변 완료</td></tr>
              <tr><td>#48120</td><td>린드크비스트</td><td>답변 없음</td></tr>
              <tr><td>#48121</td><td>프라세티오</td><td>답변 없음</td></tr>
            </tbody>
          </table>
        </div>
prompt:
  en: >-
    The agent pressed × meaning to look something up in the ticket behind the
    window. Which change should the console make?
  ko: >-
    이 상담원이 ×를 누른 이유는 창 뒤의 문의 내용을 잠깐 확인하려던 것이었습니다.
    이 콘솔은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Let × close the window and keep the reply, and give throwing it away a control that says so
      reason: >-
        A cross in a corner is understood everywhere as putting a window away,
        and nowhere as destroying what is inside it.
      correct: true
    - text: Ask for confirmation when × is pressed with text in the box
      reason: >-
        Nothing is lost without the agent agreeing to it, and the question
        arrives only when there is something to lose.
    - text: Save a draft automatically when × is pressed, and say so in the drafts counter
      reason: >-
        The work survives the press whatever the agent meant by it, and the
        counter says where it went.
    - text: Remove the × and leave Send and Save draft as the only ways out of the window
      reason: >-
        Every remaining way out of the window keeps the reply, so no exit can
        destroy it.
  ko:
    - text: ×는 창을 닫고 답변은 남기게 하고, 버리는 동작에는 그렇게 말하는 버튼을 따로 둡니다
      reason: >-
        모서리의 ×는 어디서나 창을 치워 두는 뜻으로 통하고, 안에 든 것을
        없앤다는 뜻으로 통하는 곳은 없습니다.
      correct: true
    - text: 입력한 내용이 있는 상태에서 ×를 누르면 확인을 묻습니다
      reason: >-
        상담원이 그러겠다고 하기 전에는 잃는 것이 없고, 물음도 잃을 것이 있을
        때만 뜹니다.
    - text: ×를 누르면 자동으로 임시 저장하고, 임시 저장 개수에 그렇게 표시합니다
      reason: >-
        누른 뜻이 무엇이었든 작업은 살아남고, 어디로 갔는지는 개수가 알려 줍니다.
    - text: ×를 없애고 보내기와 임시 저장만 창을 빠져나가는 길로 남깁니다
      reason: >-
        남는 모든 출구가 답변을 지키므로, 어떤 출구로 나가도 없어지지 않습니다.
---
