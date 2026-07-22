'use client'

import { useState, useTransition } from 'react'

import type { Language } from '@/lib/language'

import { submitAttempt } from '../actions'

interface WizardItem {
  slug: string
  artefact: string
  prompt: string
  /** Shuffled for display; index is the option's authored position, which is what scoring understands. */
  options: { index: number; text: string }[]
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
}: {
  lang: Language
  attemptId: number
  items: WizardItem[]
}) {
  const copy = COPY[lang]
  const [current, setCurrent] = useState(0)
  const [choices, setChoices] = useState<Record<string, number>>({})
  const [pending, startTransition] = useTransition()

  const item = items[current]
  const last = current === items.length - 1
  const unanswered = items.filter((candidate) => choices[candidate.slug] === undefined).length

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <p className="text-sm text-zinc-500">{copy.progress(current + 1, items.length)}</p>

      <div className="whitespace-pre-line rounded-lg border border-zinc-200 p-4 text-sm leading-relaxed dark:border-zinc-800">
        {item.artefact}
      </div>
      <p className="font-medium">{item.prompt}</p>

      <fieldset className="flex flex-col gap-2">
        {item.options.map((option) => (
          <label
            key={option.index}
            className="flex cursor-pointer items-baseline gap-3 rounded-md border border-zinc-200 p-3 text-sm has-checked:border-zinc-900 dark:border-zinc-800 dark:has-checked:border-zinc-100"
          >
            <input
              type="radio"
              name={item.slug}
              checked={choices[item.slug] === option.index}
              onChange={() => setChoices((previous) => ({ ...previous, [item.slug]: option.index }))}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex items-center gap-4">
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
            onClick={() => startTransition(() => submitAttempt(attemptId, choices))}
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
