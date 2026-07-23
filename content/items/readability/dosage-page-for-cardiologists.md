---
sourceSection: Comprehension
principles:
  - cognitive-load
artefact:
  en: >-
    Two drafts of a dosing-guidance page whose only readers are practising
    cardiologists. Draft A says, in short sentences: "Titrate to 10mg daily.
    Monitor for QT prolongation during the first week." Draft B replaces
    every clinical term to reach a general-audience reading level; the same
    guidance becomes "Slowly adjust the amount taken until it reaches 10mg
    each day. During the first week, watch for signs that the heart's
    electrical rhythm is taking longer than it should." Draft B's sentences
    run roughly twice as long, and the named measurement is gone.
  ko: >-
    복용 지침 페이지의 시안 두 개인데, 읽는 사람은 현직 심장내과 전문의뿐
    입니다. 시안 A는 짧은 문장으로 말합니다. "하루 10mg까지 적정(titration)
    하십시오. 첫 주에는 QT 연장을 모니터링하십시오." 시안 B는 일반 독자
    수준의 문장을 만들기 위해 임상 용어를 전부 풀어 썼습니다. 같은 지침이
    "복용량을 하루 10mg에 이를 때까지 천천히 조절하십시오. 첫 주 동안은
    심장의 전기 리듬이 정상보다 오래 걸리는 징후가 있는지 살펴보십시오"가
    됩니다. 시안 B의 문장은 두 배 가까이 길고, 이름이 붙은 측정 지표는
    사라졌습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Draft A</p>
        <div class="screen">
          <h3>Dosing guidance — for prescribing clinicians</h3>
          <div class="prose" style="font-size:15px;line-height:1.6">
            <p>Titrate to 10mg daily.</p>
            <p>Monitor for QT prolongation during the first week.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">Draft B</p>
        <div class="screen">
          <h3>Dosing guidance — for prescribing clinicians</h3>
          <div class="prose" style="font-size:15px;line-height:1.6">
            <p>Slowly adjust the amount taken until it reaches 10mg each day.</p>
            <p>During the first week, watch for signs that the heart's electrical rhythm is taking longer than it should.</p>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">시안 A</p>
        <div class="screen">
          <h3>복용 지침 — 처방 의사용</h3>
          <div class="prose" style="font-size:15px;line-height:1.6">
            <p>하루 10mg까지 적정(titration)하십시오.</p>
            <p>첫 주에는 QT 연장을 모니터링하십시오.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">시안 B</p>
        <div class="screen">
          <h3>복용 지침 — 처방 의사용</h3>
          <div class="prose" style="font-size:15px;line-height:1.6">
            <p>복용량을 하루 10mg에 이를 때까지 천천히 조절하십시오.</p>
            <p>첫 주 동안은 심장의 전기 리듬이 정상보다 오래 걸리는 징후가 있는지 살펴보십시오.</p>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which draft should ship for this page?
  ko: >-
    이 페이지에는 어느 시안을 실어야 할까요?
options:
  en:
    - text: Draft A
      reason: >-
        Its terms are the ones this audience reads every working day, while
        Draft B trades a named, checkable measurement for a longer paraphrase
        that is vaguer for exactly these readers.
      correct: true
    - text: Draft B
      reason: >-
        The guidance for broad readerships is an 8th-grade reading level, and
        Draft B is the one that reaches it.
    - text: Draft B, with the two clinical terms restored in parentheses
      reason: >-
        Plain language first, jargon as a fallback, serves every reader.
    - text: Whichever a readability calculator scores lower
      reason: >-
        Run both through it and ship that one — the formula settles it more
        reliably than judgement.
  ko:
    - text: 시안 A
      reason: >-
        이 용어들은 이 독자층이 매일 업무에서 읽는 말이고, 시안 B는 이름 붙은
        확인 가능한 측정 지표를, 바로 이 독자들에게는 더 모호한 긴 풀어쓰기와
        맞바꿨습니다.
      correct: true
    - text: 시안 B
      reason: >-
        폭넓은 독자층을 위한 지침은 중학생 수준의 문장이고, 거기에 도달한 쪽은
        시안 B입니다.
    - text: 시안 B에 임상 용어 두 개를 괄호로 되살린 절충안
      reason: >-
        쉬운 말을 앞세우고 전문 용어를 보조로 두면 모든 독자에게 통합니다.
    - text: 가독성 계산기 점수가 더 낮게 나오는 쪽
      reason: >-
        둘 다 돌려 보고 그쪽을 싣습니다 — 판단보다 공식이 더 믿을 만하게
        결론을 내려 줍니다.
---
