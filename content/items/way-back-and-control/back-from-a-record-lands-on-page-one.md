---
sourceSection: Meet Users' Expectations When Using a Back Link
principles:
  - sense-of-place
  - cognitive-load
artefact:
  en: >-
    Three states of an asset register in an IT tool. The first is headed "Asset
    register" and carries a strip of three chips — "Type: Laptop", "Site:
    Seoul", "Sort: Age ↓" — a table of three rows whose tags A-2291, A-2288 and
    A-2280 are underlined links, and a line underneath reading "Page 4 of 9".
    The second state is one record: an underlined "Asset register" above the
    heading "A-2291", then Model "ThinkPad T14", Holder "Y. Jung", Site
    "Seoul". The third state is the register again, headed the same way, but
    its three chips now read "Type: All", "Site: All", "Sort: Tag ↑", its rows
    are A-0001, A-0002 and A-0003, and the line underneath reads "Page 1 of 34".
  ko: >-
    IT 도구의 자산 대장 세 상태입니다. 첫 번째는 제목이 "자산 대장"이고 칩 세 개가
    한 줄로 붙어 있습니다 — "종류: 노트북", "사업장: 서울", "정렬: 도입일 ↓". 그
    아래 세 줄짜리 표의 자산번호 A-2291, A-2288, A-2280은 밑줄 친 링크이고, 표
    아래에 "9쪽 중 4쪽"이라는 줄이 있습니다. 두 번째 상태는 자산 하나의 상세
    화면입니다. 제목 "A-2291" 위에 밑줄 친 "자산 대장"이 있고, 모델
    "ThinkPad T14", 사용자 "정유나", 사업장 "서울"이 이어집니다. 세 번째 상태는
    다시 자산 대장이고 제목도 같지만, 칩 세 개는 "종류: 전체", "사업장: 전체",
    "정렬: 자산번호 ↑"로 바뀌어 있고, 행은 A-0001, A-0002, A-0003이며, 아래 줄은
    "34쪽 중 1쪽"입니다.
