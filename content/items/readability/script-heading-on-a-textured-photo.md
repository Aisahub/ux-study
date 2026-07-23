---
sourceSection: Legibility
principles:
  - legibility
  - contrast
artefact:
  en: >-
    A café's brunch page. The heading "Sunday brunch, booked fresh" is set in
    an ornate handwriting script at 64px, pale gold #C8B078, laid directly
    over a photo of latte art on a wooden table. Below it, the body copy is
    three short paragraphs in a plain 15px sans-serif, #333333 on a solid
    cream panel, lines around 55 characters with a line height of 1.6. A
    teammate has filed the page under "readability problem".
  ko: >-
    카페의 브런치 페이지입니다. 제목 "주말 브런치, 예약은 미리"가 화려한
    손글씨풍 서체 64px, 옅은 금색 #C8B078로, 나무 탁자 위 라테 아트 사진 바로
    위에 얹혀 있습니다. 그 아래 본문은 평범한 고딕체 15px, 단색 크림 패널 위
    #333333으로 된 짧은 문단 세 개이고, 한 줄은 30자 안팎에 행간 1.6입니다.
    한 팀원이 이 페이지를 "가독성 문제"로 등록해 두었습니다.
screen:
  en: |-
    <div class="screen" style="padding:0;overflow:hidden">
      <div class="photo" style="border-radius:0;padding:40px 24px">
        <p class="script" style="font-size:64px;color:#C8B078;margin:0;line-height:1.1">Sunday brunch, booked fresh</p>
      </div>
      <div style="background:#F7F0E4;padding:20px">
        <div class="prose" style="font-size:15px;line-height:1.6;max-width:55ch;color:#333333">
          <p>We bake through the night and open the doors at nine, so the counter is full when you arrive.</p>
          <p>Tables are held for fifteen minutes. After that we give them to whoever is waiting at the door.</p>
          <p>Book for four or more and we will set the long table by the window, which is the warmest seat we have.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen" style="padding:0;overflow:hidden">
      <div class="photo" style="border-radius:0;padding:40px 24px">
        <p class="script" style="font-size:64px;color:#C8B078;margin:0;line-height:1.1">주말 브런치, 예약은 미리</p>
      </div>
      <div style="background:#F7F0E4;padding:20px">
        <div class="prose" style="font-size:15px;line-height:1.6;max-width:30em;color:#333333">
          <p>밤새 구워 아홉 시에 문을 엽니다. 오시면 진열대가 가득 차 있습니다.</p>
          <p>예약석은 15분까지 잡아 둡니다. 그 뒤에는 문 앞에서 기다리시는 분께 드립니다.</p>
          <p>네 분 이상 예약하시면 창가 긴 테이블을 준비해 드립니다. 저희 가게에서 가장 볕이 좋은 자리입니다.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Where does this page actually fail, and as what kind of problem?
  ko: >-
    이 페이지는 실제로 어디에서, 어떤 종류의 문제로 무너지고 있을까요?
options:
  en:
    - text: >-
        In the heading, as a legibility problem — script letterforms in pale
        gold over a busy photo cannot be told apart. The body block is short,
        plain, and comfortably set; it is not the trouble.
      correct: true
    - text: >-
        In the body, as a readability problem — the copy should be rewritten
        to a lower reading level so more visitors can follow it.
    - text: >-
        Nowhere serious — at 64px the heading is far above any minimum size,
        and a reasonably large size is what the guidance asks of a heading.
    - text: >-
        In both, equally — mixing a script face with a plain face is the
        defect, and setting the whole page in one typeface resolves it.
  ko:
    - text: >-
        제목에서, 판독성 문제로 무너집니다 — 복잡한 사진 위에 옅은 금색
        손글씨 획이 얹혀 글자를 서로 구별할 수 없습니다. 본문 덩어리는 짧고
        평이하며 편하게 짜여 있으니 문제가 아닙니다.
      correct: true
    - text: >-
        본문에서, 가독성 문제로 무너집니다 — 더 많은 방문자가 따라올 수 있게
        본문을 더 쉬운 수준의 문장으로 다시 써야 합니다.
    - text: >-
        심각한 곳은 없습니다 — 64px면 어떤 최소 크기든 훨씬 웃돌고, 제목에
        요구되는 것은 충분히 큰 크기이기 때문입니다.
    - text: >-
        둘 다에서 똑같이 무너집니다 — 손글씨체와 고딕체를 섞은 것 자체가
        결함이고, 페이지 전체를 한 서체로 통일하면 해결됩니다.
---
