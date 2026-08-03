---
# The Stage 1 reference answer: a record of what we planted, not a judgement
# about what is wrong. Lives beside the markup so the two cannot drift apart;
# the content build fails if an element named here is absent from the page.
# Revealed to a Learner only after they submit their Self-Audit Report.
stage: 1
defects:
  - slug: primary-action-washed-out
    element: confirm-selected-orders
    competency: visual-hierarchy
    principle: contrast
    explanation:
      en: >-
        Confirming selected orders is the one action this page exists for, yet
        the button is pale grey text on a light grey fill — the weakest contrast
        of any control on the page. Meanwhile the upgrade banner, the least
        important thing here, has the strongest. The eye is pulled everywhere
        except the primary action; visitors read the button as inactive or
        secondary. Contrast should be spent in proportion to importance:
        strongest on the confirm button, quietest on the banner.
      ko: >-
        선택한 주문을 확정하는 것이 이 페이지의 존재 이유인데, 정작 그 버튼은
        옅은 회색 바탕에 옅은 회색 글자 — 페이지의 모든 컨트롤 중 대비가 가장
        약합니다. 반면 가장 덜 중요한 업그레이드 배너가 가장 강한 대비를
        차지하고 있습니다. 시선이 주요 동작만 빼고 사방으로 끌려가고, 버튼은
        비활성 상태이거나 부차적인 것으로 읽힙니다. 대비는 중요도에 비례해
        써야 합니다 — 확정 버튼에 가장 강하게, 배너에 가장 약하게.
  - slug: refresh-time-dominates
    element: stat-last-refreshed
    competency: visual-hierarchy
    principle: scale
    explanation:
      en: >-
        The largest text on the page is the data-refresh timestamp — operational
        trivia nobody acts on. New orders and revenue, the numbers a shop owner
        opens this page to see, are less than half its size. Size signals
        importance, so the page currently announces that "09:12" matters more
        than "$9,340". The metric values deserve the large size; the refresh
        time belongs in small print.
      ko: >-
        페이지에서 가장 큰 글자가 데이터 갱신 시각입니다 — 아무도 그걸 보고
        행동하지 않는 운영 참고 정보인데도요. 사장님이 이 페이지를 여는 이유인
        신규 주문 수와 매출은 그 절반 크기도 안 됩니다. 크기는 중요도의
        신호이므로, 지금 이 페이지는 "₩12,480,000"보다 "09:12"가 더 중요하다고
        선언하는 셈입니다. 큰 크기는 지표 값에 주고, 갱신 시각은 작은 글씨로
        내려야 합니다.
  - slug: labels-cling-to-wrong-field
    element: shipping-form
    competency: visual-hierarchy
    principle: proximity
    explanation:
      en: >-
        In the shipping form, each label sits tight against the input above it
        and far from its own input below. Spacing is how the eye decides what
        belongs together, so "Phone" reads as a caption for the contact-name box
        and "Warehouse address" as a caption for the phone box. Nothing is
        mislabelled in the markup — the grouping is wrong purely through
        spacing. Each label needs to sit close to its own field and clearly
        apart from the previous one.
      ko: >-
        배송 설정 폼에서 각 라벨이 자기 입력칸과는 멀고, 바로 위 입력칸에 딱
        붙어 있습니다. 눈은 간격으로 소속을 판단하기 때문에 "연락처"는 담당자
        이름 칸의 설명처럼, "출고지 주소"는 연락처 칸의 설명처럼 읽힙니다.
        마크업이 잘못 연결된 곳은 한 군데도 없습니다 — 오직 간격만으로 묶임이
        틀어진 것입니다. 라벨은 자기 입력칸에 가깝게, 이전 칸과는 확실히
        떨어뜨려야 합니다.
  - slug: help-text-wall
    element: shipping-help-text
    competency: readability
    principle: readability
    explanation:
      en: >-
        The shipping help text is one unbroken paragraph of internal logistics
        vocabulary — consignment manifests, carrier profiles, void-and-reissue.
        The single fact a shop owner must not miss, the 15:00 cutoff, is buried
        in its first line with nothing to make it findable. Text this dense gets
        skimmed or skipped, which defeats its purpose. It needs short sentences,
        one idea per line, the cutoff stated first and bold, and the edge cases
        moved behind a link.
      ko: >-
        배송 안내문이 위탁 명세, 배송사 프로필, 취소 후 재발행 같은 내부 물류
        용어로 가득한, 끊김 없는 한 덩어리 문단입니다. 사장님이 절대 놓치면 안
        되는 단 하나의 사실, 15:00 마감이 첫 줄 속에 묻혀 있고, 눈에 띄게
        해 주는 장치가 없습니다. 이렇게 빽빽한 글은 대충 훑거나 건너뛰게 되어
        안내문의 존재 이유가 사라집니다. 짧은 문장으로 끊고, 한 줄에 한 가지만
        담고, 마감 시각을 맨 앞에 굵게 세우고, 예외 상황은 링크 뒤로 치워야
        합니다.
  - slug: export-named-twice
    element: download-orders
    competency: consistency
    principle: consistency
    explanation:
      en: >-
        Exporting the order list exists twice on this page under two different
        names and two different styles: an outlined blue "Export CSV" in the
        header and a filled green "Download" under the table. Same action, two
        vocabularies — users stop to wonder whether they do different things,
        and "download what?" has no answer at a glance. One action deserves one
        name and one style, used everywhere it appears.
      ko: >-
        주문 목록 내보내기가 이 페이지에 두 가지 이름, 두 가지 모양으로 두 번
        존재합니다: 상단의 파란 외곽선 "CSV 내보내기"와 표 아래의 초록 채움
        "다운로드". 같은 동작에 어휘가 둘이면 사용자는 서로 다른 기능인지
        멈춰서 고민하게 되고, "다운로드"만 봐서는 무엇을 받는다는 것인지 한눈에
        알 수 없습니다. 하나의 동작에는 하나의 이름과 하나의 모양을 정해, 나오는
        곳마다 똑같이 써야 합니다.
  - slug: invoice-link-looks-inert
    element: tax-invoice-link
    competency: perceived-clickability
    principle: signifier
    explanation:
      en: >-
        "Download monthly tax invoice" is an action, but it is dressed as plain
        body text — no underline, no link colour, no button shape. Nothing about
        it says "you can click this", so the one place to get an invoice will
        simply not be found by anyone who does not already know it is there.
        Clickable things must look clickable: link styling or a button, either
        one restores the signifier.
      ko: >-
        "월별 세금계산서 내려받기"는 동작인데 겉모습은 그냥 본문 텍스트입니다 —
        밑줄도, 링크 색도, 버튼 모양도 없습니다. "여기를 누를 수 있다"고 말해
        주는 것이 아무것도 없어서, 세금계산서를 받을 유일한 통로를 이미 아는
        사람 말고는 아무도 찾지 못합니다. 누를 수 있는 것은 누를 수 있어 보여야
        합니다. 링크 스타일이든 버튼이든, 어느 쪽이든 신호를 되살려 줍니다.
---
