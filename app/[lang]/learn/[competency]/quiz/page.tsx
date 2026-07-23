import Link from 'next/link'
import { notFound } from 'next/navigation'

import { and, desc, eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
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
  if (!competency || !content.config.stage1Competencies.includes(slug)) notFound()
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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <nav className="text-sm">
        <Link href={`/${lang}/learn/${slug}`} className="text-zinc-500 underline-offset-4 hover:underline">
          ← {copy.back}
        </Link>
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading(competency.name[lang])}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{copy.rules(drawSize, passThreshold)}</p>

      {/*
        An open attempt used to leave one button, "carry on", and no way to
        abandon a draw a Learner no longer wants — the retry #22 promises was
        reachable from every state except the one people are actually in. Both
        are offered now, with the secondary looking secondary, and the note
        says why discarding is safe rather than leaving it to be guessed.
      */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <form action={start}>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
            >
              {open ? copy.continueOpen : attempts.length > 0 ? copy.retry : copy.start}
            </button>
          </form>
          {open && (
            <form action={restart}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-100"
              >
                {copy.restart}
              </button>
            </form>
          )}
        </div>
        {open && <p className="text-sm text-zinc-500">{copy.restartNote}</p>}
      </div>

      {attempts.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-zinc-500">{copy.history}</h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {attempts.map((attempt) => (
              <li key={attempt.id}>
                {attempt.submittedAt ? (
                  <Link
                    href={`/${lang}/learn/${slug}/quiz/${attempt.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {copy.submittedOn(
                      attempt.submittedAt.toISOString().slice(0, 10),
                      attempt.score ?? 0,
                      attempt.drawn.length,
                    )}
                    {' · '}
                    <span className={attempt.passed ? 'text-green-700 dark:text-green-400' : 'text-zinc-500'}>
                      {attempt.passed ? copy.passed : copy.failed}
                    </span>
                  </Link>
                ) : (
                  <span className="text-zinc-500">{copy.open}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
