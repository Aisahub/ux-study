---
sourceSection: Utilize Progressive Disclosure
principles:
  - cognitive-load
artefact:
  en: >-
    The supplier-registration form of an internal procurement tool, headed "New
    supplier". Seventeen fields run down the page in one column, every one of
    them shown from the moment the form opens. The first five are company name,
    registration number, contact name, contact email and bank account. The sixth
    is a country dropdown, already set to Indonesia. Below it come eleven more
    empty boxes — VAT / GST number, SWIFT code, IBAN, intermediary bank,
    intermediary address, correspondent account, tax treaty article, withholding
    form, EORI number, settlement currency and remittance contact. A "Save
    supplier" button sits at the bottom. Nothing on the form says which fields
    belong to which kind of supplier.
  ko: >-
    사내 구매 도구의 거래처 등록 화면입니다. 제목은 "신규 거래처"이고, 열일곱
    개의 칸이 한 줄씩 아래로 이어집니다. 화면이 열리는 순간부터 열일곱 개가
    모두 보입니다. 위에서부터 다섯은 회사명, 사업자등록번호, 담당자 이름, 담당자
    이메일, 은행 계좌입니다. 여섯 번째는 국가 드롭다운이고 이미 "대한민국"으로
    되어 있습니다. 그 아래로 빈 칸이 열한 개 더 있습니다 — VAT / GST 번호,
    SWIFT 코드, IBAN, 중계은행, 중계은행 주소, 코레스 계좌, 조세조약 조항,
    원천징수 서식, EORI 번호, 결제 통화, 송금 담당자. 맨 아래에 "거래처 저장"
    버튼이 있습니다. 어느 칸이 어떤 거래처의 것인지는 화면 어디에도 적혀 있지
    않습니다.
screen:
  en: |-
    <div class="screen">
      <h1>New supplier</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Company name</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Registration no.</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Contact name</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Contact email</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Bank account</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Country</span><span class="control">Indonesia &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">VAT / GST no.</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">SWIFT code</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">IBAN</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Intermediary bank</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Intermediary address</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Correspondent a/c</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Tax treaty article</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Withholding form</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">EORI number</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">Settlement currency</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">Remittance contact</span><input class="control" value=""></div>
      <div class="actions"><button class="btn btn--blue">Save supplier</button></div>
    </div>
  ko: |-
    <div class="screen">
      <h1>신규 거래처</h1>
      <div class="field" style="margin-bottom:10px"><span class="field-label">회사명</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">사업자등록번호</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">담당자 이름</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">담당자 이메일</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">은행 계좌</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">국가</span><span class="control">대한민국 &#9662;</span></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">VAT / GST 번호</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">SWIFT 코드</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">IBAN</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">중계은행</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">중계은행 주소</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">코레스 계좌</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">조세조약 조항</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">원천징수 서식</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">EORI 번호</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:10px"><span class="field-label">결제 통화</span><input class="control" value=""></div>
      <div class="field" style="margin-bottom:16px"><span class="field-label">송금 담당자</span><input class="control" value=""></div>
      <div class="actions"><button class="btn btn--blue">거래처 저장</button></div>
    </div>
prompt:
  en: >-
    Nine in every ten suppliers registered in this tool are domestic. Which
    change takes the most work off the person filling this in?
  ko: >-
    이 도구에 등록되는 거래처 열 곳 중 아홉은 국내 업체입니다. 이 화면을 채우는
    사람의 일을 가장 많이 덜어 주는 변경은 무엇일까요?
options:
  en:
    - text: Ask for the country first, and show the eleven remaining fields only once the answer is not the domestic one
      reason: >-
        Nine registrations in ten then end after five boxes, and the tenth is
        shown everything it needs. Nobody has to read a field in order to decide
        it does not apply to them.
      correct: true
    - text: Move the eleven fields below the country into their own bordered section with a heading
      reason: >-
        One heading then says in one place who the block is for, and the form
        still holds every field it will ever need.
    - text: Mark the eleven fields below the country as optional, and let a registration be saved with them blank
      reason: >-
        Nothing stops a domestic registration from finishing, and the fields
        stay available to whoever does need them.
    - text: Split the form over two pages, with the eleven fields below the country on the second
      reason: >-
        The first page then fits on a phone without scrolling, and the second is
        one tap away.
  ko:
    - text: 국가를 먼저 묻고, 답이 국내가 아닐 때만 나머지 열한 칸을 보여 줍니다
      reason: >-
        그러면 열 건 중 아홉은 다섯 칸에서 끝나고, 나머지 한 건은 필요한 칸을
        모두 보게 됩니다. 나와 상관없는 칸이라는 것을 알아내려고 그 칸을 읽어야
        하는 사람이 사라집니다.
      correct: true
    - text: 국가 아래 열한 칸을 테두리 있는 별도 영역으로 묶고 제목을 답니다
      reason: >-
        제목 하나가 그 묶음이 누구를 위한 것인지 한자리에서 말해 주고, 폼은
        언젠가 필요할 칸을 하나도 잃지 않습니다.
    - text: 국가 아래 열한 칸을 선택 입력으로 표시하고, 비워 둔 채로 저장되게 합니다
      reason: >-
        국내 거래처 등록이 막히지 않고, 그 칸이 정말 필요한 사람에게는 그대로
        남아 있습니다.
    - text: 폼을 두 페이지로 나누고, 국가 아래 열한 칸을 두 번째 페이지로 보냅니다
      reason: >-
        첫 페이지는 휴대폰에서 스크롤 없이 들어가고, 두 번째 페이지는 한 번만
        누르면 됩니다.
---
