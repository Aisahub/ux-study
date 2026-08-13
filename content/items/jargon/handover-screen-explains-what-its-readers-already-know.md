---
sourceSection: 'If Most Readers Know the Term, Use It Without Explanation'
principles:
  - plain-language
artefact:
  en: >-
    The shift-handover list in a hospital ward tool, signed into by ward nurses
    and by nobody else. Four patients are listed by bed number and surname.
    Each line states one clinical fact, and after each clinical word a
    parenthesis restates it in ordinary words: "nil by mouth (not allowed to
    eat or drink)", "contraindicated (must not be given)", "for discharge
    (going home)", "pressure area care (turning to protect the skin)". The
    lines run to two rows each because of it. A "Start handover" button sits at
    the foot.
  ko: >-
    병동 근무 교대 인계 목록입니다. 이 화면에 로그인하는 사람은
    병동 간호사뿐입니다. 환자 네 명이 병상 번호와 성으로 나열되어 있습니다. 각 줄에는 임상
    사항이 하나씩 적혀 있는데, 임상 용어마다 뒤에 괄호를 열어 같은 말을 다시
    쉬운 말로 풀어 놓았습니다. "금식(먹지도 마시지도 못함)", "금기(주면 안 됨)",
    "퇴원 예정(집으로 감)", "체위 변경(피부 보호를 위해 돌려 눕힘)" 같은
    식입니다. 그 바람에 줄마다 두 줄씩 차지합니다. 맨 아래에는 "인계 시작"
    버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Shift handover · Ward 4B</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>Bed</th><th>Patient</th><th>Note for the next shift</th></tr></thead>
          <tbody>
            <tr><td>12</td><td>Aliyeva</td><td>Nil by mouth (not allowed to eat or drink) from midnight</td></tr>
            <tr><td>14</td><td>Boateng</td><td>Ibuprofen contraindicated (must not be given)</td></tr>
            <tr><td>15</td><td>Salleh</td><td>For discharge (going home) once bloods are back</td></tr>
            <tr><td>18</td><td>Nowak</td><td>Two-hourly pressure area care (turning to protect the skin)</td></tr>
          </tbody>
        </table>
      </div>
      <div class="actions actions--end" style="margin-top:14px">
        <button class="btn btn--blue">Start handover</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>근무 교대 인계 · 4B 병동</h2>
      <div class="scroller">
        <table class="table">
          <thead><tr><th>병상</th><th>환자</th><th>다음 근무자에게</th></tr></thead>
          <tbody>
            <tr><td>12</td><td>김○○</td><td>자정부터 금식(먹지도 마시지도 못함)</td></tr>
            <tr><td>14</td><td>이○○</td><td>이부프로펜 금기(주면 안 됨)</td></tr>
            <tr><td>15</td><td>박○○</td><td>혈액검사 결과 나오면 퇴원 예정(집으로 감)</td></tr>
            <tr><td>18</td><td>정○○</td><td>2시간마다 체위 변경(피부 보호를 위해 돌려 눕힘)</td></tr>
          </tbody>
        </table>
      </div>
      <div class="actions actions--end" style="margin-top:14px">
        <button class="btn btn--blue">인계 시작</button>
      </div>
    </div>
prompt:
  en: >-
    Only ward nurses can open this screen, and it is read standing up between
    shifts. Which change should it make?
  ko: >-
    이 화면을 열 수 있는 사람은 병동 간호사뿐이고, 교대 사이에 선 채로 읽는
    화면입니다. 이 화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Delete the parentheses and leave the clinical words standing alone
      reason: >-
        These readers use these words at work, so the restatement adds a line to
        read without adding anything to know.
      correct: true
    - text: Move each parenthesis into a tooltip on the clinical word
      reason: >-
        The lines come back down to one row each while the plain wording stays
        reachable for anyone who wants it.
    - text: Keep the parentheses and set them smaller and grey
      reason: >-
        The clinical word leads the line, and the restatement stops competing
        with it for attention.
    - text: Delete the clinical words and keep the plain wording only
      reason: >-
        Every line is then written in words that need nothing learned before
        they can be read.
  ko:
    - text: 괄호를 지우고 임상 용어만 남깁니다
      reason: >-
        이 화면을 읽는 사람들은 그 말을 업무에서 쓰는 사람들이므로, 다시 풀어
        쓴 부분은 읽을 줄만 늘릴 뿐 알게 해 주는 것이 없습니다.
      correct: true
    - text: 괄호 안의 말을 임상 용어에 마우스를 올리면 뜨는 설명으로 옮깁니다
      reason: >-
        줄이 다시 한 줄로 줄어들면서도, 쉬운 말이 필요한 사람은 여전히 볼 수
        있습니다.
    - text: 괄호는 그대로 두되 더 작게, 회색으로 설정합니다
      reason: >-
        임상 용어가 줄의 앞자리를 지키고, 풀어 쓴 말이 시선을 두고 다투지
        않습니다.
    - text: 임상 용어를 지우고 쉬운 말만 남깁니다
      reason: >-
        그러면 모든 줄이 미리 배워 두어야 읽히는 말 없이 적히게 됩니다.
---
