import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { eq } from 'drizzle-orm'
import { expect, test } from 'vitest'

import { loadContent, practicePageOf } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The remaining Learner and Maintainer surfaces: My page (#26, #54), the
 * allowlist interface (#13), the Findings library (#25) and the two
 * dashboard halves (#27, #28). What is tested is above all who can see what
 * — every one of these tickets has a boundary criterion.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { competencies, config, items } = content
const practicePage = practicePageOf(content, 1)!

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
  const [report] = await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() }).returning()
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

  // A page that is not My page: the shell carries the control now, so
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
  expect(navSection).not.toContain('href="/en/audit')
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

// ------------------------------------------------------- #26 / #54 My page

/** One finished attempt against `readability`, scoring `score` of the draw. */
async function finishedAttempt(email: string, score: number, submittedAt = new Date()) {
  await testDb.insert(schema.attempts).values({
    email,
    competency: 'readability',
    language: 'en',
    drawn: items['readability'].map((item) => item.slug).slice(0, config.drawSize),
    selections: [],
    score,
    passed: score >= config.passThreshold,
    submittedAt,
  })
}

test('my page states the account and names each finished attempt', async () => {
  const email = freshLearner()
  await testDb.insert(schema.users).values({ email, language: 'ko' })
  await finishedAttempt(email, 2)
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text())

  // The account. Since the phone top bar became the avatar alone (#53), this
  // page is the only place the address and the role are written.
  expect(text).toContain(email)
  expect(text).toContain('Learner')
  // The saved preference from the users row, not this device's path.
  expect(text).toContain('Korean')
  // The attempt itself: Learn counts these, this one names it.
  expect(text).toContain(`2 / ${config.drawSize}`)
  expect(text).toContain(new Date().toISOString().slice(0, 10))
})

test('my page does not restate the progress the Learn overview already carries', async () => {
  const email = freshLearner()
  await finishedAttempt(email, 2)
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text())

  // The sharp edge of the duplication was the roll-call: the old page listed
  // every Stage 1 Competency with a status, whether or not this Learner had
  // touched it. Now a Competency appears only because there is an attempt to
  // name — so the three untouched ones are absent, and asserting that is what
  // stops the roll-call drifting back (#54).
  const attempted = competencies.find((competency) => competency.slug === 'readability')!
  expect(text).toContain(attempted.name.en)
  for (const competency of competencies.filter((c) => c.slug !== 'readability')) {
    expect(text).not.toContain(competency.name.en)
  }

  // The count and the Stage total are Learn's sentence to say, not this one's.
  expect(text).not.toContain('1 attempt')
  expect(text).not.toContain('Stage 1 progress')
  // 'Not started' is deliberately not asserted against: it is the Self-Audit
  // Report's own state here, which this page does carry.
  expect(text).not.toContain('In progress')
})

test('my page never totals a Learner across Competencies', async () => {
  const email = freshLearner()
  await finishedAttempt(email, 4, new Date('2026-07-02'))
  await finishedAttempt(email, 3, new Date('2026-07-01'))
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text())

  // Both attempts are named, newest first.
  expect(text).toContain(`4 / ${config.drawSize}`)
  expect(text).toContain(`3 / ${config.drawSize}`)
  expect(text.indexOf('2026-07-02')).toBeLessThan(text.indexOf('2026-07-01'))
  // And their sum is nowhere: PRODUCT.md forbids a cumulative per-person
  // score, and a page about one person is where one would otherwise appear.
  expect(text).not.toContain(`7 / ${config.drawSize * 2}`)
})

test('my page never says which items an attempt missed', async () => {
  const email = freshLearner()
  const drawn = items['readability'].map((item) => item.slug).slice(0, config.drawSize)
  await testDb.insert(schema.attempts).values({
    email,
    competency: 'readability',
    language: 'en',
    drawn,
    selections: drawn.map((item, index) => ({ item, choice: 0, correct: index < 2 })),
    score: 2,
    passed: false,
    submittedAt: new Date(),
  })
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text()

  // A retry draws from the same pool, so naming the missed items would hand
  // over the key #22 keeps on the server. Raw HTML, not visible text: a slug
  // reaching the payload at all is the leak, whether or not it is painted.
  for (const slug of drawn) {
    expect(html).not.toContain(slug)
  }
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
    // The entry route, not a Stage: it names whichever Stage the reader is on.
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

  // Grouped by Stage, and a Stage nobody has authored yet shows as a gap
  // rather than as nothing. A page that simply omits Stage 2 reads exactly
  // like a Stage 2 that is finished, and this view exists to be read.
  expect(text).toContain('Stage 1')
  expect(text).toContain('Stage 2')
  expect(text).toContain('No pool authored yet')

  // A rate never appears without its draw count.
  expect(text).toMatch(/correct of \d+ drawn/)
  expect(text).toContain(slugsDrawn[0])
  expect(text).toContain('Korea')
  expect(text).toContain('Indonesia')
  expect(text).toMatch(/missed by \d+ of \d+/)
})

