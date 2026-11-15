import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, practicePageOf } from '../lib/content'
import { DEMO_DOMAIN } from '../lib/demo'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'

/**
 * The public demo: a visitor with no account becomes a temporary Learner, and
 * the demo and the team never see each other's Findings.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { config, items } = content
const practicePage = practicePageOf(content, 1)!

async function submittedFinding(email: string, description: string) {
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
  const [report] = await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() }).returning()
  const defect = practicePage.defects[0]
  await testDb.insert(schema.findings).values({
    reportId: report.id,
    element: defect.element,
    principle: defect.principle,
    description,
    fix: 'The smallest change that removes it.',
  })
}

test('the demo entrance signs a visitor in as a temporary Learner', async () => {
  const response = await fetch(`${BASE_URL}/api/demo?lang=en`, { redirect: 'manual' })
  expect(response.status).toBe(307)
  expect(response.headers.get('location')).toMatch(/\/en\/learn$/)

  const cookie = response.headers.getSetCookie().find((value) => value.startsWith('session='))!.split(';')[0]
  const learn = await fetch(`${BASE_URL}/en/learn`, { headers: { cookie }, redirect: 'manual' })
  expect(learn.status).toBe(200)
})

test('a demo visitor and a real Learner never read each other’s Findings', async () => {
  const tag = randomBytes(4).toString('hex')
  const real = `demo-test-real-${tag}@aisahub.com`
  const visitor = `demo-test-visitor-${tag}${DEMO_DOMAIN}`
  await testDb.insert(schema.allowlist).values({ pattern: real }).onConflictDoNothing()
  await submittedFinding(real, `Real finding ${tag}`)
  await submittedFinding(visitor, `Demo finding ${tag}`)

  const asVisitor = await (await fetch(`${BASE_URL}/en/findings`, { headers: { cookie: await sessionCookieFor(visitor) } })).text()
  expect(asVisitor).toContain(`Demo finding ${tag}`)
  expect(asVisitor).not.toContain(`Real finding ${tag}`)

  const asReal = await (await fetch(`${BASE_URL}/en/findings`, { headers: { cookie: await sessionCookieFor(real) } })).text()
  expect(asReal).toContain(`Real finding ${tag}`)
  expect(asReal).not.toContain(`Demo finding ${tag}`)
})
