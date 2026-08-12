import { randomBytes } from 'node:crypto'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { competenciesOfStage, loadContent } from '../lib/content'
import { BASE_URL } from './config'
import { schema, sessionCookieFor, testDb } from './db'
import { visibleText } from './html'

/**
 * A Learner's own notes: written on a Competency, collected on one page.
 *
 * What is tested above all is that they are private. A note is the one thing
 * in this platform written for nobody — not comparable to a colleague's, not
 * counted, not read by a Maintainer — and that claim is made in the interface
 * copy, so it has to be true of the responses. Every test below that writes a
 * colleague's note asserts on its absence rather than trusting the query.
 *
 * The add and delete rules themselves live in server actions the browser
 * drives, as the audit suite's do; here the observable states are tested over
 * HTTP.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const { competencies, config } = content
const stage1 = competenciesOfStage(config, 1)

function freshLearner(): string {
  return `learner-${randomBytes(6).toString('hex')}@aisahub.com`
}

async function note(email: string, competency: string, body: string) {
  const [row] = await testDb.insert(schema.notes).values({ email, competency, body }).returning()
  return row
}

const nameOf = (slug: string) => competencies.find((entry) => entry.slug === slug)!.name.en

/**
 * The opening `<a …>` tag whose href is exactly this one, or `''` if the page
 * has no such link.
 *
 * Asserting on the tag rather than on a pattern spanning it, because the
 * attribute order in the output is the renderer's to choose — `<Link>` puts
 * `href` last — and a test that pins the order fails on a page that is right.
 */
function anchor(html: string, href: string): string {
  return html.match(new RegExp(`<a\\b[^>]*href="${href}"[^>]*>`))?.[0] ?? ''
}

// --------------------------------------------------- on the Competency's panel

test('a note written on a Competency is on that Competency and on no other', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', 'The eye lands on size before it lands on colour.')
  const cookie = await sessionCookieFor(email)

  const here = visibleText(
    await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy/notes`, { headers: { cookie } })).text(),
  )
  expect(here).toContain('The eye lands on size before it lands on colour.')
  expect(here).toContain('1 note')

  // A different Competency is a different notebook page, not a shared one.
  const elsewhere = visibleText(
    await (await fetch(`${BASE_URL}/en/learn/readability/notes`, { headers: { cookie } })).text(),
  )
  expect(elsewhere).not.toContain('The eye lands on size before it lands on colour.')
  expect(elsewhere).toContain('No notes on this Competency yet.')
})

test("a colleague's note on the same Competency is in nobody else's response", async () => {
  const mine = freshLearner()
  const theirs = freshLearner()
  await note(theirs, 'visual-hierarchy', 'A sentence only its author should ever read.')
  await note(mine, 'visual-hierarchy', 'Mine.')
  const cookie = await sessionCookieFor(mine)

  // The raw response, not the visible text: a note leaked into a hidden
  // attribute or into the streamed payload would still have left the server.
  const panel = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/notes`, { headers: { cookie } })
  ).text()
  expect(panel).not.toContain('A sentence only its author should ever read.')
  expect(panel).not.toContain(theirs)

  const all = await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text()
  expect(all).not.toContain('A sentence only its author should ever read.')
  expect(all).not.toContain(theirs)
  expect(visibleText(all)).toContain('Mine.')
})

test('a Maintainer reads their own notes and not a Learner\'s', async () => {
  const learner = freshLearner()
  const maintainer = freshLearner()
  await testDb
    .insert(schema.allowlist)
    .values({ pattern: maintainer, isMaintainer: true })
    .onConflictDoNothing()
  await note(learner, 'visual-hierarchy', 'Written by somebody being taught, not inspected.')
  const cookie = await sessionCookieFor(maintainer)

  // The flag opens the allowlist and the two dashboards. It does not open
  // anybody's notebook — there is no surface anywhere that reads this table
  // with an address other than the session's own.
  const all = await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text()
  expect(all).not.toContain('Written by somebody being taught, not inspected.')
  expect(visibleText(all)).toContain('Nothing written down yet.')
})

