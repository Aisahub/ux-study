---
sourceSection: "Visibility Guidelines: Display the error message close to the error's source"
principles:
  - inline-validation
  - proximity
artefact:
  en: >-
    A long leave-request form, shown in three parts down the page. At the top a
    red strip reads "Three entries need attention — Cover person, Return date
    and Handover notes." Under it, "Type" holds "Annual leave", "Start date"
    holds a date, and "Return date" shows its placeholder in the same plain grey
    box every other entry has. The middle of the page holds "Days requested",
    "Cover person" with its placeholder showing, and "Contact while away" — all
    three drawn identically. The foot of the page holds an empty "Handover
    notes" box, an attachment line, and "Cancel" and "Submit". Nothing below the
    red strip distinguishes the three entries it names from the ones it does
    not.
  ko: >-
    긴 휴가 신청 폼을 위에서 아래로 세 부분으로 나누어 보여 줍니다. 맨 위
    빨간 띠에는 "확인이 필요한 항목이 세 개 있습니다 — 대체 담당자, 복귀일,
    인수인계 메모."라고 적혀 있습니다. 그 아래 "종류"에는 "연차"가, "시작일"에는
    날짜가 들어 있고, "복귀일"은 다른 항목과 똑같이 밋밋한 회색 칸에 안내
    문구만 보입니다. 페이지 가운데에는 "신청 일수", 안내 문구만 보이는 "대체
    담당자", "부재 중 연락처"가 있는데 셋 다 똑같이 그려져 있습니다. 페이지
    맨 아래에는 비어 있는 "인수인계 메모" 칸과 첨부 줄, 그리고 "취소"와
    "제출"이 있습니다. 빨간 띠 아래 어디에도, 띠가 이름을 부른 세 항목과
    부르지 않은 항목을 구별해 주는 것은 없습니다.
sequence:
  - caption:
      en: The top of the page, just after Submit is pressed
      ko: 제출을 누른 직후, 페이지 맨 위
    screen:
      en: |-
        <div class="screen">
          <h1>Leave request</h1>
          <div class="stack">
            <p class="banner banner--red">Three entries need attention — Cover person, Return date and Handover notes.</p>
            <div class="field"><span class="field-label">Type</span><span class="control">Annual leave</span></div>
            <div class="field"><span class="field-label">Start date</span><input class="control" style="width:220px" value="2026-08-10"></div>
            <div class="field"><span class="field-label">Return date</span><input class="control control--empty" style="width:220px" value="dd/mm/yyyy"></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>휴가 신청</h1>
          <div class="stack">
            <p class="banner banner--red">확인이 필요한 항목이 세 개 있습니다 — 대체 담당자, 복귀일, 인수인계 메모.</p>
            <div class="field"><span class="field-label">종류</span><span class="control">연차</span></div>
            <div class="field"><span class="field-label">시작일</span><input class="control" style="width:220px" value="2026-08-10"></div>
            <div class="field"><span class="field-label">복귀일</span><input class="control control--empty" style="width:220px" value="연-월-일"></div>
          </div>
        </div>
  - caption:
      en: The same page after scrolling down once
      ko: 같은 페이지를 한 번 스크롤한 뒤
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <div class="field"><span class="field-label">Days requested</span><input class="control" style="width:220px" value="5"></div>
            <div class="field"><span class="field-label">Cover person</span><input class="control control--empty" style="width:220px" value="Not chosen"></div>
            <div class="field"><span class="field-label">Contact while away</span><input class="control" style="width:220px" value="+62 811 4402 118"></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <div class="field"><span class="field-label">신청 일수</span><input class="control" style="width:220px" value="5"></div>
            <div class="field"><span class="field-label">대체 담당자</span><input class="control control--empty" style="width:220px" value="선택 안 함"></div>
            <div class="field"><span class="field-label">부재 중 연락처</span><input class="control" style="width:220px" value="010-4402-1183"></div>
          </div>
        </div>
  - caption:
      en: The foot of the same page
      ko: 같은 페이지의 맨 아래
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <div class="field"><span class="field-label">Handover notes</span><span class="control control--empty" style="width:340px;height:56px;display:inline-block">Nothing written</span></div>
            <div class="field"><span class="field-label">Attachments</span><span class="control">none</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Submit</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <div class="field"><span class="field-label">인수인계 메모</span><span class="control control--empty" style="width:340px;height:56px;display:inline-block">작성 안 함</span></div>
            <div class="field"><span class="field-label">첨부</span><span class="control">없음</span></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">제출</button></div>
          </div>
        </div>
prompt:
  en: >-
    What should this page do about the three entries the message names?
  ko: >-
    메시지가 이름을 부른 세 항목을 두고, 이 페이지는 무엇을 해야 할까요?
options:
  en:
    - text: Repeat the same message at the foot of the page as well as the top
      reason: >-
        Whichever end of a long form the person happens to be at, the message is
        in sight.
    - text: Mark each of the three entries where it sits, with its own message under it
      reason: >-
        The strip at the top names them and then leaves the person scrolling a
        long form to find them; a message beside the entry is read where the
        typing happens.
      correct: true
    - text: Turn the three names in the message into links that jump to each entry
      reason: >-
        One tap puts the person at the entry, and nothing else on the page has
        to change.
    - text: Leave Submit unavailable until all three entries are filled in
      reason: >-
        The page never has to report them at all.
  ko:
    - text: 같은 메시지를 맨 위뿐 아니라 페이지 맨 아래에도 한 번 더 보여 줍니다
      reason: >-
        긴 폼의 어느 쪽 끝에 있든 메시지가 눈에 들어옵니다.
    - text: 세 항목을 각자 있는 자리에서 표시하고, 그 아래에 항목별 메시지를 답니다
      reason: >-
        맨 위의 띠는 이름만 불러 놓고, 그것을 찾는 일은 긴 폼을 스크롤하는
        사람에게 떠넘깁니다. 항목 옆의 메시지는 입력이 일어나는 자리에서
        읽힙니다.
      correct: true
    - text: 메시지 속 세 이름을 각 항목으로 건너뛰는 링크로 만듭니다
      reason: >-
        한 번만 누르면 그 항목으로 이동하고, 페이지의 다른 곳은 손대지 않아도
        됩니다.
    - text: 세 항목이 다 채워질 때까지 제출을 누를 수 없게 둡니다
      reason: >-
        페이지가 그 항목들을 알릴 일 자체가 없어집니다.
---
