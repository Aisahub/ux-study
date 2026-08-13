---
sourceSection: 'Why Usability Test?'
principles:
  - realistic-task
artefact:
  en: >-
    The note closing a design review for an airline's seat-selection step, and
    the log from the five sessions that were run anyway a fortnight later. The
    note reads: "Six of us went through this today, including two people who
    have shipped booking flows before. It reads clearly and nobody had a
    question. We have all booked a flight — this is a solved pattern and we
    should spend the research budget on the loyalty work instead." The session
    log lists what the five participants did: three tried to tap the aircraft
    diagram to pick a seat and nothing happened, because seats are chosen from
    the list beside it; two paid for a seat believing the fee covered both legs
    of the return; one gave up and left the seat unallocated.
  ko: >-
    한 항공사의 좌석 선택 단계 디자인 리뷰를 마치며 적은 메모와, 2주 뒤 어쨌든
    진행된 다섯 세션의 기록입니다. 메모는 이렇습니다. "오늘 여섯 명이 함께
    살펴봤고, 그중 둘은 예전에 예약 흐름을 만들어 본 사람입니다. 읽기 명확하고
    아무도 질문이 없었습니다. 우리 모두 비행기표를 끊어 봤습니다 — 이건 이미
    풀린 패턴이니 리서치 예산은 멤버십 쪽에 쓰는 게 낫겠습니다." 세션 기록에는
    참가자 다섯 명이 한 일이 적혀 있습니다. 셋은 좌석을 고르려고 기체 도면을
    눌렀는데 아무 일도 일어나지 않았습니다. 좌석은 옆의 목록에서 고르게 되어 있기
    때문입니다. 둘은 좌석 요금이 왕복 두 구간 모두에 해당한다고 여기고
    결제했습니다. 하나는 포기하고 좌석을 지정하지 않은 채 넘어갔습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">The design review note</p>
        <div class="screen">
          <div class="prose">
            <p>Six of us went through this today, including two people who have shipped booking flows before. It reads clearly and nobody had a question.</p>
            <p>We have all booked a flight — this is a solved pattern and we should spend the research budget on the loyalty work instead.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">Five sessions, a fortnight later</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>What happened</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Tapped the aircraft diagram; nothing happened</td></tr>
              <tr><td>2</td><td>Tapped the aircraft diagram; nothing happened</td></tr>
              <tr><td>3</td><td>Paid, believing the fee covered the return leg too</td></tr>
              <tr><td>4</td><td>Tapped the aircraft diagram; nothing happened</td></tr>
              <tr><td>5</td><td>Paid, believing the fee covered the return leg too</td></tr>
            </tbody>
          </table>
          <p class="note">One of the five left without a seat allocated.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">디자인 리뷰 메모</p>
        <div class="screen">
          <div class="prose">
            <p>오늘 여섯 명이 함께 살펴봤고, 그중 둘은 예전에 예약 흐름을 만들어 본 사람입니다. 읽기 명확하고 아무도 질문이 없었습니다.</p>
            <p>우리 모두 비행기표를 끊어 봤습니다 — 이건 이미 풀린 패턴이니 리서치 예산은 멤버십 쪽에 쓰는 게 낫겠습니다.</p>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">2주 뒤, 다섯 세션</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>일어난 일</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>기체 도면을 눌렀으나 아무 반응 없음</td></tr>
              <tr><td>2</td><td>기체 도면을 눌렀으나 아무 반응 없음</td></tr>
              <tr><td>3</td><td>좌석 요금이 돌아오는 편도 포함이라 여기고 결제</td></tr>
              <tr><td>4</td><td>기체 도면을 눌렀으나 아무 반응 없음</td></tr>
              <tr><td>5</td><td>좌석 요금이 돌아오는 편도 포함이라 여기고 결제</td></tr>
            </tbody>
          </table>
          <p class="note">다섯 중 하나는 좌석을 지정하지 않은 채 넘어갔습니다.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    The team was not careless — they were experienced, and they read the screen
    closely. What did the review have no way of producing?
  ko: >-
    이 팀이 대충 본 것은 아닙니다. 경험도 있고 화면도 꼼꼼히 읽었습니다. 그런데
    이 리뷰가 애초에 만들어 낼 수 없었던 것은 무엇일까요?
options:
  en:
    - text: Somebody meeting the screen with a seat to choose and no idea how it works
      reason: >-
        The team read the screen; nobody in the room was trying to get something
        done on it, and that is where all five failures lived.
      correct: true
    - text: A large enough group — six people in one room is fewer than the study eventually used
      reason: >-
        Five sessions found what six reviewers did not, so the number in the
        room was the thing that was short.
    - text: An outside perspective — nobody in the review was independent of the team that built it
      reason: >-
        People reviewing their own team's work are the least likely to see what
        is missing from it.
    - text: A record — the review produced an opinion and no evidence anybody could check later
      reason: >-
        Nothing from that meeting could be re-examined when the sessions
        contradicted it.
  ko:
    - text: 고를 좌석이 있는 채로, 어떻게 하는 건지 모르는 상태에서 그 화면을 만나는 사람
      reason: >-
        팀이 한 일은 화면을 읽는 것이었고, 그 방에서 화면 위로 무언가를 해내려던
        사람은 없었으며, 다섯 건의 실패는 모두 거기에 있었습니다.
      correct: true
    - text: 충분한 인원 — 한 방에 모인 여섯 명은 결국 진행한 연구보다 적습니다
      reason: >-
        리뷰어 여섯이 못 본 것을 세션 다섯이 찾아냈으니, 모자랐던 것은 방 안의
        머릿수입니다.
    - text: 바깥의 시선 — 리뷰에 참여한 사람 중 만든 팀과 무관한 사람은 없었습니다
      reason: >-
        자기 팀이 만든 것을 보는 사람이야말로 빠진 것을 가장 못 보는 사람입니다.
    - text: 기록 — 리뷰가 남긴 것은 의견뿐이고, 나중에 확인할 수 있는 근거는 없었습니다
      reason: >-
        세션 결과가 그 회의를 뒤집었을 때, 회의에서 나온 것 가운데 다시 들여다볼
        수 있는 것은 없었습니다.
---
