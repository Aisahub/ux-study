import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { afterEach, expect, test, vi } from 'vitest'

import { competenciesOfStage, ContentError, itemPoolOf, loadContent, practicePageOf, specimenAsServed } from '../lib/content'

/**
 * Fixture-driven proof of every build-failing content check (#10). Each test
 * scaffolds a minimal valid content root, breaks exactly one thing, and
 * asserts the loader refuses it — the failing case, not only the passing one.
 * The loader is what `next.config.ts` runs on build and start, so a loader
 * refusal is a build failure; the last test proves that wiring itself.
 *
 * These tests call the loader directly rather than driving the app over HTTP
 * (the repo's usual convention): a refused build has no HTTP surface to
 * observe — refusing to start is the observable behaviour.
 */

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
  delete process.env.CONTENT_DIR
})

// drawSize is 2 so a full pool needs only two fixture items.
const CONFIG = `---
poolSize: 3
drawSize: 2
passThreshold: 2
minFindings: 1
stages:
  - stage: 1
    competencies:
      - visual-hierarchy
      - readability
      - consistency
      - perceived-clickability
---
`

/** The same fixture with a second, wholly unauthored Stage declared. */
const CONFIG_TWO_STAGES = `${CONFIG.trimEnd().slice(0, -'---'.length)}  - stage: 2
    competencies:
      - system-status
      - form-burden
---
`

const GLOSSARY_CONTRAST = `---
slug: contrast
name:
  en: Contrast
  ko: 대비
definition:
  en: How far an element sits from its background and its neighbours.
  ko: 요소가 배경과 주변 요소로부터 얼마나 떨어져 보이는지.
justification:
  en: The primary action does not read as primary.
  ko: 주요 동작이 주요 동작으로 읽히지 않습니다.
competencies:
  - visual-hierarchy
source: https://example.test/contrast
---
`

const COMPETENCY = `---
name:
  en: Visual hierarchy
  ko: 시각적 위계
objective:
  en: Say where a first-time visitor's eye lands first.
  ko: 처음 방문한 사용자의 시선이 어디에 먼저 닿는지 말할 수 있다.
roleHint:
  developer:
    en: Look at the screen you built.
    ko: 직접 만든 화면을 보세요.
  pm:
    en: Walk the flow you signed off.
    ko: 승인한 플로우를 따라가 보세요.
preReadingQuestions:
  - en: What pulls the eye first?
    ko: 무엇이 시선을 먼저 끄는가?
  - en: What is the squint test for?
    ko: 실눈 테스트는 무엇을 위한 것인가?
source:
  url: https://example.test/article
  attribution: Example Author, Example Article, Example Publisher
koTranslationNotice: 원문은 영어입니다. 브라우저 번역은 보조 수단입니다.
explanation: ''
---

Where a first-time visitor's eye lands, and whether that matches importance.
`

const ITEM_ONE = `---
sourceSection: Contrast
principles:
  - contrast
artefact:
  en: An orders page with a pale confirm button and a bright upgrade banner.
  ko: 확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.
prompt:
  en: Which element should carry the strongest contrast?
  ko: 어느 요소가 가장 강한 대비를 가져야 하나요?
options:
  en:
    - text: The confirm button
      reason: It is the action the page exists for.
      correct: true
    - text: The upgrade banner
      reason: It is the brightest thing on the page.
  ko:
    - text: 확정 버튼
      reason: 이 페이지가 존재하는 이유인 동작입니다.
      correct: true
    - text: 업그레이드 배너
      reason: 페이지에서 가장 선명한 요소입니다.
---
`

const ITEM_TWO = `---
sourceSection: Size
artefact:
  en: A dashboard whose largest text is the data-refresh time.
  ko: 가장 큰 글자가 데이터 갱신 시각인 대시보드.
prompt:
  en: Which number deserves the largest type?
  ko: 어느 숫자가 가장 큰 글자 크기를 받아야 하나요?
options:
  en:
    - text: The monthly revenue
      reason: It is what the dashboard is read for.
      correct: true
    - text: The refresh time
      reason: It tells the reader how fresh the numbers are.
  ko:
    - text: 월 매출
      reason: 이 대시보드를 보는 이유인 숫자입니다.
      correct: true
    - text: 갱신 시각
      reason: 숫자가 얼마나 최신인지 알려 줍니다.
---
`

/**
 * ITEM_TWO's judgement drawn across time instead of described (#64).
 *
 * Built from a list of states rather than written out once and edited, so a
 * test for a broken sequence breaks exactly the thing it is named after —
 * string surgery on YAML fails silently the day the indentation moves.
 */
function itemWithSequence(...states: string[]): string {
  return ITEM_TWO.replace('\n---\n', `\nsequence:\n${states.join('')}---\n`)
}

const STATE_ONE = `  - caption:
      en: The moment Refresh is tapped
      ko: 새로 고침을 누른 순간
    screen:
      en: |-
        <div class="screen"><p>Revenue 41,900</p></div>
      ko: |-
        <div class="screen"><p>매출 41,900</p></div>
`

const STATE_TWO = `  - caption:
      en: Three seconds later
      ko: 3초 뒤
    screen:
      en: |-
        <div class="screen"><p>Revenue 41,900</p></div>
      ko: |-
        <div class="screen"><p>매출 41,900</p></div>
`

