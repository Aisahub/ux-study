---
sourceSection: 'Elements of Usability Testing'
principles:
  - facilitator-neutrality
artefact:
  en: >-
    Two minutes of transcript from a session on an insurance quote form. It
    reads — Facilitator: "So you've got the car details in. What would you do
    now?" Participant: "Hmm. I'd… I'm looking for where the price is." F: "Yes,
    you'd probably scroll down to the green button there, wouldn't you?" P:
    "Oh — yes, I suppose I would." F: "And that's clear enough, that button?"
    P: "Yes, that's clear." F: "Good. Most people find that part easy." Beside
    the transcript is the note the facilitator wrote afterwards: "Participant
    found the quote button easily and said it was clear."
  ko: >-
    자동차 보험 견적 폼 세션의 2분 분량 녹취입니다. 내용은 이렇습니다.
    진행자 "차량 정보는 다 넣으셨네요. 이제 뭘 하시겠어요?" 참가자
    "음. 저는… 가격이 어디 있나 찾고 있어요." 진행자 "네, 아마
    아래로 내려서 저기 초록색 버튼을 누르시겠죠?" 참가자 "아, 네,
    그러겠네요." 진행자 "저 버튼, 알아보기 쉽죠?" 참가자 "네,
    명확해요." 진행자 "좋습니다. 저 부분은 대부분 쉽게들 하세요." 녹취
    옆에는 진행자가 세션 뒤에 적은 메모가 있습니다. "참가자가 견적 버튼을
    쉽게 찾았고 명확하다고 말함."
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Transcript</p>
        <div class="screen">
          <div class="prose">
            <p><strong>F:</strong> So you've got the car details in. What would you do now?</p>
            <p><strong>P:</strong> Hmm. I'd… I'm looking for where the price is.</p>
            <p><strong>F:</strong> Yes, you'd probably scroll down to the green button there, wouldn't you?</p>
            <p><strong>P:</strong> Oh — yes, I suppose I would.</p>
            <p><strong>F:</strong> And that's clear enough, that button?</p>
            <p><strong>P:</strong> Yes, that's clear.</p>
            <p><strong>F:</strong> Good. Most people find that part easy.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">The note written afterwards</p>
        <div class="screen">
          <p>Participant found the quote button easily and said it was clear.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">녹취</p>
        <div class="screen">
          <div class="prose">
            <p><strong>진행자:</strong> 차량 정보는 다 넣으셨네요. 이제 뭘 하시겠어요?</p>
            <p><strong>참가자:</strong> 음. 저는… 가격이 어디 있나 찾고 있어요.</p>
            <p><strong>진행자:</strong> 네, 아마 아래로 내려서 저기 초록색 버튼을 누르시겠죠?</p>
            <p><strong>참가자:</strong> 아, 네, 그러겠네요.</p>
            <p><strong>진행자:</strong> 저 버튼, 알아보기 쉽죠?</p>
            <p><strong>참가자:</strong> 네, 명확해요.</p>
            <p><strong>진행자:</strong> 좋습니다. 저 부분은 대부분 쉽게들 하세요.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">세션 뒤에 적은 메모</p>
        <div class="screen">
          <p>참가자가 견적 버튼을 쉽게 찾았고 명확하다고 말함.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What should be taken from this session?
  ko: >-
    이 세션에서 결과로 남길 수 있는 것은 무엇일까요?
options:
  en:
    - text: That the participant was still looking when the facilitator named the button — and nothing after that
      reason: >-
        Everything the note rests on was said after the answer had been handed
        over, so only the part before it is the participant's.
      correct: true
    - text: That the button is findable, but the wording of the note should be softened
      reason: >-
        The participant did agree it was clear, and the note should not claim
        more certainty than one session can carry.
    - text: Nothing — the session is unusable and should be run again with the same participant
      reason: >-
        The transcript is contaminated throughout, and re-running it costs one
        session rather than a whole round.
    - text: That the button needs to be higher up, since the participant was looking below the fold for the price
      reason: >-
        The one thing the participant did unprompted was search for the price,
        and they did not find it where they looked.
  ko:
    - text: 진행자가 버튼을 짚어 주기 전까지 참가자가 아직 찾고 있었다는 것뿐입니다
      reason: >-
        메모의 근거는 모두 진행자가 답을 알려 준 뒤에 나온 말입니다. 참가자가
        스스로 보여 준 것은 그 앞부분뿐입니다.
      correct: true
    - text: 버튼은 찾을 수 있다는 것입니다. 다만 메모의 표현은 누그러뜨려야 합니다
      reason: >-
        참가자가 명확하다고 말한 것은 사실이고, 메모가 세션 한 번으로 말할 수
        있는 것 이상을 단정해서는 안 됩니다.
    - text: 남길 것이 없습니다. 이 세션은 못 쓰므로 같은 참가자와 다시 진행해야 합니다
      reason: >-
        녹취 전체가 오염되었고, 다시 하더라도 회차 전체가 아니라 세션 하나만
        더 하면 됩니다.
    - text: 버튼을 위로 올려야 한다는 것입니다. 참가자가 가격을 찾느라 화면 아래쪽을 보고 있었기 때문입니다
      reason: >-
        누가 시키지 않았는데도 참가자가 스스로 한 일은 가격을 찾는 것 하나였고, 자기가 본
        자리에서는 찾지 못했습니다.
---
