import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'

/**
 * Stage 1 authoring rules for the Competency definitions (#14) — what the spec
 * demands of the real content beyond the structural validity the loader
 * enforces. Same pattern as practice-page.test.ts: these read the loaded
 * content directly, because the rules are about the authored files, not about
 * anything a visitor can observe over HTTP yet.
 */

const { config, competencies } = loadContent(join(__dirname, '..', 'content'))

test('all four Stage 1 Competencies are authored', () => {
  expect(competencies.map((competency) => competency.slug).sort()).toEqual(
    [...config.stage1Competencies].sort(),
  )
})

test('each Competency carries two or three pre-reading questions', () => {
  for (const competency of competencies) {
    expect(competency.preReadingQuestions.length, competency.slug).toBeGreaterThanOrEqual(2)
    expect(competency.preReadingQuestions.length, competency.slug).toBeLessThanOrEqual(3)
  }
})

test('each Competency cites its source article on nngroup.com with attribution', () => {
  for (const competency of competencies) {
    expect(competency.source.url, competency.slug).toMatch(/^https:\/\/www\.nngroup\.com\/articles\//)
    expect(competency.source.attribution, competency.slug).toContain('Nielsen Norman Group')
  }
})

test('the browser-translation notice is Korean-only: present, and not an en/ko pair', () => {
  for (const competency of competencies) {
    expect(competency.koTranslationNotice, competency.slug).toBeTruthy()
    // A single Korean string by design — an English counterpart would
    // contradict user story 24 in the spec (#1): an English-speaking Learner
    // is never told to translate anything.
    const noticeKeys = Object.keys(competency.frontmatter).filter((key) => /notice/i.test(key))
    expect(noticeKeys, competency.slug).toEqual(['koTranslationNotice'])
  }
})

test('every explanation field is present, and at most one is filled (the #29 trial)', () => {
  for (const competency of competencies) {
    expect(competency.frontmatter, competency.slug).toHaveProperty('explanation')
  }
  const filled = competencies.filter((competency) => competency.explanation !== null)
  expect(filled.length).toBeLessThanOrEqual(1)
})
