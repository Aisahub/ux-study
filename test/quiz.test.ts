import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'
import { drawItems, scoreDraw, shuffledOrder } from '../lib/quiz'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The Gate Quiz (#21, #22). The pure rules — drawing, ordering, scoring — are
 * tested directly; everything a Learner observes is tested over HTTP against
 * attempts arranged in the database, the same way the auth suite works.
 */

const { config, items, competencies } = loadContent(join(__dirname, '..', 'content'))
const pool = items['visual-hierarchy']
const slugs = pool.map((item) => item.slug)

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

// ---------------------------------------------------------------- pure rules

test('a draw takes exactly drawSize distinct items from the pool', () => {
  for (let i = 0; i < 50; i++) {
    const drawn = drawItems(slugs, config.drawSize, null)

    expect(drawn).toHaveLength(config.drawSize)
    expect(new Set(drawn).size).toBe(config.drawSize)
    for (const slug of drawn) expect(slugs).toContain(slug)
  }
})

test('a redraw after a failure is never the identical set', () => {
  const first = drawItems(slugs, config.drawSize, null)
  for (let i = 0; i < 50; i++) {
    const second = drawItems(slugs, config.drawSize, first)

    expect([...second].sort()).not.toEqual([...first].sort())
  }
})

test('four of five passes, three fails, and an unanswered item is simply wrong', () => {
  const drawn = ['a', 'b', 'c', 'd', 'e']
  const keyed = { a: 0, b: 1, c: 2, d: 0, e: 1 }

  const four = scoreDraw(drawn, keyed, { a: 0, b: 1, c: 2, d: 0, e: 3 }, config.passThreshold)
  expect(four.score).toBe(4)
  expect(four.passed).toBe(true)

  const three = scoreDraw(drawn, keyed, { a: 0, b: 1, c: 2, d: 3, e: 3 }, config.passThreshold)
  expect(three.score).toBe(3)
  expect(three.passed).toBe(false)

  const unanswered = scoreDraw(drawn, keyed, { a: 0, b: 1, c: 2, d: 0 }, config.passThreshold)
  expect(unanswered.score).toBe(4)
  expect(unanswered.selections.find((selection) => selection.item === 'e')).toEqual({
    item: 'e',
    choice: -1,
    correct: false,
  })
})

test('re-scoring a stored attempt yields the same verdict every time', () => {
  const drawn = ['a', 'b', 'c', 'd', 'e']
  const keyed = { a: 0, b: 1, c: 2, d: 0, e: 1 }
  const choices = { a: 0, b: 1, c: 0, d: 0, e: 1 }

  const first = scoreDraw(drawn, keyed, choices, config.passThreshold)
  for (let i = 0; i < 5; i++) {
    expect(scoreDraw(drawn, keyed, choices, config.passThreshold)).toEqual(first)
  }
})

test('option order is shuffled per attempt and item, deterministically', () => {
  const one = shuffledOrder('7:some-item', 4)

  expect(shuffledOrder('7:some-item', 4)).toEqual(one)
  expect([...one].sort()).toEqual([0, 1, 2, 3])
  // Across many seeds the authored position cannot dominate the first slot —
  // the leak this shuffle exists to prevent.
  const firstPositions = new Set(
    Array.from({ length: 20 }, (_, seed) => shuffledOrder(`${seed}:some-item`, 4)[0]),
  )
  expect(firstPositions.size).toBeGreaterThan(1)
})

// ------------------------------------------------------------- over the wire

test('the doorstep states how many items and how many must be right, before anything starts', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz`, { headers: { cookie } })).text(),
  )

  expect(text).toContain(`${config.drawSize} items`)
  expect(text).toContain(`${config.passThreshold} correct passes`)
})

async function openAttempt(email: string, drawn: string[], language = 'en') {
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({ email, competency: 'visual-hierarchy', language, drawn })
    .returning()
  return attempt
}

test('an open attempt serves its items with no correct-answer key anywhere in the response', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const attempt = await openAttempt(email, drawn)

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, {
    headers: { cookie },
  })
  const html = await response.text()

  expect(response.status).toBe(200)
  // The artefact and options are there for the first item…
  expect(html).toContain(pool[0].prompt.en.slice(0, 30))
  // …but nothing anywhere says which option is keyed. The RSC payload
  // serialises every prop, so a leaked flag would appear as plain text.
  expect(html).not.toMatch(/"correct"/)
  expect(html).not.toMatch(/correct&quot;/)
})

test('while an attempt is open, the attempt owns the language: the other path returns to it', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const attempt = await openAttempt(email, slugs.slice(0, config.drawSize), 'ko')

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, {
    headers: { cookie },
    redirect: 'manual',
  })

  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.headers.get('location')).toContain(`/ko/learn/visual-hierarchy/quiz/${attempt.id}`)
})

test('the switcher is absent from an open attempt and present on the doorstep', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const attempt = await openAttempt(email, slugs.slice(0, config.drawSize))

  const doorstep = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz`, { headers: { cookie } })
  ).text()
  const open = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()

  expect(visibleText(doorstep)).toContain('한국어')
  expect(visibleText(open)).not.toContain('한국어')
})

test("someone else's attempt does not exist for you", async () => {
  const owner = freshLearner()
  const attempt = await openAttempt(owner, slugs.slice(0, config.drawSize))
  const strangerCookie = await sessionCookieFor(freshLearner())

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, {
    headers: { cookie: strangerCookie },
  })

  expect(response.status).toBe(404)
})

test('a failed attempt names the missed items and their article sections, never the answers', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const wrongSlugs = drawn.slice(0, 2)
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({
      email,
      competency: 'visual-hierarchy',
      language: 'en',
      drawn,
      selections: drawn.map((slug) => ({ item: slug, choice: 0, correct: !wrongSlugs.includes(slug) })),
      score: 3,
      passed: false,
      submittedAt: new Date(),
    })
    .returning()

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, {
    headers: { cookie },
  })
  const html = await response.text()
  const text = visibleText(html)

  expect(text).toContain('Not passed')
  expect(text).toContain('3 of 5 correct')
  for (const slug of wrongSlugs) {
    const item = pool.find((candidate) => candidate.slug === slug)!
    // Named, and pointed at the article section that covers it…
    expect(text).toContain(item.sourceSection)
    // …with the keyed answer withheld. This is the retry loophole (#22): the
    // test must fail loudly if anyone later "improves" this screen.
    const keyed = item.options.en.find((option) => option.correct)!
    expect(html).not.toContain(keyed.text.slice(0, 40))
  }
  expect(text).toContain('Try again now')
})

test('a passed attempt advances exactly that one Competency on the overview', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  await testDb.insert(schema.attempts).values({
    email,
    competency: 'readability',
    language: 'en',
    drawn: items['readability'].map((item) => item.slug).slice(0, config.drawSize),
    selections: [],
    score: 5,
    passed: true,
    submittedAt: new Date(),
  })

  const text = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())

  expect(text.match(/Passed/g)).toHaveLength(1)
  expect(text.match(/Not started/g)).toHaveLength(3)
})

test('every earlier attempt stays visible on the doorstep', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  for (const score of [2, 3]) {
    await testDb.insert(schema.attempts).values({
      email,
      competency: 'visual-hierarchy',
      language: 'en',
      drawn: slugs.slice(0, config.drawSize),
      selections: [],
      score,
      passed: false,
      submittedAt: new Date(),
    })
  }

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz`, { headers: { cookie } })).text(),
  )

  expect(text).toContain('2 of 5')
  expect(text).toContain('3 of 5')
})
