---
name:
  en: Visual hierarchy
  ko: 시각적 위계
objective:
  en: >-
    Given any page, say where a first-time visitor's eye lands first, and name
    at least one element whose visual weight does not match its actual
    importance.
  ko: >-
    어떤 페이지를 놓고도, 처음 방문한 사용자의 시선이 어디에 먼저 닿는지 말하고,
    시각적 비중이 실제 중요도와 어긋나는 요소를 하나 이상 짚어낼 수 있다.
roleHint:
  developer:
    en: >-
      Put a screen you built on your monitor and notice where your own eye
      lands first — is that where you meant it to go?
    ko: >-
      직접 만든 화면을 띄워 놓고 자신의 시선이 어디에 먼저 가는지 보세요 —
      의도한 자리인가요?
  pm:
    en: >-
      Walk a flow you signed off and check, screen by screen, whether the most
      important action is also the most prominent one.
    ko: >-
      승인한 플로우를 화면 단위로 짚으며 가장 중요한 동작이 실제로 가장 눈에
      띄는지 확인해 보세요.
preReadingQuestions:
  - en: >-
      What tools does the article give a designer for making one element draw
      the eye before another?
    ko: >-
      한 요소가 다른 요소보다 먼저 시선을 끌게 만들 때, 이 글은 디자이너에게
      어떤 수단들을 제시하는가?
  - en: >-
      Why does the article treat contrast, rather than colour itself, as what
      makes an element stand out?
    ko: >-
      이 글은 왜 요소를 돋보이게 만드는 것이 색 자체가 아니라 대비라고
      말하는가?
  - en: >-
      What is the squint test, and what should still be visible on a well-built
      page when you try it?
    ko: >-
      실눈 테스트란 무엇이고, 잘 만든 페이지라면 실눈을 뜨고 봐도 무엇이 여전히
      보여야 하는가?
source:
  url: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
  attribution: >-
    Kelley Gordon, "Visual Hierarchy in UX: Definition", Nielsen Norman Group,
    2021
koTranslationNotice: >-
  원문은 영어로 쓰여 있습니다. 그대로 읽어도 충분하고, 필요하면 브라우저의
  페이지 번역 기능을 켜서 함께 봐도 됩니다. 다만 용어만큼은 이 플랫폼의 원칙
  용어집에 있는 한국어 이름을 기준으로 삼으세요 — 자동 번역은 같은 용어를 매번
  다르게 옮깁니다.
# The written-explanation trial (#29): exactly one Competency carries a full
# explanation of its own, so the cost and quality of writing one is a measured
# fact before the other three are committed to. Original prose throughout —
# nothing here reproduces the source article (ADR-0002).
explanation:
  en: >-
    A page never gets read top to bottom. A first-time visitor's eye jumps to
    whatever pulls hardest, then to the next-strongest pull, and the order of
    those jumps is the page's real table of contents — whatever you meant the
    order to be. Visual hierarchy is the craft of making that order match
    importance, and it is built from a small set of levers.


    The strongest lever is contrast: how sharply an element separates from
    what surrounds it. Not colour itself — a red button on a red-toned page
    disappears, while a grey one on white can dominate. What matters is the
    distance between the element and its neighbourhood, in tone, in weight,
    in texture. Because contrast is relative, it is also a budget: give five
    things strong contrast and none of them has any. Spend it where the
    importance is.


    The second lever is scale. Bigger reads as more important, before a
    single word is understood — which means a page announces its priorities
    through sizes whether anyone chose them or not. If the largest text on
    the screen is a timestamp, the page is saying the timestamp matters most,
    and no amount of correct labelling argues it back.


    The third lever is position and grouping. Things that sit close together
    read as belonging together; a shared background or a drawn border says
    "one unit" louder than any heading. Spacing is not the absence of design
    — it is the design, deciding which label belongs to which field and
    where one section ends.


    Two disciplines keep the levers honest. First, every signal should agree:
    when size says "important" but contrast says "ignore me", the visitor
    pays with a moment of doubt on every glance. Second, no signal may carry
    meaning alone if some visitors cannot receive it — colour-blindness makes
    a colour-only status light unreadable, so colour needs a second channel:
    a shape, a position, a word.


    The cheapest check costs nothing: step back and squint. Detail drops
    away, and only the hierarchy is left. If what still stands out is what
    the page exists for, the hierarchy is doing its work. If what survives is
    a promotional banner and a refresh time, you have found tomorrow's first
    fix.
  ko: >-
    페이지는 결코 위에서 아래로 차례차례 읽히지 않습니다. 처음 온 방문자의
    시선은 가장 세게 끌어당기는 곳으로 먼저 튀고, 그다음으로 센 곳으로
    옮겨 갑니다. 그 튀는 순서가 페이지의 진짜 목차입니다 — 여러분이 의도한
    순서가 무엇이었든 상관없이요. 시각적 위계란 그 순서를 중요도와 일치시키는
    기술이고, 몇 가지 안 되는 지렛대로 만들어집니다.


    가장 강한 지렛대는 대비입니다. 요소가 주변과 얼마나 날카롭게
    구분되는가 — 색 자체가 아닙니다. 붉은 톤의 페이지 위 빨간 버튼은
    사라지고, 흰 바탕 위 회색 버튼이 오히려 화면을 지배할 수 있습니다.
    중요한 것은 요소와 그 주변 사이의 거리입니다. 명도에서, 굵기에서,
    질감에서. 대비는 상대적이기 때문에 예산이기도 합니다. 다섯 군데에 강한
    대비를 주면 어느 곳에도 대비가 없습니다. 중요한 곳에 쓰세요.


    두 번째 지렛대는 크기입니다. 큰 것은 단어 하나를 읽기도 전에 더
    중요하게 읽힙니다. 그래서 페이지는 누가 정했든 안 정했든 크기를 통해
    우선순위를 선언하고 있습니다. 화면에서 가장 큰 글자가 갱신 시각이라면,
    그 페이지는 갱신 시각이 제일 중요하다고 말하는 중입니다. 라벨을 아무리
    바르게 달아도 그 선언을 뒤집지 못합니다.


    세 번째 지렛대는 위치와 묶음입니다. 가까이 붙은 것들은 한 덩어리로
    읽히고, 공유하는 배경이나 둘러친 테두리는 어떤 제목보다 크게 "하나"라고
    말합니다. 여백은 디자인이 빠진 자리가 아니라 디자인 그 자체입니다 —
    어느 라벨이 어느 입력칸의 것인지, 한 구역이 어디서 끝나는지를 여백이
    결정합니다.


    지렛대들을 바르게 쓰는 규율이 둘 있습니다. 첫째, 신호는 서로 합의해야
    합니다. 크기는 "중요하다"고 말하는데 대비는 "무시해도 된다"고 말하면,
    방문자는 눈길이 갈 때마다 잠깐의 의심으로 값을 치릅니다. 둘째, 일부
    방문자가 받을 수 없는 신호에 의미를 홀로 실어서는 안 됩니다. 색약이
    있으면 색으로만 말하는 상태 표시는 읽을 수 없으니, 색에는 두 번째
    통로가 필요합니다 — 모양, 위치, 또는 글자.


    가장 싼 점검은 공짜입니다. 물러서서 실눈을 뜨세요. 세부가 사라지고
    위계만 남습니다. 그때도 도드라지는 것이 페이지의 존재 이유라면 위계는
    제 일을 하고 있는 것입니다. 살아남은 것이 홍보 배너와 갱신 시각이라면,
    내일 처음 고칠 곳을 찾은 겁니다.
---
