import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { eq } from 'drizzle-orm'
import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The Self-Audit Report (#24). The submit path's server-side rules are
 * enforced in actions the browser drives; here the observable states are
 * tested over HTTP — above all that no pre-submission response carries the
 * manifest, which is the leak that would silently turn the assessment into a
 * reading exercise.
 */

const { config, items, practicePage } = loadContent(join(__dirname, '..', 'content'))

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

async function passAllQuizzes(email: string) {
  for (const competency of config.stage1Competencies) {
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

async function draftWithFindings(email: string, count: number) {
  const [report] = await testDb.insert(schema.reports).values({ email }).returning()
  const defects = practicePage.defects.slice(0, count)
  for (const defect of defects) {
    await testDb.insert(schema.findings).values({
      reportId: report.id,
      element: defect.element,
      principle: defect.principle,
      description: 'What goes wrong for the visitor.',
      fix: 'The smallest change that removes it.',
    })
  }
  return report
}

test('the audit is locked until all four Gate Quizzes pass, and says so over the brief', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(await (await fetch(`${BASE_URL}/en/audit`, { headers: { cookie } })).text())

  expect(text).toContain('unlocks when all four Gate Quizzes are passed')
  // Locked means no audit surface: no embedded page, no Finding form.
  expect(text).not.toContain('New Finding')
})

test('with the quizzes passed, the audit shows the brief and the page beside its drawer', async () => {
  const email = freshLearner()
  await passAllQuizzes(email)
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/en/audit`, { headers: { cookie } })).text()
  const text = visibleText(html)

  expect(text).toContain('Audit the practice page')
  expect(text).toContain('at least three Findings')
  expect(html).toContain(`src="/en/audit/page"`)
  expect(text).toContain('New Finding')
})

test('before submission, no response carries the manifest, the count, or any defect status', async () => {
  const email = freshLearner()
  await passAllQuizzes(email)
  await draftWithFindings(email, 2)
  const cookie = await sessionCookieFor(email)

  for (const path of ['/en/audit', '/ko/audit', '/en/learn', '/en/audit/page']) {
    const body = await (await fetch(`${BASE_URL}${path}`, { headers: { cookie } })).text()

    for (const defect of practicePage.defects) {
      expect(body).not.toContain(defect.slug)
      expect(body).not.toContain(defect.explanation.en.slice(0, 40))
      expect(body).not.toContain(defect.explanation.ko.slice(0, 40))
    }
    // The count must not be derivable: "six defects" in any phrasing. The
    // brief may say the word "planted" — it explains what submission reveals
    // — but never how many.
    expect(body).not.toMatch(/(six|[6６])\s*(defect|planted)/i)
    expect(body).not.toMatch(/결함\s*(여섯|6)|(여섯|6)\s*(개의\s*)?결함/)
  }
  // The artefact itself stays entirely silent about the exercise.
  const page = await (await fetch(`${BASE_URL}/en/audit/page`, { headers: { cookie } })).text()
  expect(page).not.toMatch(/defect|planted|결함/i)
})

test('a draft survives leaving and returning on a brand-new session', async () => {
  const email = freshLearner()
  await passAllQuizzes(email)
  await draftWithFindings(email, 2)

  const laterCookie = await sessionCookieFor(email)
  const text = visibleText(await (await fetch(`${BASE_URL}/en/audit`, { headers: { cookie: laterCookie } })).text())

  expect(text).toContain('2 Findings saved')
  expect(text).toContain('1 more Finding')
})

test('the submitted report reveals every planted defect, marked found or missed, with the source link', async () => {
  const email = freshLearner()
  await passAllQuizzes(email)
  const report = await draftWithFindings(email, 3)
  await testDb.update(schema.reports).set({ submittedAt: new Date() }).where(eq(schema.reports.id, report.id))
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/en/audit`, { headers: { cookie } })).text()
  const text = visibleText(html)

  // All six, bilingual explanations rendered in the page's language.
  for (const defect of practicePage.defects) {
    expect(text).toContain(defect.element)
  }
  expect(text.match(/Found/g)).toHaveLength(3)
  expect(text.match(/Missed/g)).toHaveLength(3)
  expect(html).toContain('/en/audit/page/source')
  // Completion: all four passed and the report submitted.
  expect(text).toContain('Stage 1 complete')
})

test('completion never arrives with a Competency outstanding', async () => {
  const email = freshLearner()
  // Three of four passed, report somehow submitted — completion must not show.
  for (const competency of config.stage1Competencies.slice(0, 3)) {
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
  const [report] = await testDb.insert(schema.reports).values({ email, submittedAt: new Date() }).returning()
  void report
  const cookie = await sessionCookieFor(email)

  const overview = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())

  expect(overview).not.toContain('Stage 1 is complete')
  expect(overview).toContain('4 / 5 done')
  expect(overview).toContain('You are here · Not started')
})

test('the reveal shows the issue-url slot, absent when not supplied', async () => {
  const email = freshLearner()
  await passAllQuizzes(email)
  const report = await draftWithFindings(email, 3)
  await testDb.update(schema.reports).set({ submittedAt: new Date() }).where(eq(schema.reports.id, report.id))
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/en/audit`, { headers: { cookie } })).text()

  expect(visibleText(html)).toContain('Optional: show a fix')
  expect(visibleText(html)).toContain('screenshot')
  expect(visibleText(html)).not.toContain('Saved.')
})
