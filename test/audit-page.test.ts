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

const practicePage = practicePageOf(loadContent(join(__dirname, '..', 'content')), 1)!

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

  for (const path of ['/en/audit/1/page', '/ko/audit/1/page', '/en/audit/1/page/source']) {
    const body = await (await fetch(`${BASE_URL}${path}`, { headers: { cookie } })).text()

    for (const defect of practicePage.defects) {
      expect(body).not.toContain(defect.slug)
      expect(body).not.toContain(defect.explanation.en.slice(0, 40))
      expect(body).not.toContain(defect.explanation.ko.slice(0, 40))
    }
    expect(body).not.toMatch(/defect|planted|결함/i)
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
