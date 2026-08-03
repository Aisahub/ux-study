import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { expect, test } from 'vitest'

import { loadContent } from '../lib/content'

/**
 * Stage 1 authoring rules for the Competency definitions (#14) — what the spec
 * demands of the real content beyond the structural validity the loader
 * enforces. Same pattern as practice-page.test.ts: these read the loaded
 * content directly, because the rules are about the authored files, not about
 * anything a visitor can observe over HTTP yet.
 */

const { config, competencies, glossary, briefs, items } = loadContent(join(__dirname, '..', 'content'))

test('every Competency the curriculum declares is authored', () => {
  // This was Stage 1's list alone while the later Stages were declared and
  // unwritten. #72 authored the last of them, so the whole curriculum can be
  // held to it — and a Competency added to config.md from now on fails here
  // until somebody writes it, rather than being declared and forgotten.
  const authored = new Set(competencies.map((competency) => competency.slug))
  const declared = config.stages.flatMap((entry) => entry.competencies)
  expect(declared.filter((slug: string) => !authored.has(slug))).toEqual([])
})

test('every Competency has at least one Principle a Finding could cite', () => {
  // A Competency with no Glossary entry naming it is a Competency a Learner
  // cannot write a Finding against: a Finding selects its Principle from the
  // Glossary (CONTEXT.md), so an empty list leaves them nothing to select.
  for (const competency of competencies) {
    const cited = glossary.filter((entry) => entry.competencies.includes(competency.slug))
    expect(cited.map((entry) => entry.slug), competency.slug).not.toEqual([])
  }
})

test('each Competency carries two or three pre-reading questions', () => {
  for (const competency of competencies) {
    expect(competency.preReadingQuestions.length, competency.slug).toBeGreaterThanOrEqual(2)
    expect(competency.preReadingQuestions.length, competency.slug).toBeLessThanOrEqual(3)
  }
})

