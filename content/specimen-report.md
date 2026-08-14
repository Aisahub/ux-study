---
# The specimen Self-Audit Report — ADR-0011's artefact B (#119).
#
# A report this project wrote as if a Learner had written it, of deliberately
# mixed quality. It is what a Learner practises reviewing on the way to the
# heuristic-evaluation Competency: always here, needing nobody, and with an
# answer we know because we wrote both this and the manifest it reviews.
#
# It reviews the STAGE 1 Practice Page, not Stage 3's subject. By the time
# anyone reads this they have submitted their Stage 1 report and been shown
# that page's Planted Defect manifest, so a review of it leaks nothing and the
# reader can spend their attention on the quality of the review rather than on
# re-finding defects they were told about a Stage ago. A specimen about Stage
# 3's own subject would simply be its answer key.
#
# Every Finding here obeys the rules `addFinding` puts on a real submission —
# the element exists on the page, the Principle is a Glossary slug, no two
# Findings share an element. A specimen the platform would have refused is not
# a specimen. So all of the wrongness lives in the prose, never in the record:
#
#   sound           the Finding is right, and argued against the Principle it
#                   names, in words somebody else could act on
#   wrong-principle the element is right and the observation is right, but the
#                   Principle selected is not the one this element breaks
#   taste           a preference wearing a Principle's name; nothing is said
#                   about what goes wrong for a reader, so nobody can act on it
#   not-a-defect    an ordinary arrangement read as a fault; the proposed fix
#                   would introduce the defect the Finding claims to have found
#
# `quality` is authoring-side and never reaches a Learner — `specimenAsServed`
# drops it, the way the Practice Page's own comments are stripped before it is
# served. Telling the reader which is which would answer the exercise. What
# settles it for them is the manifest they were already shown.
#
# The mix is one field shared by both languages, so the two variants cannot
# drift into reports of unequal quality: there is no way to spell a Finding
# that is sound in English and taste in Korean.
#
# The order is the order somebody would have noticed these things, and it is
# deliberately not the order the shapes are listed in above. Stripping the
# label off a report still sorted by quality would leave the ranking in the
# sequence — the two strongest opening it and the invented one closing it — so
# no two neighbours share a shape, and the suite holds that.
#
# Every element named here is named as the Learner's own screen names it, in
# their own language. `Export CSV` and `CSV 내보내기` are one button, and a
# Korean reader sent to the English string is being pointed at nothing.
subject: 1
# The Competency whose page links here. Heuristic evaluation is the ability to
# judge somebody else's finding against a named heuristic, and this report is
# what there is to practise that on.
competency: heuristic-evaluation
findings:
  - element: confirm-selected-orders
    principle: contrast
    quality: sound
    defect:
      en: >-
        Confirming selected orders is the one thing this page is for, and its
        button is the faintest control on the screen — pale grey on pale grey,
        weaker than the upgrade banner sitting above it. I read it as switched
        off, looked around for the real button, and came back to it only after
        running out of other things to press.
      ko: >-
        선택한 주문을 확정하는 것이 이 페이지의 존재 이유인데,
        그 버튼이 화면에서 가장 흐린 컨트롤입니다.
        옅은 회색 바탕에 옅은 회색 글자라 위쪽 업그레이드 배너보다도 약합니다.
        저는 비활성 상태라고 읽고 진짜 버튼을 찾아 두리번거리다가,
        더 눌러 볼 것이 없어진 뒤에야 다시 돌아왔습니다.
    fix:
      en: >-
        Give the confirm button the strongest contrast on the page and take
        that strength away from the banner, so the loudest thing on screen is
        the thing the page exists for.
      ko: >-
        페이지에서 가장 강한 대비를 확정 버튼에 주고, 배너에서는 그만큼 덜어
        내세요. 화면에서 가장 눈에 띄는 것이 이 페이지에서 해야 할 일이어야
        합니다.
  - element: order-search
    principle: consistency
    quality: taste
    defect:
      en: >-
        The search box sits at the left of the page head, between the title and
        Export CSV. Every admin dashboard I have used puts search over on the
        right, so this one feels backwards to me.
      ko: >-
        검색 칸이 페이지 맨 위 왼쪽, 제목과 CSV 내보내기 버튼 사이에 있습니다.
        제가 써 본 관리자 대시보드는 검색을 전부 오른쪽에 두던데,
        이 페이지는 반대라 어색합니다.
    fix:
      en: >-
        Move search to the right-hand end of the page head, where people expect
        to find it.
      ko: >-
        검색을 페이지 맨 위 오른쪽 끝으로 옮기세요. 다들 거기에 있으려니 하고
        찾습니다.
  - element: stat-last-refreshed
    principle: contrast
    quality: wrong-principle
    defect:
      en: >-
        The last-refreshed time is set in the largest type on this page, and it
        pulls the eye harder than the new-order count or the revenue — the two
        numbers I opened the page to see. Something nobody acts on should not
        be the strongest thing on the screen.
      ko: >-
        마지막 갱신 시각이 이 페이지에서 글자가 가장 큽니다.
        제가 이 페이지를 여는 이유인 신규 주문 수와 매출보다 시선을 더 강하게
        끕니다. 아무도 그것을 보고 움직이지 않는데 화면에서 가장 강할 이유가
        없습니다.
    fix:
      en: >-
        Turn the refresh time down so it stops competing with the figures
        beside it.
      ko: >-
        갱신 시각의 글자 크기를 줄여서 옆에 있는 숫자들과 경쟁하지 않게 하세요.
  - element: save-shipping
    principle: cognitive-load
    quality: not-a-defect
    defect:
      en: >-
        Save settings sits right at the bottom of the shipping form, so on a
        phone you have to scroll past every field before you can save anything.
        It should be reachable from the moment the form appears.
      ko: >-
        저장 버튼이 배송 폼의 맨 아래에 있어서, 휴대폰에서는 모든 칸을 지나
        스크롤해야 저장할 수 있습니다. 폼이 나타난 순간부터 닿을 수 있어야
        합니다.
    fix:
      en: >-
        Pin Save settings to the bottom of the screen so it is always in reach.
      ko: >-
        저장 버튼을 화면 맨 아래에 고정해서 언제든 누를 수 있게 하세요.
  - element: tax-invoice-link
    principle: signifier
    quality: sound
    defect:
      en: >-
        The monthly tax invoice is a link, but it is set in the same colour and
        weight as the sentence around it, with no underline and nothing that
        changes when the mouse crosses it. Nothing about it says it can be
        pressed, so it reads as a line about invoices rather than a way to get
        one.
      ko: >-
        월 세금계산서는 링크인데, 주변 문장과 색도 굵기도 같고, 밑줄도 없고,
        마우스를 올려도 달라지는 것이 없습니다. 누를 수 있다고 말해 주는 것이
        하나도 없어서, 계산서를 받는 방법이 아니라 계산서에 관한 한 줄 설명처럼
        읽힙니다.
    fix:
      en: >-
        Mark it as a link — underline it, put it in the link colour, and give
        it a visible hover and focus state so it can be found from the keyboard
        as well as with a mouse.
      ko: >-
        링크임을 드러내세요. 밑줄을 넣고 링크 색을 쓰고, 마우스를 올렸을 때와
        키보드 초점이 닿았을 때 눈에 보이게 바뀌도록 하세요.
  - element: upgrade-banner
    principle: visual-hierarchy
    quality: taste
    defect:
      en: >-
        The upgrade banner runs violet through pink into orange, and next to
        everything else here that gradient is garish. It makes the whole page
        look cheap. A muted tone would suit an internal tool far better.
      ko: >-
        업그레이드 배너가 보라에서 분홍을 지나 주황으로 넘어가는 그러데이션인데,
        나머지 화면과 나란히 두면 요란합니다. 페이지 전체가 싸구려처럼 보입니다.
        사내에서 쓰는 도구라면 훨씬 차분한 색이 어울립니다.
    fix:
      en: >-
        Change the banner to a softer colour.
      ko: >-
        배너를 좀 더 차분한 색으로 바꾸세요.
---
