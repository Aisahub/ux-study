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
    contentsTitle: string
    stageOne: string
    competencyCount: (n: number) => string
    done: (done: number, total: number) => string
    here: string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    nextKicker: string
    continueQuiz: string
    startQuiz: string
    items: (n: number) => string
    capstoneHeading: string
    capstoneExplanation: string
    capstoneLocked: string
    capstoneOpen: string
    capstoneSubmitted: string
    completeHeading: string
    completeBody: string
    stages: { name: string; detail: string }[]
    preparing: string
    visibility: string
  }
> = {
  en: {
    heading: 'Learn',
    stage: 'Stage 1 · Visible at a glance',
    contentsTitle: 'Programme contents',
    stageOne: 'Stage 1',
    competencyCount: (n) => `${n} competencies`,
    done: (done, total) => `${done} / ${total} done`,
    here: 'You are here',
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    nextKicker: 'Next stop',
    continueQuiz: 'Continue the Gate Quiz',
    startQuiz: 'Start the Gate Quiz',
    items: (n) => `${n} items`,
    capstoneHeading: 'Self-Audit Report',
    capstoneExplanation:
      'The capstone: audit a real page unaided, using everything the four Competencies taught.',
    capstoneLocked: 'Unlocks when all four Gate Quizzes are passed.',
    capstoneOpen: 'Open the Self-Audit Report',
    capstoneSubmitted: 'Submitted',
    completeHeading: 'Stage 1 complete',
    completeBody: 'Four Gate Quizzes passed and the Self-Audit Report submitted.',
    stages: [
      { name: 'Stage 2', detail: 'Visible by walking the flow' },
      { name: 'Stage 3', detail: 'Visible only to someone else' },
    ],
    preparing: 'In preparation',
    visibility:
      'A programme maintainer can see your progress: your position in Stage 1, how long since your last activity, and how many attempts each quiz took. Nothing ranks you against anyone.',
  },
  ko: {
    heading: '학습',
    stage: '1단계 · 한눈에 보이는 결함',
    contentsTitle: '목차',
    stageOne: '1단계',
    competencyCount: (n) => `역량 ${n}개`,
    done: (done, total) => `${total}개 중 ${done}개 완료`,
    here: '현재 위치',
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    nextKicker: '다음 역',
    continueQuiz: '관문 퀴즈 이어서 하기',
    startQuiz: '관문 퀴즈 시작하기',
    items: (n) => `${n}문항`,
    capstoneHeading: '자가 점검 리포트',
    capstoneExplanation: '마무리 과제: 네 역량에서 배운 것으로, 도움 없이 실제 페이지를 감사합니다.',
    capstoneLocked: '관문 퀴즈 네 개를 모두 통과하면 열립니다.',
    capstoneOpen: '자가 점검 리포트 열기',
    capstoneSubmitted: '제출 완료',
    completeHeading: '1단계 수료',
    completeBody: '관문 퀴즈 네 개를 모두 통과하고 자가 점검 리포트를 제출했습니다.',
    stages: [
      { name: '2단계', detail: '플로우를 따라가야 보이는 결함' },
      { name: '3단계', detail: '남이 봐야 보이는 결함' },
    ],
    preparing: '준비 중',
    visibility:
      '프로그램 관리자는 여러분의 진행 상황을 볼 수 있습니다 — 1단계에서 어디까지 왔는지, 마지막 활동이 얼마나 지났는지, 퀴즈마다 몇 번 시도했는지. 누구와도 순위를 매기지 않습니다.',
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

/**
 * Where a Learner lands (#20): the whole programme as one table of contents,
 * with Stage 1 expanded and the current position marked. Everything shown is
 * derived from this Learner's own records; nobody else's progress is queried.
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

  // The next stop is the first competency not yet passed; once they are all
  // passed it is the report, and once that is in there is no next stop at all.
  const nextCompetency = competencies.find(
    (competency) => progress.quizzes[competency.slug].status !== 'passed',
  )
  return (
    <main className="px-0.5">
      <div className="flex flex-wrap items-center gap-4 px-1.5 pb-5">
        <h1 className="font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
          {copy.heading}
        </h1>
        <div className="ml-auto flex flex-wrap gap-2.5">
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
            {copy.stage}
          </span>
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
            {copy.competencyCount(competencies.length)}
          </span>
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
            {copy.done(progress.stepsDone, progress.stepsTotal)}
          </span>
        </div>
      </div>

      <div className="grid gap-3.5">
        {/* One table of contents establishes the whole programme and current
            position before the page asks the Learner to take the next action. */}
        <section className="rounded-card bg-surface p-5 shadow-card sm:p-[26px]">
          <div className="mb-3 flex flex-wrap items-baseline gap-3">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.contentsTitle}
            </h2>
            <p className="ml-auto text-[12px] font-bold text-ink-2">
              {copy.done(progress.stepsDone, progress.stepsTotal)}
            </p>
          </div>

          <h3 className="border-b border-khaki/60 py-3 text-[12px] font-bold tracking-[0.2em] text-ink-2">
            {copy.stageOne}
          </h3>
          <div className="flex flex-col">
            {competencies.map((competency, index) => {
              const quiz = progress.quizzes[competency.slug]
              const rowMeta = [
                nextCompetency?.slug === competency.slug ? copy.here : null,
                copy.status[quiz.status],
                quiz.attempts > 0 ? copy.attempts(quiz.attempts) : null,
              ]
                .filter(Boolean)
                .join(' · ')

              return (
                <Link
                  key={competency.slug}
                  href={`/${lang}/learn/${competency.slug}`}
                  className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5 sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span
                    className={`grid size-10 place-items-center rounded-badge text-[12px] font-bold ${
                      quiz.status === 'passed'
                        ? 'bg-oxblood text-white'
                        : quiz.status === 'in-progress'
                          ? 'text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
                          : 'bg-sunk text-ink-2 shadow-[inset_0_0_0_2px_var(--blue-grey)]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                      {competency.name[lang]}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-[1.55] text-ink-2">
                      {competency.objective[lang]}
                    </span>
                  </span>
                  {/* Narrow, there is no third column to hold this without
                      squeezing the objective into a ribbon, so the count drops
                      under the name it belongs to. */}
                  <span className="col-start-2 mt-1.5 text-[12px] font-bold whitespace-nowrap text-ink-2 empty:mt-0 sm:col-start-auto sm:mt-0">
                    {rowMeta}
                  </span>
                </Link>
              )
            })}

            {/* The report is a station too, so it belongs in the station
                list — and a locked stop has to say what unlocks it. */}
            <div className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3.5 border-t border-khaki/40 py-[15px] sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:items-center">
              <span
                className={`grid size-10 place-items-center rounded-badge ${
                  progress.reportSubmitted
                    ? 'bg-oxblood text-white'
                    : progress.allPassed
                      ? 'text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
                      : 'bg-sunk text-ink-2 shadow-[inset_0_0_0_2px_var(--blue-grey)]'
                }`}
              >
                <ReportMark className="size-[19px]" />
              </span>
              <span>
                <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                  {copy.capstoneHeading}
                </span>
                <span className="mt-0.5 block text-[13.5px] leading-[1.55] text-ink-2">
                  {progress.reportSubmitted
                    ? copy.capstoneExplanation
                    : progress.allPassed
                      ? copy.capstoneExplanation
                      : copy.capstoneLocked}
                </span>
              </span>
              <span className="col-start-2 mt-1.5 text-[12px] font-bold whitespace-nowrap text-ink-2 empty:mt-0 sm:col-start-auto sm:mt-0">
                {progress.reportSubmitted
                  ? copy.capstoneSubmitted
                  : !nextCompetency
                    ? copy.here
                    : ''}
              </span>
            </div>
          </div>

          <div className="mt-2 border-t border-khaki/60 pt-2">
            {copy.stages.map((stage) => (
              <div
                key={stage.name}
                className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-x-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5 sm:grid-cols-[14px_minmax(0,1fr)_auto] sm:items-center"
              >
                <i className="size-[14px] rounded-full shadow-[inset_0_0_0_2.5px_var(--blue-grey)]" />
                <span>
                  <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
                    {stage.name}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-[1.55] text-ink-2">
                    {stage.detail}
                  </span>
                </span>
                <span className="col-start-2 mt-1.5 text-[12px] font-bold whitespace-nowrap text-ink-2 sm:col-start-auto sm:mt-0">
                  {copy.preparing}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* The state-dependent action comes only after the whole route. */}
        {nextCompetency ? (
          <section className="flex flex-col rounded-card bg-sand p-5 shadow-warm sm:p-[26px]">
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-2">
              {copy.nextKicker}
            </span>
            <h2 className="mt-2.5 font-serif text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {nextCompetency.name[lang]}
            </h2>
            <p className="mt-4 flex-1 text-[16px] leading-[1.55]">{nextCompetency.objective[lang]}</p>
            <Link
              href={`/${lang}/learn/${nextCompetency.slug}/quiz`}
              className="mt-5.5 flex min-h-11 w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
            >
              {progress.quizzes[nextCompetency.slug].status === 'in-progress'
                ? copy.continueQuiz
                : copy.startQuiz}
              <span className="text-[12px] font-normal opacity-70">
                {copy.items(content.config.drawSize)}
              </span>
            </Link>
          </section>
        ) : progress.reportSubmitted ? (
          <section className="rounded-card bg-surface p-5 shadow-card sm:p-[26px]">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.completeHeading}
            </h2>
            <p className="mt-2.5 text-[16px] leading-[1.55]">{copy.completeBody}</p>
          </section>
        ) : (
          <section className="flex flex-col rounded-card bg-sand p-5 shadow-warm sm:p-[26px]">
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-2">
              {copy.nextKicker}
            </span>
            <h2 className="mt-2.5 font-serif text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {copy.capstoneHeading}
            </h2>
            <p className="mt-4 flex-1 text-[16px] leading-[1.55]">{copy.capstoneExplanation}</p>
            <Link
              href={`/${lang}/audit`}
              className="mt-5.5 flex min-h-11 w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
            >
              {copy.capstoneOpen}
            </Link>
          </section>
        )}
      </div>

      {/* Visible on the page every Learner lands on, before any first
          attempt — being watched is stated, not discovered (ADR-0005, #30). */}
      <p className="px-2 text-[11px] leading-[1.7]">{copy.visibility}</p>
    </main>
  )
}
