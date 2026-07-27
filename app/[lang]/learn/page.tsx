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
    intro: string
    stageProgress: string
    programmeStages: string
    open: string
    contentsTitle: string
    stageOne: string
    stageOneDetail: string
    done: (done: number, total: number) => string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    openQuiz: string
    capstoneHeading: string
    capstoneExplanation: string
    capstoneLocked: string
    locked: string
    capstoneOpen: string
    capstoneSubmitted: string
    stages: { name: string; detail: string }[]
    preparing: string
    visibility: string
  }
> = {
  en: {
    heading: 'Learn',
    intro: 'Choose any Competency and train the observation skill you need now.',
    stageProgress: 'Stage 1 progress',
    programmeStages: 'Programme stages',
    open: 'Open',
    contentsTitle: 'Programme contents',
    stageOne: 'Stage 1',
    stageOneDetail: 'Visible at a glance',
    done: (done, total) => `${done} / ${total} done`,
    status: {
      unstarted: 'Not started',
      'in-progress': 'In progress',
      passed: 'Passed',
    },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    openQuiz: 'Open the Gate Quiz',
    capstoneHeading: 'Self-Audit Report',
    capstoneExplanation:
      'The capstone: audit a real page unaided, using everything the four Competencies taught.',
    capstoneLocked: 'Unlocks when all four Gate Quizzes are passed.',
    locked: 'Locked',
    capstoneOpen: 'Open the Self-Audit Report',
    capstoneSubmitted: 'Submitted',
    stages: [
      { name: 'Stage 2', detail: 'Visible by walking the flow' },
      { name: 'Stage 3', detail: 'Visible only to someone else' },
    ],
    preparing: 'In preparation',
    visibility:
      'A programme maintainer can see your progress: your Stage 1 completion, how long since your last activity, and how many attempts each quiz took. Nothing ranks you against anyone.',
  },
  ko: {
    heading: '학습',
    intro: '원하는 역량부터 골라 지금 필요한 관찰력을 훈련하세요.',
    stageProgress: '1단계 진도',
    programmeStages: '프로그램 단계',
    open: '열림',
    contentsTitle: '목차',
    stageOne: '1단계',
    stageOneDetail: '한눈에 보이는 결함',
    done: (done, total) => `${total}개 중 ${done}개 완료`,
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    openQuiz: '관문 퀴즈 열기',
    capstoneHeading: '자가 점검 리포트',
    capstoneExplanation:
      '마무리 과제: 네 역량에서 배운 것으로, 도움 없이 실제 페이지를 감사합니다.',
    capstoneLocked: '관문 퀴즈 네 개를 모두 통과하면 열립니다.',
    locked: '잠김',
    capstoneOpen: '자가 점검 리포트 열기',
    capstoneSubmitted: '제출 완료',
    stages: [
      { name: '2단계', detail: '플로우를 따라가야 보이는 결함' },
      { name: '3단계', detail: '남이 봐야 보이는 결함' },
    ],
    preparing: '준비 중',
    visibility:
      '프로그램 관리자는 여러분의 진행 상황을 볼 수 있습니다 — 1단계 완료 현황, 마지막 활동이 얼마나 지났는지, 퀴즈마다 몇 번 시도했는지. 누구와도 순위를 매기지 않습니다.',
  },
}

/**
 * The capstone's mark in the station list. It carries a sheet of paper rather
 * than a fifth number, because the report is not a fifth Competency — and
 * because a number in a badge is what the four rows above already are. A
 * rotated badge was tried first and read as one more rounded square: same
 * shape family, so the difference never registered.
 */
function ReportMark({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  )
}

function StageCard({
  number,
  name,
  detail,
  status,
  state,
}: {
  number: number
  name: string
  detail: string
  status: string
  state: 'open' | 'preparing'
}) {
  const isOpen = state === 'open'

  return (
    <div className="rounded-card bg-surface p-5 text-ink shadow-card sm:p-[26px]">
      <div className="flex items-start justify-between gap-[14px]">
        <span
          aria-hidden
          className={`grid size-9 place-items-center rounded-full text-[12px] font-bold ${
            isOpen
              ? 'bg-oxblood text-white'
              : 'shadow-[inset_0_0_0_2px_var(--blue-grey)]'
          }`}
        >
          {number}
        </span>
        <span className="text-[12px] font-bold">{status}</span>
      </div>
      <h3 className="mt-4 text-[16px] leading-[1.4] font-bold tracking-[-0.015em] text-ink">
        {name}
      </h3>
      <p className="mt-1 text-[13.5px] leading-[1.55]">{detail}</p>
    </div>
  )
}

/**
 * Where a Learner lands (#20): the whole programme as one table of contents,
 * with Stage 1 expanded. Its Competencies are independent entry points rather
 * than a sequence; everything shown comes from this Learner's own records.
 */
