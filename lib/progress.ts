import { and, eq } from 'drizzle-orm'
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
