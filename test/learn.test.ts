import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The Learn overview and the Competency page (#20). Tests within a run share
 * one branch, so every test works as its own freshly-invented Learner —
 * progress shown for one address can only have come from that address's rows,
 * which is itself the no-leak property the ticket demands. Between runs the
 * branch is swept back to the seed (#33), so nothing here inherits.
 */

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

const STAGE_ONE_COMPETENCIES = [
  'visual-hierarchy',
  'readability',
  'consistency',
  'perceived-clickability',
]

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

test('a fresh Learner sees four Competencies unstarted and their current progress', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())

  expect(text.match(/Not started/g)).toHaveLength(4)
  expect(text.match(/0 attempts/g)).toHaveLength(4)
  expect(text).toContain('0 / 5 done')
  // The capstone is locked rather than merely absent.
  expect(text).toContain('Unlocks when all four Gate Quizzes are passed')
})

test('the programme contents shows the whole route without inventing a next Competency', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()
  const text = visibleText(html)

  expect(text).toContain('Programme contents')
  expect(text).toContain('Choose any Competency')
  expect(html).toContain('role="progressbar"')
  expect(html).toContain('aria-label="Stage 1 progress"')
  // The region is named by its own heading rather than by a duplicate
  // `aria-label`, which made a screen reader announce the name twice.
  expect(html).toContain('aria-labelledby="programme-stages"')
  expect(html).toContain('id="programme-stages"')
  expect(html).toContain('style="width:0%"')
  const stageSection = html.match(
    /<section aria-labelledby="programme-stages">[\s\S]*?<\/section>/,
  )?.[0]
  expect(stageSection).toBeDefined()
  expect(stageSection).not.toContain('<a')
  expect(stageSection).not.toContain('<button')
  expect(stageSection).not.toContain('aria-expanded')
  expect(text).not.toContain('The Stage 1 line')
  expect(text).not.toContain('After this line')
  expect(text.indexOf('Programme stages')).toBeLessThan(text.indexOf('Stage 2'))
  expect(text.indexOf('Stage 2')).toBeLessThan(text.indexOf('Stage 3'))
  expect(text.indexOf('Stage 3')).toBeLessThan(text.indexOf('Programme contents'))
  expect(text.indexOf('Programme contents')).toBeLessThan(text.indexOf('Visual hierarchy'))
  expect(text).not.toContain('Next stop')
  expect(text).not.toContain('You are here')
})

test('every Stage 1 Competency exposes its own Gate Quiz', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()
  const text = visibleText(html)

  for (const slug of STAGE_ONE_COMPETENCIES) {
    expect(html).toContain(`href="/en/learn/${slug}/quiz"`)
  }
  expect(text.match(/Open the Gate Quiz/g)).toHaveLength(4)
})

test('Stage 1 is four distinct task panels with separate learning and quiz links', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()

  const panels = [...html.matchAll(/<article data-competency="([^"]+)"[\s\S]*?<\/article>/g)]
  expect(panels.map((panel) => panel[1])).toEqual(STAGE_ONE_COMPETENCIES)
  for (const [panel, slug] of panels.map((match) => [match[0], match[1]])) {
    expect(panel).toContain(`href="/en/learn/${slug}"`)
    expect(panel).toContain(`href="/en/learn/${slug}/quiz"`)
    expect(panel).not.toMatch(/<a\b[^>]*>[^<]*<a/)
  }
})

test('several in-progress Competencies do not invent one current panel', async () => {
  const email = freshLearner()
  for (const competency of STAGE_ONE_COMPETENCIES.slice(0, 2)) {
    await testDb.insert(schema.attempts).values({
      email,
      competency,
      language: 'en',
      drawn: ['a', 'b', 'c', 'd', 'e'],
      selections: [],
      score: 1,
      passed: false,
      submittedAt: new Date(),
    })
  }

  const cookie = await sessionCookieFor(email)
  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()

  const panels = [...html.matchAll(/<article data-competency="[^"]+"[\s\S]*?<\/article>/g)]
    .map((match) => match[0])
    .join('')
  expect(panels.match(/data-quiz-status="in-progress"/g)).toHaveLength(2)
  expect(panels).not.toContain('aria-current=')
})

test('being watched is stated before any first attempt, in both languages (#30)', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const en = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())
  const ko = visibleText(await (await fetch(`${BASE_URL}/ko/learn`, { headers: { cookie } })).text())

  // What a Maintainer can see, named: position, inactivity, attempt counts.
  expect(en).toContain('maintainer can see your progress')
  expect(en).toContain('how long since your last activity')
  expect(en).toContain('how many attempts')
  expect(ko).toContain('운영자는 학습자의 진행 상황을 볼 수 있습니다')
})

