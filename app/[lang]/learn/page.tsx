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
    routeTitle: string
    understanding: string
    application: string
    remaining: (left: number) => string
    complete: string
    competencyCount: (n: number) => string
    done: (done: number, total: number) => string
    here: string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    listTitle: string
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
    aheadTitle: string
    stages: { name: string; detail: string }[]
    preparing: string
    visibility: string
  }
> = {
  en: {
    heading: 'Learn',
    stage: 'Stage 1 · Visible at a glance',
    routeTitle: 'The Stage 1 line',
    understanding: 'Understanding',
    application: 'Application',
    remaining: (left) => (left === 1 ? '1 stop to go' : `${left} stops to go`),
    complete: 'Every stop reached',
    competencyCount: (n) => `${n} competencies`,
    done: (done, total) => `${done} / ${total} done`,
    here: 'You are here',
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    listTitle: 'Stations',
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
    aheadTitle: 'After this line',
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
    routeTitle: '1단계 노선',
    understanding: '이해',
    application: '적용',
    // The old copy read "5단계 중 2단계 완료", which used 단계 for a step as
    // well as for a Stage — the one word CONTEXT.md reserves for the three
    // Stages. Counting is 개 now, and 단계 means only what the glossary says.
    remaining: (left) => `${left}개 남았습니다`,
    complete: '모든 역에 도착했습니다',
    competencyCount: (n) => `역량 ${n}개`,
    done: (done, total) => `${total}개 중 ${done}개 완료`,
    here: '현재 위치',
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    listTitle: '역 목록',
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
    aheadTitle: '이 노선 다음',
    stages: [
      { name: '2단계', detail: '플로우를 따라가야 보이는 결함' },
      { name: '3단계', detail: '남이 봐야 보이는 결함' },
    ],
    preparing: '준비 중',
    visibility:
      '프로그램 관리자는 여러분의 진행 상황을 볼 수 있습니다 — 1단계에서 어디까지 왔는지, 마지막 활동이 얼마나 지났는지, 퀴즈마다 몇 번 시도했는지. 누구와도 순위를 매기지 않습니다.',
  },
}

type StopState = QuizStatus | 'terminus-locked' | 'terminus-open' | 'terminus-done'

/** The connector to the previous stop. Solid behind you, dotted ahead. */
const TRACK =
  "before:absolute before:top-[31px] before:right-1/2 before:-left-1/2 before:h-1 before:rounded-sm before:bg-oxblood before:content-['']"
const TRACK_AHEAD =
  "before:absolute before:top-[31px] before:right-1/2 before:-left-1/2 before:h-0 before:border-t-4 before:border-dotted before:border-blue-grey before:content-['']"

/**
 * A station mark. Shape carries the state as well as colour does — filled,
 * half, hollow, and a rotated square for the terminus — because a Learner who
 * cannot separate the two colours still has to be able to read this line.
 */
function Mark({ state }: { state: StopState }) {
  const terminus = state.startsWith('terminus')
  const reached = state === 'passed' || state === 'terminus-done'
  const current = state === 'in-progress' || state === 'terminus-open'

  return (
    <span
      aria-hidden
      className={[
        'relative z-1 mx-auto block size-6',
        terminus ? 'rotate-45 rounded-[7px]' : 'rounded-full',
        reached
          ? 'bg-oxblood shadow-[inset_0_0_0_4px_var(--oxblood)]'
          : current
            ? 'bg-linear-[90deg,var(--oxblood)_0_50%,#fff_50%_100%] shadow-[inset_0_0_0_4px_var(--oxblood)]'
            : 'bg-white shadow-[inset_0_0_0_4px_var(--blue-grey)]',
      ].join(' ')}
    />
  )
}

function Stop({
  state,
  label,
  meta,
  first,
  here,
}: {
  state: StopState
  label: string
  meta: string
  first?: boolean
  here?: string
}) {
  const ahead = state === 'unstarted' || state === 'terminus-locked'
  return (
    <div className={`relative pt-6 text-center ${first ? '' : ahead ? TRACK_AHEAD : TRACK}`}>
      {here && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-[0.14em] whitespace-nowrap">
          ▼ {here}
        </span>
      )}
      <Mark state={state} />
      <span
        className={`mt-[15px] block px-1.5 text-[13.5px] leading-[1.4] ${ahead ? '' : 'font-bold'}`}
      >
        {label}
      </span>
      <span className="mt-[5px] block text-[12px] font-bold text-ink-2">{meta}</span>
    </div>
  )
}

