import type { Metadata } from 'next'
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
    /**
     * The tab's name. The Finding's own words are not in it on purpose: this
     * route is readable only to a Learner whose Stage has been reached, and a
     * title is written before that gate has been asked — so what a tab, a
     * bookmark or a history entry says here must be true of every Finding.
     */
    pageTitle: string
    stage: (n: number) => string
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
    pageTitle: 'Finding',
    stage: (n) => `Stage ${n}`,
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
    pageTitle: '발견',
    stage: (n) => `${n}단계`,
    by: '작성',
    principle: 'UX 원칙',
    description: '무엇이 잘못되는지',
    fix: '고치는 방법 제안',
    agreementCount: (n) => `동료 ${n}명이 동의했습니다`,
    agree: '이 발견에 동의합니다',
    agreeing: '기록하는 중…',
    agreed: '동의했습니다',
    ownFinding: '내가 쓴 발견입니다. 동의는 동료의 몫입니다.',
    back: '전체 발견',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return { title: COPY[isLanguage(lang) ? lang : 'en'].pageTitle }
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
        {/* Underlined at rest, as the board's own links are (ERR-231): the
            arrow says direction, the underline says pressable, and a phone
            has no hover to say it later. */}
        <Link
          href={`/${lang}/findings`}
          className="inline-flex min-h-11 items-center text-ink-2 underline underline-offset-4"
        >
          ← {copy.back}
        </Link>
      </nav>

      {/* One card, one Finding — the reading surface the board's rows open
          into, on the same white card the rows themselves wear. */}
      <article className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card">
        <h1 className="max-w-measure font-mono text-headline font-bold text-ink">{row.finding.element}</h1>
        {/* Where it comes from before who wrote it, as the board's rows say
            it. The local part, as the board and the top bar spell people —
            the full address stays a hover away (see the board for why). */}
        <p className="max-w-measure text-body-sm text-ink-2" title={row.author}>
          <span className="font-bold">{copy.stage(row.stage)}</span> · {copy.by} {row.author.split('@')[0]}
        </p>

        {/* A definition list, its headings in the title step over body
            answers — same size, the weight is the difference, the pairing
            the scale already names — and a khaki hairline between blocks,
            the line this system draws wherever one card holds several
            sections (the Competency page's notes head, the verdict's item
            rows). Label-step grey alone did not hold the three apart. */}
        <dl className="grid max-w-measure divide-y divide-khaki/40 border-t border-khaki/40">
          <div className="py-[14px]">
            <dt className="text-title font-bold text-ink">{copy.principle}</dt>
            <dd className="mt-1 text-body">{principle ? principle.name[lang] : row.finding.principle}</dd>
          </div>
          <div className="py-[14px]">
            <dt className="text-title font-bold text-ink">{copy.description}</dt>
            <dd className="mt-1 text-body">{row.finding.description}</dd>
          </div>
          <div className="py-[14px] pb-0">
            <dt className="text-title font-bold text-ink">{copy.fix}</dt>
            <dd className="mt-1 text-body">{row.finding.fix}</dd>
          </div>
        </dl>

        {/* Agreement is this screen's one action, so it is drawn as the one
            control the system draws actions with — the full-width oxblood
            pill the Gate Quiz doorstep uses — not as a sentence that happens
            to submit. The count stays words beside the board's sunk-chip
            number, and the two no-action states stay words: one is a fact
            about authorship, the other a status already given its colour.
            The same hairline above it marks where reading ends and acting
            begins, as the report drawer's action foot already does. */}
        <section className="grid gap-[14px] border-t border-khaki/40 pt-[14px]">
          <p className="flex items-center gap-2.5 text-body-sm text-ink-2">
            <span
              aria-hidden
              className="grid size-[34px] shrink-0 place-items-center rounded-badge bg-sunk text-label font-bold text-ink-2"
            >
              {count}
            </span>
            {copy.agreementCount(count)}
          </p>
          {row.author === session.email ? (
            <p className="text-body-sm text-ink-2">{copy.ownFinding}</p>
          ) : mine ? (
            <p className="text-body font-bold text-oxblood">{copy.agreed}</p>
          ) : (
            <form action={agree}>
              <SubmitButton
                pendingLabel={copy.agreeing}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
              >
                {copy.agree}
              </SubmitButton>
            </form>
          )}
        </section>
      </article>
    </main>
  )
}