test('both languages present the same Competency set', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const en = visibleText(await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text())
  const ko = visibleText(await (await fetch(`${BASE_URL}/ko/learn`, { headers: { cookie } })).text())

  expect(en).toContain('Visual hierarchy')
  expect(ko).toContain('시각적 위계')
  expect(en).toContain('Choose any Competency')
  expect(ko).toContain('원하는 역량부터')
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
})

test('the labelled progress bar reaches 100% when Stage 1 is complete', async () => {
  const email = freshLearner()
  for (const slug of STAGE_ONE_COMPETENCIES) {
    await passQuiz(email, slug)
  }
  await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() })

  const cookie = await sessionCookieFor(email)
  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()

  expect(html).toContain('aria-valuenow="5"')
  expect(html).toContain('style="width:100%"')
})

test('the report panel stays locked until every quiz passes and remains revisitable after submission', async () => {
  const email = freshLearner()
  const lockedCookie = await sessionCookieFor(email)
  const locked = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: lockedCookie } })).text()

  expect(locked).toContain('data-report-status="locked"')
  expect(locked).not.toContain('href="/en/audit"')

  for (const slug of STAGE_ONE_COMPETENCIES) {
    await passQuiz(email, slug)
  }
  await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() })

  const submittedCookie = await sessionCookieFor(email)
  const submitted = await (
    await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: submittedCookie } })
  ).text()

  expect(submitted).toContain('data-report-status="submitted"')
  expect(submitted).toContain('href="/en/audit"')
  expect(visibleText(submitted)).toContain('Submitted')
})

test("one Learner's progress never colours another's overview", async () => {
  const accomplished = freshLearner()
  for (const slug of STAGE_ONE_COMPETENCIES) {
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

test("every declared Competency has a page in both languages, carrying that language's own copy", async () => {
  // Nothing links to the later Stages yet — the Learn overview opens Stage 1
  // only until #79. They are reachable because the route admits any declared
  // Competency that has been authored, and a page nobody can reach yet is
  // still a page a Learner will read, so it has to hold both languages before
  // the item pools are written against it.
  const cookie = await sessionCookieFor(freshLearner())
  const { config, competencies } = loadContent(join(__dirname, '..', 'content'))
  const declared = config.stages.flatMap((entry) => entry.competencies)
  // Non-empty rather than a count. Whether Stage 3 carries a fifth Competency
  // is open — ADR-0011's follow-up leaves it for the maintainer and forbids
  // this ticket from settling it — so asserting twelve here would answer it in
  // a test file, and adding accessibility would turn an unmade decision into a
  // broken suite. What this needs from the number is only that the loop below
  // is not iterating nothing.
  expect(declared.length).toBeGreaterThan(0)

  for (const slug of declared) {
    const competency = competencies.find((entry) => entry.slug === slug)!
    for (const lang of ['en', 'ko'] as const) {
      const response = await fetch(`${BASE_URL}/${lang}/learn/${slug}`, { headers: { cookie } })
      expect(response.status, `${lang}/${slug}`).toBe(200)

      const text = visibleText(await response.text())
      // Its own language's name and objective, not the other language's. A
      // page that renders in `ko` while showing English copy passes a status
      // check and fails the Learner.
      expect(text, `${lang}/${slug} name`).toContain(competency.name[lang])
      expect(text, `${lang}/${slug} objective`).toContain(competency.objective[lang].slice(0, 24))
    }
  }
})

test('a Competency declared under no Stage is not a page', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const response = await fetch(`${BASE_URL}/en/learn/not-a-competency`, { headers: { cookie } })

  expect(response.status).toBe(404)
})

// Removed here: 'a declared Competency nobody has authored yet is not a page
// either'. The route refuses on `!competency || stage === null`, and that test
// covered the first half by fetching a slug config.md declared and nobody had
// written. It was built to fail loudly the moment that stopped being possible,
// and #72 is that moment — every one of the twelve is now authored, so the
// case can no longer be reached through the repository's own content and the
// test could only have been kept alive by inventing a Competency to leave
// unwritten. The half that is still reachable is covered above. The other half
// is now covered by 'every Competency the curriculum declares is authored' in
// competencies.test.ts, which fails at the source — a slug added to config.md
// with no definition file — rather than at a 404 downstream of it.
