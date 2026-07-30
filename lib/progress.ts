import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { cache } from 'react'

import { db, schema } from '@/db'
import { content } from '@/lib/server-content'

/**
 * Where a Learner stands, derived on demand from attempt and report records
 * (ADR-0005): there is no stored status anywhere, so this cannot drift from
 * what actually happened.
 */

export type QuizStatus = 'unstarted' | 'in-progress' | 'passed'

/**
 * Where a Learner stands **in one Stage**. Deliberately not summed across
 * Stages: a single figure spanning the programme would be the cumulative
 * per-person score PRODUCT.md rules out. Three Stages produce three statements
 * of position, and a Learner is never told a number that ranks the whole of
 * them.
 */
export interface StageProgress {
  stage: number
  /** Keyed by Competency slug, in this Stage's display order. */
  quizzes: Record<string, { status: QuizStatus; attempts: number }>
  reportSubmitted: boolean
  /** Every Gate Quiz in this Stage passed — what unlocks its Self-Audit Report (#24). */
  allPassed: boolean
  /** Steps done of stepsTotal: this Stage's quizzes and its capstone report, so remaining work needs no arithmetic. */
  stepsDone: number
  stepsTotal: number
}

export interface Progress {
  /** One entry per Stage config.md declares, in Stage order. */
  stages: StageProgress[]
}

/**
 * One Stage's standing. Throws rather than returning undefined: the Stages are
 * the ones config.md declares, so asking for one it does not declare is a
 * mistake in the caller, not something a Learner can cause.
 */
export function stageProgress(progress: Progress, stage: number): StageProgress {
  const found = progress.stages.find((entry) => entry.stage === stage)
  if (!found) throw new Error(`no Stage ${stage} is declared in config.md`)
  return found
}

/**
 * This Learner's report rows — at most one per Stage (#61), in Stage order.
 *
 * Wrapped in React's `cache` because two independent server components want
 * them on the same render: the page, to place the capstone, and the navigation,
 * to decide whether the Findings library is reachable yet. They cannot see each
 * other, and every Learner surface is `force-dynamic`, so without this the
 * table is read twice on every request for the length of the programme.
 *
 * All of a Learner's rows in one read rather than one query per Stage: there
 * are three of them at most, and asking per Stage would put the round trips
 * back that the cache exists to remove.
 */
export const reportsFor = cache(async (email: string) => {
  const rows = await db.select().from(schema.reports).where(eq(schema.reports.email, email))
  return rows.sort((a, b) => a.stage - b.stage)
})

/** This Learner's report for one Stage, or null before they have started it. */
export async function reportFor(email: string, stage: number) {
  const rows = await reportsFor(email)
  return rows.find((row) => row.stage === stage) ?? null
}

/** One finished attempt, as My page lists it (#54). */
export interface AttemptRecord {
  id: number
  competency: string
  submittedAt: Date
  /** Correct answers, and how many items were drawn for that attempt. */
  score: number
  drawn: number
}

/**
 * This Learner's finished attempts, newest first.
 *
 * The Learn overview counts these ("2 attempts"); this says which two. That is
 * the whole reason My page reads the table separately rather than reusing
 * `progressFor` — the two surfaces want different questions answered, and
 * folding them together would put the count back on both pages.
 *
 * Only submitted rows. An attempt that is still open has no score and no
 * verdict, and a Learner mid-quiz is not looking at their history anyway; it
 * would also be the one row here that could change while being read.
 *
 * The item slugs and the per-item correctness live on these rows and are
 * deliberately not selected. A retry draws from the same pool, so naming the
 * items a Learner missed hands them the key that #22 keeps on the server.
 */
export async function attemptHistoryFor(email: string): Promise<AttemptRecord[]> {
  const rows = await db
    .select({
      id: schema.attempts.id,
      competency: schema.attempts.competency,
      submittedAt: schema.attempts.submittedAt,
      score: schema.attempts.score,
      drawn: schema.attempts.drawn,
    })
    .from(schema.attempts)
    .where(and(eq(schema.attempts.email, email), isNotNull(schema.attempts.submittedAt)))
    .orderBy(desc(schema.attempts.submittedAt))

  return rows.map((row) => ({
    id: row.id,
    competency: row.competency,
    // Both non-null in practice: the filter above is exactly the condition
    // under which scoring wrote them, in the same statement (#22).
    submittedAt: row.submittedAt!,
    score: row.score ?? 0,
    drawn: row.drawn.length,
  }))
}

export async function progressFor(email: string): Promise<Progress> {
  const rows = await db
    .select({ competency: schema.attempts.competency, passed: schema.attempts.passed })
    .from(schema.attempts)
    .where(eq(schema.attempts.email, email))
  const reports = await reportsFor(email)

  const stages = content.config.stages.map(({ stage, competencies }): StageProgress => {
    const quizzes: StageProgress['quizzes'] = {}
    for (const slug of competencies) {
      const own = rows.filter((row) => row.competency === slug)
      const passed = own.some((row) => row.passed === true)
      quizzes[slug] = {
        status: passed ? 'passed' : own.length > 0 ? 'in-progress' : 'unstarted',
        attempts: own.length,
      }
    }

    // This Stage's own report, submitted. Completion is submission and not
    // approval: nobody grades a Self-Audit Report, and a Stage that waited on
    // someone's verdict would stop being self-paced (ADR-0005).
    const reportSubmitted = reports.some((row) => row.stage === stage && row.submittedAt != null)
    const stepsDone =
      Object.values(quizzes).filter((quiz) => quiz.status === 'passed').length + (reportSubmitted ? 1 : 0)

    return {
      stage,
      quizzes,
      reportSubmitted,
      allPassed: competencies.every((slug) => quizzes[slug].status === 'passed'),
      stepsDone,
      stepsTotal: competencies.length + 1,
    }
  })

  return { stages }
}

/** True once this Learner has both passed every Gate Quiz in a Stage and submitted its report — that Stage's Completion (#24). */
export function isComplete(stage: StageProgress): boolean {
  return stage.allPassed && stage.reportSubmitted
}
