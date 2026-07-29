import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { eq } from 'drizzle-orm'
import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The remaining Learner and Maintainer surfaces: My progress (#26), the
 * allowlist interface (#13), the Findings library (#25) and the two
 * dashboard halves (#27, #28). What is tested is above all who can see what
 * — every one of these tickets has a boundary criterion.
 */

const { config, items, practicePage } = loadContent(join(__dirname, '..', 'content'))

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

/** An Indonesia-cohort address: personal, not on the Workspace domain. */
function freshPersonal(): string {
  return `learner-${randomBytes(6).toString('hex')}@gmail.com`
}

async function allow(email: string, isMaintainer = false) {
  await testDb.insert(schema.allowlist).values({ pattern: email, isMaintainer }).onConflictDoNothing()
}

async function submittedReport(email: string, elements: string[]) {
  const [report] = await testDb.insert(schema.reports).values({ email, submittedAt: new Date() }).returning()
  for (const element of elements) {
    await testDb.insert(schema.findings).values({
      reportId: report.id,
      element,
      principle: practicePage.defects.find((defect) => defect.element === element)?.principle ?? 'contrast',
      description: `The visitor cannot act on ${element}.`,
      fix: 'Make it visible.',
    })
  }
  return report
}

// ------------------------------------------------------ the shell's navigation

test('a signed-out visitor is offered no navigation — there is nowhere to go yet', async () => {
  const html = await (await fetch(`${BASE_URL}/en/signin`)).text()

  expect(html).not.toContain('href="/en/me"')
  expect(html).not.toContain('href="/en/learn"')
})

test('a signed-in Learner can reach the overview and their own progress from anywhere', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  // From a page that is not the overview: the shell carries the links, not
  // the page. Reaching /me is what makes signing out reachable at all.
  const html = await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy`, { headers: { cookie } })).text()

  expect(html).toContain('href="/en/learn"')
  expect(html).toContain('href="/en/me"')
})

test('a signed-in Learner can sign out from wherever they are, and only by asking for it', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  // A page that is not My progress: the shell carries the control now, so
  // leaving no longer means finding your own record first.
  const html = await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy`, { headers: { cookie } })).text()
  // Scripts dropped before matching: the streamed RSC payload repeats markup
  // inside <script>, so a raw slice can pass on a shell that rendered nothing.
  const shell = html
    .slice(0, html.indexOf('<main'))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')

  expect(shell).toContain('action="/api/auth/signout?lang=en"')
  // Never a link. The browser follows links on its own, so an image tag on any
  // page could end the session without the Learner touching anything.
  expect(shell).not.toContain('href="/api/auth/signout')
})

test('no route that ends a session answers GET', async () => {
  const cookie = await sessionCookieFor(freshLearner())
  const token = cookie.split('=')[1]

  const response = await fetch(`${BASE_URL}/api/auth/signout?lang=en`, {
    headers: { cookie },
    redirect: 'manual',
  })

  // Refused, and — the part that matters — the session outlives the attempt.
  expect(response.status).toBeGreaterThanOrEqual(400)
  const rows = await testDb.select().from(schema.sessions).where(eq(schema.sessions.token, token))
  expect(rows).toHaveLength(1)
})

test('the Self-Audit Report has no navigation slot of its own', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()

  // Reachable from the bottom of the overview as its capstone (#20) — and
  // nowhere in the shell, on any page.
  const navSection = html.slice(0, html.indexOf('<main'))
  expect(navSection).not.toContain('href="/en/audit"')
})

test('the Findings library is offered only after the reader has submitted', async () => {
  const email = freshLearner()
  const before = await sessionCookieFor(email)
  const beforeHtml = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: before } })).text()
  expect(beforeHtml).not.toContain('href="/en/findings"')

  await submittedReport(email, [practicePage.defects[0].element])
  const afterHtml = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: before } })).text()
  expect(afterHtml).toContain('href="/en/findings"')
})

test('the maintainer surfaces are offered to a Maintainer and to nobody else', async () => {
  const learnerCookie = await sessionCookieFor(freshLearner())
  const learnerHtml = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: learnerCookie } })).text()

  for (const path of ['/en/maintain/learners', '/en/maintain/content', '/en/maintain/allowlist']) {
    expect(learnerHtml).not.toContain(`href="${path}"`)
  }

  const maintainer = freshLearner()
  await allow(maintainer, true)
  const maintainerCookie = await sessionCookieFor(maintainer)
  const maintainerHtml = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: maintainerCookie } })).text()

  for (const path of ['/en/maintain/learners', '/en/maintain/content', '/en/maintain/allowlist']) {
    expect(maintainerHtml).toContain(`href="${path}"`)
  }
})

