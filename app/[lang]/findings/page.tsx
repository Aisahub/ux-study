import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { desc, eq, isNotNull, sql } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    explanation: string
    board: string
    agreementCount: (n: number) => string
    by: string
  }
> = {
  en: {
    heading: 'What colleagues found',
    explanation:
      'Every Finding submitted on the practice page, ordered by how many colleagues agreed with it. Agreement highlights a Finding expressed clearly — it gates nothing and totals nothing.',
    board: 'Most agreed with',
    agreementCount: (n) => (n === 1 ? '1 agreement' : `${n} agreements`),
    by: 'by',
  },
  ko: {
    heading: '동료들이 찾아낸 것',
    explanation:
      '연습 페이지에 제출된 모든 Finding을, 동의한 동료 수 순서로 보여 줍니다. 동의는 명확하게 표현된 Finding을 드러낼 뿐 — 아무것도 잠그지 않고, 사람별로 합산되지도 않습니다.',
    board: '가장 많이 동의받은 Finding',
    agreementCount: (n) => `동의 ${n}명`,
    by: '작성',
  },
}

/**
 * The Findings library (#25) — readable only after submitting, because before
 * that it is an answer key. The board ranks Findings, never Learners: there
 * is no per-person total anywhere, and most Learners appearing nowhere on it
 * is not a rank (ADR-0005, amended).
 */
export default async function Findings({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const [own] = await db.select().from(schema.reports).where(eq(schema.reports.email, session.email))
  if (!own?.submittedAt) redirect(`/${lang}/audit`)

  const rows = await db
    .select({
      finding: schema.findings,
      author: schema.reports.email,
      agreements: sql<number>`(select count(*)::int from ${schema.agreements} where ${schema.agreements.findingId} = ${schema.findings.id})`,
    })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(isNotNull(schema.reports.submittedAt))
    .orderBy(desc(sql`3`), desc(schema.findings.id))

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{copy.explanation}</p>

      <h2 className="text-sm font-medium text-zinc-500">{copy.board}</h2>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.finding.id} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <Link href={`/${lang}/findings/${row.finding.id}`} className="underline-offset-4 hover:underline">
              <span className="font-mono text-xs">{row.finding.element}</span> — {row.finding.description}
            </Link>
            <p className="mt-1 text-xs text-zinc-500">
              {copy.by} {row.author} · {copy.agreementCount(row.agreements)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
