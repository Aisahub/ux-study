'use client'

import { useState, useTransition } from 'react'

import type { Language } from '@/lib/language'

import { saveDraft, submitAttempt } from '../actions'
import { ItemScreen } from './screen'

interface WizardItem {
  slug: string
  artefact: string
  /** The drawn screen, where the item has one; otherwise the artefact is read. */
  screen?: string
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
          <span className="rounded-full bg-sunk px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] whitespace-nowrap">
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
          className={`mt-[15px] block px-1.5 text-[13.5px] leading-[1.4] ${answered ? 'font-bold' : ''}`}
        >
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline">{label}</span>
        </span>
        <span className="mt-[5px] hidden text-[12px] font-bold text-ink-2 sm:block">{meta}</span>
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
  return (
    <main className="mx-auto w-full max-w-[880px] px-0.5">
      {/* ── the line, carrying the five drawn items ─────── */}
      <section className="rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
        <p className="text-[12px] font-bold text-ink-2">{copy.progress(current + 1, items.length)}</p>
        <div className="mt-3.5 grid grid-cols-5">
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

      {/* ── the item under judgment ─────────────────────── */}
      <section className="mt-3.5 rounded-card bg-surface p-5 sm:p-[26px] shadow-card">
        {/*
          One channel, never both. An item with a drawn screen keeps its prose
          as the frame's accessible name rather than printing it alongside: a
          paragraph that says a button is light grey on white answers the
          question before the screen is looked at, and the Learner is back to
          reading a description of a defect instead of seeing one.
        */}
        {item.screen ? (
          <ItemScreen slug={item.slug} lang={lang} html={item.screen} css={screenCss} description={item.artefact} />
        ) : (
          <div className="rounded-badge bg-sunk p-[17px] text-[16px] leading-[1.55] whitespace-pre-line">
            {item.artefact}
          </div>
        )}

        {/* One column for everything that is read, at one measure and one edge.
            The prompt is inside it rather than sized on its own: 56ch of a 25px
            serif is nearly twice 56ch of the 16px body face, so a prompt given
            its own measure would start on a different line from the options
            beneath it. */}
        <div className="mx-auto mt-[26px] w-full max-w-[56ch]">
          <h1 className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink">
            {item.prompt}
          </h1>

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
          */}
          <fieldset className="mt-5.5 flex flex-col gap-2.5">
            {item.options.map((option) => (
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
                  <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">{option.text}</span>
                  <span className="text-[13.5px] leading-[1.55] text-ink-2">{option.reason}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-[26px] flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="rounded-full bg-surface px-[26px] py-[15px] text-[16px] font-bold shadow-pill disabled:opacity-40"
            >
              {copy.back}
            </button>
            {!last ? (
              <button
                type="button"
                onClick={() => setCurrent(current + 1)}
                className="rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white"
              >
                {copy.forward}
              </button>
            ) : (
              <button
                type="button"
                disabled={pending || unanswered > 0}
                onClick={() => startTransition(() => submitAttempt(attemptId, lang, choices))}
                className="rounded-full bg-oxblood px-[26px] py-[15px] text-[16px] font-bold text-white disabled:opacity-40"
              >
                {pending ? copy.submitting : copy.submit}
              </button>
            )}
            {last && unanswered > 0 && (
              <p className="text-[13.5px] leading-[1.55] text-ink-2">{copy.unanswered(unanswered)}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
