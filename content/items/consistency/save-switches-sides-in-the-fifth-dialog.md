---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    Five confirmation dialogs from one settings app, captured together. In the
    rename, timezone, password, and language dialogs, a filled "Save" button
    sits in the bottom-right corner with a plain-text "Cancel" to its left. The
    fifth dialog — the freshly redesigned notifications dialog — flips them: a
    filled "Save" sits bottom-left and "Cancel" bottom-right. Its Save button
    is otherwise identical: same size, same colour, same label.
  ko: >-
    한 설정 앱의 확인 대화상자 다섯 개를 함께 캡처한 화면입니다. 이름 변경,
    시간대, 비밀번호, 언어 대화상자에서는 채워진 "저장" 버튼이 오른쪽 아래에
    있고 그 왼쪽에 글자만 있는 "취소"가 붙어 있습니다. 새로 디자인한 다섯
    번째 알림 대화상자만 둘을 뒤집어 놓아, 채워진 "저장"이 왼쪽 아래에,
    "취소"가 오른쪽 아래에 있습니다. 저장 버튼 자체는 크기도 색도 이름도 다른
    넷과 똑같습니다.
screen:
  en: |-
    <div class="split split--six">
      <div><div class="dialog"><p class="dialog-title">Rename workspace</p><input class="control" value="Aisahub" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--blue">Save</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">Time zone</p><input class="control" value="Asia/Seoul" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--blue">Save</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">Password</p><input class="control" value="••••••••" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--blue">Save</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">Language</p><input class="control" value="English" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--blue">Save</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">Notifications</p><input class="control" value="Mentions only" style="width:100%"><div class="dialog-foot"><button class="btn btn--blue">Save</button><span class="btn btn--ghost" style="margin-left:auto">Cancel</span></div></div></div>
    </div>
  ko: |-
    <div class="split split--six">
      <div><div class="dialog"><p class="dialog-title">워크스페이스 이름</p><input class="control" value="Aisahub" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--blue">저장</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">시간대</p><input class="control" value="Asia/Seoul" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--blue">저장</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">비밀번호</p><input class="control" value="••••••••" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--blue">저장</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">언어</p><input class="control" value="한국어" style="width:100%"><div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--blue">저장</button></div></div></div>
      <div><div class="dialog"><p class="dialog-title">알림</p><input class="control" value="멘션만" style="width:100%"><div class="dialog-foot"><button class="btn btn--blue">저장</button><span class="btn btn--ghost" style="margin-left:auto">취소</span></div></div></div>
    </div>
prompt:
  en: >-
    Where should "Save" sit in the notifications dialog, and on what grounds?
  ko: >-
    알림 대화상자의 "저장"은 어디에 있어야 하고, 그 근거는 무엇일까요?
options:
  en:
    - text: Move Save to the bottom-right
      reason: >-
        Four dialogs in this same app have already trained the user's hand to
        go there, and the fifth breaks a habit the app itself built.
      correct: true
    - text: Leave Save at the bottom-left
      reason: >-
        The eye starts reading on the left, so the redesign puts the primary
        action where it is found first.
    - text: Keep the redesign and flip the other four later
      reason: >-
        Note them as the ones to change whenever they get their own redesign.
    - text: Either side works
      reason: >-
        The button is filled and the same colour in all five dialogs, so users
        will find it by its look rather than its position.
  ko:
    - text: '"저장"을 오른쪽 아래로 옮깁니다'
      reason: >-
        같은 앱의 대화상자 넷이 이미 사용자의 손을 그 자리로 길들여 놓았고,
        다섯 번째 대화상자는 앱이 스스로 만든 습관을 깨고 있습니다.
      correct: true
    - text: '"저장"을 왼쪽 아래에 그대로 둡니다'
      reason: >-
        시선은 왼쪽에서 읽기 시작하므로, 새 디자인이 주요 동작을 가장 먼저
        발견되는 자리에 둔 것입니다.
    - text: 새 디자인은 두고 나머지 넷을 나중에 뒤집습니다
      reason: >-
        각자 재설계할 때 바꿔야 할 대상으로 기록해 둡니다.
    - text: 어느 쪽이든 상관없습니다
      reason: >-
        다섯 대화상자 모두 버튼이 같은 색으로 채워져 있으니, 사용자는 위치가
        아니라 생김새로 버튼을 찾습니다.
---
