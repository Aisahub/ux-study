---
sourceSection: 'Button States Explained'
principles:
  - signifier
artefact:
  en: >-
    The documents page of an HR portal. The section heading "Your payslips"
    sits centred in a rounded pill with a blue border, white fill and a soft
    drop shadow — the exact shape the portal's real buttons use. It is a
    heading: clicking it does nothing. Below it, each payslip row ends in a
    genuine "Download" button drawn in that same pill style.
  ko: >-
    HR 포털의 문서 페이지입니다. 구역 제목인 "급여명세서"가 파란 테두리와
    흰 바탕, 옅은 그림자를 갖춘 둥근 알약 모양 안에 가운데 정렬로 놓여
    있습니다 — 이 포털의 진짜 버튼들이 쓰는 바로 그 모양입니다. 이것은
    제목이라 눌러도 아무 일도 일어나지 않습니다. 그 아래 급여명세서 행마다
    끝에는 같은 알약 모양으로 그려진 진짜 "다운로드" 버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <p style="text-align:center;margin:0 0 16px"><span class="btn btn--pill" style="font-weight:600">Your payslips</span></p>
      <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">June 2026</span><span class="btn btn--pill">Download</span></div></div>
      <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">May 2026</span><span class="btn btn--pill">Download</span></div></div>
      <div class="card"><div class="actions"><span style="margin-right:auto">April 2026</span><span class="btn btn--pill">Download</span></div></div>
    </div>
  ko: |-
    <div class="screen">
      <p style="text-align:center;margin:0 0 16px"><span class="btn btn--pill" style="font-weight:600">급여명세서</span></p>
      <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">2026년 6월</span><span class="btn btn--pill">다운로드</span></div></div>
      <div class="card" style="margin-bottom:8px"><div class="actions"><span style="margin-right:auto">2026년 5월</span><span class="btn btn--pill">다운로드</span></div></div>
      <div class="card"><div class="actions"><span style="margin-right:auto">2026년 4월</span><span class="btn btn--pill">다운로드</span></div></div>
    </div>
prompt:
  en: >-
    Support keeps receiving tickets that say this page is "broken". What is
    the defect?
  ko: >-
    이 페이지가 "고장 났다"는 문의가 계속 들어옵니다. 결함은 무엇일까요?
options:
  en:
    - text: The heading borrows the portal's button signifiers
      reason: >-
        Pill shape, border and shadow promise a click it cannot honour; set
        "Your payslips" as plain heading text and the promise disappears.
      correct: true
    - text: The Download buttons lack a pressed state
      reason: >-
        Users who click one cannot tell the portal registered it, and report
        the page as broken.
    - text: The heading looks clickable, so make it clickable
      reason: >-
        Have it collapse and expand the payslip list, and its look and
        behaviour will match.
    - text: The heading and the Download buttons are too close in size
      reason: >-
        Enlarge the heading until the two are clearly different ranks.
  ko:
    - text: 제목이 이 포털의 버튼 시그니파이어를 빌려 입었습니다
      reason: >-
        알약 모양, 테두리, 그림자가 지킬 수 없는 클릭을 약속합니다.
        "급여명세서"를 평범한 제목 글자로 되돌리면 그 약속이 사라집니다.
      correct: true
    - text: 다운로드 버튼에 눌림 상태가 없습니다
      reason: >-
        눌러도 포털이 받았는지 알 수 없는 사용자들이 페이지가 고장 났다고
        신고하는 것입니다.
    - text: 제목이 눌릴 것처럼 보이니 실제로 눌리게 만듭니다
      reason: >-
        명세서 목록을 접었다 펴게 하면 겉모습과 동작이 맞아떨어집니다.
    - text: 제목과 다운로드 버튼의 크기가 너무 비슷합니다
      reason: >-
        제목을 더 키워서 둘의 급이 확실히 달라 보이게 합니다.
---
