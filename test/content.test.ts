import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, expect, test, vi } from 'vitest'

import {
  competenciesOfStage,
  ContentError,
  itemPoolOf,
  loadContent,
  practicePageOf,
  specimenAsServed,
  validateContent,
  type ContentSource,
  type SourceDoc,
  type SourcePracticePage,
} from '../lib/content'

/**
 * Fixture-driven proof of every build-failing content check (#10). Each test
 * hands the rules a valid curriculum with exactly one thing broken, and
 * asserts they refuse it — the failing case, not only the passing one. The
 * rules are what `next.config.ts` runs on build and start, so a refusal here
 * is a build failure; the last test proves that wiring itself.
 *
 * These tests call the loader directly rather than driving the app over HTTP
 * (the repo's usual convention): a refused build has no HTTP surface to
 * observe — refusing to start is the observable behaviour.
 *
 * The fixtures are records rather than a directory of authored markdown
 * (#132). `validateContent` holds every rule and touches no disk, so a test
 * for one rule costs one object literal — no temp directory, no eleven files,
 * and no string surgery on YAML to fail silently the day the indentation
 * moves. The two tests that are about *reading* keep their filesystem, and
 * say so where they sit, at the end.
 */

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
  delete process.env.CONTENT_DIR
})

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

// ── The curriculum every rule below is asked about ───────────────────────────
//
// Exactly what `readSource` hands the rules, had it read this off a disk.

/** One parsed file. The name a rule quotes back is the tail of `rel`. */
function doc(rel: string, data: Record<string, unknown>, body = ''): SourceDoc {
  return { rel, name: rel.slice(rel.lastIndexOf('/') + 1), data, body }
}

/** The same front matter with one field unauthored — an omission, not an empty value. */
function without(data: Record<string, unknown>, ...fields: string[]): Record<string, unknown> {
  const copy = { ...data }
  for (const field of fields) delete copy[field]
  return copy
}

// drawSize is 2 so a full pool needs only two fixture items.
const CONFIG = {
  poolSize: 3,
  drawSize: 2,
  passThreshold: 2,
  minFindings: 1,
  stages: [{ stage: 1, competencies: ['visual-hierarchy', 'readability', 'consistency', 'perceived-clickability'] }],
}

/** The same fixture with a second, wholly unauthored Stage declared. */
const CONFIG_TWO_STAGES = {
  ...CONFIG,
  stages: [...CONFIG.stages, { stage: 2, competencies: ['system-status', 'form-burden'] }],
}

const GLOSSARY_CONTRAST = {
  slug: 'contrast',
  name: { en: 'Contrast', ko: '대비' },
  definition: {
    en: 'How far an element sits from its background and its neighbours.',
    ko: '요소가 배경과 주변 요소로부터 얼마나 떨어져 보이는지.',
  },
  justification: {
    en: 'The primary action does not read as primary.',
    ko: '주요 동작이 주요 동작으로 읽히지 않습니다.',
  },
  competencies: ['visual-hierarchy'],
  source: 'https://example.test/contrast',
}

const COMPETENCY = {
  name: { en: 'Visual hierarchy', ko: '시각적 위계' },
  objective: {
    en: "Say where a first-time visitor's eye lands first.",
    ko: '처음 방문한 사용자의 시선이 어디에 먼저 닿는지 말할 수 있다.',
  },
  roleHint: {
    developer: { en: 'Look at the screen you built.', ko: '직접 만든 화면을 보세요.' },
    pm: { en: 'Walk the flow you signed off.', ko: '승인한 플로우를 따라가 보세요.' },
  },
  preReadingQuestions: [
    { en: 'What pulls the eye first?', ko: '무엇이 시선을 먼저 끄는가?' },
    { en: 'What is the squint test for?', ko: '실눈 테스트는 무엇을 위한 것인가?' },
  ],
  source: { url: 'https://example.test/article', attribution: 'Example Author, Example Article, Example Publisher' },
  koTranslationNotice: '원문은 영어입니다. 브라우저 번역은 보조 수단입니다.',
  explanation: '',
}

const COMPETENCY_BODY = "\nWhere a first-time visitor's eye lands, and whether that matches importance.\n"

const CONFIRM_BUTTON = { text: 'The confirm button', reason: 'It is the action the page exists for.', correct: true }
const UPGRADE_BANNER = { text: 'The upgrade banner', reason: 'It is the brightest thing on the page.' }
const CONFIRM_BUTTON_KO = { text: '확정 버튼', reason: '이 페이지가 존재하는 이유인 동작입니다.', correct: true }
const UPGRADE_BANNER_KO = { text: '업그레이드 배너', reason: '페이지에서 가장 선명한 요소입니다.' }

const ITEM_ONE = {
  sourceSection: 'Contrast',
  principles: ['contrast'],
  artefact: {
    en: 'An orders page with a pale confirm button and a bright upgrade banner.',
    ko: '확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지.',
  },
  prompt: {
    en: 'Which element should carry the strongest contrast?',
    ko: '어느 요소가 가장 강한 대비를 가져야 하나요?',
  },
  options: { en: [CONFIRM_BUTTON, UPGRADE_BANNER], ko: [CONFIRM_BUTTON_KO, UPGRADE_BANNER_KO] },
}

/** ITEM_ONE with its options replaced — the one field the option rules break. */
function itemWithOptions(en: unknown[], ko: unknown[]): Record<string, unknown> {
  return { ...ITEM_ONE, options: { en, ko } }
}

