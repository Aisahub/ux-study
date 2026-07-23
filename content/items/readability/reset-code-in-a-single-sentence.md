---
sourceSection: Readability
principles:
  - readability
  - cognitive-load
artefact:
  en: >-
    The help text under a password-reset form. It is set generously: 15px,
    #2B2B2B on plain white, lines around 60 characters, line height 1.6. It
    is one sentence: "If the code we sent has not arrived within ten
    minutes, and your spam folder, which some providers fill without
    notice, does not contain it, request a new code, which will invalidate
    the previous one, before attempting to sign in again." Support keeps
    hearing from users who requested a new code and then entered the old
    one.
  ko: >-
    비밀번호 재설정 폼 아래의 도움말입니다. 조판은 넉넉합니다. 15px, 순백
    배경 위 #2B2B2B, 한 줄 35자 안팎, 행간 1.6. 내용은 한 문장입니다.
    "보내드린 인증번호가 10분 안에 도착하지 않았는데, 일부 서비스에서는
    안내 없이 채워지는 스팸함에도 그것이 들어 있지 않다면, 다시 로그인을
    시도하기 전에, 이전 번호를 무효로 만드는 새 인증번호를 요청하십시오."
    새 번호를 요청해 놓고 이전 번호를 입력하는 사용자의 문의가 지원팀에
    끊이지 않습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Reset your password</h2>
      <div class="field" style="margin-bottom:10px">
        <span class="field-label">Code</span>
        <input class="control" value="" placeholder="6 digits">
      </div>
      <div class="prose" style="font-size:15px;line-height:1.6;max-width:60ch;color:#2B2B2B">
        <p>If the code we sent has not arrived within ten minutes, and your spam folder, which some providers fill without notice, does not contain it, request a new code, which will invalidate the previous one, before attempting to sign in again.</p>
      </div>
      <div class="actions" style="margin-top:14px">
        <button class="btn btn--solid">Continue</button>
        <span class="link">Send a new code</span>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>비밀번호 재설정</h2>
      <div class="field" style="margin-bottom:10px">
        <span class="field-label">인증번호</span>
        <input class="control" value="" placeholder="6자리">
      </div>
      <div class="prose" style="font-size:15px;line-height:1.6;max-width:35em;color:#2B2B2B">
        <p>보내드린 인증번호가 10분 안에 도착하지 않았는데, 일부 서비스에서는 안내 없이 채워지는 스팸함에도 그것이 들어 있지 않다면, 다시 로그인을 시도하기 전에, 이전 번호를 무효로 만드는 새 인증번호를 요청하십시오.</p>
      </div>
      <div class="actions" style="margin-top:14px">
        <button class="btn btn--solid">계속</button>
        <span class="link">새 인증번호 받기</span>
      </div>
    </div>
prompt:
  en: >-
    What change would stop users misreading this instruction?
  ko: >-
    사용자가 이 안내를 잘못 읽지 않게 하려면 무엇을 바꿔야 할까요?
options:
  en:
    - text: >-
        Break the one sentence into short, active ones — it asks the reader
        to hold three conditions and a side effect in mind at once, and that
        structure is what loses them, not the type.
      correct: true
    - text: >-
        Narrow the column — a line that carries too many characters is what
        makes a block hard to follow, and capping the measure restores it.
    - text: >-
        Take the text from #2B2B2B to full black — characters need the
        highest contrast available before anything else about the text can
        work.
    - text: >-
        Bold the phrase about the new code — readers scan rather than read,
        so the key step has to be made to stand out inside the sentence.
  ko:
    - text: >-
        한 문장을 짧은 능동형 문장 여러 개로 쪼갭니다 — 조건 세 개와 부수
        효과 하나를 동시에 붙들고 있으라고 요구하는 그 구조가 독자를 놓치게
        만드는 원인이지, 조판이 아닙니다.
      correct: true
    - text: >-
        단 너비를 줄입니다 — 한 줄에 글자가 너무 많으면 덩어리를 따라가기
        어려워지니, 줄 길이를 제한하면 회복됩니다.
    - text: >-
        글자색을 #2B2B2B에서 완전한 검정으로 올립니다 — 글에 대해 무엇을
        하든 그 전에 글자부터 최대한의 대비를 갖춰야 합니다.
    - text: >-
        새 인증번호에 관한 구절을 굵게 표시합니다 — 독자는 읽지 않고
        훑으므로, 핵심 단계를 문장 안에서 도드라지게 만들어야 합니다.
---
