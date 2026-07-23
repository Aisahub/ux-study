---
sourceSection: '2. Scale'
principles:
  - scale
  - visual-hierarchy
artefact:
  en: >-
    An internal dashboard a delivery manager opens every morning. It uses six
    type sizes. "Good afternoon, Alex" runs across the top at 40px. Under it
    sit four cards whose numbers are 20px and whose labels are 13px — Total
    clients 128, Emails sent 3,400, Overdue invoices 7, Failed payments 2. Then
    a "Recent activity" heading at 24px, an activity table at 14px, and a
    footer note at 11px.
  ko: >-
    배송 매니저가 아침마다 여는 사내 대시보드입니다. 글자 크기를 여섯 단계
    씁니다. 맨 위에 "안녕하세요, 민준님"이 40px로 넓게 깔립니다. 그 아래에
    카드 네 장이 있고, 숫자는 20px, 이름표는 13px입니다 — 전체 고객사 128,
    발송 메일 3,400, 미수금 청구서 7, 결제 실패 2. 이어서 "최근 활동" 제목이
    24px, 활동 표가 14px, 맨 아래 안내 문구가 11px입니다.
screen:
  en: |-
    <div class="screen">
      <p style="font-size:40px;font-weight:600;margin:0 0 18px">Good afternoon, Alex</p>
      <div class="stats">
        <div class="card"><p class="stat-label">Total clients</p><p class="stat-value">128</p></div>
        <div class="card"><p class="stat-label">Emails sent</p><p class="stat-value">3,400</p></div>
        <div class="card"><p class="stat-label">Overdue invoices</p><p class="stat-value">7</p></div>
        <div class="card"><p class="stat-label">Failed payments</p><p class="stat-value">2</p></div>
      </div>
      <p style="font-size:24px;font-weight:600;margin:20px 0 10px">Recent activity</p>
      <table class="table" style="font-size:14px">
        <thead><tr><th>When</th><th>Client</th><th>Event</th></tr></thead>
        <tbody>
          <tr><td>09:41</td><td>Northwind</td><td>Invoice #2841 sent</td></tr>
          <tr><td>09:12</td><td>Harbour Ltd</td><td>Payment failed</td></tr>
          <tr><td>08:55</td><td>Bright Foods</td><td>Invoice #2839 paid</td></tr>
        </tbody>
      </table>
      <p style="font-size:11px;color:#9ca3af;margin:12px 0 0">Figures refresh every 15 minutes.</p>
    </div>
  ko: |-
    <div class="screen">
      <p style="font-size:40px;font-weight:600;margin:0 0 18px">안녕하세요, 민준님</p>
      <div class="stats">
        <div class="card"><p class="stat-label">전체 고객사</p><p class="stat-value">128</p></div>
        <div class="card"><p class="stat-label">발송 메일</p><p class="stat-value">3,400</p></div>
        <div class="card"><p class="stat-label">미수금 청구서</p><p class="stat-value">7</p></div>
        <div class="card"><p class="stat-label">결제 실패</p><p class="stat-value">2</p></div>
      </div>
      <p style="font-size:24px;font-weight:600;margin:20px 0 10px">최근 활동</p>
      <table class="table" style="font-size:14px">
        <thead><tr><th>시각</th><th>고객사</th><th>내용</th></tr></thead>
        <tbody>
          <tr><td>09:41</td><td>노스윈드</td><td>청구서 #2841 발송</td></tr>
          <tr><td>09:12</td><td>하버</td><td>결제 실패</td></tr>
          <tr><td>08:55</td><td>브라이트푸드</td><td>청구서 #2839 입금</td></tr>
        </tbody>
      </table>
      <p style="font-size:11px;color:#9ca3af;margin:12px 0 0">수치는 15분마다 갱신됩니다.</p>
    </div>
prompt:
  en: >-
    The manager opens this dashboard to catch problems early. Which change to
    the sizes serves that best?
  ko: >-
    이 매니저는 문제를 일찍 잡으려고 대시보드를 엽니다. 크기를 어떻게 바꿔야
    그 목적에 가장 잘 맞을까요?
options:
  en:
    - text: Shrink the greeting and enlarge the two exception numbers
      reason: >-
        Drop the greeting to the size of the table rows, and make Overdue
        invoices and Failed payments the two largest numbers on the page.
      correct: true
    - text: Raise all four card numbers to 40px and drop the greeting to 14px
      reason: >-
        Then no number can be missed.
    - text: Round the six sizes down to three — 40px, 20px and 13px
      reason: >-
        The page then uses no more sizes than it needs.
    - text: Keep every size and set the greeting in a lighter grey
      reason: >-
        It stops competing without anything being resized.
  ko:
    - text: 인사말을 줄이고 예외 숫자 둘을 키웁니다
      reason: >-
        인사말은 표 본문과 같은 크기로 낮추고, 미수금 청구서와 결제 실패 두
        숫자를 페이지에서 가장 큰 글자로 올립니다.
      correct: true
    - text: 카드 숫자 네 개를 모두 40px로 올리고 인사말은 14px로 낮춥니다
      reason: >-
        그러면 어떤 숫자도 놓치지 않게 됩니다.
    - text: 여섯 단계인 글자 크기를 40px, 20px, 13px 세 단계로 정리합니다
      reason: >-
        필요 이상으로 많은 크기를 쓰지 않게 됩니다.
    - text: 크기는 그대로 두고 인사말만 옅은 회색으로 바꿉니다
      reason: >-
        아무것도 키우거나 줄이지 않고도 시선을 덜 끌게 됩니다.
---
