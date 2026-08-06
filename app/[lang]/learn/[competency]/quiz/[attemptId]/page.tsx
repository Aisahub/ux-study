import Link from 'next/link'
import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import { LinkPending } from '@/app/[lang]/pending'
import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { shuffledOrder } from '@/lib/quiz'
import { content, itemScreenCss } from '@/lib/server-content'

import { AttemptMark } from '../attempt-mark'
import { ItemScreen, ItemSequence } from './screen'
import { QuizWizard } from './wizard'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    verdictPassed: string
    verdictFailed: string
    score: (score: number, of: number) => string
    passedExplanation: string
    /** Points down at the review, saying first how many went the other way. */
    reviewNote: (missed: number, of: number) => string
    failedExplanation: string
    summaryHeading: string
    reviewHeading: string
    wrongHeading: string
    /** The verdict on one item, said in a word beside the mark that draws it. */
    itemCorrect: string
    itemMissed: string
    yourChoice: string
    noChoice: string
    keyedAnswer: string
    coveredIn: string
    /** Said out loud for a Learner who cannot see the arrow that says it. */
    opensNewTab: string
    retry: string
    backToLearn: string
    backToCompetency: string
    /** The heading over the way out, so the exit is not an unlabelled pair of pills. */
    whatNow: string
    article: string
  }
> = {
  en: {
    verdictPassed: 'Passed',
    verdictFailed: 'Not passed',
    score: (score, of) => `${score} of ${of} correct.`,
    passedExplanation: 'This Competency is cleared.',
    // Said as plainly as the Korean says it. This read "one item went the
    // other way… the keyed answer" until 2026-08-06: a euphemism the Korean
    // did not soften, and a piece of this project's own scoring vocabulary
    // (CONTEXT.md reserves "answer key" for exactly that) offered to a Learner
    // who is not assumed to have any. Parity is equal difficulty, not
    // translation coverage (PRODUCT.md, Product Principle 2).
    reviewNote: (missed, of) =>
      missed === 0
        ? `All ${of} items are below, with the answer and the grounds for it.`
        : `You got ${missed === 1 ? '1 item' : `${missed} items`} wrong — all ${of} items are below, with the answer and the grounds for it.`,
    summaryHeading: 'The key points',
    failedExplanation:
      'Below are the items you missed and where the article covers each one. The answers stay hidden — reread, then draw a fresh set.',
    reviewHeading: 'The answers',
    wrongHeading: 'Worth another look',
    itemCorrect: 'Correct',
    itemMissed: 'Missed',
    yourChoice: 'You chose',
    noChoice: 'You left this one unanswered.',
    keyedAnswer: 'The answer',
    coveredIn: 'Covered in',
    opensNewTab: 'opens in a new tab',
    retry: 'Try again now',
    backToLearn: 'Back to the overview',
    backToCompetency: 'Back to this Competency',
    whatNow: 'Where to next',
    article: 'the article',
  },
  ko: {
    verdictPassed: '통과',
    verdictFailed: '미통과',
    score: (score, of) => `${of}문항 중 ${score}문항 정답.`,
    passedExplanation: '이 역량을 통과했습니다.',
    reviewNote: (missed, of) =>
      missed === 0
        ? `${of}문항 모두 아래에 정답과 그 근거가 있습니다.`
        : `${missed}문항은 틀렸습니다 — ${of}문항 모두 아래에 정답과 그 근거가 있습니다.`,
    summaryHeading: '핵심 요약',
    failedExplanation:
      '아래는 틀린 문항과, 기사에서 그 내용을 다루는 위치입니다. 정답은 공개하지 않습니다 — 다시 읽고, 새로 뽑힌 문항으로 도전하세요.',
    reviewHeading: '문항별 정답과 해설',
    wrongHeading: '다시 볼 문항',
    itemCorrect: '맞힘',
    itemMissed: '틀림',
    yourChoice: '고른 답',
    noChoice: '이 문항에는 답하지 않았습니다.',
    keyedAnswer: '정답',
    coveredIn: '다루는 절',
    opensNewTab: '새 탭에서 열림',
    retry: '지금 다시 도전',
    backToLearn: '학습 개요로',
    backToCompetency: '이 역량 페이지로',
    whatNow: '다음으로',
    article: '기사',
  },
}

