---
sourceSection: Structure
principles:
  - smart-defaults
  - cognitive-load
artefact:
  en: >-
    A trip settlement in an internal travel tool, headed "Trip settlement", shown
    at three moments. In the first, a line reads "Step 1 of 3 — Trip" and four
    filled boxes hold the traveller, the destination Surabaya, a departure of 3
    Aug 2026 and a return of 6 Aug 2026, with a "Next" button. In the second, the
    line reads "Step 2 of 3 — Transport": two filled boxes hold a flight cost and
    a ground-transport cost, a bordered box lists two attached receipts, and
    "Back" and "Next" sit below. In the third, the line reads "Step 3 of 3 — Per
    diem" and four boxes stand under it: "First day of travel", "Last day of
    travel" and "Days" are all empty, and "Daily rate" holds $40.00. The total
    beneath them reads as a dash, and "Submit settlement" wears the grey this
    tool gives a control that cannot yet be used.
  ko: >-
    사내 출장 도구의 정산 화면입니다. 제목은 "출장 정산"이고, 세 시점의 모습을 보여
    줍니다. 첫 번째에는 "1/3단계 — 출장 정보"라는 줄이 있고, 채워진 칸 네 개에
    출장자, 출장지 부산, 출발일 2026-08-03, 복귀일 2026-08-06이 들어 있으며 "다음"
    버튼이 있습니다. 두 번째에는 "2/3단계 — 교통비"라는 줄이 있고, 채워진 칸 두
    개에 항공·철도 비용과 현지 교통비가 들어 있으며, 테두리 상자에 첨부된 영수증
    두 건이 적혀 있고 아래에 "이전"과 "다음"이 있습니다. 세 번째에는 "3/3단계 —
    일비"라는 줄 아래로 칸 네 개가 서 있습니다. "출장 첫날", "출장 마지막 날",
    "일수"는 모두 비어 있고 "일비 단가"에는 40,000원이 들어 있습니다. 그 아래
    합계는 줄표이고, "정산 제출"은 이 도구가 아직 쓸 수 없는 컨트롤에 입히는 회색을
    하고 있습니다.
sequence:
  - caption:
      en: Step 1, once the trip details have been filled in
      ko: 출장 정보를 채워 넣은 1단계
    screen:
      en: |-
        <div class="screen">
          <h1>Trip settlement</h1>
          <p class="muted">Step 1 of 3 — Trip</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Traveller</span><input class="control" value="Sam Rivera"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Destination</span><input class="control" value="Surabaya"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Departure</span><input class="control" value="3 Aug 2026"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">Return</span><input class="control" value="6 Aug 2026"></div>
          <div class="actions"><button class="btn btn--blue">Next</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>출장 정산</h1>
          <p class="muted">1/3단계 — 출장 정보</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">출장자</span><input class="control" value="한서연"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">출장지</span><input class="control" value="부산"></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">출발일</span><input class="control" value="2026-08-03"></div>
          <div class="field" style="margin-bottom:16px"><span class="field-label">복귀일</span><input class="control" value="2026-08-06"></div>
          <div class="actions"><button class="btn btn--blue">다음</button></div>
        </div>
  - caption:
      en: Step 2, once the transport receipts have been attached
      ko: 교통비 영수증을 첨부한 2단계
    screen:
      en: |-
        <div class="screen">
          <h1>Trip settlement</h1>
          <p class="muted">Step 2 of 3 — Transport</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Flight</span><input class="control" value="$212.00"></div>
          <div class="field" style="margin-bottom:14px"><span class="field-label">Ground transport</span><input class="control" value="$34.00"></div>
          <div class="region" style="margin-bottom:16px">
            <h3>Receipts</h3>
            <p class="muted">flight-4471.pdf &middot; taxi-030826.jpg</p>
          </div>
          <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--blue">Next</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>출장 정산</h1>
          <p class="muted">2/3단계 — 교통비</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">항공·철도</span><input class="control" value="212,000원"></div>
          <div class="field" style="margin-bottom:14px"><span class="field-label">현지 교통</span><input class="control" value="34,000원"></div>
          <div class="region" style="margin-bottom:16px">
            <h3>영수증</h3>
            <p class="muted">ktx-4471.pdf &middot; taxi-030826.jpg</p>
          </div>
          <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--blue">다음</button></div>
        </div>
  - caption:
      en: Step 3, as it opens
      ko: 3단계가 열린 직후
    screen:
      en: |-
        <div class="screen">
          <h1>Trip settlement</h1>
          <p class="muted">Step 3 of 3 — Per diem</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">First day of travel</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Last day of travel</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">Days</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:14px"><span class="field-label">Daily rate</span><input class="control" value="$40.00"></div>
          <div class="actions" style="margin-bottom:16px"><span style="font-weight:600">Per diem total &mdash;</span></div>
          <div class="actions"><button class="btn btn--outline">Back</button><button class="btn btn--quiet">Submit settlement</button></div>
        </div>
      ko: |-
        <div class="screen">
          <h1>출장 정산</h1>
          <p class="muted">3/3단계 — 일비</p>
          <div class="field" style="margin-bottom:10px"><span class="field-label">출장 첫날</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">출장 마지막 날</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:10px"><span class="field-label">일수</span><input class="control" value=""></div>
          <div class="field" style="margin-bottom:14px"><span class="field-label">일비 단가</span><input class="control" value="40,000원"></div>
          <div class="actions" style="margin-bottom:16px"><span style="font-weight:600">일비 합계 &mdash;</span></div>
          <div class="actions"><button class="btn btn--outline">이전</button><button class="btn btn--quiet">정산 제출</button></div>
        </div>
