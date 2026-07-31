import { join } from 'node:path'

import { expect, test } from 'vitest'

import { competenciesOfStage, loadContent, practicePageOf } from '../lib/content'

/**
 * Authoring rules for the audit subjects — what the spec demands of the real
 * content beyond structural validity. The structural checks that lived here
 * before #10 (identical element sets, defect targets, Glossary citations,
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

/**
 * Stage 2's subject is walked rather than read (ADR-0010, #70). Its authoring
 * rules are the ones the loader cannot state: that the flow is three steps and
 * never branches, that the audit tools are not part of the artefact, and that
 * both language variants are driven by the same hooks — the loader compares
 * the identifiers a Finding may name, not the ones the behaviour reaches for.
 */

test('Stage 2 has an authored audit subject, and it walks', () => {
  expect(practicePageOf(content, 2)).not.toBeNull()
  expect(practicePageOf(content, 2)!.steps).toEqual([1, 2, 3])
  expect(practicePageOf(content, 2)!.js).not.toBe('')
})

const flow = practicePageOf(content, 2)!

test('seven defects are planted, unevenly, with every Stage 2 Competency represented', () => {
  expect(flow.defects).toHaveLength(7)

  const perCompetency = competenciesOfStage(config, 2).map(
    (competency: string) => flow.defects.filter((defect) => defect.competency === competency).length,
  )
  expect(Math.min(...perCompetency)).toBeGreaterThanOrEqual(1)
  // A spread of at least two, not merely "the counts are not all equal". A
  // split like 2-2-2-1 satisfies the weaker rule while still being near enough
  // to uniform that knowing the total tells a Learner roughly where to look —
  // which is the hint the uneven spread exists to withhold. Stage 1's 3-1-1-1
  // clears this bar as well.
  expect(Math.max(...perCompetency) - Math.min(...perCompetency)).toBeGreaterThanOrEqual(2)
})

test('every planted defect names the step it occurs in, and they are spread over the flow', () => {
  for (const defect of flow.defects) {
    expect(flow.steps).toContain(defect.step)
  }
  // A Stage whose defects all sat on one step would be a Stage 1 page with two
  // spare screens attached, and would never make a Learner walk.
  expect(new Set(flow.defects.map((defect) => defect.step))).toEqual(new Set(flow.steps))
})

test('nothing in the flow marks an element as defective', () => {
  // The behaviour is read with its comments removed, because that is how it is
  // served: an authoring note is documentation for a maintainer and would be a
  // hint for a Learner, so the serving strips it, as it already does for the
  // stylesheet. What must carry no marker is the code that reaches the browser.
  const code = flow.js.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const page of [flow.html.en, flow.html.ko, code]) {
    expect(page).not.toMatch(/defect|planted|결함/i)
    for (const defect of flow.defects) {
      expect(page).not.toContain(defect.slug)
    }
  }
})

/** Every attribute and id the shared behaviour reaches for, in one variant. */
function hooks(markup: string): string[] {
  const attributes = ['id', 'data-step', 'data-step-label', 'data-fill', 'data-answer', 'data-next', 'data-reset', 'data-cancel', 'data-mode']
  return attributes
    .flatMap((attribute) => {
      const pattern = new RegExp(`${attribute}="([^"]*)"`, 'g')
      // The label is the one hook whose value is authored per language; that it
      // is present on the same nodes is what matters, not what it says.
      const values = [...markup.matchAll(pattern)].map((match) => (attribute === 'data-step-label' ? '' : match[1]))
      return values.map((value) => `${attribute}=${value}`)
    })
    .sort()
}

test('both language variants are driven by the same hooks, so one behaviour fits both', () => {
  expect(hooks(flow.html.ko)).toEqual(hooks(flow.html.en))
})

test('the behaviour is one shared file, not a copy inside each variant', () => {
  // Two inline scripts would be two flows, and the second would drift the first
  // time one language gained a step the other did not.
  for (const page of [flow.html.en, flow.html.ko]) {
    expect(page).toContain('<script src="./practice-page.js"></script>')
    expect(page.match(/<script/g)).toHaveLength(1)
  }
})

test('every control that moves the flow leads to a step the flow declares', () => {
  // A control pointing at a step that does not exist is a dead button, which
  // the walk would only notice as a missing identifier several stops later.
  // The no-branch rule itself is not this test's to keep — a branch lives in
  // the behaviour, where markup cannot see it, and walk.test.ts is what looks.
  for (const page of [flow.html.en, flow.html.ko]) {
    for (const attribute of ['data-next', 'data-reset']) {
      const targets = [...page.matchAll(new RegExp(`${attribute}="([^"]*)"`, 'g'))].map((match) => Number(match[1]))
      expect(targets.length).toBeGreaterThan(0)
      for (const target of targets) expect(flow.steps).toContain(target)
    }
  }
})

test('the audit tools are not part of the artefact a Learner reports on', () => {
  // ADR-0010 puts the mode control and Restart on the subject. A Learner must
  // never be able to file a Finding against our own chrome, and the only thing
  // a Finding can name is a data-element — so the chrome carries none.
  for (const page of [flow.html.en, flow.html.ko]) {
    const chrome = page.slice(page.indexOf('data-audit-chrome'), page.indexOf('</div>', page.indexOf('data-audit-chrome')))
    expect(chrome).toContain('data-mode="operate"')
    expect(chrome).toContain('data-mode="select"')
    expect(chrome).not.toContain('data-element')
  }
})