/**
 * Where a Learner lands (#20): the whole of Stage 1 as one line — four
 * Competencies and the report that closes them, with the position marked, so
 * a programme with no deadline still reads as finite. Everything shown is
 * derived from this Learner's own records; nobody else's progress is queried,
 * so none can leak.
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
  const terminusState: StopState = progress.reportSubmitted
    ? 'terminus-done'
    : progress.allPassed
      ? 'terminus-open'
      : 'terminus-locked'

  const left = progress.stepsTotal - progress.stepsDone

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

      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        {/* ── the line ─────────────────────────────────── */}
        <section className="rounded-card bg-surface p-[30px] shadow-card">
          <div className="mb-4.5 flex items-baseline gap-3">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.routeTitle}
            </h2>
            <p className="ml-auto text-[12px] font-bold text-ink-2">
              {left === 0 ? copy.complete : copy.remaining(left)}
            </p>
          </div>

          {/* The two things Stage 1 assesses, kept apart: four Gate Quizzes
              test that a Learner understands, the report tests that they can
              apply it unaided. Losing this distinction loses why the last
              stop is shaped differently from the other four. */}
          <div className="mt-6 grid grid-cols-5 text-[11px] font-bold tracking-[0.2em] text-ink-2">
            <span className="col-span-4">{copy.understanding}</span>
            <span className="col-span-1 text-center">{copy.application}</span>
          </div>

          <div className="mt-2 grid grid-cols-5">
            {competencies.map((competency, index) => {
              const quiz = progress.quizzes[competency.slug]
              return (
                <Stop
                  key={competency.slug}
                  first={index === 0}
                  state={quiz.status}
                  label={competency.name[lang]}
                  meta={
                    quiz.attempts > 0
                      ? `${copy.status[quiz.status]} · ${copy.attempts(quiz.attempts)}`
                      : copy.status[quiz.status]
                  }
                  here={nextCompetency?.slug === competency.slug ? copy.here : undefined}
                />
              )
            })}
            <Stop
              state={terminusState}
              label={copy.capstoneHeading}
              meta={progress.reportSubmitted ? copy.capstoneSubmitted : ''}
              here={!nextCompetency && !progress.reportSubmitted ? copy.here : undefined}
            />
          </div>
        </section>

        {/* ── the one warm field: the single next action ── */}
        {nextCompetency ? (
          <section className="flex flex-col rounded-card bg-sand p-[26px] shadow-warm">
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-2">
              {copy.nextKicker}
            </span>
            <h2 className="mt-2.5 font-serif text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {nextCompetency.name[lang]}
            </h2>
            <p className="mt-4 flex-1 text-[16px] leading-[1.55]">{nextCompetency.objective[lang]}</p>
            <Link
              href={`/${lang}/learn/${nextCompetency.slug}/quiz`}
              className="mt-5.5 flex w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
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
          // Nothing left to do, so nothing wears the warm field.
          <section className="rounded-card bg-surface p-[26px] shadow-card">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.completeHeading}
            </h2>
            <p className="mt-2.5 text-[16px] leading-[1.55]">{copy.completeBody}</p>
          </section>
        ) : (
          <section className="flex flex-col rounded-card bg-sand p-[26px] shadow-warm">
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-2">
              {copy.nextKicker}
            </span>
            <h2 className="mt-2.5 font-serif text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {copy.capstoneHeading}
            </h2>
            <p className="mt-4 flex-1 text-[16px] leading-[1.55]">{copy.capstoneExplanation}</p>
            <Link
              href={`/${lang}/audit`}
              className="mt-5.5 flex w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
            >
              {copy.capstoneOpen}
            </Link>
          </section>
        )}

        {/* ── every station, as a way in ────────────────── */}
        <section className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 className="mb-4.5 font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.listTitle}
          </h2>
          <div className="flex flex-col">
            {competencies.map((competency, index) => {
              const quiz = progress.quizzes[competency.slug]
              return (
                <Link
                  key={competency.slug}
                  href={`/${lang}/learn/${competency.slug}`}
                  className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5"
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
                  <span className="text-[12px] font-bold whitespace-nowrap text-ink-2">
                    {quiz.attempts > 0 ? copy.attempts(quiz.attempts) : ''}
                  </span>
                </Link>
              )
            })}

            {/* The report is a station too, so it belongs in the station
                list — and a locked stop has to say what unlocks it. */}
            <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 border-t border-khaki/40 py-[15px]">
              <span
                className={`grid size-10 rotate-45 place-items-center rounded-badge text-[12px] font-bold ${
                  progress.reportSubmitted
                    ? 'bg-oxblood text-white'
                    : progress.allPassed
                      ? 'text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
                      : 'bg-sunk text-ink-2 shadow-[inset_0_0_0_2px_var(--blue-grey)]'
                }`}
              >
                <span className="-rotate-45">05</span>
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
              <span className="text-[12px] font-bold whitespace-nowrap text-ink-2">
                {progress.reportSubmitted ? copy.capstoneSubmitted : ''}
              </span>
            </div>
          </div>
        </section>

        {/* ── real, and not yet open ────────────────────── */}
        <section className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 className="mb-4.5 font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.aheadTitle}
          </h2>
          <div className="flex flex-col">
            {copy.stages.map((stage) => (
              <div
                key={stage.name}
                className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5"
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
                <span className="text-[12px] font-bold whitespace-nowrap text-ink-2">
                  {copy.preparing}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Visible on the page every Learner lands on, before any first
          attempt — being watched is stated, not discovered (ADR-0005, #30). */}
      <p className="px-2 text-[11px] leading-[1.7]">{copy.visibility}</p>
    </main>
  )
}