const ITEM_TWO = {
  sourceSection: 'Size',
  artefact: {
    en: 'A dashboard whose largest text is the data-refresh time.',
    ko: '가장 큰 글자가 데이터 갱신 시각인 대시보드.',
  },
  prompt: { en: 'Which number deserves the largest type?', ko: '어느 숫자가 가장 큰 글자 크기를 받아야 하나요?' },
  options: {
    en: [
      { text: 'The monthly revenue', reason: 'It is what the dashboard is read for.', correct: true },
      { text: 'The refresh time', reason: 'It tells the reader how fresh the numbers are.' },
    ],
    ko: [
      { text: '월 매출', reason: '이 대시보드를 보는 이유인 숫자입니다.', correct: true },
      { text: '갱신 시각', reason: '숫자가 얼마나 최신인지 알려 줍니다.' },
    ],
  },
}

/** ITEM_TWO's judgement drawn across time instead of described (#64). */
const STATE_ONE = {
  caption: { en: 'The moment Refresh is tapped', ko: '새로 고침을 누른 순간' },
  screen: {
    en: '<div class="screen"><p>Revenue 41,900</p></div>',
    ko: '<div class="screen"><p>매출 41,900</p></div>',
  },
}

const STATE_TWO = {
  caption: { en: 'Three seconds later', ko: '3초 뒤' },
  screen: {
    en: '<div class="screen"><p>Revenue 41,900</p></div>',
    ko: '<div class="screen"><p>매출 41,900</p></div>',
  },
}

const STATE_TWO_UNCAPTIONED = without(STATE_TWO, 'caption')

const ITEM_SEQUENCE = { ...ITEM_TWO, sequence: [STATE_ONE, STATE_TWO] }

const BRIEF = {
  stage: 1,
  principles: ['contrast'],
  title: { en: 'Self-Audit Report', ko: '자가 점검 리포트' },
  intro: { en: 'Examine the page and report what you find.', ko: '페이지를 살펴보고 발견한 것을 보고하세요.' },
  whatCounts: {
    en: 'Three Findings, each naming an element and a Principle.',
    ko: '발견 세 개, 각각 요소와 원칙을 지목합니다.',
  },
  advice: { en: 'Look before you reach for the Glossary.', ko: '용어집을 펼치기 전에 먼저 페이지를 보세요.' },
  optionalFix: {
    en: 'Optional once submitted — fix one Finding and show the change.',
    ko: '제출한 뒤에 선택으로, 발견 하나를 고치고 그 변화를 보여 주세요.',
  },
}

const DEFECT = {
  slug: 'primary-action-washed-out',
  element: 'confirm-selected-orders',
  competency: 'visual-hierarchy',
  principle: 'contrast',
  explanation: {
    en: 'The one button this page exists for has the weakest contrast on it.',
    ko: '이 페이지의 존재 이유인 버튼이 가장 약한 대비를 갖고 있습니다.',
  },
}

const MANIFEST = { stage: 1, defects: [DEFECT] }
const MANIFEST_WALKABLE = { ...MANIFEST, defects: [{ ...DEFECT, step: 2 }] }

/** The Stage 1 manifest with its one Planted Defect replaced. */
function manifestOf(defect: Record<string, unknown>): SourceDoc {
  return doc('practice-page/stage-1/manifest.md', { ...MANIFEST, defects: [defect] })
}

const FINDING_SOUND = {
  element: 'confirm-selected-orders',
  principle: 'contrast',
  quality: 'sound',
  defect: {
    en: 'The button this page exists for is the palest control on it.',
    ko: '이 페이지의 존재 이유인 버튼이 화면에서 가장 흐린 컨트롤입니다.',
  },
  fix: {
    en: 'Give it the strongest contrast on the page.',
    ko: '페이지에서 가장 강한 대비를 이 버튼에 주세요.',
  },
}

const FINDING_TASTE = {
  element: 'page-title',
  principle: 'contrast',
  quality: 'taste',
  defect: { en: 'The heading would look better centred.', ko: '제목은 가운데 정렬이 더 보기 좋겠습니다.' },
  fix: { en: 'Centre the heading.', ko: '제목을 가운데로 옮기세요.' },
}

/**
 * The specimen Self-Audit Report (ADR-0011, artefact B) — a report this project
 * wrote as if a Learner had, of deliberately mixed quality, reviewing a Stage's
 * Practice Page. Its Findings obey the rules a real Learner's Finding obeys,
 * because a specimen that could not have been submitted is not a specimen.
 */
const SPECIMEN = { subject: 1, competency: 'visual-hierarchy', findings: [FINDING_SOUND, FINDING_TASTE] }

/** The specimen with its second, taste-not-defect Finding replaced. */
function specimenOf(finding: Record<string, unknown>): SourceDoc {
  return doc('specimen-report.md', { ...SPECIMEN, findings: [FINDING_SOUND, finding] })
}

const PAGE_CSS = 'main { padding: 1rem; }\n'

/** The baseline Stage 1 subject, with any of its parts replaced. */
function subject(overrides: Partial<SourcePracticePage> = {}): SourcePracticePage {
  return {
    name: 'stage-1',
    html: { en: PRACTICE_EN, ko: PRACTICE_KO },
    css: PAGE_CSS,
    js: null,
    manifest: doc('practice-page/stage-1/manifest.md', MANIFEST),
    ...overrides,
  }
}