sequence:
  - caption:
      en: The register after filtering to Seoul laptops and paging to page 4
      ko: 서울 노트북으로 걸러 4쪽까지 넘겨 온 자산 대장
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Asset register</h1>
            <div class="toolbar"><span class="chip">Type: Laptop</span><span class="chip">Site: Seoul</span><span class="chip">Sort: Age ↓</span></div>
            <table class="table">
              <tr><th>Tag</th><th>Model</th><th>Holder</th></tr>
              <tr><td><span class="link">A-2291</span></td><td>ThinkPad T14</td><td>Y. Jung</td></tr>
              <tr><td><span class="link">A-2288</span></td><td>MacBook Pro 14</td><td>T. Kang</td></tr>
              <tr><td><span class="link">A-2280</span></td><td>ThinkPad T14</td><td>S. Oh</td></tr>
            </table>
            <p class="note">Page 4 of 9</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>자산 대장</h1>
            <div class="toolbar"><span class="chip">종류: 노트북</span><span class="chip">사업장: 서울</span><span class="chip">정렬: 도입일 ↓</span></div>
            <table class="table">
              <tr><th>자산번호</th><th>모델</th><th>사용자</th></tr>
              <tr><td><span class="link">A-2291</span></td><td>ThinkPad T14</td><td>정유나</td></tr>
              <tr><td><span class="link">A-2288</span></td><td>MacBook Pro 14</td><td>강태오</td></tr>
              <tr><td><span class="link">A-2280</span></td><td>ThinkPad T14</td><td>오세린</td></tr>
            </table>
            <p class="note">9쪽 중 4쪽</p>
          </div>
        </div>
  - caption:
      en: The record opened from that page
      ko: 그 쪽에서 연 자산 상세
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <p><span class="link">Asset register</span></p>
            <h1>A-2291</h1>
            <div class="field"><span class="field-label">Model</span><span class="control">ThinkPad T14</span></div>
            <div class="field"><span class="field-label">Holder</span><span class="control">Y. Jung</span></div>
            <div class="field"><span class="field-label">Site</span><span class="control">Seoul</span></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <p><span class="link">자산 대장</span></p>
            <h1>A-2291</h1>
            <div class="field"><span class="field-label">모델</span><span class="control">ThinkPad T14</span></div>
            <div class="field"><span class="field-label">사용자</span><span class="control">정유나</span></div>
            <div class="field"><span class="field-label">사업장</span><span class="control">서울</span></div>
          </div>
        </div>
  - caption:
      en: After pressing Asset register at the top of that record
      ko: 그 상세 화면 위쪽의 자산 대장을 누른 뒤
    screen:
      en: |-
        <div class="screen">
          <div class="stack">
            <h1>Asset register</h1>
            <div class="toolbar"><span class="chip">Type: All</span><span class="chip">Site: All</span><span class="chip">Sort: Tag ↑</span></div>
            <table class="table">
              <tr><th>Tag</th><th>Model</th><th>Holder</th></tr>
              <tr><td><span class="link">A-0001</span></td><td>Dell OptiPlex</td><td>S. Yun</td></tr>
              <tr><td><span class="link">A-0002</span></td><td>Epson WF-7840</td><td>Front desk</td></tr>
              <tr><td><span class="link">A-0003</span></td><td>Dell OptiPlex</td><td>D. Im</td></tr>
            </table>
            <p class="note">Page 1 of 34</p>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <div class="stack">
            <h1>자산 대장</h1>
            <div class="toolbar"><span class="chip">종류: 전체</span><span class="chip">사업장: 전체</span><span class="chip">정렬: 자산번호 ↑</span></div>
            <table class="table">
              <tr><th>자산번호</th><th>모델</th><th>사용자</th></tr>
              <tr><td><span class="link">A-0001</span></td><td>Dell OptiPlex</td><td>윤서진</td></tr>
              <tr><td><span class="link">A-0002</span></td><td>Epson WF-7840</td><td>안내데스크</td></tr>
              <tr><td><span class="link">A-0003</span></td><td>Dell OptiPlex</td><td>임도현</td></tr>
            </table>
            <p class="note">34쪽 중 1쪽</p>
          </div>
        </div>
prompt:
  en: >-
    Which change should the trip back out of a record get?
  ko: >-
    자산 상세에서 목록으로 돌아오는 길을 어떻게 바꿔야 할까요?
options:
  en:
    - text: Add a breadcrumb above the record reading Asset register › Laptop › A-2291
      reason: >-
        The path back is then spelled out on the record itself, in the order it
        was travelled.
    - text: Remember the filter and the page as this user's default for next time
      reason: >-
        The register then opens each morning the way they last left it.
    - text: Warn the user, as they open a record, that the register will be reset
      reason: >-
        Nobody is caught out by it, because they were told before it happened.
    - text: Return the register to the filter, sort and page it was left on
      reason: >-
        The user arrives back where they left, so opening a record to check
        something costs nothing to do.
      correct: true
  ko:
    - text: 상세 화면 위에 "자산 대장 › 노트북 › A-2291"이라는 이동 경로를 답니다
      reason: >-
        돌아가는 길이 지나온 순서 그대로 상세 화면에 적혀 있게 됩니다.
    - text: 그 필터와 쪽을 이 사용자의 기본값으로 기억해 둡니다
      reason: >-
        다음 날 아침에도 자산 대장이 마지막에 두고 간 모습으로 열립니다.
    - text: 상세 화면을 열 때 목록이 초기화된다고 미리 알립니다
      reason: >-
        미리 말해 주었으니 아무도 뒤통수를 맞지 않습니다.
    - text: 떠날 때의 필터와 정렬과 쪽 그대로 자산 대장을 돌려놓습니다
      reason: >-
        떠났던 자리로 되돌아오게 되니, 뭔가 확인하려고 상세 화면을 여는 데 치를
        값이 없어집니다.
      correct: true
---
