---
sourceSection: Avoid Using Placeholders
principles:
  - cognitive-load
artefact:
  en: >-
    An expense claim in an internal finance tool, headed "New expense claim",
    shown at two moments. In the first, six empty boxes run down the page. No
    box has anything written beside it or above it; the only words anywhere are
    the grey words sitting inside the boxes themselves — merchant, date, amount,
    project code, cost centre, what it was for. A "Submit claim" button sits at
    the bottom. In the second, the same six boxes each hold what was typed into
    them: "Blue Ridge Coffee", "03/08/2026", "$46.80", "PX-4471", "4471-02" and
    "Kick-off with Meridian". The grey words are gone from all six, and no box
    carries a name of any kind. The form is otherwise identical.
  ko: >-
    사내 재무 도구의 경비 청구 화면입니다. 제목은 "경비 청구"이고, 두 시점의 모습을
    보여 줍니다. 첫 번째에는 빈 칸 여섯 개가 아래로 이어집니다. 어느 칸에도 옆이나
    위에 적힌 글자가 없고, 화면에 있는 글자는 칸 안에 회색으로 들어앉은 것뿐입니다
    — 가맹점, 날짜, 금액, 프로젝트 코드, 코스트 센터, 지출 사유. 맨 아래에 "청구
    제출" 버튼이 있습니다. 두 번째에는 같은 칸 여섯 개가 각각 입력된 값을 담고
    있습니다 — "블루리지 커피", "2026-08-03", "46,800원", "PX-4471", "4471-02",
    "메리디안 착수 미팅". 여섯 칸 모두에서 회색 글자는 사라졌고, 어느 칸에도 이름이
    남아 있지 않습니다. 그 밖의 화면은 첫 번째와 같습니다.
sequence:
  - caption:
      en: The claim form as it opens
      ko: 청구 화면이 열린 직후
    screen:
      en: |-
        <div class="screen">
          <h1>New expense claim</h1>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="Merchant"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="Date"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="Amount"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="Project code"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="Cost centre"></div>
          <div style="margin-bottom:16px"><input class="control control--empty" style="width:320px" value="" placeholder="What it was for"></div>
          <div class="actions"><button class="btn btn--blue">Submit claim</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>경비 청구</h1>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="가맹점"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="날짜"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="금액"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="프로젝트 코드"></div>
          <div style="margin-bottom:10px"><input class="control control--empty" style="width:320px" value="" placeholder="코스트 센터"></div>
          <div style="margin-bottom:16px"><input class="control control--empty" style="width:320px" value="" placeholder="지출 사유"></div>
          <div class="actions"><button class="btn btn--blue">청구 제출</button></div>
        </div>
  - caption:
      en: After all six boxes have been typed into
      ko: 여섯 칸을 모두 입력한 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>New expense claim</h1>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="Blue Ridge Coffee"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="03/08/2026"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="$46.80"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="PX-4471"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="4471-02"></div>
          <div style="margin-bottom:16px"><input class="control" style="width:320px" value="Kick-off with Meridian"></div>
          <div class="actions"><button class="btn btn--blue">Submit claim</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>경비 청구</h1>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="블루리지 커피"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="2026-08-03"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="46,800원"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="PX-4471"></div>
          <div style="margin-bottom:10px"><input class="control" style="width:320px" value="4471-02"></div>
          <div style="margin-bottom:16px"><input class="control" style="width:320px" value="메리디안 착수 미팅"></div>
          <div class="actions"><button class="btn btn--blue">청구 제출</button></div>
        </div>
prompt:
  en: >-
    Claims from this form keep arriving with the two code values in each other's
    places. Which change fixes that?
  ko: >-
    이 폼으로 들어오는 청구서에는 코드 두 개가 서로 자리를 바꿔 담겨 오는 일이
    잦습니다. 무엇을 바꿔야 그것이 없어질까요?
options:
  en:
    - text: Give every box a name that sits outside it and stays there once the box is filled
      reason: >-
        Anyone checking an entry before submitting can then see what that box was
        asked for, and nothing has to be emptied to find out.
      correct: true
    - text: Put the two code boxes at opposite ends of the form so they are never filled in one after the other
      reason: >-
        The two are never in front of the person at the same moment, which is
        where one gets typed into the other.
    - text: Darken the grey of the words inside the boxes so they read clearly against the white
      reason: >-
        Those words are faint, and this is a one-line change that makes every one
        of them easier to read.
    - text: Check the two codes against each other on submit and refuse a claim whose pair does not match the project
      reason: >-
        A swapped pair never reaches the finance team, and the person is told
        while the claim is still theirs to fix.
  ko:
    - text: 모든 칸에 칸 밖에 놓이는 이름을 주고, 값이 채워진 뒤에도 그 자리에 남아 있게 합니다
      reason: >-
        제출 전에 입력한 값을 확인하려는 사람이 그 칸이 무엇을 물었는지 바로 볼 수
        있고, 알아보려고 칸을 비울 일이 없어집니다.
      correct: true
    - text: 코드 두 칸을 폼의 양 끝으로 떼어 놓아 연달아 입력하지 않게 합니다
      reason: >-
        두 칸이 한 순간에 함께 눈앞에 놓이는 일이 없어지는데, 하나를 다른 칸에
        입력하는 것은 바로 그때 일어납니다.
    - text: 칸 안 회색 글자를 더 진하게 만들어 흰 바탕에서 또렷하게 읽히도록 합니다
      reason: >-
        그 글자들이 흐릿한 것은 사실이고, 한 줄만 고치면 여섯 개 모두가 읽기 쉬워
        집니다.
    - text: 제출할 때 두 코드를 서로 맞춰 보고, 프로젝트와 맞지 않는 쌍이면 청구를 되돌립니다
      reason: >-
        바뀐 쌍이 재무팀까지 가지 않고, 아직 본인 손에 있는 동안 알려 줍니다.
---
