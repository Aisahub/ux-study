import { and, eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { briefOf, practicePageOf, type Brief, type PlantedDefect, type PracticePage } from '@/lib/content'
import { capstoneState, progressFor, stageProgress, type StageProgress } from '@/lib/progress'
import { content } from '@/lib/server-content'

/**
 * Whether a Learner can get at a Stage's Self-Audit Report, and if not, which
 * of the three reasons it is.
 *
 * The reasons are ordered, and the order is the domain rule: a Stage with
 * nothing to audit says so before it says anything about quizzes, because
 * "come back when you have passed these" is the wrong sentence for a Stage
 * whose subject nobody has written yet (#61). Until now that order lived as
 * `if`/`return` inside one JSX file, and the write path re-implemented two of
 * the three in a different order of its own (#130).
 */
export type AuditStanding =
  /** Nothing authored to audit yet. The brief may exist, and its title is used if it does. */
  | { state: 'no-subject'; subject: null; brief: Brief | null }
  /** A Gate Quiz in this Stage is still outstanding — what the report waits on (#24). */
  | { state: 'locked'; subject: PracticePage; brief: Brief | null }
  /** Past the gate, with nothing telling the Learner what a complete report asks of them. */
  | { state: 'no-brief'; subject: PracticePage; brief: null }
  /** Everything the report needs is here. */
  | { state: 'open'; subject: PracticePage; brief: Brief }

/**
 * The order itself, over what has already been gathered.
 *
 * Separated from the reads so it can be asked directly: the gate order is the
 * part that carries the rule, and it was previously checkable only by fetching
 * a rendered page from a running server and matching an English sentence in it.
 */
export function auditStandingFrom(
  subject: PracticePage | null,
  brief: Brief | null,
  progress: StageProgress,
): AuditStanding {
  if (!subject) return { state: 'no-subject', subject: null, brief }
  if (capstoneState(progress) === 'locked') return { state: 'locked', subject, brief }
  if (!brief) return { state: 'no-brief', subject, brief: null }
  return { state: 'open', subject, brief }
}

/** Where this Learner stands with one Stage's Self-Audit Report. */
export async function auditStanding(email: string, stage: number): Promise<AuditStanding> {
  const progress = stageProgress(await progressFor(email), stage)
  return auditStandingFrom(practicePageOf(content, stage), briefOf(content, stage), progress)
}

/**
 * The subject a write may be made against, or the refusal to hand one over.
 *
 * A write needs the subject and the passed quizzes; it does not need the brief,
 * which is instructions for a person rather than a condition on a Finding. That
 * is the one place the write path and the surface legitimately differ, and
 * saying so here is what stops it from being re-derived as a second gate order.
 */
export async function subjectForWriting(
  email: string,
  stage: number,
): Promise<{ subject: PracticePage; error?: undefined } | { error: 'no-subject' | 'locked'; subject?: undefined }> {
  const standing = await auditStanding(email, stage)
  if (standing.state === 'no-subject') return { error: 'no-subject' }
  if (standing.state === 'locked') return { error: 'locked' }
  return { subject: standing.subject }
}

/** This Stage's report row for this Learner, submitted or not. */
async function reportRow(email: string, stage: number) {
  const [row] = await db
    .select()
    .from(schema.reports)
    .where(and(eq(schema.reports.email, email), eq(schema.reports.stage, stage)))
  return row ?? null
}

/** This Stage's draft row, created on first use — or null once submitted. */
async function draftReport(email: string, stage: number) {
  const existing = await reportRow(email, stage)
  if (existing) return existing.submittedAt ? null : existing
  const [created] = await db.insert(schema.reports).values({ email, stage }).returning()
  return created
}

/** One Stage's report as its own surface reads it: the row, and the Findings written into it. */
export async function draftFor(email: string, stage: number) {
  const report = await reportRow(email, stage)
  const findings = report
    ? await db.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
    : []
  return { report, findings }
}

export interface FindingInput {
  element: string
  principle: string
  description: string
  fix: string
}

/**
 * Write one Finding into this Stage's draft, or name the reason it cannot be.
 *
 * Every condition is re-derived from records rather than trusted from the form:
 * the Stage has a subject and its quizzes are behind the Learner, the element
 * exists on *this* Stage's subject — identifiers are per page, so one borrowed
 * from another Stage names nothing here — the Principle exists in the Glossary,
 * both written halves are there, and no Finding already cites that element.
 * One element, one Finding.
 */
export async function writeFinding(
  email: string,
  stage: number,
  input: FindingInput,
  isPrinciple: (slug: string) => boolean,
): Promise<string | null> {
  const open = await subjectForWriting(email, stage)
  if (open.error) return open.error

  const element = input.element.trim()
  const principle = input.principle.trim()
  const description = input.description.trim()
  const fix = input.fix.trim()

  if (!open.subject.elements.includes(element)) return 'unknown-element'
  if (!isPrinciple(principle)) return 'unknown-principle'
  if (description === '' || fix === '') return 'incomplete'

  const report = await draftReport(email, stage)
  if (!report) return 'submitted'

  const existing = await db
    .select({ element: schema.findings.element })
    .from(schema.findings)
    .where(eq(schema.findings.reportId, report.id))
  if (existing.some((row) => row.element === element)) return 'duplicate-element'

  await db.insert(schema.findings).values({ reportId: report.id, element, principle, description, fix })
  return null
}

/**
 * Take a Finding back out of a draft.
 *
 * Not yours, not this Stage's, or already part of a submitted report: nothing
 * to remove. Silence rather than an error, because each of those means the
 * Finding the caller is asking about is not one they have.
 */
export async function removeFinding(email: string, stage: number, findingId: number): Promise<boolean> {
  const [row] = await db
    .select({ finding: schema.findings, report: schema.reports })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(eq(schema.findings.id, findingId))
  if (!row || row.report.email !== email || row.report.stage !== stage || row.report.submittedAt) return false

  await db.delete(schema.findings).where(eq(schema.findings.id, findingId))
  return true
}

/**
 * Submit this Stage's report, or name the reason it stays a draft.
 *
 * There is no resubmission: once this Stage's manifest is visible, a second
 * attempt at it measures nothing. Another Stage's report is untouched — finality
 * belongs to the Stage, not to the Learner. Completion is submission and not
 * approval, so the only bar is that the report is well formed.
 */
export async function submitReport(email: string, stage: number, minFindings: number): Promise<string | null> {
  const open = await subjectForWriting(email, stage)
  if (open.error) return open.error

  const report = await reportRow(email, stage)
  if (!report) return 'too-few'
  if (report.submittedAt) return 'submitted'

  const rows = await db.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
  if (rows.length < minFindings) return 'too-few'

  await db.update(schema.reports).set({ submittedAt: new Date() }).where(eq(schema.reports.id, report.id))
  return null
}

/**
 * Attach the issue showing a fixed interface, or clear it.
 *
 * Optional and never load-bearing: an empty value clears it, a value that is
 * not a link is ignored rather than argued with.
 */
export async function attachIssueUrl(email: string, stage: number, url: string): Promise<void> {
  const trimmed = url.trim()
  const value = /^https?:\/\//.test(trimmed) ? trimmed : null
  await db
    .update(schema.reports)
    .set({ issueUrl: value })
    .where(and(eq(schema.reports.email, email), eq(schema.reports.stage, stage)))
}

/**
 * Each Planted Defect against whether this report found it.
 *
 * The join is by element, and it is the same join the Maintainer's content
 * dashboard makes across everybody — which is why it is written here once
 * rather than in each surface that wants a different summary of it. A Finding
 * finds a defect when it cites the element the defect was planted on; nothing
 * about the Learner's words is read, because nobody grades them.
 */
export function reveal(
  defects: PlantedDefect[],
  findings: { element: string }[],
): { defect: PlantedDefect; found: boolean }[] {
  const cited = new Set(findings.map((finding) => finding.element))
  return defects.map((defect) => ({ defect, found: cited.has(defect.element) }))
}
