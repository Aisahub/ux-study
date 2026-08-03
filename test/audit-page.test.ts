import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent, practicePageOf } from '../lib/content'
import { BASE_URL } from './config'
import { sessionCookieFor } from './db'

/**
 * The served Practice Page (#23). The authoring rules live in
 * practice-page.test.ts; these tests are about the serving: who may fetch it,
 * that it is the authored document with no platform chrome, and that no
 * response reveals where the defects are.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const practicePage = practicePageOf(content, 1)!
const flow = practicePageOf(content, 2)!

const IDENTIFIER = /data-element="([^"]+)"/g

test('the Practice Page is a Learner surface: unauthenticated requests are refused', async () => {
  for (const path of ['/en/audit/1/page', '/en/audit/1/page/source']) {
    const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' })

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toContain('/en/signin')
  }
})

test('each language serves its authored variant, whole, with nothing of the platform inside', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  for (const lang of ['en', 'ko'] as const) {
    const response = await fetch(`${BASE_URL}/${lang}/audit/1/page`, { headers: { cookie } })
    const html = await response.text()

    expect(response.status).toBe(200)
    // The authored document, not a platform page around it: the authored
    // title is present, the platform's switcher and shell are not.
    expect(html).toContain(lang === 'en' ? 'Mellow Beauty — Orders' : 'Mellow Beauty — 주문 관리')
    expect(html).not.toContain('__next')
    expect(html).not.toContain('English</a>')
    expect(html).not.toContain('한국어</a>')
    // The stylesheet arrived inline — a Learner sees the styled page, and
    // most Planted Defects live in the styling.
    expect(html).toContain('<style>')
  }
})

test('both language variants expose an identical set of selectable identifiers', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const en = await (await fetch(`${BASE_URL}/en/audit/1/page`, { headers: { cookie } })).text()
  const ko = await (await fetch(`${BASE_URL}/ko/audit/1/page`, { headers: { cookie } })).text()

  const identifiers = (html: string) => [...html.matchAll(IDENTIFIER)].map((match) => match[1]).sort()
  expect(identifiers(en)).toEqual(identifiers(ko))
  expect(identifiers(en).length).toBeGreaterThan(0)
})

test('the selection mechanism is served with the page and reports the element identifier', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const html = await (await fetch(`${BASE_URL}/en/audit/1/page`, { headers: { cookie } })).text()

  // The script that turns a click into a selection, and the message that
  // resolves a selection to its identifier for the audit surface (#24).
  expect(html).toContain("closest('[data-element]')")
  expect(html).toContain('element-selected')
})

test('no response reveals which elements carry a Planted Defect', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  // Every authored subject, not only Stage 1's: the withholding is the whole
  // point of the exercise, and a Stage that gained a subject without gaining
  // this check would leak its answer on the day it was authored.
  for (const subject of [practicePage, flow]) {
    for (const suffix of ['/page', '/page/source']) {
      for (const lang of ['en', 'ko'] as const) {
        const path = `/${lang}/audit/${subject.stage}${suffix}`
        const body = await (await fetch(`${BASE_URL}${path}`, { headers: { cookie } })).text()

        for (const defect of subject.defects) {
          expect(body, path).not.toContain(defect.slug)
          expect(body, path).not.toContain(defect.explanation.en.slice(0, 40))
          expect(body, path).not.toContain(defect.explanation.ko.slice(0, 40))
        }
        expect(body, path).not.toMatch(/defect|planted|결함/i)
      }
    }
  }
})

test('the page source is reachable and shows the authored markup and stylesheet as text', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const response = await fetch(`${BASE_URL}/en/audit/1/page/source`, { headers: { cookie } })

  expect(response.headers.get('content-type')).toContain('text/plain')
  const body = await response.text()
  expect(body).toContain('data-element=')
  expect(body).toContain('practice-page.css')
})

/**
 * Serving a subject that is walked rather than read (#70). Stage 1's Practice
 * Page is inert by design; Stage 2's must be operated, which is what makes its
 * defects visible at all, so the serving has one more thing to get right.
 */

test('the walkable subject arrives with its behaviour inlined and no relative link left behind', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  for (const lang of ['en', 'ko'] as const) {
    const html = await (await fetch(`${BASE_URL}/${lang}/audit/2/page`, { headers: { cookie } })).text()

    // The authored relative path could not resolve under this route's URL
    // shape; a subject served with a dead script link would be a page that
    // cannot be walked, which is every one of its defects made invisible.
    expect(html).not.toContain('src="./practice-page.js"')
    expect(html).toContain('data-step-label')
    expect(html).toContain("getElementById('step-indicator')")
  }
})

test('clicking names an element only while the subject says it is selecting', async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const html = await (await fetch(`${BASE_URL}/en/audit/2/page`, { headers: { cookie } })).text()

  // ADR-0010's two modes. The subject carries the control; the serving carries
  // the half that reads it — a click is spent on the flow unless the mode says
  // otherwise, and the audit tools are exempt from both.
  expect(html).toContain('data-audit-mode="operate"')
  expect(html).toContain("closest('[data-audit-chrome]')")
  expect(html).toContain("mode !== null && mode !== 'select'")
  // Preventing the default is not enough on a subject that has listeners of
  // its own: pointing at a control would otherwise also operate it.
  expect(html).toContain('event.stopPropagation()')
})

test("the walkable subject's source is published, behaviour included", async () => {
  const cookie = await sessionCookieFor('someone@aisahub.com')

  const body = await (await fetch(`${BASE_URL}/en/audit/2/page/source`, { headers: { cookie } })).text()

  // A Stage 2 defect is built out of behaviour, so markup and stylesheet alone
  // would publish none of the answer a Learner is invited to go and fix.
  expect(body).toContain('practice-page.css')
  expect(body).toContain('practice-page.js')
  expect(body).toContain('addEventListener')
})

