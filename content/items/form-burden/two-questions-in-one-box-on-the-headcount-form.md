---
sourceSection: Avoid Double-Barreled Questions
principles:
  - cognitive-load
artefact:
  en: >-
    A headcount request in an internal hiring tool, headed "Request headcount",
    filled in and ready to send. "Team" holds "Payments" and "Positions" holds
    "1". The next field is labelled "Role and reporting line" and holds, in one
    box, "Backend engineer, reports to the Payments lead". Below it a field
    labelled "Start date and budget source" holds "October, from the platform
    budget". The last field, "Justification", holds a sentence about replacing a
    leaver. Both two-part boxes are wide enough to show everything typed into
    them. A "Send request" button sits at the bottom.
  ko: >-
    사내 채용 도구의 채용 요청 화면입니다. 제목은 "채용 요청"이고, 이미 다 채워져
    보낼 준비가 된 상태입니다. "팀"에는 "결제"가, "인원"에는 "1"이 들어 있습니다.
    다음 칸의 이름표는 "직무와 보고 라인"이고, 한 칸 안에 "백엔드 엔지니어, 결제팀
    팀장에게 보고"가 들어 있습니다. 그 아래 "시작 시점과 예산 출처" 칸에는 "10월,
    플랫폼 예산에서"가 들어 있습니다. 마지막 "사유" 칸에는 퇴사자 충원에 관한 한
    문장이 있습니다. 두 개짜리 질문을 받는 두 칸은 입력된 내용이 다 보일 만큼
    넓습니다. 맨 아래에 "요청 보내기" 버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Request headcount</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Team</span><input class="control" value="Payments"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Positions</span><input class="control" value="1"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Role and reporting line</span><input class="control" style="width:320px" value="Backend engineer, reports to the Payments lead"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Start date and budget source</span><input class="control" style="width:320px" value="October, from the platform budget"></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Justification</span><input class="control" style="width:320px" value="Replacing a leaver, same scope"></div>
      <div class="actions"><button class="btn btn--blue">Send request</button></div>
    </div>
  ko: |-
    <div class="screen">
      <h1>채용 요청</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">팀</span><input class="control" value="결제"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">인원</span><input class="control" value="1"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">직무와 보고 라인</span><input class="control" style="width:320px" value="백엔드 엔지니어, 결제팀 팀장에게 보고"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">시작 시점과 예산 출처</span><input class="control" style="width:320px" value="10월, 플랫폼 예산에서"></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">사유</span><input class="control" style="width:320px" value="퇴사자 충원, 업무 범위 동일"></div>
      <div class="actions"><button class="btn btn--blue">요청 보내기</button></div>
    </div>
prompt:
  en: >-
    Two in every three requests from this form come back with a follow-up
    question before recruiting can start. Which change to the form fixes that?
  ko: >-
    이 폼으로 들어온 요청 세 건 중 두 건은 채용을 시작하기 전에 되묻는 질문이
    한 번 오갑니다. 폼의 어느 곳을 바꿔야 그것이 없어질까요?
options:
  en:
    - text: Give each half of the two-part questions a box of its own
      reason: >-
        Nobody has to invent a way of fitting two answers on one line, and
        nothing has to be pulled apart at the other end to be filed.
      correct: true
    - text: Keep the fields as they are and put an example under each, showing both parts and the comma between them
      reason: >-
        The shape of the answer stops being a guess, which is what people
        hesitate over before typing.
    - text: Make the two-part fields required, so neither can be sent empty
      reason: >-
        A request can no longer be sent with a question left unanswered.
    - text: Turn the two-part fields into taller boxes with room for several lines
      reason: >-
        There is then space to set both answers out properly rather than
        squeezing them onto one line.
  ko:
    - text: 두 개짜리 질문의 각 절반에 자기 칸을 하나씩 줍니다
      reason: >-
        답 두 개를 한 줄에 욱여넣을 방법을 궁리하는 사람이 없어지고, 받는 쪽에서도
        정리하려고 다시 갈라낼 것이 없어집니다.
      correct: true
    - text: 칸은 그대로 두고, 각 칸 아래에 두 부분과 그 사이 쉼표까지 보여 주는 예시를 답니다
      reason: >-
        답의 생김새를 짐작하지 않아도 되고, 사람들이 입력 전에 망설이는 지점이
        바로 그것입니다.
    - text: 두 개짜리 질문을 필수 입력으로 만들어 비운 채로 보낼 수 없게 합니다
      reason: >-
        질문 하나를 답하지 않은 채로 요청이 넘어가는 일이 없어집니다.
    - text: 두 개짜리 질문의 칸을 여러 줄이 들어가는 높은 칸으로 바꿉니다
      reason: >-
        한 줄에 밀어 넣는 대신 두 답을 제대로 펼쳐 적을 자리가 생깁니다.
---
