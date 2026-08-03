'use client'

import { useState, useTransition } from 'react'

import type { Language } from '@/lib/language'

import { saveDraft, submitAttempt } from '../actions'
import { ItemScreen, ItemSequence } from './screen'

interface WizardItem {
  slug: string
  artefact: string
  /** The drawn screen, where the item has one; otherwise the artefact is read. */
  screen?: string
  /** The drawn states, where the item's artefact only exists across time (#64). */
  sequence?: { caption: string; html: string }[]
  prompt: string
  /** Shuffled for display; index is the option's authored position, which is what scoring understands. */
  options: { index: number; text: string; reason: string }[]
}

const COPY: Record<
  Language,
  {
    progress: (n: number, of: number) => string
    stop: (n: number) => string
    answered: string
    notAnswered: string
    here: string
    back: string
    forward: string
    submit: string
    submitting: string
    unanswered: (n: number) => string
  }
> = {
  en: {
    progress: (n, of) => `Item ${n} of ${of}`,
    stop: (n) => `Item ${n}`,
    answered: 'Answered',
    notAnswered: 'Not answered',
    here: 'You are here',
    back: 'Back',
    forward: 'Next',
    submit: 'Submit all answers',
    submitting: 'Scoring…',
    unanswered: (n) => (n === 1 ? '1 item is still unanswered.' : `${n} items are still unanswered.`),
  },
  ko: {
    progress: (n, of) => `${of}문항 중 ${n}번째`,
    stop: (n) => `${n}번 문항`,
    answered: '답함',
    notAnswered: '아직',
    here: '현재 위치',
    back: '이전',
    forward: '다음',
    submit: '전체 제출',
    submitting: '채점 중…',
    unanswered: (n) => `아직 답하지 않은 문항이 ${n}개 있습니다.`,
  },
}

/** The connector to the previous stop. Solid behind the marker, dotted ahead. */
const TRACK =
  "before:absolute before:top-[41px] before:right-1/2 before:-left-1/2 before:h-1 before:rounded-sm before:bg-oxblood before:content-['']"
const TRACK_AHEAD =
  "before:absolute before:top-[41px] before:right-1/2 before:-left-1/2 before:h-0 before:border-t-4 before:border-dotted before:border-blue-grey before:content-['']"

/**
 * One drawn item as a station on the line, and the way back to it. The mark
 * says whether the item has been answered — filled if it has, a hollow ring if
 * it has not — and the line behind the marker says how far along the Learner
 * is. Two channels, two different facts: a Learner can be standing on item 5
 * with item 2 still blank, and one channel cannot draw both.
 *
 * A station is a real button. DESIGN.md asks for an unanswered item the
 * Learner can click back to, and the same click has to work on a station they
 * have already answered — otherwise checking an earlier answer means stepping
 * back one item at a time.
 */
function ItemStop({
  label,
  short,
  meta,
  answered,
  behind,
  first,
  here,
  onSelect,
}: {
  label: string
  /** The same stop said in the room a phone gives it: the number alone. */
  short: string
  meta: string
  answered: boolean
  behind: boolean
  first: boolean
  here?: string
  onSelect: () => void
}) {
  return (
    <div className={`relative pt-[34px] text-center ${first ? '' : behind ? TRACK : TRACK_AHEAD}`}>
      {/* The one pointing element the design system allows on a screen: the
          label in a sunk chip with the point below it drawn, so it lands on
          the mark's centre line rather than wherever a text glyph falls. */}
      {here && (
        <span className="absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <span className="rounded-full bg-sunk px-2.5 py-1 text-micro font-bold whitespace-nowrap">
            {here}
          </span>
          <span aria-hidden className="size-0 border-x-4 border-t-5 border-x-transparent border-t-sunk" />
        </span>
      )}
      <button
        type="button"
        onClick={onSelect}
        // The two lines below are separate blocks, so read as contents they
        // run together — "1번 문항답함". Said once, with the space in it.
        aria-label={`${label} · ${meta}`}
        aria-current={here ? 'step' : undefined}
        className="block w-full cursor-pointer rounded-badge pb-1.5"
      >
        <span
          aria-hidden
          className={`relative z-1 mx-auto block size-6 rounded-full ${
            answered
              ? 'bg-oxblood shadow-[inset_0_0_0_4px_var(--oxblood)]'
              : 'bg-white shadow-[inset_0_0_0_4px_var(--blue-grey)]'
          }`}
        />
        {/* Five stops across a phone leave about 55px each, which breaks
            "1번 문항" across two lines and turns a progress indicator into a
            paragraph. The wizard already says which item this is in words
            above the line ("5문항 중 1번째"), so narrow the marks carry only
            their number and the line stays one line. */}
        <span
          className={`mt-[15px] block px-1.5 text-label ${answered ? 'font-bold' : ''}`}
        >
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline">{label}</span>
        </span>
        <span className="mt-[5px] hidden text-label font-bold text-ink-2 sm:block">{meta}</span>
      </button>
    </div>
  )
}

