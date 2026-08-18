'use server'

import { revalidatePath } from 'next/cache'

import {
  attachIssueUrl as attach,
  removeFinding as remove,
  submitReport as submit,
  writeFinding,
  type FindingInput,
} from '@/lib/audit'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { content } from '@/lib/server-content'

/**
 * The write path of the Self-Audit Report (#24), as addresses a browser can
 * reach. What each one does is the audit module's; what is here is the three
 * things a server action owes: the language it was reached in, the session it
 * is acting for, and the page to redraw afterwards.
 *
 * Every action carries its Stage, and none of them defaults it. A Learner
 * working on Stage 2 must not be able to write into Stage 1's submitted
 * report, and a missing Stage that quietly meant 1 would let them (#61).
 */

export type { FindingInput }

const isPrinciple = (slug: string) => content.glossary.some((entry) => entry.slug === slug)

export async function saveFinding(
  lang: Language,
  stage: number,
  input: FindingInput,
): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const problem = await writeFinding(session.email, stage, input, isPrinciple)
  // Only a write redraws the page: a refusal changes nothing on it, and this
  // is how it behaved before the rules moved behind the module.
  if (!problem) revalidatePath(`/${lang}/audit/${stage}`)
  return problem
}

export async function removeFinding(lang: Language, stage: number, findingId: number): Promise<void> {
  const session = await requireSession(lang)
  if (await remove(session.email, stage, findingId)) revalidatePath(`/${lang}/audit/${stage}`)
}

export async function submitReport(lang: Language, stage: number): Promise<string | null> {
  if (!isLanguage(lang)) return null
  const session = await requireSession(lang)
  const problem = await submit(session.email, stage, content.config.minFindings)
  if (!problem) revalidatePath(`/${lang}/audit/${stage}`)
  return problem
}

export async function attachIssueUrl(lang: Language, stage: number, url: string): Promise<void> {
  const session = await requireSession(lang)
  await attach(session.email, stage, url)
  revalidatePath(`/${lang}/audit/${stage}`)
}
