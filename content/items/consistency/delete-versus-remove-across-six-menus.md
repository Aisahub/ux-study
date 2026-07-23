---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    Six row-level context menus from one project tool, captured side by side.
    The menus come from the task list, the file list, the comment thread, the
    tag manager, and the member list — and each of those five ends with
    "Delete" beside a trash-can icon. The sixth menu, from the recently added
    automations screen, ends with "Remove" beside the same trash-can icon.
    All six actions do the same thing: the row is gone for everyone.
  ko: >-
    한 프로젝트 도구에서 행마다 열리는 컨텍스트 메뉴 여섯 개를 나란히 캡처한
    화면입니다. 할 일 목록, 파일 목록, 댓글 스레드, 태그 관리, 멤버 목록에서
    가져온 다섯 개의 메뉴는 모두 휴지통 아이콘 옆에 "삭제"로 끝납니다. 최근에
    추가된 자동화 화면의 여섯 번째 메뉴만 같은 휴지통 아이콘 옆에 "제거"로
    끝납니다. 여섯 동작이 하는 일은 전부 같습니다. 그 행이 모두에게서
    사라집니다.
screen:
  en: |-
    <div class="split split--six">
      <div><p class="pane-label">Task list</p><div class="menu"><div class="menu-item">Open</div><div class="menu-item">Duplicate</div><div class="menu-item"><span class="i i-trash"></span>Delete</div></div></div>
      <div><p class="pane-label">File list</p><div class="menu"><div class="menu-item">Download</div><div class="menu-item">Rename</div><div class="menu-item"><span class="i i-trash"></span>Delete</div></div></div>
      <div><p class="pane-label">Comment thread</p><div class="menu"><div class="menu-item">Reply</div><div class="menu-item">Copy link</div><div class="menu-item"><span class="i i-trash"></span>Delete</div></div></div>
      <div><p class="pane-label">Tag manager</p><div class="menu"><div class="menu-item">Rename</div><div class="menu-item">Merge</div><div class="menu-item"><span class="i i-trash"></span>Delete</div></div></div>
      <div><p class="pane-label">Member list</p><div class="menu"><div class="menu-item">View profile</div><div class="menu-item">Change role</div><div class="menu-item"><span class="i i-trash"></span>Delete</div></div></div>
      <div><p class="pane-label">Automations</p><div class="menu"><div class="menu-item">Run now</div><div class="menu-item">Duplicate</div><div class="menu-item"><span class="i i-trash"></span>Remove</div></div></div>
    </div>
  ko: |-
    <div class="split split--six">
      <div><p class="pane-label">할 일 목록</p><div class="menu"><div class="menu-item">열기</div><div class="menu-item">복제</div><div class="menu-item"><span class="i i-trash"></span>삭제</div></div></div>
      <div><p class="pane-label">파일 목록</p><div class="menu"><div class="menu-item">내려받기</div><div class="menu-item">이름 변경</div><div class="menu-item"><span class="i i-trash"></span>삭제</div></div></div>
      <div><p class="pane-label">댓글 스레드</p><div class="menu"><div class="menu-item">답글</div><div class="menu-item">링크 복사</div><div class="menu-item"><span class="i i-trash"></span>삭제</div></div></div>
      <div><p class="pane-label">태그 관리</p><div class="menu"><div class="menu-item">이름 변경</div><div class="menu-item">병합</div><div class="menu-item"><span class="i i-trash"></span>삭제</div></div></div>
      <div><p class="pane-label">멤버 목록</p><div class="menu"><div class="menu-item">프로필 보기</div><div class="menu-item">역할 변경</div><div class="menu-item"><span class="i i-trash"></span>삭제</div></div></div>
      <div><p class="pane-label">자동화</p><div class="menu"><div class="menu-item">지금 실행</div><div class="menu-item">복제</div><div class="menu-item"><span class="i i-trash"></span>제거</div></div></div>
    </div>
prompt:
  en: >-
    The two labels cannot both stay. Which one wins, and why?
  ko: >-
    두 이름을 둘 다 둘 수는 없습니다. 어느 쪽으로 통일해야 하고, 그 이유는
    무엇일까요?
options:
  en:
    - text: '"Delete" wins'
      reason: >-
        Five of the six menus already say it, so every user of this tool has
        been taught that word; the one new menu should fall in line.
      correct: true
    - text: '"Remove" wins, as the newest work'
      reason: >-
        The automations screen is the team's most recent work, so it reflects
        the naming direction the product is heading in.
    - text: '"Remove" wins, as the gentler word'
      reason: >-
        It sounds less alarming than "Delete", and a gentler word makes a
        destructive action feel safer to users.
    - text: Neither changes
      reason: >-
        The trash-can icon is identical in all six menus, and the icon carries
        the meaning regardless of the word.
  ko:
    - text: '"삭제"로 통일합니다'
      reason: >-
        여섯 메뉴 중 다섯이 이미 그 이름을 쓰고 있어서 이 도구의 사용자는 전부
        그 단어로 배웠습니다. 새로 생긴 메뉴 하나가 따라와야 합니다.
      correct: true
    - text: '"제거"로 통일합니다 — 가장 최근 작업이므로'
      reason: >-
        자동화 화면이 팀의 가장 최근 작업이므로, 제품이 앞으로 나아갈 이름
        방향을 반영한 쪽은 그쪽입니다.
    - text: '"제거"로 통일합니다 — 어감이 부드러우므로'
      reason: >-
        "삭제"보다 어감이 부드러워서, 파괴적인 동작을 사용자에게 덜 위협적으로
        느끼게 해 줍니다.
    - text: 둘 다 바꾸지 않습니다
      reason: >-
        여섯 메뉴 모두 휴지통 아이콘이 똑같으니, 단어가 무엇이든 의미는
        아이콘이 전달합니다.
---