// ------------------------------------------------------------------ #26 /me

test('my progress shows attempts, report state and language preference, all derived', async () => {
  const email = freshLearner()
  await testDb.insert(schema.users).values({ email, language: 'ko' })
  await testDb.insert(schema.attempts).values({
    email,
    competency: 'readability',
    language: 'en',
    drawn: items['readability'].map((item) => item.slug).slice(0, config.drawSize),
    selections: [],
    score: 2,
    passed: false,
    submittedAt: new Date(),
  })
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text())

  expect(text).toContain(email)
  expect(text).toContain('1 attempt')
  expect(text).toContain('In progress')
  // The saved preference from the users row, not this device's path.
  expect(text).toContain('Korean')
  // Signing out is no longer this page's job — it moved to the rail on
  // 2026-07-29. The shell's control carries its name in `aria-label` and shows
  // no word, so nothing here should be visible text either.
  expect(text).not.toContain('Sign out')
})

test('nothing on /me compares the Learner against a colleague', async () => {
  const other = freshLearner()
  await submittedReport(other, practicePage.defects.map((defect) => defect.element).slice(0, 3))
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text())

  expect(text).not.toContain(other)
})

// ------------------------------------------------- #13 allowlist interface

test('the allowlist interface is Maintainer-only: a Learner gets the same 404 as a missing page', async () => {
  const learnerCookie = await sessionCookieFor(freshLearner())

  const response = await fetch(`${BASE_URL}/en/maintain/allowlist`, { headers: { cookie: learnerCookie } })

  expect(response.status).toBe(404)
})

test('a Maintainer sees the entries, with who added each and when', async () => {
  const maintainer = freshLearner()
  await allow(maintainer, true)
  const cookie = await sessionCookieFor(maintainer)

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/maintain/allowlist`, { headers: { cookie } })).text(),
  )

  expect(text).toContain('@aisahub.com')
  expect(text).toContain('chloe@aisahub.com')
  expect(text).toContain('added by')
})

test('removing an entry locks its person out on their very next request', async () => {
  const email = freshLearner()
  await allow(email)
  const cookie = await sessionCookieFor(email)

  const before = await fetch(`${BASE_URL}/en/learn`, { headers: { cookie }, redirect: 'manual' })
  expect(before.status).toBe(200)

  await testDb.delete(schema.allowlist).where(eq(schema.allowlist.pattern, email))
  // But the wildcard would still admit an @aisahub.com address — so the
  // lock-out is proven with the session invalidated by allowlist absence…
  const after = await fetch(`${BASE_URL}/en/learn`, { headers: { cookie }, redirect: 'manual' })
  // …which for a wildcard-covered address still passes. The real boundary:
  expect(after.status).toBe(200)

  const personal = freshPersonal()
  await allow(personal)
  const personalCookie = await sessionCookieFor(personal)
  expect((await fetch(`${BASE_URL}/en/learn`, { headers: { cookie: personalCookie }, redirect: 'manual' })).status).toBe(200)

  await testDb.delete(schema.allowlist).where(eq(schema.allowlist.pattern, personal))
  const lockedOut = await fetch(`${BASE_URL}/en/learn`, {
    headers: { cookie: personalCookie },
    redirect: 'manual',
  })
  expect(lockedOut.status).toBeGreaterThanOrEqual(300)
  expect(lockedOut.headers.get('location')).toContain('/en/signin')
})

// --------------------------------------------------- #25 findings library

test('a Learner who has not submitted cannot read Findings through any route', async () => {
  const author = freshLearner()
  const report = await submittedReport(author, [practicePage.defects[0].element])
  const [finding] = await testDb.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))

  const cookie = await sessionCookieFor(freshLearner())
  for (const path of ['/en/findings', `/en/findings/${finding.id}`]) {
    const response = await fetch(`${BASE_URL}${path}`, { headers: { cookie }, redirect: 'manual' })

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.headers.get('location')).toContain('/en/audit')
  }
})

test('after submitting, the board lists Findings by agreement with authors named — and no per-person total', async () => {
  const author = freshLearner()
  const report = await submittedReport(author, [practicePage.defects[0].element, practicePage.defects[1].element])
  const [first] = await testDb.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
  const admirer = freshLearner()
  await submittedReport(admirer, [practicePage.defects[2].element])
  await testDb.insert(schema.agreements).values({ findingId: first.id, email: admirer })

  const cookie = await sessionCookieFor(admirer)
  const text = visibleText(await (await fetch(`${BASE_URL}/en/findings`, { headers: { cookie } })).text())

  expect(text).toContain(author)
  expect(text).toContain('1 agreement')
  // No response anywhere returns a per-Learner agreement total.
  expect(text).not.toMatch(/agreements?\s+(earned|received|total)/i)
})

test('a Learner cannot agree with their own Finding — the page offers no control', async () => {
  const author = freshLearner()
  const report = await submittedReport(author, [practicePage.defects[0].element])
  const [finding] = await testDb.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
  const cookie = await sessionCookieFor(author)

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/findings/${finding.id}`, { headers: { cookie } })).text(),
  )

  expect(text).toContain('Your own Finding')
  expect(text).not.toContain('I agree with this Finding')
})