/** The same subject walked instead of read (ADR-0010), with any part replaced. */
function walkableSubject(overrides: Partial<SourcePracticePage> = {}): SourcePracticePage {
  return subject({
    html: { en: WALKABLE_EN, ko: WALKABLE_KO },
    js: 'void 0\n',
    manifest: doc('practice-page/stage-1/manifest.md', MANIFEST_WALKABLE),
    ...overrides,
  })
}

/**
 * The baseline Stage 1 item pool, in the order a directory listing hands it
 * over. Each argument is one item's front matter, so a test names only the
 * item it breaks.
 */
function pool(washedOutConfirm: Record<string, unknown> = ITEM_ONE, refreshTimeSize: Record<string, unknown> = ITEM_TWO) {
  return [
    {
      competency: 'visual-hierarchy',
      docs: [
        doc('items/visual-hierarchy/refresh-time-size.md', refreshTimeSize),
        doc('items/visual-hierarchy/washed-out-confirm.md', washedOutConfirm),
      ],
    },
  ]
}

/** The baseline Competency, with its front matter replaced. */
function competency(data: Record<string, unknown>): SourceDoc {
  return doc('competencies/visual-hierarchy.md', data, COMPETENCY_BODY)
}

/** A valid curriculum, with whichever part a test breaks handed in instead. */
function sourceOf(overrides: Partial<ContentSource> = {}): ContentSource {
  return {
    config: doc('config.md', CONFIG),
    glossary: [doc('glossary/contrast.md', GLOSSARY_CONTRAST)],
    competencies: [doc('competencies/visual-hierarchy.md', COMPETENCY, COMPETENCY_BODY)],
    itemPools: pool(),
    itemScreenCss: null,
    briefs: [doc('briefs/stage-1.md', BRIEF)],
    practicePages: [subject()],
    specimen: doc('specimen-report.md', SPECIMEN),
    ...overrides,
  }
}

function expectProblem(source: ContentSource, problem: RegExp) {
  try {
    validateContent(source)
    expect.fail('the content loaded despite the planted mistake')
  } catch (error) {
    expect(error).toBeInstanceOf(ContentError)
    expect((error as ContentError).message).toMatch(problem)
  }
}

/** Every problem at once, for the tests that count them rather than name one. */
function problemsFrom(source: ContentSource): string[] {
  try {
    validateContent(source)
    return []
  } catch (error) {
    expect(error).toBeInstanceOf(ContentError)
    return (error as ContentError).message.split('\n').map((line) => line.trim())
  }
}