test('each Competency cites its source article on nngroup.com with attribution', () => {
  for (const competency of competencies) {
    expect(competency.source.url, competency.slug).toMatch(/^https:\/\/www\.nngroup\.com\/articles\//)
    expect(competency.source.attribution, competency.slug).toContain('Nielsen Norman Group')
  }
})

test('the browser-translation notice is Korean-only: present, and not an en/ko pair', () => {
  for (const competency of competencies) {
    expect(competency.koTranslationNotice, competency.slug).toBeTruthy()
    // A single Korean string by design — an English counterpart would
    // contradict user story 24 in the spec (#1): an English-speaking Learner
    // is never told to translate anything.
    const noticeKeys = Object.keys(competency.frontmatter).filter((key) => /notice/i.test(key))
    expect(noticeKeys, competency.slug).toEqual(['koTranslationNotice'])
  }
})

/**
 * The Avoid lists in CONTEXT.md are about what a word is used to *name*: "test"
 * is wrong as a name for a Gate Quiz, and right inside "Usability (User)
 * Testing 101", which is a cited article title and this project's name for
 * nothing. So the words below are only the ones with no legitimate second
 * referent anywhere in Learner-facing copy.
 *
 * `test`, `question`, `bug`, `admin` and `assessment` are deliberately absent:
 * each has a lawful use here — the `testing-with-real-users` Competency names a
 * UX research practice, pre-reading questions are questions — and banning the
 * string would fail on correct copy while still not catching the mistake that
 * matters, which is calling a *Gate Quiz* a test. That one is caught by review,
 * not by this test, and pretending otherwise is what a green check nobody can
 * fail looks like.
 */
const NAMES_NOTHING_HERE: Record<string, string[]> = {
  student: ['학생'],
  trainee: [],
  grader: ['채점자'],
  instructor: [],
  homework: ['숙제'],
}

test('every word this file bans is one CONTEXT.md actually lists', () => {
  // The list above is a hand-picked subset, which is the shape that goes stale
  // silently: CONTEXT.md could drop a term tomorrow and this file would go on
  // enforcing it with nobody told. Naming what survives rather than trusting
  // the copy — the words are checked back against their source, and a subset
  // that has drifted off it fails here instead of quietly outliving it.
  const context = readFileSync(join(__dirname, '..', 'CONTEXT.md'), 'utf8')
  const avoided = new Set(
    [...context.matchAll(/^_Avoid_: (.+)$/gm)].flatMap((match) =>
      match[1].split(',').map((word) => word.trim().replace(/ \(.*$/, '').toLowerCase()),
    ),
  )
  expect(Object.keys(NAMES_NOTHING_HERE).filter((word) => !avoided.has(word))).toEqual([])
})

test('Learner-facing copy avoids the words CONTEXT.md rules out', () => {
  const copy: [string, string][] = [
    ...competencies.flatMap((competency): [string, string][] => [
      [`${competency.slug} name`, `${competency.name.en} ${competency.name.ko}`],
      [`${competency.slug} objective`, `${competency.objective.en} ${competency.objective.ko}`],
      ...(['developer', 'pm'] as const).map((role): [string, string] => [
        `${competency.slug} roleHint.${role}`,
        `${competency.roleHint[role].en} ${competency.roleHint[role].ko}`,
      ]),
      ...competency.preReadingQuestions.map((question, index): [string, string] => [
        `${competency.slug} preReadingQuestions[${index}]`,
        `${question.en} ${question.ko}`,
      ]),
    ]),
    // `source.attribution` is excluded on purpose: it reproduces an author and
    // a title we do not get to reword.
    ...glossary.flatMap((entry): [string, string][] => [
      [`${entry.slug} name`, `${entry.name.en} ${entry.name.ko}`],
      [`${entry.slug} definition`, `${entry.definition.en} ${entry.definition.ko}`],
      [`${entry.slug} justification`, `${entry.justification.en} ${entry.justification.ko}`],
    ]),
    // The briefs and the item pools were outside this scan until ERR-214,
    // which is how "설명은 채점자가 아니라…" reached the Self-Audit brief — a
    // grader, in a programme whose Maintainer judges nothing. The check was
    // right and pointed at two of the four surfaces a Learner reads.
    ...briefs.map((brief): [string, string] => [`brief ${brief.slug}`, JSON.stringify(brief.frontmatter)]),
    // Screens are excluded, as everywhere else: their copy is the defective
    // specimen a Learner judges, and a fictional product may lawfully call
    // somebody a 학생 on a screen about a school.
    ...Object.values(items)
      .flat()
      .flatMap((item): [string, string][] => [
        [`${item.slug} artefact`, `${item.artefact.en} ${item.artefact.ko}`],
        [`${item.slug} prompt`, `${item.prompt.en} ${item.prompt.ko}`],
        ...(['en', 'ko'] as const).flatMap((lang) =>
          item.options[lang].map((option, index): [string, string] => [
            `${item.slug} options.${lang}[${index}]`,
            `${option.text} ${option.reason}`,
          ]),
        ),
      ]),
  ]

  for (const [where, text] of copy) {
    const found = Object.entries(NAMES_NOTHING_HERE).flatMap(([word, korean]) => [
      // Word-bounded for the English: unanchored, "grader" matches "upgrader"
      // and the failure names a word that is not on the page. Hangul is not a
      // regex word character, so `\b` around a Korean term matches nothing at
      // all — those are looked for as plain substrings, which is what Korean
      // needs anyway, since it does not space its particles off the noun.
      ...(new RegExp(`\\b${word}\\b`, 'i').test(text) ? [word] : []),
      ...korean.filter((term) => text.includes(term)),
    ])
    expect(found, where).toEqual([])
  }
})

test('every explanation field is present, and at most one is filled (the #29 trial)', () => {
  for (const competency of competencies) {
    expect(competency.frontmatter, competency.slug).toHaveProperty('explanation')
  }
  const filled = competencies.filter((competency) => competency.explanation !== null)
  expect(filled.length).toBeLessThanOrEqual(1)
})