// ------------------------------------------------ #27 / #28 dashboards

test('both dashboard halves are Maintainer-only', async () => {
  const learnerCookie = await sessionCookieFor(freshLearner())

  for (const path of ['/en/maintain/learners', '/en/maintain/content']) {
    const response = await fetch(`${BASE_URL}${path}`, { headers: { cookie: learnerCookie } })

    expect(response.status).toBe(404)
  }
})

test('the people half shows position, inactivity and attempts across everyone', async () => {
  const learner = freshLearner()
  await testDb.insert(schema.users).values({ email: learner, language: 'en' })
  await testDb.insert(schema.attempts).values({
    email: learner,
    competency: 'consistency',
    language: 'en',
    drawn: items['consistency'].map((item) => item.slug).slice(0, config.drawSize),
    selections: [],
    score: 4,
    passed: true,
    submittedAt: new Date(),
  })

  const maintainer = freshLearner()
  await allow(maintainer, true)
  const cookie = await sessionCookieFor(maintainer)

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/maintain/learners`, { headers: { cookie } })).text(),
  )

  expect(text).toContain(learner)
  expect(text).toContain('1 of 4 quizzes passed')
  expect(text).toContain('last activity: today')
})

test('the people half says nobody has arrived yet rather than showing an empty list', async () => {
  // The state a freshly deployed branch is in before the first sign-in, and
  // the one every test run is left in. Emptying the table is safe here only
  // because no other test file writes users and tests within a file run in
  // order — the tests above have already made their assertions.
  await testDb.delete(schema.users)

  const maintainer = freshLearner()
  await allow(maintainer, true)
  const cookie = await sessionCookieFor(maintainer)

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/maintain/learners`, { headers: { cookie } })).text(),
  )

  expect(text).toContain('No one has signed in yet')
  // Every row carries its position, so the phrase's absence is an empty list
  // — asserted without counting anything the rest of the suite also writes.
  expect(text).not.toContain('quizzes passed')

  const ko = visibleText(
    await (await fetch(`${BASE_URL}/ko/maintain/learners`, { headers: { cookie } })).text(),
  )
  expect(ko).toContain('아직 아무도 로그인하지 않았습니다')
})

test('the content half shows per-item rates beside draw counts, and the location comparison', async () => {
  const korean = freshLearner()
  const indonesian = freshPersonal()
  const slugsDrawn = items['visual-hierarchy'].map((item) => item.slug).slice(0, config.drawSize)
  await testDb.insert(schema.attempts).values({
    email: korean,
    competency: 'visual-hierarchy',
    language: 'ko',
    drawn: slugsDrawn,
    selections: slugsDrawn.map((slug, index) => ({ item: slug, choice: 0, correct: index > 0 })),
    score: 4,
    passed: true,
    submittedAt: new Date(),
  })
  await submittedReport(korean, [practicePage.defects[0].element])
  await submittedReport(indonesian, [practicePage.defects[1].element])

  const maintainer = freshLearner()
  await allow(maintainer, true)
  const cookie = await sessionCookieFor(maintainer)

  const text = visibleText(
    await (await fetch(`${BASE_URL}/en/maintain/content`, { headers: { cookie } })).text(),
  )

  // A rate never appears without its draw count.
  expect(text).toMatch(/correct of \d+ drawn/)
  expect(text).toContain(slugsDrawn[0])
  expect(text).toContain('Korea')
  expect(text).toContain('Indonesia')
  expect(text).toMatch(/missed by \d+ of \d+/)
})