test('the baseline fixture is valid, so each failing test below fails for its one planted mistake', () => {
  const content = validateContent(sourceOf())
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

test('a declared but wholly unauthored curriculum is valid — authoring is what fills it', () => {
  // The opposite end of the baseline: declaring the programme has to be
  // possible before a word of it is written, so an empty curriculum is a
  // state, not a mistake.
  const content = validateContent(
    sourceOf({ glossary: [], competencies: [], itemPools: [], briefs: [], practicePages: [], specimen: null }),
  )
  expect(content.config.stages).toEqual(CONFIG.stages)
  expect(content.competencies).toEqual([])
  expect(content.practicePages).toEqual([])
})

test('an item can draw a sequence of states instead of one screen', () => {
  const content = validateContent(
    sourceOf({ itemPools: pool(ITEM_ONE, ITEM_SEQUENCE), itemScreenCss: '.screen { padding: 12px; }\n' }),
  )

  const item = content.items['visual-hierarchy'].find((entry) => entry.slug === 'refresh-time-size')!
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
  const koLess = { ...STATE_ONE, screen: { en: STATE_ONE.screen.en } }
  expectProblem(
    sourceOf({ itemPools: pool(ITEM_ONE, { ...ITEM_TWO, sequence: [koLess, STATE_TWO] }) }),
    /sequence\[0\]\.screen is missing its ko language variant/,
  )
})

test('a sequence state with no caption fails the build', () => {
  expectProblem(
    sourceOf({ itemPools: pool(ITEM_ONE, { ...ITEM_TWO, sequence: [STATE_ONE, STATE_TWO_UNCAPTIONED] }) }),
    /sequence\[1\]\.caption must carry en and ko variants — it says when this state is/,
  )
})

test('a sequence of one state fails the build, because one state is a screen', () => {
  expectProblem(
    sourceOf({ itemPools: pool(ITEM_ONE, { ...ITEM_TWO, sequence: [STATE_ONE] }) }),
    /sequence must list at least two states — one state is a screen/,
  )
})

test('an item carrying both a screen and a sequence fails the build', () => {
  const screen = { en: '<div class="screen"><p>Revenue</p></div>', ko: '<div class="screen"><p>매출</p></div>' }
  expectProblem(
    sourceOf({ itemPools: pool(ITEM_ONE, { ...ITEM_SEQUENCE, screen }) }),
    /an item draws either one screen or a sequence, never both/,
  )
})

test('a sequence makes the item-screen stylesheet required, as a drawn screen does', () => {
  // The baseline fixture draws nothing, so it needs no stylesheet. Adding a
  // sequence is what starts asking for one — the states would still render,
  // unstyled, and the Learner would be judging a layout nobody authored.
  expectProblem(
    sourceOf({ itemPools: pool(ITEM_ONE, ITEM_SEQUENCE) }),
    /items\/item-screen\.css is missing — items draw screens that nothing styles/,
  )
})

test('a Competency missing one of its two language variants fails the build', () => {
  expectProblem(
    sourceOf({ competencies: [competency({ ...COMPETENCY, name: { en: 'Visual hierarchy' } })] }),
    /competencies\/visual-hierarchy\.md: name is missing its ko language variant/,
  )
})

test('a Competency without an objective fails the build', () => {
  expectProblem(
    sourceOf({ competencies: [competency(without(COMPETENCY, 'objective'))] }),
    /competencies\/visual-hierarchy\.md: objective must carry en and ko variants/,
  )
})

test('a Competency without pre-reading questions fails the build', () => {
  expectProblem(
    sourceOf({ competencies: [competency(without(COMPETENCY, 'preReadingQuestions'))] }),
    /competencies\/visual-hierarchy\.md: preReadingQuestions must be a list of en\/ko question pairs/,
  )
})

test('a Competency whose source lacks attribution fails the build', () => {
  expectProblem(
    sourceOf({ competencies: [competency({ ...COMPETENCY, source: { url: COMPETENCY.source.url } })] }),
    /competencies\/visual-hierarchy\.md: source must carry the article url and its attribution/,
  )
})

test('a browser-translation notice written as an en/ko pair fails the build', () => {
  const asPair = { en: 'The article is in English.', ko: '원문은 영어입니다.' }
  expectProblem(
    sourceOf({ competencies: [competency({ ...COMPETENCY, koTranslationNotice: asPair })] }),
    /koTranslationNotice is Korean-only by design and must be a plain string/,
  )
})

test('an explanation that is neither empty nor an en/ko pair fails the build', () => {
  expectProblem(
    sourceOf({ competencies: [competency({ ...COMPETENCY, explanation: 'one language only' })] }),
    /explanation must be empty or an en\/ko pair/,
  )
})

test('a Glossary entry missing one of its two language variants fails the build', () => {
  expectProblem(
    sourceOf({ glossary: [doc('glossary/contrast.md', { ...GLOSSARY_CONTRAST, name: { en: 'Contrast' } })] }),
    /glossary\/contrast\.md: name is missing its ko language variant/,
  )
})

test('a Glossary entry whose slug disagrees with its filename is refused', () => {
  expectProblem(
    sourceOf({ glossary: [doc('glossary/contrast.md', { ...GLOSSARY_CONTRAST, slug: 'contrast-ratio' })] }),
    /glossary\/contrast\.md: slug "contrast-ratio" does not match the filename/,
  )
})

test('a document that could not be parsed is reported by the rules, not by the reading', () => {
  // The reader does not push problems: it hands the failure along on the record
  // and the rules say it out loud, in the same list as everything else wrong.
  const broken: SourceDoc = {
    rel: 'glossary/unparsed.md',
    name: 'unparsed.md',
    body: '',
    data: {},
    problem: 'glossary/unparsed.md: front matter is not valid YAML — deliberate',
  }
  expectProblem(
    sourceOf({ glossary: [doc('glossary/contrast.md', GLOSSARY_CONTRAST), broken] }),
    /not valid YAML — deliberate/,
  )
})

test('every problem is collected, never only the first', () => {
  // A Maintainer fixing content one refusal at a time is a Maintainer running
  // the build once per mistake.
  const problems = problemsFrom(
    sourceOf({
      glossary: [
        doc('glossary/contrast.md', GLOSSARY_CONTRAST),
        doc('glossary/a.md', { slug: 'wrong' }),
        doc('glossary/b.md', { slug: 'alsowrong' }),
      ],
    }),
  )
  expect(problems.filter((line) => line.includes('does not match the filename')).length).toBe(2)
})

test('a quiz item with no keyed correct answer fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: pool(itemWithOptions([without(CONFIRM_BUTTON, 'correct'), UPGRADE_BANNER], ITEM_ONE.options.ko)),
    }),
    /washed-out-confirm\.md: options\.en keys 0 correct answers where exactly one is required/,
  )
})

test('a quiz item option with no reason fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: pool(itemWithOptions([CONFIRM_BUTTON, without(UPGRADE_BANNER, 'reason')], ITEM_ONE.options.ko)),
    }),
    /washed-out-confirm\.md: an option in options\.en has no reason/,
  )
})

test('a quiz item whose keyed option sits at a different index per language fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: pool(
        itemWithOptions(ITEM_ONE.options.en, [
          without(CONFIRM_BUTTON_KO, 'correct'),
          { ...UPGRADE_BANNER_KO, correct: true },
        ]),
      ),
    }),
    /washed-out-confirm\.md: the correct option is #1 in en but #2 in ko/,
  )
})

test('a quiz item with two keyed correct answers in one language fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: pool(itemWithOptions(ITEM_ONE.options.en, [CONFIRM_BUTTON_KO, { ...UPGRADE_BANNER_KO, correct: true }])),
    }),
    /washed-out-confirm\.md: options\.ko keys 2 correct answers where exactly one is required/,
  )
})

test('a quiz item with nothing to examine fails the build', () => {
  expectProblem(sourceOf({ itemPools: pool(without(ITEM_ONE, 'artefact')) }), /washed-out-confirm\.md: missing artefact/)
})

test('an artefact written in one language only fails the build', () => {
  expectProblem(
    sourceOf({ itemPools: pool({ ...ITEM_ONE, artefact: { en: ITEM_ONE.artefact.en } }) }),
    /washed-out-confirm\.md: artefact is missing its ko language variant/,
  )
})

