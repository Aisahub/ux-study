---
sourceSection: 'AAA: Always Avoid Acronyms'
principles:
  - expanded-acronym
artefact:
  en: >-
    A section of a bank's help centre, reached by a customer who searched
    "when will my refund arrive" and followed a result that dropped them
    straight onto this section rather than onto the top of the article. The
    breadcrumb reads "Help › Payments › Refund timing". The heading is "How
    long a refund takes", and the three sentences under it use "ACH" four
    times, with nothing on the visible part of the page saying what the letters
    stand for. A note at the foot links to "Contact us".
  ko: >-
    은행 고객센터의 한 단락입니다. "환불 언제 들어오나요"를 검색한 고객이 검색
    결과를 눌러 들어왔는데, 글의 맨 위가 아니라 이 단락으로 곧장 떨어졌습니다.
    위치 표시줄에는 "고객센터 › 결제 › 환불 소요 기간"이라고 적혀 있습니다.
    제목은 "환불에 걸리는 기간"이고, 그 아래 세 문장에서 "PG사"라는 말이 네 번
    나오는데, 화면에 보이는 범위 안에는 그 말이 무엇을 가리키는지 밝힌 곳이
    없습니다. 맨 아래에는 "문의하기" 링크가 하나 있습니다.
screen:
  en: |-
    <div class="screen">
      <p class="muted" style="margin:0 0 12px">Help › Payments › Refund timing</p>
      <h2>How long a refund takes</h2>
      <div class="prose">
        <p>Once the merchant confirms the return, the refund is sent as an ACH credit. ACH runs in batches on business days, so a refund raised on Friday evening enters the next ACH window on Monday.</p>
        <p>Most ACH credits settle within two business days of that window.</p>
      </div>
      <p class="note"><span class="link">Contact us</span></p>
    </div>
  ko: |-
    <div class="screen">
      <p class="muted" style="margin:0 0 12px">고객센터 › 결제 › 환불 소요 기간</p>
      <h2>환불에 걸리는 기간</h2>
      <div class="prose">
        <p>판매자가 반품을 확인하면 환불은 PG사를 통해 처리됩니다. PG사 정산은 영업일 단위로 묶여 돌아가므로, 금요일 저녁에 접수된 환불은 다음 PG사 정산분에 월요일에야 들어갑니다.</p>
        <p>대부분의 환불은 그 정산분이 돈 뒤 영업일 기준 이틀 안에 계좌에 찍힙니다.</p>
      </div>
      <p class="note"><span class="link">문의하기</span></p>
    </div>
prompt:
  en: >-
    Customers will meet this same term again on their own bank statement.
    Which change should this section make?
  ko: >-
    이 고객들은 자기 은행 거래내역에서 같은 말을 다시 마주치게 됩니다. 이
    단락은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Write the term out in full the first time it appears in this section, with the short form beside it
      reason: >-
        Readers arrive at the section they searched for, so the expansion has
        to be where they land rather than where the article begins.
      correct: true
    - text: Write it out in full once, in the article's opening paragraph
      reason: >-
        The article then explains its own terms, and every later use can lean on
        that one expansion.
    - text: Replace it everywhere with a plain description of the transfer, and drop the short form
      reason: >-
        Nothing on the page is then written in letters the customer has to
        already know.
    - text: Turn each appearance into a link to the glossary entry for it
      reason: >-
        The definition is one tap away at every point the term is used, and it
        is maintained in a single place.
  ko:
    - text: 이 단락에서 그 말이 처음 나오는 자리에서 온전한 이름으로 풀어 쓰고, 짧은 말을 나란히 둡니다
      reason: >-
        독자는 자기가 검색한 단락으로 곧장 들어오므로, 풀이는 글이 시작하는
        자리가 아니라 독자가 도착하는 자리에 있어야 합니다.
      correct: true
    - text: 글의 첫 문단에서 한 번 온전한 이름으로 풀어 씁니다
      reason: >-
        글이 자기 용어를 스스로 설명하게 되고, 뒤에 나오는 모든 쓰임은 그 한 번의
        풀이에 기댈 수 있습니다.
    - text: 나오는 곳마다 송금 방식을 쉬운 말로 풀어 쓰고, 짧은 말은 아예 뺍니다
      reason: >-
        그러면 고객이 미리 알고 있어야만 읽히는 말은 페이지에서 사라집니다.
    - text: 나오는 곳마다 용어집 항목으로 가는 링크를 겁니다
      reason: >-
        쓰인 자리마다 한 번만 누르면 뜻이 나오고, 그 뜻은 한곳에서만 관리됩니다.
---
