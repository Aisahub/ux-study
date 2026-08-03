import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { competenciesOfStage, stageOf } from '@/lib/content'
import { isLanguage, type Language } from '@/lib/language'
import { progressFor, stageProgress, type QuizStatus } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    objective: string
    roleHint: string
    roles: { developer: string; pm: string }
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
    roles: { developer: 'Developers', pm: 'PMs' },
    questionsHeading: 'Carry these questions into the article',
    questionsExplanation: 'Read with a hypothesis rather than skimming — decide what you expect before the article answers.',
    articleTitle: 'The source article',
    article: 'Read the source article',
    quizPassed: 'Gate Quiz passed',
    quizStart: (attempts) => (attempts > 0 ? 'Retry the Gate Quiz' : 'Take the Gate Quiz'),
    back: 'All Competencies',
    station: (number) => `Lesson ${number}`,
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    nextKicker: 'The final gate',
    quizTitle: 'Gate Quiz',
    quizRules: (draw, threshold) =>
      `${draw} items, drawn from this Competency's pool. ${threshold} correct passes.`,
    items: (n) => `${n} items`,
    passedBody: 'You can take it again whenever you like — every attempt is kept, and none replaces another.',
  },
  ko: {
    objective: '마치고 나면 할 수 있는 것',
    roleHint: '어디에 적용해 볼까',
    roles: { developer: '개발자라면', pm: 'PM이라면' },
    questionsHeading: '이 질문들을 들고 기사를 읽으세요',
    questionsExplanation: '훑어보는 대신 가설을 세우고 읽습니다 — 기사가 답하기 전에 스스로 예상해 보세요.',
    articleTitle: '원문 기사',
    article: '원문 기사 읽기',
    quizPassed: '관문 퀴즈 통과',
    quizStart: (attempts) => (attempts > 0 ? '관문 퀴즈 다시 도전' : '관문 퀴즈 시작'),
    back: '전체 역량 보기',
    station: (number) => `레슨 ${number}`,
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    nextKicker: '마지막 관문',
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
    <span className="flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
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
 * The head of one step: its place in the order, then what the step is.
 *
 * The numeral is the whole reason this page reads as a sequence rather than as
 * four cards that happen to be stacked, so it is set in the display face at
 * the headline size and given a fixed column — the four of them line up down
 * the left edge of the column and the four headings start at the same x.
 *
 * It is `aria-hidden` because a screen reader already has the order: the cards
 * are read in it. "01" spoken before every heading would be the sequence said
 * twice, and the second time as noise.
 *
 * `mutedNumeral` exists for the one card that is not white. Ink at 72% is
 * measured against white and drops below AA on the sand field, so the warm
 * card's numeral is full ink and separates by being the display face instead.
 */
function StepHead({
  step,
  children,
  mutedNumeral = true,
}: {
  step: string
  children: React.ReactNode
  mutedNumeral?: boolean
}) {
  return (
    // `break-keep` because the numeral takes width the heading used to have,
    // and Korean without it breaks inside a word — 할 수 있 / 는 것. English
    // is unaffected: it already only breaks at spaces. The gutter is narrower
    // on a phone, where those same pixels are the ones the heading needs.
    <div className="grid grid-cols-[26px_minmax(0,1fr)] items-baseline gap-x-2.5 break-keep sm:grid-cols-[34px_minmax(0,1fr)] sm:gap-x-3.5">
      <span
        aria-hidden
        className={`font-serif text-headline font-bold ${
          mutedNumeral ? 'text-ink-2' : 'text-ink'
        }`}
      >
        {step}
      </span>
      {children}
    </div>
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
 *
 * It is one numbered column, in the order the work is actually done: know what
 * you are after (01), take the questions (02), read the article (03), then
 * stand at the gate (04). It was a two-column grid until now, and the grid put
 * the Gate Quiz second on a wide screen and *first* on a phone — the last step
 * of the sequence was the loudest thing on the page and the first thing a
 * Learner met, before the article it examines. Two columns cannot carry an
 * order: reading order forks at the top of every row, so the only way to say
 * "this comes after that" is to put it after it.
 */
export default async function CompetencyPage({
  params,
}: {
  params: Promise<{ lang: string; competency: string }>
}) {
  const { lang, competency: slug } = await params
  if (!isLanguage(lang)) notFound()
  const competency = content.competencies.find((entry) => entry.slug === slug)
  const stage = stageOf(content.config, slug)
  if (!competency || stage === null) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const quiz = stageProgress(await progressFor(session.email), stage).quizzes[slug]
  const { drawSize, passThreshold } = content.config
  // Numbered within its own Stage, so Stage 1 still counts 1–4. The Stage a
  // Learner is standing in is what the number is a position inside; counting
  // 1–12 across the programme would make it a distance from Completion, which
  // is the cumulative figure PRODUCT.md rules out.
  //
  // Padded to two digits, because /learn's list badges this same position as
  // 01–04 and a Learner arriving from that list must be able to see they are
  // standing on the row they clicked. The padding was the wrong call only while
  // a counter followed it: `01번` counts nothing in Korean. With the counter
  // gone the numeral is a label, and it matches the label the list already uses.
  const station = String(competenciesOfStage(content.config, stage).indexOf(slug) + 1).padStart(2, '0')

  return (
    // A column, the width the Gate Quiz doorstep next door uses. The
    // Competency is one thread of reading that ends at that doorstep, and
    // handing it the full working area would only widen the cards around a
    // measure that is fixed at 56ch anyway.
    <main className="mx-auto w-full max-w-[720px] px-0.5">
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn`}
          className="inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.back}
        </Link>
      </nav>

      <div className="flex flex-wrap items-center gap-4 px-1.5 pb-5">
        <div>
          <h1 className="font-serif text-display font-bold text-ink">
            {competency.name[lang]}
          </h1>
          {/* The English name under the Korean one — a Learner reading Korean
              still has to recognise the term in a pull request written by the
              Indonesia cohort. In English there is nothing to put underneath. */}
          {lang === 'ko' && (
            <p className="mt-1.5 text-micro font-bold text-ink-2 uppercase">
              {competency.name.en}
            </p>
          )}
        </div>
        <div className="ml-auto flex flex-wrap gap-2.5">
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
            {copy.station(station)}
          </span>
          <StatusChip status={quiz.status} label={copy.status[quiz.status]} />
          {quiz.attempts > 0 && (
            <span className="rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
              {copy.attempts(quiz.attempts)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* ── 01 · what this station is for, and where to aim it ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <StepHead step="01">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.objective}
            </h2>
          </StepHead>
          <p className="mt-3.5 max-w-[56ch] text-body">
            {competency.objective[lang]}
          </p>

          {/* The same Competency pointed at this Learner's own work. It shares
              the card because it is not a second subject: it is the objective
              with an address on it — so it takes no number of its own. */}
          <h3 className="mt-[26px] border-t border-khaki/40 pt-[22px] font-serif text-headline font-bold text-ink">
            {copy.roleHint}
          </h3>
          {/* One block per role, each under the role's own name. Both hints ran
              as a single paragraph until 2026-08-03, and a developer had to
              read the PM's half before finding out it was not addressed to
              them — the two are alternatives, and a paragraph is the one shape
              that cannot say so. The role word is a sunk chip rather than a
              heading: it addresses a reader, it does not open a section. */}
          <div className="mt-4.5 flex flex-col gap-5">
            {(['developer', 'pm'] as const).map((role) => (
              <div key={role}>
                <span className="inline-flex rounded-full bg-sunk px-2.5 py-1 text-label font-bold text-ink-2">
                  {copy.roles[role]}
                </span>
                <p className="mt-2.5 max-w-[56ch] text-body">
                  {competency.roleHint[role][lang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 · the questions to carry into the reading ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <StepHead step="02">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.questionsHeading}
            </h2>
          </StepHead>
          <p className="mt-2.5 max-w-[56ch] text-body-sm text-ink-2">
            {copy.questionsExplanation}
          </p>
          {/* The question markers are sunk chips rather than a second run of
              display numerals: inside a step, the ordinals belong to the step,
              and only the four step numbers own the column's left edge. */}
          <ol className="mt-5.5 flex flex-col gap-3.5">
            {competency.preReadingQuestions.map((question, index) => (
              <li
                key={question.en}
                className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-3.5"
              >
                <span className="grid size-[34px] place-items-center rounded-badge bg-sunk text-label font-bold text-ink-2">
                  {index + 1}
                </span>
                <span className="max-w-[56ch] text-body">{question[lang]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 03 · what the questions are carried into ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <StepHead step="03">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.articleTitle}
            </h2>
          </StepHead>
          <p className="mt-3.5 text-body-sm text-ink-2">
            {competency.source.attribution}
          </p>

          {/* Korean-language Learners read the article in English with browser
              translation as an aid (ADR-0002) — never shown in English. */}
          {lang === 'ko' && competency.koTranslationNotice && (
            <p className="mt-4.5 rounded-badge bg-sunk p-[17px] text-body-sm">
              {competency.koTranslationNotice}
            </p>
          )}

          <a
            href={competency.source.url}
            className="mt-5.5 inline-flex text-title font-bold text-oxblood"
            target="_blank"
            rel="noreferrer"
          >
            {copy.article}
            <span aria-hidden> ↗</span>
          </a>
        </section>

        {/* ── 04 · the gate the three steps above lead to ── */}
        {quiz.status === 'passed' ? (
          // Nothing here is outstanding any more, so nothing here wears the
          // warm field — retrying is offered as a link, not as a second action.
          <section className="rounded-card bg-surface p-5 shadow-card sm:p-[26px]">
            <StepHead step="04">
              <h2 className="font-serif text-headline font-bold text-ink">
                {copy.quizPassed}
              </h2>
            </StepHead>
            <p className="mt-3.5 max-w-[56ch] text-body">{copy.passedBody}</p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 inline-flex text-title font-bold text-oxblood"
            >
              {copy.quizStart(quiz.attempts)}
            </Link>
          </section>
        ) : (
          // The one warm field, and now it is where the order puts it: the last
          // card rather than the first thing a Learner meets. It says it is the
          // last of the four, not that it is the next thing to do — before the
          // article is read, "do this next" was not true.
          <section className="rounded-card bg-sand p-5 sm:p-[26px] shadow-warm">
            {/* Full ink, not the 72% fade: that value is measured against
                white and is marginal on the sand field. */}
            <span className="mb-2.5 block text-micro font-bold text-ink">
              {copy.nextKicker}
            </span>
            <StepHead step="04" mutedNumeral={false}>
              <h2 className="font-serif text-headline-lg font-bold text-ink">
                {copy.quizTitle}
              </h2>
            </StepHead>
            <p className="mt-4 max-w-[56ch] text-body">
              {copy.quizRules(drawSize, passThreshold)}
            </p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 flex w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
            >
              {copy.quizStart(quiz.attempts)}
              {/* body-sm, not the label step: this detail is set regular, and
                  label is a 700 step — pairing it with font-normal renders a
                  size and weight the scale does not name. */}
              <span className="text-body-sm font-normal opacity-70">{copy.items(drawSize)}</span>
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}
