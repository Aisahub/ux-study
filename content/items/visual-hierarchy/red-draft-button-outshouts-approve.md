---
sourceSection: '1. Color and contrast'
principles:
  - contrast
  - visual-hierarchy
artefact:
  en: >-
    An invoice-approval screen in an internal finance tool. The heading
    "Invoice approval" sits at the top in dark grey. Below it, three buttons
    stand in a row. "Save draft" is a solid red rectangle with white text.
    "Refer to finance" is a dark grey outline on white. "Approve payment" — the
    one action that moves money, and the reason anyone opens this screen — is
    light grey text on a white background with no border at all. A muted line
    underneath reads "23 invoices waiting".
  ko: >-
    사내 재무 도구의 결재 화면입니다. 맨 위에 "청구서 결재"라는 제목이 짙은
    회색으로 놓여 있습니다. 그 아래에는 버튼 세 개가 나란히 있습니다. "임시
    저장"은 빨강으로 꽉 채운 사각형에 흰 글자입니다. "재무팀에 문의"는 흰
    바탕에 짙은 회색 외곽선입니다. 정작 돈이 나가는 동작이자 이 화면을 여는
    이유인 "결재 승인"은 흰 바탕에 옅은 회색 글자뿐이고 테두리조차 없습니다.
    그 아래에 "대기 중인 청구서 23건"이 흐릿하게 적혀 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Invoice approval</h1>
      <div class="actions">
        <button class="btn btn--danger">Save draft</button>
        <button class="btn btn--outline">Refer to finance</button>
        <button class="btn btn--ghost">Approve payment</button>
      </div>
      <p class="note">23 invoices waiting</p>
    </div>
  ko: |-
    <div class="screen">
      <h1>청구서 결재</h1>
      <div class="actions">
        <button class="btn btn--danger">임시 저장</button>
        <button class="btn btn--outline">재무팀에 문의</button>
        <button class="btn btn--ghost">결재 승인</button>
      </div>
      <p class="note">대기 중인 청구서 23건</p>
    </div>
prompt:
  en: >-
    Which change fixes what this screen's colours are saying?
  ko: >-
    이 화면의 색이 하는 말을 바로잡으려면 무엇을 바꿔야 할까요?
options:
  en:
    - text: Give "Approve payment" the strongest contrast, and return "Save draft" to a quiet outline
      reason: >-
        Red should be held back for telling someone something has gone wrong,
        not spent on a routine action.
      correct: true
    - text: Take the red off "Save draft" and change nothing else
      reason: >-
        The shouting stops without touching the rest of the screen.
    - text: Make "Approve payment" red as well
      reason: >-
        The two buttons a user chooses between then look like a matched pair.
    - text: Leave the colours alone and enlarge "Approve payment"
      reason: >-
        Grow it until it is the biggest thing on the screen.
  ko:
    - text: '"결재 승인"에 가장 강한 대비를 주고, "임시 저장"은 조용한 외곽선으로 되돌립니다'
      reason: >-
        빨강은 무언가 잘못됐다고 알릴 때 쓰려고 아껴 두는 색이지, 일상적인
        동작에 쓸 색이 아닙니다.
      correct: true
    - text: '"임시 저장"에서 빨강만 걷어내고 나머지는 그대로 둡니다'
      reason: >-
        화면의 다른 곳을 건드리지 않고도 소리치는 것은 멈춥니다.
    - text: '"결재 승인"도 빨강으로 칠합니다'
      reason: >-
        사용자가 둘 중 하나를 고르는 버튼끼리 한 쌍으로 보이게 됩니다.
    - text: 색은 그대로 두고 "결재 승인"을 키웁니다
      reason: >-
        화면에서 가장 큰 요소가 될 때까지 키웁니다.
---
