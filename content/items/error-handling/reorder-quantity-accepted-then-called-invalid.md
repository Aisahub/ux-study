---
sourceSection: "Communication Guidelines: Take a positive tone and don't blame the user"
principles:
  - error-recovery
artefact:
  en: >-
    A stock-reorder screen in a warehouse tool, in two states. In the first, the
    item is "Thermal label roll 80mm", a line records 42 in stock, and the
    cursor sits in the "Quantity" box, which holds 500. Nothing on the screen
    remarks on that number. "Cancel" and "Place order" sit at the foot. In the
    second state the cursor has left the box, which still holds 500, and a red
    message has appeared at the foot reading "Invalid quantity entered." No
    number, limit or next step appears anywhere on the screen.
  ko: >-
    창고 도구의 재고 발주 화면을 두 시점에서 보여 줍니다. 첫 번째에서는 품목이
    "감열 라벨 롤 80mm"이고, 현재 재고가 42라고 적혀 있으며, 커서는 500이 들어
    있는 "수량" 칸에 있습니다. 화면 어디에도 그 숫자에 대한 언급은 없습니다.
    맨 아래에는 "취소"와 "발주"가 있습니다. 두 번째 시점에서는 커서가 칸을
    떠났고 칸에는 여전히 500이 들어 있으며, 맨 아래에 "잘못된 수량을
    입력했습니다."라는 빨간 메시지가 떠 있습니다. 어떤 숫자가 되는지, 한도가
    얼마인지, 다음에 무엇을 하면 되는지는 화면 어디에도 없습니다.
sequence:
  - caption:
      en: With the quantity typed and the cursor still in the box
      ko: 수량을 입력하고 커서가 아직 그 칸에 있는 시점
    screen:
      en: |-
        <div class="screen">
          <h1>Reorder stock</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Item</span><span class="control">Thermal label roll 80mm</span></div>
            <div class="field"><span class="field-label">In stock</span><span class="control">42</span></div>
            <div class="field"><span class="field-label">Quantity</span><input class="control" style="width:120px;border-color:#2563eb" value="500"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Place order</button></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>재고 발주</h1>
          <div class="stack">
            <div class="field"><span class="field-label">품목</span><span class="control">감열 라벨 롤 80mm</span></div>
            <div class="field"><span class="field-label">현재 재고</span><span class="control">42</span></div>
            <div class="field"><span class="field-label">수량</span><input class="control" style="width:120px;border-color:#2563eb" value="500"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">발주</button></div>
          </div>
        </div>
  - caption:
      en: Just after Place order is pressed
      ko: 발주를 누른 직후
    screen:
      en: |-
        <div class="screen">
          <h1>Reorder stock</h1>
          <div class="stack">
            <div class="field"><span class="field-label">Item</span><span class="control">Thermal label roll 80mm</span></div>
            <div class="field"><span class="field-label">In stock</span><span class="control">42</span></div>
            <div class="field"><span class="field-label">Quantity</span><input class="control" style="width:120px" value="500"></div>
            <div class="actions actions--end"><span class="btn btn--outline">Cancel</span><button class="btn btn--blue">Place order</button></div>
            <div class="actions actions--end"><span class="toast">Invalid quantity entered.</span></div>
          </div>
        </div>
      ko: |-
        <div class="screen">
          <h1>재고 발주</h1>
          <div class="stack">
            <div class="field"><span class="field-label">품목</span><span class="control">감열 라벨 롤 80mm</span></div>
            <div class="field"><span class="field-label">현재 재고</span><span class="control">42</span></div>
            <div class="field"><span class="field-label">수량</span><input class="control" style="width:120px" value="500"></div>
            <div class="actions actions--end"><span class="btn btn--outline">취소</span><button class="btn btn--blue">발주</button></div>
            <div class="actions actions--end"><span class="toast">잘못된 수량을 입력했습니다.</span></div>
          </div>
        </div>
prompt:
  en: >-
    The order was refused. What should change?
  ko: >-
    발주가 거절됐습니다. 무엇을 바꿔야 할까요?
options:
  en:
    - text: Replace the message with one naming the cap and the way past it, and show it as soon as the number goes over
      reason: >-
        The number was taken without a word and then called invalid without a
        limit being named, so there is no way to work out which number would
        have worked.
      correct: true
    - text: Reword the message so it does not say the person entered anything
      reason: >-
        The blame comes off whoever typed it, and the check itself stays exactly
        where it is.
    - text: Turn Quantity into a stepper that will not go past the cap
      reason: >-
        A number over the cap can no longer be typed at all, so the refusal
        never has to happen.
    - text: Keep the message and add a link to the ordering policy
      reason: >-
        The rule is one tap away for anyone who wants to read it in full.
  ko:
    - text: 메시지를 한도와 그 한도를 넘어설 방법을 알려 주는 문장으로 바꾸고, 숫자가 한도를 넘는 순간 보여 줍니다
      reason: >-
        숫자를 아무 말 없이 받아 놓고 한도도 밝히지 않은 채 잘못됐다고만 하니,
        어떤 숫자였으면 됐는지 알아낼 방법이 없습니다.
      correct: true
    - text: 사용자가 무언가를 입력했다고 말하지 않도록 문구를 고칩니다
      reason: >-
        입력한 사람에게서 잘못을 돌려놓으면서, 검사 자체는 있던 자리에 그대로
        둡니다.
    - text: 수량을 한도를 넘지 못하는 스테퍼로 바꿉니다
      reason: >-
        한도를 넘는 숫자를 아예 입력할 수 없게 되어, 거절할 일이 생기지
        않습니다.
    - text: 메시지는 그대로 두고 발주 규정 문서로 가는 링크를 붙입니다
      reason: >-
        규정을 제대로 읽고 싶은 사람은 한 번만 누르면 됩니다.
---
