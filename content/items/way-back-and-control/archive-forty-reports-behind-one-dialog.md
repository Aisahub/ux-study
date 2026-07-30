---
sourceSection: Support Undo
principles:
  - undo
artefact:
  en: >-
    Three states of a reporting tool. The first is a screen headed "Saved
    reports" with a strip reading "40 selected" beside an "Archive" button and
    an "Export" button, then a table whose rows each carry a tick — Weekly
    pipeline, Churn by segment, Renewals — Q3 — and a note reading "Showing 3
    of 40 selected". The second state is a dialog titled "Archive 40 reports?"
    with the line "They will be taken off everyone's list of saved reports.",
    a plain "Cancel" and a red "Archive". The third state is the list again:
    the strip now reads "None selected" with Archive greyed out, the table
    holds two other reports, and a dark message underneath reads "40 reports
    archived" with nothing in it to press.
  ko: >-
    리포트 도구의 세 상태입니다. 첫 번째는 "저장한 리포트" 화면으로, "40개 선택됨"
    이라고 적힌 줄 옆에 "보관" 버튼과 "내보내기" 버튼이 있고, 그 아래 표의 각 행에
    체크 표시가 붙어 있습니다 — 주간 파이프라인, 세그먼트별 이탈, 3분기 갱신 — 그
    밑에 "선택한 40개 중 3개 표시"라는 줄이 있습니다. 두 번째 상태는 "리포트 40개를
    보관할까요?"라는 대화상자로, "모두의 저장한 리포트 목록에서 내려갑니다."라는
    한 줄과 글자만 있는 "취소", 빨간 "보관"이 있습니다. 세 번째 상태는 다시 그
    목록입니다. 위쪽 줄은 "선택 없음"으로 바뀌고 보관은 회색이 되었으며, 표에는
    다른 리포트 두 개가 있고, 그 아래 짙은 색 메시지에 "리포트 40개를 보관했습니다"
    라고만 적혀 있을 뿐 누를 것은 없습니다.
sequence:
  - caption:
      en: The moment Archive is pressed on the selected reports
      ko: 선택한 리포트에 보관을 누른 순간
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Saved reports</h1>
            <div class="toolbar"><span>40 selected</span><button class="btn btn--outline">Archive</button><button class="btn btn--hairline">Export</button></div>
            <table class="table">
              <tr><th class="col-narrow"></th><th>Report</th><th>Owner</th></tr>
              <tr><td>✓</td><td>Weekly pipeline</td><td>H. Park</td></tr>
              <tr><td>✓</td><td>Churn by segment</td><td>J. Lee</td></tr>
              <tr><td>✓</td><td>Renewals — Q3</td><td>M. Cho</td></tr>
            </table>
            <p class="note">Showing 3 of 40 selected</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>저장한 리포트</h1>
            <div class="toolbar"><span>40개 선택됨</span><button class="btn btn--outline">보관</button><button class="btn btn--hairline">내보내기</button></div>
            <table class="table">
              <tr><th class="col-narrow"></th><th>리포트</th><th>소유자</th></tr>
              <tr><td>✓</td><td>주간 파이프라인</td><td>박현우</td></tr>
              <tr><td>✓</td><td>세그먼트별 이탈</td><td>이지훈</td></tr>
              <tr><td>✓</td><td>3분기 갱신</td><td>조민서</td></tr>
            </table>
            <p class="note">선택한 40개 중 3개 표시</p>
          </div>
        </div>
  - caption:
      en: The dialog that opens
      ko: 그때 열리는 대화상자
    screen:
      en: |-
        <div class="screen">
          <div class="dialog" style="max-width:420px">
            <p class="dialog-title">Archive 40 reports?</p>
            <p>They will be taken off everyone's list of saved reports.</p>
            <div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--danger">Archive</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="dialog" style="max-width:420px">
            <p class="dialog-title">리포트 40개를 보관할까요?</p>
            <p>모두의 저장한 리포트 목록에서 내려갑니다.</p>
            <div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--danger">보관</button></div>
          </div>
        </div>
  - caption:
      en: Immediately after Archive in the dialog
      ko: 대화상자에서 보관을 누른 직후
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Saved reports</h1>
            <div class="toolbar"><span>None selected</span><button class="btn btn--quiet">Archive</button><button class="btn btn--hairline">Export</button></div>
            <table class="table">
              <tr><th>Report</th><th>Owner</th></tr>
              <tr><td>Board pack</td><td>S. Yun</td></tr>
              <tr><td>Headcount plan</td><td>D. Im</td></tr>
            </table>
            <div class="toast toast--plain">40 reports archived</div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>저장한 리포트</h1>
            <div class="toolbar"><span>선택 없음</span><button class="btn btn--quiet">보관</button><button class="btn btn--hairline">내보내기</button></div>
            <table class="table">
              <tr><th>리포트</th><th>소유자</th></tr>
              <tr><td>이사회 자료</td><td>윤서진</td></tr>
              <tr><td>인력 계획</td><td>임도현</td></tr>
            </table>
            <div class="toast toast--plain">리포트 40개를 보관했습니다</div>
          </div>
        </div>
prompt:
  en: >-
    This dialog is the tool's only guard on a bulk archive. Which change should
    the archive get?
  ko: >-
    이 대화상자가 일괄 보관을 막아 주는 유일한 장치입니다. 보관 동작에 어떤 변화가
    필요할까요?
options:
  en:
    - text: List the forty report names inside the dialog
      reason: >-
        The user can check exactly what is about to go before they agree to it.
    - text: Make the user type the number of reports into the dialog to confirm
      reason: >-
        It is then a step nobody gets through by reflex, which is what a
        confirmation is for.
    - text: Leave it as it is
      reason: >-
        The action is guarded once already, and guarding it a second time would
        be belt and braces.
    - text: Archive straight away, drop the dialog, and offer Undo in the message that follows
      reason: >-
        The dialog asks the user to be certain in advance; a way back afterwards
        is what actually helps the one who was not.
      correct: true
  ko:
    - text: 대화상자 안에 리포트 40개의 이름을 모두 적습니다
      reason: >-
        동의하기 전에 무엇이 내려가는지 정확히 확인할 수 있습니다.
    - text: 대화상자에 리포트 개수를 직접 입력해야 확인되도록 합니다
      reason: >-
        반사적으로는 통과할 수 없는 단계가 되고, 확인 절차는 원래 그러라고 있는
        것입니다.
    - text: 지금 그대로 둡니다
      reason: >-
        이미 한 번 막아 두었으니, 두 번 막는 것은 과하게 겹치는 장치입니다.
    - text: 대화상자를 없애고 바로 보관한 뒤, 뒤따르는 메시지에 실행 취소를 답니다
      reason: >-
        대화상자는 미리 확신하라고 요구할 뿐이고, 확신하지 못했던 사람을 실제로
        구하는 것은 나중에 열려 있는 되돌아갈 길입니다.
      correct: true
---
