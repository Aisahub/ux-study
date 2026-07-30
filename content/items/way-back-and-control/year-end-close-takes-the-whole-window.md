---
sourceSection: Make Exit Links Easily Discoverable
principles:
  - emergency-exit
artefact:
  en: >-
    Two states of an accounting tool. In the first, a menu runs down the left
    side — Dashboard (highlighted), Invoices, Ledgers, Reports, Settings — and
    the area beside it holds the heading "Finance" and a card titled "Year-end
    close 2025", with a line saying it opens on 12 January and a blue "Start
    year-end close" button. In the second state the side menu is gone and the
    screen holds only the close: the heading "Year-end close 2025", a line
    reading "Step 1 of 7", a bordered block headed "Lock the ledgers" naming
    four ledgers, and one control at the bottom right, a blue "Continue".
  ko: >-
    회계 도구의 두 상태입니다. 첫 번째 상태에서는 왼쪽에 메뉴가 세로로 있습니다 —
    대시보드(선택됨), 청구서, 원장, 리포트, 설정. 그 옆에는 "재무"라는 제목과
    "2025 연말 결산" 카드가 있고, 1월 12일에 열린다는 한 줄과 파란 "연말 결산
    시작" 버튼이 들어 있습니다. 두 번째 상태에서는 왼쪽 메뉴가 사라지고 화면에
    결산만 남습니다. "2025 연말 결산"이라는 제목, "7단계 중 1단계"라는 줄, "원장
    잠그기"라는 소제목 아래 원장 네 개를 적은 테두리 블록, 그리고 오른쪽 아래에
    컨트롤 하나 — 파란 "계속"뿐입니다.
sequence:
  - caption:
      en: The moment before Start year-end close is pressed
      ko: 연말 결산 시작을 누르기 직전
    screen:
      en: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">Dashboard</div>
              <div class="side-item">Invoices</div>
              <div class="side-item">Ledgers</div>
              <div class="side-item">Reports</div>
              <div class="side-item">Settings</div>
            </div>
            <div class="stack">
              <h1>Finance</h1>
              <div class="card">
                <h2>Year-end close 2025</h2>
                <p class="note">Opens 12 January. Ledgers stay editable until the close is finished.</p>
                <div class="actions"><button class="btn btn--blue">Start year-end close</button></div>
              </div>
            </div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="app">
            <div class="side">
              <div class="side-item side-item--on">대시보드</div>
              <div class="side-item">청구서</div>
              <div class="side-item">원장</div>
              <div class="side-item">리포트</div>
              <div class="side-item">설정</div>
            </div>
            <div class="stack">
              <h1>재무</h1>
              <div class="card">
                <h2>2025 연말 결산</h2>
                <p class="note">1월 12일에 열립니다. 결산이 끝날 때까지 원장은 계속 수정할 수 있습니다.</p>
                <div class="actions"><button class="btn btn--blue">연말 결산 시작</button></div>
              </div>
            </div>
          </div>
        </div>
  - caption:
      en: The screen that opens immediately after
      ko: 그 직후 열리는 화면
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Year-end close 2025</h1>
            <p class="step-mark">Step 1 of 7</p>
            <div class="region">
              <h3>Lock the ledgers</h3>
              <p>Every ledger below is frozen for the rest of the close.</p>
              <p class="note">General · Payroll · Fixed assets · Intercompany</p>
            </div>
            <div class="actions actions--end"><button class="btn btn--blue">Continue</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>2025 연말 결산</h1>
            <p class="step-mark">7단계 중 1단계</p>
            <div class="region">
              <h3>원장 잠그기</h3>
              <p>아래 원장은 결산이 끝날 때까지 모두 잠깁니다.</p>
              <p class="note">일반 · 급여 · 고정자산 · 계열사 간 거래</p>
            </div>
            <div class="actions actions--end"><button class="btn btn--blue">계속</button></div>
          </div>
        </div>
prompt:
  en: >-
    Someone started the close by accident and is now on its first step. Which
    change should this flow get?
  ko: >-
    실수로 결산을 시작해서 지금 첫 단계에 있습니다. 이 플로우에 어떤 변화가
    필요할까요?
options:
  en:
    - text: Add a back arrow to the top of every step
      reason: >-
        The user can then walk back through the steps behind them, one at a
        time, until they are out of the flow.
    - text: Say which step of how many each screen is
      reason: >-
        Knowing the close runs to seven steps lets a user judge whether it is
        worth pushing on.
    - text: Put a "Leave and finish later" control beside Continue on every step
      reason: >-
        Getting out becomes something the step itself offers, rather than
        something a user has to work out for themselves from inside it.
      correct: true
    - text: Ask for confirmation before Start year-end close is pressed
      reason: >-
        Someone who did not mean to begin is stopped at the door instead of
        inside.
  ko:
    - text: 모든 단계 위쪽에 뒤로 가기 화살표를 답니다
      reason: >-
        지나온 단계를 한 칸씩 거슬러 올라가다 보면 결국 플로우 밖으로 나올 수
        있습니다.
    - text: 각 화면이 전체 몇 단계 중 몇 번째인지 밝힙니다
      reason: >-
        결산이 일곱 단계짜리라는 것을 알면 계속 밀고 갈 만한 일인지 판단할 수
        있습니다.
    - text: 모든 단계에서 "계속" 옆에 "나가서 나중에 마치기"를 둡니다
      reason: >-
        빠져나가는 일이, 갇힌 사람이 알아서 궁리해야 할 것이 아니라 단계가 직접
        내놓는 선택지가 됩니다.
      correct: true
    - text: 연말 결산 시작을 누르기 전에 확인을 받습니다
      reason: >-
        시작할 생각이 없던 사람을 안쪽이 아니라 문 앞에서 붙잡을 수 있습니다.
---
