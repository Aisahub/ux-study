---
sourceSection: 'Appropriate Feedback'
principles:
  - system-status
  - appropriate-feedback
artefact:
  en: >-
    The payment-run screen of an internal finance tool, shown at three moments.
    In the first, the run has just been confirmed: a panel reads "18 payments ·
    $46,200" and a filled blue "Run batch" sits under it, with a panel below
    headed "Recorded batches" holding one line, "June batch · 12 payments · 30
    June". In the second, two seconds after the batch finishes, a small green
    message reading "Done" stands beside the button; the recorded-batches panel
    still holds the June line and nothing else. In the third, twenty seconds
    after the batch finishes, the green message is gone with nothing in its
    place, the button is filled blue and ready to be pressed again, and the
    recorded-batches panel still holds only the June line.
  ko: >-
    사내 재무 도구의 지급 실행 화면을 세 시점에 걸쳐 보여 줍니다. 첫 시점은
    실행을 막 확정한 참으로, 패널에 "지급 18건 · 4,620만 원"이 적혀 있고 그
    아래에 파랑으로 꽉 찬 "일괄 실행"이 있으며, 다시 그 아래 "기록된 실행"
    패널에는 "6월분 · 지급 12건 · 6월 30일" 한 줄이 들어 있습니다. 두 번째
    시점은 일괄 실행이 끝나고 2초 뒤로, 버튼 옆에 "완료"라는 작은 초록
    메시지가 떠 있고, 기록된 실행 패널에는 여전히 6월분 한 줄뿐입니다. 세 번째
    시점은 끝나고 20초 뒤인데, 초록 메시지는 자리에 아무것도 남기지 않고
    사라졌고, 버튼은 파랑으로 꽉 찬 채 다시 눌릴 준비가 되어 있으며, 기록된
    실행 패널에는 아직도 6월분 한 줄만 있습니다.
sequence:
  - caption:
      en: The moment the run is confirmed
      ko: 실행을 확정한 순간
    screen:
      en: |-
        <div class="screen">
          <h2>Payment run</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">18 payments · $46,200</p>
            <p class="muted" style="margin:6px 0 0">Due 31 July · 18 suppliers</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">Run batch</button>
          </div>
          <div class="card">
            <h3>Recorded batches</h3>
            <p class="muted" style="margin:0">June batch · 12 payments · 30 June</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>지급 실행</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">지급 18건 · 4,620만 원</p>
            <p class="muted" style="margin:6px 0 0">7월 31일 지급 예정 · 공급사 18곳</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">일괄 실행</button>
          </div>
          <div class="card">
            <h3>기록된 실행</h3>
            <p class="muted" style="margin:0">6월분 · 지급 12건 · 6월 30일</p>
          </div>
        </div>
  - caption:
      en: Two seconds after the batch finishes
      ko: 일괄 실행이 끝나고 2초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Payment run</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">18 payments · $46,200</p>
            <p class="muted" style="margin:6px 0 0">Due 31 July · 18 suppliers</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">Run batch</button>
            <span class="toast toast--green">Done</span>
          </div>
          <div class="card">
            <h3>Recorded batches</h3>
            <p class="muted" style="margin:0">June batch · 12 payments · 30 June</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>지급 실행</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">지급 18건 · 4,620만 원</p>
            <p class="muted" style="margin:6px 0 0">7월 31일 지급 예정 · 공급사 18곳</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">일괄 실행</button>
            <span class="toast toast--green">완료</span>
          </div>
          <div class="card">
            <h3>기록된 실행</h3>
            <p class="muted" style="margin:0">6월분 · 지급 12건 · 6월 30일</p>
          </div>
        </div>
  - caption:
      en: Twenty seconds after the batch finishes
      ko: 일괄 실행이 끝나고 20초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Payment run</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">18 payments · $46,200</p>
            <p class="muted" style="margin:6px 0 0">Due 31 July · 18 suppliers</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">Run batch</button>
          </div>
          <div class="card">
            <h3>Recorded batches</h3>
            <p class="muted" style="margin:0">June batch · 12 payments · 30 June</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>지급 실행</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-size:20px;font-weight:600">지급 18건 · 4,620만 원</p>
            <p class="muted" style="margin:6px 0 0">7월 31일 지급 예정 · 공급사 18곳</p>
          </div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn btn--blue">일괄 실행</button>
          </div>
          <div class="card">
            <h3>기록된 실행</h3>
            <p class="muted" style="margin:0">6월분 · 지급 12건 · 6월 30일</p>
          </div>
        </div>
prompt:
  en: >-
    Money left the company between the first state and the last. Which change
    should this screen make?
  ko: >-
    첫 상태와 마지막 상태 사이에 회사 돈이 실제로 나갔습니다. 이 화면은 무엇을
    바꿔야 할까요?
options:
  en:
    - text: Record the run where the batches are listed — 18 payments, sent at 11:04
      reason: >-
        The sign that the money went stays on the screen for whoever looks an
        hour later, which is longer than any message lives.
      correct: true
    - text: Hold the message on screen for ten seconds instead of two
      reason: >-
        Ten seconds catches anyone who looked away for a moment while the run
        was finishing.
    - text: Show the message in the middle of the screen, large, with an OK to dismiss it
      reason: >-
        It cannot be missed, and it only goes away once someone has taken it
        in.
    - text: Email the finance team when the batch finishes
      reason: >-
        The run is written down permanently, in the place the team already
        reads every morning.
  ko:
    - text: 실행을 목록에 기록으로 남깁니다 — 지급 18건, 11시 04분 발송
      reason: >-
        돈이 나갔다는 표시가 화면에 남아, 한 시간 뒤에 보는 사람에게도 그대로
        보입니다. 어떤 메시지보다도 오래 갑니다.
      correct: true
    - text: 메시지를 2초가 아니라 10초 동안 띄워 둡니다
      reason: >-
        실행이 끝나는 잠깐 사이에 눈을 뗀 사람도 10초면 볼 수 있습니다.
    - text: 메시지를 화면 한가운데에 크게 띄우고 확인을 눌러야 닫히게 합니다
      reason: >-
        놓칠 수가 없고, 누군가 실제로 읽은 뒤에야 사라집니다.
    - text: 일괄 실행이 끝나면 재무 팀에 메일을 보냅니다
      reason: >-
        팀이 아침마다 확인하는 곳에 실행 내역이 영구히 남습니다.
---
