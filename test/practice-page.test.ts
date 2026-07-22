import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { parse } from 'yaml'
import { expect, test } from 'vitest'

/**
 * The build-failing content checks the spec demands for the Practice Page
 * (stories 65, 66, 68), applied straight to the files. When the content loader
 * (#10) arrives these belong to it; until then this file is the enforcement.
 */

const DIR = join(__dirname, '..', 'content', 'practice-page')
const GLOSSARY_DIR = join(__dirname, '..', 'content', 'glossary')
const STAGE_1_COMPETENCIES = ['visual-hierarchy', 'readability', 'consistency', 'perceived-clickability']

const en = readFileSync(join(DIR, 'en.html'), 'utf8')
const ko = readFileSync(join(DIR, 'ko.html'), 'utf8')

const frontmatter = (text: string) => parse(text.replace(/^---\n/, '').replace(/\n---\s*$/, ''))
const manifest = frontmatter(readFileSync(join(DIR, 'manifest.md'), 'utf8'))
const defects: { slug: string; element: string; competency: string; principle: string; explanation: { en?: string; ko?: string } }[] =
  manifest.defects

const elements = (html: string) => [...html.matchAll(/data-element="([^"]+)"/g)].map((m) => m[1])

test('the two language variants expose an identical set of element identifiers', () => {
  const enElements = elements(en)
  const koElements = elements(ko)

  // Identical as *sets* and free of duplicates — a repeated identifier would
  // make a Finding ambiguous about which element it names.
  expect(new Set(enElements).size).toBe(enElements.length)
  expect(koElements.sort()).toEqual(enElements.sort())
})

test('six defects are planted, unevenly, with every Stage 1 Competency represented', () => {
  expect(defects).toHaveLength(6)

  const perCompetency = STAGE_1_COMPETENCIES.map(
    (competency) => defects.filter((defect) => defect.competency === competency).length,
  )
  expect(perCompetency.reduce((a, b) => a + b, 0)).toBe(6)
  // One or more per Competency (ADR-0007), but not evenly spread — an even
  // split would let a Learner reason about the distribution instead of looking.
  expect(Math.min(...perCompetency)).toBeGreaterThanOrEqual(1)
  expect(new Set(perCompetency).size).toBeGreaterThan(1)
})

test('every defect names an element that exists on the page', () => {
  const known = new Set(elements(en))
  for (const defect of defects) {
    expect(known, `defect "${defect.slug}" points at a missing element`).toContain(defect.element)
  }
})

test('every defect cites a Principle that exists in the Glossary in both languages', () => {
  const glossary = new Map(
    readdirSync(GLOSSARY_DIR)
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const entry = frontmatter(readFileSync(join(GLOSSARY_DIR, file), 'utf8'))
        return [entry.slug, entry] as const
      }),
  )
  for (const defect of defects) {
    const principle = glossary.get(defect.principle)
    expect(principle, `defect "${defect.slug}" cites a Principle absent from the Glossary`).toBeDefined()
    expect(principle.name.en).toBeTruthy()
    expect(principle.name.ko).toBeTruthy()
  }
})

test('every defect carries an explanation in both languages', () => {
  for (const defect of defects) {
    expect(defect.explanation.en, `defect "${defect.slug}" has no English explanation`).toBeTruthy()
    expect(defect.explanation.ko, `defect "${defect.slug}" has no Korean explanation`).toBeTruthy()
  }
})

test('nothing in the page markup marks an element as defective', () => {
  for (const html of [en, ko]) {
    expect(html).not.toMatch(/defect|planted|결함/i)
    for (const defect of defects) {
      expect(html).not.toContain(defect.slug)
    }
  }
})
