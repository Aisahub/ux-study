import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LinkPending } from '@/app/[lang]/pending'
import { isLanguage, type Language } from '@/lib/language'
import { notesFor } from '@/lib/notes'
import { content } from '@/lib/server-content'

import { CompetencyShell, loadCompetency } from './shell'

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
    nextKicker: string
    quizTitle: string
    quizRules: (draw: number, threshold: number) => string
    items: (n: number) => string
    specimenTitle: string
    specimenBody: string
    specimenLink: string
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
    nextKicker: 'The final gate',
    quizTitle: 'Gate Quiz',
    quizRules: (draw, threshold) =>
      `${draw} items, drawn from this Competency's pool. ${threshold} correct passes.`,
    items: (n) => `${n} items`,
    specimenTitle: 'Practise reading a review',
    specimenBody:
      'A report we wrote about the Stage 1 Practice Page, with some Findings that hold up and some that do not. Judging somebody else’s review is the ability this Competency names, and this is where you can practise it. Nothing here is assessed and nothing is recorded.',
    specimenLink: 'Read the report',
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
    quizPassed: '퀴즈 통과',
    quizStart: (attempts) => (attempts > 0 ? '퀴즈 다시 도전' : '퀴즈 시작'),
    nextKicker: '마지막 관문',
    quizTitle: '퀴즈',
    quizRules: (draw, threshold) =>
      `이 역량의 문항 풀에서 ${draw}문항이 나옵니다. ${threshold}문항을 맞히면 통과합니다.`,
    items: (n) => `${n}문항`,
    specimenTitle: '리뷰 읽는 연습',
    specimenBody:
      '1단계 연습 페이지를 두고 저희가 써 둔 리포트입니다. 말이 되는 발견도 있고 그렇지 않은 것도 섞여 있습니다. 남이 한 점검을 판단하는 것이 이 역량이 말하는 능력이고, 여기서 그 연습을 해 볼 수 있습니다. 평가하지 않고, 기록도 남지 않습니다.',
    specimenLink: '리포트 읽기',
    passedBody: '원하는 때에 다시 도전할 수 있습니다 — 모든 시도가 남고, 어느 것도 다른 것을 지우지 않습니다.',
  },
}

/**
 * The head of one step: its place in the order, then what the step is.
 *
 * The numeral is the whole reason this panel reads as a sequence rather than
 * as four cards that happen to be stacked, so it is set in the display face at
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
 * The taught half of one Competency (#20): what the Learner should be able to
 * do afterwards, where to point it given their role, the questions to read the
 * article with, and the article itself. Flat route per ADR-0008 — no stage
 * segment. The Learner's own notes are the other panel, `notes/`.
 *
 * It is one numbered column, in the order the work is actually done: know what
 * you are after (01), take the questions (02), read the article (03), then
 * stand at the gate (04). It was a two-column grid until 2026-07-28, and the
 * grid put the Gate Quiz second on a wide screen and *first* on a phone — the
 * last step of the sequence was the loudest thing on the page and the first
 * thing a Learner met, before the article it examines. Two columns cannot
 * carry an order: reading order forks at the top of every row, so the only way
 * to say "this comes after that" is to put it after it.
 *
 * The notes step stood here as 04 for part of 2026-08-12, with the gate at 05.
 * Moving it to its own panel was a deliberate trade recorded in `shell.tsx`:
 * this column is short again, and a Learner writing a note can no longer see
 * the questions they were reading against. The four steps that remain are the
 * four that have to happen in order; writing is the one that does not.
 */
export default async function CompetencyPage({
  params,
}: {
  params: Promise<{ lang: string; competency: string }>
}) {
  const { lang, competency: slug } = await params
  if (!isLanguage(lang)) notFound()
  const { session, competency, quiz, station } = await loadCompetency(lang, slug)
  const copy = COPY[lang]

  // Only to number the other panel on the switch. This Learner's own notes and
  // nobody else's — the session's address is the only one this table is read
  // with anywhere in the application.
  const noteCount = (await notesFor(session.email, slug)).length
  const { drawSize, passThreshold } = content.config

  return (
    <CompetencyShell
      lang={lang}
      slug={slug}
      name={competency.name}
      quiz={quiz}
      station={station}
      active="competency"
      noteCount={noteCount}
    >
      <div className="flex flex-col gap-3.5">
        {/* ── 01 · what this station is for, and where to aim it ── */}
        <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <StepHead step="01">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.objective}
            </h2>
          </StepHead>
          <p className="mt-3.5 max-w-measure text-body">
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
                <p className="mt-2.5 max-w-measure text-body">
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
          <p className="mt-2.5 max-w-measure text-body-sm text-ink-2">
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
                <span className="max-w-measure text-body">{question[lang]}</span>
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
            <p className="mt-3.5 max-w-measure text-body">{copy.passedBody}</p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="mt-5.5 inline-flex text-title font-bold text-oxblood"
            >
              {copy.quizStart(quiz.attempts)}
            </Link>
          </section>
        ) : (
          // The one warm field, and it is where the order puts it: the last
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
            <p className="mt-4 max-w-measure text-body">
              {copy.quizRules(drawSize, passThreshold)}
            </p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="press relative mt-5.5 flex w-full items-center justify-center gap-2.5 rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
            >
              {copy.quizStart(quiz.attempts)}
              {/* body-sm, not the label step: this detail is set regular, and
                  label is a 700 step — pairing it with font-normal renders a
                  size and weight the scale does not name. */}
              <span className="text-body-sm font-normal opacity-70">{copy.items(drawSize)}</span>
              <LinkPending />
            </Link>
          </section>
        )}

        {/* Optional practice, on the one Competency that has an artefact to
            practise on (ADR-0011, #120). Deliberately unnumbered and after the
            gate, for the reason the notes panel carries no numeral either: a
            numeral would place it in the order the work is done, and this is
            not a step on the way to anything. It is a plain card rather than a
            warm one because the single sand field per screen belongs to the
            one thing to do next, which is the Gate Quiz above. */}
        {content.specimen?.competency === slug && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="font-serif text-headline font-bold text-ink">{copy.specimenTitle}</h2>
            <p className="mt-3.5 max-w-measure text-body-sm text-ink-2">{copy.specimenBody}</p>
            <Link
              href={`/${lang}/specimen`}
              className="press mt-5.5 inline-flex text-title font-bold text-oxblood"
            >
              {copy.specimenLink}
              <LinkPending />
            </Link>
          </section>
        )}
      </div>
    </CompetencyShell>
  )
}