// ------------------------------------------------- a report belongs to a Stage

test('a Learner holds one report per Stage, and a second for the same Stage is refused', async () => {
  const email = freshLearner()

  // Two Stages, one Learner: the shape Stage 2 needs and the old unique
  // constraint on the address alone made impossible (#61).
  await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() })
  await testDb.insert(schema.reports).values({ email, stage: 2 })

  const held = await testDb.select().from(schema.reports).where(eq(schema.reports.email, email))
  expect(held.map((report) => report.stage).sort()).toEqual([1, 2])

  // Finality survives the split: submission is still once per Stage.
  await expect(testDb.insert(schema.reports).values({ email, stage: 1 })).rejects.toThrow()
})

test("the Findings library shows the Stages a reader has submitted, and withholds the ones they have not", async () => {
  const author = freshLearner()
  const stage1 = await submittedReport(author, [practicePage.defects[0].element])
  // A Stage 2 report by the same author. Its subject is unauthored, so the
  // element is arranged directly — what is under test is the gate, not the
  // page. This is exactly the record a Learner mid-way through Stage 2 must
  // not be able to read.
  const [stage2] = await testDb
    .insert(schema.reports)
    .values({ email: author, stage: 2, submittedAt: new Date() })
    .returning()
  const [laterFinding] = await testDb
    .insert(schema.findings)
    .values({
      reportId: stage2.id,
      element: 'a-stage-2-element',
      principle: 'contrast',
      description: 'Only a reader who has submitted Stage 2 may read this.',
      fix: 'Not yet.',
    })
    .returning()

  const [ownFinding] = await testDb.select().from(schema.findings).where(eq(schema.findings.reportId, stage1.id))

  // A reader who has submitted Stage 1 and not Stage 2.
  const reader = freshLearner()
  await submittedReport(reader, [practicePage.defects[1].element])
  const cookie = await sessionCookieFor(reader)

  const library = visibleText(await (await fetch(`${BASE_URL}/en/findings`, { headers: { cookie } })).text())
  expect(library).toContain(ownFinding.description)
  expect(library).not.toContain(laterFinding.description)

  // And not by its own address either — the shelf is a rendering, the gate is
  // the thing being tested.
  const direct = await fetch(`${BASE_URL}/en/findings/${laterFinding.id}`, { headers: { cookie }, redirect: 'manual' })
  expect(direct.status).toBeGreaterThanOrEqual(300)
  expect(direct.headers.get('location')).toContain('/en/audit')

  // The Stage they did submit is readable by the same route.
  const allowed = await fetch(`${BASE_URL}/en/findings/${ownFinding.id}`, { headers: { cookie } })
  expect(allowed.status).toBe(200)
})

test('the audit entry names the Stage the Learner is on', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)

  // Nothing submitted: the first Stage, which is where the work is.
  const first = await fetch(`${BASE_URL}/en/audit`, { headers: { cookie }, redirect: 'manual' })
  expect(first.headers.get('location')).toContain('/en/audit/1')

  // Stage 1 submitted: no longer bounced to a Stage they have closed.
  await testDb.insert(schema.reports).values({ email, stage: 1, submittedAt: new Date() })
  const next = await fetch(`${BASE_URL}/en/audit`, { headers: { cookie }, redirect: 'manual' })
  expect(next.headers.get('location')).toContain('/en/audit/2')
})

test('a declared Stage with no authored subject says so rather than rendering nothing', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)

  // Stage 3, the one still unauthored: Stage 2 gained its subject in #70, and
  // this state has to stay reachable while any Stage is still being written.
  const response = await fetch(`${BASE_URL}/en/audit/3`, { headers: { cookie } })
  const text = visibleText(await response.text())

  expect(response.status).toBe(200)
  expect(text).toContain('This Stage has no page to audit yet')
  // Which emptiness it is, not merely that it is empty.
  expect(text).toContain('still being written')
  // And not the locked message: the quizzes are not what is missing here.
  expect(text).not.toContain('unlocks once every Gate Quiz')
})

test('a Stage the curriculum does not declare is not an audit surface', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  for (const path of ['/en/audit/9', '/en/audit/nonsense']) {
    const response = await fetch(`${BASE_URL}${path}`, { headers: { cookie } })
    expect(response.status).toBe(404)
  }
})
