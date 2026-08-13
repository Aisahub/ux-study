---
sourceSection: 'Jargon Is Relative'
principles:
  - plain-language
artefact:
  en: >-
    The same incident shown on two screens of one product, drawn side by side.
    On the left, the internal operations console that the on-call engineers
    watch; on the right, the public status page that customers open when
    something looks wrong. Both carry the same headline, "Search results
    incomplete", and both carry the same sentence beneath it: "A backfill is
    running on the search index. Results will be partial until it completes."
    The left screen adds the job id and the queue depth; the right screen adds
    the time of the last update and a button to subscribe to updates.
  ko: >-
    한 제품의 화면 두 개에 같은 장애가 나란히 떠 있습니다. 왼쪽은 당직 엔지니어가
    보는 사내 운영 콘솔이고, 오른쪽은 뭔가 이상하다 싶을 때 고객이 여는 공개
    장애 안내 페이지입니다. 두 화면 모두 "검색 결과 일부 누락"이라는 같은 제목을
    달고 있고, 그 아래 같은 문장이 있습니다. "검색 색인 재적재가 돌고 있습니다.
    끝날 때까지 결과는 일부만 나옵니다." 왼쪽 화면에는 작업 번호와 대기열 길이가
    더 있고, 오른쪽 화면에는 마지막 갱신 시각과 알림 신청 버튼이 더 있습니다.
screen:
  en: |-
    <div class="split">
      <div>
        <p class="pane-label">Internal operations console</p>
        <div class="screen">
          <h2>Search results incomplete</h2>
          <p>A backfill is running on the search index. Results will be partial until it completes.</p>
          <p class="muted">job 8841 · queue depth 12,400</p>
        </div>
      </div>
      <div>
        <p class="pane-label">Public status page</p>
        <div class="screen">
          <h2>Search results incomplete</h2>
          <p>A backfill is running on the search index. Results will be partial until it completes.</p>
          <p class="muted">Last updated 09:12</p>
          <div class="actions actions--start" style="margin-top:10px">
            <button class="btn btn--hairline">Email me updates</button>
          </div>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split">
      <div>
        <p class="pane-label">사내 운영 콘솔</p>
        <div class="screen">
          <h2>검색 결과 일부 누락</h2>
          <p>검색 색인 재적재가 돌고 있습니다. 끝날 때까지 결과는 일부만 나옵니다.</p>
          <p class="muted">작업 8841 · 대기열 12,400</p>
        </div>
      </div>
      <div>
        <p class="pane-label">공개 장애 안내 페이지</p>
        <div class="screen">
          <h2>검색 결과 일부 누락</h2>
          <p>검색 색인 재적재가 돌고 있습니다. 끝날 때까지 결과는 일부만 나옵니다.</p>
          <p class="muted">09:12 기준</p>
          <div class="actions actions--start" style="margin-top:10px">
            <button class="btn btn--hairline">갱신되면 메일 받기</button>
          </div>
        </div>
      </div>
    </div>
prompt:
  en: >-
    One sentence, written once, shipped to both screens. Which change should be
    made?
  ko: >-
    한 번 쓴 문장 하나가 두 화면에 그대로 나가고 있습니다. 무엇을 바꿔야 할까요?
options:
  en:
    - text: Leave the console's wording alone and rewrite the status page in the words a customer would use
      reason: >-
        Whether a word is jargon is settled by who is reading it, and these two
        screens have different readers.
      correct: true
    - text: Rewrite both in the customer's words, so the product says one thing in one voice
      reason: >-
        The same incident then reads the same way everywhere, and nobody has to
        keep two wordings in step.
    - text: Leave both and link the term on the status page to a glossary entry
      reason: >-
        The precise word survives on both screens, and the customer who does not
        know it has somewhere to go.
    - text: Rewrite both in the customer's words and keep the job id on the console
      reason: >-
        Engineers keep the detail they act on, and the sentence above it stops
        assuming anything about who is reading.
  ko:
    - text: 콘솔 문구는 그대로 두고, 공개 페이지만 고객이 쓰는 말로 다시 씁니다
      reason: >-
        어떤 말이 전문 용어인지는 읽는 사람이 누구냐로 갈리는데, 이 두 화면은
        읽는 사람이 서로 다릅니다.
      correct: true
    - text: 두 화면 모두 고객의 말로 다시 써서, 제품이 한 목소리로 말하게 합니다
      reason: >-
        같은 장애가 어디서나 같은 문장으로 읽히고, 두 벌의 문구를 맞춰 둘 필요도
        없어집니다.
    - text: 둘 다 그대로 두고, 공개 페이지의 그 용어에 용어집 링크를 겁니다
      reason: >-
        두 화면 모두 정확한 용어를 지키면서, 그 말을 모르는 고객에게도 갈 곳이
        생깁니다.
    - text: 두 화면 모두 고객의 말로 다시 쓰되, 콘솔에는 작업 번호를 남깁니다
      reason: >-
        엔지니어는 실제로 손대는 정보를 그대로 쥐고, 그 위의 문장은 읽는 사람을
        넘겨짚지 않게 됩니다.
---
