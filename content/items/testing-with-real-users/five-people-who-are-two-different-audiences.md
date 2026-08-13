---
sourceSection: 'Elements of Usability Testing'
principles:
  - five-participants
artefact:
  en: >-
    The recruitment table for a study of a veterinary practice's booking site,
    beside the question the study is meant to answer. Five participants are
    listed. Two are pet owners who have never booked with this practice. Three
    are practice receptionists who use the staff side of the same product every
    working day. The study's question reads: "Where do owners give up when
    booking an appointment, and where do receptionists lose time rebooking
    one?" One round of five sessions is planned, all next Thursday.
  ko: >-
    동물병원 예약 사이트 연구의 모집 표와, 이 연구가 답하려는 질문이 나란히
    있습니다. 참가자는 다섯 명입니다. 둘은 이 병원에서 예약해 본 적이 없는
    보호자이고, 셋은 같은 제품의 직원용 화면을 매 근무일 쓰는 병원 접수
    담당자입니다. 연구 질문은 이렇습니다. "보호자는 진료 예약 중 어디에서
    포기하고, 접수 담당자는 예약을 변경할 때 어디에서 시간을 잃는가?" 다섯 세션을
    한 회차로 묶어 다음 주 목요일에 모두 진행할 계획입니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Recruited</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>Who</th><th>Uses it now</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Pet owner</td><td>Never</td></tr>
              <tr><td>2</td><td>Pet owner</td><td>Never</td></tr>
              <tr><td>3</td><td>Receptionist</td><td>Every working day</td></tr>
              <tr><td>4</td><td>Receptionist</td><td>Every working day</td></tr>
              <tr><td>5</td><td>Receptionist</td><td>Every working day</td></tr>
            </tbody>
          </table>
          <p class="note">One round, all next Thursday.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">What the study is for</p>
        <div class="screen">
          <p>Where do owners give up when booking an appointment, and where do receptionists lose time rebooking one?</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">모집 현황</p>
        <div class="screen">
          <table class="table">
            <thead><tr><th>#</th><th>누구</th><th>지금 쓰는 정도</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>보호자</td><td>써 본 적 없음</td></tr>
              <tr><td>2</td><td>보호자</td><td>써 본 적 없음</td></tr>
              <tr><td>3</td><td>접수 담당자</td><td>매 근무일</td></tr>
              <tr><td>4</td><td>접수 담당자</td><td>매 근무일</td></tr>
              <tr><td>5</td><td>접수 담당자</td><td>매 근무일</td></tr>
            </tbody>
          </table>
          <p class="note">한 회차, 다음 주 목요일에 전부.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">이 연구가 답하려는 것</p>
        <div class="screen">
          <p>보호자는 진료 예약 중 어디에서 포기하고, 접수 담당자는 예약을 변경할 때 어디에서 시간을 잃는가?</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Which change should this study make?
  ko: >-
    이 연구는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Treat it as two studies of one group each, and recruit to that — or drop one of the two questions for now
      reason: >-
        Two audiences using two different sides of the product have their own
        problems, and a group represented by two people is barely represented.
      correct: true
    - text: Keep the five and run the owner tasks with everybody, since receptionists are also capable of booking
      reason: >-
        All five then answer the same tasks, and the comparison between a
        practised user and a new one is there to be made.
    - text: Keep the five and add three more owners, so both groups are the same size
      reason: >-
        Neither group is then thinner than the other, and the round still
        happens in one day.
    - text: Keep the five and analyse the two groups separately when writing up
      reason: >-
        Nobody's session is wasted, and the report does not blur two kinds of
        person into one set of findings.
  ko:
    - text: 한 집단씩 두 개의 연구로 보고 그에 맞게 모집합니다 — 아니면 지금은 두 질문 중 하나를 내려놓습니다
      reason: >-
        제품의 서로 다른 쪽을 쓰는 두 집단은 각자의 문제를 가지고 있고, 두 명으로
        대표되는 집단은 사실상 대표되지 않은 것입니다.
      correct: true
    - text: 다섯 명 그대로 두고 보호자 과제를 모두에게 시킵니다. 접수 담당자도 예약은 할 수 있으니까요
      reason: >-
        다섯 명이 같은 과제에 답하게 되고, 익숙한 사람과 처음인 사람을 견주어 볼
        여지도 생깁니다.
    - text: 다섯 명은 그대로 두고 보호자를 세 명 더 모아 두 집단 크기를 맞춥니다
      reason: >-
        어느 쪽도 다른 쪽보다 얇지 않게 되고, 회차는 여전히 하루에 끝납니다.
    - text: 다섯 명 그대로 진행하고, 정리할 때 두 집단을 나눠서 분석합니다
      reason: >-
        누구의 세션도 버려지지 않고, 보고서가 서로 다른 두 부류를 한 덩어리로
        뭉뚱그리지도 않습니다.
---
