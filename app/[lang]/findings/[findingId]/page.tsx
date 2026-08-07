import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

import { and, eq, isNotNull, sql } from 'drizzle-orm'

import { SubmitButton } from '@/app/[lang]/pending'
import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { reportFor } from '@/lib/progress'
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
    agreeing: string
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
    agreeing: 'Recording…',
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
    agree: '이 발견에 동의합니다',
    agreeing: '기록하는 중…',
    agreed: '동의했습니다',
    ownFinding: '내가 쓴 발견입니다 — 동의는 동료의 몫입니다.',
    back: '전체 발견',
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

  const [row] = await db
    .select({ finding: schema.findings, author: schema.reports.email, stage: schema.reports.stage })
    .from(schema.findings)
    .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
    .where(and(eq(schema.findings.id, id), isNotNull(schema.reports.submittedAt)))
  if (!row) notFound()

  // The submitted gate, against *this Finding's* Stage rather than against
  // having submitted anything at all (#61). Reaching a Stage 2 Finding by its
  // address is the route a Learner mid-way through Stage 2 would take to read
  // its answer key, and having finished Stage 1 does not buy it.
  const own = await reportFor(session.email, row.stage)
  if (!own?.submittedAt) redirect(`/${lang}/audit`)

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
      .select({
        author: schema.reports.email,
        stage: schema.reports.stage,
        submittedAt: schema.reports.submittedAt,
      })
      .from(schema.findings)
      .innerJoin(schema.reports, eq(schema.findings.reportId, schema.reports.id))
      .where(eq(schema.findings.id, id))
    // Own Findings cannot be agreed with, and neither can anything not yet
    // submitted; the unique index makes a second agreement a no-op.
    if (!target || target.author === actor.email || !target.submittedAt) return
    // And the actor has to have submitted the Stage this Finding belongs to.
    // Re-derived here rather than trusted from the page that rendered the
    // button: a server action is an address, reachable without it.
    const actorReport = await reportFor(actor.email, target.stage)
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
          <span className="font-medium text-green-700">{copy.agreed}</span>
        ) : (
          <form action={agree}>
            <SubmitButton pendingLabel={copy.agreeing} className="font-medium underline underline-offset-4">
              {copy.agree}
            </SubmitButton>
          </form>
        )}
      </section>
    </main>
  )
}
