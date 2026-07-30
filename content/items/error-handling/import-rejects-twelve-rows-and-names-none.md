---
sourceSection: 'Communication Guidelines: Offer constructive advice'
principles:
  - error-recovery
artefact:
  en: >-
    The result screen of a bulk upload in a shipment-tracking tool. A red strip
    across the top reads "Import failed. 12 of 340 rows were rejected and
    nothing was saved." Under it, the chosen file "july-shipments.csv" is still
    attached beside a "Choose file" control, and a grey line records the
    carrier and the upload time. "Close" and "Import" sit at the foot. Nothing
    on the screen names a rejected row or says what was wrong with one.
  ko: >-
    배송 추적 도구에서 일괄 업로드를 마친 결과 화면입니다. 맨 위 빨간 띠에는
    "가져오기에 실패했습니다. 340행 중 12행이 거부되어 아무것도 저장되지
    않았습니다."라고 적혀 있습니다. 그 아래에는 고른 파일
    "july-shipments.csv"가 "파일 선택" 컨트롤 옆에 그대로 붙어 있고, 회색
    글씨로 운송사와 업로드 시각이 적혀 있습니다. 맨 아래에는 "닫기"와
    "가져오기"가 있습니다. 화면 어디에도 거부된 행이 무엇인지, 그 행의 무엇이
    잘못됐는지는 적혀 있지 않습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Import tracking numbers</h1>
      <div class="stack">
        <p class="banner banner--red">Import failed. 12 of 340 rows were rejected and nothing was saved.</p>
        <div class="field"><span class="field-label">File</span><span class="control">july-shipments.csv</span><span class="btn btn--hairline">Choose file</span></div>
        <p class="muted">Carrier Nusantara Express &middot; uploaded 09:14</p>
        <div class="actions actions--end"><span class="btn btn--outline">Close</span><button class="btn btn--blue">Import</button></div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h1>운송장 번호 가져오기</h1>
      <div class="stack">
        <p class="banner banner--red">가져오기에 실패했습니다. 340행 중 12행이 거부되어 아무것도 저장되지 않았습니다.</p>
        <div class="field"><span class="field-label">파일</span><span class="control">july-shipments.csv</span><span class="btn btn--hairline">파일 선택</span></div>
        <p class="muted">운송사 누산타라 익스프레스 &middot; 09:14 업로드</p>
        <div class="actions actions--end"><span class="btn btn--outline">닫기</span><button class="btn btn--blue">가져오기</button></div>
      </div>
    </div>
prompt:
  en: >-
    What should change here so the person can get this file through?
  ko: >-
    이 사람이 이 파일을 통과시키려면 여기서 무엇이 바뀌어야 할까요?
options:
  en:
    - text: Show the message in a dialog over the page rather than as a strip at the top
      reason: >-
        The person is stopped by the outcome instead of having to notice it.
    - text: Say it more gently — that twelve rows could not quite be read
      reason: >-
        A softer sentence takes the sting out of a failure nobody meant to
        cause.
    - text: List the twelve rejected rows by line number with what was wrong with each, next to the file they came from
      reason: >-
        The count is true and useless on its own — without the line numbers and
        the reasons, 340 lines have to be read by hand to find twelve.
      correct: true
    - text: Import the 328 rows that passed and report the twelve as skipped
      reason: >-
        Most of the file lands on the first try, and what is left to deal with
        shrinks to twelve rows.
  ko:
    - text: 메시지를 맨 위 띠가 아니라 페이지 위에 뜨는 대화상자로 보여 줍니다
      reason: >-
        사용자가 결과를 알아채야 하는 대신, 결과가 사용자를 붙잡습니다.
    - text: 열두 행을 잘 읽지 못했다는 식으로 더 부드럽게 말합니다
      reason: >-
        누구도 의도하지 않은 실패에서 날 선 느낌을 덜어 냅니다.
    - text: 거부된 열두 행을 줄 번호와 함께, 각 행의 무엇이 잘못됐는지까지 파일 옆에 적어 줍니다
      reason: >-
        건수만으로는 맞는 말이면서도 쓸모가 없습니다. 줄 번호와 이유가 없으면
        열두 행을 찾으려고 340줄을 손으로 읽어야 합니다.
      correct: true
    - text: 통과한 328행은 가져오고 열두 행은 건너뛴 것으로 알립니다
      reason: >-
        파일 대부분이 한 번에 들어가고, 남아서 처리할 몫이 열두 행으로
        줄어듭니다.
---