const STATE_TWO_UNCAPTIONED = `  - screen:
      en: |-
        <div class="screen"><p>Revenue 41,900</p></div>
      ko: |-
        <div class="screen"><p>매출 41,900</p></div>
`

const ITEM_SEQUENCE = itemWithSequence(STATE_ONE, STATE_TWO)

const BRIEF = `---
stage: 1
principles:
  - contrast
title:
  en: Self-Audit Report
  ko: 자가 점검 리포트
intro:
  en: Examine the page and report what you find.
  ko: 페이지를 살펴보고 발견한 것을 보고하세요.
whatCounts:
  en: Three Findings, each naming an element and a Principle.
  ko: 발견 세 개, 각각 요소와 원칙을 지목합니다.
advice:
  en: Look before you reach for the Glossary.
  ko: 용어집을 펼치기 전에 먼저 페이지를 보세요.
---
`

const PRACTICE_EN = `<main>
<h1 data-element="page-title">Orders</h1>
<button data-element="confirm-selected-orders">Confirm selected orders</button>
</main>
`

const PRACTICE_KO = `<main>
<h1 data-element="page-title">주문</h1>
<button data-element="confirm-selected-orders">선택한 주문 확정</button>
</main>
`

const MANIFEST = `---
stage: 1
defects:
  - slug: primary-action-washed-out
    element: confirm-selected-orders
    competency: visual-hierarchy
    principle: contrast
    explanation:
      en: The one button this page exists for has the weakest contrast on it.
      ko: 이 페이지의 존재 이유인 버튼이 가장 약한 대비를 갖고 있습니다.
---
`

/**
 * The specimen Self-Audit Report (ADR-0011, artefact B) — a report this project
 * wrote as if a Learner had, of deliberately mixed quality, reviewing a Stage's
 * Practice Page. Its Findings obey the rules a real Learner's Finding obeys,
 * because a specimen that could not have been submitted is not a specimen.
 */
const SPECIMEN = `---
subject: 1
competency: visual-hierarchy
findings:
  - element: confirm-selected-orders
    principle: contrast
    quality: sound
    defect:
      en: The button this page exists for is the palest control on it.
      ko: 이 페이지의 존재 이유인 버튼이 화면에서 가장 흐린 컨트롤입니다.
    fix:
      en: Give it the strongest contrast on the page.
      ko: 페이지에서 가장 강한 대비를 이 버튼에 주세요.
  - element: page-title
    principle: contrast
    quality: taste
    defect:
      en: The heading would look better centred.
      ko: 제목은 가운데 정렬이 더 보기 좋겠습니다.
    fix:
      en: Centre the heading.
      ko: 제목을 가운데로 옮기세요.
---
`

/**
 * The same subject, walked instead of read (ADR-0010): identical elements,
 * arranged as steps a Learner moves between, with the behaviour in one file
 * both variants load.
 */
const WALKABLE_EN = `<main>
<section data-step="1" data-step-label="Step 1 of 2">
<h1 data-element="page-title">Orders</h1>
</section>
<section data-step="2" data-step-label="Step 2 of 2" hidden>
<button data-element="confirm-selected-orders">Confirm selected orders</button>
</section>
</main>
<script src="./practice-page.js"></script>
`

const WALKABLE_KO = `<main>
<section data-step="1" data-step-label="2단계 중 1단계">
<h1 data-element="page-title">주문</h1>
</section>
<section data-step="2" data-step-label="2단계 중 2단계" hidden>
<button data-element="confirm-selected-orders">선택한 주문 확정</button>
</section>
</main>
<script src="./practice-page.js"></script>
`

const MANIFEST_WALKABLE = MANIFEST.replace(
  '  - slug: primary-action-washed-out\n',
  '  - slug: primary-action-washed-out\n    step: 2\n',
)

/** Turn the scaffold's Stage 1 subject into a walkable one. */
function walkable(root: string) {
  write(root, 'practice-page/stage-1/en.html', WALKABLE_EN)
  write(root, 'practice-page/stage-1/ko.html', WALKABLE_KO)
  write(root, 'practice-page/stage-1/practice-page.js', 'void 0\n')
  write(root, 'practice-page/stage-1/manifest.md', MANIFEST_WALKABLE)
}

function scaffold(): string {
  const root = mkdtempSync(join(tmpdir(), 'ux-study-content-'))
  roots.push(root)
  write(root, 'config.md', CONFIG)
  write(root, 'glossary/contrast.md', GLOSSARY_CONTRAST)
  write(root, 'competencies/visual-hierarchy.md', COMPETENCY)
  write(root, 'items/visual-hierarchy/washed-out-confirm.md', ITEM_ONE)
  write(root, 'items/visual-hierarchy/refresh-time-size.md', ITEM_TWO)
  write(root, 'briefs/stage-1.md', BRIEF)
  write(root, 'practice-page/stage-1/en.html', PRACTICE_EN)
  write(root, 'practice-page/stage-1/ko.html', PRACTICE_KO)
  write(root, 'practice-page/stage-1/practice-page.css', 'main { padding: 1rem; }\n')
  write(root, 'practice-page/stage-1/manifest.md', MANIFEST)
  write(root, 'specimen-report.md', SPECIMEN)
  return root
}

