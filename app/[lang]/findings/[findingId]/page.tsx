import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

import { and, eq, isNotNull, sql } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    by: string
    principle: string
    description: string
    fix: string
    agreementCount: (n: number) => string
    agree: string
    agreed: string
    ownFinding: string
    back: string
  }
> = {
  en: {
    by: 'by',
    principle: 'UX Principle',
    description: 'What goes wrong',
    fix: 'Proposed fix',
    agreementCount: (n) => (n === 1 ? '1 colleague agreed' : `${n} colleagues agreed`),
    agree: 'I agree with this Finding',
    agreed: 'You agreed',
    ownFinding: 'Your own Finding — agreement is for colleagues.',
    back: 'All Findings',
  },
  ko: {
    by: '작성',
    principle: 'UX 원칙',
    description: '무엇이 잘못되는지',
    fix: '고치는 방법 제안',
    agreementCount: (n) => `동료 ${n}명이 동의했습니다`,
    agree: '이 Finding에 동의합니다',
    agreed: '동의했습니다',
    ownFinding: '내가 쓴 Finding입니다 — 동의는 동료의 몫입니다.',
    back: '전체 Finding',
  },
}

/**
 * One Finding (#25), with the agreement mark. A Learner cannot agree with
 * their own Finding, and nothing here or anywhere totals agreements per
 * person — the count belongs to the Finding.
 */
export default async function FindingPage({
  params,
}: {
  params: Promise<{ lang: string; findingId: string }>
}) {
  const { lang, findingId } = await params
  if (!isLanguage(lang)) notFound()
  const id = Number.parseInt(findingId, 10)
  if (!Number.isInteger(id)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  // The submitted gate first: before their own submission this library is an
  // answer key, whatever route it is reached by.
  const [own] = await db.select().from(schema.reports).where(eq(schema.reports.email, session.email))
  if (!own?.submittedAt) redirect(`/${lang}/audit`)

  const [row] = await db
    .select({ finding: schema.findings, author: schema.reports.email })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(and(eq(schema.findings.id, id), isNotNull(schema.reports.submittedAt)))
  if (!row) notFound()

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.agreements)
    .where(eq(schema.agreements.findingId, id))
  const [mine] = await db
    .select()
    .from(schema.agreements)
    .where(and(eq(schema.agreements.findingId, id), eq(schema.agreements.email, session.email)))

  const principle = content.glossary.find((entry) => entry.slug === row.finding.principle)

  async function agree() {
    'use server'
    const actor = await requireSession(lang as Language)
    const [target] = await db
      .select({ author: schema.reports.email, submittedAt: schema.reports.submittedAt })
      .from(schema.findings)
      .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
      .where(eq(schema.findings.id, id))
    // Own Findings cannot be agreed with, and neither can anything not yet
    // submitted; the unique index makes a second agreement a no-op.
    if (!target || target.author === actor.email || !target.submittedAt) return
    const [actorReport] = await db.select().from(schema.reports).where(eq(schema.reports.email, actor.email))
    if (!actorReport?.submittedAt) return
    await db.insert(schema.agreements).values({ findingId: id, email: actor.email }).onConflictDoNothing()
    revalidatePath(`/${lang}/findings/${id}`)
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <nav className="text-sm">
        <Link href={`/${lang}/findings`} className="text-zinc-500 underline-offset-4 hover:underline">
          ← {copy.back}
        </Link>
      </nav>

      <h1 className="font-mono text-lg">{row.finding.element}</h1>
      <p className="text-sm text-zinc-500">
        {copy.by} {row.author}
      </p>

      <section className="flex flex-col gap-3 text-sm">
        <p>
          <span className="text-zinc-500">{copy.principle}: </span>
          {principle ? principle.name[lang] : row.finding.principle}
        </p>
        <p>
          <span className="text-zinc-500">{copy.description}: </span>
          {row.finding.description}
        </p>
        <p>
          <span className="text-zinc-500">{copy.fix}: </span>
          {row.finding.fix}
        </p>
      </section>

      <section className="flex items-center gap-4 text-sm">
        <span className="text-zinc-500">{copy.agreementCount(count)}</span>
        {row.author === session.email ? (
          <span className="text-zinc-500">{copy.ownFinding}</span>
        ) : mine ? (
          <span className="font-medium text-green-700 dark:text-green-400">{copy.agreed}</span>
        ) : (
          <form action={agree}>
            <button type="submit" className="font-medium underline underline-offset-4">
              {copy.agree}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
