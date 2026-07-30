import { notFound, redirect } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { isLanguage } from '@/lib/language'
import { progressFor } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

/**
 * `/audit` without a Stage, kept because it is the address every link, every
 * bookmark and every Learner mid-report already has (#61). It names the Stage
 * they are actually on and sends them there.
 *
 * The Stage is the earliest one whose report is not submitted — the one with
 * work left in it. A Learner who has finished every Stage lands on the last,
 * where their reveal is, rather than being bounced to a Stage 1 they closed
 * months ago.
 */
export default async function AuditEntry({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)

  const progress = await progressFor(session.email)
  const unfinished = progress.stages.find((stage) => !stage.reportSubmitted)
  const stage = unfinished?.stage ?? content.config.stages[content.config.stages.length - 1].stage

  redirect(`/${lang}/audit/${stage}`)
}
