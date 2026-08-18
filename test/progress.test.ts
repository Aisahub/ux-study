import { describe, expect, it } from 'vitest'

import {
  capstoneState,
  completionPercent,
  stageState,
  stageStandingIn,
  stageToAudit,
  type Progress,
  type StageProgress,
} from '@/lib/progress'

/**
 * What a Stage's standing means, asked of the module rather than of a rendered
 * page.
 *
 * These answers used to be derived on each surface that showed them, so the
 * only thing watching them was an assertion on an English sentence fetched over
 * HTTP (`surfaces.test.ts`). They are arithmetic over a record, and this is
 * what testing arithmetic costs when it is reachable (#128).
 */

function stageOf(overrides: Partial<StageProgress> = {}): StageProgress {
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

const progressOf = (...stages: StageProgress[]): Progress => ({ stages })

describe('stageState', () => {
  it('is unstarted before anything is done', () => {
    expect(stageState(stageOf())).toBe('unstarted')
  })

  it('is in-progress on one passed quiz', () => {
    expect(stageState(stageOf({ stepsDone: 1 }))).toBe('in-progress')
  })

  it('is still in-progress with every quiz passed and no report', () => {
    expect(stageState(stageOf({ allPassed: true, stepsDone: 4 }))).toBe('in-progress')
  })

  it('is complete only once the report is submitted too', () => {
    expect(stageState(stageOf({ allPassed: true, reportSubmitted: true, stepsDone: 5 }))).toBe('complete')
  })
})

describe('capstoneState', () => {
  it('is locked while a Gate Quiz is outstanding', () => {
    expect(capstoneState(stageOf({ stepsDone: 3 }))).toBe('locked')
  })

  it('is open once every Gate Quiz in the Stage is passed', () => {
    expect(capstoneState(stageOf({ allPassed: true, stepsDone: 4 }))).toBe('open')
  })

  it('is submitted once the report is in', () => {
    expect(capstoneState(stageOf({ allPassed: true, reportSubmitted: true, stepsDone: 5 }))).toBe('submitted')
  })
})

describe('completionPercent', () => {
  it('is 0 for a Stage with no steps rather than dividing by zero', () => {
    expect(completionPercent(stageOf({ stepsTotal: 0 }))).toBe(0)
  })

  it('rounds to a whole percent', () => {
    expect(completionPercent(stageOf({ stepsDone: 1, stepsTotal: 3 }))).toBe(33)
  })

  it('clamps at 100 when more steps are done than the Stage now declares', () => {
    expect(completionPercent(stageOf({ stepsDone: 6, stepsTotal: 5 }))).toBe(100)
  })
})

describe('stageStandingIn', () => {
  it('is the earliest Stage that is not complete', () => {
    const done = stageOf({ stage: 1, allPassed: true, reportSubmitted: true, stepsDone: 5 })
    const open = stageOf({ stage: 2 })
    expect(stageStandingIn(progressOf(done, open, stageOf({ stage: 3 }))).stage).toBe(2)
  })

  it('is the last Stage once every Stage is complete', () => {
    const complete = (stage: number) =>
      stageOf({ stage, allPassed: true, reportSubmitted: true, stepsDone: 5 })
    expect(stageStandingIn(progressOf(complete(1), complete(2), complete(3))).stage).toBe(3)
  })

  it('keeps a Learner in a Stage whose quizzes are passed and whose report is not written', () => {
    const passedNoReport = stageOf({ stage: 1, allPassed: true, stepsDone: 4 })
    expect(stageStandingIn(progressOf(passedNoReport, stageOf({ stage: 2 }))).stage).toBe(1)
  })
})

describe('stageToAudit', () => {
  it('is the earliest Stage without a submitted report', () => {
    const submitted = stageOf({ stage: 1, allPassed: true, reportSubmitted: true, stepsDone: 5 })
    expect(stageToAudit(progressOf(submitted, stageOf({ stage: 2 })))).toBe(2)
  })

  it('is the last declared Stage once every report is in', () => {
    const submitted = (stage: number) =>
      stageOf({ stage, allPassed: true, reportSubmitted: true, stepsDone: 5 })
    expect(stageToAudit(progressOf(submitted(1), submitted(2), submitted(3)))).toBe(3)
  })

  it('agrees with stageStandingIn for as long as a submitted report implies a passed Stage', () => {
    // The two ask different questions and are kept apart for that reason, but
    // they cannot disagree while submitting a report requires the Stage's
    // quizzes to be passed first (#24) and a passed quiz never un-passes. The
    // arrangement that would separate them — a report in, its quizzes not
    // passed — is the one this pins as unreachable.
    const arrangements: Progress[] = [
      progressOf(stageOf({ stage: 1 }), stageOf({ stage: 2 })),
      progressOf(stageOf({ stage: 1, allPassed: true, stepsDone: 4 }), stageOf({ stage: 2 })),
      progressOf(
        stageOf({ stage: 1, allPassed: true, reportSubmitted: true, stepsDone: 5 }),
        stageOf({ stage: 2, stepsDone: 1 }),
      ),
    ]
    for (const progress of arrangements) {
      expect(stageToAudit(progress)).toBe(stageStandingIn(progress).stage)
    }
  })
})
