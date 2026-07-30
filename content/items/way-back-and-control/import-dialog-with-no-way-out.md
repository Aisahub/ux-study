---
sourceSection: Make Exit Links Easily Discoverable
principles:
  - emergency-exit
  - signifier
artefact:
  en: >-
    A dialog in a customer-records tool, titled "Import contacts". Under the
    title one line reads "Choose a CSV file to add contacts to Sales — North."
    Below it a File row shows a grey "No file chosen" box beside a faint
    "Choose…" button. Under that, a blue underlined link reads "Which columns
    are required?". The footer holds one control, on the right: a grey-on-grey
    "Continue". The title row carries no close mark, and there is no Cancel
    anywhere in the dialog.
  ko: >-
    고객 정보 도구의 "연락처 가져오기" 대화상자입니다. 제목 아래에 "영업 — 북부에
    추가할 CSV 파일을 고르세요."라는 한 줄이 있습니다. 그 아래 파일 줄에는 "선택된
    파일 없음"이라고 적힌 회색 상자와 흐린 "파일 선택…" 버튼이 나란히 있습니다.
    그 밑에는 밑줄 친 파란 링크로 "어떤 열이 필요한가요?"가 있습니다. 바닥에는
    오른쪽에 컨트롤이 하나뿐입니다 — 회색 바탕에 회색 글자인 "계속". 제목 줄에는
    닫기 표시가 없고, 대화상자 어디에도 취소가 없습니다.
screen:
  en: |-
    <div class="screen">
      <div class="dialog" style="max-width:420px">
        <p class="dialog-title">Import contacts</p>
        <p>Choose a CSV file to add contacts to Sales — North.</p>
        <div class="field">
          <span class="field-label">File</span>
          <span class="control control--empty">No file chosen</span>
          <span class="btn btn--hairline">Choose…</span>
        </div>
        <p class="note"><span class="link">Which columns are required?</span></p>
        <div class="dialog-foot actions--end">
          <button class="btn btn--quiet">Continue</button>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <div class="dialog" style="max-width:420px">
        <p class="dialog-title">연락처 가져오기</p>
        <p>영업 — 북부에 추가할 CSV 파일을 고르세요.</p>
        <div class="field">
          <span class="field-label">파일</span>
          <span class="control control--empty">선택된 파일 없음</span>
          <span class="btn btn--hairline">파일 선택…</span>
        </div>
        <p class="note"><span class="link">어떤 열이 필요한가요?</span></p>
        <div class="dialog-foot actions--end">
          <button class="btn btn--quiet">계속</button>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What should change about this dialog?
  ko: >-
    이 대화상자에서 무엇을 바꿔야 할까요?
options:
  en:
    - text: Put a Cancel beside Continue, and a close mark in the title row
      reason: >-
        Someone who opened this by mistake can then leave from inside the
        dialog, without first finishing what it is asking of them.
      correct: true
    - text: Turn Continue on so the dialog can be stepped past
      reason: >-
        A user who picked no file can move on, and either way the dialog is
        behind them.
    - text: Leave it to the Escape key, and say so in the help link
      reason: >-
        Every dialog in this tool already closes on Escape, so the way out
        exists and only needs writing down.
    - text: Ask for confirmation before the import begins
      reason: >-
        It gives the user one more moment to notice they are somewhere they did
        not mean to be.
  ko:
    - text: '"계속" 옆에 "취소"를 두고, 제목 줄에 닫기 표시를 답니다'
      reason: >-
        잘못 열었더라도 대화상자가 요구하는 일을 먼저 끝내지 않고, 그 안에서 바로
        빠져나올 수 있습니다.
      correct: true
    - text: '"계속"을 켜서 대화상자를 지나갈 수 있게 합니다'
      reason: >-
        파일을 고르지 않은 사용자도 다음으로 넘어갈 수 있고, 어느 쪽이든
        대화상자는 뒤로 물러납니다.
    - text: Esc 키에 맡기고, 도움말 링크에 그 사실을 적어 둡니다
      reason: >-
        이 도구의 대화상자는 이미 전부 Esc로 닫히니, 빠져나갈 길은 있고 적어 두기만
        하면 됩니다.
    - text: 가져오기가 시작되기 전에 확인을 한 번 받습니다
      reason: >-
        들어올 생각이 없던 자리라는 것을 알아챌 순간을 한 번 더 줍니다.
---
