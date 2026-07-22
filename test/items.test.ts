import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'

/**
 * Stage 1 authoring rules for the Item Pools (#16) — what the spec demands of
 * the real content beyond the structural validity the loader enforces. Same
 * pattern as competencies.test.ts: these read the loaded content directly,
 * because the rules are about the authored files rather than about anything a
 * Learner can observe over HTTP yet.
 *
 * The per-item rules run over every pool that exists, so the three pools
 * authored after Visual hierarchy inherit them without a change here. The one
 * rule an authoring ticket cannot be automated out of — that no item is
 * answerable without examining its artefact — is a reading, not an assertion.
 */

const { config, glossary, items } = loadContent(join(__dirname, '..', 'content'))
const principles = glossary.map((entry) => entry.slug)
const pools = Object.entries(items)
const authored = pools.flatMap(([competency, pool]) =>
  pool.map((item) => [`${competency}/${item.slug}`, item] as const),
)

test('the Visual hierarchy pool is authored, and holds a full pool of items', () => {
  expect(Object.keys(items)).toContain('visual-hierarchy')
  expect(items['visual-hierarchy']).toHaveLength(config.poolSize)
})

test('every authored pool holds a full pool of items', () => {
  for (const [competency, pool] of pools) {
    expect(pool.length, competency).toBe(config.poolSize)
  }
})

test('each item keys exactly one correct answer in each language', () => {
  for (const [name, item] of authored) {
    for (const lang of ['en', 'ko'] as const) {
      const keyed = item.options[lang].filter((option) => option.correct)
      expect(keyed.length, `${name} (${lang})`).toBe(1)
    }
  }
})

test('the two language variants of an item offer the same number of options', () => {
  for (const [name, item] of authored) {
    expect(item.options.ko.length, name).toBe(item.options.en.length)
  }
})

test('each item names the section of the source article it derives from', () => {
  for (const [name, item] of authored) {
    expect(item.sourceSection.trim(), name).not.toBe('')
  }
})

test('every UX Principle an item cites resolves to the Glossary', () => {
  for (const [name, item] of authored) {
    expect(item.principles.length, name).toBeGreaterThan(0)
    for (const slug of item.principles) {
      expect(principles, `${name} cites ${slug}`).toContain(slug)
    }
  }
})
