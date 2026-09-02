import { notFound, redirect } from 'next/navigation'

import { elementLabels } from '@/lib/element-label'
import { isLanguage } from '@/lib/language'
import { content } from '@/lib/server-content'

import { COPY, FindingCard, GroupedPanel, byCompetency, competencyOfPrinciple, loadReveal } from '../reveal'

export const dynamic = 'force-dynamic'

/**
 * The Learner's own Findings, the second panel of a submitted report.
 *
 * Grouped by Competency exactly as the Planted Defects beside them are, and
 * that is the whole reason this panel is not a flat list: the two panels are
 * read against each other, and a Learner can only ask "did I see everything in
 * this Competency?" if both sides are cut the same way. A Finding's Competency
 * is the one taught by the Principle they chose, which is the selection the
 * drawer asked them for while they were writing it.
 *
 * There is no panel before submission — the audit's own drawer is where a
 * draft is read — so this address sends a Learner back to it.
 */
export default async function Findings({ params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage: raw } = await params
  if (!isLanguage(lang)) notFound()
  const stage = Number(raw)
  if (!Number.isInteger(stage) || !content.config.stages.some((entry) => entry.stage === stage)) notFound()

  const submitted = await loadReveal(lang, stage)
  if (!submitted) redirect(`/${lang}/audit/${stage}`)

  const { subject, findings } = submitted
  const copy = COPY[lang]
  const labels = elementLabels(subject.html[lang])
  const principleName = (slug: string) =>
    content.glossary.find((entry) => entry.slug === slug)?.name[lang] ?? slug

  const groups = byCompetency(findings, (finding) => competencyOfPrinciple(finding.principle, stage), lang)

  return (
    <GroupedPanel
      groups={groups}
      render={(finding) => (
        <FindingCard
          key={finding.id}
          finding={finding}
          label={labels[finding.element] ?? finding.element}
          principle={principleName(finding.principle)}
          copy={copy}
        />
      )}
    />
  )
}
