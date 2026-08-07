import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { and, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { reportsFor } from '@/lib/progress'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    explanation: string
    board: string
    agreementCount: (n: number) => string
    by: string
    stage: (n: number) => string
    empty: string
  }
> = {
  en: {
    heading: 'What colleagues found',
    explanation:
      'Findings submitted on the pages you have audited, ordered by how many colleagues agreed with each one. A Stage you have not submitted yet is not here — until you do, it would be an answer key. Agreement highlights a Finding expressed clearly; it gates nothing and totals nothing.',
    board: 'Most agreed with',
    agreementCount: (n) => (n === 1 ? '1 agreement' : `${n} agreements`),
    by: 'by',
    stage: (n) => `Stage ${n}`,
    empty: 'Nobody else has submitted a report on this Stage yet — yours is the first. Colleagues appear here as they finish.',
  },
  ko: {
    heading: '동료들이 찾아낸 것',
    explanation:
      '내가 점검을 마친 페이지에 제출된 발견을, 동의한 동료 수 순서로 보여 줍니다. 아직 제출하지 않은 단계는 여기 없습니다 — 제출 전에는 정답지가 되기 때문입니다. 동의는 명확하게 표현된 발견을 드러낼 뿐, 아무것도 잠그지 않고 사람별로 합산되지도 않습니다.',
    board: '가장 많이 동의받은 발견',
    agreementCount: (n) => `동의 ${n}명`,
    by: '작성',
    stage: (n) => `${n}단계`,
    empty: '이 단계에 보고서를 제출한 동료가 아직 없습니다 — 내가 처음입니다. 동료들이 마치는 대로 여기에 나타납니다.',
  },
}

/**
 * The Findings library (#25, #61) — one Stage's Findings are readable only
 * after submitting that Stage's own report, because before that they are its
 * answer key. A Learner who has finished Stage 1 and is mid-way through Stage
 * 2 reads Stage 1's shelf and not Stage 2's.
 *
 * The board ranks Findings, never Learners: there is no per-person total
 * anywhere, and most Learners appearing nowhere on it is not a rank
 * (ADR-0005, amended). Splitting the shelves by Stage does not change that —
 * a count is still per Finding, and nothing is summed down a column.
 */
export default async function Findings({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  // The Stages this reader has paid for by submitting. Everything below is
  // scoped to it, so a Stage they are still working on cannot appear by any
  // route — not in the list, not in the counts.
  const earned = (await reportsFor(session.email))
    .filter((report) => report.submittedAt != null)
    .map((report) => report.stage)
  if (earned.length === 0) redirect(`/${lang}/audit`)

  const rows = await db
    .select({
      finding: schema.findings,
      author: schema.reports.email,
      stage: schema.reports.stage,
      agreements: sql<number>`(select count(*)::int from ${schema.agreements} where ${schema.agreements.findingId} = ${schema.findings.id})`,
    })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(and(isNotNull(schema.reports.submittedAt), inArray(schema.reports.stage, earned)))
    .orderBy(desc(sql`4`), desc(schema.findings.id))

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-sm text-zinc-600">{copy.explanation}</p>

      {/* One shelf per Stage the reader has earned, so a Finding is always read
          next to the page it was written about. */}
      {earned.map((stage) => {
        const shelf = rows.filter((row) => row.stage === stage)
        return (
          <section key={stage} className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-zinc-500">
              {copy.stage(stage)} · {copy.board}
            </h2>
            {/* Which emptiness this is, rather than an empty list a reader
                cannot tell from a broken page. */}
            {shelf.length === 0 && <p className="text-sm text-zinc-500">{copy.empty}</p>}
            <ul className="flex flex-col gap-2">
              {shelf.map((row) => (
                <li key={row.finding.id} className="rounded-md border border-zinc-200 p-3 text-sm">
                  <Link href={`/${lang}/findings/${row.finding.id}`} className="underline-offset-4 hover:underline">
                    <span className="font-mono text-xs">{row.finding.element}</span> — {row.finding.description}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">
                    {copy.by} {row.author} · {copy.agreementCount(row.agreements)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
