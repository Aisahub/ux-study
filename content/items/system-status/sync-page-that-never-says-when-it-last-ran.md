---
sourceSection: 'Knowledge Is Power'
principles:
  - system-status
artefact:
  en: >-
    The accounting-sync page of an internal back-office tool. A heading reads
    "Accounting sync", and under it one line of explanation: orders and credit
    notes are copied into the accounting ledger. A bordered panel holds two
    settings — the ledger it is connected to, "Ledger — Seoul office", and what
    it carries, "Orders, credit notes". Below the panel sit a filled blue "Sync
    now" and an outlined "Disconnect". Nothing on the page says when a sync
    last finished, how many records the last one carried, or whether one is
    running at this moment.
  ko: >-
    사내 백오피스 도구의 회계 연동 페이지입니다. 제목은 "회계 연동"이고, 그
    아래에 설명이 한 줄 있습니다. 주문과 반품 전표를 회계 장부로 넘긴다는
    내용입니다. 테두리를 두른 패널 안에는 설정 두 가지 — 연결된 장부인 "장부 —
    서울 사무소"와, 넘기는 대상인 "주문, 반품 전표" — 가 들어 있습니다. 패널
    아래에는 파랑으로 꽉 찬 "지금 연동"과 외곽선의 "연결 해제"가 있습니다.
    마지막 연동이 언제 끝났는지, 그때 몇 건이 넘어갔는지, 지금 연동이 돌고
    있는지에 대한 말은 페이지 어디에도 없습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Accounting sync</h2>
      <p>Orders and credit notes are copied into the accounting ledger.</p>
      <div class="region" style="margin-bottom:16px">
        <div class="field" style="margin-bottom:8px"><span class="field-label">Connected to</span><span>Ledger — Seoul office</span></div>
        <div class="field"><span class="field-label">Carries</span><span>Orders, credit notes</span></div>
      </div>
      <div class="actions">
        <button class="btn btn--blue">Sync now</button>
        <button class="btn btn--outline">Disconnect</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>회계 연동</h2>
      <p>주문과 반품 전표를 회계 장부로 넘깁니다.</p>
      <div class="region" style="margin-bottom:16px">
        <div class="field" style="margin-bottom:8px"><span class="field-label">연결된 장부</span><span>장부 — 서울 사무소</span></div>
        <div class="field"><span class="field-label">넘기는 대상</span><span>주문, 반품 전표</span></div>
      </div>
      <div class="actions">
        <button class="btn btn--blue">지금 연동</button>
        <button class="btn btn--outline">연결 해제</button>
      </div>
    </div>
prompt:
  en: >-
    Someone opens this page to find out whether yesterday's orders reached the
    ledger. Which change should the page make?
  ko: >-
    어제 주문이 장부까지 넘어갔는지 확인하려고 이 페이지를 연 사람이 있습니다.
    이 페이지는 무엇을 바꿔야 할까요?
options:
  en:
    - text: Put the sync's standing on the page — when the last one finished, how many records it carried, and whether one is running now
      reason: >-
        The question that brings anyone to this page is answered where they
        arrive, without their having to start anything to find out.
      correct: true
    - text: Link from here to the sync history
      reason: >-
        Every run that has ever happened, with its time and its record count,
        is then one press away.
    - text: Confirm the outcome on screen whenever "Sync now" is used
      reason: >-
        Anyone who wants to know where things stand can press it and be told.
    - text: Say in the line under the heading that the sync runs every hour
      reason: >-
        The schedule is written down, so the last run can be worked out from
        the clock.
  ko:
    - text: 연동이 지금 어떤 상태인지를 페이지에 적습니다 — 마지막 연동이 끝난 시각, 그때 넘어간 건수, 지금 돌고 있는지
      reason: >-
        사람들이 이 페이지에 오는 이유가 바로 그 질문이니, 도착한 자리에서
        무언가를 실행하지 않고도 답을 얻게 됩니다.
      correct: true
    - text: 여기에서 연동 기록 페이지로 가는 링크를 답니다
      reason: >-
        지금까지의 모든 연동이 시각과 건수와 함께 한 번만 누르면 보이는 곳에
        있게 됩니다.
    - text: '"지금 연동"을 누를 때마다 그 결과를 화면에 알려 줍니다'
      reason: >-
        상태가 궁금한 사람은 눌러 보면 결과를 듣게 됩니다.
    - text: 제목 아래 설명에 한 시간마다 연동된다고 적어 둡니다
      reason: >-
        주기가 적혀 있으니 지금 시각만 보면 마지막 연동이 언제였는지 셈할 수
        있습니다.
---
