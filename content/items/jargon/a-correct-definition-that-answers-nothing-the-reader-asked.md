---
sourceSection: 'Make the Term Meaningful in Context'
principles:
  - plain-language
artefact:
  en: >-
    The balance screen of a tenancy-deposit account, opened by a tenant who has
    just been told part of their money is unavailable. The balance reads
    £1,840, with a line under it: "A lien has been placed on £1,200 of this
    balance." Under that, in smaller grey text, sits a definition: "A lien is a
    legal right to keep possession of property belonging to another person
    until a debt owed by that person is discharged." The two buttons on the
    screen are "Move money" and "See statement".
  ko: >-
    임대차 보증금 계좌의 잔액 화면입니다. 자기 돈 가운데 일부를 쓸 수 없다는
    안내를 막 받은 세입자가 열어 본 화면입니다. 잔액은 184만 원이라고 적혀 있고,
    그 아래 한 줄이 있습니다. "이 잔액 중 120만 원에 질권이 설정되었습니다."
    그 밑에는 더 작은 회색 글씨로 뜻풀이가 붙어 있습니다. "질권이란 채권자가
    채권의 담보로 채무자의 재산을 점유하고 그 재산에서 우선하여 변제받을 수 있는
    권리를 말합니다." 화면의 버튼은 "이체하기"와 "거래내역 보기" 두 개입니다.
screen:
  en: |-
    <div class="screen">
      <h2>Deposit account</h2>
      <p class="stat-label">Balance</p>
      <p class="stat-value" style="margin:0 0 10px">£1,840.00</p>
      <p style="margin:0 0 6px">A lien has been placed on £1,200.00 of this balance.</p>
      <p class="muted" style="margin:0">A lien is a legal right to keep possession of property belonging to another person until a debt owed by that person is discharged.</p>
      <div class="actions actions--start" style="margin-top:14px">
        <button class="btn btn--blue">Move money</button>
        <button class="btn btn--hairline">See statement</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>보증금 계좌</h2>
      <p class="stat-label">잔액</p>
      <p class="stat-value" style="margin:0 0 10px">1,840,000원</p>
      <p style="margin:0 0 6px">이 잔액 중 1,200,000원에 질권이 설정되었습니다.</p>
      <p class="muted" style="margin:0">질권이란 채권자가 채권의 담보로 채무자의 재산을 점유하고 그 재산에서 우선하여 변제받을 수 있는 권리를 말합니다.</p>
      <div class="actions actions--start" style="margin-top:14px">
        <button class="btn btn--blue">이체하기</button>
        <button class="btn btn--hairline">거래내역 보기</button>
      </div>
    </div>
prompt:
  en: >-
    The tenant opened this screen to find out whether they can still pay this
    month's rent out of it. Which change should the screen make?
  ko: >-
    이 세입자가 화면을 연 이유는 이 계좌에서 이번 달 월세를 낼 수 있는지 알기
    위해서입니다. 이 화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Replace the definition with what it means here — which £640 is still theirs to spend, and what ends the hold
      reason: >-
        A reader meets a word inside a situation, and the situation is the thing
        they came to the screen to settle.
      correct: true
    - text: Shorten the definition to one line without changing what it says
      reason: >-
        The meaning survives in a form that can be read at a glance rather than
        skipped as a block of grey.
    - text: Turn the word into a link to the clause in the tenancy terms that creates the hold
      reason: >-
        The reader is taken to the exact wording that governs their money,
        rather than to a paraphrase of it.
    - text: Replace the word with "hold" everywhere and delete the definition
      reason: >-
        Nothing on the screen then needs explaining, because nothing on it is
        written in a word from outside the reader's vocabulary.
  ko:
    - text: 뜻풀이를 지우고, 이 상황에서 무슨 뜻인지 — 남은 64만 원은 쓸 수 있다는 것과 언제 풀리는지 — 를 적습니다
      reason: >-
        독자는 어떤 말을 언제나 자기 상황 안에서 만나고, 그 상황이야말로 이
        화면에 들어온 이유입니다.
      correct: true
    - text: 뜻은 그대로 두되 한 줄로 줄입니다
      reason: >-
        뜻은 그대로 남으면서, 회색 덩어리로 건너뛰지 않고 한눈에 읽히는 길이가
        됩니다.
    - text: 그 말에 링크를 걸어 임대차 약관의 해당 조항으로 보냅니다
      reason: >-
        자기 돈을 묶어 두는 근거를 옮겨 적은 말이 아니라 원래 문구 그대로
        확인하게 됩니다.
    - text: 그 말을 전부 "출금 제한"으로 바꾸고 뜻풀이는 지웁니다
      reason: >-
        독자의 어휘 밖에서 온 말이 화면에서 사라지므로, 따로 설명할 것도
        없어집니다.
---
