---
sourceSection: Communicate Form Requirements Before Users Begin
principles:
  - cognitive-load
artefact:
  en: >-
    The invoice-submission flow of an internal contractor-payments tool, shown at
    three moments. First, the form as it opens: a heading "Submit an invoice", a
    small line reading "Step 1 of 3 — Invoice", and three boxes for invoice
    number, period and amount, with a "Next" button. Nothing on this screen lists
    what the submission will need. Second, the step after it: "Step 2 of 3 —
    Payment", with bank, account holder and account number filled in, and "Back"
    and "Next". Third, the last step: "Step 3 of 3 — Documents", holding a
    bordered box headed "Certificate of tax residence", a line saying it must
    have been issued within the last thirty days and be a scan of a stamped
    original, and a "Choose file" button. "Submit invoice" sits below it in the
    grey this tool gives a control that cannot yet be used.
  ko: >-
    사내 외주 대금 지급 도구의 청구 제출 플로우를 세 시점으로 보여 줍니다. 첫째,
    화면이 열린 모습입니다 — "청구서 제출"이라는 제목, "1/3단계 — 청구 내역"이라는
    작은 줄, 그리고 청구 번호·기간·금액을 받는 칸 셋과 "다음" 버튼이 있습니다. 이
    화면에는 제출에 무엇이 필요한지 적혀 있지 않습니다. 둘째, 그다음 단계입니다 —
    "2/3단계 — 지급 정보"에 은행, 예금주, 계좌번호가 채워져 있고 "이전"과 "다음"이
    있습니다. 셋째, 마지막 단계입니다 — "3/3단계 — 서류"에 "거주자증명서"라는 제목의
    테두리 상자가 있고, 발급일이 30일 이내여야 하며 원본에 직인이 찍힌 것을 스캔해야
    한다는 줄과 "파일 선택" 버튼이 있습니다. 그 아래의 "청구서 제출"은 이 도구가 아직
    쓸 수 없는 컨트롤에 입히는 회색을 하고 있습니다.
sequence:
  - caption:
      en: The submission form as it opens
      ko: 제출 화면이 열린 직후
    screen:
      en: |-
        <div class="screen">
          <h1>Submit an invoice</h1>
          <p class="muted">Step 1 of 3 — Invoice</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Invoice number</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Period</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Amount</span><input class="control" value=""></div>
          <div class="actions"><button class="btn btn--blue">Next</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>청구서 제출</h1>
          <p class="muted">1/3단계 — 청구 내역</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">청구 번호</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">청구 기간</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">금액</span><input class="control" value=""></div>
          <div class="actions"><button class="btn btn--blue">다음</button></div>
        </div>
  - caption:
      en: After the first step has been filled in
      ko: 첫 단계를 채운 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>Submit an invoice</h1>
          <p class="muted">Step 2 of 3 — Payment</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Bank</span><input class="control" value="Bank Mandiri"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Account holder</span><input class="control" value="Rai Prakoso"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Account number</span><input class="control" value="1440087721"></div>
          <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--blue">Next</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>청구서 제출</h1>
          <p class="muted">2/3단계 — 지급 정보</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">은행</span><input class="control" value="국민은행"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">예금주</span><input class="control" value="정하윤"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">계좌번호</span><input class="control" value="1440087721"></div>
          <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--blue">다음</button></div>
        </div>
  - caption:
      en: After the second step has been filled in
      ko: 두 번째 단계를 채운 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>Submit an invoice</h1>
          <p class="muted">Step 3 of 3 — Documents</p>
          <div class="region" style="margin-bottom:16px">
            <h3>Certificate of tax residence</h3>
            <p class="muted">Issued within the last 30 days. A scan of the stamped original.</p>
            <button class="btn btn--outline">Choose file</button>
          </div>
          <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--quiet">Submit invoice</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>청구서 제출</h1>
          <p class="muted">3/3단계 — 서류</p>
          <div class="region" style="margin-bottom:16px">
            <h3>거주자증명서</h3>
            <p class="muted">발급일 30일 이내. 직인이 찍힌 원본을 스캔한 파일.</p>
            <button class="btn btn--outline">파일 선택</button>
          </div>
          <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--quiet">청구서 제출</button></div>
        </div>
prompt:
  en: >-
    Contractors give up on this flow at the last step more often than anywhere
    else in the tool. Which change fixes that?
  ko: >-
    이 도구에서 외주 인력이 가장 자주 손을 놓는 지점은 이 플로우의 마지막 단계입니다.
    무엇을 바꿔야 그것이 없어질까요?
options:
  en:
    - text: List on the first screen everything the submission will need, including the certificate and how recent it has to be
      reason: >-
        Whoever cannot produce it today learns that before spending twenty
        minutes, and whoever can brings it to the form.
      correct: true
    - text: Keep the three steps as they are and save the draft as it is typed, so nothing is lost while the certificate is fetched
      reason: >-
        Leaving to fetch a document stops costing the work already done, and the
        flow can be picked up where it was put down.
    - text: Accept the invoice without the certificate and ask for the certificate by email afterwards
      reason: >-
        Every submission then finishes in one sitting, and the document still
        reaches the finance team.
    - text: Add a link beside the upload box explaining where the certificate is obtained and how long it takes
      reason: >-
        The thing a contractor is least likely to know is answered in the exact
        place the question is put to them.
  ko:
    - text: 제출에 필요한 것을 첫 화면에 모두 적습니다 — 증명서와 그 발급일 조건까지
      reason: >-
        오늘 준비할 수 없는 사람은 20분을 쓰기 전에 그 사실을 알게 되고, 준비할 수
        있는 사람은 그것을 챙겨서 화면에 들어옵니다.
      correct: true
    - text: 세 단계는 그대로 두고, 입력하는 대로 임시 저장해 증명서를 가지러 간 사이에 아무것도 날아가지 않게 합니다
      reason: >-
        서류를 가지러 나가는 일이 이미 한 작업을 대가로 치르지 않게 되고, 놓아둔
        자리에서 다시 이어 갈 수 있습니다.
    - text: 증명서 없이도 청구를 받고, 증명서는 나중에 이메일로 요청합니다
      reason: >-
        모든 제출이 자리에 앉은 김에 끝나고, 서류도 결국 재무팀에 도착합니다.
    - text: 업로드 상자 옆에 증명서를 어디서 어떻게 발급받는지, 얼마나 걸리는지 알려 주는 링크를 답니다
      reason: >-
        외주 인력이 가장 모를 법한 것을 바로 그 질문이 놓인 자리에서 답해 줍니다.
---
