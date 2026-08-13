---
sourceSection: 'Search Bars'
principles:
  - mental-model
artefact:
  en: >-
    The help centre of an online pharmacy, at two moments. In the first, a
    search box sits under the heading "Help centre" with the placeholder
    "Search". In the second, "ibuprofen 200mg" has been typed and submitted,
    and the page below reads "No results for 'ibuprofen 200mg'", with a link
    offering "Browse help topics". The site's main navigation — Shop,
    Prescriptions, Help, Account — is above both. The pharmacy does stock
    ibuprofen 200mg.
  ko: >-
    온라인 약국의 고객센터를 두 시점에 걸쳐 보여 줍니다. 첫 시점에는
    "고객센터"라는 제목 아래에 "검색"이라는 안내 문구가 든 검색창이 있습니다. 두 번째
    시점에는 "이부프로펜 200mg"을 입력해 검색한 뒤이고, 아래에는 "'이부프로펜
    200mg'에 대한 결과가 없습니다"라고 적혀 있으며 "도움말 주제 둘러보기" 링크가
    하나 있습니다. 사이트의 주 메뉴인 쇼핑, 처방전, 고객센터, 내 정보는 두 시점
    모두 위에 있습니다. 이 약국은 이부프로펜 200mg을 실제로 판매합니다.
sequence:
  - caption:
      en: The help centre as it opens
      ko: 고객센터를 연 화면
    screen:
      en: |-
        <div class="screen">
          <div class="tabs"><span class="tab">Shop</span><span class="tab">Prescriptions</span><span class="tab tab--on">Help</span><span class="tab">Account</span></div>
          <h2 style="margin-top:14px">Help centre</h2>
          <div class="toolbar"><span class="control control--empty" style="flex:1">Search</span><button class="btn btn--blue">Search</button></div>
        </div>
      ko: |-
        <div class="screen">
          <div class="tabs"><span class="tab">쇼핑</span><span class="tab">처방전</span><span class="tab tab--on">고객센터</span><span class="tab">내 정보</span></div>
          <h2 style="margin-top:14px">고객센터</h2>
          <div class="toolbar"><span class="control control--empty" style="flex:1">검색</span><button class="btn btn--blue">검색</button></div>
        </div>
  - caption:
      en: After "ibuprofen 200mg" is typed and submitted
      ko: '"이부프로펜 200mg"을 입력해 검색한 뒤'
    screen:
      en: |-
        <div class="screen">
          <div class="tabs"><span class="tab">Shop</span><span class="tab">Prescriptions</span><span class="tab tab--on">Help</span><span class="tab">Account</span></div>
          <h2 style="margin-top:14px">Help centre</h2>
          <div class="toolbar"><span class="control" style="flex:1">ibuprofen 200mg</span><button class="btn btn--blue">Search</button></div>
          <p style="margin:14px 0 4px">No results for "ibuprofen 200mg"</p>
          <p class="muted" style="margin:0"><span class="link">Browse help topics</span></p>
        </div>
      ko: |-
        <div class="screen">
          <div class="tabs"><span class="tab">쇼핑</span><span class="tab">처방전</span><span class="tab tab--on">고객센터</span><span class="tab">내 정보</span></div>
          <h2 style="margin-top:14px">고객센터</h2>
          <div class="toolbar"><span class="control" style="flex:1">이부프로펜 200mg</span><button class="btn btn--blue">검색</button></div>
          <p style="margin:14px 0 4px">"이부프로펜 200mg"에 대한 결과가 없습니다</p>
          <p class="muted" style="margin:0"><span class="link">도움말 주제 둘러보기</span></p>
        </div>
prompt:
  en: >-
    This shopper leaves believing the pharmacy does not stock it. Which change
    should this page make?
  ko: >-
    이 구매자는 약국에 그 약이 없다고 믿은 채 떠납니다. 이 페이지는 무엇을 바꿔야
    할까요?
options:
  en:
    - text: Search the whole site from this box, and group the results by where they came from
      reason: >-
        A single box on a site is taken to search the site, and this shopper
        acted on that belief rather than on a scope nobody stated.
      correct: true
    - text: Label the box "Search help articles" and say so in the placeholder
      reason: >-
        The box then states its own scope, before anything is typed into it.
    - text: Keep the scope and add a line to the empty result offering to search the shop instead
      reason: >-
        The shopper is caught exactly where the mistake becomes visible, and
        handed the search they meant.
    - text: Move the help search box below the help topics, so the topics are met first
      reason: >-
        Somebody who came to read help meets the material before the box, and
        the box stops being the first thing on the page.
  ko:
    - text: 이 검색창이 사이트 전체를 찾도록 하고, 결과를 출처별로 묶어 보여 줍니다
      reason: >-
        사이트에 하나 있는 검색창은 사이트를 찾는 창으로 받아들여지고, 이 구매자는
        아무도 말해 주지 않은 범위가 아니라 그 믿음대로 행동했습니다.
      correct: true
    - text: 검색창 이름을 "도움말 검색"으로 바꾸고 안내 문구에도 그렇게 적습니다
      reason: >-
        무언가를 입력하기 전에 검색창이 자기 범위를 스스로 밝히게 됩니다.
    - text: 범위는 그대로 두고, 결과 없음 화면에 상품을 대신 찾아 주겠다는 줄을 답니다
      reason: >-
        착각이 드러나는 바로 그 지점에서 구매자를 붙잡아, 원래 하려던 검색을
        건네줍니다.
    - text: 도움말 검색창을 주제 목록 아래로 내려, 주제를 먼저 만나게 합니다
      reason: >-
        도움말을 읽으러 온 사람이 검색창보다 내용을 먼저 만나게 되고, 검색창이
        페이지의 첫 요소가 아니게 됩니다.
---
