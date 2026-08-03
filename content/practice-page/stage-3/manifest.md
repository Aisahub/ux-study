---
# The Stage 3 reference answer: a record of what we planted, not a judgement
# about what is wrong. Lives beside the markup so the two cannot drift apart;
# the content build fails if an element named here is absent from the page.
# Revealed to a Learner only after they submit their Self-Audit Report.
#
# Every one of these is a defect *relative to the stated user* (ADR-0011).
# None of them is visible — no contrast, no spacing, no size, no dead control —
# and none of them appears by walking anything, because this subject is a page
# and does not walk. Each is found by answering "what does this person know,
# and what will she expect?" and getting a different answer than the people who
# wrote the page would give. Cover the reader note at the top and every one of
# them reads as ordinary product copy, which is the whole of Stage 3.
#
# Eight, spread 4-2-1-1 across the Stage's four Competencies, so knowing the
# count says nothing about where to look.
stage: 3
defects:
  - slug: panel-is-a-word-from-our-side-of-the-table
    element: page-heading
    competency: jargon
    principle: plain-language
    explanation:
      en: >-
        The first thing on the page asks her to join a "merchant panel". A panel
        is a research team's word for a list of people it can call on; she has
        met the word on a discussion programme, if at all, and "merchant" is
        what a payments contract calls her, not what she calls herself. So the
        heading — the one line that has to tell her what this is — says nothing
        she can act on, and the actual request, forty minutes on one video call,
        is a paragraph further down. Heading it "Help us test the next
        Marigold" costs nothing and says the same thing in her words.
      ko: >-
        페이지에서 가장 먼저 보이는 문장이 "머천트 패널"에 참여하라고 합니다.
        패널은 부를 수 있는 사람들의 명단을 가리키는 조사팀의 말이고, 사장님이
        그 단어를 본 적이 있다면 텔레비전 토론 프로그램에서였을 겁니다.
        "머천트"도 결제 계약서가 사장님을 부르는 이름이지, 사장님이 스스로를
        부르는 이름이 아닙니다. 그래서 이게 무엇인지 알려 줘야 할 단 한 줄이
        아무것도 알려 주지 못하고, 정작 부탁하는 내용 — 화상 통화 한 번, 40분 —
        은 한 문단 아래에 있습니다. "매리골드 다음 버전, 같이 써 봐 주세요"로
        바꾸면 잃는 것 없이 같은 말을 사장님의 말로 하게 됩니다.
  - slug: consent-hangs-on-two-letters
    element: session-format
    competency: jargon
    principle: expanded-acronym
    explanation:
      en: >-
        This is the sentence where she is told she will be recorded, and the
        place the recording goes is called the "UT archive" — an acronym the
        page never expands, here or anywhere else. Everything else in the
        sentence is decidable: forty minutes, one person, six months, product
        team only. The one word she cannot decode is attached to the part she is
        being asked to agree to, and a reader who cannot tell what a store of
        recordings is for is left deciding between guessing and closing the
        page. Write it out — "usability testing" — where she meets it.
      ko: >-
        녹화된다는 사실을 알려 주는 문장인데, 그 녹화가 어디로 가는지를 "UT
        아카이브"라고 적어 두고 페이지 어디에서도 풀어 쓰지 않습니다. 이 문장의
        나머지는 전부 판단할 수 있는 정보입니다 — 40분, 한 명, 6개월, 제품팀만.
        유일하게 해독할 수 없는 말이 하필 동의해 달라고 부탁하는 대목에 붙어
        있고, 녹화를 모아 두는 곳이 무엇을 하는 곳인지 알 수 없는 사람에게 남는
        선택지는 짐작하거나 페이지를 닫는 것뿐입니다. 마주치는 그 자리에서
        "사용성 테스트"라고 풀어 써야 합니다.
  - slug: the-plain-words-arrive-second
    element: eligibility-note
    competency: jargon
    principle: paired-term
    explanation:
      en: >-
        The page does the right thing here and then does it in the wrong order.
        "Stock reconciliation" is explained — counting the shelves against what
        Marigold says — but the term is put first and the explanation second, in
        a dash it is easy to read past. Which of the pair goes first is decided
        by whether the reader already knows the term, and she does not: she
        calls it counting up, and she is reading this standing at a counter
        deciding in seconds whether the sentence is about her. Put the plain
        words first and the term after them, and she has already answered before
        she reaches it.
      ko: >-
        여기서는 옳은 일을 하고 있는데, 순서가 뒤집혀 있습니다. "재고 대사"를
        풀어 주기는 합니다 — 선반의 실제 수량과 매리골드에 적힌 수량을 맞춰
        보는 일 — 그런데 용어를 앞에 두고 설명을 줄표 안에 뒤로 밀어 두었고,
        줄표 안은 눈이 그냥 지나치기 쉬운 자리입니다. 둘 중 무엇을 앞에 둘지는
        읽는 사람이 그 용어를 이미 아는지가 정하는데, 사장님은 모릅니다. 사장님은
        그 일을 "재고 세어 보기"라고 부르고, 지금 계산대에 서서 이 문장이 자기
        이야기인지를 몇 초 만에 판단하는 중입니다. 쉬운 말을 앞에, 용어를 뒤에
        두면 용어에 닿기도 전에 판단이 끝납니다.
  - slug: a-supplier-name-stands-in-for-a-link
    element: schedule-note
    competency: jargon
    principle: plain-language
    explanation:
      en: >-
        "A coordinator sends you a Slotwise" uses the name of the booking tool
        we happen to buy as if it were an ordinary noun, the way people inside a
        company end up saying it to each other. She has never heard the word,
        and it is doing the work of the only concrete thing in the sentence: she
        cannot tell whether a Slotwise arrives by email or by text, whether it
        is something to install, or whether it will cost her anything. "A
        coordinator emails you a link for picking a time" names the same thing
        in words she can picture, and it does not go stale when the supplier
        changes.
      ko: >-
        "담당자가 슬롯와이즈를 보내 드립니다"는 저희가 사서 쓰는 예약 도구의
        이름을 보통명사처럼 써 버린 문장입니다. 회사 안에서 서로 그렇게 부르다
        보면 밖에다 대고도 그렇게 말하게 됩니다. 사장님은 그 말을 들어 본 적이
        없는데, 하필 이 문장에서 유일하게 구체적인 자리를 그 말이 차지하고
        있습니다. 슬롯와이즈가 메일로 오는지 문자로 오는지, 따로 설치해야 하는
        것인지, 돈이 드는 것인지 알 길이 없습니다. "담당자가 시간을 고르실 수
        있는 링크를 메일로 보내 드립니다"라고 하면 같은 것을 그려지는 말로
        가리키고, 나중에 도구를 바꿔도 문장이 낡지 않습니다.
  - slug: booking-that-books-nothing
    element: signup-button
    competency: mental-model-mismatch
    principle: mental-model
    explanation:
      en: >-
        "Book my session" is the word she uses when she books the van or the
        dentist, and it means one thing to her: a time now exists and it is
        hers. Pressing it does something else — it puts her name forward, and
        the time is settled later by a coordinator, which the two paragraphs
        around it say plainly enough for anyone who already knows the process.
        She will not read them as a correction, because she will not know
        anything needs correcting; she will wait for a time she thinks she
        already has, then find she has missed nothing because there was never a
        booking. The button should say what pressing it does — "Put my name
        forward" — and the confirmation should be where the time actually gets
        agreed.
      ko: >-
        "예약하기"는 사장님이 화물차를 부르거나 치과에 갈 때 쓰는 말이고,
        사장님에게는 한 가지 뜻입니다 — 시간이 잡혔고, 그 시간은 내 것이다.
        그런데 이 버튼이 하는 일은 다릅니다. 이름을 올려 두는 것이고, 시간은
        나중에 담당자가 정합니다. 앞뒤 두 문단이 그렇게 적어 두기는 했지만, 그건
        과정을 이미 아는 사람에게만 읽히는 방식입니다. 사장님은 그 문장을 정정으로
        읽지 않습니다 — 정정할 것이 있다는 것을 모르니까요. 이미 잡혔다고 믿는
        시간을 기다리다가, 애초에 예약이 없었으니 놓친 것도 없다는 걸 뒤늦게 알게
        됩니다. 버튼은 누르면 실제로 벌어지는 일을 말해야 하고 — "참여 신청하기"
        — 시간이 정해졌다는 말은 정말로 정해지는 자리에 있어야 합니다.
  - slug: told-it-is-the-app-she-already-knows
    element: what-you-will-use
    competency: mental-model-mismatch
    principle: model-inertia
    explanation:
      en: >-
        Meant as reassurance, and it is the sentence that will cost the session
        its result. The page says a page earlier that this is the next version,
        which to the team means a different build with things moved and things
        missing; to her, "the way you always do" means her Marigold, the one
        with her stock in it. Forty minutes later she meets a screen that does
        not behave the way four months taught her it behaves, and a belief that
        settled does not give way to one screen — she will report a fault, apologise
        for breaking something, or go quiet, and the call will spend its time on
        a mismatch we introduced instead of on the design. Tell her before she
        joins: it is a version she has not seen, some things have moved, and
        anything that looks broken is what we are there to hear about.
      ko: >-
        안심시키려고 쓴 문장인데, 세션의 결과를 통째로 날릴 문장입니다. 한 문단
        위에서 이건 다음 버전이라고 말해 두었고, 팀에게 그 말은 자리가 옮겨지고
        빠진 것도 있는 다른 빌드라는 뜻입니다. 사장님에게 "평소 쓰시던 그대로"는
        내 매리골드, 내 재고가 들어 있는 그것입니다. 40분 뒤 사장님은 넉 달 동안
        익힌 대로 움직이지 않는 화면을 만나는데, 자리 잡은 믿음은 화면 하나에
        물러서지 않습니다. 고장 났다고 알리거나, 자기가 뭘 잘못 눌렀다고
        사과하거나, 말이 없어지실 겁니다. 그러면 통화는 설계가 아니라 저희가 만든
        어긋남에 시간을 다 씁니다. 들어오시기 전에 말해야 합니다 — 처음 보시는
        버전이고, 자리가 옮겨진 것들이 있고, 고장 난 것처럼 보이는 것이야말로
        저희가 들으러 온 이야기라고.
  - slug: the-task-names-the-button
    element: session-task
    competency: testing-with-real-users
    principle: realistic-task
    explanation:
      en: >-
        The task is written as the route: open this tab, tap this control, work
        down the list. Whether she can find stock checking — the one thing worth
        knowing about a screen we are about to ship — has been answered for her
        in the sentence that sets the task, so the forty minutes can only show
        whether she can follow an instruction, which nobody doubted. It also
        quietly decides that she thinks of the job the way the tab structure
        does. Give her the situation and let the route be hers: "You counted the
        shelves this morning and three things do not match what Marigold says.
        Sort it out."
      ko: >-
        과제가 경로로 적혀 있습니다 — 이 탭을 열고, 이 버튼을 누르고, 목록을 훑어
        내려가라. 곧 내보낼 화면에 대해 정말 알고 싶은 단 하나, 사장님이 재고 점검
        기능을 스스로 찾아낼 수 있는지가 과제를 주는 그 문장에서 이미 답해져
        버렸습니다. 그러니 40분이 보여 줄 수 있는 것은 지시를 따를 수 있는지뿐인데,
        그건 아무도 의심하지 않았습니다. 게다가 이 문장은 사장님도 이 일을 탭
        구조대로 생각한다고 슬그머니 정해 버립니다. 상황만 드리고 경로는 사장님
        것으로 두어야 합니다 — "오늘 아침 선반을 세어 보셨는데 세 가지가 매리골드에
        적힌 수량과 다릅니다. 맞춰 주세요."
  - slug: the-quoted-finding-names-nothing
    element: last-round-finding
    competency: heuristic-evaluation
    principle: named-heuristic
    explanation:
      en: >-
        This quote is the page's evidence that giving up forty minutes changes
        something, and it is the one thing on the page she is being asked to
        weigh her time against. It names no element and no rule: "cluttered",
        "a bit dated" and "a cleanup" are how the screen felt to one person, and
        a third party cannot check any of it or tell whether the refresh that
        followed fixed anything. Set beside it, the paragraph underneath names
        two concrete things and reads as the stronger evidence, which is the
        giveaway. Quote a finding that says which element broke which named
        heuristic, and both the reader and the team can tell whether it was
        answered.
      ko: >-
        이 인용은 40분을 내어 주면 무언가 바뀐다는 것을 보여 주려고 페이지가 내놓은
        근거이고, 사장님이 자기 시간을 견주어 볼 수 있는 유일한 재료입니다. 그런데
        어떤 요소가 어떤 규칙을 어겼는지가 하나도 없습니다. "복잡하다", "옛날
        느낌이다", "정리가 필요하다"는 한 사람에게 그 화면이 어떻게 느껴졌는지일
        뿐이고, 제3자는 그중 무엇도 확인할 수 없으며 뒤이은 수정이 무엇을 고쳤는지도
        알 수 없습니다. 바로 아래 문단이 구체적인 두 가지를 이름으로 짚어 훨씬 나은
        근거로 읽히는 것이 그 증거입니다. 어떤 요소가 어떤 이름 붙은 휴리스틱을
        어겼는지 말하는 발견을 인용해야, 읽는 사람도 팀도 그것이 해결되었는지
        판단할 수 있습니다.
---
