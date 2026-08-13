---
sourceSection: 'Exceptions'
principles:
  - undo
  - named-heuristic
artefact:
  en: >-
    Two things side by side. On the left, the screen a nurse uses to record a
    controlled drug as administered: the drug, the dose, the patient, and a
    single "Record as given" button. Once pressed, the entry cannot be edited
    or undone; correcting it means raising a separate correction that a second
    nurse must countersign. On the right, the note attached to that screen in
    the design system: "Deliberate exception, agreed with the clinical safety
    group, 2025-11. Sessions with 14 nurses found that an editable record was
    being used to fix mis-taps silently, and twice to alter a dose after the
    fact. The countersigned correction is slower on purpose. Reviewed annually."
  ko: >-
    두 가지가 나란히 있습니다. 왼쪽은 간호사가 마약류 투약을 기록하는 화면입니다.
    약품, 용량, 환자, 그리고 "투약 완료로 기록" 버튼 하나가 있습니다. 한 번 누른
    기록은 수정할 수도 되돌릴 수도 없고, 바로잡으려면 다른 간호사의 서명이 필요한
    정정 기록을 따로 올려야 합니다. 오른쪽은 디자인 시스템에 이 화면과 함께
    붙어 있는 메모입니다. "의도적 예외. 임상안전그룹과 합의, 2025-11. 간호사
    14명과 진행한 세션에서, 수정 가능한 기록이 잘못 누른 것을 조용히 고치는 데
    쓰이고 있었고 두 번은 사후에 용량을 바꾸는 데 쓰였음을 확인했다. 서명이 필요한
    정정은 일부러 느리게 만든 것이다. 매년 재검토."
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">The screen</p>
        <div class="screen">
          <h3>Record administration</h3>
          <div class="stack">
            <div class="field"><span class="field-label">Drug</span><span class="control">Morphine sulfate 10mg/mL</span></div>
            <div class="field"><span class="field-label">Dose</span><span class="control">5 mg</span></div>
            <div class="field"><span class="field-label">Patient</span><span class="control">Bed 12 · Aliyeva</span></div>
          </div>
          <div class="actions actions--start" style="margin-top:12px">
            <button class="btn btn--blue">Record as given</button>
          </div>
          <p class="note">Once recorded, this entry cannot be edited or undone.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">The note in the design system</p>
        <div class="screen">
          <div class="prose">
            <p><strong>Deliberate exception</strong>, agreed with the clinical safety group, 2025-11.</p>
            <p>Sessions with 14 nurses found an editable record was being used to fix mis-taps silently, and twice to alter a dose after the fact. The countersigned correction is slower on purpose. Reviewed annually.</p>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">화면</p>
        <div class="screen">
          <h3>투약 기록</h3>
          <div class="stack">
            <div class="field"><span class="field-label">약품</span><span class="control">모르핀황산염 10mg/mL</span></div>
            <div class="field"><span class="field-label">용량</span><span class="control">5 mg</span></div>
            <div class="field"><span class="field-label">환자</span><span class="control">12병상 · 김○○</span></div>
          </div>
          <div class="actions actions--start" style="margin-top:12px">
            <button class="btn btn--blue">투약 완료로 기록</button>
          </div>
          <p class="note">한 번 기록하면 수정하거나 되돌릴 수 없습니다.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">디자인 시스템에 붙은 메모</p>
        <div class="screen">
          <div class="prose">
            <p><strong>의도적 예외.</strong> 임상안전그룹과 합의, 2025-11.</p>
            <p>간호사 14명과 진행한 세션에서, 수정 가능한 기록이 잘못 누른 것을 조용히 고치는 데 쓰이고 두 번은 사후에 용량을 바꾸는 데 쓰였음을 확인했다. 서명이 필요한 정정은 일부러 느리게 만든 것이다. 매년 재검토.</p>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    You are evaluating this screen and you have the note. What belongs in your
    findings?
  ko: >-
    이 화면을 평가하는 중이고, 메모도 함께 받았습니다. 발견 목록에 무엇을 적어야
    할까요?
options:
  en:
    - text: Nothing about the missing undo — record that the exception is documented and stands, and evaluate the rest of the screen
      reason: >-
        A heuristic is a rule of thumb, and this one has been broken on purpose
        with evidence and a review date behind it.
      correct: true
    - text: Raise it as a finding against Undo anyway, and note the exception beside it
      reason: >-
        The evaluation stays a complete record of where the interface departs
        from the heuristics, with the reasoning attached.
    - text: Raise it as a finding, since research on 14 nurses is too small to justify removing a safeguard
      reason: >-
        Fourteen sessions is a sample, and the cost of being wrong on this
        screen is a wrong dose recorded as right.
    - text: Raise it as a lower-severity finding, so it is visible without competing with real defects
      reason: >-
        A reader of the report still learns the screen has no undo, which is
        something anybody arriving later needs to know.
  ko:
    - text: 실행 취소가 없다는 것은 적지 않고, 예외가 문서화되어 유지되고 있음을 기록한 뒤 화면의 나머지를 평가합니다
      reason: >-
        휴리스틱은 어림잡는 규칙이고, 이 건은 근거와 재검토 시점을 갖춘 채 일부러
        어긴 것입니다.
      correct: true
    - text: 그래도 실행 취소 위반으로 적고, 옆에 예외라는 사실을 함께 적습니다
      reason: >-
        인터페이스가 휴리스틱에서 벗어난 자리를 빠짐없이 담은 기록으로 남고, 그
        이유도 함께 붙습니다.
    - text: 발견으로 적습니다. 간호사 14명 연구로 안전장치를 없애는 근거를 삼기에는 부족합니다
      reason: >-
        14명은 표본일 뿐이고, 이 화면에서 판단이 틀렸을 때의 대가는 잘못된 용량이
        올바른 것으로 기록되는 일입니다.
    - text: 심각도를 낮춰 발견으로 적어, 실제 결함과 경쟁하지 않으면서도 보이게 둡니다
      reason: >-
        보고서를 읽는 사람은 이 화면에 실행 취소가 없다는 사실을 알게 되고, 그것은
        나중에 합류하는 사람이 알아야 할 내용입니다.
---
