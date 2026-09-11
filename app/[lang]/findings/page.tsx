import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { libraryFor } from '@/lib/findings'
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
      '내가 점검을 마친 페이지에 제출된 발견을, 동의한 동료 수 순서로 보여 줍니다. 아직 제출하지 않은 단계는 여기 없습니다. 제출 전에는 정답지가 되기 때문입니다. 동의는 명확하게 표현된 발견을 드러낼 뿐, 아무것도 잠그지 않고 사람별로 합산되지도 않습니다.',
    board: '가장 많이 동의받은 발견',
    agreementCount: (n) => `동의 ${n}명`,
    by: '작성',
    stage: (n) => `${n}단계`,
    empty: '이 단계에 보고서를 제출한 동료가 아직 없습니다. 내가 처음입니다. 동료들이 마치는 대로 여기에 나타납니다.',
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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return { title: COPY[isLanguage(lang) ? lang : 'en'].heading }
}

export default async function Findings({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  // The Stages this reader has paid for by submitting. Everything below is
  // scoped to it, so a Stage they are still working on cannot appear by any
  // route — not in the list, not in the counts. The gate and the scoping are
  // the findings module's, which is where the other four sites ask them (#131).
  const { earned, rows } = await libraryFor(session.email)
  if (earned.length === 0) redirect(`/${lang}/audit`)

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
      {/* Prose holds the reading measure (The One Measure Rule) — the column
          is wider than a comfortable line at this size. */}
      <p className="max-w-measure text-body-sm text-ink-2">{copy.explanation}</p>

      {/* One shelf per Stage the reader has earned, so a Finding is always read
          next to the page it was written about. */}
      {earned.map((stage) => {
        const shelf = rows.filter((row) => row.stage === stage)
        return (
          <section key={stage} className="mt-[14px] first-of-type:mt-0">
            {/* The step and the voice the Learn overview already gives a
                Stage heading — the same word, in the same clothes. */}
            <h2 className="px-1.5 font-serif text-headline font-bold text-ink">
              {copy.stage(stage)} · {copy.board}
            </h2>
            {/* Which emptiness this is, rather than an empty list a reader
                cannot tell from a broken page — on a surface of its own, so
                the answer is a thing on the board and not a caption floating
                under a heading. */}
            {shelf.length === 0 && (
              <p className="mt-[14px] rounded-card bg-surface p-[26px] text-body-sm text-ink-2 shadow-card">
                <span className="block max-w-measure">{copy.empty}</span>
              </p>
            )}
            <ul className="mt-[14px] grid gap-[14px]">
              {shelf.map((row) => (
                <li
                  key={row.finding.id}
                  className="grid grid-cols-[44px_minmax(0,1fr)] gap-[14px] rounded-card bg-surface p-[26px] shadow-card"
                >
                  {/* The agreement count, worn as the row's mark — the board
                      is the one surface where order carries meaning, and the
                      number that ordered it should be visible where the Learn
                      directory's rows wear their station badge. A sunk chip,
                      because it is a counter and not a state; the words repeat
                      it below, so the mark can stay aria-hidden. */}
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-badge bg-sunk text-label font-bold text-ink-2"
                  >
                    {row.agreements}
                  </span>
                  <div className="min-w-0">
                    {/* Underlined at rest, not on hover: this line is the one
                        thing on the page a reader came to open, and on a phone
                        there is no hover to discover that with. The 44px tap
                        height belongs to the link itself, as the Learn rows
                        already do it. */}
                    <p className="max-w-measure text-body-sm">
                      <Link
                        href={`/${lang}/findings/${row.finding.id}`}
                        className="inline-flex min-h-11 items-center underline underline-offset-4"
                      >
                        <span>
                          <span className="font-mono">{row.finding.element}</span> — {row.finding.description}
                        </span>
                      </Link>
                    </p>
                    {/* The address's local part, as the top bar spells its own
                        reader — on a board where a cohort shares one domain the
                        domain names nobody, and it was wrapping mid-address on a
                        phone. The full address stays a hover away for the rare
                        cross-cohort namesake. */}
                    <p className="mt-1 max-w-measure text-body-sm text-ink-2" title={row.author}>
                      {copy.by} {row.author.split('@')[0]} · {copy.agreementCount(row.agreements)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
