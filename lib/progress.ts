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

export interface Progress {
  /** Keyed by Competency slug, in Stage 1 order. */
  quizzes: Record<string, { status: QuizStatus; attempts: number }>
  reportSubmitted: boolean
  /** All four Gate Quizzes passed — what unlocks the Self-Audit Report (#24). */
  allPassed: boolean
  /** Steps done of stepsTotal: the four quizzes and the capstone report, so remaining work needs no arithmetic. */
  stepsDone: number
  stepsTotal: number
}

/**
 * This Learner's report row, or null.
 *
 * Wrapped in React's `cache` because two independent server components want it
 * on the same render: the page, to place the capstone, and the navigation, to
 * decide whether the Findings library is reachable yet. They cannot see each
 * other, and every Learner surface is `force-dynamic`, so without this the
 * table is read twice on every request for the length of the programme.
 */
export const reportFor = cache(async (email: string) => {
  const [report] = await db.select().from(schema.reports).where(eq(schema.reports.email, email))
  return report ?? null
})

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
  const report = await reportFor(email)

  const quizzes: Progress['quizzes'] = {}
  for (const slug of content.config.stage1Competencies) {
    const own = rows.filter((row) => row.competency === slug)
    const passed = own.some((row) => row.passed === true)
    quizzes[slug] = {
      status: passed ? 'passed' : own.length > 0 ? 'in-progress' : 'unstarted',
      attempts: own.length,
    }
  }

  const allPassed = content.config.stage1Competencies.every((slug) => quizzes[slug].status === 'passed')
  const reportSubmitted = report?.submittedAt != null
  const stepsDone =
    Object.values(quizzes).filter((quiz) => quiz.status === 'passed').length + (reportSubmitted ? 1 : 0)

  return {
    quizzes,
    reportSubmitted,
    allPassed,
    stepsDone,
    stepsTotal: content.config.stage1Competencies.length + 1,
  }
}

/** True once this Learner has both passed every Gate Quiz and submitted the report — Stage 1 Completion (#24). */
export function isComplete(progress: Progress): boolean {
  return progress.allPassed && progress.reportSubmitted
}
