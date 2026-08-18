import { and, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm'

import { db, schema } from '@/db'
import { reportFor, reportsFor } from '@/lib/progress'

/**
 * The Findings library: other Learners' submitted Findings, and the agreement
 * marks on them (ADR-0011).
 *
 * One rule runs through every function here — **a reader reaches a Stage's
 * Findings only once they have submitted their own report for that Stage.**
 * Before that the library is an answer key for the page they are about to
 * audit. It was asked in five places and in three different spellings before
 * this module existed (#131), one of which asked whether the reader had
 * submitted *anything* rather than this Stage.
 */

export interface LibraryFinding {
  finding: typeof schema.findings.$inferSelect
  author: string
  stage: number
  agreements: number
}

/**
 * The Stages this reader has paid for by submitting, in Stage order.
 *
 * Empty means the library is not theirs yet at all — the caller sends them back
 * to their own report rather than showing an empty shelf, because nothing is
 * missing.
 */
export async function earnedStages(email: string): Promise<number[]> {
  return (await reportsFor(email))
    .filter((report) => report.submittedAt != null)
    .map((report) => report.stage)
}

/**
 * Every submitted Finding from the Stages this reader has earned, most agreed
 * with first, newest first within a tie.
 *
 * The ordering names its column. It was written as `desc(sql`4`)` — the fourth
 * item in the select list — so adding a column above it would have re-sorted
 * the board silently, and the board is the one surface in the programme where
 * order carries meaning.
 */
export async function libraryFor(email: string): Promise<{ earned: number[]; rows: LibraryFinding[] }> {
  const earned = await earnedStages(email)
  if (earned.length === 0) return { earned, rows: [] }

  const agreements = sql<number>`(select count(*)::int from ${schema.agreements} where ${schema.agreements.findingId} = ${schema.findings.id})`

  const rows = await db
    .select({
      finding: schema.findings,
      author: schema.reports.email,
      stage: schema.reports.stage,
      agreements,
    })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(and(isNotNull(schema.reports.submittedAt), inArray(schema.reports.stage, earned)))
    .orderBy(desc(agreements), desc(schema.findings.id))

  return { earned, rows }
}

/** One submitted Finding with its author and Stage, or null — a draft is not readable by anyone but its writer. */
export async function submittedFinding(id: number) {
  const [row] = await db
    .select({ finding: schema.findings, author: schema.reports.email, stage: schema.reports.stage })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(and(eq(schema.findings.id, id), isNotNull(schema.reports.submittedAt)))
  return row ?? null
}

/** Whether this reader has earned the Stage a Finding belongs to. */
export async function mayRead(email: string, stage: number): Promise<boolean> {
  const own = await reportFor(email, stage)
  return own?.submittedAt != null
}

/** How many have agreed with a Finding, and whether this reader is one of them. */
export async function agreementOn(id: number, email: string): Promise<{ count: number; mine: boolean }> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.agreements)
    .where(eq(schema.agreements.findingId, id))
  const [mine] = await db
    .select()
    .from(schema.agreements)
    .where(and(eq(schema.agreements.findingId, id), eq(schema.agreements.email, email)))
  return { count, mine: mine != null }
}

/**
 * Mark agreement with someone else's submitted Finding.
 *
 * Every condition is re-derived here and none is trusted from the page that
 * drew the button: a server action is an address, reachable without it. Own
 * Findings cannot be agreed with, nor anything unsubmitted, nor anything from a
 * Stage the actor has not earned. A second agreement is a no-op — the unique
 * index says so, and this returns true for it, because the state the caller
 * wanted is the state that holds.
 */
export async function agreeWith(id: number, email: string): Promise<boolean> {
  const target = await submittedFinding(id)
  if (!target || target.author === email) return false
  if (!(await mayRead(email, target.stage))) return false

  await db.insert(schema.agreements).values({ findingId: id, email }).onConflictDoNothing()
  return true
}
