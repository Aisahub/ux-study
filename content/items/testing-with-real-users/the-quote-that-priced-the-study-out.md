---
sourceSection: 'Cost of Usability Testing'
principles:
  - five-participants
artefact:
  en: >-
    Two documents. The first is a quote from a research agency for testing a
    council's bin-collection booking page: a lab in two cities, eye tracking,
    24 participants recruited to quota, a highlight reel and a written report —
    £46,000, twelve weeks. The second is the email the product manager sent
    after reading it: "This is out of the question at our size. We'll ship it
    and watch the support queue instead — that's free and it's real users." The
    page goes live in three weeks. Nobody outside the team has opened it.
  ko: >-
    문서 두 개입니다. 첫째는 지자체 대형폐기물 배출 신청 페이지를 테스트하겠다는
    리서치 업체의 견적서입니다. 두 도시의 실험실, 시선 추적, 조건에 맞춰 모집한
    참가자 24명, 하이라이트 영상과 보고서 — 4,600만 원, 12주. 둘째는 그것을 읽은
    프로덕트 매니저가 보낸 메일입니다. "우리 규모에서는 어림도 없습니다. 그냥
    출시하고 고객센터 문의를 보죠 — 공짜인 데다 실제 사용자잖아요." 이 페이지는
    3주 뒤 공개됩니다. 팀 밖의 누구도 아직 열어 본 적이 없습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">The agency quote</p>
        <div class="screen">
          <h3>Bin collection booking — usability study</h3>
          <table class="table">
            <tbody>
              <tr><td>Lab sessions, two cities</td><td>24 participants</td></tr>
              <tr><td>Eye tracking</td><td>included</td></tr>
              <tr><td>Highlight reel + report</td><td>included</td></tr>
              <tr><td><strong>Total</strong></td><td><strong>£46,000 · 12 weeks</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p class="pane-label">The reply</p>
        <div class="screen">
          <p>This is out of the question at our size. We'll ship it and watch the support queue instead — that's free and it's real users.</p>
          <p class="note">Live in three weeks. Nobody outside the team has opened it.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">업체 견적서</p>
        <div class="screen">
          <h3>대형폐기물 배출 신청 — 사용성 연구</h3>
          <table class="table">
            <tbody>
              <tr><td>두 도시 실험실 세션</td><td>참가자 24명</td></tr>
              <tr><td>시선 추적</td><td>포함</td></tr>
              <tr><td>하이라이트 영상 + 보고서</td><td>포함</td></tr>
              <tr><td><strong>합계</strong></td><td><strong>4,600만 원 · 12주</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p class="pane-label">회신</p>
        <div class="screen">
          <p>우리 규모에서는 어림도 없습니다. 그냥 출시하고 고객센터 문의를 보죠 — 공짜인 데다 실제 사용자잖아요.</p>
          <p class="note">3주 뒤 공개. 팀 밖의 누구도 아직 열어 본 적이 없습니다.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What should happen in the three weeks before this page goes live?
  ko: >-
    이 페이지가 공개되기까지 남은 3주 동안 무엇을 해야 할까요?
options:
  en:
    - text: Sit five residents in front of it, one at a time, and watch them try to book a collection
      reason: >-
        What was priced was a lab, not the method, and most of what is wrong
        with a page shows up in the first few people who try to use it.
      correct: true
    - text: Ask the agency to quote again for a smaller study, and delay the launch if it comes back in time
      reason: >-
        The expertise is kept and the scope is cut to what the budget allows,
        without the team having to run sessions it has never run.
    - text: Ship it and watch the support queue, then fix what the queue shows in the first month
      reason: >-
        The people writing in are real residents meeting the real page, which
        is the strongest evidence there is.
    - text: Have the team walk the page themselves against the tasks the agency proposed
      reason: >-
        The tasks were written by researchers, and walking them costs an
        afternoon rather than a budget.
  ko:
    - text: 주민 다섯 명을 한 명씩 앉혀 놓고, 실제로 배출 신청을 해 보는 모습을 지켜봅니다
      reason: >-
        견적이 매겨진 것은 실험실이지 방법이 아니고, 페이지의 문제는 대개 처음
        몇 사람에게서 드러납니다.
      correct: true
    - text: 업체에 규모를 줄인 견적을 다시 받고, 제때 오면 출시를 미룹니다
      reason: >-
        전문성은 그대로 두고 범위만 예산에 맞춰 줄이게 되며, 해 본 적 없는 세션을
        팀이 직접 굴릴 필요도 없습니다.
    - text: 그냥 출시하고 고객센터 문의를 보면서, 첫 달에 드러나는 것을 고칩니다
      reason: >-
        문의를 넣는 사람들은 실제 페이지를 만난 실제 주민이고, 그보다 강한 근거는
        없습니다.
    - text: 업체가 제안한 과제를 가지고 팀이 직접 페이지를 훑어 봅니다
      reason: >-
        과제는 연구자가 쓴 것이고, 그것을 따라 훑는 데는 예산이 아니라 반나절이면
        됩니다.
---
