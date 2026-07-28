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
    objective: string
    roleHint: string
    questionsHeading: string
    questionsExplanation: string
    articleTitle: string
    article: string
    quizPassed: string
    quizStart: (attempts: number) => string
    back: string
    station: (number: string) => string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    nextKicker: string
    quizTitle: string
    quizRules: (draw: number, threshold: number) => string
    items: (n: number) => string
    passedBody: string
  }
> = {
  en: {
    objective: 'Afterwards, you can',
    roleHint: 'Where to point it',
    questionsHeading: 'Carry these questions into the article',
    questionsExplanation: 'Read with a hypothesis rather than skimming — decide what you expect before the article answers.',
    articleTitle: 'The source article',
    article: 'Read the source article',
    quizPassed: 'Gate Quiz passed',
    quizStart: (attempts) => (attempts > 0 ? 'Retry the Gate Quiz' : 'Take the Gate Quiz'),
    back: 'All Competencies',
    station: (number) => `Stop ${number}`,
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    nextKicker: 'Do this next',
    quizTitle: 'Gate Quiz',
    quizRules: (draw, threshold) =>
      `${draw} items, drawn from this Competency's pool. ${threshold} correct passes.`,
    items: (n) => `${n} items`,
    passedBody: 'You can take it again whenever you like — every attempt is kept, and none replaces another.',
  },
  ko: {
    objective: '마치고 나면 할 수 있는 것',
    roleHint: '어디에 적용해 볼까',
    questionsHeading: '이 질문들을 들고 기사를 읽으세요',
    questionsExplanation: '훑어보는 대신 가설을 세우고 읽습니다 — 기사가 답하기 전에 스스로 예상해 보세요.',
    articleTitle: '원문 기사',
    article: '원문 기사 읽기',
    quizPassed: '관문 퀴즈 통과',
    quizStart: (attempts) => (attempts > 0 ? '관문 퀴즈 다시 도전' : '관문 퀴즈 시작'),
    back: '전체 역량 보기',
    station: (number) => `${number}번 역`,
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    nextKicker: '다음 할 일',
    quizTitle: '관문 퀴즈',
    quizRules: (draw, threshold) =>
      `이 역량의 문항 풀에서 ${draw}문항이 나옵니다. ${threshold}문항을 맞히면 통과합니다.`,
    items: (n) => `${n}문항`,
    passedBody: '원하는 때에 다시 도전할 수 있습니다 — 모든 시도가 남고, 어느 것도 다른 것을 지우지 않습니다.',
  },
}

/**
 * The state of this one station, in the three ways the design system requires
 * every status to read: colour, shape, and the word beside it.
 */
function StatusChip({ status, label }: { status: QuizStatus; label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
      <i
        aria-hidden
        className={`size-[11px] rounded-full ${
          status === 'passed'
            ? 'bg-oxblood'
            : status === 'in-progress'
              ? 'bg-linear-[90deg,var(--oxblood)_0_50%,#fff_50%_100%] shadow-[inset_0_0_0_2.5px_var(--oxblood)]'
              : 'bg-white shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
        }`}
      />
      {label}
    </span>
  )
}

/**
 * One Competency (#20): what the Learner should be able to do afterwards,
 * where to point it given their role, the questions to read the article with,
 * and the article itself. Flat route per ADR-0008 — no stage segment.
 *
 * The station between the line and the quiz, so it is drawn as one: the page
 * says which stop this is and how it stands, and the single warm card is the
 * Gate Quiz — the one thing there is to do here.
 */