function write(root: string, rel: string, text: string) {
  mkdirSync(join(root, dirname(rel)), { recursive: true })
  writeFileSync(join(root, rel), text)
}

/** Replace text inside a baseline constant, failing loudly if it is not there. */
function edit(text: string, from: string, to: string): string {
  expect(text).toContain(from)
  return text.replace(from, to)
}

function expectProblem(root: string, problem: RegExp) {
  try {
    loadContent(root)
    expect.fail('the content loaded despite the planted mistake')
  } catch (error) {
    expect(error).toBeInstanceOf(ContentError)
    expect((error as ContentError).message).toMatch(problem)
  }
}

test('the baseline fixture is valid, so each failing test below fails for its one planted mistake', () => {
  const content = loadContent(scaffold())
  expect(content.config.drawSize).toBe(2)
  expect(content.glossary.map((entry) => entry.slug)).toEqual(['contrast'])
  expect(content.competencies.map((competency) => competency.slug)).toEqual(['visual-hierarchy'])
  expect(content.items['visual-hierarchy']).toHaveLength(2)
  expect(content.briefs.map((brief) => brief.slug)).toEqual(['stage-1'])
  expect(practicePageOf(content, 1)!.elements.sort()).toEqual(['confirm-selected-orders', 'page-title'])
  expect(practicePageOf(content, 1)!.defects).toHaveLength(1)
  expect(content.specimen!.subject).toBe(1)
  expect(content.specimen!.findings.map((finding) => finding.quality)).toEqual(['sound', 'taste'])
})

test('an item can draw a sequence of states instead of one screen', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/refresh-time-size.md', ITEM_SEQUENCE)
  write(root, 'items/item-screen.css', '.screen { padding: 12px; }\n')

  const item = loadContent(root).items['visual-hierarchy'].find((entry) => entry.slug === 'refresh-time-size')!
  expect(item.screen).toBeUndefined()
  expect(item.sequence).toHaveLength(2)
  expect(item.sequence![0].caption).toEqual({
    en: 'The moment Refresh is tapped',
    ko: '새로 고침을 누른 순간',
  })
  expect(item.sequence![1].screen.ko).toContain('매출')
})

test('a sequence state missing one language variant fails the build', () => {
  // The case that would otherwise ship: it renders for one cohort and blank
  // for the other, and a suite exercising one language cannot see it.
  const root = scaffold()
  const koLess = STATE_ONE.replace(/      ko: \|-\n        <div class="screen"><p>매출 41,900<\/p><\/div>\n/, '')
  write(root, 'items/visual-hierarchy/refresh-time-size.md', itemWithSequence(koLess, STATE_TWO))
  expectProblem(root, /sequence\[0\]\.screen is missing its ko language variant/)
})

test('a sequence state with no caption fails the build', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/refresh-time-size.md', itemWithSequence(STATE_ONE, STATE_TWO_UNCAPTIONED))
  expectProblem(root, /sequence\[1\]\.caption must carry en and ko variants — it says when this state is/)
})

test('a sequence of one state fails the build, because one state is a screen', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/refresh-time-size.md', itemWithSequence(STATE_ONE))
  expectProblem(root, /sequence must list at least two states — one state is a screen/)
})

