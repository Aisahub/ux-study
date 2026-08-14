import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, practicePageOf, SPECIMEN_QUALITIES, specimenAsServed } from '../lib/content'

/**
 * Authoring rules for the specimen Self-Audit Report (ADR-0011, artefact B) —
 * what the spec demands of the real artefact beyond structural validity. The
 * structural checks (element exists, Principle is a Glossary slug, one element
 * one Finding, both languages present) live in the content loader, where they
 * fail the build, and each is proved by a failing fixture in content.test.ts.
 *
 * What is left here is the thing that makes this artefact worth having: that
 * it is of mixed quality, that the mix is not weighted toward any one shape,
 * and that nothing served hands the reader the answer.
 */

const content = loadContent(join(__dirname, '..', 'content'))

test('the specimen is authored', () => {
  // Named rather than inferred. A missing specimen is tolerated by the loader
  // — it is an artefact nobody has written yet, not a broken one — so deleting
  // the file would take every assertion below with it and leave a green suite
  // behind. This is the one that would go red.
  expect(content.specimen).not.toBeNull()
})

const specimen = content.specimen!

test('it reviews the Stage 1 Practice Page', () => {
  // ADR-0011 is explicit about which page and why: Stage 1's is the one whose
  // manifest this reader has already been shown, so reviewing it leaks
  // nothing. Pointed at Stage 3's subject, the same file would be its answer
  // key, and the heuristic-evaluation Gate Quiz would have to move behind the
  // Stage 3 report to stay honest — inverting the order every other Competency
  // follows.
  expect(specimen.subject).toBe(1)
})

test('all four quality shapes are present, and none of them carries the report', () => {
  const counts = SPECIMEN_QUALITIES.map(
    (quality) => specimen.findings.filter((finding) => finding.quality === quality).length,
  )
  expect(Math.min(...counts)).toBeGreaterThanOrEqual(1)
  // ADR-0011 names the authoring risk directly: too weak and every flaw is
  // obvious, too strong and there is nothing to judge. A report that was
  // mostly one shape would be one or the other — all-sound leaves the reader
  // nothing to catch, and mostly-taste tells them to distrust every line
  // rather than to read each one.
  expect(Math.max(...counts)).toBeLessThan(specimen.findings.length / 2)
})

test('it is at least as complete as a submission the platform would accept', () => {
  expect(specimen.findings.length).toBeGreaterThanOrEqual(content.config.minFindings)
})

test('every Finding is written in both languages, in all four of its parts', () => {
  // The loader refuses a half-written language pair; what it cannot say is
  // that a Learner reading in Korean and a Learner reading in English are
  // being handed the same report. They are, because the element, the
  // Principle and the quality are single fields shared by both — the only
  // parts that can differ are these two, and they are the ones checked here.
  for (const finding of specimen.findings) {
    for (const part of [finding.defect, finding.fix]) {
      expect(part.en.trim()).not.toBe('')
      expect(part.ko.trim()).not.toBe('')
    }
  }
})

test('the order the Findings are served in does not rank them', () => {
  // Dropping the label is only half of it. A report still arranged by quality
  // — the sound ones opening, the invented one closing — hands the reader the
  // same answer in the sequence, and `specimenAsServed` preserves order
  // because a report is read in the order it was written.
  const qualities = specimen.findings.map((finding) => finding.quality)
  for (const [index, quality] of qualities.entries()) {
    if (index > 0) expect(quality, `findings[${index}] follows another ${quality}`).not.toBe(qualities[index - 1])
  }
})

test('the specimen as served tells the reader nothing about which Finding is which', () => {
  const served = JSON.stringify(specimenAsServed(content))

  for (const quality of SPECIMEN_QUALITIES) {
    expect(served).not.toContain(quality)
  }
  // Nor the other answer in the building: a Finding naming a Planted Defect's
  // slug would hand over the manifest's own wording, and the reader would be
  // matching strings instead of judging a review.
  for (const defect of practicePageOf(content, 1)!.defects) {
    expect(served).not.toContain(defect.slug)
  }
})

test('the Findings the specimen gets right are right about a defect that is really planted', () => {
  // Otherwise "sound" is a claim about our own prose and nothing else. The
  // manifest is the reference answer for this page, so a sound Finding has to
  // name an element the manifest names and reach for the same Principle.
  const planted = practicePageOf(content, 1)!.defects
  for (const finding of specimen.findings.filter((entry) => entry.quality === 'sound')) {
    const match = planted.find((defect) => defect.element === finding.element)
    expect(match, `no Planted Defect on ${finding.element}`).toBeDefined()
    expect(match!.principle).toBe(finding.principle)
  }
})

test('a Finding with the wrong Principle has the right element, and picks a Principle that is not the planted one', () => {
  // The shape ADR-0011 asks for: right element, right observation, wrong name.
  // A wrong-principle Finding on an element carrying no planted defect would
  // be a not-a-defect Finding wearing the wrong label, and the reader would be
  // asked to catch something that was never there.
  const planted = practicePageOf(content, 1)!.defects
  const wrong = specimen.findings.filter((finding) => finding.quality === 'wrong-principle')
  expect(wrong.length).toBeGreaterThan(0)

  for (const finding of wrong) {
    const match = planted.find((defect) => defect.element === finding.element)
    expect(match, `no Planted Defect on ${finding.element}`).toBeDefined()
    expect(finding.principle).not.toBe(match!.principle)
  }
})

test('the Finding about nothing names an element with no planted defect on it', () => {
  // The other half of the same rule. If it landed on a real defect, the reader
  // judging it "not a defect" would be wrong and we would have taught them
  // the opposite of the lesson.
  const planted = practicePageOf(content, 1)!.defects
  const invented = specimen.findings.filter((finding) => finding.quality === 'not-a-defect')
  expect(invented.length).toBeGreaterThan(0)

  for (const finding of invented) {
    expect(planted.map((defect) => defect.element)).not.toContain(finding.element)
  }
})
