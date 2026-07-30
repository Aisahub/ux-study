---
sourceSection: 'Appropriate Feedback'
principles:
  - system-status
  - appropriate-feedback
artefact:
  en: >-
    The import screen of an internal purchasing tool, shown at three moments.
    In the first, a panel names the file waiting to be read —
    "supplier-prices-june.csv", with "4,200 rows · 38 suppliers" under it — and
    a filled blue "Start import" stands below. In the second, forty seconds after the start,
    the same panel is there and the button has been replaced by a small ring
    and the word "Working". In the third, three minutes after the start, the
    ring and the word "Working" are exactly as they were forty seconds in:
    nothing on the screen has moved, and no number anywhere says how much of
    the file has been read.
  ko: >-
    사내 구매 도구의 가져오기 화면을 세 시점에 걸쳐 보여 줍니다. 첫 시점에는
    읽어들일 파일이 패널에 적혀 있고 — "supplier-prices-june.csv", 그 아래
    "4,200행 · 공급사 38곳" — 그 밑에 파랑으로 꽉 찬 "가져오기 시작"이
    있습니다. 두 번째 시점은 시작하고 40초 뒤로, 같은 패널이 그대로 있고
    버튼 자리에는 작은 고리와 "진행 중"이라는 말이 들어와 있습니다. 세 번째
    시점은 시작하고 3분 뒤인데, 고리와 "진행 중"은 40초 때와 똑같습니다.
    화면에서 움직인 것은 하나도 없고, 파일을 어디까지 읽었는지 말해 주는
    숫자도 어디에도 없습니다.
sequence:
  - caption:
      en: The moment "Start import" is pressed
      ko: '"가져오기 시작"을 누른 순간'
    screen:
      en: |-
        <div class="screen">
          <h2>Import supplier prices</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200 rows · 38 suppliers</p>
          </div>
          <div class="actions">
            <button class="btn btn--blue">Start import</button>
            <button class="btn btn--outline">Choose another file</button>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>공급사 단가 가져오기</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200행 · 공급사 38곳</p>
          </div>
          <div class="actions">
            <button class="btn btn--blue">가져오기 시작</button>
            <button class="btn btn--outline">다른 파일 선택</button>
          </div>
        </div>
  - caption:
      en: Forty seconds after the start
      ko: 시작하고 40초 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Import supplier prices</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200 rows · 38 suppliers</p>
          </div>
          <div class="actions">
            <span class="spinner"></span>
            <span>Working</span>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>공급사 단가 가져오기</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200행 · 공급사 38곳</p>
          </div>
          <div class="actions">
            <span class="spinner"></span>
            <span>진행 중</span>
          </div>
        </div>
  - caption:
      en: Three minutes after the start
      ko: 시작하고 3분 뒤
    screen:
      en: |-
        <div class="screen">
          <h2>Import supplier prices</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200 rows · 38 suppliers</p>
          </div>
          <div class="actions">
            <span class="spinner"></span>
            <span>Working</span>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>공급사 단가 가져오기</h2>
          <div class="region" style="margin-bottom:16px">
            <p style="margin:0;font-weight:600">supplier-prices-june.csv</p>
            <p class="muted" style="margin:6px 0 0">4,200행 · 공급사 38곳</p>
          </div>
          <div class="actions">
            <span class="spinner"></span>
            <span>진행 중</span>
          </div>
        </div>
prompt:
  en: >-
    Which change fits an import that runs this long?
  ko: >-
    이렇게 오래 도는 가져오기에는 무엇이 알맞을까요?
options:
  en:
    - text: Count the rows off against the total as they are read
      reason: >-
        The size of the file is already known before the import starts, so the
        wait can be stated as rows done out of rows there are instead of as one
        unchanging word.
      correct: true
    - text: Keep what is on screen and add a line saying the import can take a few minutes
      reason: >-
        The buyer is told what to expect before the wait rather than left to
        work it out during it.
    - text: Hand the import to a background job and email the result
      reason: >-
        Nobody has to sit in front of a screen that has nothing new to show
        them.
    - text: Swap the ring for a bar that sweeps from end to end while the import runs
      reason: >-
        A bar reads as progress where a ring only reads as thinking.
  ko:
    - text: 읽은 행 수를 전체 행 수에 견주어 세어 보여 줍니다
      reason: >-
        파일 크기는 시작 전에 이미 알고 있으니, 기다림을 바뀌지 않는 낱말
        하나가 아니라 "전체 몇 행 중 몇 행"으로 말할 수 있습니다.
      correct: true
    - text: 화면은 그대로 두고 몇 분 걸릴 수 있다는 한 줄을 덧붙입니다
      reason: >-
        기다리는 중에 스스로 짐작하게 두지 않고, 기다리기 전에 미리 알려
        줍니다.
    - text: 가져오기를 백그라운드 작업으로 넘기고 결과를 메일로 보냅니다
      reason: >-
        보여 줄 것이 없는 화면 앞에 사람이 앉아 있을 필요가 없어집니다.
    - text: 고리를 없애고, 가져오는 동안 좌우로 오가는 막대를 둡니다
      reason: >-
        고리는 생각 중으로만 읽히지만 막대는 진행으로 읽힙니다.
---
