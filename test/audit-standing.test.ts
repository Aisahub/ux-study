import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { auditStandingFrom } from '@/lib/audit'
import { briefOf, loadContent, practicePageOf } from '@/lib/content'
import { type StageProgress } from '@/lib/progress'

/**
 * The order the three refusals are asked in (#61, #130).
 *
 * The order is the rule: a Stage with nothing to audit says so before it says
 * anything about quizzes, because "come back when you have passed these" is the
 * wrong sentence for a Stage whose subject nobody has written yet. Until this
 * module existed the order was `if`/`return` inside a JSX file and could only
 * be checked by fetching a rendered page and matching an English sentence in it.
 *
 * The subject and the brief here are the authored ones rather than stand-ins:
 * the shapes are the real shapes, and only the standing varies.
 */

const content = loadContent(join(__dirname, '..', 'content'))
const subject = practicePageOf(content, 1)!
const brief = briefOf(content, 1)!

function progressOf(overrides: Partial<StageProgress> = {}): StageProgress {
  return {
    stage: 1,
    quizzes: {},
    reportSubmitted: false,
    allPassed: false,
    stepsDone: 0,
    stepsTotal: 5,
    ...overrides,
  }
}

const passed = progressOf({ allPassed: true, stepsDone: 4 })

describe('auditStandingFrom', () => {
  it('says there is nothing to audit before it says anything about quizzes', () => {
    // Both refusals apply here — no subject, and no quiz passed. The Stage's
    // own absence wins, because the Learner has nothing to come back to.
    const standing = auditStandingFrom(null, brief, progressOf())
    expect(standing.state).toBe('no-subject')
  })

  it('keeps the brief on the no-subject screen, which prints its title', () => {
    const standing = auditStandingFrom(null, brief, progressOf())
    expect(standing.brief).toBe(brief)
  })

  it('tolerates a Stage that has neither a subject nor a brief', () => {
    const standing = auditStandingFrom(null, null, progressOf())
    expect(standing).toEqual({ state: 'no-subject', subject: null, brief: null })
  })

  it('is locked while a Gate Quiz in the Stage is outstanding', () => {
    const standing = auditStandingFrom(subject, brief, progressOf({ stepsDone: 3 }))
    expect(standing.state).toBe('locked')
  })

  it('reports a missing brief only once the quizzes are behind the Learner', () => {
    // The other way round would tell someone their instructions are unwritten
    // when what is actually in front of them is a quiz.
    expect(auditStandingFrom(subject, null, progressOf()).state).toBe('locked')
    expect(auditStandingFrom(subject, null, passed).state).toBe('no-brief')
  })

  it('is open when the subject, the passed quizzes and the brief are all there', () => {
    const standing = auditStandingFrom(subject, brief, passed)
    expect(standing).toEqual({ state: 'open', subject, brief })
  })

  it('stays open after the report is submitted, which is where the reveal is read', () => {
    const submitted = progressOf({ allPassed: true, reportSubmitted: true, stepsDone: 5 })
    expect(auditStandingFrom(subject, brief, submitted).state).toBe('open')
  })
})
