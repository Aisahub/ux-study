---
sourceSection: 'Each User Has Their Own Mental Model'
principles:
  - mental-model
artefact:
  en: >-
    Two excerpts from usability sessions on the same file tool, shown side by
    side. Both participants were asked to put the file "Q3 budget" into the
    folder "Finance", and both dragged it there. The first said before letting
    go: "This puts a copy in Finance — the original stays where it is, like
    dropping something into a pigeonhole." The second said: "That moves it, so
    it is out of here now." Under each excerpt is what each did next: the first
    went looking for the file in its old place and could not find it; the
    second went to send a link to it and sent the old one. The tool moves the
    file.
  ko: >-
    같은 파일 도구로 진행한 사용성 테스트에서 가져온 두 사람의 발화를 나란히
    보여 줍니다. 두 참가자 모두 "3분기 예산" 파일을 "재무" 폴더에 넣어 달라는
    과제를 받았고, 둘 다 파일을 그 폴더로 끌어다 놓았습니다. 첫 번째 참가자는
    손을 떼기 전에 이렇게 말했습니다. "이러면 재무에 사본이 하나 생기고 원본은
    제자리에 남죠. 우편함에 넣는 것처럼요." 두 번째 참가자는 이렇게 말했습니다.
    "이건 옮기는 거니까 이제 여기서는 빠지겠네요." 각 발화 아래에는 그다음에
    무엇을 했는지가 적혀 있습니다. 첫 번째 참가자는 원래 자리에서 그 파일을 찾다
    끝내 못 찾았고, 두 번째 참가자는 링크를 보내려다 예전 링크를 보냈습니다. 이
    도구는 파일을 옮깁니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Participant 1</p>
        <div class="screen">
          <p>"This puts a copy in Finance — the original stays where it is, like dropping something into a pigeonhole."</p>
          <p class="note">Then: went back to the old folder to open it, and could not find it.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">Participant 2</p>
        <div class="screen">
          <p>"That moves it, so it is out of here now."</p>
          <p class="note">Then: sent a colleague a link, and sent the one from before the move.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">참가자 1</p>
        <div class="screen">
          <p>"이러면 재무에 사본이 하나 생기고 원본은 제자리에 남죠. 우편함에 넣는 것처럼요."</p>
          <p class="note">이후: 원래 폴더로 돌아가 파일을 열려 했으나 찾지 못함.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">참가자 2</p>
        <div class="screen">
          <p>"이건 옮기는 거니까 이제 여기서는 빠지겠네요."</p>
          <p class="note">이후: 동료에게 링크를 보냈는데, 옮기기 전의 링크를 보냄.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Two people, two beliefs, and the same gesture. Which change should the tool
    make?
  ko: >-
    두 사람, 두 가지 믿음, 그리고 똑같은 동작입니다. 이 도구는 무엇을 바꿔야
    할까요?
options:
  en:
    - text: Say what the drop did, on the screen, at the moment it lands — moved out of here, into Finance
      reason: >-
        No wording picked in advance can be right for both of them, and both of
        them are looking at the screen when it happens.
      correct: true
    - text: Ask on the drop whether to move or to copy
      reason: >-
        Neither belief is assumed, and each person gets the outcome they were
        already expecting.
    - text: Copy rather than move, since a copy destroys nothing
      reason: >-
        The person expecting a move finds it in the new place, and the person
        expecting a copy finds it in the old one.
    - text: Explain the behaviour in a tip the first time somebody drags a file
      reason: >-
        Everybody is told the rule once, before the first drop rather than
        after it.
  ko:
    - text: 놓는 순간 화면에서 무슨 일이 일어났는지 말해 줍니다 — 여기서 빠져 재무로 옮겨졌다고
      reason: >-
        미리 골라 둔 어떤 문구도 두 사람 모두에게 맞을 수 없고, 그 순간 두 사람
        모두 화면을 보고 있습니다.
      correct: true
    - text: 놓을 때 옮길지 복사할지 묻습니다
      reason: >-
        어느 쪽 믿음도 전제하지 않게 되고, 각자 자기가 예상한 결과를 얻습니다.
    - text: 옮기지 말고 복사하게 합니다. 복사는 아무것도 없애지 않으니까요
      reason: >-
        옮겨졌다고 여긴 사람은 새 자리에서 찾고, 복사됐다고 여긴 사람은 원래
        자리에서 찾습니다.
    - text: 파일을 처음 끌어다 놓을 때 안내 풍선으로 동작을 설명합니다
      reason: >-
        모두가 규칙을 한 번은 듣게 되고, 그것도 처음 놓은 뒤가 아니라 놓기
        전입니다.
---