prompt:
  en: >-
    Settlements from this tool come back to be corrected most often because two
    dates on the same claim disagree. Which change fixes that?
  ko: >-
    이 도구로 올린 정산이 수정하라고 돌아오는 가장 흔한 이유는 한 건 안의 두 날짜가
    서로 어긋나 있기 때문입니다. 무엇을 바꿔야 그것이 없어질까요?
options:
  en:
    - text: Carry the departure and return through to the per-diem step, shown filled in and still changeable, and work the day count out from them
      reason: >-
        There is one pair of dates instead of two, so there is nothing left to
        disagree, and the day count stops being arithmetic anyone does by hand.
      correct: true
    - text: Show the departure and return from step 1 as plain text above the per-diem dates, to refer to while typing
      reason: >-
        Nobody has to go back a screen to remember what they entered, which is
        where the wrong date gets typed.
    - text: Put a "copy the trip dates" button above the per-diem dates
      reason: >-
        One tap instead of two typed dates, and the traveller stays in charge of
        which dates the claim is made on.
    - text: Compare the two pairs at submit and refuse a settlement where they differ
      reason: >-
        A disagreeing pair never reaches the finance team, and it is caught while
        the claim is still on the traveller's screen.
  ko:
    - text: 출발일과 복귀일을 일비 단계까지 가져와 채워진 채로 보여 주고, 바꿀 수 있게 두고, 일수는 거기서 계산해 냅니다
      reason: >-
        날짜 쌍이 둘이 아니라 하나가 되니 어긋날 것이 남지 않고, 일수는 사람이
        손으로 세는 셈이기를 그만둡니다.
      correct: true
    - text: 1단계의 출발일과 복귀일을 일비 날짜 칸 위에 글자로 띄워, 입력하는 동안 참고하게 합니다
      reason: >-
        무엇을 적었는지 떠올리려고 화면을 되돌아갈 일이 없어지는데, 날짜를 잘못
        적는 것은 바로 그때입니다.
    - text: 일비 날짜 칸 위에 "출장 날짜 가져오기" 버튼을 답니다
      reason: >-
        날짜 두 개를 치는 대신 한 번만 누르면 되고, 어느 날짜로 정산할지는 출장자가
        계속 쥐고 있습니다.
    - text: 제출할 때 두 쌍을 견주어 보고, 다르면 정산을 되돌립니다
      reason: >-
        어긋난 쌍이 재무팀까지 가지 않고, 아직 출장자의 화면에 있는 동안 잡힙니다.
---
