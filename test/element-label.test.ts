import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, practicePageOf, type PracticePage } from '../lib/content'
import { elementLabels } from '../lib/element-label'

/**
 * The words an element shows on screen, read back out of the subject.
 *
 * A Finding and a Planted Defect both name their element by identifier, which
 * is what makes a Korean Finding and an English Finding the same record — and
 * is unreadable as a label. These are the rules that turn one into the other,
 * and the ones the reveal depends on: every identified element gets something,
 * and what it gets is the subject's own words in the reader's own language.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const subjects = [1, 2, 3]
  .map((stage) => practicePageOf(content, stage))
  .filter((page): page is PracticePage => page !== null)

test('every subject is authored, so the rules below are checked against all three', () => {
  expect(subjects).toHaveLength(3)
})

test('every identified element has a label, in both languages', () => {
  for (const subject of subjects) {
    for (const lang of ['en', 'ko'] as const) {
      const labels = elementLabels(subject.html[lang])
      for (const element of subject.elements) {
        expect(labels[element], `stage ${subject.stage} ${lang}: ${element}`).toBeTruthy()
      }
    }
  }
})

test('a label is the element’s own words, so it differs between the two variants', () => {
  const stage1 = subjects[0]
  const en = elementLabels(stage1.html.en)
  const ko = elementLabels(stage1.html.ko)

  expect(en['confirm-selected-orders']).toBe('Confirm selected orders')
  expect(ko['confirm-selected-orders']).toBe('선택한 주문 확정')
  expect(en['tax-invoice-link']).toBe('Download monthly tax invoice')
  expect(ko['tax-invoice-link']).toBe('월별 세금계산서 내려받기')
})

test('a form control is named by the label standing beside it, not by the data in it', () => {
  const ko = elementLabels(subjects[0].html.ko)

  // The field holds "한지민", which names whoever was typed into it rather
  // than what the field is for.
  expect(ko['pickup-contact-field']).toBe('수거 담당자')
  expect(ko['pickup-phone-field']).toBe('연락처')
})

test('a label is short enough to be a handle rather than a copy of the element', () => {
  for (const subject of subjects) {
    for (const lang of ['en', 'ko'] as const) {
      for (const [element, label] of Object.entries(elementLabels(subject.html[lang]))) {
        expect(label.length, `stage ${subject.stage} ${lang}: ${element}`).toBeLessThanOrEqual(43)
      }
    }
  }
})

test('the wall of help text is labelled by its opening, cut and marked as cut', () => {
  const label = elementLabels(subjects[0].html.en)['shipping-help-text']

  expect(label.startsWith('Orders confirmed before the 15:00 cutoff')).toBe(true)
  expect(label.endsWith('…')).toBe(true)
})

test('no label carries markup or an escaped entity through to the reader', () => {
  for (const subject of subjects) {
    for (const lang of ['en', 'ko'] as const) {
      for (const label of Object.values(elementLabels(subject.html[lang]))) {
        expect(label).not.toMatch(/[<>]/)
        expect(label).not.toMatch(/&[a-zA-Z#][a-zA-Z0-9]*;/)
      }
    }
  }
})

test('an element with nothing to quote keeps its identifier rather than going silent', () => {
  const labels = elementLabels('<div data-element="empty-thing"></div>')

  expect(labels['empty-thing']).toBe('empty-thing')
})

test('a nested element of the same kind closes at its own tag', () => {
  const labels = elementLabels(
    '<div data-element="outer">before <div>inner</div> after</div><p>outside</p>',
  )

  expect(labels.outer).toBe('before inner after')
})
