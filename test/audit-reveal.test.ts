import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, practicePageOf } from '../lib/content'
import { elementLabels } from '../lib/element-label'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The submitted Self-Audit Report, which is two panels beside the subject they
 * are about rather than one column of identifiers.
 *
 * What these check is the part a Learner would otherwise have to take on
 * trust: that both panels are real addresses, that the subject is beside both
 * of them in a mode that can be pointed at but not written to, that every
 * element is named in words as well as by identifier, and that the two panels
 * are cut along the same attribute — which is the whole reason they can be
 * read against each other.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { config, items } = content
const practicePage = practicePageOf(content, 1)!

function freshLearner(): string {
  return `reveal-${randomBytes(6).toString('hex')}@aisahub.com`
}

async function passStageOne(email: string) {
  for (const competency of config.stages[0].competencies) {
    await testDb.insert(schema.attempts).values({
      email,
      competency,
      language: 'en',
      drawn: items[competency].map((item) => item.slug).slice(0, config.drawSize),
      selections: [],
      score: config.drawSize,
      passed: true,
      submittedAt: new Date(),
    })
  }
}

/** A submitted Stage 1 report citing the elements given, one Finding each. */
async function submitted(email: string, elements: string[]) {
  await passStageOne(email)
  const [report] = await testDb
    .insert(schema.reports)
    .values({ email, stage: 1, submittedAt: new Date() })
    .returning()
  for (const element of elements) {
    await testDb.insert(schema.findings).values({
      reportId: report.id,
      element,
      principle: practicePage.defects.find((defect) => defect.element === element)!.principle,
      description: `What goes wrong at ${element}.`,
      fix: 'The smallest change that removes it.',
    })
  }
}

/** The Competency a Planted Defect is filed under, by name, in one language. */
function competencyName(slug: string, lang: 'en' | 'ko'): string {
  return content.competencies.find((entry) => entry.slug === slug)!.name[lang]
}

test('the report is two addresses, and each says which one is being read', async () => {
  const email = freshLearner()
  await submitted(email, ['confirm-selected-orders', 'shipping-help-text', 'download-orders'])
  const cookie = await sessionCookieFor(email)

  for (const [path, other] of [
    ['/en/audit/1', '/en/audit/1/findings'],
    ['/en/audit/1/findings', '/en/audit/1'],
  ]) {
    const html = await (await fetch(`${BASE_URL}${path}`, { headers: { cookie } })).text()

    // Both panels are offered from both, and each is a link rather than a
    // control: a panel a `?tab=` could not survive is one the language
    // switcher would drop on the way across.
    expect(html, path).toContain(`href="${other}"`)
    expect(html, path).toContain('aria-current="page"')
  }
})

test('the subject stands beside both panels, in a mode that answers pointing and refuses writing', async () => {
  const email = freshLearner()
  await submitted(email, ['confirm-selected-orders', 'shipping-help-text', 'download-orders'])
  const cookie = await sessionCookieFor(email)

  for (const path of ['/en/audit/1', '/en/audit/1/findings']) {
    const html = await (await fetch(`${BASE_URL}${path}`, { headers: { cookie } })).text()
    expect(html, path).toContain('/en/audit/1/page?locate')
  }
})

test('every Planted Defect is named in the subject’s own words as well as by identifier', async () => {
  const email = freshLearner()
  await submitted(email, ['confirm-selected-orders', 'shipping-help-text', 'download-orders'])
  const cookie = await sessionCookieFor(email)

  for (const lang of ['en', 'ko'] as const) {
    const html = await (await fetch(`${BASE_URL}/${lang}/audit/1`, { headers: { cookie } })).text()
    const text = visibleText(html)
    const labels = elementLabels(practicePage.html[lang])

    for (const defect of practicePage.defects) {
      // The identifier is the record's key and a Learner quotes it in a pull
      // request, so it stays; the words are what makes the list readable.
      expect(text, `${lang} ${defect.slug}`).toContain(defect.element)
      expect(text, `${lang} ${defect.slug}`).toContain(labels[defect.element].replace(/…$/, ''))
    }
  }
})

test('both panels are cut along the same attribute — the Competency', async () => {
  const email = freshLearner()
  // Three Findings across three different Competencies, so the grouping has
  // something to separate rather than one heading over everything.
  await submitted(email, ['confirm-selected-orders', 'shipping-help-text', 'download-orders'])
  const cookie = await sessionCookieFor(email)

  for (const lang of ['en', 'ko'] as const) {
    const planted = visibleText(
      await (await fetch(`${BASE_URL}/${lang}/audit/1`, { headers: { cookie } })).text(),
    )
    const mine = visibleText(
      await (await fetch(`${BASE_URL}/${lang}/audit/1/findings`, { headers: { cookie } })).text(),
    )

    // Every Competency a defect was planted against is a heading on the
    // reveal; the three the Learner's Findings cite are headings on theirs.
    for (const defect of practicePage.defects) {
      expect(planted, `${lang} ${defect.competency}`).toContain(competencyName(defect.competency, lang))
    }
    for (const competency of ['visual-hierarchy', 'readability', 'consistency']) {
      expect(mine, `${lang} ${competency}`).toContain(competencyName(competency, lang))
    }
  }
})

test('the Findings panel is not an address before the report is submitted', async () => {
  const email = freshLearner()
  await passStageOne(email)
  const cookie = await sessionCookieFor(email)

  const response = await fetch(`${BASE_URL}/en/audit/1/findings`, {
    headers: { cookie },
    redirect: 'manual',
  })

  // Sent back to the audit rather than shown an empty panel: before
  // submission the drawer beside the page is where a draft is read.
  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.status).toBeLessThan(400)
  expect(response.headers.get('location')).toContain('/en/audit/1')
})

test('the reveal is a Learner surface, on both panels', async () => {
  for (const path of ['/en/audit/1', '/en/audit/1/findings']) {
    const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' })

    expect(response.status, path).toBeGreaterThanOrEqual(300)
    expect(response.status, path).toBeLessThan(400)
    expect(response.headers.get('location'), path).toContain('/en/signin')
  }
})
