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
    back: string
    forward: string
    submit: string
    submitting: string
    unanswered: (n: number) => string
  }
> = {
  en: {
    progress: (n, of) => `Item ${n} of ${of}`,
    back: 'Back',
    forward: 'Next',
    submit: 'Submit all answers',
    submitting: 'Scoring…',
    unanswered: (n) => (n === 1 ? '1 item is still unanswered.' : `${n} items are still unanswered.`),
  },
  ko: {
    progress: (n, of) => `${of}문항 중 ${n}번째`,
    back: '이전',
    forward: '다음',
    submit: '전체 제출',
    submitting: '채점 중…',
    unanswered: (n) => `아직 답하지 않은 문항이 ${n}개 있습니다.`,
  },
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
  // past a comfortable line.
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8 font-sans">
      <p className="mx-auto w-full max-w-2xl text-sm text-zinc-500">{copy.progress(current + 1, items.length)}</p>

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
        <div className="mx-auto w-full max-w-2xl whitespace-pre-line rounded-lg border border-zinc-200 p-4 text-sm leading-relaxed dark:border-zinc-800">
          {item.artefact}
        </div>
      )}
      <p className="mx-auto w-full max-w-2xl font-medium">{item.prompt}</p>

      {/*
        Two lines to an option: what it proposes, then the grounds for it in
        smaller grey. Four options of forty words each is a wall, and a wall
        gets skimmed — but the grounds are what separate the keyed answer from
        a plausible one, so they cannot simply be cut. Splitting them lets the
        four actions be compared at a glance and the reasoning be read where
        the comparison does not settle it.
      */}
      <fieldset className="mx-auto flex w-full max-w-2xl flex-col gap-2">
        {item.options.map((option) => (
          <label
            key={option.index}
            className="flex cursor-pointer items-baseline gap-3 rounded-md border border-zinc-200 p-3 has-checked:border-zinc-900 dark:border-zinc-800 dark:has-checked:border-zinc-100"
          >
            <input
              type="radio"
              name={item.slug}
              checked={choices[item.slug] === option.index}
              onChange={() => choose(item.slug, option.index)}
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium">{option.text}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{option.reason}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="mx-auto flex w-full max-w-2xl items-center gap-4">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-zinc-700"
        >
          {copy.back}
        </button>
        {!last ? (
          <button
            type="button"
            onClick={() => setCurrent(current + 1)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            {copy.forward}
          </button>
        ) : (
          <button
            type="button"
            disabled={pending || unanswered > 0}
            onClick={() => startTransition(() => submitAttempt(attemptId, lang, choices))}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-zinc-900"
          >
            {pending ? copy.submitting : copy.submit}
          </button>
        )}
        {last && unanswered > 0 && <p className="text-sm text-zinc-500">{copy.unanswered(unanswered)}</p>}
      </div>
    </main>
  )
}
