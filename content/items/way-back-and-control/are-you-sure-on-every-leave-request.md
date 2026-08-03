---
sourceSection: Support Undo
principles:
  - undo
  - cognitive-load
artefact:
  en: >-
    Three states of a manager's leave-request queue in an HR tool. Each state
    shows the same three-row table — Y. Jung 4–6 Aug, T. Kang 11 Aug, S. Oh
    18–22 Aug — with a dialog underneath it. In the first state all three rows
    carry an underlined "Decline". In the second the first row reads "Declined"
    instead. In the third the first two read "Declined". The dialog is the same
    in all three states, word for word: the title "Are you sure?", the line
    "This request will be declined.", a plain "Cancel" and a red "Decline". It
    never names the person, the dates or the row it belongs to.
  ko: >-
    인사 도구에서 결재자가 보는 휴가 신청 목록의 세 상태입니다. 세 상태 모두 같은
    세 줄짜리 표를 보여 줍니다 — 정유나 8월 4–6일, 강태오 8월 11일, 오세린 8월
    18–22일 — 그리고 그 아래에 대화상자가 있습니다. 첫 번째 상태에서는 세 행 모두
    밑줄 친 "반려"를 달고 있습니다. 두 번째에서는 첫 행이 "반려됨"으로 바뀌어
    있습니다. 세 번째에서는 앞의 두 행이 "반려됨"입니다. 대화상자는 세 상태에서
    글자 하나까지 똑같습니다. 제목은 "정말 반려할까요?", 본문은 "이 신청은
    반려됩니다.", 글자만 있는 "취소"와 빨간 "반려". 누구의 신청인지, 어느 날짜인지,
    어느 행에서 열린 것인지는 한 번도 나오지 않습니다.
sequence:
  - caption:
      en: The dialog on the first decline
      ko: 첫 번째 반려에서 열린 대화상자
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Leave requests</h1>
            <table class="table">
              <tr><th>Person</th><th>Dates</th><th></th></tr>
              <tr><td>Y. Jung</td><td>4–6 Aug</td><td><span class="link">Decline</span></td></tr>
              <tr><td>T. Kang</td><td>11 Aug</td><td><span class="link">Decline</span></td></tr>
              <tr><td>S. Oh</td><td>18–22 Aug</td><td><span class="link">Decline</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">Are you sure?</p>
              <p>This request will be declined.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--danger">Decline</button></div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>휴가 신청</h1>
            <table class="table">
              <tr><th>신청자</th><th>날짜</th><th></th></tr>
              <tr><td>정유나</td><td>8월 4–6일</td><td><span class="link">반려</span></td></tr>
              <tr><td>강태오</td><td>8월 11일</td><td><span class="link">반려</span></td></tr>
              <tr><td>오세린</td><td>8월 18–22일</td><td><span class="link">반려</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">정말 반려할까요?</p>
              <p>이 신청은 반려됩니다.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--danger">반려</button></div>
            </div>
          </div>
        </div>
  - caption:
      en: The dialog on the next decline, seconds later
      ko: 몇 초 뒤 다음 반려에서 열린 대화상자
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Leave requests</h1>
            <table class="table">
              <tr><th>Person</th><th>Dates</th><th></th></tr>
              <tr><td>Y. Jung</td><td>4–6 Aug</td><td>Declined</td></tr>
              <tr><td>T. Kang</td><td>11 Aug</td><td><span class="link">Decline</span></td></tr>
              <tr><td>S. Oh</td><td>18–22 Aug</td><td><span class="link">Decline</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">Are you sure?</p>
              <p>This request will be declined.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--danger">Decline</button></div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>휴가 신청</h1>
            <table class="table">
              <tr><th>신청자</th><th>날짜</th><th></th></tr>
              <tr><td>정유나</td><td>8월 4–6일</td><td>반려됨</td></tr>
              <tr><td>강태오</td><td>8월 11일</td><td><span class="link">반려</span></td></tr>
              <tr><td>오세린</td><td>8월 18–22일</td><td><span class="link">반려</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">정말 반려할까요?</p>
              <p>이 신청은 반려됩니다.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--danger">반려</button></div>
            </div>
          </div>
        </div>
  - caption:
      en: The dialog on the decline after that
      ko: 그다음 반려에서 열린 대화상자
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Leave requests</h1>
            <table class="table">
              <tr><th>Person</th><th>Dates</th><th></th></tr>
              <tr><td>Y. Jung</td><td>4–6 Aug</td><td>Declined</td></tr>
              <tr><td>T. Kang</td><td>11 Aug</td><td>Declined</td></tr>
              <tr><td>S. Oh</td><td>18–22 Aug</td><td><span class="link">Decline</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">Are you sure?</p>
              <p>This request will be declined.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">Cancel</span><button class="btn btn--danger">Decline</button></div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>휴가 신청</h1>
            <table class="table">
              <tr><th>신청자</th><th>날짜</th><th></th></tr>
              <tr><td>정유나</td><td>8월 4–6일</td><td>반려됨</td></tr>
              <tr><td>강태오</td><td>8월 11일</td><td>반려됨</td></tr>
              <tr><td>오세린</td><td>8월 18–22일</td><td><span class="link">반려</span></td></tr>
            </table>
            <div class="dialog" style="max-width:380px">
              <p class="dialog-title">정말 반려할까요?</p>
              <p>이 신청은 반려됩니다.</p>
              <div class="dialog-foot actions--end"><span class="btn btn--ghost">취소</span><button class="btn btn--danger">반려</button></div>
            </div>
          </div>
        </div>
prompt:
  en: >-
    A manager works down this queue in one sitting. Which change should it get?
  ko: >-
    결재자는 이 목록을 한자리에서 위에서 아래로 처리합니다. 무엇을 바꿔야 할까요?
options:
  en:
    - text: Decline without the dialog, and let a decline be taken back from the row afterwards
      reason: >-
        By the third row a dialog that says the same thing every time is
        answered before it is read, while a way back still catches the one that
        was wrong.
      correct: true
    - text: Put the person's name and dates into the dialog so no two are alike
      reason: >-
        The user has to read it before they can answer it, which is what breaks
        the habit.
    - text: Add a second confirmation to declines
      reason: >-
        The heavier the guard on a decision, the more carefully it gets made.
    - text: Keep the dialog and hold its Decline button unavailable for two seconds
      reason: >-
        Nobody can click through a button that is not clickable yet.
  ko:
    - text: 대화상자 없이 바로 반려하고, 반려한 뒤에 그 행에서 되돌릴 수 있게 합니다
      reason: >-
        세 번째 행쯤 되면 매번 같은 말을 하는 대화상자는 읽히기도 전에 눌리지만,
        되돌아갈 길은 잘못 누른 한 건을 여전히 붙잡아 줍니다.
      correct: true
    - text: 대화상자에 신청자 이름과 날짜를 넣어 하나하나 다르게 만듭니다
      reason: >-
        답하려면 읽을 수밖에 없게 되고, 습관은 그렇게 끊어집니다.
    - text: 반려에만 확인 절차를 하나 더 붙입니다
      reason: >-
        결정을 막는 장치가 무거울수록 더 신중하게 결정하게 됩니다.
    - text: 대화상자는 두되, 반려 버튼을 2초 동안 누를 수 없게 합니다
      reason: >-
        아직 눌리지 않는 버튼은 아무도 지나칠 수 없습니다.
---
