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
prompt:
  en: >-
    What change to the notice would have saved the deadline?
  ko: >-
    공지를 어떻게 바꿨더라면 기한을 지킬 수 있었을까요?
options:
  en:
    - text: >-
        Open with the action and its deadline, then tell the story — the
        notice makes readers hold twelve paragraphs before revealing why any
        of it matters to them, and most never get that far.
      correct: true
    - text: >-
        Rewrite the sentences at a lower reading level — a notice this
        important has to be parseable by every reader on the team.
    - text: >-
        Add a timeline diagram of the incident — a picture explains a
        sequence of events better than twelve paragraphs of text can.
    - text: >-
        Raise the size and contrast of the body text — a notice nobody acts
        on is a notice that was not comfortable enough to read.
  ko:
    - text: >-
        해야 할 일과 기한을 맨 앞에 놓고 그다음에 경위를 씁니다 — 이 공지는
        이것이 왜 자기 일인지 밝히기 전에 열두 문단을 붙들고 있으라고
        요구하는데, 대부분은 거기까지 가지 않습니다.
      correct: true
    - text: >-
        문장을 더 쉬운 수준으로 다시 씁니다 — 이만큼 중요한 공지라면 팀의
        어떤 독자라도 걸리지 않고 해석할 수 있어야 합니다.
    - text: >-
        사건의 타임라인 도표를 넣습니다 — 사건의 흐름은 열두 문단의 글보다
        그림 한 장이 더 잘 설명합니다.
    - text: >-
        본문 글자의 크기와 대비를 올립니다 — 아무도 행동하지 않은 공지는
        편하게 읽힐 만큼의 조판을 갖추지 못한 공지입니다.
---
