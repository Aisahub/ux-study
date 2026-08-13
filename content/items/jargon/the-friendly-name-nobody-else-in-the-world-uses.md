---
sourceSection: 'If the Term Is Somewhat or Very Important'
principles:
  - paired-term
artefact:
  en: >-
    The fault screen of a home solar app, shown to a householder whose system
    has stopped generating. It reads "The grey box on your wall has stopped
    responding", offers "the grey box on your wall" twice more in the steps
    below, and ends with a button reading "Call an engineer". Beside the screen
    is the warranty card that came with the system, on which the same piece of
    equipment is labelled "Inverter — model SX400", and the fault-code sheet
    the engineer will read down the phone, which is headed "Inverter fault
    codes".
  ko: >-
    가정용 태양광 앱의 고장 안내 화면입니다. 발전이 멈춘 집주인에게 보이는
    화면입니다. "벽에 붙은 회색 상자가 응답하지 않습니다"라고 적혀 있고, 아래
    조치 안내에서도 "벽에 붙은 회색 상자"라는 말이 두 번 더 나오며, 맨 아래에는
    "기사 부르기" 버튼이 있습니다. 화면 옆에는 설치할 때 함께 온 보증서가 있는데,
    같은 장비가 거기에는 "접속함 — SX400 모델"이라고 적혀 있습니다. 그리고
    기사가 전화로 불러 줄 고장 코드표가 있는데,
    그 표의 제목은 "접속함 고장 코드"입니다.
screen:
  en: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">The app</p>
        <div class="screen">
          <h2>Your system has stopped</h2>
          <p>The grey box on your wall has stopped responding.</p>
          <p class="muted">1. Check the grey box on your wall has a green light.<br>2. Switch the grey box on your wall off and on at the isolator.</p>
          <div class="actions actions--start" style="margin-top:10px">
            <button class="btn btn--blue">Call an engineer</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">Warranty card in the drawer</p>
        <div class="screen">
          <h3>Equipment covered</h3>
          <p>Inverter — model SX400</p>
          <p class="muted">10 years from installation</p>
        </div>
      </div>
      <div>
        <p class="pane-label">What the engineer reads out</p>
        <div class="screen">
          <h3>Inverter fault codes</h3>
          <p class="muted">E-11 · E-12 · E-31</p>
        </div>
      </div>
    </div>
  ko: |-
    <div class="split split--three">
      <div>
        <p class="pane-label">앱 화면</p>
        <div class="screen">
          <h2>발전이 멈췄습니다</h2>
          <p>벽에 붙은 회색 상자가 응답하지 않습니다.</p>
          <p class="muted">1. 벽에 붙은 회색 상자에 초록 불이 들어와 있는지 확인하세요.<br>2. 차단기에서 벽에 붙은 회색 상자를 껐다 켜 보세요.</p>
          <div class="actions actions--start" style="margin-top:10px">
            <button class="btn btn--blue">기사 부르기</button>
          </div>
        </div>
      </div>
      <div>
        <p class="pane-label">서랍 속 보증서</p>
        <div class="screen">
          <h3>보증 대상 장비</h3>
          <p>접속함 — SX400 모델</p>
          <p class="muted">설치일로부터 10년</p>
        </div>
      </div>
      <div>
        <p class="pane-label">기사가 전화로 불러 주는 표</p>
        <div class="screen">
          <h3>접속함 고장 코드</h3>
          <p class="muted">E-11 · E-12 · E-31</p>
        </div>
      </div>
    </div>
prompt:
  en: >-
    The householder is about to be on the phone to an engineer who has never
    seen this app. Which change should the app make?
  ko: >-
    이 집주인은 곧 이 앱을 한 번도 본 적 없는 기사와 통화하게 됩니다. 이 앱은
    무엇을 바꿔야 할까요?
options:
  en:
    - text: Use the equipment's real name, with the description of where it is beside it
      reason: >-
        This word is on the warranty and in the engineer's mouth, so the
        householder has to be able to say it and to recognise it.
      correct: true
    - text: Keep the app's wording and put the real name in the help centre article about faults
      reason: >-
        The app stays readable to somebody who has never opened the cupboard,
        and the real name is written down where it can be looked up.
    - text: Keep the app's wording, since a householder should not have to learn equipment names
      reason: >-
        The app describes the thing by where it is and what colour it is, which
        is how somebody standing in the hallway would find it.
    - text: Use the equipment's real name on its own everywhere in the app
      reason: >-
        The app then says exactly what the warranty and the fault sheet say,
        with no second name to keep in step with them.
  ko:
    - text: 장비의 실제 이름을 쓰고, 어디에 있는지를 그 옆에 함께 적습니다
      reason: >-
        이 말은 보증서에 적혀 있고 기사도 입으로 쓰는 말이므로, 집주인이 말할 수
        있어야 하고 알아들을 수 있어야 합니다.
      correct: true
    - text: 앱 문구는 그대로 두고, 실제 이름은 고장 관련 도움말 글에 적어 둡니다
      reason: >-
        장비함을 한 번도 열어 본 적 없는 사람에게도 앱이 그대로 읽히고, 실제
        이름도 찾아볼 수 있는 곳에 적히게 됩니다.
    - text: 집주인이 장비 이름까지 외울 이유는 없으니 앱 문구를 그대로 둡니다
      reason: >-
        어디에 있고 무슨 색인지로 가리키는 방식은, 복도에 선 사람이 실제로 물건을
        찾는 방식입니다.
    - text: 앱 전체에서 장비의 실제 이름만 씁니다
      reason: >-
        앱이 보증서와 고장 코드표와 똑같은 말을 쓰게 되고, 맞춰 두어야 할 두
        번째 이름도 없어집니다.
---
