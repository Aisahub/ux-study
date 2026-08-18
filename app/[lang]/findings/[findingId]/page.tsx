import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

import { SubmitButton } from '@/app/[lang]/pending'
import { requireSession } from '@/lib/auth'
import { agreementOn, agreeWith, mayRead, submittedFinding } from '@/lib/findings'
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

  const row = await submittedFinding(id)
  if (!row) notFound()

  // The submitted gate, against *this Finding's* Stage rather than against
  // having submitted anything at all (#61). Reaching a Stage 2 Finding by its
  // address is the route a Learner mid-way through Stage 2 would take to read
  // its answer key, and having finished Stage 1 does not buy it.
  if (!(await mayRead(session.email, row.stage))) redirect(`/${lang}/audit`)

  const { count, mine } = await agreementOn(id, session.email)

  const principle = content.glossary.find((entry) => entry.slug === row.finding.principle)

  async function agree() {
    'use server'
    const actor = await requireSession(lang as Language)
    // Every condition re-derived rather than trusted from the page that drew
    // the button — a server action is an address, reachable without it. The
    // conditions themselves are the findings module's, so this action and the
    // page above it cannot drift into two different answers (#131).
    if (await agreeWith(id, actor.email)) revalidatePath(`/${lang}/findings/${id}`)
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <nav className="text-body-sm">
        <Link href={`/${lang}/findings`} className="text-ink-2 underline-offset-4 hover:underline">
          ← {copy.back}
        </Link>
      </nav>

      <h1 className="font-mono text-title">{row.finding.element}</h1>
      <p className="text-body-sm text-ink-2">
        {copy.by} {row.author}
      </p>

      <section className="flex flex-col gap-3 text-body-sm">
        <p>
          <span className="text-ink-2">{copy.principle}: </span>
          {principle ? principle.name[lang] : row.finding.principle}
        </p>
        <p>
          <span className="text-ink-2">{copy.description}: </span>
          {row.finding.description}
        </p>
        <p>
          <span className="text-ink-2">{copy.fix}: </span>
          {row.finding.fix}
        </p>
      </section>

      <section className="flex items-center gap-4 text-body-sm">
        <span className="text-ink-2">{copy.agreementCount(count)}</span>
        {row.author === session.email ? (
          <span className="text-ink-2">{copy.ownFinding}</span>
        ) : mine ? (
          <span className="font-bold text-oxblood">{copy.agreed}</span>
        ) : (
          <form action={agree}>
            <SubmitButton pendingLabel={copy.agreeing} className="font-bold underline underline-offset-4">
              {copy.agree}
            </SubmitButton>
          </form>
        )}
      </section>
    </main>
  )
}
