---
sourceSection: 'Knowledge Is Power'
principles:
  - system-status
  - disabled-state
artefact:
  en: >-
    The stock list of an internal warehouse tool, shown at three moments on the
    same morning. The screen is a table of five parts with their bin, counted
    quantity and last movement, and above the table a row of two controls:
    "Export stock list" and "Adjust count". At 09:00, "Export stock list" is a
    filled blue button. At 09:06 the table, the heading and "Adjust count" are
    all unchanged, and "Export stock list" is now grey on grey; no other part
    of the screen differs, and no text has appeared. At 09:25 it is grey still,
    and still nothing on the screen says anything about it.
  ko: >-
    사내 창고 도구의 재고 목록을 같은 날 아침 세 시점에 걸쳐 보여 줍니다.
    화면은 부품 다섯 개를 로케이션, 실사 수량, 최근 이동과 함께 담은 표이고,
    표 위에는 조작부가 둘 — "재고 목록 내보내기"와 "수량 조정" — 놓여
    있습니다. 9시에는 "재고 목록 내보내기"가 파랑으로 꽉 찬 버튼입니다. 9시
    6분에는 표도 제목도 "수량 조정"도 그대로인데 "재고 목록 내보내기"만 회색
    바탕에 회색 글자가 되어 있습니다. 화면의 다른 곳은 달라진 데가 없고, 새로
    나타난 글자도 없습니다. 9시 25분에도 버튼은 여전히 회색이고, 그에 대해
    화면이 하는 말은 여전히 없습니다.
sequence:
  - caption:
      en: At 09:00
      ko: 9시
    screen:
      en: |-
        <div class="screen">
          <h2>Stock list — Incheon warehouse</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--blue">Export stock list</button>
            <button class="btn btn--outline">Adjust count</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Part</th><th>Bin</th><th>Counted</th><th>Last movement</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>재고 목록 — 인천 창고</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--blue">재고 목록 내보내기</button>
            <button class="btn btn--outline">수량 조정</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>부품</th><th>로케이션</th><th>실사 수량</th><th>최근 이동</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
  - caption:
      en: At 09:06
      ko: 9시 6분
    screen:
      en: |-
        <div class="screen">
          <h2>Stock list — Incheon warehouse</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--quiet">Export stock list</button>
            <button class="btn btn--outline">Adjust count</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Part</th><th>Bin</th><th>Counted</th><th>Last movement</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>재고 목록 — 인천 창고</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--quiet">재고 목록 내보내기</button>
            <button class="btn btn--outline">수량 조정</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>부품</th><th>로케이션</th><th>실사 수량</th><th>최근 이동</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
  - caption:
      en: At 09:25
      ko: 9시 25분
    screen:
      en: |-
        <div class="screen">
          <h2>Stock list — Incheon warehouse</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--quiet">Export stock list</button>
            <button class="btn btn--outline">Adjust count</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>Part</th><th>Bin</th><th>Counted</th><th>Last movement</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h2>재고 목록 — 인천 창고</h2>
          <div class="toolbar" style="margin-bottom:14px">
            <button class="btn btn--quiet">재고 목록 내보내기</button>
            <button class="btn btn--outline">수량 조정</button>
          </div>
          <div class="scroller">
            <table class="table">
              <thead><tr><th>부품</th><th>로케이션</th><th>실사 수량</th><th>최근 이동</th></tr></thead>
              <tbody>
                <tr><td>BR-1140</td><td>A-04</td><td>320</td><td>2026-07-29 16:12</td></tr>
                <tr><td>BR-1152</td><td>A-07</td><td>84</td><td>2026-07-29 15:40</td></tr>
                <tr><td>CL-2201</td><td>B-01</td><td>1,208</td><td>2026-07-29 11:05</td></tr>
                <tr><td>CL-2208</td><td>B-03</td><td>16</td><td>2026-07-28 18:33</td></tr>
                <tr><td>DX-3310</td><td>C-12</td><td>640</td><td>2026-07-28 09:21</td></tr>
              </tbody>
            </table>
          </div>
        </div>
prompt:
  en: >-
    A stock count started at 09:05 and takes the export out of use until about
    09:40. Which change should the screen make?
  ko: >-
    9시 5분에 재고 실사가 시작됐고, 그동안 9시 40분쯤까지는 내보내기를 쓸 수
    없습니다. 화면은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Put the reason and the return time next to the greyed control — "Stock count running · export available from about 09:40"
      reason: >-
        What took the export away, and how long it is gone for, is exactly what
        decides whether to wait at the desk or come back after lunch.
      correct: true
    - text: Hide the export while the count runs
      reason: >-
        Nothing unusable is on screen, so nobody reaches for a control that
        will not answer.
    - text: Explain it in a tooltip that shows when the control is hovered
      reason: >-
        The explanation sits on the control itself and stays out of the way
        until it is wanted.
    - text: Leave the export live and say why it cannot run when it is pressed
      reason: >-
        The person is told at the moment they actually want the file, and not
        before.
  ko:
    - text: 회색이 된 조작부 옆에 이유와 돌아올 시각을 적습니다 — "재고 실사 진행 중 · 9시 40분쯤부터 내보내기 가능"
      reason: >-
        무엇이 내보내기를 가져갔고 얼마나 못 쓰는지가, 자리에서 기다릴지
        점심 뒤에 다시 올지를 가르는 바로 그 정보입니다.
      correct: true
    - text: 실사가 도는 동안에는 내보내기를 화면에서 감춥니다
      reason: >-
        쓸 수 없는 것이 화면에 없으니, 대답하지 않을 조작부에 손이 갈 일이
        없습니다.
    - text: 조작부에 마우스를 올리면 뜨는 말풍선으로 설명합니다
      reason: >-
        설명이 조작부에 바로 붙어 있으면서도, 필요할 때까지는 화면을 차지하지
        않습니다.
    - text: 내보내기를 그대로 살려 두고, 눌렀을 때 왜 안 되는지 알려 줍니다
      reason: >-
        파일이 실제로 필요해진 그 순간에, 그때 가서 알려 주게 됩니다.
---
