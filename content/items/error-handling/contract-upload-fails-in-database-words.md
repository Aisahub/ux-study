---
sourceSection: 'Communication Guidelines: Use human-readable language'
principles:
  - error-recovery
artefact:
  en: >-
    An upload screen in a contract repository. The chosen file
    "2026-nusantara-msa-signed.pdf" sits at the top. Below it a small box
    titled "Error" holds one line of monospaced text — a SQLSTATE code, a
    complaint about a foreign key constraint on a table called "documents", and
    a detail saying an owner id of 0 is not present in a table called "users" —
    and a single "OK" button. Nothing on the screen says what did not happen to
    the contract, or what to do next.
  ko: >-
    계약서 보관함의 업로드 화면입니다. 맨 위에 고른 파일
    "2026-nusantara-msa-signed.pdf"가 있습니다. 그 아래 "오류"라는 제목이 붙은
    작은 상자 안에 고정폭 글꼴로 한 줄이 들어 있습니다 — SQLSTATE 코드,
    "documents"라는 테이블의 외래 키 제약을 어겼다는 말, 그리고 소유자 id 0이
    "users"라는 테이블에 없다는 상세 설명입니다. 그 아래에는 "확인" 버튼 하나만
    있습니다. 계약서에 무슨 일이 일어나지 않은 것인지, 다음에 무엇을 하면
    되는지는 화면 어디에도 없습니다.
screen:
  en: |-
    <div class="screen">
      <h1>Contract repository</h1>
      <div class="stack">
        <div class="field"><span class="field-label">File</span><span class="control">2026-nusantara-msa-signed.pdf</span></div>
        <div class="dialog" style="max-width:520px">
          <p class="dialog-title">Error</p>
          <p style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;margin:0">SQLSTATE 23503: insert or update on table "documents" violates foreign key constraint "documents_owner_fkey" (DETAIL: Key (owner_id)=(0) is not present in table "users")</p>
          <div class="dialog-foot actions--end"><button class="btn btn--blue">OK</button></div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h1>계약서 보관함</h1>
      <div class="stack">
        <div class="field"><span class="field-label">파일</span><span class="control">2026-nusantara-msa-signed.pdf</span></div>
        <div class="dialog" style="max-width:520px">
          <p class="dialog-title">오류</p>
          <p style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;margin:0">SQLSTATE 23503: insert or update on table "documents" violates foreign key constraint "documents_owner_fkey" (DETAIL: Key (owner_id)=(0) is not present in table "users")</p>
          <div class="dialog-foot actions--end"><button class="btn btn--blue">확인</button></div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    What should this box show instead?
  ko: >-
    이 상자는 대신 무엇을 보여 줘야 할까요?
options:
  en:
    - text: Replace the line with "Something went wrong. Please try again."
      reason: >-
        Nothing technical is put in front of somebody who has no use for it.
    - text: Say that the contract has no owner set and where to set one, and keep the code where support can still reach it
      reason: >-
        The words on screen are for the person standing here, who can fix this
        in a minute once told which detail is missing; the code is for whoever
        they would otherwise have to call.
      correct: true
    - text: Keep the line and add a button that copies it, ready to paste to support
      reason: >-
        The whole thing can be handed over without a single character being
        retyped.
    - text: Keep the line and change the title from "Error" to "Upload failed"
      reason: >-
        The heading names the action that did not finish rather than saying only
        that something did not.
  ko:
    - text: 그 줄을 "문제가 발생했습니다. 다시 시도해 주세요."로 바꿉니다
      reason: >-
        그 내용을 쓸 일이 없는 사람 앞에 기술적인 문구를 늘어놓지 않게
        됩니다.
    - text: 계약서에 소유자가 지정되지 않았다는 것과 어디서 지정하는지를 말하고, 코드는 지원 담당자가 볼 수 있는 자리에 남겨 둡니다
      reason: >-
        화면의 말은 지금 여기 서 있는 사람의 것입니다. 어떤 항목이 빠졌는지만
        알면 1분이면 고칠 수 있습니다. 코드는 그렇지 않을 때 불러야 할 사람의
        몫입니다.
      correct: true
    - text: 그 줄은 그대로 두고, 지원 담당자에게 붙여 넣을 수 있도록 복사 버튼을 붙입니다
      reason: >-
        한 글자도 다시 치지 않고 내용을 통째로 넘길 수 있습니다.
    - text: 그 줄은 그대로 두고 제목을 "오류"에서 "업로드 실패"로 바꿉니다
      reason: >-
        그냥 무언가 잘못됐다고만 하는 대신, 끝나지 못한 동작의 이름을 제목이
        말해 줍니다.
---