/**
 * One item per screen with forward and back, and a single submit at the end
 * (#21). One per screen is deliberate: five artefacts on one page invites
 * comparing them to each other instead of judging each one. Selections live
 * here until the submit — nothing is scored, or even sent, before the Learner
 * says they are done.
 */
export function QuizWizard({
  lang,
  attemptId,
  items,
  screenCss,
  initialChoices,
}: {
  lang: Language
  attemptId: number
  items: WizardItem[]
  screenCss: string
  initialChoices: Record<string, number>
}) {
  const copy = COPY[lang]
  const [current, setCurrent] = useState(0)
  const [choices, setChoices] = useState<Record<string, number>>(initialChoices)
  const [pending, startTransition] = useTransition()

  // Every pick is sent as it is made, and the whole map goes each time so two
  // quick clicks cannot interleave into a half-written answer. Nothing waits
  // on it: the radio is already checked locally, and a Learner should never
  // watch a spinner to answer a question. The point is that closing the tab,
  // refreshing, or crossing to the other language keeps the work.
  function choose(slug: string, index: number) {
    const next = { ...choices, [slug]: index }
    setChoices(next)
    void saveDraft(attemptId, next)
  }

  const item = items[current]
  const last = current === items.length - 1
  const unanswered = items.filter((candidate) => choices[candidate.slug] === undefined).length

  // Two widths on purpose. The screen is a page being examined and wants the
  // room a page needs — tables that would otherwise wrap, two versions shown
  // side by side, lines whose length is the very thing being judged. The words
  // are read rather than examined, and reading is what a narrow column is for.
  // One width for both would either cramp the screens or stretch the options
  // past a comfortable line. The card is the wide one; the prose inside it is
  // held to the reading measure.
  //
  // The card is allowed the full content column from `wide` up, and asks for it
  // because of what the item card does with the room: at 1198px it can stand
  // the screen and the options beside each other, and the Learner stops
  // scrolling between the thing being judged and the judgment. Below that
  // there is no second column to give, so the card asks for nothing extra.
  return (
    <main className="@container mx-auto w-full max-w-[880px] px-0.5 wide:max-w-[1240px]">
      {/* ── the line, carrying the five drawn items ─────── */}
      <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
        {/* Said in words only where the line cannot say it. From `sm` the
            stations carry their own labels and the marker names the current
            one, so this line repeats them — and it repeats them in the band
            above the line, which is the one place on this page where an extra
            row pushes the item itself down the screen. Below `sm` the stations
            are bare numbers and this is where the words live. */}
        <p className="text-label font-bold text-ink-2 sm:hidden">
          {copy.progress(current + 1, items.length)}
        </p>
        <div className="mt-3.5 grid grid-cols-5 sm:mt-0">
          {items.map((candidate, index) => (
            <ItemStop
              key={candidate.slug}
              first={index === 0}
              label={copy.stop(index + 1)}
              short={String(index + 1)}
              answered={choices[candidate.slug] !== undefined}
              meta={choices[candidate.slug] !== undefined ? copy.answered : copy.notAnswered}
              behind={index <= current}
              here={index === current ? copy.here : undefined}
              onSelect={() => setCurrent(index)}
            />
          ))}
        </div>
      </section>

      {/*
        ── the item under judgment ───────────────────────

        The screen and the question are one row once the card is wide enough to
        hold both, and stacked when it is not. Side by side is the arrangement
        the task actually wants: the Learner is comparing an option against
        what is drawn, and stacked they can only hold one of the two at a time
        — by option four the screen is off the top of the window and the answer
        is being chosen from memory of it.

        The threshold is measured, not chosen: `720px` is the floor the drawn
        screens may never be squeezed below, `26px` is the gap between them,
        and `400px` is the least a column of options can be read in. Padding
        included, that is `1198px` of card. It is asked of the card rather than
        of the viewport, so the row appears when the room is really there —
        whatever the rail, the bed and the board have taken first.
      */}
      {/* `grid-cols-1` is load-bearing, not a default written out: an implicit
          grid track is sized to its content, and the prose column asks for its
          full 56ch. On a phone that is wider than the whole card, and the
          options would hang off the right edge of it. */}
      <section className="mt-3.5 grid grid-cols-1 gap-[26px] rounded-card bg-surface p-5 sm:p-[26px] shadow-card @min-[1198px]:grid-cols-[var(--item-screen-floor)_minmax(0,1fr)] @min-[1198px]:items-start">
        {/*
          One channel, never both. An item with a drawn screen keeps its prose
          as the frame's accessible name rather than printing it alongside: a
          paragraph that says a button is light grey on white answers the
          question before the screen is looked at, and the Learner is back to
          reading a description of a defect instead of seeing one.
        */}
        {item.sequence ? (
          <ItemSequence
            slug={item.slug}
            lang={lang}
            steps={item.sequence}
            css={screenCss}
            description={item.artefact}
          />
        ) : item.screen ? (
          <ItemScreen slug={item.slug} lang={lang} html={item.screen} css={screenCss} description={item.artefact} />
        ) : (
          <div className="rounded-badge bg-sunk p-[17px] text-body whitespace-pre-line">
            {item.artefact}
          </div>
        )}

        {/* One measure and one edge. The prompt keeps the reading measure at
            every width — 56ch of a 25px serif is nearly twice 56ch of the 16px
            body face, so a prompt sized on its own would run far past a
            comfortable line. What changes at `wide` is the edge it is measured
            from: the column stops being centred in the card and lines up with
            the left edge of the screen — beside it in the two-column row, above
            it when the card is stacked. */}
        <div className="mx-auto w-full max-w-measure wide:mx-0 wide:max-w-none">
          {/* The measure is held by this wrapper rather than by the heading
              itself: `ch` is a property of the font it is set in, and 56ch of
              the 25px serif is over 1000px — a heading given its own 56ch
              would not be held at all. Set here, in the body face, it is the
              same 56ch every other card on the platform is measured by. */}
          <div className="max-w-measure">
            <h1 className="font-serif text-headline font-bold text-ink">
              {item.prompt}
            </h1>
          </div>

          {/*
            Two lines to an option: what it proposes, then the grounds for it
            in the smaller step. Four options of forty words each is a wall,
            and a wall gets skimmed — but the grounds are what separate the
            keyed answer from a plausible one, so they cannot simply be cut.
            Splitting them lets the four actions be compared at a glance and
            the reasoning be read where the comparison does not settle it.

            The chosen option is marked by an inset oxblood ring rather than a
            border — the same ring the station list wears, and the only way to
            draw a chosen edge in a system that has no strokes.

            Four stacked options run past the fold, and an option the Learner
            has to scroll to is one they compare from memory. So they pair up
            in the one band where pairing is what buys the room back: a card
            wide enough to seat them in two readable columns but not wide
            enough to seat the screen beside them. Below that the columns would
            be too narrow to read; above it the options are already a column of
            their own next to the screen, and splitting that column again would
            hand each option half of 442px.
          */}
          <fieldset className="mt-5.5 grid gap-2.5 [@container(880px<=width<1198px)]:grid-cols-2">
            {item.options.map((option) => (
              // Left to stretch rather than sized to its own text: two options
              // side by side with different-length grounds would otherwise
              // leave a step between them, and the pair reads as one row.
              <label
                key={option.index}
                className="flex cursor-pointer items-start gap-3.5 rounded-badge bg-sunk p-[17px] has-checked:shadow-[inset_0_0_0_2px_var(--oxblood)]"
              >
                <input
                  type="radio"
                  name={item.slug}
                  checked={choices[item.slug] === option.index}
                  onChange={() => choose(item.slug, option.index)}
                  className="mt-[3px] size-[17px] accent-oxblood"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-title font-bold">{option.text}</span>
                  <span className="text-body-sm text-ink-2">{option.reason}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-[26px] flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="rounded-full bg-surface px-[26px] py-[15px] text-title font-bold shadow-pill disabled:opacity-40"
            >
              {copy.back}
            </button>
            {!last ? (
              <button
                type="button"
                onClick={() => setCurrent(current + 1)}
                className="rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white"
              >
                {copy.forward}
              </button>
            ) : (
              <button
                type="button"
                disabled={pending || unanswered > 0}
                onClick={() => startTransition(() => submitAttempt(attemptId, lang, choices))}
                className="rounded-full bg-oxblood px-[26px] py-[15px] text-title font-bold text-white disabled:opacity-40"
              >
                {pending ? copy.submitting : copy.submit}
              </button>
            )}
            {last && unanswered > 0 && (
              <p className="text-body-sm text-ink-2">{copy.unanswered(unanswered)}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
