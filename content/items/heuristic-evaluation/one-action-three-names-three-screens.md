---
sourceSection: 'Choosing a Set of Heuristics'
principles:
  - named-heuristic
  - consistency
artefact:
  en: >-
    Three screens of one warehouse tool, drawn side by side. Each is the point
    at which a picker finishes a job and hands it on, and each names that
    single action differently. On the picking screen the button reads "Complete
    pick". On the packing screen, reached straight afterwards, it reads "Mark
    packed". On the dispatch screen, the last of the three, it reads "Done".
    The three screens are used one after another by the same person, many times
    a shift.
  ko: >-
    한 물류창고 도구의 화면 세 개가 나란히 있습니다. 셋 다 작업자가 한 작업을
    끝내고 다음으로 넘기는 지점이고, 그 하나의 동작을 저마다 다르게 부릅니다.
    피킹 화면의 버튼은 "피킹 완료"입니다. 곧바로 이어지는 포장 화면에서는 "포장
    표시"입니다. 마지막인 출고 화면에서는 "완료"입니다. 이 세 화면은 같은 사람이
    한 근무 동안 여러 번, 차례로 씁니다.
screen:
  en: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">1 · Picking</p>
        <div class="screen">
          <h3>Order 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">6 lines · aisle C</p>
          <div class="actions actions--start"><button class="btn btn--blue">Complete pick</button></div>
        </div>
      </div>
      <div>
        <p class="pane-label">2 · Packing</p>
        <div class="screen">
          <h3>Order 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">2 boxes</p>
          <div class="actions actions--start"><button class="btn btn--blue">Mark packed</button></div>
        </div>
      </div>
      <div>
        <p class="pane-label">3 · Dispatch</p>
        <div class="screen">
          <h3>Order 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">Courier 17:40</p>
          <div class="actions actions--start"><button class="btn btn--blue">Done</button></div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">1 · 피킹</p>
        <div class="screen">
          <h3>주문 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">6품목 · C 통로</p>
          <div class="actions actions--start"><button class="btn btn--blue">피킹 완료</button></div>
        </div>
      </div>
      <div>
        <p class="pane-label">2 · 포장</p>
        <div class="screen">
          <h3>주문 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">박스 2개</p>
          <div class="actions actions--start"><button class="btn btn--blue">포장 표시</button></div>
        </div>
      </div>
      <div>
        <p class="pane-label">3 · 출고</p>
        <div class="screen">
          <h3>주문 88-4120</h3>
          <p class="muted" style="margin:0 0 10px">택배 17:40</p>
          <div class="actions actions--start"><button class="btn btn--blue">완료</button></div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    You are writing this up as one finding. Which heuristic should it be
    anchored to?
  ko: >-
    이것을 하나의 발견으로 적으려고 합니다. 어떤 휴리스틱에 기대어 써야 할까요?
options:
  en:
    - text: Consistency
      reason: >-
        One action is given three names inside one product, so the worker has to
        learn three where the product could have taught one.
      correct: true
    - text: Plain language
      reason: >-
        "Mark packed" is written in the warehouse's own words rather than in the
        words the person at the screen would use.
    - text: Control fit
      reason: >-
        Three different jobs are being finished by three identical blue buttons,
        which is one control shape doing work of three kinds.
    - text: Sense of place
      reason: >-
        Nothing on the three screens says which of the three stages the worker
        is standing in, and the buttons are the only difference between them.
  ko:
    - text: 일관성
      reason: >-
        한 제품 안에서 하나의 동작에 세 가지 이름이 붙어 있어, 제품이 하나만
        가르쳐도 될 것을 작업자가 셋 다 익혀야 합니다.
      correct: true
    - text: 쉬운 말
      reason: >-
        "포장 표시"는 화면 앞의 사람이 쓸 말이 아니라 창고 안에서 쓰는 말을 그대로
        옮긴 것입니다.
    - text: 컨트롤 적합성
      reason: >-
        서로 다른 세 가지 작업이 똑같이 생긴 파란 버튼 세 개로 끝나고 있어, 한 가지
        컨트롤 모양이 세 종류의 일을 하고 있습니다.
    - text: 현재 위치 감각
      reason: >-
        세 화면 어디에도 지금 세 단계 중 어디에 서 있는지 적혀 있지 않고, 서로를
        가르는 것은 버튼뿐입니다.
---
