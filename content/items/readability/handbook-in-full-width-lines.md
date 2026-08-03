---
sourceSection: Readability
principles:
  - legibility
  - readability
artefact:
  en: >-
    The company handbook's leave-policy page. The type itself is easy on the
    eyes: a clean sans-serif at 16px, #333333 on a plain white background,
    no texture behind it. But the text column stretches across the whole
    1440px window, so each line runs about 95 characters, and the line
    height is 1.2. The page is eleven paragraphs long, and staff say they
    give up partway through.
  ko: >-
    사내 핸드북의 휴가 규정 페이지입니다. 글자 자체는 눈에 잘 들어옵니다.
    깔끔한 고딕체 16px, 순백 배경 위 #333333, 배경에 무늬도 없습니다. 그런데
    본문 단이 1440px 창 전체를 가로질러, 한 줄이 90자 가까이 이어지고 행간은
    1.2입니다. 문단 열한 개짜리 페이지인데, 직원들은 읽다가 중간에 포기한다고
    말합니다.
screen:
  en: |-
    <div class="screen">
      <h2>Leave policy</h2>
      <div class="prose" style="font-size:16px;line-height:1.2;max-width:none;color:#333333">
        <p>All full-time staff accrue twenty-five days of paid annual leave each calendar year, accruing monthly from the first full month of employment.</p>
        <p>Leave does not carry over into the next year unless a manager approves the carry-over in writing before 15 December, and no more than five days may be carried.</p>
        <p>Requests are made in the leave tool and go to your direct manager, who is asked to respond within three working days.</p>
        <p>A request covering more than five consecutive working days should be made at least four weeks ahead, so that cover can be arranged.</p>
        <p>Public holidays follow the calendar of the country you are contracted in, and are additional to your annual leave.</p>
        <p>Sick leave is recorded separately and is not deducted from annual leave. Tell your manager on the first morning you are unwell.</p>
        <p>A doctor's note is asked for from the fourth consecutive day of sickness, and goes to People Ops rather than to your manager.</p>
        <p>Parental leave follows local statutory entitlement, and the company tops the pay up to full salary for the first twelve weeks.</p>
        <p>Unpaid leave may be requested for periods of up to three months, and needs approval from both your manager and the department head.</p>
        <p>Staff leaving the company are paid for accrued leave they have not taken, calculated to their last working day.</p>
        <p>Questions this page does not answer go to People Ops, who keep the full policy document.</p>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>휴가 규정</h2>
      <div class="prose" style="font-size:16px;line-height:1.2;max-width:none;color:#333333">
        <p>정규 직원은 매 역년마다 유급 연차 25일이 발생하며, 입사 후 첫 온전한 달부터 매달 쌓입니다.</p>
        <p>연차는 다음 해로 넘어가지 않습니다. 다만 12월 15일 전에 관리자가 서면으로 승인한 경우에 한해 최대 5일까지 이월할 수 있습니다.</p>
        <p>신청은 휴가 도구에서 하며 직속 관리자에게 전달되고, 관리자는 영업일 기준 사흘 안에 회신하도록 되어 있습니다.</p>
        <p>연속 5영업일을 넘는 신청은 업무 인수인계를 준비할 수 있도록 최소 4주 전에 해 주십시오.</p>
        <p>공휴일은 계약한 국가의 달력을 따르며, 연차와 별도로 부여됩니다.</p>
        <p>병가는 따로 기록되며 연차에서 차감하지 않습니다. 몸이 좋지 않은 첫날 아침에 관리자에게 알려 주십시오.</p>
        <p>병가가 연속 나흘째부터는 진단서를 요청하며, 진단서는 관리자가 아니라 인사팀으로 보냅니다.</p>
        <p>육아휴직은 해당 국가의 법정 기준을 따르며, 회사가 첫 12주 동안 급여를 전액까지 보전합니다.</p>
        <p>무급 휴직은 최대 3개월까지 신청할 수 있고, 관리자와 부서장 양쪽의 승인이 필요합니다.</p>
        <p>퇴사하는 직원에게는 쓰지 않고 남은 연차를 마지막 근무일 기준으로 계산해 지급합니다.</p>
        <p>이 페이지에 없는 내용은 규정 전문을 보관하는 인사팀에 문의해 주십시오.</p>
      </div>
    </div>
prompt:
  en: >-
    What change would let a reader actually finish this page?
  ko: >-
    독자가 이 페이지를 실제로 끝까지 읽게 하려면 무엇을 바꿔야 할까요?
options:
  en:
    - text: Cap the column and open up the line height
      reason: >-
        The letters were never the problem; a line carrying far fewer
        characters is what stops the shape of the block wearing the reader out.
      correct: true
    - text: Raise the text from #333333 to pure black
      reason: >-
        The article calls for high contrast between characters and background,
        and this grey falls short of it.
    - text: Enlarge the type beyond 16px
      reason: >-
        Visual acuity varies, and a size readers cannot comfortably resolve is
        what makes them stop.
    - text: Swap the typeface
      reason: >-
        A page this long needs a face designed for sustained reading, and the
        current one is what fatigues the eye.
  ko:
    - text: 단 너비를 줄이고 행간을 넓힙니다
      reason: >-
        글자는 애초에 문제가 아니었습니다. 한 줄의 글자 수를 크게 낮춰야
        독자를 지치게 하던 덩어리의 형태가 풀립니다.
      correct: true
    - text: 글자색을 #333333에서 완전한 검정으로 올립니다
      reason: >-
        글자와 배경 사이에 높은 대비를 두라는 것이 원문의 지침인데, 이 회색은
        거기에 못 미칩니다.
    - text: 16px보다 글자를 키웁니다
      reason: >-
        시력은 사람마다 다르고, 편하게 알아볼 수 없는 크기가 독자를 멈추게 하는
        원인입니다.
    - text: 서체를 바꿉니다
      reason: >-
        이만큼 긴 페이지에는 장문 읽기용으로 설계된 서체가 필요하고, 지금
        서체가 눈을 피로하게 만들고 있습니다.
---
