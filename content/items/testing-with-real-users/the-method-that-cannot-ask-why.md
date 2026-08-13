---
sourceSection: 'Types of Usability Testing'
principles:
  - facilitator-neutrality
artefact:
  en: >-
    A one-page research plan for a school-meals payment portal. Under "Question"
    it reads: "Parents are topping up their child's account but a third of them
    never set up the automatic top-up, even though almost all of them say they
    want to stop thinking about it. Why do they stop?" Under "Method": "20
    unmoderated remote sessions. Participants get the task by email, record
    their screen, and answer three written questions at the end. No facilitator
    — it lets us run 20 instead of 5 for the same money, next week."
  ko: >-
    학교 급식비 결제 포털의 한 장짜리 연구 계획서입니다. "질문" 항목에는 이렇게
    적혀 있습니다. "학부모들이 자녀 계정에 금액을 충전하면서도 셋 중 하나는 자동
    충전을 끝내 설정하지 않는다. 거의 모두가 신경 쓰지 않고 싶다고 말하는데도
    그렇다. 왜 도중에 그만두는가?" "방법" 항목에는 이렇게 적혀 있습니다. "무진행
    원격 세션 20건. 참가자는 과제를 메일로 받아 화면을 녹화하고, 마지막에 서술형
    질문 세 개에 답한다. 진행자는 두지 않는다 — 같은 비용으로 5건이 아니라
    20건을, 그것도 다음 주에 할 수 있다."
screen:
  en: |-
    <div class="screen">
      <h2>Research plan — top-up flow</h2>
      <div class="stack">
        <div class="field"><span class="field-label">Question</span><span class="control">Parents top up their child's account, but a third never set up automatic top-up — even though almost all of them say they want to stop thinking about it. Why do they stop?</span></div>
        <div class="field"><span class="field-label">Method</span><span class="control">20 unmoderated remote sessions. Task by email, screen recorded, three written questions at the end. No facilitator — 20 instead of 5 for the same money, next week.</span></div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>연구 계획 — 충전 흐름</h2>
      <div class="stack">
        <div class="field"><span class="field-label">질문</span><span class="control">학부모들이 자녀 계정에 충전을 하면서도 셋 중 하나는 자동 충전을 끝내 설정하지 않는다. 거의 모두가 신경 쓰지 않고 싶다고 말하는데도 그렇다. 왜 도중에 그만두는가?</span></div>
        <div class="field"><span class="field-label">방법</span><span class="control">무진행 원격 세션 20건. 과제는 메일로, 화면 녹화, 마지막에 서술형 질문 세 개. 진행자 없음 — 같은 비용으로 5건이 아니라 20건을, 다음 주에.</span></div>
      </div>
    </div>
prompt:
  en: >-
    Which change should this plan make?
  ko: >-
    이 계획은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Run moderated sessions instead, so somebody can ask what a parent was thinking at the moment they backed out
      reason: >-
        The question is why people stop, and the moment they stop is exactly
        when a written question at the end is too late to reach.
      correct: true
    - text: Keep it unmoderated and add a think-aloud instruction to the emailed task
      reason: >-
        The reasoning is captured in the recording as it happens, without the
        cost of a facilitator in every session.
    - text: Keep it unmoderated and follow up by phone with anybody who did not set up the top-up
      reason: >-
        The wide sample is kept, and the people the question is actually about
        are the ones who get asked.
    - text: Run the twenty unmoderated first, then five moderated on whatever the twenty throw up
      reason: >-
        The cheap round narrows where to look, and the expensive round is spent
        on the part that turned out to matter.
  ko:
    - text: 진행자가 있는 세션으로 바꿔, 학부모가 물러선 그 순간에 무슨 생각을 했는지 물을 수 있게 합니다
      reason: >-
        묻고 있는 것은 왜 그만두느냐인데, 그만두는 그 순간이야말로 마지막에 던지는
        서술형 질문으로는 닿을 수 없는 시점입니다.
      correct: true
    - text: 무진행은 그대로 두고, 메일로 보내는 과제에 생각을 소리 내어 말해 달라는 안내를 넣습니다
      reason: >-
        세션마다 진행자를 두는 비용 없이도, 생각이 일어나는 대로 녹화에
        담깁니다.
    - text: 무진행은 그대로 두고, 자동 충전을 설정하지 않은 사람에게만 전화로 후속 인터뷰를 합니다
      reason: >-
        넓은 표본은 그대로 지키면서, 질문이 실제로 향하는 사람들에게 묻게 됩니다.
    - text: 무진행 20건을 먼저 하고, 거기서 나온 것을 가지고 진행자 있는 5건을 합니다
      reason: >-
        싼 회차가 어디를 볼지 좁혀 주고, 비싼 회차는 중요하다고 밝혀진 곳에
        쓰입니다.
---