export default async function CompetencyPage({
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

  const progress = await progressFor(session.email)
  const quiz = progress.quizzes[slug]
  const { drawSize, passThreshold } = content.config
  const station = String(content.config.stage1Competencies.indexOf(slug) + 1).padStart(2, '0')

  return (
    <main className="px-0.5">
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn`}
          className="inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.back}
        </Link>
      </nav>

      <div className="flex flex-wrap items-center gap-4 px-1.5 pb-5">
        <div>
          <h1 className="font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
            {competency.name[lang]}
          </h1>
          {/* The English name under the Korean one — a Learner reading Korean
              still has to recognise the term in a pull request written by the
              Indonesia cohort. In English there is nothing to put underneath. */}
          {lang === 'ko' && (
            <p className="mt-1.5 text-[11px] font-bold tracking-[0.2em] text-ink-2 uppercase">
              {competency.name.en}
            </p>
          )}
        </div>
        <div className="ml-auto flex flex-wrap gap-2.5">
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
            {copy.station(station)}
          </span>
          <StatusChip status={quiz.status} label={copy.status[quiz.status]} />
          {quiz.attempts > 0 && (
            <span className="rounded-full bg-surface px-[17px] py-[9px] text-[12px] font-bold shadow-pill">
              {copy.attempts(quiz.attempts)}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3.5 wide:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        {/* ── what this station is for, and where to aim it ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.objective}
          </h2>
          <p className="mt-3.5 max-w-[56ch] text-[16px] leading-[1.55]">
            {competency.objective[lang]}
          </p>

          {/* The same Competency pointed at this Learner's own work. It shares
              the card because it is not a second subject: it is the objective
              with an address on it. */}
          <h2 className="mt-[26px] border-t border-khaki/40 pt-[22px] font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.roleHint}
          </h2>
          <p className="mt-3.5 max-w-[56ch] text-[16px] leading-[1.55]">
            {competency.roleHint[lang]}
          </p>
        </section>

        {/* ── the one warm field: the single next action ── */}
        {quiz.status === 'passed' ? (
          // Nothing here is outstanding any more, so nothing here wears the
          // warm field — retrying is offered as a link, not as a second action.
          <section className="order-first flex flex-col rounded-card bg-surface p-5 shadow-card sm:p-[26px] wide:order-none">
            <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
              {copy.quizPassed}
            </h2>
            <p className="mt-3.5 flex-1 text-[16px] leading-[1.55]">{copy.passedBody}</p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 text-[16px] font-bold text-oxblood"
            >
              {copy.quizStart(quiz.attempts)}
            </Link>
          </section>
        ) : (
          <section className="order-first flex flex-col rounded-card bg-sand p-5 sm:p-[26px] shadow-warm wide:order-none">
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-2">
              {copy.nextKicker}
            </span>
            <h2 className="mt-2.5 font-serif text-[34px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {copy.quizTitle}
            </h2>
            <p className="mt-4 flex-1 text-[16px] leading-[1.55]">
              {copy.quizRules(drawSize, passThreshold)}
            </p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 flex w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
            >
              {copy.quizStart(quiz.attempts)}
              <span className="text-[12px] font-normal opacity-70">{copy.items(drawSize)}</span>
            </Link>
          </section>
        )}

        {/* ── the questions, and the article they are for ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.questionsHeading}
          </h2>
          <p className="mt-2.5 max-w-[56ch] text-[13.5px] leading-[1.55] text-ink-2">
            {copy.questionsExplanation}
          </p>
          <ol className="mt-5.5 flex flex-col gap-3.5">
            {competency.preReadingQuestions.map((question, index) => (
              <li
                key={question.en}
                className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-3.5"
              >
                <span className="grid size-[34px] place-items-center rounded-badge bg-sunk text-[12px] font-bold text-ink-2">
                  {index + 1}
                </span>
                <span className="max-w-[56ch] text-[16px] leading-[1.55]">{question[lang]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── what the questions are carried into ────────── */}
        <section className="flex flex-col rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <h2 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {copy.articleTitle}
          </h2>
          <p className="mt-3.5 text-[13.5px] leading-[1.55] text-ink-2">
            {competency.source.attribution}
          </p>

          {/* Korean-language Learners read the article in English with browser
              translation as an aid (ADR-0002) — never shown in English. */}
          {lang === 'ko' && competency.koTranslationNotice && (
            <p className="mt-4.5 rounded-badge bg-sunk p-[17px] text-[13.5px] leading-[1.55]">
              {competency.koTranslationNotice}
            </p>
          )}

          <a
            href={competency.source.url}
            className="mt-auto self-start pt-5.5 text-[16px] font-bold text-oxblood"
            target="_blank"
            rel="noreferrer"
          >
            {copy.article}
            <span aria-hidden> ↗</span>
          </a>
        </section>

      </div>
    </main>
  )
}