/**
 * The mistake is made the way it happens for real: the Korean is wrapped
 * between a word and the particle that belongs to it. In a folded scalar the
 * break becomes a space, so the source looks like ordinary wrapping and the
 * rendered sentence carries a typo. Only Korean can catch this — the English
 * sibling wraps in the same place and is fine.
 */

test('Korean wrapped between a word and its particle fails the build', () => {
  // The sentence a folded scalar hands the rules once the Korean has been
  // wrapped between a word and its particle: YAML turns the break into a
  // space, so the source looks like ordinary wrapping and the rendered
  // sentence carries a typo. Only Korean can catch this — the English sibling
  // wraps in the same place and is fine.
  const wrapped = '확정 버튼은 흐릿하고 업그레이드 배너는 선명한 주문 페이지 입니다.'
  expectProblem(
    sourceOf({ itemPools: pool({ ...ITEM_ONE, artefact: { en: ITEM_ONE.artefact.en, ko: wrapped } }) }),
    /washed-out-confirm\.md: artefact\.ko splits a particle from its word — "지 입니다"/,
  )
})

/**
 * The justification is said out loud, so a slot cannot be followed by a
 * particle that agrees with the word filling it. The English template above
 * the Korean one has the same slot and no such problem.
 */

test('a Glossary slot followed by a particle that agrees with its filler fails the build', () => {
  const justification = { en: GLOSSARY_CONTRAST.justification.en, ko: '[요소]는 주요 동작으로 읽히지 않습니다.' }
  expectProblem(
    sourceOf({ glossary: [doc('glossary/contrast.md', { ...GLOSSARY_CONTRAST, justification })] }),
    /contrast\.md: justification\.ko puts "는" straight after \[요소\]/,
  )
})

/** A slot that ends in a fixed noun settles the agreement itself, and loads. */

test('a Glossary slot ending in a fixed noun may carry a particle', () => {
  const justification = {
    en: GLOSSARY_CONTRAST.justification.en,
    ko: '[읽는 사람]이 먼저 보는 자리가 주요 동작으로 읽히지 않습니다.',
  }
  expect(() =>
    validateContent(sourceOf({ glossary: [doc('glossary/contrast.md', { ...GLOSSARY_CONTRAST, justification })] })),
  ).not.toThrow()
})

test('a slot followed by an agreeing particle fails the build wherever it is written', () => {
  // The rule is about the slot, not about the Glossary. It hung off
  // `justification.ko` alone until it moved onto the walker every pair goes
  // through, so a brief could carry the mistake a Glossary entry is refused
  // for — and the message named a field the sentence was not in.
  const whatCounts = { en: BRIEF.whatCounts.en, ko: '[요소]를 세 개 찾아 적으세요.' }
  expectProblem(
    sourceOf({ briefs: [doc('briefs/stage-1.md', { ...BRIEF, whatCounts })] }),
    /briefs\/stage-1\.md: whatCounts\.ko puts "를" straight after \[요소\]/,
  )
})

/** The bound nouns Korean does space are not particles, and must still load. */

test('Korean spacing a bound noun such as 뿐 or 만큼 loads', () => {
  const artefact = {
    en: ITEM_ONE.artefact.en,
    ko: '선명한 것은 배너뿐이고, 확정 버튼은 알아볼 수 없을 만큼 흐립니다.',
  }
  expect(() => validateContent(sourceOf({ itemPools: pool({ ...ITEM_ONE, artefact }) }))).not.toThrow()
})

test('a quiz item that asks nothing fails the build', () => {
  expectProblem(
    sourceOf({ itemPools: pool(without(ITEM_ONE, 'prompt')) }),
    /washed-out-confirm\.md: prompt must carry en and ko variants/,
  )
})

test('a quiz item with no article-section pointer fails the build', () => {
  expectProblem(
    sourceOf({ itemPools: pool(without(ITEM_ONE, 'sourceSection')) }),
    /washed-out-confirm\.md: missing sourceSection/,
  )
})

test('an item pool smaller than the number of items an attempt draws fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: [
        { competency: 'visual-hierarchy', docs: [doc('items/visual-hierarchy/washed-out-confirm.md', ITEM_ONE)] },
      ],
    }),
    /items\/visual-hierarchy: a pool of 1 is smaller than the 2 items an attempt draws/,
  )
})

test('an empty item pool directory fails the build like any undersized pool', () => {
  expectProblem(
    sourceOf({ itemPools: [{ competency: 'visual-hierarchy', docs: [] }] }),
    /items\/visual-hierarchy: a pool of 0 is smaller than the 2 items an attempt draws/,
  )
})

test('an item pool for a Competency not declared in config fails the build', () => {
  expectProblem(
    sourceOf({
      itemPools: [{ competency: 'form-burden', docs: [doc('items/form-burden/some-item.md', ITEM_TWO)] }, ...pool()],
    }),
    /items\/form-burden: item pool for a Competency declared under no Stage in config\.md/,
  )
})

test('a Competency file not declared in config fails the build', () => {
  expectProblem(
    sourceOf({
      competencies: [
        doc('competencies/form-burden.md', COMPETENCY, COMPETENCY_BODY),
        doc('competencies/visual-hierarchy.md', COMPETENCY, COMPETENCY_BODY),
      ],
    }),
    /competencies\/form-burden\.md: "form-burden" is not a Competency declared under any Stage in config\.md/,
  )
})

