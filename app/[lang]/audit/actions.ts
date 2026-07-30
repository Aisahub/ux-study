'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor, stageProgress } from '@/lib/progress'
import { content, practicePage } from '@/lib/server-content'

/**
 * The write path of the Self-Audit Report (#24). Every action re-derives what
 * the browser claims: that the Stage exists and has a subject, that its
 * quizzes are passed, that the report is still a draft, that the element and
 * Principle exist. The reveal happens by reading, never by anything stored
 * here — submission is one timestamp.
 *
 * Every action carries its Stage, and none of them defaults it. A Learner
 * working on Stage 2 must not be able to write into Stage 1's submitted
 * report, and a missing Stage that quietly meant 1 would let them (#61).
 */

export interface FindingInput {
  element: string
  principle: string
  description: string
  fix: string
}

/**
 * The gate every write shares: a real Stage, with a subject to audit and its
 * Gate Quizzes behind it. Returns that Stage's subject, or the refusal.
 */
async function openSubject(lang: Language, stage: number, email: string) {
  const subject = practicePage(stage)
  // Not "no such Stage" — the Stage may well be declared and simply have
  // nothing to audit yet, which is a different thing to tell someone.
  if (!subject) return { error: 'no-subject' as const }

  const progress = stageProgress(await progressFor(email), stage)
  if (!progress.allPassed) return { error: 'locked' as const }
  return { subject }
}

export async function saveFinding(
  lang: Language,
  stage: number,
  input: FindingInput,
): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const open = await openSubject(lang, stage, session.email)
  if (open.error) return open.error

  const element = input.element.trim()
  const principle = input.principle.trim()
  const description = input.description.trim()
  const fix = input.fix.trim()
  // A Finding cites an element identifier and a Principle slug that both
  // exist — anything else could not be compared across Learners. The element
  // has to exist on *this* Stage's subject: the identifiers are per page, and
  // an element borrowed from another Stage's page names nothing here.
  if (!open.subject.elements.includes(element)) return 'unknown-element'
  if (!content.glossary.some((entry) => entry.slug === principle)) return 'unknown-principle'
  if (description === '' || fix === '') return 'incomplete'

  const report = await draftReport(session.email, stage)
  if (!report) return 'submitted'

  const existing = await db
    .select({ element: schema.findings.element })
    .from(schema.findings)
    .where(eq(schema.findings.reportId, report.id))
  // Two Findings on the same element are refused: one element, one Finding.
  if (existing.some((row) => row.element === element)) return 'duplicate-element'

  await db.insert(schema.findings).values({ reportId: report.id, element, principle, description, fix })
  revalidatePath(`/${lang}/audit/${stage}`)
  return null
}

export async function removeFinding(lang: Language, stage: number, findingId: number): Promise<void> {
  const session = await requireSession(lang)
  const [row] = await db
    .select({ finding: schema.findings, report: schema.reports })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(eq(schema.findings.id, findingId))
  // Not yours, not this Stage's, or already part of a submitted report:
  // nothing to remove.
  if (!row || row.report.email !== session.email || row.report.stage !== stage || row.report.submittedAt) return

  await db.delete(schema.findings).where(eq(schema.findings.id, findingId))
  revalidatePath(`/${lang}/audit/${stage}`)
}

export async function submitReport(lang: Language, stage: number): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const open = await openSubject(lang, stage, session.email)
  if (open.error) return open.error

  const report = await reportRow(session.email, stage)
  if (!report) return 'too-few'
  // There is no resubmission: once this Stage's manifest is visible, a second
  // attempt at it measures nothing. Another Stage's report is untouched by
  // this — finality belongs to the Stage, not to the Learner.
  if (report.submittedAt) return 'submitted'

  const rows = await db.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
  if (rows.length < content.config.minFindings) return 'too-few'

  await db.update(schema.reports).set({ submittedAt: new Date() }).where(eq(schema.reports.id, report.id))
  revalidatePath(`/${lang}/audit/${stage}`)
  return null
}

export async function attachIssueUrl(lang: Language, stage: number, url: string): Promise<void> {
  const session = await requireSession(lang)
  const trimmed = url.trim()
  // Optional, and never load-bearing: an empty value clears it, a non-http
  // value is ignored rather than argued with.
  const value = /^https?:\/\//.test(trimmed) ? trimmed : null
  await db
    .update(schema.reports)
    .set({ issueUrl: value })
    .where(and(eq(schema.reports.email, session.email), eq(schema.reports.stage, stage)))
  revalidatePath(`/${lang}/audit/${stage}`)
}

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
