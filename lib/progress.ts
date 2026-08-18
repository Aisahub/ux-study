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

/**
 * A Stage's own state, which is deliberately not a QuizStatus: a Stage is
 * complete when every Gate Quiz in it is passed *and* its report is submitted.
 * Sharing one vocabulary would let a Stage read `passed` with its capstone
 * still outstanding.
 */
export type StageState = 'unstarted' | 'in-progress' | 'complete'

export function stageState(stage: StageProgress): StageState {
  if (isComplete(stage)) return 'complete'
  return stage.stepsDone > 0 ? 'in-progress' : 'unstarted'
}

/**
 * Where a Stage's Self-Audit Report stands, as one word instead of the two
 * booleans it is derived from.
 *
 * `submitted` outranks `open` because a submitted report is also an unlocked
 * one — the Stage's quizzes were passed before it could be written (#24), and
 * a passed quiz never un-passes. Asking the booleans in the other order would
 * report a submitted report as merely open.
 */
export type CapstoneState = 'locked' | 'open' | 'submitted'

export function capstoneState(stage: StageProgress): CapstoneState {
  if (stage.reportSubmitted) return 'submitted'
  return stage.allPassed ? 'open' : 'locked'
}

/**
 * How far through one Stage, as a whole percent of its steps.
 *
 * Clamped because the arithmetic is over records rather than over a fixed
 * plan: `stepsTotal` comes from what config.md declares now, and a Stage that
 * lost a Competency after a Learner passed it would otherwise read past 100.
 */
export function completionPercent(stage: StageProgress): number {
  if (stage.stepsTotal === 0) return 0
  return Math.min(100, Math.round((stage.stepsDone / stage.stepsTotal) * 100))
}

/**
 * The Stage a Learner is standing in: the earliest not complete, or the last
 * where every Stage is done.
 *
 * This is the Learn overview's question — "what now" — and the bar counts this
 * Stage and names it, because a bar counting a Stage closed months ago answers
 * nothing.
 *
 * Kept apart from `stageToAudit` although the two cannot currently disagree:
 * that they agree is a consequence of submission requiring a passed Stage
 * (#24), not of their being one question. This one asks what a Learner should
 * do next; that one asks which report they still owe. Folding them together
 * would make the next change to either gate silently move both.
 */
export function stageStandingIn(progress: Progress): StageProgress {
  return progress.stages.find((entry) => !isComplete(entry)) ?? progress.stages[progress.stages.length - 1]
}

/**
 * The Stage the audit entry sends a Learner to: the earliest without a
 * submitted report, or the last declared once all three are in.
 *
 * Only the report is asked about, not the quizzes: this surface's job is to
 * put a Learner in front of the report they still owe, and the locked screen
 * on the other side is what says the quizzes come first (#61).
 */
export function stageToAudit(progress: Progress): number {
  const unfinished = progress.stages.find((entry) => !entry.reportSubmitted)
  return unfinished?.stage ?? progress.stages[progress.stages.length - 1].stage
}

/**
 * The furthest report a Learner has, which is the one they are living in: a
 * Stage 2 draft is the answer for someone who submitted Stage 1 months ago.
 *
 * One row and not a tally of all three — a per-person total across the
 * programme is what PRODUCT.md rules out, and a column of Stages with ticks
 * against them is that total wearing a list (#54, #61).
 */
export async function furthestReportFor(email: string) {
  return (await reportsFor(email)).at(-1) ?? null
}
