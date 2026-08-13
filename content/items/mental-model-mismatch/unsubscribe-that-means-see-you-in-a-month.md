---
sourceSection: 'Acting on Mental Models'
principles:
  - mental-model
artefact:
  en: >-
    The page a reader lands on after pressing "Unsubscribe" at the foot of a
    marketing email. It is headed "You're all set", and says "You will not
    receive marketing emails for the next 30 days." Below that is a line, "Your
    preferences will then return to weekly", and a button, "Back to the shop".
    Beside the page is the mailbox provider's report for the same month: 1,900
    unsubscribes, and 640 messages marked as spam by people who had already
    unsubscribed once.
  ko: >-
    마케팅 메일 맨 아래의 "수신 거부"를 누른 사람이 도착하는 페이지입니다. 제목은
    "완료되었습니다"이고, "앞으로 30일 동안 마케팅 메일을 보내지 않습니다"라고
    적혀 있습니다. 그 아래에는 "이후에는 주 1회 수신으로 돌아갑니다"라는 한 줄과
    "쇼핑몰로 돌아가기" 버튼이 있습니다. 페이지 옆에는 같은 달 메일 서비스 쪽
    보고서가 있는데, 수신 거부 1,900건, 그리고 이미 한 번 수신 거부를 했던
    사람들이 스팸으로 신고한 메일 640건이 적혀 있습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">After pressing Unsubscribe</p>
        <div class="screen">
          <h2>You're all set</h2>
          <p>You will not receive marketing emails for the next 30 days.</p>
          <p class="muted" style="margin:0">Your preferences will then return to weekly.</p>
          <div class="actions actions--start" style="margin-top:12px">
            <button class="btn btn--blue">Back to the shop</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">This month, from the mailbox provider</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-label">Unsubscribes</p><p class="stat-value">1,900</p></div>
            <div><p class="stat-label">Marked as spam</p><p class="stat-value">640</p></div>
          </div>
          <p class="note">Every one of those 640 had unsubscribed at least once before.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">수신 거부를 누른 뒤</p>
        <div class="screen">
          <h2>완료되었습니다</h2>
          <p>앞으로 30일 동안 마케팅 메일을 보내지 않습니다.</p>
          <p class="muted" style="margin:0">이후에는 주 1회 수신으로 돌아갑니다.</p>
          <div class="actions actions--start" style="margin-top:12px">
            <button class="btn btn--blue">쇼핑몰로 돌아가기</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">이번 달, 메일 서비스 보고서</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-label">수신 거부</p><p class="stat-value">1,900</p></div>
            <div><p class="stat-label">스팸 신고</p><p class="stat-value">640</p></div>
          </div>
          <p class="note">그 640건은 모두 전에 한 번 이상 수신 거부를 했던 사람들입니다.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change should this page make?
  ko: >-
    이 페이지는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Make Unsubscribe stop the emails and leave them stopped, and offer pausing as its own separate choice
      reason: >-
        Everybody pressing that word means it to be the end of it, and a
        product that means something else by it gets reported as spam instead.
      correct: true
    - text: Keep the pause and say plainly on the page that emails resume after 30 days
      reason: >-
        The page stops implying the matter is closed, and the reader can act
        again knowing what will happen.
    - text: Keep the pause and put a "Stop permanently" link on this page
      reason: >-
        The people who meant it permanently can say so, one press from where
        they already are.
    - text: Replace the page with a preference centre offering weekly, monthly, or none
      reason: >-
        The reader chooses the amount they want rather than being handed a
        decision somebody else made for them.
  ko:
    - text: 수신 거부를 누르면 메일이 멈추고 멈춘 채로 두며, 일시 중지는 별도의 선택지로 따로 둡니다
      reason: >-
        그 말을 누르는 사람은 모두 이것으로 끝이라는 뜻으로 누르고, 다른 뜻으로
        쓰는 제품은 대신 스팸으로 신고당합니다.
      correct: true
    - text: 일시 중지는 그대로 두되, 30일 뒤 다시 온다는 사실을 이 페이지에 분명히 적습니다
      reason: >-
        페이지가 다 끝난 일인 척하지 않게 되고, 읽는 사람은 무슨 일이 일어날지
        알고 다시 손을 쓸 수 있습니다.
    - text: 일시 중지는 그대로 두고, 이 페이지에 "영구 수신 거부" 링크를 답니다
      reason: >-
        영구적으로 끊을 생각이었던 사람은 지금 있는 그 자리에서 한 번만 누르면
        그렇게 말할 수 있습니다.
    - text: 이 페이지를 주 1회, 월 1회, 받지 않음 중에 고르는 수신 설정 화면으로 바꿉니다
      reason: >-
        누군가 대신 정해 준 결과를 받는 대신, 읽는 사람이 원하는 양을 직접
        고르게 됩니다.
---
