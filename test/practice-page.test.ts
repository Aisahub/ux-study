import { join } from 'node:path'

import { expect, test } from 'vitest'

import { competenciesOfStage, loadContent, practicePageOf } from '../lib/content'

/**
 * Stage 1 authoring rules for the Practice Page — what the spec demands of the
 * real content beyond structural validity. The structural checks that lived
 * here before #10 (identical element sets, defect targets, Glossary citations,
 * bilingual explanations) moved into the content loader, where they fail the
 * build and are each proved by a failing fixture in content.test.ts.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { config } = content

test('Stage 1 has an authored audit subject', () => {
  // Named rather than inferred. A Stage owes a subject once its directory
  // exists (#61), so deleting Stage 1's would take every assertion below with
  // it and leave a green suite behind. This is the one that would go red.
  expect(practicePageOf(content, 1)).not.toBeNull()
})

const practicePage = practicePageOf(content, 1)!
const { defects, html } = practicePage

test('six defects are planted, unevenly, with every Stage 1 Competency represented', () => {
  expect(defects).toHaveLength(6)

  const perCompetency = competenciesOfStage(config, 1).map(
    (competency: string) => defects.filter((defect) => defect.competency === competency).length,
  )
  // One or more per Competency (ADR-0007), but not evenly spread — an even
  // split would let a Learner reason about the distribution instead of looking.
  expect(Math.min(...perCompetency)).toBeGreaterThanOrEqual(1)
  expect(new Set(perCompetency).size).toBeGreaterThan(1)
})

test('nothing in the page markup marks an element as defective', () => {
  for (const page of [html.en, html.ko]) {
    expect(page).not.toMatch(/defect|planted|결함/i)
    for (const defect of defects) {
      expect(page).not.toContain(defect.slug)
    }
  }
})
