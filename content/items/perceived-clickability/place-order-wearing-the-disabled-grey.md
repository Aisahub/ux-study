---
sourceSection: 'Enabled State'
principles:
  - contrast
  - disabled-state
artefact:
  en: >-
    The checkout footer of an internal supply-ordering tool. "Place order" —
    the only action that finishes the job, and fully working — is mid-grey
    text on a light-grey fill with no border. Everywhere else in this tool,
    that exact grey-on-grey treatment is what genuinely unavailable buttons
    wear. Next to it, "Back to cart" is a white button with a dark border and
    dark text, the strongest-looking element in the footer.
  ko: >-
    사내 비품 주문 도구의 결제 화면 하단입니다. 일을 끝내는 유일한 동작이자
    멀쩡히 동작하는 "주문하기"가 옅은 회색 바탕에 중간 회색 글자로, 테두리
    없이 놓여 있습니다. 이 도구의 다른 모든 화면에서 정말로 쓸 수 없는
    버튼이 바로 그 회색-위-회색 차림을 하고 있습니다. 그 옆의 "장바구니로
    돌아가기"는 흰 바탕에 짙은 테두리와 짙은 글자를 갖춰, 하단에서 가장
    강해 보이는 요소입니다.
prompt:
  en: >-
    The orders team reports that people reach this page and stall, unsure how
    to finish. What does the screenshot say went wrong?
  ko: >-
    주문 담당 팀에 따르면 사람들이 이 화면까지 와서는 어떻게 끝내야 할지
    몰라 멈춰 섭니다. 스크린샷이 말해 주는 원인은 무엇일까요?
options:
  en:
    - text: >-
        "Place order" wears this tool's disabled treatment while being the one
        action the page exists for — give it a solid, high-contrast fill so it
        reads as available and primary at a glance.
      correct: true
    - text: >-
        Nothing in the screenshot is wrong — availability is signalled on
        approach, when the cursor turns to a pointer over the button.
    - text: >-
        "Back to cart" is the defect — remove it, and the one button left is
        the one to press.
    - text: >-
        The greys can stay; make "Place order" twice the size of "Back to
        cart", since size is what marks the primary action.
  ko:
    - text: >-
        이 화면의 존재 이유인 단 하나의 동작 "주문하기"가 이 도구의 비활성
        차림을 하고 있습니다 — 강한 대비의 채움 버튼으로 바꿔 한눈에 지금
        누를 수 있는 주요 동작으로 읽히게 합니다.
      correct: true
    - text: >-
        스크린샷에는 잘못된 것이 없습니다 — 누를 수 있다는 신호는 버튼에
        다가갔을 때 커서가 손가락 모양으로 바뀌는 것으로 전달됩니다.
    - text: >-
        결함은 "장바구니로 돌아가기"입니다 — 그 버튼을 없애면 남는 버튼
        하나가 곧 눌러야 할 버튼입니다.
    - text: >-
        회색은 그대로 두고 "주문하기"를 "장바구니로 돌아가기"의 두 배
        크기로 키웁니다. 주요 동작을 표시하는 것은 크기니까요.
---
