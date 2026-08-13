---
sourceSection: 'Elements of Usability Testing'
principles:
  - realistic-task
artefact:
  en: >-
    The task sheet a facilitator will read aloud in tomorrow's sessions on a
    train-ticket app. It lists four tasks. Task 1: "Open the app and tap Search
    at the bottom." Task 2: "Type 'Manchester' into the To field, choose
    Manchester Piccadilly from the list, then tap Find trains." Task 3: "Use
    the Filters button at the top right to show only direct trains." Task 4:
    "You are going to visit a friend in Manchester next Saturday and need to be
    there before lunch. Book a ticket." Beside the sheet is the study's
    question: "Can somebody who has never used the app buy the right ticket?"
  ko: >-
    내일 진행할 기차표 앱 세션에서 진행자가 소리 내어 읽을 과제지입니다. 과제가
    네 개 있습니다. 1번 "앱을 열고 아래쪽의 검색을 누르세요." 2번 "도착지 칸에
    '부산'을 입력하고 목록에서 부산역을 고른 뒤, 열차 조회를 누르세요." 3번
    "오른쪽 위 필터 버튼으로 직통 열차만 보이게 하세요." 4번 "다음 주 토요일에
    부산에 있는 친구를 만나러 가는데 점심 전에는 도착해야 합니다. 표를
    예매하세요." 과제지 옆에는 이 연구의 질문이 적혀 있습니다. "앱을 한 번도 써
    본 적 없는 사람이 자기에게 맞는 표를 살 수 있는가?"
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Task sheet</p>
        <div class="screen">
          <div class="prose">
            <p><strong>1.</strong> Open the app and tap Search at the bottom.</p>
            <p><strong>2.</strong> Type "Manchester" into the To field, choose Manchester Piccadilly from the list, then tap Find trains.</p>
            <p><strong>3.</strong> Use the Filters button at the top right to show only direct trains.</p>
            <p><strong>4.</strong> You are going to visit a friend in Manchester next Saturday and need to be there before lunch. Book a ticket.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">What the study is for</p>
        <div class="screen">
          <p>Can somebody who has never used the app buy the right ticket?</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">과제지</p>
        <div class="screen">
          <div class="prose">
            <p><strong>1.</strong> 앱을 열고 아래쪽의 검색을 누르세요.</p>
            <p><strong>2.</strong> 도착지 칸에 "부산"을 입력하고 목록에서 부산역을 고른 뒤, 열차 조회를 누르세요.</p>
            <p><strong>3.</strong> 오른쪽 위 필터 버튼으로 직통 열차만 보이게 하세요.</p>
            <p><strong>4.</strong> 다음 주 토요일에 부산에 있는 친구를 만나러 가는데 점심 전에는 도착해야 합니다. 표를 예매하세요.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">이 연구가 답하려는 것</p>
        <div class="screen">
          <p>앱을 한 번도 써 본 적 없는 사람이 자기에게 맞는 표를 살 수 있는가?</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change should this task sheet make before tomorrow?
  ko: >-
    이 과제지는 내일 전에 무엇을 바꿔야 할까요?
options:
  en:
    - text: Cut tasks 1 to 3 and run the session on task 4 alone
      reason: >-
        The first three name the controls to press, which is the thing the
        study was going to find out, and task 4 is already the situation.
      correct: true
    - text: Rewrite tasks 1 to 3 without naming the controls, keeping them as three separate steps
      reason: >-
        The session still walks the flow in order, and nothing on the sheet
        points at a button any more.
    - text: Move task 4 to the front, and keep 1 to 3 afterwards as follow-ups
      reason: >-
        The participant meets the real situation while the app is still new to
        them, and the specific steps are checked after.
    - text: Keep all four and have the facilitator read them only if the participant gets stuck
      reason: >-
        The sheet becomes a fallback rather than a script, so a session that
        stalls has somewhere to go.
  ko:
    - text: 1~3번을 빼고 4번 하나로 세션을 진행합니다
      reason: >-
        앞의 세 개는 무엇을 눌러야 하는지를 알려 주는데 그것이야말로 이 연구가
        알아내려던 것이고, 4번은 이미 상황 그 자체입니다.
      correct: true
    - text: 1~3번에서 버튼 이름을 빼고 다시 쓰되, 세 단계로는 그대로 둡니다
      reason: >-
        세션은 여전히 흐름을 차례대로 밟게 되고, 과제지 어디에서도 버튼을 가리키지
        않게 됩니다.
    - text: 4번을 맨 앞으로 옮기고, 1~3번은 뒤에 후속 과제로 둡니다
      reason: >-
        참가자가 앱이 아직 낯선 상태에서 실제 상황을 먼저 만나고, 세부 단계는
        그다음에 확인합니다.
    - text: 넷 다 두되, 참가자가 막혔을 때만 진행자가 읽어 줍니다
      reason: >-
        과제지가 대본이 아니라 예비 수단이 되어, 세션이 멈췄을 때 갈 곳이
        생깁니다.
---