test('a Stage declared but wholly unauthored loads: no definitions, no pools', () => {
  // The state Stage 2 and Stage 3 are in the day this lands. Declaring a Stage
  // has to be possible before writing it, or no later-Stage content can enter
  // the repository even as a draft — the same tolerance an unauthored Stage 1
  // pool already had.
  const content = validateContent(sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES) }))
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
  // A fixture curriculum rather than the real content, so this keeps testing
  // the rule after Stage 3's pools are authored and no request can reach the
  // state any more — the move #77 forced on the subject rule, made in advance
  // here.
  const content = validateContent(sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES) }))

  expect(itemPoolOf(content, 'form-burden')).toBeNull()
  // Against an authored Competency in the same curriculum, so that null means
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
  // reason. A fixture curriculum is the one place it can still be built, and
  // this is what both surfaces branch on: `null`, rather than a throw, an
  // empty page, or a subject with no defects — each of those sends a surface
  // down a different path than the one that speaks.
  const content = validateContent(sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES) }))

  expect(practicePageOf(content, 2)).toBeNull()
  // Against an authored Stage in the same curriculum, so that null means
  // "nobody has written this yet" and not "this loader answers null".
  expect(practicePageOf(content, 1)).not.toBeNull()
})

test('a Stage declared out of order, or twice, fails the build', () => {
  expectProblem(
    sourceOf({
      config: doc('config.md', {
        ...CONFIG,
        stages: [...CONFIG.stages, { stage: 1, competencies: ['system-status', 'form-burden'] }],
      }),
    }),
    /stages must be declared in ascending Stage order, each Stage once/,
  )
})

test('one Competency declared under two Stages fails the build', () => {
  expectProblem(
    sourceOf({
      config: doc('config.md', {
        ...CONFIG,
        stages: [...CONFIG.stages, { stage: 2, competencies: ['readability', 'form-burden'] }],
      }),
    }),
    /stages repeat a Competency slug/,
  )
})

test('a config declaring no Stages at all fails the build', () => {
  expectProblem(
    sourceOf({ config: doc('config.md', without(CONFIG, 'stages')) }),
    /stages must declare each Stage and the Competency slugs it holds/,
  )
})

test('without config.md nothing else can be judged, so nothing else is reported', () => {
  // The quantities and the Stage lists are what every other rule is measured
  // against, so the rules stop at the first missing thing rather than burying
  // it under the cascade of everything that then looks wrong.
  const problems = problemsFrom(sourceOf({ config: null }))
  expect(problems.some((line) => line.includes('config.md is missing'))).toBe(true)
})

test('a quiz item citing a Principle absent from the Glossary fails the build', () => {
  expectProblem(
    sourceOf({ itemPools: pool({ ...ITEM_ONE, principles: ['affordance'] }) }),
    /washed-out-confirm\.md: cites UX Principle "affordance", absent from the Glossary/,
  )
})

test('a brief missing a paragraph a Learner reads fails the build', () => {
  // The generic pair walker cannot catch this one: it inspects the fields that
  // are there, so an absent field is invisible to it. Until #129 a brief
  // without a title passed the build and threw on the audit surface instead.
  expectProblem(
    sourceOf({ briefs: [doc('briefs/stage-1.md', without(BRIEF, 'title'))] }),
    /briefs\/stage-1\.md: title must carry en and ko variants/,
  )
})

test('a Peer Review paragraph written as one string, not a pair, fails the build', () => {
  // Stage 3's alone, so its absence is fine. Written as a bare string it is
  // invisible to the generic pair walker — that walker only descends into
  // records — and would have reached the surface as `undefined[lang]`.
  expectProblem(
    sourceOf({ briefs: [doc('briefs/stage-1.md', { ...BRIEF, peerReview: 'A colleague may read this.' })] }),
    /briefs\/stage-1\.md: peerReview must carry en and ko variants/,
  )
})

test('a Peer Review paragraph in one language only fails the build', () => {
  expectProblem(
    sourceOf({
      briefs: [doc('briefs/stage-1.md', { ...BRIEF, peerReview: { en: 'A colleague may read this.' } })],
    }),
    /briefs\/stage-1\.md: peerReview is missing its ko language variant/,
  )
})

test('a brief citing a Principle absent from the Glossary fails the build', () => {
  expectProblem(
    sourceOf({ briefs: [doc('briefs/stage-1.md', { ...BRIEF, principles: ['affordance'] })] }),
    /briefs\/stage-1\.md: cites UX Principle "affordance", absent from the Glossary/,
  )
})

test('a Planted Defect citing a Principle absent from the Glossary fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [subject({ manifest: manifestOf({ ...DEFECT, principle: 'affordance' }) })] }),
    /cites UX Principle "affordance", absent from the Glossary/,
  )
})

test('a Planted Defect naming an element that does not exist on the page fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [subject({ manifest: manifestOf({ ...DEFECT, element: 'upgrade-banner' }) })] }),
    /names element "upgrade-banner", which does not exist on the Practice Page/,
  )
})

test('a Planted Defect citing a Competency nobody has been taught fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [subject({ manifest: manifestOf({ ...DEFECT, competency: 'form-burden' }) })] }),
    /cites Competency "form-burden", which no Learner reaching Stage 1 has been taught/,
  )
})

