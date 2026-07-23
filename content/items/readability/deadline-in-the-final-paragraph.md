---
sourceSection: Comprehension
principles:
  - cognitive-load
artefact:
  en: >-
    An internal security notice, twelve paragraphs long, set comfortably —
    15px, #222222 on white, lines around 65 characters, short plain
    sentences. It tells the story in order: paragraph one, how the incident
    was noticed; the middle, what the investigation found; and only the
    final paragraph says what it wants — "Rotate your API keys before
    Friday." Half the engineering team missed the Friday deadline.
  ko: >-
    열두 문단짜리 사내 보안 공지입니다. 조판은 편안합니다 — 15px, 흰 배경 위
    #222222, 한 줄 38자 안팎, 짧고 평이한 문장. 내용은 시간 순서대로
    흘러갑니다. 첫 문단은 사건을 어떻게 발견했는지, 중간은 조사에서 무엇이
    나왔는지. 그리고 마지막 문단에 가서야 원하는 것을 말합니다 — "금요일
    전까지 API 키를 교체하십시오." 엔지니어링 팀의 절반이 금요일 기한을
    놓쳤습니다.
screen:
  en: |-
    <div class="screen">
      <h2>Security notice — API key exposure</h2>
      <div class="prose" style="font-size:15px;line-height:1.6;max-width:65ch;color:#222222">
        <p>On Tuesday morning our monitoring flagged an unusual pattern of API calls coming from a single client key.</p>
        <p>The volume was small. It did not trip any rate limit, and no alert fired at the time.</p>
        <p>An engineer reviewing the weekly log noticed the same key calling from two regions within one minute.</p>
        <p>That is not possible for the customer in question, who runs a single deployment.</p>
        <p>We opened an incident on Tuesday afternoon and pulled the full request history for the key.</p>
        <p>The history showed the first unusual call on 2 July, eight days before anyone noticed it.</p>
        <p>We traced the key to a repository that had been made public during a migration in June.</p>
        <p>The repository was private again within the hour, and the key was revoked at the same time.</p>
        <p>No customer data was read or written with the key. Every call was a metadata read.</p>
        <p>A scan for credentials in public repositories now runs hourly, starting today.</p>
        <p>The migration checklist has gained a visibility check, before and after each move.</p>
        <p>Rotate your API keys before Friday.</p>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h2>보안 공지 — API 키 노출</h2>
      <div class="prose" style="font-size:15px;line-height:1.6;max-width:38ch;color:#222222">
        <p>화요일 아침, 모니터링이 한 고객 키에서 나오는 이상한 API 호출 패턴을 잡아냈습니다.</p>
        <p>양은 적었습니다. 어떤 호출 제한에도 걸리지 않았고, 그때는 알림도 울리지 않았습니다.</p>
        <p>주간 로그를 살피던 엔지니어가 같은 키가 1분 안에 두 지역에서 호출된 것을 발견했습니다.</p>
        <p>해당 고객은 배포를 한 곳에서만 하므로, 그런 일은 일어날 수 없습니다.</p>
        <p>화요일 오후에 인시던트를 열고 그 키의 요청 기록 전체를 내려받았습니다.</p>
        <p>기록을 보니 첫 이상 호출은 7월 2일, 발견되기 여드레 전이었습니다.</p>
        <p>키는 6월 이전 작업 중에 공개로 바뀐 저장소에서 흘러나간 것이었습니다.</p>
        <p>저장소는 한 시간 안에 다시 비공개로 돌렸고, 같은 시각에 키를 폐기했습니다.</p>
        <p>이 키로 고객 데이터를 읽거나 쓴 흔적은 없습니다. 모두 메타데이터 조회였습니다.</p>
        <p>오늘부터 공개 저장소의 자격 증명을 찾는 검사가 매시간 돌아갑니다.</p>
        <p>이전 작업 체크리스트에는 작업 전후로 공개 여부를 확인하는 항목이 추가되었습니다.</p>
        <p>금요일 전까지 API 키를 교체하십시오.</p>
      </div>
    </div>
prompt:
  en: >-
    What change to the notice would have saved the deadline?
  ko: >-
    공지를 어떻게 바꿨더라면 기한을 지킬 수 있었을까요?
options:
  en:
    - text: Open with the action and its deadline, then tell the story
      reason: >-
        The notice makes readers hold twelve paragraphs before revealing why
        any of it matters to them, and most never get that far.
      correct: true
    - text: Rewrite the sentences at a lower reading level
      reason: >-
        A notice this important has to be parseable by every reader on the
        team.
    - text: Add a timeline diagram of the incident
      reason: >-
        A picture explains a sequence of events better than twelve paragraphs
        of text can.
    - text: Raise the size and contrast of the body text
      reason: >-
        A notice nobody acts on is a notice that was not comfortable enough to
        read.
  ko:
    - text: 해야 할 일과 기한을 맨 앞에 놓고, 경위는 그다음에 씁니다
      reason: >-
        이 공지는 이것이 왜 자기 일인지 밝히기 전에 열두 문단을 붙들고 있으라고
        요구하는데, 대부분은 거기까지 가지 않습니다.
      correct: true
    - text: 문장을 더 쉬운 수준으로 다시 씁니다
      reason: >-
        이만큼 중요한 공지라면 팀의 어떤 독자라도 걸리지 않고 해석할 수 있어야
        합니다.
    - text: 사건의 타임라인 도표를 넣습니다
      reason: >-
        사건의 흐름은 열두 문단의 글보다 그림 한 장이 더 잘 설명합니다.
    - text: 본문 글자의 크기와 대비를 올립니다
      reason: >-
        아무도 행동하지 않은 공지는 편하게 읽힐 만큼의 조판을 갖추지 못한
        공지입니다.
---
