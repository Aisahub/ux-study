---
sourceSection: 'A Mental Model Is Based on Belief, Not Facts'
principles:
  - mental-model
artefact:
  en: >-
    Three things from one mail product, side by side. First, the message
    toolbar: Reply, Forward, Archive, Delete, with Archive drawn as the
    prominent action. Second, the help article for it, which states correctly
    and in plain words that archiving keeps a message and takes it out of the
    inbox, and that archived mail stays searchable for ever. Third, a year of
    usage: 4% of messages archived, 61% left sitting in the inbox, 35%
    deleted, with a note that the inbox now averages 8,400 messages a person.
  ko: >-
    한 메일 제품에서 가져온 세 가지가 나란히 있습니다. 첫째는 메일 도구 모음으로,
    답장, 전달, 보관, 삭제가 있고 보관이 가장 눈에 띄는 자리에 있습니다. 둘째는
    보관 기능 도움말인데, 보관은 메일을 지우지 않고 받은편지함에서만 빼는
    것이며 보관한 메일은 언제까지나 검색된다고 쉬운 말로 정확히 적혀 있습니다.
    셋째는 1년치 사용 기록으로, 메일의 4%가 보관되고 61%는 받은편지함에 그대로
    남아 있으며 35%는 삭제되었고, 1인당 받은편지함이 평균 8,400통이라는 설명이
    붙어 있습니다.
screen:
  en: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">The toolbar</p>
        <div class="screen">
          <div class="actions actions--start">
            <button class="btn btn--hairline">Reply</button>
            <button class="btn btn--hairline">Forward</button>
            <button class="btn btn--blue">Archive</button>
            <button class="btn btn--hairline">Delete</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">The help article</p>
        <div class="screen">
          <h3>What archiving does</h3>
          <p class="muted" style="margin:0">Archiving takes a message out of your inbox and keeps it. Nothing is deleted, and archived mail can be searched for as long as your account exists.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">A year of use</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-label">Archived</p><p class="stat-value">4%</p></div>
            <div><p class="stat-label">Left in inbox</p><p class="stat-value">61%</p></div>
            <div><p class="stat-label">Deleted</p><p class="stat-value">35%</p></div>
          </div>
          <p class="note">Inbox now averages 8,400 messages a person.</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">도구 모음</p>
        <div class="screen">
          <div class="actions actions--start">
            <button class="btn btn--hairline">답장</button>
            <button class="btn btn--hairline">전달</button>
            <button class="btn btn--blue">보관</button>
            <button class="btn btn--hairline">삭제</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">도움말</p>
        <div class="screen">
          <h3>보관하면 어떻게 되나요</h3>
          <p class="muted" style="margin:0">보관은 메일을 받은편지함에서 빼서 따로 간직하는 것입니다. 지워지는 것은 없으며, 보관한 메일은 계정이 있는 한 언제든 검색할 수 있습니다.</p>
        </div>
      </div>
      <div>
        <p class="pane-label">1년치 사용 기록</p>
        <div class="screen">
          <div class="stats stats--three">
            <div><p class="stat-label">보관</p><p class="stat-value">4%</p></div>
            <div><p class="stat-label">그대로 둠</p><p class="stat-value">61%</p></div>
            <div><p class="stat-label">삭제</p><p class="stat-value">35%</p></div>
          </div>
          <p class="note">받은편지함은 1인당 평균 8,400통.</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    Interviews find the same sentence again and again: "I don't archive, I might
    need it." Which change should the product make?
  ko: >-
    인터뷰에서는 같은 말이 되풀이됩니다. "보관은 안 해요, 나중에 필요할 수도
    있잖아요." 이 제품은 무엇을 바꿔야 할까요?
options:
  en:
    - text: Show where the message went after archiving, and offer it back from there in one press
      reason: >-
        The belief is that the message becomes unreachable, and it is answered
        by the message visibly staying reachable, not by a sentence saying so.
      correct: true
    - text: Link the help article from the Archive button, so the explanation is one press away
      reason: >-
        The correct account of what archiving does is put at the exact point
        somebody hesitates over it.
    - text: Rename the button "Move out of inbox"
      reason: >-
        The label then says what happens rather than naming a filing operation
        that has to be understood first.
    - text: Make Archive the default for messages older than a year, with a summary each month
      reason: >-
        The inbox is brought down without anybody having to trust a button, and
        the monthly summary says what moved.
  ko:
    - text: 보관한 뒤 그 메일이 어디로 갔는지 보여 주고, 거기서 한 번에 되돌릴 수 있게 합니다
      reason: >-
        그 믿음은 메일이 손 닿지 않는 곳으로 간다는 것이고, 여기에 답하는 것은
        그렇지 않다는 문장이 아니라 계속 닿아 있는 모습 자체입니다.
      correct: true
    - text: 보관 버튼에서 도움말로 가는 링크를 걸어, 한 번만 누르면 설명이 나오게 합니다
      reason: >-
        보관을 앞두고 망설이는 바로 그 지점에 정확한 설명이 놓입니다.
    - text: 버튼 이름을 "받은편지함에서 빼기"로 바꿉니다
      reason: >-
        먼저 이해해야 하는 분류 작업 이름 대신, 이름표가 무슨 일이 일어나는지를
        말하게 됩니다.
    - text: 1년이 지난 메일은 자동으로 보관하고, 매달 요약을 보냅니다
      reason: >-
        아무도 버튼을 믿지 않아도 받은편지함이 줄어들고, 무엇이 옮겨졌는지는 매달
        요약이 알려 줍니다.
---
