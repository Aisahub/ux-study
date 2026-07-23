---
sourceSection: '4: Consistency and Standards'
principles:
  - consistency
artefact:
  en: >-
    Two screens of a document tool, shown together. On the documents list,
    every row ends with a pencil icon that renames the document — the same
    pencil renames a board on the boards list and a contact on the contacts
    list. On the second screen, a document is open, and the top toolbar shows
    the same pencil icon; there it switches into the drawing tool for
    freehand annotation. Both pencils are the identical glyph at the same
    size, with no label on either.
  ko: >-
    문서 도구의 화면 두 개를 함께 보여 줍니다. 문서 목록에서는 행마다 끝에
    연필 아이콘이 있고, 누르면 문서 이름을 바꿉니다 — 같은 연필이 보드
    목록에서는 보드 이름을, 연락처 목록에서는 연락처 이름을 바꿉니다. 두
    번째 화면에는 문서가 열려 있고, 상단 도구 막대에 같은 연필 아이콘이
    있는데, 거기서는 자유롭게 손으로 그리는 주석 도구로 전환됩니다. 두 연필
    모두 같은 크기의 똑같은 모양이고, 어느 쪽에도 글자 이름은 없습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Documents list</p>
        <div class="screen">
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">Q3 forecast</span><span class="i i-pencil"></span></div></div>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">Supplier agreement</span><span class="i i-pencil"></span></div></div>
          <div class="card"><div class="actions"><span style="margin-right:auto">Packaging brief</span><span class="i i-pencil"></span></div></div>
        </div>
      </div>
      <div>
        <p class="pane-label">A document, open</p>
        <div class="screen">
          <div class="toolbar" style="margin-bottom:12px">
            <span class="i i-pencil"></span>
            <span style="color:#d1d5db">|</span>
            <span style="font-size:13px">Comment</span>
            <span style="font-size:13px">Share</span>
          </div>
          <div class="prose" style="font-size:13px;line-height:1.5">
            <p>Q3 forecast</p>
            <p>Revenue is tracking eight per cent above plan, carried mostly by the two accounts that renewed early.</p>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">문서 목록</p>
        <div class="screen">
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">3분기 전망</span><span class="i i-pencil"></span></div></div>
          <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">공급 계약서</span><span class="i i-pencil"></span></div></div>
          <div class="card"><div class="actions"><span style="margin-right:auto">패키지 기획서</span><span class="i i-pencil"></span></div></div>
        </div>
      </div>
      <div>
        <p class="pane-label">문서를 연 화면</p>
        <div class="screen">
          <div class="toolbar" style="margin-bottom:12px">
            <span class="i i-pencil"></span>
            <span style="color:#d1d5db">|</span>
            <span style="font-size:13px">댓글</span>
            <span style="font-size:13px">공유</span>
          </div>
          <div class="prose" style="font-size:13px;line-height:1.5">
            <p>3분기 전망</p>
            <p>매출은 계획보다 8% 앞서 가고 있으며, 대부분 일찍 갱신한 두 고객사가 끌어올린 결과입니다.</p>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    One glyph is carrying two meanings. Which meaning should the pencil keep?
  ko: >-
    하나의 아이콘이 두 가지 뜻을 지고 있습니다. 연필은 어느 뜻을 가져가야
    할까요?
options:
  en:
    - text: Keep the pencil for "rename" and give the drawing tool a different glyph
      reason: >-
        Three lists across this product already teach that the pencil edits a
        name, and the toolbar is the single place that contradicts them.
      correct: true
    - text: Keep the pencil for "draw" and give the lists a rename-specific glyph
      reason: >-
        A pencil literally draws, so the toolbar use is the truthful one.
    - text: Let both keep the pencil
      reason: >-
        One appears on list rows and one in a toolbar, and users read an icon
        together with where it sits.
    - text: Keep both glyphs and add a text label under each pencil
      reason: >-
        The words carry the difference the icons cannot.
  ko:
    - text: 연필은 "이름 바꾸기"로 두고 그리기 도구에 다른 아이콘을 줍니다
      reason: >-
        이 제품의 목록 세 곳이 이미 연필은 이름을 고치는 것이라고 가르쳐 왔고,
        그와 어긋나는 곳은 도구 막대 하나뿐입니다.
      correct: true
    - text: 연필은 "그리기"로 두고 목록에 이름 바꾸기 전용 아이콘을 줍니다
      reason: >-
        연필은 말 그대로 그리는 물건이니 도구 막대의 쓰임이 정직한 쪽입니다.
    - text: 둘 다 연필을 그대로 씁니다
      reason: >-
        하나는 목록의 행에, 하나는 도구 막대에 있으니, 사용자는 아이콘을 놓인
        자리와 함께 읽어 냅니다.
    - text: 아이콘은 둘 다 두고 각 연필 밑에 글자 이름을 답니다
      reason: >-
        아이콘이 못 나르는 차이는 글자가 나르게 합니다.
---