export default async function Learn({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const progress = await progressFor(session.email)
  const competencies = content.config.stage1Competencies.map((slug) =>
    content.competencies.find((competency) => competency.slug === slug)!,
  )
  const completionPercent =
    progress.stepsTotal === 0
      ? 0
      : Math.min(100, Math.round((progress.stepsDone / progress.stepsTotal) * 100))

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="grid gap-5 px-1.5 pb-6 sm:grid-cols-[minmax(0,1fr)_240px] sm:items-end">
        <div>
          <h1 className="font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
            {copy.heading}
          </h1>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.55] text-ink">
            {copy.intro}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-[14px] text-[12px] font-bold">
            <span>{copy.stageProgress}</span>
            <span>{copy.done(progress.stepsDone, progress.stepsTotal)}</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-blue-grey/35"
            role="progressbar"
            aria-label={copy.stageProgress}
            aria-valuemin={0}
            aria-valuemax={progress.stepsTotal}
            aria-valuenow={progress.stepsDone}
          >
            <span
              className="block h-full rounded-full bg-oxblood"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      <section aria-label={copy.programmeStages}>
        <h2 className="sr-only">{copy.programmeStages}</h2>
        <div className="grid gap-[14px] sm:grid-cols-3">
          <StageCard
            number={1}
            name={copy.stageOne}
            detail={copy.stageOneDetail}
            status={copy.open}
            state="open"
          />
          {copy.stages.map((stage, index) => (
            <StageCard
              key={stage.name}
              number={index + 2}
              name={stage.name}
              detail={stage.detail}
              status={copy.preparing}
              state="preparing"
            />
          ))}
        </div>
      </section>

      <section className="mt-7" aria-labelledby="programme-contents">
        <div className="px-1.5">
          <h2
            id="programme-contents"
            className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink"
          >
            {copy.contentsTitle}
          </h2>
        </div>

        <div className="mt-[14px] grid gap-[14px]">
          {competencies.map((competency, index) => {
            const quiz = progress.quizzes[competency.slug]

            return (
              <article
                key={competency.slug}
                data-competency={competency.slug}
                data-quiz-status={quiz.status}
                className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span
                  aria-hidden
                  className={`grid size-11 place-items-center rounded-badge text-[12px] font-bold ${
                    quiz.status === 'passed'
                      ? 'bg-oxblood text-white'
                      : quiz.status === 'in-progress'
                        ? 'relative text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
                        : 'text-ink shadow-[inset_0_0_0_2px_var(--blue-grey)]'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                  {quiz.status === 'in-progress' && (
                    <span className="absolute right-1 bottom-1 size-1.5 rounded-full bg-oxblood" />
                  )}
                </span>

                <div className="min-w-0">
                  <h3 className="flex min-h-11 items-center text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                    <Link
                      href={`/${lang}/learn/${competency.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {competency.name[lang]}
                    </Link>
                  </h3>
                  <p className="mt-1 max-w-[62ch] text-[13.5px] leading-[1.55] text-ink-2">
                    {competency.objective[lang]}
                  </p>
                </div>

                <div className="flex min-w-0 flex-col gap-[14px] sm:items-end">
                  <p className="text-[12px] font-bold text-ink">
                    {copy.status[quiz.status]}
                    <span className="text-ink-2"> · {copy.attempts(quiz.attempts)}</span>
                  </p>
                  <Link
                    href={`/${lang}/learn/${competency.slug}/quiz`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-[12px] font-bold text-white shadow-pill transition-[filter] hover:brightness-90 motion-reduce:transition-none"
                  >
                    {copy.openQuiz}
                  </Link>
                </div>
              </article>
            )
          })}

          <article
            data-report-status={
              progress.reportSubmitted ? 'submitted' : progress.allPassed ? 'open' : 'locked'
            }
            className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
          >
            <span
              aria-hidden
              className={`grid size-11 place-items-center rounded-badge ${
                progress.reportSubmitted
                  ? 'bg-oxblood text-white'
                  : progress.allPassed
                    ? 'relative text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
                    : 'text-ink shadow-[inset_0_0_0_2px_var(--blue-grey)]'
              }`}
            >
              <ReportMark className="size-[19px]" />
              {progress.allPassed && !progress.reportSubmitted && (
                <span className="absolute right-1 bottom-1 size-1.5 rounded-full bg-oxblood" />
              )}
            </span>

            <div className="min-w-0">
              <h3 className="flex min-h-11 items-center text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                {copy.capstoneHeading}
              </h3>
              <p className="mt-1 max-w-[62ch] text-[13.5px] leading-[1.55] text-ink-2">
                {progress.allPassed ? copy.capstoneExplanation : copy.capstoneLocked}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-[14px] sm:items-end">
              <p className="text-[12px] font-bold text-ink">
                {progress.reportSubmitted
                  ? copy.capstoneSubmitted
                  : progress.allPassed
                    ? copy.open
                    : copy.locked}
              </p>
              {(progress.allPassed || progress.reportSubmitted) && (
                <Link
                  href={`/${lang}/audit`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-[12px] font-bold text-white shadow-pill transition-[filter] hover:brightness-90 motion-reduce:transition-none"
                >
                  {copy.capstoneOpen}
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Visible on the page every Learner lands on, before any first
          attempt — being watched is stated, not discovered (ADR-0005, #30). */}
      <p className="mt-3.5 px-2 text-[11px] leading-[1.7]">{copy.visibility}</p>
    </main>
  )
}
