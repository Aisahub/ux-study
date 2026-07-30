---
sourceSection: 'Visibility Guidelines: Avoid prematurely displaying errors'
principles:
  - premature-error
  - inline-validation
artefact:
  en: >-
    A form for adding a contact to a supplier record, in three states. In the
    first, the supplier is "Nusantara Parts", the cursor sits in the "Contact
    email" box, which holds the three letters "ana", and a red line under the
    box reads "Enter an email address like name@company.com". In the second,
    the same box holds "ana.wijaya@" and carries the same red line, with the
    cursor still in it. In the third, the box holds
    "ana.wijaya@nusantara-parts.co.id", the red line is gone, and the cursor
    has moved to the "Phone" box below. "Cancel" and "Save contact" sit at the
    foot throughout.
  ko: >-
    공급처에 담당자를 추가하는 폼을 세 시점에서 보여 줍니다. 첫 번째에서는
    공급처가 "누산타라 부품"이고, 커서는 "담당자 이메일" 칸에 있으며, 그 칸에는
    "ana" 세 글자만 들어 있고, 칸 아래에는 "name@company.com 형식의 이메일
    주소를 입력하세요"라는 빨간 줄이 있습니다. 두 번째에서는 같은 칸에
    "ana.wijaya@"가 들어 있고 같은 빨간 줄이 그대로 있으며, 커서도 여전히 그
    칸에 있습니다. 세 번째에서는 칸에 "ana.wijaya@nusantara-parts.co.id"가
    다 들어가 있고 빨간 줄은 사라졌으며, 커서는 아래의 "전화번호" 칸으로
    옮겨 갔습니다. 맨 아래에는 세 시점 모두 "취소"와 "담당자 저장"이 있습니다.
sequence:
  - caption:
      en: While the contact email is three characters in, with the cursor still in the box
      ko: 담당자 이메일을 세 글자까지 입력한 시점, 커서는 아직 그 칸에 있습니다
    screen:
      en: |-
        <div class="screen">
          <h1>New supplier contact</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Supplier</span><span class="control">Nusantara Parts</span></div>
            <div>
              <div class="field"><span class="field-label">Contact email</span><input class="control" style="width:280px;border-color:#2563eb" value="ana"></div>
              <p class="field-msg field-msg--red">Enter an email address like name@company.com</p>
            </div>
            <div class="field"><span class="field-label">Phone</span><input class="control control--empty" style="width:280px" value="Optional"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Save contact</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 공급처 담당자</h1>
          <div class="stack">
            <div class="field"><span class="field-label">공급처</span><span class="control">누산타라 부품</span></div>
            <div>
              <div class="field"><span class="field-label">담당자 이메일</span><input class="control" style="width:280px;border-color:#2563eb" value="ana"></div>
              <p class="field-msg field-msg--red">name@company.com 형식의 이메일 주소를 입력하세요</p>
            </div>
            <div class="field"><span class="field-label">전화번호</span><input class="control control--empty" style="width:280px" value="선택"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">담당자 저장</button></div>
          </div>
        </div>
  - caption:
      en: A few seconds later, still in the same box
      ko: 몇 초 뒤, 여전히 같은 칸에서
    screen:
      en: |-
        <div class="screen">
          <h1>New supplier contact</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Supplier</span><span class="control">Nusantara Parts</span></div>
            <div>
              <div class="field"><span class="field-label">Contact email</span><input class="control" style="width:280px;border-color:#2563eb" value="ana.wijaya@"></div>
              <p class="field-msg field-msg--red">Enter an email address like name@company.com</p>
            </div>
            <div class="field"><span class="field-label">Phone</span><input class="control control--empty" style="width:280px" value="Optional"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Save contact</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 공급처 담당자</h1>
          <div class="stack">
            <div class="field"><span class="field-label">공급처</span><span class="control">누산타라 부품</span></div>
            <div>
              <div class="field"><span class="field-label">담당자 이메일</span><input class="control" style="width:280px;border-color:#2563eb" value="ana.wijaya@"></div>
              <p class="field-msg field-msg--red">name@company.com 형식의 이메일 주소를 입력하세요</p>
            </div>
            <div class="field"><span class="field-label">전화번호</span><input class="control control--empty" style="width:280px" value="선택"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">담당자 저장</button></div>
          </div>
        </div>
  - caption:
      en: After the address is finished and the cursor has moved to the next box
      ko: 주소를 다 입력하고 커서가 다음 칸으로 옮겨 간 뒤
    screen:
      en: |-
        <div class="screen">
          <h1>New supplier contact</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Supplier</span><span class="control">Nusantara Parts</span></div>
            <div class="field"><span class="field-label">Contact email</span><input class="control" style="width:280px" value="ana.wijaya@nusantara-parts.co.id"></div>
            <div class="field"><span class="field-label">Phone</span><input class="control control--empty" style="width:280px;border-color:#2563eb" value="Optional"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Save contact</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>새 공급처 담당자</h1>
          <div class="stack">
            <div class="field"><span class="field-label">공급처</span><span class="control">누산타라 부품</span></div>
            <div class="field"><span class="field-label">담당자 이메일</span><input class="control" style="width:280px" value="ana.wijaya@nusantara-parts.co.id"></div>
            <div class="field"><span class="field-label">전화번호</span><input class="control control--empty" style="width:280px;border-color:#2563eb" value="선택"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">담당자 저장</button></div>
          </div>
        </div>
prompt:
  en: >-
    What should change about the way this box tells the person the address is
    wrong?
  ko: >-
    이 칸이 주소가 틀렸다고 알리는 방식에서 무엇을 바꿔야 할까요?
options:
  en:
    - text: Keep the check where it is and soften the wording
      reason: >-
        The same moment is kept, and the sentence stops sounding like a
        correction.
    - text: Hold the check until the cursor leaves the box, and keep the wording as it is
      reason: >-
        Nothing is wrong yet while an address is half typed, and the sentence
        already names the fix; it only has to arrive once the person has
        finished saying what they meant.
      correct: true
    - text: Take the check off this box and let "Save contact" report the address
      reason: >-
        Only a finished entry is ever judged, so nobody is corrected in the
        middle of a word.
    - text: Keep the check and leave "Save contact" unavailable until the address passes
      reason: >-
        A half-typed address cannot reach the supplier record at all.
  ko:
    - text: 검사 시점은 그대로 두고 문구만 부드럽게 다듬습니다
      reason: >-
        같은 순간은 그대로이고, 문장만 지적처럼 들리지 않게 됩니다.
    - text: 커서가 칸을 떠날 때까지 검사를 미루고, 문구는 지금 그대로 둡니다
      reason: >-
        주소를 절반쯤 쓴 상태는 아직 틀린 것이 아니며, 문장은 이미 해결
        방법까지 담고 있습니다. 사용자가 할 말을 다 끝낸 뒤에 나오기만 하면
        됩니다.
      correct: true
    - text: 이 칸의 검사를 없애고 "담당자 저장"이 주소를 알리게 합니다
      reason: >-
        다 쓴 값만 판단하게 되므로, 단어 중간에 지적받는 일이 사라집니다.
    - text: 검사는 두고, 주소가 통과할 때까지 "담당자 저장"을 누를 수 없게 합니다
      reason: >-
        절반만 쓴 주소가 공급처 기록에 들어갈 일이 아예 없어집니다.
---
