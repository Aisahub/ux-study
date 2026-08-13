---
sourceSection: 'Mental-Model Inertia'
principles:
  - model-inertia
artefact:
  en: >-
    A page of support messages received in the two weeks after a document tool
    replaced its Save button with saving on every keystroke. Five messages are
    listed with their dates. They read: "Where has Save gone? I daren't close
    the tab."; "The Save button is broken — nothing happens when I press
    Ctrl-S."; "I have been copying my work into an email at the end of every
    day since the update, just in case."; "Is my document saved? I cannot tell
    and there is nobody to ask on a Sunday."; "Please put Save back. I do not
    trust it." Above the list, a counter reads "37 messages of this kind, 14
    days". The tool does in fact save every keystroke, and has not lost a
    document.
  ko: >-
    문서 도구가 저장 버튼을 없애고 글자를 칠 때마다 저장되도록 바꾼 뒤 2주 동안
    들어온 고객 문의를 모아 놓은 화면입니다. 날짜와 함께 다섯 건이 나열되어
    있습니다. "저장 버튼은 어디로 갔나요? 무서워서 탭을 못 닫겠습니다.",
    "저장 버튼이 고장 났습니다 — Ctrl-S를 눌러도 아무 일도 없습니다.",
    "업데이트 이후로 매일 퇴근 전에 작업물을 메일로 복사해 두고 있습니다. 혹시
    몰라서요.", "제 문서가 저장된 건가요? 알 수가 없고 일요일에는 물어볼 데도
    없습니다.", "저장 버튼을 돌려주세요. 못 믿겠습니다." 목록 위에는 "같은 종류의
    문의 37건, 14일간"이라고 적혀 있습니다. 이 도구는 실제로 글자마다 저장하고
    있으며, 문서를 잃은 적도 없습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Support messages since the release</h2>
      <p class="muted" style="margin:0 0 12px">37 messages of this kind, 14 days</p>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>Date</th><th>What they wrote</th></tr></thead>
          <tbody>
            <tr><td>2 Mar</td><td>Where has Save gone? I daren't close the tab.</td></tr>
            <tr><td>3 Mar</td><td>The Save button is broken — nothing happens when I press Ctrl-S.</td></tr>
            <tr><td>6 Mar</td><td>I have been copying my work into an email every evening, just in case.</td></tr>
            <tr><td>9 Mar</td><td>Is my document saved? I cannot tell and there is nobody to ask on a Sunday.</td></tr>
            <tr><td>13 Mar</td><td>Please put Save back. I do not trust it.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>업데이트 이후 들어온 문의</h2>
      <p class="muted" style="margin:0 0 12px">같은 종류의 문의 37건, 14일간</p>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>날짜</th><th>문의 내용</th></tr></thead>
          <tbody>
            <tr><td>3월 2일</td><td>저장 버튼은 어디로 갔나요? 무서워서 탭을 못 닫겠습니다.</td></tr>
            <tr><td>3월 3일</td><td>저장 버튼이 고장 났습니다 — Ctrl-S를 눌러도 아무 일도 없습니다.</td></tr>
            <tr><td>3월 6일</td><td>매일 저녁 작업물을 메일로 복사해 두고 있습니다. 혹시 몰라서요.</td></tr>
            <tr><td>3월 9일</td><td>제 문서가 저장된 건가요? 알 수가 없고 일요일에는 물어볼 데도 없습니다.</td></tr>
            <tr><td>3월 13일</td><td>저장 버튼을 돌려주세요. 못 믿겠습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
prompt:
  en: >-
    Saving on every keystroke is the better design and the team is not going
    back to a Save button. What should they do about these messages?
  ko: >-
    글자마다 저장하는 쪽이 더 나은 설계이고, 팀은 저장 버튼으로 돌아갈 생각이
    없습니다. 이 문의들에 대해 무엇을 해야 할까요?
options:
  en:
    - text: Show the saved state continuously on the document, and let Ctrl-S answer by confirming it
      reason: >-
        The belief being defended is that saving is something you do and then
        know about, and the second half of it is the half nothing answers.
      correct: true
    - text: Reply to each message explaining that the tool saves automatically now
      reason: >-
        Everybody who wrote in is told the truth about the tool, by a person,
        in the place they raised it.
    - text: Add a one-time notice on next open, explaining the change and where Save went
      reason: >-
        Every user is reached once, at the moment they next meet the tool, and
        the change is explained before it is met.
    - text: Wait — the messages will stop as people get used to the new behaviour
      reason: >-
        Nothing is being lost, and a belief with nothing to feed it tends to
        fade on its own.
  ko:
    - text: 저장 상태를 문서에 계속 띄워 두고, Ctrl-S를 누르면 저장됐다고 확인해 주게 합니다
      reason: >-
        여기서 지켜지고 있는 믿음은 저장이란 내가 하고 나서 알게 되는 일이라는
        것인데, 그 뒷부분에 답하는 것이 화면에 하나도 없습니다.
      correct: true
    - text: 문의마다 이제 자동으로 저장된다고 답변합니다
      reason: >-
        문의를 보낸 사람 모두가 사람의 답으로, 자기가 물어본 자리에서 사실을 알게
        됩니다.
    - text: 다음에 열 때 한 번 뜨는 안내로 바뀐 점과 저장 버튼의 행방을 설명합니다
      reason: >-
        모든 사용자가 도구를 다시 만나는 그 순간에 한 번씩, 겪기 전에 설명을
        듣게 됩니다.
    - text: 기다립니다 — 새 동작에 익숙해지면 문의도 줄어듭니다
      reason: >-
        실제로 잃는 것이 없고, 먹이가 없는 믿음은 대개 저절로 옅어집니다.
---
