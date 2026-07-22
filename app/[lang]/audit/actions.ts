'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor } from '@/lib/progress'
import { content } from '@/lib/server-content'

/**
 * The write path of the Self-Audit Report (#24). Every action re-derives what
 * the browser claims: that the quizzes are passed, that the report is still a
 * draft, that the element and Principle exist. The reveal happens by reading,
 * never by anything stored here — submission is one timestamp.
 */

export interface FindingInput {
  element: string
  principle: string
  description: string
  fix: string
}

export async function saveFinding(lang: Language, input: FindingInput): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const progress = await progressFor(session.email)
  if (!progress.allPassed) return 'locked'

  const element = input.element.trim()
  const principle = input.principle.trim()
  const description = input.description.trim()
  const fix = input.fix.trim()
  // A Finding cites an element identifier and a Principle slug that both
  // exist — anything else could not be compared across Learners.
  if (!content.practicePage.elements.includes(element)) return 'unknown-element'
  if (!content.glossary.some((entry) => entry.slug === principle)) return 'unknown-principle'
  if (description === '' || fix === '') return 'incomplete'

  const report = await draftReport(session.email)
  if (!report) return 'submitted'

  const existing = await db
    .select({ element: schema.findings.element })
    .from(schema.findings)
    .where(eq(schema.findings.reportId, report.id))
  // Two Findings on the same element are refused: one element, one Finding.
  if (existing.some((row) => row.element === element)) return 'duplicate-element'

  await db.insert(schema.findings).values({ reportId: report.id, element, principle, description, fix })
  revalidatePath(`/${lang}/audit`)
  return null
}

export async function removeFinding(lang: Language, findingId: number): Promise<void> {
  const session = await requireSession(lang)
  const [row] = await db
    .select({ finding: schema.findings, report: schema.reports })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(eq(schema.findings.id, findingId))
  // Not yours, or already part of a submitted report: nothing to remove.
  if (!row || row.report.email !== session.email || row.report.submittedAt) return

  await db.delete(schema.findings).where(eq(schema.findings.id, findingId))
  revalidatePath(`/${lang}/audit`)
}

export async function submitReport(lang: Language): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const progress = await progressFor(session.email)
  if (!progress.allPassed) return 'locked'

  const [report] = await db.select().from(schema.reports).where(eq(schema.reports.email, session.email))
  if (!report) return 'too-few'
  // There is no resubmission: once the manifest is visible, a second attempt
  // measures nothing.
  if (report.submittedAt) return 'submitted'

  const rows = await db.select().from(schema.findings).where(eq(schema.findings.reportId, report.id))
  if (rows.length < content.config.minFindings) return 'too-few'

  await db.update(schema.reports).set({ submittedAt: new Date() }).where(eq(schema.reports.id, report.id))
  revalidatePath(`/${lang}/audit`)
  return null
}

export async function attachIssueUrl(lang: Language, url: string): Promise<void> {
  const session = await requireSession(lang)
  const trimmed = url.trim()
  // Optional, and never load-bearing: an empty value clears it, a non-http
  // value is ignored rather than argued with.
  const value = /^https?:\/\//.test(trimmed) ? trimmed : null
  await db
    .update(schema.reports)
    .set({ issueUrl: value })
    .where(and(eq(schema.reports.email, session.email)))
  revalidatePath(`/${lang}/audit`)
}

/** The draft row, created on first use — or null once submitted. */
async function draftReport(email: string) {
  const [existing] = await db.select().from(schema.reports).where(eq(schema.reports.email, email))
  if (existing) return existing.submittedAt ? null : existing
  const [created] = await db.insert(schema.reports).values({ email }).returning()
  return created
}
