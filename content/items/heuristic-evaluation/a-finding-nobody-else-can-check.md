---
sourceSection: 'Choosing a Set of Heuristics'
principles:
  - named-heuristic
artefact:
  en: >-
    Four findings as they were written up after an evaluation of a checkout
    flow, in the sheet that goes to the team who will fix them. They read:
    "1. The checkout page feels cluttered and cheap, and I would not trust it
    with my card." — "2. On the delivery step, the chosen address is not shown
    again on the payment step, so there is nothing to check it against before
    paying (Consistency)." — "3. Pressing the browser's back button from
    payment empties the basket, and nothing warns of it or puts it back
    (Emergency exit)." — "4. The 'Place order' button sits below the fold on a
    phone, so on a 375px screen it is not visible when the page loads (Visual
    hierarchy)."
  ko: >-
    결제 흐름을 평가한 뒤 정리한 발견 네 개입니다. 고칠 팀에게 그대로 넘어가는
    문서입니다. 내용은 이렇습니다. "1. 결제 페이지가 어수선하고 싸구려 같아서,
    나라면 카드번호를 넣고 싶지 않다." — "2. 배송 단계에서 고른 주소가 결제
    단계에서 다시 보이지 않아, 결제 전에 맞는지 대조해 볼 것이 없다 (일관성)."
    — "3. 결제 단계에서 브라우저 뒤로 가기를 누르면 장바구니가 비는데, 아무런
    경고도 없고 되돌릴 방법도 없다 (비상구)." — "4. '주문하기' 버튼이 휴대폰에서
    첫 화면 아래로 밀려, 375px 화면에서는 페이지를 열었을 때 보이지 않는다
    (시각적 위계)."
screen:
  en: |-
    <div class="screen">
      <h2>Checkout evaluation — findings</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>#</th><th>Finding</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>The checkout page feels cluttered and cheap, and I would not trust it with my card.</td></tr>
            <tr><td>2</td><td>On the delivery step, the chosen address is not shown again on the payment step, so there is nothing to check it against before paying (Consistency).</td></tr>
            <tr><td>3</td><td>Pressing the browser's back button from payment empties the basket, and nothing warns of it or puts it back (Emergency exit).</td></tr>
            <tr><td>4</td><td>The "Place order" button sits below the fold on a phone, so on a 375px screen it is not visible when the page loads (Visual hierarchy).</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>결제 흐름 평가 — 발견 목록</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>#</th><th>발견</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>결제 페이지가 어수선하고 싸구려 같아서, 나라면 카드번호를 넣고 싶지 않다.</td></tr>
            <tr><td>2</td><td>배송 단계에서 고른 주소가 결제 단계에서 다시 보이지 않아, 결제 전에 맞는지 대조해 볼 것이 없다 (일관성).</td></tr>
            <tr><td>3</td><td>결제 단계에서 브라우저 뒤로 가기를 누르면 장바구니가 비는데, 아무런 경고도 없고 되돌릴 방법도 없다 (비상구).</td></tr>
            <tr><td>4</td><td>"주문하기" 버튼이 휴대폰에서 첫 화면 아래로 밀려, 375px 화면에서는 페이지를 열었을 때 보이지 않는다 (시각적 위계).</td></tr>
          </tbody>
        </table>
      </div>
    </div>
prompt:
  en: >-
    One of these four cannot be acted on as written. What should be done with
    it?
  ko: >-
    네 개 가운데 하나는 적힌 그대로는 손을 댈 수 없습니다. 그것을 어떻게 해야
    할까요?
options:
  en:
    - text: Send finding 1 back to be rewritten against a named heuristic, on the specific thing that breaks it
      reason: >-
        As written it reports a feeling, so nobody can agree or disagree with it
        on evidence, and nobody knows what changing would settle it.
      correct: true
    - text: Drop finding 1, since a heuristic evaluation reports heuristic violations and that is not one
      reason: >-
        The sheet then contains only findings the method actually produces, and
        nothing that has to be argued about.
    - text: Keep finding 1 and mark it low severity, so the team sees it without it competing with the others
      reason: >-
        An evaluator's unease is worth recording, and severity is how a list
        says which things come first.
    - text: Keep finding 1 and pair it with a screenshot, so the team can see what was meant
      reason: >-
        The impression becomes checkable against the same screen the evaluator
        was looking at when they formed it.
  ko:
    - text: 1번은 돌려보내, 어떤 휴리스틱을 어겼는지 이름을 대고 무엇이 그것을 어기는지 짚어 다시 쓰게 합니다
      reason: >-
        지금대로는 느낌을 적은 것이라, 근거를 놓고 동의하거나 반박할 수도 없고
        무엇을 고쳐야 해결되는지도 알 수 없습니다.
      correct: true
    - text: 1번을 뺍니다. 휴리스틱 평가는 휴리스틱 위반을 적는 것이고 저것은 위반이 아니니까요
      reason: >-
        그러면 이 문서에는 이 방법이 실제로 만들어 내는 발견만 남고, 다툴 거리는
        남지 않습니다.
    - text: 1번을 남기되 심각도를 낮음으로 표시해, 다른 것들과 경쟁하지 않게 둡니다
      reason: >-
        평가자가 느낀 꺼림칙함도 적어 둘 값어치가 있고, 무엇을 먼저 볼지는
        심각도가 말해 줍니다.
    - text: 1번을 남기고 화면 캡처를 붙여, 무엇을 두고 한 말인지 팀이 볼 수 있게 합니다
      reason: >-
        그 인상이 평가자가 보고 있던 바로 그 화면과 견주어 확인 가능한 것이
        됩니다.
---
