import { expect, test } from 'vitest'

import { BASE_URL } from './config'
import { visibleText } from './html'
import { counterpartPath, guessLanguage } from '../lib/language'

/**
 * ADR-0008: every page carries its language in the path, so a pasted link
 * opens the same page for whoever receives it.
 *
 * These drive the real application over HTTP, following the convention set in
 * skeleton.test.ts — what a visitor observes, not which function ran. The
 * counterpart mapping is the exception: it is asserted directly as well,
 * because the routes it must survive (a quiz item, the practice page) do not
 * exist yet and the failure it guards against — landing on a section root —
 * would be worst on exactly those deep pages.
 */

async function get(path: string, headers: Record<string, string> = {}) {
  return fetch(`${BASE_URL}${path}`, { headers, redirect: 'manual' })
}

function setCookies(response: Response): string[] {
  return response.headers.getSetCookie()
}

test('the root guesses Korean from Accept-Language', async () => {
  const response = await get('/', { 'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8' })

  expect(response.status).toBeGreaterThanOrEqual(300)
  expect(response.status).toBeLessThan(400)
  expect(response.headers.get('location')).toMatch(/\/ko$/)
})

test('the root guesses English from Accept-Language', async () => {
  const response = await get('/', { 'Accept-Language': 'en-GB,en;q=0.9' })

  expect(response.headers.get('location')).toMatch(/\/en$/)
})

test('a language we do not publish falls back to English', async () => {
  // The Indonesia cohort works in English (ADR-0002); an Indonesian browser
  // must not land somewhere it cannot read.
  const response = await get('/', { 'Accept-Language': 'id-ID,id;q=0.9' })

  expect(response.headers.get('location')).toMatch(/\/en$/)
})

test('a saved preference wins over the Accept-Language guess', async () => {
  const response = await get('/', { 'Accept-Language': 'en-US,en;q=0.9', cookie: 'lang=ko' })

  expect(response.headers.get('location')).toMatch(/\/ko$/)
})

test('each language segment serves its own page', async () => {
  const korean = await get('/ko')
  const english = await get('/en')

  expect(korean.status).toBe(200)
  expect(english.status).toBe(200)

  const koreanHtml = await korean.text()
  const englishHtml = await english.text()

  expect(koreanHtml).toContain('<html lang="ko"')
  expect(englishHtml).toContain('<html lang="en"')
  expect(visibleText(koreanHtml)).not.toEqual(visibleText(englishHtml))
})

test('visiting a language saves it as the preference, so the next visit to the root lands there', async () => {
  const visit = await get('/ko')

  expect(setCookies(visit).join(';')).toMatch(/lang=ko/)

  const root = await get('/', { 'Accept-Language': 'en-US', cookie: 'lang=ko' })

  expect(root.headers.get('location')).toMatch(/\/ko$/)
})

test('a preference outlives the browser session', async () => {
  const cookie = setCookies(await get('/ko')).find((value) => value.startsWith('lang='))

  // A cookie with no expiry dies when the browser closes, which would make the
  // preference something a Learner re-sets every morning.
  expect(cookie).toBeDefined()
  expect(cookie).toMatch(/max-age=\d{6,}/i)
})

test('each page offers the switcher, pointing at its own counterpart', async () => {
  const korean = await get('/ko')
  const english = await get('/en')

  expect(await korean.text()).toMatch(/href="\/en"/)
  expect(await english.text()).toMatch(/href="\/ko"/)
})

test('a language we do not publish is not a page', async () => {
  const response = await get('/fr')

  expect(response.status).toBe(404)
})

test('the switcher lands on the counterpart of a deep page, never on a section root', () => {
  expect(counterpartPath('/ko/learn/visual-hierarchy', 'en')).toBe('/en/learn/visual-hierarchy')
  expect(counterpartPath('/en/audit/page', 'ko')).toBe('/ko/audit/page')
  expect(counterpartPath('/en/quiz/readability/attempt/7', 'ko')).toBe('/ko/quiz/readability/attempt/7')
  expect(counterpartPath('/ko', 'en')).toBe('/en')
  expect(counterpartPath('/', 'ko')).toBe('/ko')
})

test('the guess reads the quality values rather than the first entry it sees', () => {
  expect(guessLanguage('en;q=0.5,ko;q=0.9')).toBe('ko')
  expect(guessLanguage('ko;q=0.2,en;q=0.8')).toBe('en')
  expect(guessLanguage(null)).toBe('en')
  expect(guessLanguage('')).toBe('en')
})
