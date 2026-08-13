---
sourceSection: 'Step 1: Prepare for a Heuristic Evaluation'
principles:
  - independent-evaluation
artefact:
  en: >-
    What three evaluators handed in after walking the same returns flow alone,
    with no format agreed beforehand. Priya sent a spreadsheet of eleven rows,
    each naming a screen, a heuristic and a severity from 1 to 4. Tom sent a
    document of five paragraphs describing his walk through in order, with the
    problems mentioned inside the sentences and no heuristics named. Sara sent
    nine annotated screenshots, each with an arrow and a few words, and no
    ordering. All three cover the same six screens.
  ko: >-
    평가자 세 명이 같은 반품 흐름을 각자 훑고 제출한 결과물입니다. 사전에 형식을
    정해 두지는 않았습니다. 프리야는 열한 줄짜리 표를 냈고, 줄마다 화면 이름,
    휴리스틱, 1에서 4까지의 심각도가 적혀 있습니다. 톰은 다섯 문단짜리 문서를
    냈는데, 훑어본 순서대로 서술되어 있고 문제는 문장 속에 섞여 있으며 휴리스틱
    이름은 나오지 않습니다. 사라는 화면 캡처 아홉 장에 화살표와 짧은 문구를 달아
    냈고, 순서는 없습니다. 셋 다 같은 여섯 화면을 다루고 있습니다.
screen:
  en: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">Priya</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>Screen</th><th>Heuristic</th><th>Sev</th></tr></thead>
            <tbody>
              <tr><td>Reason for return</td><td>Consistency</td><td>3</td></tr>
              <tr><td>Label printing</td><td>Visibility of system status</td><td>4</td></tr>
              <tr><td>Confirmation</td><td>Undo</td><td>2</td></tr>
            </tbody>
          </table>
          <p class="note">11 rows in total</p>
        </div>
      </div>
      <div>
        <p class="pane-label">Tom</p>
        <div class="screen">
          <div class="prose">
            <p>I started from the order list, which was fine, and then chose a return. The reason list is long and the wording is odd in places…</p>
            <p>Printing the label is where I got stuck for a while, and I think most people would…</p>
          </div>
          <p class="note">5 paragraphs, no heuristics named</p>
        </div>
      </div>
      <div>
        <p class="pane-label">Sara</p>
        <div class="screen">
          <div class="photo" style="margin-bottom:8px"></div>
          <div class="actions actions--start"><span class="chip">↗ odd</span><span class="chip">↗ where?</span><span class="chip">↗ no back</span></div>
          <p class="note">9 annotated screenshots, unordered</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">프리야</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>화면</th><th>휴리스틱</th><th>심각도</th></tr></thead>
            <tbody>
              <tr><td>반품 사유</td><td>일관성</td><td>3</td></tr>
              <tr><td>운송장 출력</td><td>시스템 상태 가시성</td><td>4</td></tr>
              <tr><td>완료 확인</td><td>실행 취소</td><td>2</td></tr>
            </tbody>
          </table>
          <p class="note">모두 11줄</p>
        </div>
      </div>
      <div>
        <p class="pane-label">톰</p>
        <div class="screen">
          <div class="prose">
            <p>주문 목록에서 시작했는데 거기는 괜찮았고, 이어서 반품을 골랐습니다. 사유 목록이 길고 문구가 군데군데 어색합니다…</p>
            <p>운송장 출력에서 한참 막혔는데, 대부분 그럴 것 같습니다…</p>
          </div>
          <p class="note">5문단, 휴리스틱 이름 없음</p>
        </div>
      </div>
      <div>
        <p class="pane-label">사라</p>
        <div class="screen">
          <div class="photo" style="margin-bottom:8px"></div>
          <div class="actions actions--start"><span class="chip">↗ 어색</span><span class="chip">↗ 어디로?</span><span class="chip">↗ 뒤로 없음</span></div>
          <p class="note">주석 단 화면 캡처 9장, 순서 없음</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    The three evaluated independently, exactly as they should have. Consolidation
    is now the problem. What went wrong, and when?
  ko: >-
    세 사람은 마땅히 그래야 하는 대로 각자 따로 평가했습니다. 그런데 이제 정리가
    되지 않습니다. 무엇이, 언제 잘못됐을까요?
options:
  en:
    - text: Preparation — the recording format should have been agreed before anybody started walking
      reason: >-
        Findings written apart have to be laid side by side afterwards, and
        three shapes cannot be, however good each one is.
      correct: true
    - text: Nothing went wrong — consolidate by having each evaluator restate their findings in Priya's format
      reason: >-
        The independent work survives, and the rewriting is done by the person
        who knows what they meant.
    - text: Preparation — the three should have been given a screen each rather than the whole flow
      reason: >-
        Six screens between three evaluators is thinner coverage than one screen
        each looked at properly.
    - text: Nothing went wrong — take Priya's sheet as the frame and add anything from the other two that is missing
      reason: >-
        The most usable of the three becomes the structure, and nothing anybody
        found gets dropped.
  ko:
    - text: 준비 단계입니다 — 아무도 훑기 시작하기 전에 기록 형식을 맞춰 뒀어야 합니다
      reason: >-
        따로 적은 발견은 나중에 나란히 놓고 견주어야 하는데, 형식이 셋이면 각각이
        아무리 좋아도 나란히 놓이지 않습니다.
      correct: true
    - text: 잘못된 것은 없습니다 — 각자 자기 발견을 프리야의 형식으로 다시 적게 해서 정리합니다
      reason: >-
        따로 한 작업은 그대로 살아남고, 다시 옮겨 적는 일은 자기가 무슨 뜻이었는지
        아는 사람이 하게 됩니다.
    - text: 준비 단계입니다 — 셋에게 흐름 전체가 아니라 화면을 하나씩 나눠 줬어야 합니다
      reason: >-
        평가자 셋이 여섯 화면을 나눠 보는 것보다, 한 사람이 한 화면을 제대로 보는
        쪽이 촘촘합니다.
    - text: 잘못된 것은 없습니다 — 프리야의 표를 틀로 삼고 나머지 둘에서 빠진 것을 채워 넣습니다
      reason: >-
        셋 중 가장 쓸 만한 것이 뼈대가 되고, 누구의 발견도 버려지지 않습니다.
---
