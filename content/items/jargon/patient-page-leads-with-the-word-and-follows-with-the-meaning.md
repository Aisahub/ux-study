---
sourceSection: 'Using Both the Technical Term and Plain-Language Alternative'
principles:
  - paired-term
artefact:
  en: >-
    A page of a hospital's patient portal headed "What happens after surgery",
    written for people about a week past a diagnosis. Its second paragraph
    begins "Adjuvant therapy (extra treatment after surgery, given to lower the
    chance of the illness returning) usually starts four to six weeks later",
    and the same shape is used twice more further down. At the foot is a line
    saying the words used here are the words used on appointment letters, and a
    button reading "Book a call with your nurse".
  ko: >-
    병원 환자 포털의 "수술 뒤에는 어떻게 되나요" 페이지입니다. 진단을 받은 지
    일주일쯤 된 사람들을 위해 쓰였습니다. 두 번째 문단은 "보조요법(수술 뒤 병이
    다시 생길 가능성을 낮추려고 추가로 받는 치료)은 보통 4~6주 뒤에 시작합니다"
    로 시작하고, 아래쪽에서도 같은 모양이 두 번 더 나옵니다. 맨 아래에는 여기서
    쓰는 말이 진료 안내문에 쓰이는 말과 같다는 안내 한 줄과 "담당 간호사와 통화
    예약" 버튼이 있습니다.
screen:
  en: |-
    <div class="screen">
      <h1>What happens after surgery</h1>
      <div class="prose">
        <p>You will come back to the clinic about two weeks after you go home, so the wound can be checked.</p>
        <p>Adjuvant therapy (extra treatment after surgery, given to lower the chance of the illness returning) usually starts four to six weeks later.</p>
        <p>Neutropenia (a low count of the white cells that fight infection) is common during it, so you will be given a thermometer.</p>
      </div>
      <p class="note">The words on this page are the words used on your appointment letters.</p>
      <div class="actions actions--start" style="margin-top:10px">
        <button class="btn btn--blue">Book a call with your nurse</button>
      </div>
    </div>
  ko: |-
    <div class="screen">
      <h1>수술 뒤에는 어떻게 되나요</h1>
      <div class="prose">
        <p>퇴원하고 2주쯤 뒤에 상처를 확인하러 외래에 한 번 오시게 됩니다.</p>
        <p>보조요법(수술 뒤 병이 다시 생길 가능성을 낮추려고 추가로 받는 치료)은 보통 4~6주 뒤에 시작합니다.</p>
        <p>그동안 호중구감소증(감염과 싸우는 백혈구 수치가 떨어진 상태)이 흔히 생기므로, 체온계를 하나 드립니다.</p>
      </div>
      <p class="note">이 페이지에 쓰인 말은 진료 안내문에 쓰이는 말과 같습니다.</p>
      <div class="actions actions--start" style="margin-top:10px">
        <button class="btn btn--blue">담당 간호사와 통화 예약</button>
      </div>
    </div>
prompt:
  en: >-
    Almost nobody reading this page has met these words before, and every one
    of them will meet them again on letters from the hospital. Which change
    should the page make?
  ko: >-
    이 페이지를 읽는 사람 가운데 이 말들을 이미 아는 사람은 거의 없고, 그러면서도
    모두가 병원에서 오는 안내문에서 이 말들을 다시 마주칩니다. 이 페이지는 무엇을
    바꿔야 할까요?
options:
  en:
    - text: Put the plain wording first and the medical word in the brackets after it
      reason: >-
        The sentence then reads without knowing the word, and the word is still
        there to be recognised on the letter that arrives next week.
      correct: true
    - text: Keep the order and move the plain wording into a glossary at the foot of the page
      reason: >-
        The paragraphs get shorter, and the explanations sit together in one
        place a reader can return to.
    - text: Drop the medical words and write the page entirely in plain wording
      reason: >-
        Nothing on the page then has to be decoded before the sentence around it
        can be understood.
    - text: Keep the order, since the medical word is the one the hospital will use with them
      reason: >-
        The page teaches the word the reader is about to need, in the position
        it will appear in elsewhere.
  ko:
    - text: 쉬운 말을 앞에 두고, 의학 용어를 뒤 괄호 안에 넣습니다
      reason: >-
        그 말을 몰라도 문장이 읽히고, 다음 주에 오는 안내문에서 알아볼 수 있도록
        용어도 그대로 남습니다.
      correct: true
    - text: 순서는 그대로 두고, 쉬운 말 풀이는 페이지 맨 아래 용어 모음으로 내립니다
      reason: >-
        문단이 짧아지고, 풀이들이 한자리에 모여 다시 찾아보기 좋아집니다.
    - text: 의학 용어를 빼고 페이지 전체를 쉬운 말로만 씁니다
      reason: >-
        그러면 문장을 이해하기 전에 먼저 해독해야 하는 말이 페이지에서
        사라집니다.
    - text: 병원이 앞으로 쓸 말이 의학 용어이므로 순서를 그대로 둡니다
      reason: >-
        독자가 곧 필요해질 말을, 다른 곳에서 놓이는 자리 그대로 페이지가 미리
        알려 주게 됩니다.
---
