import { notFound } from 'next/navigation'

import { isLanguage } from '@/lib/language'
import { content } from '@/lib/server-content'

import { attachIssueUrl } from '../actions'
import { COPY, RevealShell, loadReveal } from './reveal'

export const dynamic = 'force-dynamic'

/**
 * The frame the submitted report's two panels stand in — and nothing at all
 * before it is submitted.
 *
 * A layout rather than a shared component the two panels each render, for one
 * reason: a layout survives navigation between its children, so crossing from
 * what was planted to what the Learner found never reloads the subject beside
 * them. The whole point of setting the page against the report is that the two
 * stay in view together; a frame that blanked and scrolled back to the top on
 * every crossing would have taken that away.
 *
 * Every other state of this route — no subject, locked, no brief, and the
 * audit itself — passes straight through. The report is not submitted, so
 * there are no panels and nothing to frame.
 */
export default async function AuditLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string; stage: string }>
}) {
  const { lang, stage: raw } = await params
  if (!isLanguage(lang)) notFound()

  const stage = Number(raw)
  if (!Number.isInteger(stage) || !content.config.stages.some((entry) => entry.stage === stage)) {
    return <>{children}</>
  }

  const submitted = await loadReveal(lang, stage)
  if (!submitted) return <>{children}</>

  const { brief, report } = submitted
  const copy = COPY[lang]
  const save = attachIssueUrl.bind(null, lang, stage)

  return (
    <RevealShell
      lang={lang}
      stage={stage}
      copy={copy}
      issue={
        <section className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 className="font-serif text-headline font-bold text-ink">{copy.issueHeading}</h2>
          {/* The authored paragraph, not a second one written here. The brief
              is what describes this step (CONTEXT.md), and while the surface
              carried its own wording the authored one reached nobody (#135). */}
          <p className="mt-2 max-w-measure text-body-sm text-ink-2">{brief.optionalFix[lang]}</p>
          <form
            action={async (data: FormData) => {
              'use server'
              await save(String(data.get('url') ?? ''))
            }}
            className="mt-4 flex flex-wrap gap-2.5"
          >
            <input
              type="url"
              name="url"
              defaultValue={report.issueUrl ?? ''}
              placeholder="https://…"
              aria-label={copy.issueHeading}
              className="min-h-11 min-w-0 flex-1 rounded-full bg-sunk px-[17px] text-body-sm text-ink"
            />
            <button
              type="submit"
              className="press inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-oxblood px-[26px] text-label font-bold whitespace-nowrap text-white shadow-pill"
            >
              {copy.issueSave}
            </button>
          </form>
          {report.issueUrl && <p className="mt-2 text-body-sm text-ink-2">{copy.issueSaved}</p>}
        </section>
      }
    >
      {children}
    </RevealShell>
  )
}
