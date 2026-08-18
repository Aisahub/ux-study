import { expect, test } from 'vitest'

import { ContentError, validateContent, type ContentSource, type SourceDoc } from '../lib/content'

/**
 * Rules asked directly, over records nobody wrote to a disk (#132).
 *
 * `content.test.ts` reaches every rule the way a Maintainer meets it — a
 * directory of authored markdown, loaded whole — and that is the right shape
 * for most of what it checks. This file is the other half the seam makes
 * possible: a fixture is an object, so a test for one rule costs one object.
 * No temp directory, no eleven files, and no string surgery on YAML.
 */

const CONFIG: SourceDoc = {
  rel: 'config.md',
  name: 'config.md',
  body: '',
  data: {
    poolSize: 2,
    drawSize: 2,
    passThreshold: 1,
    minFindings: 1,
    stages: [{ stage: 1, competencies: ['contrast-and-weight'] }],
  },
}

function sourceOf(overrides: Partial<ContentSource> = {}): ContentSource {
  return {
    config: CONFIG,
    glossary: [],
    competencies: [],
    itemPools: [],
    itemScreenCss: null,
    briefs: [],
    practicePages: [],
    specimen: null,
    ...overrides,
  }
}

function problemsFrom(source: ContentSource): string[] {
  try {
    validateContent(source)
    return []
  } catch (error) {
    expect(error).toBeInstanceOf(ContentError)
    return (error as ContentError).message.split('\n').map((line) => line.trim())
  }
}

test('a declared but wholly unauthored curriculum is valid — authoring is what fills it', () => {
  const content = validateContent(sourceOf())
  expect(content.config.stages).toEqual([{ stage: 1, competencies: ['contrast-and-weight'] }])
  expect(content.competencies).toEqual([])
  expect(content.practicePages).toEqual([])
})

test('without config.md nothing else can be judged, so nothing else is reported', () => {
  const problems = problemsFrom(sourceOf({ config: null }))
  expect(problems.some((line) => line.includes('config.md is missing'))).toBe(true)
})

test('a Glossary entry whose slug disagrees with its filename is refused', () => {
  const problems = problemsFrom(
    sourceOf({
      glossary: [
        {
          rel: 'glossary/contrast.md',
          name: 'contrast.md',
          body: '',
          data: {
            slug: 'contrast-ratio',
            name: { en: 'Contrast', ko: '대비' },
            definition: { en: 'Difference in luminance.', ko: '밝기 차이입니다.' },
            justification: { en: 'This fails contrast.', ko: '대비가 부족합니다.' },
          },
        },
      ],
    }),
  )
  expect(problems.some((line) => line.includes('does not match the filename'))).toBe(true)
})

test('a document that could not be parsed is reported by the rules, not by the reading', () => {
  // The reader does not push problems: it hands the failure along on the record
  // and the rules say it out loud, in the same list as everything else wrong.
  const broken: SourceDoc = {
    rel: 'glossary/contrast.md',
    name: 'contrast.md',
    body: '',
    data: {},
    problem: 'glossary/contrast.md: front matter is not valid YAML — deliberate',
  }
  const problems = problemsFrom(sourceOf({ glossary: [broken] }))
  expect(problems.some((line) => line.includes('not valid YAML — deliberate'))).toBe(true)
})

test('every problem is collected, never only the first', () => {
  const problems = problemsFrom(
    sourceOf({
      glossary: [
        { rel: 'glossary/a.md', name: 'a.md', body: '', data: { slug: 'wrong' } },
        { rel: 'glossary/b.md', name: 'b.md', body: '', data: { slug: 'alsowrong' } },
      ],
    }),
  )
  expect(problems.filter((line) => line.includes('does not match the filename')).length).toBe(2)
})
