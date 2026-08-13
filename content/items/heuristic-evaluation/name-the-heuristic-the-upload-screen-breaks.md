---
sourceSection: 'Step 2: Evaluate Independently'
principles:
  - named-heuristic
  - system-status
artefact:
  en: >-
    The screen a payroll administrator sees after choosing a file and pressing
    "Upload timesheets". The heading reads "Upload timesheets", under it sits
    the file name "march-timesheets.csv (2.1 MB)", and below that the page is
    empty apart from a "Cancel" button. Nothing on the page says whether the
    file is being read, how far it has got, or how long it might take. The
    administrator has been looking at this for ninety seconds.
  ko: >-
    급여 담당자가 파일을 고르고 "근무기록 올리기"를 누른 뒤 보게 되는 화면입니다.
    제목은 "근무기록 올리기"이고, 그 아래에 파일 이름 "march-timesheets.csv
    (2.1 MB)"가 있으며, 그 밑으로는 "취소" 버튼 하나 말고는 비어 있습니다.
    파일을 읽고 있는지, 얼마나 진행됐는지, 얼마나 더 걸릴지는 화면 어디에도
    적혀 있지 않습니다. 담당자는 이 화면을 90초째 보고 있습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Upload timesheets</h2>
      <p class="muted" style="margin:0 0 18px">march-timesheets.csv (2.1 MB)</p>
      <div class="actions actions--start" style="margin-top:40px">
        <button class="btn btn--hairline">Cancel</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>근무기록 올리기</h2>
      <p class="muted" style="margin:0 0 18px">march-timesheets.csv (2.1 MB)</p>
      <div class="actions actions--start" style="margin-top:40px">
        <button class="btn btn--hairline">취소</button>
      </div>
    </div>
prompt:
  en: >-
    You are writing this up as a finding. Which heuristic should it be anchored
    to?
  ko: >-
    이것을 발견으로 적으려고 합니다. 어떤 휴리스틱에 기대어 써야 할까요?
options:
  en:
    - text: Visibility of system status
      reason: >-
        The screen is doing something and says nothing about it, so the person
        in front of it cannot tell working from stuck.
      correct: true
    - text: Error recovery
      reason: >-
        Ninety seconds in, the administrator is going to assume something has
        failed, and the screen offers no way to put it right.
    - text: Control fit
      reason: >-
        A long operation is being represented by a single button and a file
        name, which is not enough control for the job being done.
    - text: Consistency
      reason: >-
        Other long operations in this product show their progress, and this one
        does not behave the way the rest of it does.
  ko:
    - text: 시스템 상태 가시성
      reason: >-
        화면은 무언가를 하고 있으면서 그에 대해 아무 말도 하지 않으므로, 앞에
        앉은 사람은 돌아가는 중인지 멈춘 것인지 가릴 수가 없습니다.
      correct: true
    - text: 오류 복구
      reason: >-
        90초가 지나면 담당자는 무언가 실패했다고 여기게 되는데, 화면에는 그것을
        바로잡을 방법이 없습니다.
    - text: 컨트롤 적합성
      reason: >-
        오래 걸리는 작업을 버튼 하나와 파일 이름만으로 다루고 있어, 하는 일에
        비해 컨트롤이 모자랍니다.
    - text: 일관성
      reason: >-
        이 제품의 다른 긴 작업들은 진행 상황을 보여 주는데, 이 화면만 나머지와
        다르게 굴고 있습니다.
---