test('an item carrying both a screen and a sequence fails the build', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/refresh-time-size.md', ITEM_SEQUENCE.replace('sequence:', `screen:
  en: |-
    <div class="screen"><p>Revenue</p></div>
  ko: |-
    <div class="screen"><p>매출</p></div>
sequence:`))
  expectProblem(root, /an item draws either one screen or a sequence, never both/)
})

test('a sequence makes the item-screen stylesheet required, as a drawn screen does', () => {
  // The baseline fixture draws nothing, so it needs no stylesheet. Adding a
  // sequence is what starts asking for one — the states would still render,
  // unstyled, and the Learner would be judging a layout nobody authored.
  const root = scaffold()
  write(root, 'items/visual-hierarchy/refresh-time-size.md', ITEM_SEQUENCE)
  expectProblem(root, /items\/item-screen\.css is missing — items draw screens that nothing styles/)
})

test('a Competency missing one of its two language variants fails the build', () => {
  const root = scaffold()
  write(root, 'competencies/visual-hierarchy.md', edit(COMPETENCY, '\n  ko: 시각적 위계', ''))
  expectProblem(root, /competencies\/visual-hierarchy\.md: name is missing its ko language variant/)
})

test('a Competency without an objective fails the build', () => {
  const root = scaffold()
  write(
    root,
    'competencies/visual-hierarchy.md',
    edit(COMPETENCY, 'objective:\n  en: Say where a first-time visitor\'s eye lands first.\n  ko: 처음 방문한 사용자의 시선이 어디에 먼저 닿는지 말할 수 있다.\n', ''),
  )
  expectProblem(root, /competencies\/visual-hierarchy\.md: objective must carry en and ko variants/)
})

test('a Competency without pre-reading questions fails the build', () => {
  const root = scaffold()
  write(
    root,
    'competencies/visual-hierarchy.md',
    edit(COMPETENCY, '  - en: What pulls the eye first?\n    ko: 무엇이 시선을 먼저 끄는가?\n', '').replace(
      '  - en: What is the squint test for?\n    ko: 실눈 테스트는 무엇을 위한 것인가?\n',
      '',
    ),
  )
  expectProblem(root, /competencies\/visual-hierarchy\.md: preReadingQuestions must be a list of en\/ko question pairs/)
})

test('a Competency whose source lacks attribution fails the build', () => {
  const root = scaffold()
  write(
    root,
    'competencies/visual-hierarchy.md',
    edit(COMPETENCY, '\n  attribution: Example Author, Example Article, Example Publisher', ''),
  )
  expectProblem(root, /competencies\/visual-hierarchy\.md: source must carry the article url and its attribution/)
})

test('a browser-translation notice written as an en/ko pair fails the build', () => {
  const root = scaffold()
  write(
    root,
    'competencies/visual-hierarchy.md',
    edit(
      COMPETENCY,
      'koTranslationNotice: 원문은 영어입니다. 브라우저 번역은 보조 수단입니다.',
      'koTranslationNotice:\n  en: The article is in English.\n  ko: 원문은 영어입니다.',
    ),
  )
  expectProblem(root, /koTranslationNotice is Korean-only by design and must be a plain string/)
})

test('an explanation that is neither empty nor an en/ko pair fails the build', () => {
  const root = scaffold()
  write(root, 'competencies/visual-hierarchy.md', edit(COMPETENCY, "explanation: ''", 'explanation: one language only'))
  expectProblem(root, /explanation must be empty or an en\/ko pair/)
})

test('a Glossary entry missing one of its two language variants fails the build', () => {
  const root = scaffold()
  write(root, 'glossary/contrast.md', edit(GLOSSARY_CONTRAST, '\n  ko: 대비', ''))
  expectProblem(root, /glossary\/contrast\.md: name is missing its ko language variant/)
})

test('a quiz item with no keyed correct answer fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      ITEM_ONE,
      '      reason: It is the action the page exists for.\n      correct: true',
      '      reason: It is the action the page exists for.',
    ),
  )
  expectProblem(root, /washed-out-confirm\.md: options\.en keys 0 correct answers where exactly one is required/)
})

test('a quiz item option with no reason fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(ITEM_ONE, '      reason: It is the brightest thing on the page.\n', ''),
  )
  expectProblem(root, /washed-out-confirm\.md: an option in options\.en has no reason/)
})

test('a quiz item whose keyed option sits at a different index per language fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      edit(ITEM_ONE, '      reason: 이 페이지가 존재하는 이유인 동작입니다.\n      correct: true', '      reason: 이 페이지가 존재하는 이유인 동작입니다.'),
      '      reason: 페이지에서 가장 선명한 요소입니다.',
      '      reason: 페이지에서 가장 선명한 요소입니다.\n      correct: true',
    ),
  )
  expectProblem(root, /washed-out-confirm\.md: the correct option is #1 in en but #2 in ko/)
})

test('a quiz item with two keyed correct answers in one language fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(ITEM_ONE, '    - text: 업그레이드 배너', '    - text: 업그레이드 배너\n      correct: true'),
  )
  expectProblem(root, /washed-out-confirm\.md: options\.ko keys 2 correct answers where exactly one is required/)
})

test('a quiz item with nothing to examine fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      ITEM_ONE,
      'artefact:\n  en: An orders page with a pale confirm button and a bright upgrade banner.\n  ko: 확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.\n',
      '',
    ),
  )
  expectProblem(root, /washed-out-confirm\.md: missing artefact/)
})

test('an artefact written in one language only fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(ITEM_ONE, '\n  ko: 확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.', ''),
  )
  expectProblem(root, /washed-out-confirm\.md: artefact is missing its ko language variant/)
})

/**
 * The mistake is made the way it happens for real: the Korean is wrapped
 * between a word and the particle that belongs to it. In a folded scalar the
 * break becomes a space, so the source looks like ordinary wrapping and the
 * rendered sentence carries a typo. Only Korean can catch this — the English
 * sibling wraps in the same place and is fine.
 */
test('Korean wrapped between a word and its particle fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      ITEM_ONE,
      '  ko: 확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.',
      '  ko: >-\n    확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지\n    입니다.',
    ),
  )
  expectProblem(root, /washed-out-confirm\.md: artefact\.ko splits a particle from its word — "지 입니다"/)
})

/**
 * The justification is said out loud, so a slot cannot be followed by a
 * particle that agrees with the word filling it. The English template above
 * the Korean one has the same slot and no such problem.
 */
test('a Glossary slot followed by a particle that agrees with its filler fails the build', () => {
  const root = scaffold()
  write(
    root,
    'glossary/contrast.md',
    edit(
      GLOSSARY_CONTRAST,
      '  ko: 주요 동작이 주요 동작으로 읽히지 않습니다.',
      "  ko: '[요소]는 주요 동작으로 읽히지 않습니다.'",
    ),
  )
  expectProblem(root, /contrast\.md: justification\.ko puts "는" straight after \[요소\]/)
})

/** A slot that ends in a fixed noun settles the agreement itself, and loads. */
test('a Glossary slot ending in a fixed noun may carry a particle', () => {
  const root = scaffold()
  write(
    root,
    'glossary/contrast.md',
    edit(
      GLOSSARY_CONTRAST,
      '  ko: 주요 동작이 주요 동작으로 읽히지 않습니다.',
      "  ko: '[읽는 사람]이 먼저 보는 자리가 주요 동작으로 읽히지 않습니다.'",
    ),
  )
  expect(() => loadContent(root)).not.toThrow()
})

/** The bound nouns Korean does space are not particles, and must still load. */
test('Korean spacing a bound noun such as 뿐 or 만큼 loads', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      ITEM_ONE,
      '  ko: 확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.',
      '  ko: 선명한 것은 배너뿐이고, 확정 버튼은 알아볼 수 없을 만큼 흐립니다.',
    ),
  )
  expect(() => loadContent(root)).not.toThrow()
})

test('a quiz item that asks nothing fails the build', () => {
  const root = scaffold()
  write(
    root,
    'items/visual-hierarchy/washed-out-confirm.md',
    edit(
      ITEM_ONE,
      'prompt:\n  en: Which element should carry the strongest contrast?\n  ko: 어느 요소가 가장 강한 대비를 가져야 하나요?\n',
      '',
    ),
  )
  expectProblem(root, /washed-out-confirm\.md: prompt must carry en and ko variants/)
})

test('a quiz item with no article-section pointer fails the build', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/washed-out-confirm.md', edit(ITEM_ONE, 'sourceSection: Contrast\n', ''))
  expectProblem(root, /washed-out-confirm\.md: missing sourceSection/)
})

test('an item pool smaller than the number of items an attempt draws fails the build', () => {
  const root = scaffold()
  rmSync(join(root, 'items/visual-hierarchy/refresh-time-size.md'))
  expectProblem(root, /items\/visual-hierarchy: a pool of 1 is smaller than the 2 items an attempt draws/)
})

test('an empty item pool directory fails the build like any undersized pool', () => {
  const root = scaffold()
  rmSync(join(root, 'items/visual-hierarchy/washed-out-confirm.md'))
  rmSync(join(root, 'items/visual-hierarchy/refresh-time-size.md'))
  expectProblem(root, /items\/visual-hierarchy: a pool of 0 is smaller than the 2 items an attempt draws/)
})

test('an item pool for a Competency not declared in config fails the build', () => {
  const root = scaffold()
  write(root, 'items/form-burden/some-item.md', ITEM_TWO)
  expectProblem(root, /items\/form-burden: item pool for a Competency declared under no Stage in config\.md/)
})

test('a Competency file not declared in config fails the build', () => {
  const root = scaffold()
  write(root, 'competencies/form-burden.md', COMPETENCY)
  expectProblem(root, /competencies\/form-burden\.md: "form-burden" is not a Competency declared under any Stage in config\.md/)
})

test('a Stage declared but wholly unauthored loads: no definitions, no pools', () => {
  // The state Stage 2 and Stage 3 are in the day this lands. Declaring a Stage
  // has to be possible before writing it, or no later-Stage content can enter
  // the repository even as a draft — the same tolerance an unauthored Stage 1
  // pool already had.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  const content = loadContent(root)
  expect(competenciesOfStage(content.config, 2)).toEqual(['system-status', 'form-burden'])
  expect(content.competencies.map((competency) => competency.slug)).toEqual(['visual-hierarchy'])
  expect(content.items['form-burden']).toBeUndefined()
})

test('a Competency declared but unauthored has no item pool — the state the Gate Quiz doorstep says out loud', () => {
  // The sibling of the subject rule below, and the one that was missing. The
  // loader has always tolerated a Competency with no pool directory, but the
  // only way to ask was `content.items[slug]`, which answers `undefined` — and
  // the draw behind the Start button called `.map` on it, so a Learner who
  // opened the quiz of a declared-but-unwritten Competency got a TypeError
  // where the doorstep should have said the items were not written yet
  // (ERR-220). `itemPoolOf` is what both the doorstep and the draw now branch
  // on.
  //
  // A fixture root rather than the real content, so this keeps testing the
  // rule after Stage 3's pools are authored and no request can reach the state
  // any more — the move #77 forced on the subject rule, made in advance here.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  const content = loadContent(root)

  expect(itemPoolOf(content, 'form-burden')).toBeNull()
  // Against an authored Competency in the same root, so that null means
  // "nobody has written this yet" and not "this loader answers null".
  expect(itemPoolOf(content, 'visual-hierarchy')).not.toBeNull()
})

test('a Stage declared but unauthored has no subject — the state both audit surfaces are built to say out loud', () => {
  // #61 requires that a Stage the curriculum declares but nobody has authored
  // a subject for is said in words — on the Learner's audit surface and in the
  // Maintainer's content page — rather than left as a screen with nothing on
  // it. That rule was tested over HTTP in surfaces.test.ts, against Stage 3,
  // for as long as Stage 3 was the unauthored one.
  //
  // It moved here when Stage 3 gained its subject (#77). config.md declares
  // three Stages and all three now have one, so no request can produce the
  // state and an HTTP test for it could only ever be green for the wrong
  // reason. A fixture root is the one place it can still be built, and this is
  // what both surfaces branch on: `null`, rather than a throw, an empty page,
  // or a subject with no defects — each of those sends a surface down a
  // different path than the one that speaks.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  const content = loadContent(root)

  expect(practicePageOf(content, 2)).toBeNull()
  // Against an authored Stage in the same root, so that null means "nobody has
  // written this yet" and not "this loader answers null".
  expect(practicePageOf(content, 1)).not.toBeNull()
})

test('a Stage declared out of order, or twice, fails the build', () => {
  const root = scaffold()
  write(root, 'config.md', edit(CONFIG_TWO_STAGES, '  - stage: 2', '  - stage: 1'))
  expectProblem(root, /stages must be declared in ascending Stage order, each Stage once/)
})

test('one Competency declared under two Stages fails the build', () => {
  const root = scaffold()
  write(root, 'config.md', edit(CONFIG_TWO_STAGES, '      - system-status', '      - readability'))
  expectProblem(root, /stages repeat a Competency slug/)
})

test('a config declaring no Stages at all fails the build', () => {
  const root = scaffold()
  write(root, 'config.md', edit(CONFIG, 'stages:', 'stagesTypo:'))
  expectProblem(root, /stages must declare each Stage and the Competency slugs it holds/)
})

test('a quiz item citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/washed-out-confirm.md', edit(ITEM_ONE, '  - contrast', '  - affordance'))
  expectProblem(root, /washed-out-confirm\.md: cites UX Principle "affordance", absent from the Glossary/)
})

test('a brief missing a paragraph a Learner reads fails the build', () => {
  // The generic pair walker cannot catch this one: it inspects the fields that
  // are there, so an absent field is invisible to it. Until #129 a brief
  // without a title passed the build and threw on the audit surface instead.
  const root = scaffold()
  write(root, 'briefs/stage-1.md', edit(BRIEF, 'title:\n  en: Self-Audit Report\n  ko: 자가 점검 리포트\n', ''))
  expectProblem(root, /briefs\/stage-1\.md: title must carry en and ko variants/)
})

test('a Peer Review paragraph written as one string, not a pair, fails the build', () => {
  // Stage 3's alone, so its absence is fine. Written as a bare string it is
  // invisible to the generic pair walker — that walker only descends into
  // records — and would have reached the surface as `undefined[lang]`.
  const root = scaffold()
  write(root, 'briefs/stage-1.md', edit(BRIEF, 'advice:', 'peerReview: A colleague may read this.\nadvice:'))
  expectProblem(root, /briefs\/stage-1\.md: peerReview must carry en and ko variants/)
})

test('a Peer Review paragraph in one language only fails the build', () => {
  const root = scaffold()
  write(root, 'briefs/stage-1.md', edit(BRIEF, 'advice:', 'peerReview:\n  en: A colleague may read this.\nadvice:'))
  expectProblem(root, /briefs\/stage-1\.md: peerReview is missing its ko language variant/)
})

test('a brief citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'briefs/stage-1.md', edit(BRIEF, '  - contrast', '  - affordance'))
  expectProblem(root, /briefs\/stage-1\.md: cites UX Principle "affordance", absent from the Glossary/)
})

test('a Planted Defect citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST, 'principle: contrast', 'principle: affordance'))
  expectProblem(root, /cites UX Principle "affordance", absent from the Glossary/)
})

test('a Planted Defect naming an element that does not exist on the page fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST, 'element: confirm-selected-orders', 'element: upgrade-banner'))
  expectProblem(root, /names element "upgrade-banner", which does not exist on the Practice Page/)
})

test('a Planted Defect citing a Competency nobody has been taught fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST, 'competency: visual-hierarchy', 'competency: form-burden'))
  expectProblem(root, /cites Competency "form-burden", which no Learner reaching Stage 1 has been taught/)
})

test('a Planted Defect citing a declared but later Stage Competency still fails the build', () => {
  // Declared is not enough for this page. It is Stage 1's subject, so a defect
  // planted on it that only a Stage 2 Competency names is one the Learner
  // auditing it has not been taught to see.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST, 'competency: visual-hierarchy', 'competency: form-burden'))
  expectProblem(root, /cites Competency "form-burden", which no Learner reaching Stage 1 has been taught/)
})

test("an audit subject may plant a defect from an earlier Stage's Competencies", () => {
  // The reverse of the rule above, and it must stay allowed: a Stage 2 page
  // whose layout is also badly ordered is what real work looks like, and the
  // Learner reaching it was taught to see that in Stage 1.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  write(root, 'practice-page/stage-2/en.html', PRACTICE_EN)
  write(root, 'practice-page/stage-2/ko.html', PRACTICE_KO)
  write(root, 'practice-page/stage-2/practice-page.css', 'main { padding: 1rem; }\n')
  write(root, 'practice-page/stage-2/manifest.md', MANIFEST)

  const content = loadContent(root)
  expect(practicePageOf(content, 2)?.defects[0].competency).toBe('visual-hierarchy')
})

test('a Stage that has begun a subject owes all three of its parts', () => {
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  write(root, 'practice-page/stage-2/en.html', PRACTICE_EN)
  expectProblem(root, /practice-page\/stage-2\/ko\.html is missing/)
  expectProblem(root, /practice-page\/stage-2\/practice-page\.css is missing/)
  expectProblem(root, /practice-page\/stage-2\/manifest\.md is missing/)
})

test('an audit subject for a Stage the curriculum does not declare fails the build', () => {
  // Content nobody can ever reach. Silently ignoring it is how an authored
  // page sits unnoticed for a release.
  const root = scaffold()
  write(root, 'practice-page/stage-3/en.html', PRACTICE_EN)
  expectProblem(root, /Stage 3 is not declared in config\.md, so no Learner can reach this/)
})

test('a Stage with no subject directory is not a failure — it simply has none yet', () => {
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)

  const content = loadContent(root)
  expect(practicePageOf(content, 1)).not.toBeNull()
  expect(practicePageOf(content, 2)).toBeNull()
})

test('language variants with different element identifiers fail the build', () => {
  const root = scaffold()
  write(root, 'practice-page/stage-1/en.html', PRACTICE_EN + '<div data-element="only-in-en"></div>\n')
  expectProblem(root, /do not expose an identical set of element identifiers — only in en: only-in-en/)
})

test('a repeated element identifier fails the build', () => {
  const root = scaffold()
  const repeated = '<p data-element="page-title">again</p>\n'
  write(root, 'practice-page/stage-1/en.html', PRACTICE_EN + repeated)
  write(root, 'practice-page/stage-1/ko.html', PRACTICE_KO + repeated)
  expectProblem(root, /element identifier "page-title" appears more than once/)
})

test('a walkable subject loads, carrying its steps and the behaviour both variants share', () => {
  const root = scaffold()
  walkable(root)

  const page = practicePageOf(loadContent(root), 1)!
  expect(page.steps).toEqual([1, 2])
  expect(page.js).toBe('void 0\n')
  expect(page.defects[0].step).toBe(2)
})

test('a subject that walks but has no behaviour fails the build', () => {
  const root = scaffold()
  walkable(root)
  rmSync(join(root, 'practice-page/stage-1/practice-page.js'))
  expectProblem(root, /practice-page\.js is missing — a subject that walks needs the behaviour both variants share/)
})

test('language variants that walk different steps fail the build', () => {
  // The identifier check cannot see this: both variants can expose the same
  // elements while one of them reaches an element a step later.
  const root = scaffold()
  walkable(root)
  write(root, 'practice-page/stage-1/ko.html', edit(WALKABLE_KO, 'data-step="2"', 'data-step="3"'))
  expectProblem(root, /walk different steps — en: 1, 2, ko: 1, 3/)
})

test('a Planted Defect on a walkable subject that names no step fails the build', () => {
  const root = scaffold()
  walkable(root)
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST_WALKABLE, '    step: 2\n', ''))
  expectProblem(root, /must name the step it occurs in, one of 1, 2/)
})

test('a Planted Defect naming a step the subject does not walk fails the build', () => {
  const root = scaffold()
  walkable(root)
  write(root, 'practice-page/stage-1/manifest.md', edit(MANIFEST_WALKABLE, 'step: 2', 'step: 9'))
  expectProblem(root, /must name the step it occurs in, one of 1, 2/)
})

test('a Planted Defect on a subject that walks nowhere may not name a step', () => {
  // The reverse drift: a step recorded against a single page would send a
  // Learner back to a moment the subject does not have.
  const root = scaffold()
  write(root, 'practice-page/stage-1/manifest.md', MANIFEST_WALKABLE)
  expectProblem(root, /names a step, but this subject is one page and walks nowhere/)
})

/**
 * The specimen Self-Audit Report (ADR-0011, artefact B). Every rule below is
 * one `addFinding` already enforces on a Learner's own submission — the element
 * exists on the subject, the Principle is a Glossary slug, one element carries
 * one Finding. A specimen breaking any of them is a report the platform would
 * have refused, and the Learner it is handed to is being asked to judge
 * something that could not have happened.
 */

test('a specimen Finding naming an element the subject does not expose fails the build', () => {
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'element: page-title', 'element: shipping-form'))
  expectProblem(root, /names element "shipping-form", which does not exist/)
})

test('a specimen Finding citing a Principle absent from the Glossary fails the build', () => {
  // Wrongness is the point of this artefact, and this is the line between the
  // two kinds. A Learner selects the Principle from the Glossary, so a name
  // that is not in it is not a Learner's mistake we authored — it is ours.
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'principle: contrast\n    quality: taste', 'principle: proximity\n    quality: taste'))
  expectProblem(root, /cites UX Principle "proximity", absent from the Glossary/)
})

test('two specimen Findings on one element fail the build', () => {
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'element: page-title', 'element: confirm-selected-orders'))
  expectProblem(root, /two Findings on element "confirm-selected-orders"/)
})

test('a specimen Finding whose quality is not one of the four authored shapes fails the build', () => {
  // The quality labels are what prove the mix ADR-0011 asks for is present. A
  // typo here would quietly drop one shape out of the count.
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'quality: taste', 'quality: preference'))
  expectProblem(root, /quality "preference"/)
})

test('a specimen Finding missing its Korean fails the build', () => {
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, '      ko: 제목을 가운데로 옮기세요.\n', ''))
  expectProblem(root, /findings\[1\]\.fix is missing its ko language variant/)
})

test('a specimen Finding missing its English fails the build', () => {
  // The other direction, because a suite that only ever deletes the Korean
  // proves the check runs and not that it runs both ways — and the cohort
  // reading English is the one nobody here would notice was missing.
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, '      en: Centre the heading.\n', ''))
  expectProblem(root, /findings\[1\]\.fix is missing its en language variant/)
})

test('a specimen carrying fewer Findings than a complete report requires fails the build', () => {
  // The minimum is config.md's, not a number typed here: a specimen thinner
  // than a submission the platform would accept is not the artefact a Learner
  // is being asked to judge.
  const root = scaffold()
  write(root, 'config.md', edit(CONFIG, 'minFindings: 1', 'minFindings: 3'))
  expectProblem(root, /carries 2 Findings, fewer than the 3 a complete report requires/)
})

test('a specimen carrying no Findings at all fails the build', () => {
  // The length a "too thin" rule is likeliest to be written around rather than
  // for: an empty list is a report of nothing, and it has to fail the same
  // check a short one does rather than fall through it.
  const root = scaffold()
  write(root, 'specimen-report.md', SPECIMEN.slice(0, SPECIMEN.indexOf('findings:')) + 'findings: []\n---\n')
  expectProblem(root, /carries 0 Findings, fewer than the 1 a complete report requires/)
})

test('a specimen reviewing a Stage with no authored subject fails the build', () => {
  // Without the page, no Finding's element can be checked against anything —
  // the specimen would load with every rule above unenforced.
  const root = scaffold()
  write(root, 'config.md', CONFIG_TWO_STAGES)
  write(root, 'specimen-report.md', edit(SPECIMEN, 'subject: 1', 'subject: 2'))
  expectProblem(root, /reviews Stage 2, which has no authored subject/)
})

test('a specimen naming a Competency the curriculum does not declare fails the build', () => {
  // The only route to this artefact is a link on one Competency's page. A slug
  // that names nothing would take that link away with nothing to notice it —
  // the build would pass and the report would simply be unreachable.
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'competency: visual-hierarchy', 'competency: heuristic-evaluation'))
  expectProblem(root, /names Competency "heuristic-evaluation", which config.md does not declare/)
})

test('a specimen reviewing a Stage the curriculum does not declare fails the build', () => {
  const root = scaffold()
  write(root, 'specimen-report.md', edit(SPECIMEN, 'subject: 1', 'subject: 4'))
  expectProblem(root, /reviews Stage 4, which config.md does not declare/)
})

test('no specimen at all is not a failure — it simply has none yet', () => {
  // The same tolerance an unauthored item pool and an unauthored subject
  // already have. What must never be silent is a surface meeting that state,
  // and `specimenAsServed` hands back null for it rather than an empty report.
  const root = scaffold()
  rmSync(join(root, 'specimen-report.md'))

  const content = loadContent(root)
  expect(content.specimen).toBeNull()
  expect(specimenAsServed(content)).toBeNull()
})

test('the specimen as served carries no quality label', () => {
  // The reader judges the report; the Stage 1 manifest they were already shown
  // is what settles it. Serving the labels would answer the exercise, so the
  // projection drops them rather than a surface remembering not to render one.
  const served = specimenAsServed(loadContent(scaffold()))!
  expect(JSON.stringify(served)).not.toContain('quality')
  expect(JSON.stringify(served)).not.toContain('sound')
  expect(served.findings.map((finding) => finding.element)).toEqual(['confirm-selected-orders', 'page-title'])
  expect(served.findings[0].fix.ko).toBe('페이지에서 가장 강한 대비를 이 버튼에 주세요.')
})

test('the repository content loads, with every authored Glossary entry accounted for', () => {
  const content = loadContent(join(__dirname, '..', 'content'))

  expect(content.config).toEqual({
    poolSize: 8,
    drawSize: 5,
    passThreshold: 4,
    minFindings: 3,
    stages: [
      { stage: 1, competencies: ['visual-hierarchy', 'readability', 'consistency', 'perceived-clickability'] },
      { stage: 2, competencies: ['system-status', 'error-handling', 'form-burden', 'way-back-and-control'] },
      {
        stage: 3,
        competencies: ['jargon', 'mental-model-mismatch', 'heuristic-evaluation', 'testing-with-real-users'],
      },
    ],
  })
  expect(content.glossary.map((entry) => entry.slug)).toEqual([
    'appropriate-feedback',
    'cognitive-load',
    'common-region',
    'consistency',
    'contrast',
    'control-fit',
    'disabled-state',
    'emergency-exit',
    'error-recovery',
    'expanded-acronym',
    'facilitator-neutrality',
    'five-participants',
    'independent-evaluation',
    'inline-validation',
    'legibility',
    'mental-model',
    'model-inertia',
    'named-heuristic',
    'paired-term',
    'plain-language',
    'premature-error',
    'proximity',
    'readability',
    'realistic-task',
    'scale',
    'sense-of-place',
    'signifier',
    'smart-defaults',
    'system-status',
    'undo',
    'visual-hierarchy',
  ])
  const contrast = content.glossary.find((entry) => entry.slug === 'contrast')
  expect(contrast?.name).toEqual({ en: 'Contrast', ko: '대비' })
  expect(practicePageOf(content, 1)!.defects).toHaveLength(6)
})

test('a content mistake fails the build: next.config refuses to load', async () => {
  const root = scaffold()
  rmSync(join(root, 'items/visual-hierarchy/refresh-time-size.md'))

  // next.config.ts validates content at module load, which is exactly what
  // `next build` and `next start` evaluate — so this import is the build path.
  process.env.CONTENT_DIR = root
  vi.resetModules()
  await expect(import('../next.config')).rejects.toThrow(/Content validation failed/)
})
