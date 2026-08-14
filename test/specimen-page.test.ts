import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, specimenAsServed } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The surface the specimen Self-Audit Report is read on (#120). The artefact's
 * own rules are held by the content build and proved in content.test.ts; what
 * is observable only over HTTP is here — above all the gate, because a page
 * that opened early would hand a Learner the answers to the audit they are
 * about to sit, and that is the same leak the Findings library is gated to
 * prevent.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const specimen = specimenAsServed(content)!

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

/** A Learner who has submitted the report the specimen reviews. */
async function withSubmittedSubjectReport(email: string) {
  await testDb
    .insert(schema.reports)
    .values({ email, stage: specimen.subject, submittedAt: new Date() })
}

async function read(path: string, email: string) {
  const response = await fetch(`${BASE_URL}${path}`, { headers: { cookie: await sessionCookieFor(email) } })
  return { status: response.status, text: visibleText(await response.text()) }
}

test('before their own report is in, a Learner is told why rather than shown a 404', async () => {
  const email = freshLearner()
  const { status, text } = await read('/en/specimen', email)

  // Not a 404 and not a redirect: a page that vanishes is a state a reader
  // cannot tell from a broken one, and this one has a reason worth giving.
  expect(status).toBe(200)
  expect(text).toContain('waits for your own report')
  expect(text).toContain('answer key')
})

test('the locked page leaks no part of the report it is withholding', async () => {
  // The whole point of the gate. A locked page that still rendered the
  // Findings underneath would be the answer key it exists to withhold.
  const email = freshLearner()
  const { text } = await read('/en/specimen', email)

  for (const finding of specimen.findings) {
    expect(text).not.toContain(finding.element)
    expect(text).not.toContain(finding.defect.en)
  }
})

test('once the subject report is submitted, every Finding is readable', async () => {
  const email = freshLearner()
  await withSubmittedSubjectReport(email)
  const { status, text } = await read('/en/specimen', email)

  expect(status).toBe(200)
  for (const finding of specimen.findings) {
    expect(text, finding.element).toContain(finding.element)
    expect(text, `${finding.element} defect`).toContain(finding.defect.en)
    expect(text, `${finding.element} fix`).toContain(finding.fix.en)
  }
})

test('the page says nothing about which Finding is which', async () => {
  // The reader judges the report; the manifest they were shown when they
  // submitted is what settles it. `specimenAsServed` drops the authoring
  // labels, and this is the check that the surface did not reach past it.
  const email = freshLearner()
  await withSubmittedSubjectReport(email)
  const { text } = await read('/en/specimen', email)

  for (const quality of ['sound', 'wrong-principle', 'taste', 'not-a-defect']) {
    expect(text).not.toContain(quality)
  }
})

test('it is readable in Korean, in Korean', async () => {
  // Not merely a 200 in the other language. A page that renders in `ko` while
  // showing English prose passes a status check and fails the Learner.
  const email = freshLearner()
  await withSubmittedSubjectReport(email)
  const { status, text } = await read('/ko/specimen', email)

  expect(status).toBe(200)
  for (const finding of specimen.findings) {
    expect(text, `${finding.element} ko defect`).toContain(finding.defect.ko)
    expect(text, `${finding.element} en defect must not be here`).not.toContain(finding.defect.en)
  }
})

test('the locked page is written in both languages too', async () => {
  // The state a Learner meets first is the one most likely to be written in
  // one language only, because the language that gets tested is the one the
  // author was reading in.
  const { text } = await read('/ko/specimen', freshLearner())
  expect(text).toContain('내 리포트를 기다립니다')
})

test('the page it reviews is reachable from it, and is served inert', async () => {
  const email = freshLearner()
  await withSubmittedSubjectReport(email)
  const cookie = await sessionCookieFor(email)

  const page = await fetch(`${BASE_URL}/en/specimen`, { headers: { cookie } })
  const href = `/en/audit/${specimen.subject}/page?read`
  expect(await page.text()).toContain(href)

  // Inert, because this reader is checking a claim rather than making one.
  // Served the auditing way, every element would take a selection outline and
  // report it to a surface that is not there — a control that answers a press
  // by doing nothing, which is the defect this Competency's own Stage teaches.
  const subject = await fetch(`${BASE_URL}${href}`, { headers: { cookie } })
  const markup = await subject.text()
  expect(subject.status).toBe(200)
  expect(markup).not.toContain('element-selected')
  // The document itself still arrives whole — this withholds the audit tools,
  // not the page.
  expect(markup).toContain('data-element="confirm-selected-orders"')
})

test('the audit surface still serves the subject with its tools on', async () => {
  // The other half of the same switch. A flag that turned selection off
  // everywhere would break the Self-Audit Report and no test of this page
  // would notice.
  const email = freshLearner()
  const response = await fetch(`${BASE_URL}/en/audit/1/page`, {
    headers: { cookie: await sessionCookieFor(email) },
  })
  expect(await response.text()).toContain('element-selected')
})

test('the Competency that owns the specimen links to it, and the others do not', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)

  const owner = await fetch(`${BASE_URL}/en/learn/${specimenOwner()}`, { headers: { cookie } })
  expect(await owner.text()).toContain('/en/specimen')

  const other = content.config.stages
    .flatMap((entry) => entry.competencies)
    .find((slug) => slug !== specimenOwner())!
  const page = await fetch(`${BASE_URL}/en/learn/${other}`, { headers: { cookie } })
  expect(await page.text()).not.toContain('/en/specimen')
})

/** Read from content rather than typed here, the way the surface reads it. */
function specimenOwner(): string {
  return content.specimen!.competency
}