test('a Planted Defect citing a declared but later Stage Competency still fails the build', () => {
  // Declared is not enough for this page. It is Stage 1's subject, so a defect
  // planted on it that only a Stage 2 Competency names is one the Learner
  // auditing it has not been taught to see.
  expectProblem(
    sourceOf({
      config: doc('config.md', CONFIG_TWO_STAGES),
      practicePages: [subject({ manifest: manifestOf({ ...DEFECT, competency: 'form-burden' }) })],
    }),
    /cites Competency "form-burden", which no Learner reaching Stage 1 has been taught/,
  )
})

test("an audit subject may plant a defect from an earlier Stage's Competencies", () => {
  // The reverse of the rule above, and it must stay allowed: a Stage 2 page
  // whose layout is also badly ordered is what real work looks like, and the
  // Learner reaching it was taught to see that in Stage 1.
  const stageTwo = subject({ name: 'stage-2', manifest: doc('practice-page/stage-2/manifest.md', MANIFEST) })
  const content = validateContent(
    sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES), practicePages: [subject(), stageTwo] }),
  )
  expect(practicePageOf(content, 2)?.defects[0].competency).toBe('visual-hierarchy')
})

test('a Stage that has begun a subject owes all three of its parts', () => {
  const begun: SourcePracticePage = {
    name: 'stage-2',
    html: { en: PRACTICE_EN, ko: null },
    css: null,
    js: null,
    manifest: null,
  }
  const source = sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES), practicePages: [subject(), begun] })
  expectProblem(source, /practice-page\/stage-2\/ko\.html is missing/)
  expectProblem(source, /practice-page\/stage-2\/practice-page\.css is missing/)
  expectProblem(source, /practice-page\/stage-2\/manifest\.md is missing/)
})

test('an audit subject for a Stage the curriculum does not declare fails the build', () => {
  // Content nobody can ever reach. Silently ignoring it is how an authored
  // page sits unnoticed for a release.
  const undeclared: SourcePracticePage = {
    name: 'stage-3',
    html: { en: PRACTICE_EN, ko: null },
    css: null,
    js: null,
    manifest: null,
  }
  expectProblem(
    sourceOf({ practicePages: [subject(), undeclared] }),
    /Stage 3 is not declared in config\.md, so no Learner can reach this/,
  )
})

test('a Stage with no subject directory is not a failure — it simply has none yet', () => {
  const content = validateContent(sourceOf({ config: doc('config.md', CONFIG_TWO_STAGES) }))
  expect(practicePageOf(content, 1)).not.toBeNull()
  expect(practicePageOf(content, 2)).toBeNull()
})

test('language variants with different element identifiers fail the build', () => {
  const enOnly = { en: PRACTICE_EN + '<div data-element="only-in-en"></div>\n', ko: PRACTICE_KO }
  expectProblem(
    sourceOf({ practicePages: [subject({ html: enOnly })] }),
    /do not expose an identical set of element identifiers — only in en: only-in-en/,
  )
})

test('a repeated element identifier fails the build', () => {
  const repeated = '<p data-element="page-title">again</p>\n'
  expectProblem(
    sourceOf({ practicePages: [subject({ html: { en: PRACTICE_EN + repeated, ko: PRACTICE_KO + repeated } })] }),
    /element identifier "page-title" appears more than once/,
  )
})

test('a walkable subject loads, carrying its steps and the behaviour both variants share', () => {
  const page = practicePageOf(validateContent(sourceOf({ practicePages: [walkableSubject()] })), 1)!
  expect(page.steps).toEqual([1, 2])
  expect(page.js).toBe('void 0\n')
  expect(page.defects[0].step).toBe(2)
})

test('a subject that walks but has no behaviour fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [walkableSubject({ js: null })] }),
    /practice-page\.js is missing — a subject that walks needs the behaviour both variants share/,
  )
})

test('language variants that walk different steps fail the build', () => {
  // The identifier check cannot see this: both variants can expose the same
  // elements while one of them reaches an element a step later.
  const koWalksThree = WALKABLE_KO.replace('data-step="2"', 'data-step="3"')
  expectProblem(
    sourceOf({ practicePages: [walkableSubject({ html: { en: WALKABLE_EN, ko: koWalksThree } })] }),
    /walk different steps — en: 1, 2, ko: 1, 3/,
  )
})

test('a Planted Defect on a walkable subject that names no step fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [walkableSubject({ manifest: manifestOf(DEFECT) })] }),
    /must name the step it occurs in, one of 1, 2/,
  )
})

test('a Planted Defect naming a step the subject does not walk fails the build', () => {
  expectProblem(
    sourceOf({ practicePages: [walkableSubject({ manifest: manifestOf({ ...DEFECT, step: 9 }) })] }),
    /must name the step it occurs in, one of 1, 2/,
  )
})

test('a Planted Defect on a subject that walks nowhere may not name a step', () => {
  // The reverse drift: a step recorded against a single page would send a
  // Learner back to a moment the subject does not have.
  expectProblem(
    sourceOf({ practicePages: [subject({ manifest: manifestOf({ ...DEFECT, step: 2 }) })] }),
    /names a step, but this subject is one page and walks nowhere/,
  )
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
  expectProblem(
    sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, element: 'shipping-form' }) }),
    /names element "shipping-form", which does not exist/,
  )
})

test('a specimen Finding citing a Principle absent from the Glossary fails the build', () => {
  // Wrongness is the point of this artefact, and this is the line between the
  // two kinds. A Learner selects the Principle from the Glossary, so a name
  // that is not in it is not a Learner's mistake we authored — it is ours.
  expectProblem(
    sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, principle: 'proximity' }) }),
    /cites UX Principle "proximity", absent from the Glossary/,
  )
})

