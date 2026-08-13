---
sourceSection: 'Elements of Usability Testing'
principles:
  - facilitator-neutrality
artefact:
  en: >-
    A stretch of transcript from a session on a hospital appointment
    rescheduler, with the seconds marked. The task was "You cannot make
    Thursday. Move the appointment." — 00:12 Participant: "Right." (scrolls
    down, scrolls back up) 00:19 P: (silence) 00:24 Facilitator: "It might be
    under the appointment itself." 00:26 P: "Oh, of course." (opens the
    appointment, finds Reschedule, completes the task) 00:41 F: "There we go.
    Was that where you expected it?" 00:44 P: "Yeah, that makes sense." The
    facilitator's note reads: "Found reschedule in 41 seconds with a small
    prompt. Location makes sense to users."
  ko: >-
    병원 진료 일정 변경 화면 세션의 녹취 일부이고, 초 단위 시각이 표시되어
    있습니다. 과제는 "목요일에 갈 수 없게 되었습니다. 예약을 옮기세요."였습니다.
    — 00:12 참가자 "네." (아래로 내렸다가 다시 위로 올림) 00:19 참가자 (침묵)
    00:24 진행자 "예약 항목 안쪽에 있을 수도 있어요." 00:26 참가자 "아, 그렇네요."
    (예약을 열어 일정 변경을 찾고 과제를 마침) 00:41 진행자 "됐네요. 예상하신
    자리에 있었나요?" 00:44 참가자 "네, 말이 되네요." 진행자의 메모는 이렇습니다.
    "약간의 힌트와 함께 41초 만에 일정 변경을 찾음. 위치가 사용자에게 납득됨."
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Transcript</p>
        <div class="screen">
          <div class="prose">
            <p><span class="muted">00:12</span> <strong>P:</strong> Right. <em>(scrolls down, scrolls back up)</em></p>
            <p><span class="muted">00:19</span> <strong>P:</strong> <em>(silence)</em></p>
            <p><span class="muted">00:24</span> <strong>F:</strong> It might be under the appointment itself.</p>
            <p><span class="muted">00:26</span> <strong>P:</strong> Oh, of course. <em>(opens it, finds Reschedule, completes the task)</em></p>
            <p><span class="muted">00:41</span> <strong>F:</strong> There we go. Was that where you expected it?</p>
            <p><span class="muted">00:44</span> <strong>P:</strong> Yeah, that makes sense.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">The note</p>
        <div class="screen">
          <p>Found reschedule in 41 seconds with a small prompt. Location makes sense to users.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">녹취</p>
        <div class="screen">
          <div class="prose">
            <p><span class="muted">00:12</span> <strong>참가자:</strong> 네. <em>(아래로 내렸다가 다시 위로 올림)</em></p>
            <p><span class="muted">00:19</span> <strong>참가자:</strong> <em>(침묵)</em></p>
            <p><span class="muted">00:24</span> <strong>진행자:</strong> 예약 항목 안쪽에 있을 수도 있어요.</p>
            <p><span class="muted">00:26</span> <strong>참가자:</strong> 아, 그렇네요. <em>(예약을 열어 일정 변경을 찾고 과제를 마침)</em></p>
            <p><span class="muted">00:41</span> <strong>진행자:</strong> 됐네요. 예상하신 자리에 있었나요?</p>
            <p><span class="muted">00:44</span> <strong>참가자:</strong> 네, 말이 되네요.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">메모</p>
        <div class="screen">
          <p>약간의 힌트와 함께 41초 만에 일정 변경을 찾음. 위치가 사용자에게 납득됨.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Five seconds of silence, and then the facilitator spoke. What should they
    have done instead?
  ko: >-
    5초 동안 침묵이 흘렀고, 진행자가 입을 열었습니다. 대신 무엇을 했어야 할까요?
options:
  en:
    - text: Let the silence run, and if anything, ask what the participant is looking for
      reason: >-
        Where somebody looks when they cannot find a thing is the finding, and
        the prompt arrived before it had finished happening.
      correct: true
    - text: Ask what the participant expects to happen next, to keep them talking without pointing anywhere
      reason: >-
        The session keeps producing speech to analyse, and the question names
        no part of the screen.
    - text: Wait a set time — say thirty seconds — before offering any help, and record that it was needed
      reason: >-
        Every participant then gets the same amount of rope, and how often help
        was needed becomes comparable across sessions.
    - text: Say nothing and end the task as a failure once it is clear they are stuck
      reason: >-
        A failed task is a clean result, and the participant is spared several
        minutes of being lost.
  ko:
    - text: 침묵을 그대로 두고, 굳이 말한다면 지금 무엇을 찾고 있는지 묻습니다
      reason: >-
        무언가를 못 찾는 사람이 어디를 보는지가 곧 발견인데, 그것이 아직 일어나고
        있는 중에 힌트가 들어왔습니다.
      correct: true
    - text: 다음에 무슨 일이 일어날 것 같은지 물어, 화면의 어느 곳도 가리키지 않으면서 말을 이어 가게 합니다
      reason: >-
        분석할 발화가 계속 나오고, 그 물음은 화면의 어떤 부분도 지목하지
        않습니다.
    - text: 정해 둔 시간 — 이를테면 30초 — 을 기다린 뒤에 도움을 주고, 도움이 필요했다는 사실을 기록합니다
      reason: >-
        모든 참가자에게 같은 만큼의 여유가 주어지고, 도움이 얼마나 자주 필요했는지도
        세션끼리 견줄 수 있게 됩니다.
    - text: 아무 말도 하지 않고, 막힌 것이 분명해지면 그 과제를 실패로 마칩니다
      reason: >-
        실패한 과제는 그 자체로 깔끔한 결과이고, 참가자도 몇 분씩 헤매지 않아도
        됩니다.
---
