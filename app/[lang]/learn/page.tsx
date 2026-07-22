import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor, type QuizStatus } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    stage: string
    remaining: (done: number, total: number) => string
    understanding: string
    application: string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    capstoneHeading: string
    capstoneExplanation: string
    capstoneLocked: string
    capstoneReady: string
    capstoneSubmitted: string
    complete: string
    visibility: string
  }
> = {
  en: {
    heading: 'Learn',
    stage: 'Stage 1',
    remaining: (done, total) =>
      done === total ? 'Stage 1 is complete.' : `${done} of ${total} steps done — ${total - done} to go.`,
    understanding: 'Understanding',
    application: 'Application',
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    capstoneHeading: 'Self-Audit Report',
    capstoneExplanation:
      'The capstone: audit a real page unaided, using everything the four Competencies taught.',
    capstoneLocked: 'Unlocks when all four Gate Quizzes are passed.',
    capstoneReady: 'Ready — all four Gate Quizzes passed.',
    capstoneSubmitted: 'Submitted',
    complete: 'Stage 1 complete',
    visibility:
      'A programme maintainer can see your progress: your position in Stage 1, how long since your last activity, and how many attempts each quiz took. Nothing ranks you against anyone.',
  },
  ko: {
    heading: '학습',
    stage: '1단계',
    remaining: (done, total) =>
      done === total ? '1단계를 모두 마쳤습니다.' : `${total}단계 중 ${done}단계 완료 — ${total - done}단계 남았습니다.`,
    understanding: '이해',
    application: '적용',
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    capstoneHeading: '셀프 감사 보고서',
    capstoneExplanation: '마무리 과제: 네 역량에서 배운 것으로, 도움 없이 실제 페이지를 감사합니다.',
    capstoneLocked: '네 관문 퀴즈를 모두 통과하면 열립니다.',
    capstoneReady: '준비 완료 — 관문 퀴즈 네 개를 모두 통과했습니다.',
    capstoneSubmitted: '제출 완료',
    complete: '1단계 수료',
    visibility:
      '프로그램 관리자는 여러분의 진행 상황을 볼 수 있습니다 — 1단계에서 어디까지 왔는지, 마지막 활동이 얼마나 지났는지, 퀴즈마다 몇 번 시도했는지. 누구와도 순위를 매기지 않습니다.',
  },
}

/**
 * Where a Learner lands (#20): the whole of Stage 1 at a glance — four
 * Competencies, understanding and application separately, and how much
 * remains, so a programme with no deadline still feels finite. Everything
 * shown is derived from this Learner's own records; nobody else's progress
 * is queried, so none can leak.
 */
export default async function Learn({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const progress = await progressFor(session.email)
  const competencies = content.config.stage1Competencies.map(
    (slug) => content.competencies.find((competency) => competency.slug === slug)!,
  )

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
        <p className="text-sm text-zinc-500">{copy.stage}</p>
      </header>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {copy.remaining(progress.stepsDone, progress.stepsTotal)}
      </p>
      {/* Visible on the page every Learner lands on, before any first attempt
          — being watched is stated, not discovered (ADR-0005, #30). */}
      <p className="text-xs text-zinc-500">{copy.visibility}</p>

      <ol className="flex flex-col gap-3">
        {competencies.map((competency) => {
          const quiz = progress.quizzes[competency.slug]
          return (
            <li key={competency.slug} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <Link href={`/${lang}/learn/${competency.slug}`} className="font-medium underline-offset-4 hover:underline">
                {competency.name[lang]}
              </Link>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{competency.objective[lang]}</p>
              <p className="mt-2 text-sm">
                <span className="text-zinc-500">{copy.understanding}: </span>
                <span className={quiz.status === 'passed' ? 'text-green-700 dark:text-green-400' : ''}>
                  {copy.status[quiz.status]}
                </span>
                {quiz.attempts > 0 && <span className="text-zinc-500"> · {copy.attempts(quiz.attempts)}</span>}
              </p>
            </li>
          )
        })}
      </ol>

      {/* The capstone sits at the bottom of the overview, not in a navigation
          slot of its own: it is the end of Stage 1, not a fifth subject. */}
      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-medium">
          {progress.allPassed ? (
            <Link href={`/${lang}/audit`} className="underline-offset-4 hover:underline">
              {copy.capstoneHeading}
            </Link>
          ) : (
            copy.capstoneHeading
          )}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.capstoneExplanation}</p>
        <p className="mt-2 text-sm">
          <span className="text-zinc-500">{copy.application}: </span>
          {progress.reportSubmitted
            ? copy.capstoneSubmitted
            : progress.allPassed
              ? copy.capstoneReady
              : copy.capstoneLocked}
        </p>
      </section>

      {progress.stepsDone === progress.stepsTotal && (
        <p className="text-sm font-medium text-green-700 dark:text-green-400">{copy.complete}</p>
      )}
    </main>
  )
}