test('two specimen Findings on one element fail the build', () => {
  expectProblem(
    sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, element: 'confirm-selected-orders' }) }),
    /two Findings on element "confirm-selected-orders"/,
  )
})

test('a specimen Finding whose quality is not one of the four authored shapes fails the build', () => {
  // The quality labels are what prove the mix ADR-0011 asks for is present. A
  // typo here would quietly drop one shape out of the count.
  expectProblem(sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, quality: 'preference' }) }), /quality "preference"/)
})

test('a specimen Finding missing its Korean fails the build', () => {
  expectProblem(
    sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, fix: { en: FINDING_TASTE.fix.en } }) }),
    /findings\[1\]\.fix is missing its ko language variant/,
  )
})

test('a specimen Finding missing its English fails the build', () => {
  // The other direction, because a suite that only ever deletes the Korean
  // proves the check runs and not that it runs both ways — and the cohort
  // reading English is the one nobody here would notice was missing.
  expectProblem(
    sourceOf({ specimen: specimenOf({ ...FINDING_TASTE, fix: { ko: FINDING_TASTE.fix.ko } }) }),
    /findings\[1\]\.fix is missing its en language variant/,
  )
})

test('a specimen carrying fewer Findings than a complete report requires fails the build', () => {
  // The minimum is config.md's, not a number typed here: a specimen thinner
  // than a submission the platform would accept is not the artefact a Learner
  // is being asked to judge.
  expectProblem(
    sourceOf({ config: doc('config.md', { ...CONFIG, minFindings: 3 }) }),
    /carries 2 Findings, fewer than the 3 a complete report requires/,
  )
})

test('a specimen carrying no Findings at all fails the build', () => {
  // The length a "too thin" rule is likeliest to be written around rather than
  // for: an empty list is a report of nothing, and it has to fail the same
  // check a short one does rather than fall through it.
  expectProblem(
    sourceOf({ specimen: doc('specimen-report.md', { ...SPECIMEN, findings: [] }) }),
    /carries 0 Findings, fewer than the 1 a complete report requires/,
  )
})

test('a specimen reviewing a Stage with no authored subject fails the build', () => {
  // Without the page, no Finding's element can be checked against anything —
  // the specimen would load with every rule above unenforced.
  expectProblem(
    sourceOf({
      config: doc('config.md', CONFIG_TWO_STAGES),
      specimen: doc('specimen-report.md', { ...SPECIMEN, subject: 2 }),
    }),
    /reviews Stage 2, which has no authored subject/,
  )
})

test('a specimen naming a Competency the curriculum does not declare fails the build', () => {
  // The only route to this artefact is a link on one Competency's page. A slug
  // that names nothing would take that link away with nothing to notice it —
  // the build would pass and the report would simply be unreachable.
  expectProblem(
    sourceOf({ specimen: doc('specimen-report.md', { ...SPECIMEN, competency: 'heuristic-evaluation' }) }),
    /names Competency "heuristic-evaluation", which config.md does not declare/,
  )
})

test('a specimen reviewing a Stage the curriculum does not declare fails the build', () => {
  expectProblem(
    sourceOf({ specimen: doc('specimen-report.md', { ...SPECIMEN, subject: 4 }) }),
    /reviews Stage 4, which config.md does not declare/,
  )
})

test('no specimen at all is not a failure — it simply has none yet', () => {
  // The same tolerance an unauthored item pool and an unauthored subject
  // already have. What must never be silent is a surface meeting that state,
  // and `specimenAsServed` hands back null for it rather than an empty report.
  const content = validateContent(sourceOf({ specimen: null }))
  expect(content.specimen).toBeNull()
  expect(specimenAsServed(content)).toBeNull()
})

test('the specimen as served carries no quality label', () => {
  // The reader judges the report; the Stage 1 manifest they were already shown
  // is what settles it. Serving the labels would answer the exercise, so the
  // projection drops them rather than a surface remembering not to render one.
  const served = specimenAsServed(validateContent(sourceOf()))!
  expect(JSON.stringify(served)).not.toContain('quality')
  expect(JSON.stringify(served)).not.toContain('sound')
  expect(served.findings.map((finding) => finding.element)).toEqual(['confirm-selected-orders', 'page-title'])
  expect(served.findings[0].fix.ko).toBe('페이지에서 가장 강한 대비를 이 버튼에 주세요.')
})

/**
 * The two tests below keep a filesystem, because reading is what they are
 * about — every rule above is asked directly, over records (#132).
 */

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
  // A whole content directory, because the refusal has to survive the reading:
  // this is the one test where a record handed straight to the rules would
  // prove nothing. The mistake is the smallest one a real directory can carry
  // — a config.md that parses and then breaks a rule.
  const root = mkdtempSync(join(tmpdir(), 'ux-study-content-'))
  roots.push(root)
  writeFileSync(
    join(root, 'config.md'),
    '---\npoolSize: 0\ndrawSize: 2\npassThreshold: 2\nminFindings: 1\nstages:\n' +
      '  - stage: 1\n    competencies:\n      - visual-hierarchy\n---\n',
  )

  // next.config.ts validates content at module load, which is exactly what
  // `next build` and `next start` evaluate — so this import is the build path.
  process.env.CONTENT_DIR = root
  vi.resetModules()
  await expect(import('../next.config')).rejects.toThrow(/Content validation failed/)
})