test('the taught panel is four steps ending at the gate, and carries no composer', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', 'Written on the other panel.')
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/en/learn/visual-hierarchy`, { headers: { cookie } })).text()
  const text = visibleText(html)

  // The Gate Quiz is the last of the four again, where it was before the notes
  // step briefly stood at 04. The order still is the layout: the article comes
  // before the gate that examines it.
  expect(text.indexOf('The source article')).toBeGreaterThan(-1)
  expect(text.indexOf('The final gate')).toBeGreaterThan(text.indexOf('The source article'))
  // Writing happens on the other panel, so nothing is written from here — and
  // the note itself is not restated here either.
  expect(html).not.toContain('name="body"')
  expect(text).not.toContain('Written on the other panel.')
})

test('both panels carry the switch, and each says which one is current', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', 'One.')
  await note(email, 'visual-hierarchy', 'Two.')
  const cookie = await sessionCookieFor(email)

  const material = '/en/learn/visual-hierarchy'
  const notes = '/en/learn/visual-hierarchy/notes'

  for (const [standing, other] of [
    [material, notes],
    [notes, material],
  ]) {
    const html = await (await fetch(`${BASE_URL}${standing}`, { headers: { cookie } })).text()

    // Both destinations are offered from both panels — a switch that dropped
    // the panel you are on would be a one-way door.
    expect(anchor(html, material)).not.toBe('')
    expect(anchor(html, notes)).not.toBe('')
    // `aria-current="page"` on the one you are standing on and on no other, so
    // a screen reader is told which panel this is. Not `role="tab"`: that role
    // promises arrow-key behaviour navigation does not have.
    expect(anchor(html, standing)).toContain('aria-current="page"')
    expect(anchor(html, other)).not.toContain('aria-current')
    expect(html).not.toContain('role="tab"')
    // The count rides the switch, so it is legible from the panel that does
    // not show the notes. It counts notes, never the Learner.
    expect(visibleText(html)).toContain('Your notes 2')
  }
})

test('switching language stays on the panel the Learner was reading', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/notes`, { headers: { cookie } })
  ).text()

  // Bilingual parity is a hard constraint, and this is the whole reason the
  // panel is a path segment rather than a `?tab=`: the switcher builds its
  // counterpart from the pathname, so a query string would have been dropped
  // on the way across and a Korean Learner would have landed on the material.
  expect(html).toContain('href="/ko/learn/visual-hierarchy/notes"')
})

// -------------------------------------------------------- the notes page

test('the notes page collects every note under its Competency, in programme order', async () => {
  const email = freshLearner()
  const [first, second] = stage1
  // Written in the reverse of the programme's order, so an assertion on the
  // rendered order cannot be satisfied by insertion order.
  await note(email, second, 'The second Competency, written first.')
  await note(email, first, 'The first Competency, written second.')
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text())

  expect(text).toContain('The second Competency, written first.')
  expect(text).toContain('The first Competency, written second.')
  expect(text.indexOf(nameOf(first))).toBeLessThan(text.indexOf(nameOf(second)))
  // Each group offers the way back to the lesson it belongs to.
  const html = await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text()
  expect(html).toContain(`href="/en/learn/${first}"`)
  expect(html).toContain(`href="/en/learn/${second}"`)
})

test('a Competency with no note is not a row on the notes page', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', 'Only this one.')
  const cookie = await sessionCookieFor(email)

  const text = visibleText(await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text())

  // The notebook is what was written, not a roll-call of the twelve — the
  // duplication that got My progress renamed and re-scoped (#54).
  expect(text).toContain(nameOf('visual-hierarchy'))
  for (const slug of stage1.filter((entry) => entry !== 'visual-hierarchy')) {
    expect(text).not.toContain(nameOf(slug))
  }
})

test('a Learner who has written nothing is told where notes are written', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const text = visibleText(await (await fetch(`${BASE_URL}/en/notes`, { headers: { cookie } })).text())

  // Unavailable is stated in words, and an empty page says what to do about
  // being empty rather than only that it is.
  expect(text).toContain('Nothing written down yet.')
  expect(text).toContain('Every Competency page has a place')
})

test('the notes page exists in Korean, saying the same thing', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', '한 줄만 남겨 둔다.')
  const cookie = await sessionCookieFor(email)

  const html = await (await fetch(`${BASE_URL}/ko/notes`, { headers: { cookie } })).text()
  const text = visibleText(html)

  // Parity is a hard constraint: no page exists in one language only, and the
  // lang attribute has to be truthful because a screen reader picks a voice
  // from it.
  expect(html).toContain('lang="ko"')
  expect(text).toContain('내 메모')
  expect(text).toContain('한 줄만 남겨 둔다.')
  expect(text).toContain('메모 1개')
})

// ------------------------------------------------------------ the way in

test('the notebook is reached from My page and from the lesson, and is not a seventh navigation mark', async () => {
  const email = freshLearner()
  await note(email, 'visual-hierarchy', 'One.')
  await note(email, 'readability', 'Two.')
  const cookie = await sessionCookieFor(email)

  const me = await (await fetch(`${BASE_URL}/en/me`, { headers: { cookie } })).text()
  expect(me).toContain('href="/en/notes"')
  // Counted, and the count is of notes rather than of the person: nothing on
  // this page totals a Learner, which PRODUCT.md rules out.
  expect(visibleText(me)).toContain('2 notes')

  const lesson = await (
    await fetch(`${BASE_URL}/en/learn/visual-hierarchy/notes`, { headers: { cookie } })
  ).text()
  expect(lesson).toContain('href="/en/notes"')

  // Not in the shell. The bottom bar is full at six marks — what a Maintainer
  // already carries — and a seventh puts every target on a 320px screen under
  // the 44px this platform teaches.
  const shell = lesson.slice(0, lesson.indexOf('<main')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  expect(shell).not.toContain('href="/en/notes"')
})
