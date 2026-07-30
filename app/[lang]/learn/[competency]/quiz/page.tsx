import Link from 'next/link'
import { notFound } from 'next/navigation'

import { and, desc, eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { stageOf } from '@/lib/content'
import { isLanguage, type Language } from '@/lib/language'
import { content } from '@/lib/server-content'

import { restartAttempt, startAttempt } from './actions'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: (name: string) => string
    rules: (draw: number, threshold: number) => string
    start: string
    continueOpen: string
    retry: string
    history: string
    submittedOn: (date: string, score: number, draw: number) => string
    passed: string
    failed: string
    open: string
    back: string
    restart: string
    restartNote: string
  }
> = {
  en: {
    heading: (name) => `Gate Quiz — ${name}`,
    rules: (draw, threshold) =>
      `${draw} items, drawn from this Competency's pool. ${threshold} correct passes. You see the verdict the moment you submit, and you can retry immediately, as often as you need.`,
    start: 'Start',
    continueOpen: 'Continue the open attempt',
    retry: 'Try again',
    restart: 'Start over with new items',
    restartNote: 'Your open attempt has not been scored, so nothing is lost by starting again.',
    history: 'Your attempts',
    submittedOn: (date, score, draw) => `${date} — ${score} of ${draw}`,
    passed: 'Passed',
    failed: 'Not passed',
    open: 'In progress',
    back: 'Back to the Competency',
  },
  ko: {
    heading: (name) => `관문 퀴즈 — ${name}`,
    rules: (draw, threshold) =>
      `이 역량의 문항 풀에서 ${draw}문항이 무작위로 나옵니다. ${threshold}문항을 맞히면 통과합니다. 제출하는 순간 결과가 바로 보이고, 필요한 만큼 곧바로 다시 도전할 수 있습니다.`,
    start: '시작',
    continueOpen: '진행 중인 시도 이어서 하기',
    retry: '다시 도전',
    restart: '새 문항으로 다시 시작',
    restartNote: '진행 중인 시도는 아직 채점되지 않았으므로, 다시 시작해도 잃는 것은 없습니다.',
    history: '나의 시도',
    submittedOn: (date, score, draw) => `${date} — ${draw}문항 중 ${score}문항`,
    passed: '통과',
    failed: '미통과',
    open: '진행 중',
    back: '역량 페이지로',
  },
}

/**
 * How one earlier attempt came out, told the three ways every status on this
 * platform is told: colour, shape, and the word beside it. Same marks the
 * route line uses, so an attempt reads as a stop that has been made.
 */
function AttemptMark({ state }: { state: 'passed' | 'failed' | 'open' }) {
  return (
    <i
      aria-hidden
      className={`size-[14px] rounded-full ${
        state === 'passed'
          ? 'bg-oxblood'
          : state === 'open'
            ? 'bg-linear-[90deg,var(--oxblood)_0_50%,#fff_50%_100%] shadow-[inset_0_0_0_2.5px_var(--oxblood)]'
            : 'bg-white shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
      }`}
    />
  )
}

/**
 * The doorstep of a Gate Quiz (#21): the Learner is told how many items and
 * how many they need right before anything starts, and every earlier attempt
 * is preserved and visible (#22) — failing is a step, not a secret.
 */
export default async function QuizStart({
  params,
}: {
  params: Promise<{ lang: string; competency: string }>
}) {
  const { lang, competency: slug } = await params
  if (!isLanguage(lang)) notFound()
  const competency = content.competencies.find((entry) => entry.slug === slug)
  if (!competency || stageOf(content.config, slug) === null) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]
  const { drawSize, passThreshold } = content.config

  const attempts = await db
    .select()
    .from(schema.attempts)
    .where(and(eq(schema.attempts.email, session.email), eq(schema.attempts.competency, slug)))
    .orderBy(desc(schema.attempts.id))
  const open = attempts.find((attempt) => attempt.submittedAt === null)

  const start = startAttempt.bind(null, lang, slug)
  const restart = restartAttempt.bind(null, lang, slug)

  return (
    // The attempt runs in a column, not on the wide two-column grid the map
    // pages use. A doorstep is one thing to decide, and a Learner standing at
    // it should not be given a second column to scan first.
    <main className="mx-auto w-full max-w-[720px] px-0.5">
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn/${slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.back}
        </Link>
      </nav>

      <h1 className="px-1.5 pb-5 font-serif text-display font-bold text-ink">
        {copy.heading(competency.name[lang])}
      </h1>

      <div className="flex flex-col gap-3.5">
        {/*
          The one warm field: the gate itself, and the single way through it.

          An open attempt used to leave one button, "carry on", and no way to
          abandon a draw a Learner no longer wants — the retry #22 promises was
          reachable from every state except the one people are actually in.
          Both are offered now; the discard is a link rather than a second
          button, because this screen has one action and everything else beside
          it is a link. The note says why discarding is safe rather than
          leaving it to be guessed.
        */}
        <section className="rounded-card bg-sand p-5 sm:p-[26px] shadow-warm">
          <p className="max-w-[56ch] text-body">{copy.rules(drawSize, passThreshold)}</p>
          <form action={start}>
            <button
              type="submit"
              className="mt-5.5 flex w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
            >
              {open ? copy.continueOpen : attempts.length > 0 ? copy.retry : copy.start}
            </button>
          </form>
          {open && (
            <>
              {/* Full ink, not the 72% fade: that value is measured against
                  white and drops below AA on the sand field. */}
              <p className="mt-4.5 max-w-[56ch] text-body-sm">{copy.restartNote}</p>
              <form action={restart}>
                <button type="submit" className="mt-2 text-title font-bold text-oxblood">
                  {copy.restart}
                </button>
              </form>
            </>
          )}
        </section>

        {attempts.length > 0 && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="mb-4.5 font-serif text-headline font-bold text-ink">
              {copy.history}
            </h2>
            <div className="flex flex-col">
              {attempts.map((attempt) => {
                const state = attempt.submittedAt ? (attempt.passed ? 'passed' : 'failed') : 'open'
                const row = (
                  <>
                    <AttemptMark state={state} />
                    <span className="text-title font-bold">
                      {attempt.submittedAt
                        ? copy.submittedOn(
                            attempt.submittedAt.toISOString().slice(0, 10),
                            attempt.score ?? 0,
                            attempt.drawn.length,
                          )
                        : copy.open}
                    </span>
                    {/* Narrow, the verdict drops under the date rather than
                        competing with it for a third column that is not there. */}
                    <span className="col-start-2 mt-1 text-label font-bold whitespace-nowrap text-ink-2 empty:mt-0 sm:col-start-auto sm:mt-0">
                      {state === 'passed' ? copy.passed : state === 'failed' ? copy.failed : ''}
                    </span>
                  </>
                )
                const cells =
                  'grid grid-cols-[14px_minmax(0,1fr)] items-start gap-x-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5 sm:grid-cols-[14px_minmax(0,1fr)_auto] sm:items-center'

                // An open attempt has no verdict to read, so it is not a way
                // back into one — it is reached by the button above.
                return attempt.submittedAt ? (
                  <Link key={attempt.id} href={`/${lang}/learn/${slug}/quiz/${attempt.id}`} className={cells}>
                    {row}
                  </Link>
                ) : (
                  <div key={attempt.id} className={cells}>
                    {row}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
