---
sourceSection: 'Button States vs. Button Styles'
principles:
  - contrast
artefact:
  en: >-
    The footer of a purchase-request form. Two buttons sit side by side, both
    solid green rounded rectangles with bold white 15px labels, identical in
    width and height: "Submit request", which sends the form to an approver,
    and "Save draft", which keeps it private. New staff regularly send
    half-finished requests to their approver by mistake.
  ko: >-
    구매 요청 폼의 하단입니다. 버튼 두 개가 나란히 있는데, 둘 다 초록으로
    꽉 채운 둥근 사각형에 굵은 흰 15px 글자이고 너비와 높이까지 똑같습니다.
    "요청 제출"은 폼을 결재자에게 보내고, "임시 저장"은 나만 볼 수 있게
    보관합니다. 새로 온 직원들이 쓰다 만 요청서를 실수로 결재자에게 보내는
    일이 계속 생깁니다.
screen:
  en: |-
    <div class="screen">
      <div class="field" style="margin-bottom:10px"><span class="field-label">Item</span><input class="control" value="Standing desk, oak"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Quantity</span><input class="control" value="2"></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Approver</span><input class="control" value="Dana Whitfield"></div>
      <div class="actions" style="border-top:1px solid #eceef1;padding-top:14px">
        <button class="btn btn--green" style="width:160px;font-size:15px">Submit request</button>
        <button class="btn btn--green" style="width:160px;font-size:15px">Save draft</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <div class="field" style="margin-bottom:10px"><span class="field-label">품목</span><input class="control" value="스탠딩 데스크, 오크"></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">수량</span><input class="control" value="2"></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">결재자</span><input class="control" value="박서연"></div>
      <div class="actions" style="border-top:1px solid #eceef1;padding-top:14px">
        <button class="btn btn--green" style="width:160px;font-size:15px">요청 제출</button>
        <button class="btn btn--green" style="width:160px;font-size:15px">임시 저장</button>
      </div>
    </div>
prompt:
  en: >-
    What should these two buttons look like?
  ko: >-
    이 두 버튼은 어떤 모습이어야 할까요?
options:
  en:
    - text: >-
        Keep "Submit request" as the filled primary and drop "Save draft" to a
        quieter secondary — an outline or plain text — so the two ranks read
        differently before anything is clicked.
      correct: true
    - text: >-
        Exactly as they are — buttons should differ in their states, not in
        their styles, and two identical buttons are the easiest pair to scan.
    - text: >-
        Make both buttons outlines, so that only the labels distinguish them
        and neither invites a hasty click.
    - text: >-
        Colour "Save draft" red so that the two are impossible to confuse at a
        glance.
  ko:
    - text: >-
        "요청 제출"은 채움 주요 버튼으로 남기고 "임시 저장"은 외곽선이나
        평문 같은 조용한 보조 차림으로 낮춥니다. 누르기 전에 이미 두 버튼의
        급이 다르게 읽히도록요.
      correct: true
    - text: >-
        지금 그대로가 맞습니다 — 버튼은 스타일이 아니라 상태로 달라져야
        하고, 똑같이 생긴 두 버튼이 훑어보기에는 가장 편합니다.
    - text: >-
        두 버튼 모두 외곽선 버튼으로 바꿔서, 글자만으로 구분되게 하고 어느
        쪽도 성급한 클릭을 부르지 않게 합니다.
    - text: >-
        "임시 저장"을 빨강으로 칠해서 두 버튼을 한눈에도 헷갈릴 수 없게
        합니다.
---
