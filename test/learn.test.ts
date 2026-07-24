import { randomBytes } from 'node:crypto'

import { expect, test } from 'vitest'

import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The Learn overview and the Competency page (#20). The test branch persists
 * between runs, so every test works as its own freshly-invented Learner —
 * progress shown for one address can only have come from that address's rows,
 * which is itself the no-leak property the ticket demands.
 */

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

async function passQuiz(email: string, competency: string) {
  await testDb.insert(schema.attempts).values({
    email,
    competency,
    language: 'en',
    drawn: ['a', 'b', 'c', 'd', 'e'],
    selections: [],
    score: 5,
    passed: true,
    submittedAt: new Date(),
  })
}

test('the overview is a Learner surface: unauthenticated requests are refused', async () => {
  const response = await fetch(`${BASE_URL}/en/learn`, { redirect: 'manual' })

  expect(response.headers.get('location')).toContain('/en/signin')
})

test('a fresh Learner sees four Competencies unstarted, and the remaining work without arithmetic', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())

  expect(text.match(/Not started/g)).toHaveLength(4)
  expect(text).toContain('0 / 5 done')
  expect(text).toContain('5 stops to go')
  // Understanding and application are shown separately, and the capstone is
  // locked rather than merely absent.
  expect(text).toContain('Understanding')
  expect(text).toContain('Application')
  expect(text).toContain('Unlocks when all four Gate Quizzes are passed')
})

test('being watched is stated before any first attempt, in both languages (#30)', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const en = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())
  const ko = visibleText(await (await fetch(`${BASE_URL}/ko/learn`, { headers: { cookie } })).text())

  // What a Maintainer can see, named: position, inactivity, attempt counts.
  expect(en).toContain('maintainer can see your progress')
  expect(en).toContain('how long since your last activity')
  expect(en).toContain('how many attempts')
  expect(ko).toContain('관리자는 여러분의 진행 상황을 볼 수 있습니다')
})

test('both languages present the same Competency set', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const en = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())
  const ko = visibleText(await (await fetch(`${BASE_URL}/ko/learn`, { headers: { cookie } })).text())

  expect(en).toContain('Visual hierarchy')
  expect(ko).toContain('시각적 위계')
  expect(en.match(/Not started/g)).toHaveLength(4)
  expect(ko.match(/시작 전/g)).toHaveLength(4)
})

test('a passed Gate Quiz shows as passed, and progress survives a brand-new session', async () => {
  const email = freshLearner()
  await passQuiz(email, 'visual-hierarchy')

  // A second session for the same address — the first cookie is not reused,
  // exactly like coming back after two weeks on another day.
  const laterCookie = await sessionCookieFor(email)
  const text = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: laterCookie } })).text())

  expect(text).toContain('Passed')
  expect(text).toContain('1 attempt')
  expect(text).toContain('1 / 5 done')
  expect(text).toContain('4 stops to go')
})

test("one Learner's progress never colours another's overview", async () => {
  const accomplished = freshLearner()
  for (const slug of ['visual-hierarchy', 'readability', 'consistency', 'perceived-clickability']) {
    await passQuiz(accomplished, slug)
  }

  const strangerCookie = await sessionCookieFor(freshLearner())
  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: strangerCookie } })).text(),
  )

  expect(text.match(/Not started/g)).toHaveLength(4)
  expect(text).not.toContain('Passed')
})

test('the Competency page shows objective, role hint, questions and the article link', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy`, { headers: { cookie } })
  const html = await response.text()
  const text = visibleText(html)

  expect(response.status).toBe(200)
  expect(text).toContain('Afterwards, you can')
  expect(text).toContain('Where to point it')
  expect(text).toContain('Carry these questions into the article')
  expect(html).toContain('nngroup.com')
})

test('the browser-translation notice appears for Korean-language Learners and never for English', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const ko = visibleText(
    await (await fetch(`${BASE_URL}/ko/learn/visual-hierarchy`, { headers: { cookie } })).text(),
  )
  const en = visibleText(
    await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy`, { headers: { cookie } })).text(),
  )

  expect(ko).toContain('번역')
  expect(en).not.toContain('번역')
})

test('a Competency outside Stage 1 is not a page', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const response = await fetch(`${BASE_URL}/en/learn/form-burden`, { headers: { cookie } })

  expect(response.status).toBe(404)
})
