import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { afterEach, expect, test, vi } from 'vitest'

import { ContentError, loadContent } from '../lib/content'

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
stage1Competencies:
  - visual-hierarchy
  - readability
  - consistency
  - perceived-clickability
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
---

Where a first-time visitor's eye lands, and whether that matches importance.
`

const ITEM_ONE = `---
sourceSection: Contrast
principles:
  - contrast
prompt:
  en: Which element should carry the strongest contrast?
  ko: 어느 요소가 가장 강한 대비를 가져야 하나요?
options:
  en:
    - text: The confirm button
      correct: true
    - text: The upgrade banner
  ko:
    - text: 확정 버튼
      correct: true
    - text: 업그레이드 배너
---
`

const ITEM_TWO = `---
sourceSection: Size
prompt:
  en: Which number deserves the largest type?
  ko: 어느 숫자가 가장 큰 글자 크기를 받아야 하나요?
options:
  en:
    - text: The monthly revenue
      correct: true
    - text: The refresh time
  ko:
    - text: 월 매출
      correct: true
    - text: 갱신 시각
---
`

const BRIEF = `---
stage: 1
principles:
  - contrast
brief:
  en: Find at least one defect and name the Principle it violates.
  ko: 결함을 하나 이상 찾고, 어긴 원칙의 이름을 대세요.
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

function scaffold(): string {
  const root = mkdtempSync(join(tmpdir(), 'ux-study-content-'))
  roots.push(root)
  write(root, 'config.md', CONFIG)
  write(root, 'glossary/contrast.md', GLOSSARY_CONTRAST)
  write(root, 'competencies/visual-hierarchy.md', COMPETENCY)
  write(root, 'items/visual-hierarchy/washed-out-confirm.md', ITEM_ONE)
  write(root, 'items/visual-hierarchy/refresh-time-size.md', ITEM_TWO)
  write(root, 'briefs/stage-1.md', BRIEF)
  write(root, 'practice-page/en.html', PRACTICE_EN)
  write(root, 'practice-page/ko.html', PRACTICE_KO)
  write(root, 'practice-page/practice-page.css', 'main { padding: 1rem; }\n')
  write(root, 'practice-page/manifest.md', MANIFEST)
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
  expect(content.practicePage.elements.sort()).toEqual(['confirm-selected-orders', 'page-title'])
  expect(content.practicePage.defects).toHaveLength(1)
})

test('a Competency missing one of its two language variants fails the build', () => {
  const root = scaffold()
  write(root, 'competencies/visual-hierarchy.md', edit(COMPETENCY, '\n  ko: 시각적 위계', ''))
  expectProblem(root, /competencies\/visual-hierarchy\.md: name is missing its ko language variant/)
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
    edit(ITEM_ONE, '    - text: The confirm button\n      correct: true', '    - text: The confirm button'),
  )
  expectProblem(root, /washed-out-confirm\.md: options\.en keys 0 correct answers where exactly one is required/)
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
  expectProblem(root, /items\/form-burden: item pool for a Competency not declared in config\.md/)
})

test('a Competency file not declared in config fails the build', () => {
  const root = scaffold()
  write(root, 'competencies/form-burden.md', COMPETENCY)
  expectProblem(root, /competencies\/form-burden\.md: "form-burden" is not a Competency declared in config\.md/)
})

test('a quiz item citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'items/visual-hierarchy/washed-out-confirm.md', edit(ITEM_ONE, '  - contrast', '  - affordance'))
  expectProblem(root, /washed-out-confirm\.md: cites UX Principle "affordance", absent from the Glossary/)
})

test('a brief citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'briefs/stage-1.md', edit(BRIEF, '  - contrast', '  - affordance'))
  expectProblem(root, /briefs\/stage-1\.md: cites UX Principle "affordance", absent from the Glossary/)
})

test('a Planted Defect citing a Principle absent from the Glossary fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/manifest.md', edit(MANIFEST, 'principle: contrast', 'principle: affordance'))
  expectProblem(root, /cites UX Principle "affordance", absent from the Glossary/)
})

test('a Planted Defect naming an element that does not exist on the page fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/manifest.md', edit(MANIFEST, 'element: confirm-selected-orders', 'element: upgrade-banner'))
  expectProblem(root, /names element "upgrade-banner", which does not exist on the Practice Page/)
})

test('a Planted Defect outside the four Stage 1 Competencies fails the build', () => {
  const root = scaffold()
  write(root, 'practice-page/manifest.md', edit(MANIFEST, 'competency: visual-hierarchy', 'competency: form-burden'))
  expectProblem(root, /cites Competency "form-burden", outside the Stage 1 Competencies/)
})

test('language variants with different element identifiers fail the build', () => {
  const root = scaffold()
  write(root, 'practice-page/en.html', PRACTICE_EN + '<div data-element="only-in-en"></div>\n')
  expectProblem(root, /do not expose an identical set of element identifiers — only in en: only-in-en/)
})

test('a repeated element identifier fails the build', () => {
  const root = scaffold()
  const repeated = '<p data-element="page-title">again</p>\n'
  write(root, 'practice-page/en.html', PRACTICE_EN + repeated)
  write(root, 'practice-page/ko.html', PRACTICE_KO + repeated)
  expectProblem(root, /element identifier "page-title" appears more than once/)
})

test('the repository content loads, with the eleven Glossary entries unchanged', () => {
  const content = loadContent(join(__dirname, '..', 'content'))

  expect(content.config).toEqual({
    poolSize: 8,
    drawSize: 5,
    passThreshold: 4,
    minFindings: 3,
    stage1Competencies: ['visual-hierarchy', 'readability', 'consistency', 'perceived-clickability'],
  })
  expect(content.glossary.map((entry) => entry.slug)).toEqual([
    'cognitive-load',
    'common-region',
    'consistency',
    'contrast',
    'disabled-state',
    'legibility',
    'proximity',
    'readability',
    'scale',
    'signifier',
    'visual-hierarchy',
  ])
  const contrast = content.glossary.find((entry) => entry.slug === 'contrast')
  expect(contrast?.name).toEqual({ en: 'Contrast', ko: '대비' })
  expect(content.practicePage.defects).toHaveLength(6)
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
