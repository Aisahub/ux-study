import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { competenciesOfStage } from '@/lib/content'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor, stageProgress, type QuizStatus } from '@/lib/progress'
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

/**
 * One Stage, in two arrangements.
 *
 * From `sm` it is the card DESIGN.md draws: mark and status on the first line,
 * the Stage's name and its one-line description beneath. Below `sm` the same
 * four pieces become a single row inside the strip's shared card — mark, name
 * and status across one line, the description under the name.
 *
 * The reason is what a phone's first screen was spending. Three separate
 * stacked cards cost 446px to say "Stage 1 is open and the other two are not
 * written yet", which is 53% of an iPhone viewport, and pushed the first
 * Competency — the only thing on this page a Learner can act on — entirely
 * below the fold. Drop-out is this programme's failure mode, and a first
 * screen carrying no work is where it starts.
 *
 * The grouping does not change with the band, only the container count: three
 * cards in a row above `sm`, three rows in one card below it. Both read as one
 * object, which is what the strip is.
 */
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
    <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-x-3.5 text-ink sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-x-[14px] sm:rounded-card sm:bg-surface sm:p-[26px] sm:shadow-card">
      <span
        aria-hidden
        className={`col-start-1 row-start-1 grid size-7 place-items-center rounded-full text-label font-bold sm:size-9 ${
          isOpen ? 'bg-oxblood text-white' : 'shadow-[inset_0_0_0_2px_var(--blue-grey)]'
        }`}
      >
        {number}
      </span>
      <span className="col-start-3 row-start-1 justify-self-end text-label font-bold sm:col-start-2">
        {status}
      </span>
      <h3 className="col-start-2 row-start-1 min-w-0 text-title font-bold text-ink sm:col-span-2 sm:col-start-1 sm:row-start-2 sm:mt-[14px]">
        {name}
      </h3>
      <p className="col-span-2 col-start-2 row-start-2 mt-1 text-body-sm text-ink-2 sm:col-span-2 sm:col-start-1 sm:row-start-3">
        {detail}
      </p>
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

  // Stage 1's alone, which is all this overview opens today; #79 is where the
  // later two arrive on it.
  const stage1 = stageProgress(await progressFor(session.email), 1)
  const competencies = competenciesOfStage(content.config, 1).map((slug) =>
    content.competencies.find((competency) => competency.slug === slug)!,
  )
  const completionPercent =
    stage1.stepsTotal === 0
      ? 0
      : Math.min(100, Math.round((stage1.stepsDone / stage1.stepsTotal) * 100))

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="grid gap-[22px] px-1.5 pb-[26px] sm:grid-cols-[minmax(0,1fr)_240px] sm:items-end">
        <div>
          <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
          <p className="mt-3 max-w-[58ch] text-body text-ink">{copy.intro}</p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-[14px] text-label font-bold">
            <span>{copy.stageProgress}</span>
            <span>{copy.done(stage1.stepsDone, stage1.stepsTotal)}</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-blue-grey/35"
            role="progressbar"
            aria-label={copy.stageProgress}
            aria-valuemin={0}
            aria-valuemax={stage1.stepsTotal}
            aria-valuenow={stage1.stepsDone}
            // Without this a screen reader announces a bare "20%", which counts
            // nothing a Learner can name. The visible line beside the bar
            // already says what is being counted; this makes them say it alike.
            aria-valuetext={copy.done(stage1.stepsDone, stage1.stepsTotal)}
          >
            <span
              className="block h-full rounded-full bg-oxblood"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Labelled by its own heading rather than by a duplicate `aria-label`,
          which made a screen reader announce the region's name twice — and
          left two sibling sections on one page naming themselves two
          different ways. */}
      <section aria-labelledby="programme-stages">
        <h2 id="programme-stages" className="sr-only">
          {copy.programmeStages}
        </h2>
        <div className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card sm:grid-cols-3 sm:bg-transparent sm:p-0 sm:shadow-none">
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

      <section className="mt-[26px]" aria-labelledby="programme-contents">
        <div className="px-1.5">
          <h2 id="programme-contents" className="font-serif text-headline font-bold text-ink">
            {copy.contentsTitle}
          </h2>
        </div>

        <div className="mt-[14px] grid gap-[14px]">
          {competencies.map((competency, index) => {
            const quiz = stage1.quizzes[competency.slug]

            return (
              <article
                key={competency.slug}
                data-competency={competency.slug}
                data-quiz-status={quiz.status}
                className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-start"
              >
                <span
                  aria-hidden
                  className={`grid size-11 place-items-center rounded-badge text-label font-bold ${
                    quiz.status === 'passed'
                      ? 'bg-oxblood text-white'
                      : quiz.status === 'in-progress'
                        ? 'text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood),inset_0_-5px_0_0_var(--oxblood)]'
                        : 'text-ink shadow-[inset_0_0_0_2px_var(--blue-grey)]'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  {/* The 44px row height belongs to the link, not to the
                      heading around it. It was on the heading, so the row
                      looked like a 44px target and only the 22px of text
                      actually answered a tap. */}
                  <h3 className="text-title font-bold">
                    <Link
                      href={`/${lang}/learn/${competency.slug}`}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                    >
                      {competency.name[lang]}
                    </Link>
                  </h3>
                  <p className="mt-1 max-w-[56ch] text-body-sm text-ink-2">
                    {competency.objective[lang]}
                  </p>
                </div>

                <div className="flex min-w-0 flex-col gap-[14px] sm:items-end">
                  {/* The 44px is what holds this line level with the row's
                      name and mark. The inner span is load-bearing: as direct
                      flex children the status and the attempt count become
                      separate flex items, and flex layout drops the space
                      before the separator. */}
                  <p className="text-label font-bold text-ink sm:flex sm:min-h-11 sm:items-center">
                    <span>
                      {copy.status[quiz.status]}
                      <span className="text-ink-2"> · {copy.attempts(quiz.attempts)}</span>
                    </span>
                  </p>
                  <Link
                    href={`/${lang}/learn/${competency.slug}/quiz`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-label font-bold text-white shadow-pill transition-[filter] hover:brightness-90 motion-reduce:transition-none"
                  >
                    {copy.openQuiz}
                  </Link>
                </div>
              </article>
            )
          })}

          <article
            data-report-status={
              stage1.reportSubmitted ? 'submitted' : stage1.allPassed ? 'open' : 'locked'
            }
            className="grid gap-[14px] rounded-card bg-surface p-[26px] shadow-card sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-start"
          >
            <span
              aria-hidden
              className={`grid size-11 place-items-center rounded-badge ${
                stage1.reportSubmitted
                  ? 'bg-oxblood text-white'
                  : stage1.allPassed
                    ? 'text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood),inset_0_-5px_0_0_var(--oxblood)]'
                    : 'text-ink shadow-[inset_0_0_0_2px_var(--blue-grey)]'
              }`}
            >
              <ReportMark className="size-[19px]" />
            </span>

            <div className="min-w-0">
              {/* Not a link, so the 44px lives on the heading here — it is
                  holding the row's first line level with the mark beside it,
                  not offering a target. */}
              <h3 className="flex min-h-11 items-center text-title font-bold">
                {copy.capstoneHeading}
              </h3>
              <p className="mt-1 max-w-[56ch] text-body-sm text-ink-2">
                {stage1.allPassed ? copy.capstoneExplanation : copy.capstoneLocked}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-[14px] sm:items-end">
              <p className="text-label font-bold text-ink sm:flex sm:min-h-11 sm:items-center">
                {stage1.reportSubmitted
                  ? copy.capstoneSubmitted
                  : stage1.allPassed
                    ? copy.open
                    : copy.locked}
              </p>
              {(stage1.allPassed || stage1.reportSubmitted) && (
                <Link
                  href={`/${lang}/audit`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-label font-bold text-white shadow-pill transition-[filter] hover:brightness-90 motion-reduce:transition-none"
                >
                  {copy.capstoneOpen}
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Visible on the page every Learner lands on, before any first
          attempt — being watched is stated, not discovered (ADR-0005, #30).

          Body-sm, the step DESIGN.md names for this notice, and held to the
          reading measure. It was 11px running the full width of the board —
          the smallest type and the longest line on a page whose second
          Competency teaches that those two are how text stops being readable.
          A notice about who can see you may not be the fine print. Full ink,
          not faded: this sits on the bed rather than on a white card, and the
          fade is allowed only on white. */}
      <p className="mt-3.5 max-w-[56ch] px-1.5 text-body-sm">{copy.visibility}</p>
    </main>
  )
}
