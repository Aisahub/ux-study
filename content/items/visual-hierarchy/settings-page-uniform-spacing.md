---
sourceSection: '3. Grouping: Proximity and Common Regions'
principles:
  - proximity
artefact:
  en: >-
    An account settings page with four headings — Profile, Notifications,
    Billing, Security — each followed by three or four rows of controls. The
    headings are 20px semibold, the rows 15px regular, and every word on the
    page is the same dark grey on white, with no borders or background panels
    anywhere. Every vertical gap is exactly 20px: between a heading and the
    row under it, and between one section's last row and the next heading.
  ko: >-
    계정 설정 페이지이고, 제목이 넷 있습니다 — 프로필, 알림, 결제, 보안.
    제목마다 아래에 설정 행이 서너 개씩 딸려 있습니다. 제목은 20px
    세미볼드, 행은 15px 보통 굵기이며, 페이지의 글자는 전부 흰 바탕에 같은
    짙은 회색이고, 테두리나 배경 패널은 어디에도 없습니다. 세로 간격은 전부
    정확히 20px입니다. 제목과 바로 아래 행 사이도, 한 구역의 마지막 행과 다음
    제목 사이도 똑같습니다.
screen:
  en: |-
    <div class="screen" style="line-height:1.4">
      <p style="font-size:20px;font-weight:600;margin:0">Profile</p>
      <p style="font-size:15px;margin:20px 0 0">Display name — Alex Ferrer</p>
      <p style="font-size:15px;margin:20px 0 0">Email — alex@example.com</p>
      <p style="font-size:15px;margin:20px 0 0">Time zone — Asia/Seoul</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">Notifications</p>
      <p style="font-size:15px;margin:20px 0 0">Product updates — On</p>
      <p style="font-size:15px;margin:20px 0 0">Weekly digest — Off</p>
      <p style="font-size:15px;margin:20px 0 0">Mentions — On</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">Billing</p>
      <p style="font-size:15px;margin:20px 0 0">Plan — Team, $29 monthly</p>
      <p style="font-size:15px;margin:20px 0 0">Payment card — Visa ending 4417</p>
      <p style="font-size:15px;margin:20px 0 0">Billing email — finance@example.com</p>
      <p style="font-size:15px;margin:20px 0 0">Invoices — Download</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">Security</p>
      <p style="font-size:15px;margin:20px 0 0">Password — Last changed in April</p>
      <p style="font-size:15px;margin:20px 0 0">Two-factor — Off</p>
      <p style="font-size:15px;margin:20px 0 0">Active sessions — 3</p>
    </div>
  ko: |-
    <div class="screen" style="line-height:1.4">
      <p style="font-size:20px;font-weight:600;margin:0">프로필</p>
      <p style="font-size:15px;margin:20px 0 0">표시 이름 — 김지우</p>
      <p style="font-size:15px;margin:20px 0 0">이메일 — jiwoo@example.com</p>
      <p style="font-size:15px;margin:20px 0 0">시간대 — Asia/Seoul</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">알림</p>
      <p style="font-size:15px;margin:20px 0 0">제품 소식 — 켬</p>
      <p style="font-size:15px;margin:20px 0 0">주간 요약 — 끔</p>
      <p style="font-size:15px;margin:20px 0 0">멘션 — 켬</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">결제</p>
      <p style="font-size:15px;margin:20px 0 0">요금제 — 팀, 월 29,000원</p>
      <p style="font-size:15px;margin:20px 0 0">결제 카드 — 비자 4417로 끝나는 카드</p>
      <p style="font-size:15px;margin:20px 0 0">청구서 수신 메일 — finance@example.com</p>
      <p style="font-size:15px;margin:20px 0 0">청구서 — 내려받기</p>
      <p style="font-size:20px;font-weight:600;margin:20px 0 0">보안</p>
      <p style="font-size:15px;margin:20px 0 0">비밀번호 — 4월에 마지막 변경</p>
      <p style="font-size:15px;margin:20px 0 0">2단계 인증 — 끔</p>
      <p style="font-size:15px;margin:20px 0 0">활성 세션 — 3개</p>
    </div>
prompt:
  en: >-
    A user has come here to change the card they pay with. What does the
    spacing cost them?
  ko: >-
    결제 카드를 바꾸러 온 사용자가 이 간격 때문에 치르는 대가는 무엇일까요?
options:
  en:
    - text: >-
        Each heading sits as far from its own rows as from the section above
        it, so nothing on the page shows where the billing settings begin and
        end.
      correct: true
    - text: >-
        The headings do not read as headings, because they are set at the same
        size and weight as the rows they label.
    - text: >-
        Too many colours compete for attention, so the eye has nowhere obvious
        to settle.
    - text: >-
        The rows are packed too tightly to read comfortably, so the page gets
        skimmed rather than read.
  ko:
    - text: >-
        제목이 자기 행들과 떨어진 만큼 윗 구역과도 떨어져 있어서, 결제 설정이
        어디서 시작해 어디서 끝나는지 페이지가 알려 주지 않습니다.
      correct: true
    - text: >-
        제목이 자기가 이름 붙인 행들과 크기도 굵기도 같아서 제목으로 읽히지
        않습니다.
    - text: >-
        너무 많은 색이 서로 시선을 다투어서 눈이 머물 곳이 마땅치 않습니다.
    - text: >-
        행 사이가 너무 빽빽해서 읽기 불편하고, 결국 대충 훑고 지나가게 됩니다.
---
