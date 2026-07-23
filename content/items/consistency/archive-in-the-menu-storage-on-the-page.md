---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    One screen of a note-taking app. The sidebar menu lists "Inbox", "Pinned"
    and "Storage". Opening the third one shows a page whose heading reads
    "Archive". On that same page, every note row carries an "Unarchive"
    button, the empty-state text elsewhere in the app reads "Nothing archived
    yet", the search bar offers a filter chip labelled "Archived", and the
    hover menu on every note in the Inbox says "Archive". The sidebar's
    "Storage" is the only place that word appears.
  ko: >-
    노트 앱의 화면 하나입니다. 사이드바 메뉴에는 "받은함", "고정됨",
    "저장소"가 있습니다. 세 번째를 열면 나오는 페이지의 제목은 "보관함"
    입니다. 그 페이지의 노트 행마다 "보관 해제" 버튼이 붙어 있고, 앱의 빈
    화면 문구는 "아직 보관한 노트가 없습니다"이며, 검색창에는 "보관됨" 필터
    칩이 있고, 받은함의 노트마다 뜨는 메뉴에는 "보관"이 있습니다. "저장소"
    라는 말이 나오는 곳은 사이드바 하나뿐입니다.
screen:
  en: |-
    <div class="screen">
      <div class="app">
        <div class="side">
          <div class="side-item">Inbox</div>
          <div class="side-item">Pinned</div>
          <div class="side-item side-item--on">Storage</div>
        </div>
        <div>
          <h2>Archive</h2>
          <p style="margin:0 0 12px"><input class="control" value="" placeholder="Search notes" style="width:180px"> <span class="chip">Archived</span></p>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">Q3 planning notes</span><button class="btn btn--hairline">Unarchive</button></div></div>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">Supplier call — 2 July</span><button class="btn btn--hairline">Unarchive</button></div></div>
          <div class="card"><div class="actions"><span style="margin-right:auto">Packaging ideas</span><button class="btn btn--hairline">Unarchive</button></div></div>
          <p class="note">Nothing archived yet — shown when this list is empty.</p>
        </div>
      </div>
      <div style="border-top:1px solid #eceef1;margin-top:16px;padding-top:14px">
        <p class="pane-label">Inbox — the menu on every note</p>
        <div class="menu" style="width:150px">
          <div class="menu-item">Pin</div>
          <div class="menu-item">Duplicate</div>
          <div class="menu-item">Archive</div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <div class="app">
        <div class="side">
          <div class="side-item">받은함</div>
          <div class="side-item">고정됨</div>
          <div class="side-item side-item--on">저장소</div>
        </div>
        <div>
          <h2>보관함</h2>
          <p style="margin:0 0 12px"><input class="control" value="" placeholder="노트 검색" style="width:180px"> <span class="chip">보관됨</span></p>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">3분기 계획 메모</span><button class="btn btn--hairline">보관 해제</button></div></div>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">공급사 통화 — 7월 2일</span><button class="btn btn--hairline">보관 해제</button></div></div>
          <div class="card"><div class="actions"><span style="margin-right:auto">패키지 아이디어</span><button class="btn btn--hairline">보관 해제</button></div></div>
          <p class="note">아직 보관한 노트가 없습니다 — 목록이 비었을 때 나오는 문구입니다.</p>
        </div>
      </div>
      <div style="border-top:1px solid #eceef1;margin-top:16px;padding-top:14px">
        <p class="pane-label">받은함 — 노트마다 뜨는 메뉴</p>
        <div class="menu" style="width:150px">
          <div class="menu-item">고정</div>
          <div class="menu-item">복제</div>
          <div class="menu-item">보관</div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    The menu and the page it opens disagree on the name. Which name should
    both use?
  ko: >-
    메뉴와 그 메뉴가 여는 페이지가 서로 다른 이름을 씁니다. 어느 이름으로
    맞춰야 할까요?
options:
  en:
    - text: Rename the sidebar entry to "Archive"
      reason: >-
        The app's own buttons, filters and empty states already speak that word
        everywhere; the sidebar is the single place out of step.
      correct: true
    - text: Rename the page heading to "Storage"
      reason: >-
        A place in a menu should be named as a noun for a location, and
        "Storage" describes where the notes are better than a verb does.
    - text: Keep both names
      reason: >-
        A menu entry and a page heading do different jobs, so a difference
        between them costs the user nothing.
    - text: Rename both to a fresh third term such as "Vault"
      reason: >-
        Then neither of the two competing names is seen to lose.
  ko:
    - text: 사이드바 항목을 "보관함"으로 바꿉니다
      reason: >-
        앱의 버튼, 필터, 빈 화면 문구가 이미 어디서나 "보관"이라는 말을 쓰고
        있습니다. 어긋난 곳은 사이드바 하나뿐입니다.
      correct: true
    - text: 페이지 제목을 "저장소"로 바꿉니다
      reason: >-
        메뉴에 놓이는 항목은 장소를 가리키는 이름이어야 하고, 노트가 어디에
        있는지는 "저장소"가 더 정확하게 설명합니다.
    - text: 두 이름을 그대로 둡니다
      reason: >-
        메뉴 항목과 페이지 제목은 하는 일이 다르니, 둘이 달라도 사용자가
        치르는 대가는 없습니다.
    - text: 둘 다 "금고" 같은 제3의 새 이름으로 바꿉니다
      reason: >-
        그러면 경쟁하던 두 이름 중 어느 쪽도 진 것으로 보이지 않습니다.
---