/**
 * One attempt (#21): the wizard while it is open, the verdict once submitted.
 * Both render in the language of the URL — the attempt no longer owns it
 * (ADR-0008 amendment, 2026-07-23).
 *
 * What a missed item is told depends on the verdict, and the two are not the
 * same page in disguise. **Failure** names the missed items and their article
 * sections and nothing else (#22): a Learner who is about to retry and has been
 * shown the answer no longer needs the article, which is what ADR-0006's retry
 * amendment closes. **A pass** names them and gives the keyed answer with the
 * grounds for it (2026-08-05): the gate is behind them, so there is no retry
 * for the answer to convert, and a Learner who passed 4 of 5 was otherwise left
 * knowing only that one of the five had gone wrong somewhere. It gives them for
 * every drawn item rather than only the missed ones: on four options, a Learner
 * who eliminated their way to the answer and one who saw it look the same from
 * here, and only one of them has learnt anything.
 */
export default async function AttemptPage({
  params,
}: {
  params: Promise<{ lang: string; competency: string; attemptId: string }>
}) {
  const { lang, competency: slug, attemptId } = await params
  if (!isLanguage(lang)) notFound()
  const id = Number.parseInt(attemptId, 10)
  if (!Number.isInteger(id)) notFound()

  const session = await requireSession(lang)
  const [attempt] = await db.select().from(schema.attempts).where(eq(schema.attempts.id, id))
  // Someone else's attempt is indistinguishable from no attempt.
  if (!attempt || attempt.email !== session.email || attempt.competency !== slug) notFound()

  const pool = content.items[slug]
  const items = attempt.drawn.map((itemSlug) => pool.find((item) => item.slug === itemSlug)!)

  if (!attempt.submittedAt) {
    // Open, and rendered in the language of the URL like every other page. The
    // switch used to be forbidden here and the URL bent to the attempt; it is
    // allowed now, and the answers picked so far are persisted, so crossing
    // over mid-attempt costs a Learner nothing.
    return (
      <QuizWizard
        lang={lang}
        attemptId={attempt.id}
        screenCss={itemScreenCss}
        initialChoices={attempt.draft ?? {}}
        items={items.map((item) => {
          const order = shuffledOrder(`${attempt.id}:${item.slug}`, item.options[lang].length)
          return {
            slug: item.slug,
            artefact: item.artefact[lang],
            screen: item.screen?.[lang],
            sequence: item.sequence?.map((step) => ({
              caption: step.caption[lang],
              html: step.screen[lang],
            })),
            prompt: item.prompt[lang],
            // Original indices survive the shuffle so scoring is order-blind;
            // the keyed flag itself must never travel to the client (#22).
            options: order.map((index) => ({
              index,
              text: item.options[lang][index].text,
              reason: item.options[lang][index].reason,
            })),
          }
        })}
      />
    )
  }

  // Submitted: the verdict, in the language of the URL like any other page —
  // the attempt owns the language only while it is open.
  const copy = COPY[lang]
  const competency = content.competencies.find((entry) => entry.slug === slug)!
  const wrong = (attempt.selections ?? []).filter((selection) => !selection.correct)
  /**
   * Whether this verdict draws the artefacts, which decides how wide it is.
   *
   * Only a passed attempt explains its items, so only a passed attempt puts
   * drawn screens on the page — and a screen is examined rather than read, so
   * it does not fit the column prose is measured in. A `720px` column leaves
   * `664px` inside its card, and the screens are authored to a `720px` floor:
   * every one of them was panned, on a desktop, with the pan hint suppressed
   * above `sm`. On the item where two panes are compared, the pane being
   * asked about was the half cut off.
   *
   * `880` is the wizard's own below-`wide` width, and it is here for the same
   * reason it is there — it is what this platform already spends on a quiz
   * surface that carries a drawn screen. It stops there rather than going on
   * to the `1240` content column: the wizard earns that width by seating the
   * screen beside its options, and at `1240` this card still cannot (720 of
   * screen, a 26 gap and 400 of words exceed what the card holds), so the
   * step would buy nothing but blank space beside two columns of prose.
   *
   * A failed verdict draws nothing and stays the 720 reading column.
   */
  const explainsItems = attempt.passed && (attempt.selections ?? []).length > 0

  return (
    // A column like the doorstep and the wizard: the attempt is one thread,
    // and it ends the way it began rather than spreading back onto the grid
    // the map pages use.
    <main className={`mx-auto w-full px-0.5 ${explainsItems ? 'max-w-[880px]' : 'max-w-[720px]'}`}>
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn`}
          className="press inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.backToLearn}
        </Link>
      </nav>

      {/* The verdict, told the three ways this platform tells every status
          (DESIGN.md's first Do): the word, and beside it the mark's colour and
          its fill. It was the word alone until 2026-08-06 — on the one screen
          whose entire purpose is to say how the attempt came out, and where
          `통과` and `미통과` differ by a syllable while the two screens share a
          silhouette. Every other status on the platform obeyed the rule,
          including each item inside this page's own card.

          The mark, not a coloured heading: The Headings Are Ink Rule. */}
      <h1 className="flex items-center gap-3.5 px-1.5 pb-5 font-serif text-display font-bold text-ink">
        <AttemptMark state={attempt.passed ? 'passed' : 'failed'} size={24} />
        {attempt.passed ? copy.verdictPassed : copy.verdictFailed}
      </h1>

      <div className="flex flex-col gap-3.5">
        {attempt.passed ? (
          // Nothing is outstanding, so nothing here wears the warm field.
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <p className="max-w-measure text-body">
              {copy.score(attempt.score ?? 0, attempt.drawn.length)} {copy.passedExplanation}{' '}
              {copy.reviewNote(wrong.length, attempt.drawn.length)}
            </p>
          </section>
        ) : (
          // The one warm field: the single next action, which is to go again.
          // The prose points down at the list below before the button is
          // pressed — the retry is offered, not urged.
          <section className="rounded-card bg-sand p-5 sm:p-[26px] shadow-warm">
            <p className="max-w-measure text-body">
              {copy.score(attempt.score ?? 0, attempt.drawn.length)} {copy.failedExplanation}
            </p>
            <Link
              href={`/${lang}/learn/${slug}/quiz`}
              className="press relative mt-5.5 flex w-full items-center justify-center rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
            >
              {copy.retry}
              <LinkPending />
            </Link>
          </section>
        )}

        {/* The whole draw on a passed attempt, answered. It sits above the
            recap because it is this Learner's own five items, and the recap is
            the general one everyone who passes reads; a summary first would be
            read instead of the items it is meant to follow.

            Every item, not only the missed ones (2026-08-05). A tick against an
            item says nothing about why it was right, and on four options a
            Learner who eliminated their way to the answer looks identical to
            one who saw it — those are exactly the passes worth explaining. The
            cost is that a draw of 5 puts most of an 8-item pool's answers on
            one page, and it is a cost rather than a leak: the gate is already
            behind this Learner, so there is no attempt left for the answers to
            convert. */}
        {attempt.passed && (attempt.selections ?? []).length > 0 && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.reviewHeading}
            </h2>
            {/* Every `다루는 절` below leads to an English article, and this
                card is where a Korean Learner meets that fact — the Competency
                page says it in the same words and this screen said nothing,
                so the language change arrived unannounced. Said once for the
                card rather than on each of five links. */}
            {lang === 'ko' && competency.koTranslationNotice && (
              <p className="mt-3.5 rounded-badge bg-sunk p-[17px] text-body-sm">
                {competency.koTranslationNotice}
              </p>
            )}
            <div className="mt-4.5 flex flex-col">
              {/* In the order they were drawn, which is the order they were
                  answered in: a Learner rereads by walking back through the
                  attempt they remember, not through a list sorted by verdict. */}
              {(attempt.selections ?? []).map((selection) => {
                const item = items.find((candidate) => candidate.slug === selection.item)!
                const options = item.options[lang]
                const keyed = options.find((option) => option.correct)
                // An item reworded since the attempt was scored can leave the
                // stored index pointing nowhere. The verdict itself was frozen
                // at submission and stays right; only the reprint of what was
                // chosen is unavailable, and it is left out rather than guessed.
                const chosen = selection.choice >= 0 ? options[selection.choice] : undefined
                return (
                  /*
                    Each item folds, and a missed one starts open (2026-08-05).
                    Five explained items is a long card, and the Learner who
                    asked for it wants their own five in a shape they can scan
                    — but the item that went the other way is the one they came
                    for, so it is not something to go looking for behind a
                    press. The four they got right are offered rather than
                    served: closed, named, and one press away.

                    `<details>`, not a state hook. The page is a server
                    component and there is nothing here worth shipping a
                    bundle for: this way it folds before hydration, folds with
                    JavaScript off, answers the keyboard, and tells a screen
                    reader whether it is open — all of which a hand-built
                    toggle would have to earn back.
                  */
                  <details
                    key={selection.item}
                    open={!selection.correct}
                    className="group border-b border-khaki/40 last:border-b-0"
                  >
                    <summary
                      // `press` is the whole of how a control answers being
                      // touched here: `globals.css` scopes hover and press to
                      // `:where(button, .press)`, and a `<summary>` is neither.
                      // Without it these five rows were the only pressable
                      // thing in the app that stayed silent under a finger —
                      // the exact defect the commit before this feature landed
                      // ("make every control answer a press before it answers
                      // the request") was written to remove, reintroduced on
                      // the screen a Learner reaches by passing the Competency
                      // that teaches Perceived clickability.
                      //
                      // The native triangle is dropped for the caret below,
                      // which is the one that can sit where this layout needs
                      // it and turn when the item opens.
                      className="press grid cursor-pointer list-none grid-cols-[14px_minmax(0,1fr)] items-start gap-3.5 py-[15px] [&::-webkit-details-marker]:hidden"
                    >
                      {/* Filled for an item that was answered, hollow for one
                          that went the other way — the same two marks the
                          stations wear inside the attempt, meaning the same
                          thing. The word beside it carries the state too: with
                          both verdicts in one list, a mark alone would leave a
                          Learner who cannot see it unable to tell which was
                          which. */}
                      <i
                        aria-hidden
                        className={`mt-[3px] size-[14px] rounded-full ${
                          selection.correct
                            ? 'bg-oxblood'
                            : 'shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
                        }`}
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-label font-bold text-ink-2">
                          {selection.correct ? copy.itemCorrect : copy.itemMissed}
                          {/* Something has to say this row can be pressed. A
                              row that opens on click and looks exactly like a
                              row that does not is the Perceived clickability
                              defect this platform's fourth Competency teaches
                              — committed on the screen a Learner reaches by
                              passing it. It sits against the status word
                              rather than out at the right edge: on a 720px
                              column that edge is most of a screen away from
                              the words it belongs to, and an affordance the
                              eye has to go find is one it does not find. The
                              caret turns rather than swapping glyph, so one
                              object reports both states. */}
                          {/* `motion-reduce:transition-none` drops the turn,
                              never the turned state: the caret still points
                              the other way when the item is open, it just
                              stops travelling there. A Learner who asked for
                              less motion asked for less movement, not less
                              information. Every other piece of motion in this
                              app already declares this — the pending spinner
                              carries `motion-reduce:animate-none`, and the
                              global press rule has its own reduced-motion
                              block — and this caret was the one exception. */}
                          <span
                            aria-hidden
                            className="inline-block transition-transform group-open:rotate-180 motion-reduce:transition-none"
                          >
                            ▾
                          </span>
                        </span>
                        <span className="mt-1.5 block max-w-measure text-title font-bold">
                          {item.prompt[lang]}
                        </span>
                      </span>
                    </summary>

                    {/* Indented to the text column — 14px of mark plus the
                        14px gap — so the answer reads as belonging to the
                        prompt above it rather than starting a new row. */}
                    <div className="pb-[15px] pl-[28px] group-last:pb-0.5">
                      {/*
                        The artefact, before anything said about it. Without it
                        this card was a receipt rather than an explanation: the
                        prompts are written about a thing — "이 흐린 화면은…",
                        "어디이고" — and the answers name parts of it ("B안"),
                        so every line here was addressed to a screen that was
                        not on the page. An Attempt is a permanent record the
                        doorstep links back to, so "the Learner will remember
                        it" stops being true within a week.

                        ADR-0006's "one channel, not two" still holds and is
                        why the prose stays the frame's accessible name rather
                        than being printed beside it — a paragraph saying the
                        button is light grey answers the item in words. That
                        the answer is already given above does not license
                        printing both: a Learner rereading this is checking
                        their own judgement against the screen, and a
                        description of the defect does that work for them.

                        Drawn at the same floor width as everywhere else, so
                        what is examined here is what was examined during the
                        attempt. Narrow screens pan it rather than reflowing
                        it — the arrangement is frequently the question.
                      */}
                      {/* Pulled out of the text indent to the card's own inner
                          edge. The words are indented because they belong to
                          the prompt above them; the artefact is the widest
                          thing here and every pixel it gives up is a pixel the
                          Learner has to pan to.

                          Capped at the floor, not merely floored. `Frame` sets
                          `w-full min-w-(--item-screen-floor)`, so in a box
                          wider than 720 the screen stretches — and a screen
                          given more room than it was drawn for is no longer
                          the arrangement the item asked about, which on these
                          items is the question itself. DESIGN.md settled this
                          for the wizard's two-column row: the screen sits at
                          exactly its floor. It sits there here too. */}
                      <div className="mb-3.5 -ml-[28px] w-full max-w-(--item-screen-floor)">
                        {item.sequence ? (
                          <ItemSequence
                            slug={`review:${item.slug}`}
                            lang={lang}
                            steps={item.sequence.map((step) => ({
                              caption: step.caption[lang],
                              html: step.screen[lang],
                            }))}
                            css={itemScreenCss}
                            description={item.artefact[lang]}
                          />
                        ) : item.screen ? (
                          <ItemScreen
                            slug={`review:${item.slug}`}
                            lang={lang}
                            html={item.screen[lang]}
                            css={itemScreenCss}
                            description={item.artefact[lang]}
                          />
                        ) : (
                          // The format ADR-0006 also allows: an item whose
                          // artefact is described rather than drawn. Same sunk
                          // box the wizard gives it, so the two surfaces do not
                          // disagree about what a described artefact looks like.
                          <div className="rounded-badge bg-sunk p-[17px] text-body whitespace-pre-line">
                            {item.artefact[lang]}
                          </div>
                        )}
                      </div>

                      <div>
                          {/* Only where it differs from the answer. On an item
                              they got right the two lines would be the same
                              sentence twice, and the second one would be read
                              as a correction that is not there. */}
                          {!selection.correct && (
                            <p className="max-w-measure text-body-sm text-ink-2">
                              {chosen ? `${copy.yourChoice}: ${chosen.text}` : copy.noChoice}
                            </p>
                          )}
                          {/* Absent only if the item has been reworded since
                              this attempt was scored so that no option carries
                              the key any more — the same stale-data case the
                              chosen line above answers by omitting rather than
                              guessing. The verdict itself was frozen at
                              submission and stays right either way; what is
                              lost is the reprint, and the article section
                              below still says where to read. */}
                          {keyed && (
                            <p className="mt-1 max-w-measure text-body-sm">
                              <span className="font-bold">
                                {copy.keyedAnswer}: {keyed.text}
                              </span>
                              {/* The grounds, which are the explanation: the
                                  same sentence the item already carries under
                                  each option, so the answer is explained by the
                                  content rather than by a second thing to
                                  author. */}
                              <span className="mt-1 block text-ink-2">{keyed.reason}</span>
                            </p>
                          )}
                          <p className="mt-2.5 text-body-sm text-ink-2">
                            {copy.coveredIn}:{' '}
                            <a
                              href={competency.source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-oxblood"
                            >
                              {item.sourceSection}
                              <span aria-hidden> ↗</span>
                              {/* The arrow says "new tab" to everyone who can
                                  see it and to nobody who cannot, so the words
                                  are here too. Being moved to a new context
                                  without being told is disorienting for a
                                  screen-reader Learner in a way it is not for
                                  anyone else. */}
                              <span className="sr-only"> ({copy.opensNewTab})</span>
                            </a>
                          </p>
                      </div>
                    </div>
                  </details>
                )
              })}
            </div>
          </section>
        )}

        {/* The written explanation (#29) lands here rather than on the Competency
            page: read before the quiz it is a second thing to study, read after
            passing it is the recap of what the Learner has just shown they can
            do. It is withheld on a failed attempt on purpose — that screen sends
            the Learner back to the article section by section (ADR-0006), and a
            summary offered in its place would be read instead of the article. */}
        {attempt.passed && competency.explanation && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="font-serif text-headline font-bold text-ink">
              {copy.summaryHeading}
            </h2>
            <p className="mt-3.5 max-w-measure text-body whitespace-pre-line">
              {competency.explanation[lang]}
            </p>
          </section>
        )}

        {!attempt.passed && wrong.length > 0 && (
          <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
            <h2 className="mb-4.5 font-serif text-headline font-bold text-ink">
              {copy.wrongHeading}
            </h2>
            <div className="flex flex-col">
              {wrong.map((selection) => {
                const item = items.find((candidate) => candidate.slug === selection.item)!
                return (
                  <div
                    key={selection.item}
                    className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-3.5 border-b border-khaki/40 py-[15px] last:border-b-0 last:pb-0.5"
                  >
                    {/* A hollow blue-grey ring: real, and not yet reached. The
                        same mark an unvisited station wears, because that is
                        exactly what this item still is. */}
                    <i
                      aria-hidden
                      className="mt-[7px] size-[14px] rounded-full shadow-[inset_0_0_0_2.5px_var(--blue-grey)]"
                    />
                    <span>
                      <span className="block max-w-measure text-title font-bold">
                        {item.prompt[lang]}
                      </span>
                      <span className="mt-1 block text-body-sm text-ink-2">
                        {copy.coveredIn}:{' '}
                        <a
                          href={competency.source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-oxblood"
                        >
                          {item.sourceSection}
                          <span aria-hidden> ↗</span>
                          <span className="sr-only"> ({copy.opensNewTab})</span>
                        </a>
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/*
          The way out, at the end of the reading rather than only at the top.

          A passed attempt had no forward action anywhere on it: the only
          navigation was the back pill above the title, and on a phone the
          Learner finishes the recap some 2,700px below it. This is the most
          motivated moment in the programme — they have just cleared a
          Competency — and the screen went quiet at exactly that point.
          PRODUCT.md names drop-out the primary failure mode and says an
          unclear "what now" is how it starts.

          Links in pills, not a sand card. Passing leaves nothing outstanding,
          so there is no single next action for a warm field to carry (The One
          Warm Field Rule), and on the failed attempt the warm field is already
          spent on the retry. And no `next` Competency is named: Stage 1 may be
          taken in any order, and naming one would invent the sequence The No
          False Current Rule exists to refuse. Two ways back, no ranking of
          them.
        */}
        <nav aria-labelledby="what-now" className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
          <h2 id="what-now" className="font-serif text-headline font-bold text-ink">
            {copy.whatNow}
          </h2>
          <div className="mt-4.5 flex flex-wrap gap-2.5">
            <Link
              href={`/${lang}/learn/${slug}`}
              className="press inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
            >
              <span aria-hidden>←</span>
              {copy.backToCompetency}
            </Link>
            <Link
              href={`/${lang}/learn`}
              className="press inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
            >
              <span aria-hidden>←</span>
              {copy.backToLearn}
            </Link>
          </div>
        </nav>
      </div>
    </main>
  )
}
