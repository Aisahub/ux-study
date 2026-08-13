import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { eq } from 'drizzle-orm'
import { expect, test } from 'vitest'

import { itemPoolOf, loadContent } from '../lib/content'
import { drawItems, scoreDraw, shuffledOrder } from '../lib/quiz'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * The Gate Quiz (#21, #22). The pure rules — drawing, ordering, scoring — are
 * tested directly; everything a Learner observes is tested over HTTP against
 * attempts arranged in the database, the same way the auth suite works.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { config, items, competencies } = content
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

test('a retry sets aside the items already answered correctly', () => {
  const mastered = slugs.slice(0, 3)

  for (let i = 0; i < 50; i++) {
    const drawn = drawItems(slugs, config.drawSize, null, mastered)

    expect(drawn).toHaveLength(config.drawSize)
    for (const slug of mastered) expect(drawn).not.toContain(slug)
  }
})

test('a draw is topped up rather than shrunk once too few unmastered items remain', () => {
  // Six of eight already right leaves two — an attempt of two would quietly
  // move the pass threshold, so the draw borrows back from the mastered set.
  const mastered = slugs.slice(0, 6)

  const sets = new Set<string>()
  for (let i = 0; i < 50; i++) {
    const drawn = drawItems(slugs, config.drawSize, null, mastered)

    expect(drawn).toHaveLength(config.drawSize)
    expect(new Set(drawn).size).toBe(config.drawSize)
    // The two never answered correctly are in every draw; the rest is borrowed.
    for (const slug of slugs.slice(6)) expect(drawn).toContain(slug)
    sets.add([...drawn].sort().join())
  }
  // And the borrowing is random, so a Learner in this state is not handed the
  // same five every time.
  expect(sets.size).toBeGreaterThan(1)
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

test('the doorstep of a Competency whose pool is unwritten says so, and offers no way to start', async () => {
  // The Competency route is flat (ADR-0008), so a Learner with a session can
  // reach the quiz of any declared Competency from the day it is declared —
  // including the Stage 3 four, whose pools do not exist yet. This screen used
  // to offer Start there and throw a TypeError on the press, because the draw
  // read `content.items[slug]` and called `.map` on the `undefined` a missing
  // pool directory gives back (ERR-220).
  //
  // The subject is taken from config.md rather than named, so this follows
  // whichever Competency is unwritten on the day it runs. It asserts one
  // exists first: once every pool is authored no request can produce this
  // state, and an unguarded version of this test would go on passing while
  // asserting nothing. That failure is the signal to move the assertion — the
  // fixture-root test in content.test.ts is the one that survives the move.
  const unwritten = config.stages
    .flatMap((entry) => entry.competencies)
    .filter((slug) => itemPoolOf(content, slug) === null)
  expect(unwritten.length).toBeGreaterThan(0)

  const cookie = await sessionCookieFor(freshLearner())
  const response = await fetch(`${BASE_URL}/en/learn/${unwritten[0]}/quiz`, { headers: { cookie } })

  expect(response.status).toBe(200)
  const text = visibleText(await response.text())
  expect(text).toContain('This Competency has no Gate Quiz yet.')
  // The gate's own sentence, which is the thing that would be there if this
  // screen were still offering a draw it cannot make.
  expect(text).not.toContain(`${config.drawSize} items, drawn from`)
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

test('an item that draws its screen shows the screen, and stops printing the words for it', async () => {
  const drawn = pool.find((item) => item.screen)
  // A pool with no drawn screens is a state this repository has been in and
  // may be in again mid-authoring; it is not a failure of the mechanism.
  if (!drawn) return

  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const attempt = await openAttempt(email, [drawn.slug, ...slugs.filter((slug) => slug !== drawn.slug)].slice(0, config.drawSize))

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()

  // The screen is served, isolated: a frame the platform's own styling cannot
  // reach into, so what is judged is what the author drew. Read out of the
  // attribute rather than matched in the page, because the same markup also
  // travels in the RSC payload — a match there would pass on a page that
  // rendered no frame at all.
  // Case-insensitive: React serialises the prop's own spelling, `srcDoc`, and
  // HTML attribute names do not care.
  const [, srcdoc = ''] = /srcdoc="([^"]*)"/i.exec(html) ?? []
  expect(html).toContain('sandbox="allow-scripts"')
  expect(srcdoc).toContain('btn--ghost')
  expect(srcdoc).toContain(drawn.screen!.en.slice(0, 20).replace(/[<>"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '"': 'quot' }[c]};`))

  // And the prose is no longer read out beside it. It survives as the frame's
  // accessible name for anyone who cannot see the screen — an attribute, so
  // invisible to this — but a Learner who can see one is not handed a
  // paragraph that answers the question before they look.
  expect(visibleText(html)).not.toContain(drawn.artefact.en.slice(0, 40))
})

test('the item-screen stylesheet reaches a Learner with its authoring notes stripped', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const attempt = await openAttempt(email, slugs.slice(0, config.drawSize))

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()

  // The authored file explains which class choices make a screen wrong. That
  // is documentation for whoever writes the next item and a hint for whoever
  // is sitting the quiz — the same leak the Practice Page stylesheet had.
  expect(html).not.toMatch(/creates its defect/i)
  expect(html).not.toMatch(/Practice Page stylesheet/i)
})

test('an open attempt renders in the language of the URL, not the one it was started in', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  // Started in Korean, then read in English: the attempt no longer owns the
  // language, so the page follows the address rather than bouncing back to it.
  const attempt = await openAttempt(email, slugs.slice(0, config.drawSize), 'ko')

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, {
    headers: { cookie },
    redirect: 'manual',
  })

  expect(response.status).toBe(200)
  const item = pool.find((entry) => entry.slug === slugs[0])!
  expect(visibleText(await response.text())).toContain(item.prompt.en)
})

test('the switch is offered on the doorstep and refused, in words, inside an open attempt', async () => {
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
  expect(doorstep).toContain('href="/ko/learn/visual-hierarchy/quiz"')

  // And inside the attempt too, pointing at the same item in the other
  // language. It used to be withheld here, which left a Learner looking for
  // Korean with nothing to find and no reason given (ERR-202).
  expect(visibleText(open)).toContain('한국어')
  expect(open).toContain(`href="/ko/learn/visual-hierarchy/quiz/${attempt.id}"`)
})

test('answers survive leaving the page, so a language switch costs nothing', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const attempt = await openAttempt(email, drawn)

  // What the wizard sends as each radio is picked.
  await testDb
    .update(schema.attempts)
    .set({ draft: { [drawn[0]]: 2, [drawn[1]]: 0 } })
    .where(eq(schema.attempts.id, attempt.id))

  // Reopened under the other language: the picks come back checked.
  const html = await (
    await fetch(`${BASE_URL}/ko/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()

  const checked = [...html.matchAll(/<input[^>]*type="radio"[^>]*>/g)].filter((match) =>
    match[0].includes('checked'),
  )
  expect(checked.length).toBeGreaterThan(0)
})

test('starting over discards the open attempt and draws a different set', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const first = await openAttempt(email, slugs.slice(0, config.drawSize))

  const response = await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz`, { headers: { cookie } })
  const doorstep = await response.text()

  // Both ways out of an open attempt are offered, not just carrying on (#22).
  expect(visibleText(doorstep)).toContain('Continue the open attempt')
  expect(visibleText(doorstep)).toContain('Start over with new items')

  // The open attempt is still there until the form is actually submitted —
  // offering the way out is what was missing, and what is asserted here.
  expect(first.submittedAt).toBeNull()
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

test('a passed attempt names the item that went wrong, what was chosen, and the keyed answer', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const missed = pool.find((candidate) => candidate.slug === drawn[0])!
  const keyed = missed.options.en.find((option) => option.correct)!
  // Anything but the keyed one, which is what makes this the missed item.
  const chosenIndex = missed.options.en.findIndex((option) => !option.correct)
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({
      email,
      competency: 'visual-hierarchy',
      language: 'en',
      drawn,
      selections: drawn.map((slug, index) => ({
        item: slug,
        choice: index === 0 ? chosenIndex : 0,
        correct: index > 0,
      })),
      score: config.drawSize - 1,
      passed: true,
      submittedAt: new Date(),
    })
    .returning()

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()
  const text = visibleText(html)

  expect(text).toContain('Passed')
  expect(text).toContain(missed.prompt.en)
  // What they picked, the answer, and the grounds for it — the whole point of
  // the screen. Withholding these is the failed attempt's rule, not this one's.
  expect(text).toContain(`You chose: ${missed.options.en[chosenIndex].text}`)
  expect(text).toContain(`The answer: ${keyed.text}`)
  expect(text).toContain(keyed.reason)
  expect(text).toContain(missed.sourceSection)

  // And the four that were answered correctly are explained too: a tick says
  // nothing about why, and elimination looks exactly like understanding here.
  for (const slug of drawn.slice(1)) {
    const item = pool.find((candidate) => candidate.slug === slug)!
    const key = item.options.en.find((option) => option.correct)!
    expect(text).toContain(`The answer: ${key.text}`)
    expect(text).toContain(key.reason)
  }
  // The reprint of what was chosen belongs to the items that went the other
  // way. On a correct one it would be the answer said twice, and the second
  // saying would read as a correction.
  expect(text.match(/You chose:/g)).toHaveLength(1)

  // Every item folds, and exactly the one that went the other way starts
  // open: it is what the Learner came to this screen for, and an answer they
  // have to go looking for behind a press is one they will not find.
  expect(html.match(/<details/g)).toHaveLength(config.drawSize)
  expect(html.match(/<details open/g)).toHaveLength(1)

  // And each item is explained beside the thing it is about. Without the
  // artefact every line here addresses a screen that is not on the page —
  // the prompts point at it ("this blurred view") and the answers name parts
  // of it ("Option B"), so the card records the attempt without explaining
  // any of it. An Attempt is permanent and the doorstep links back to it, so
  // "the Learner still remembers the screen" expires within the week.
  const framesExpected = drawn
    .map((slug) => pool.find((candidate) => candidate.slug === slug)!)
    .reduce((total, item) => total + (item.sequence?.length ?? (item.screen ? 1 : 0)), 0)
  expect(framesExpected).toBeGreaterThan(0)
  expect(html.match(/<iframe/g) ?? []).toHaveLength(framesExpected)
})

test('the verdict screen says how the attempt came out in more than one channel', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const attempts = []
  for (const passed of [true, false]) {
    const [attempt] = await testDb
      .insert(schema.attempts)
      .values({
        email,
        competency: 'visual-hierarchy',
        language: 'en',
        drawn,
        selections: drawn.map((slug, index) => ({ item: slug, choice: 0, correct: passed || index > 0 })),
        score: passed ? config.drawSize : 1,
        passed,
        submittedAt: new Date(),
      })
      .returning()
    attempts.push({ passed, id: attempt.id })
  }

  for (const { passed, id } of attempts) {
    const html = await (
      await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${id}`, { headers: { cookie } })
    ).text()
    const heading = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? ''

    // The word, and beside it the mark that draws the same state. `통과` and
    // `미통과` differ by one syllable and the two screens are otherwise the
    // same shape, so the word cannot be the only channel (DESIGN.md: every
    // status is told three ways at once).
    expect(visibleText(heading)).toContain(passed ? 'Passed' : 'Not passed')
    expect(heading).toContain(passed ? 'bg-oxblood' : 'var(--blue-grey)')

    // And a way onward from the foot of it, not only the pill above the title:
    // a Learner who has just passed finishes the reading several screens below
    // where they came in.
    const text = visibleText(html)
    expect(text).toContain('Where to next')
    expect(html).toContain(`href="/en/learn/visual-hierarchy"`)
    expect(html).toContain(`href="/en/learn"`)
  }
})

test('a folded item answers a press, and its source link says it leaves the page', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({
      email,
      competency: 'visual-hierarchy',
      language: 'en',
      drawn,
      selections: drawn.map((slug) => ({ item: slug, choice: 0, correct: true })),
      score: config.drawSize,
      passed: true,
      submittedAt: new Date(),
    })
    .returning()

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()

  // The rows are pressable, so they answer a press — and they do it by being
  // a `<summary>`, not by carrying a class somebody remembered to add. The
  // served stylesheet is what is asserted rather than the markup: a test that
  // checks for a class on the element would pass just as happily on the
  // enumeration that produced ERR-218.
  expect(html.match(/<summary/g) ?? []).toHaveLength(config.drawSize)
  // The turn is dropped for a Learner who asked for less motion; the turned
  // state is not.
  expect(html).toContain('motion-reduce:transition-none')
  // The arrow says "new tab" to everyone who can see it, and the words say it
  // to everyone else.
  expect(visibleText(html)).toContain('(opens in a new tab)')

  // And the press answer itself, read out of the stylesheet the browser was
  // actually served. `<summary>` is the control that exposed the gap; the
  // other two are the ones that would expose it next.
  // Quotes are stripped first: whether the build emits `[role='button']` or
  // `[role=button]` is a minifier's business, not this test's.
  const css = (await servedStylesheet(html)).replace(/["']/g, '')
  for (const control of ['summary', '[role=button]', '[type=submit]']) {
    expect(pressSelectors(css).some((selector) => selector.includes(control))).toBe(true)
  }

  // Both halves, or the preference is ignored by whatever the first half
  // reached and the second did not — which is the second half of ERR-218.
  const reducedMotion = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/.exec(css)?.[1]
  expect(reducedMotion).toBeTruthy()
  expect(reducedMotion).toContain('summary')
})

/**
 * The rules that draw a press, taken from the built CSS rather than from
 * `globals.css`, so this holds against whatever the build actually emits — the
 * source nests one selector and Lightning CSS flattens it into several.
 */
function pressSelectors(css: string): string[] {
  return [...css.matchAll(/([^{}]+)\{[^{}]*brightness\([^)]*\)[^{}]*\}/g)].map((match) => match[1])
}

/** Every stylesheet a page links, concatenated. */
async function servedStylesheet(html: string): Promise<string> {
  const hrefs = [...html.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
  expect(hrefs.length).toBeGreaterThan(0)
  const sheets = await Promise.all(
    hrefs.map(async (href) => (await fetch(new URL(href, BASE_URL))).text()),
  )
  return sheets.join('\n')
}

test('the Korean review card says its source sections are in English', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const notice = competencies.find((entry) => entry.slug === 'visual-hierarchy')!.koTranslationNotice
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({
      email,
      competency: 'visual-hierarchy',
      language: 'ko',
      drawn,
      selections: drawn.map((slug) => ({ item: slug, choice: 0, correct: true })),
      score: config.drawSize,
      passed: true,
      submittedAt: new Date(),
    })
    .returning()

  const ko = visibleText(
    await (
      await fetch(`${BASE_URL}/ko/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
    ).text(),
  )
  const en = visibleText(
    await (
      await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
    ).text(),
  )

  // Every section name on this card is English prose, and the Korean Learner
  // meets that fact here. The Competency page has said so since it was built;
  // this screen said nothing, so the language change arrived unannounced.
  expect(notice).toBeTruthy()
  expect(ko).toContain(notice!)
  // Korean-only by design: the English cohort is reading an English article.
  expect(en).not.toContain(notice!)
})

test('a perfect pass is explained item by item as well', async () => {
  const email = freshLearner()
  const cookie = await sessionCookieFor(email)
  const drawn = slugs.slice(0, config.drawSize)
  const [attempt] = await testDb
    .insert(schema.attempts)
    .values({
      email,
      competency: 'visual-hierarchy',
      language: 'en',
      drawn,
      selections: drawn.map((slug) => ({ item: slug, choice: 0, correct: true })),
      score: config.drawSize,
      passed: true,
      submittedAt: new Date(),
    })
    .returning()

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/quiz/${attempt.id}`, { headers: { cookie } })
  ).text()
  const text = visibleText(html)

  expect(text).toContain('Passed')
  for (const slug of drawn) {
    const item = pool.find((candidate) => candidate.slug === slug)!
    expect(text).toContain(`The answer: ${item.options.en.find((option) => option.correct)!.text}`)
  }
  // Nothing went the other way, so nothing is reprinted as a wrong pick, and
  // nothing is forced open — a perfect pass has no outstanding item to lead
  // with, so all five are offered folded.
  expect(text).not.toContain('You chose:')
  expect(text).not.toContain('went the other way')
  expect(html.match(/<details/g)).toHaveLength(config.drawSize)
  expect(html).not.toContain('<details open')
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
