'use client'

import { useEffect, useState, useTransition } from 'react'

import type { Language } from '@/lib/language'

import { removeFinding, saveFinding, submitReport } from './actions'

interface SavedFinding {
  id: number
  element: string
  principle: string
  description: string
  fix: string
}

const COPY: Record<
  Language,
  {
    toggle: string
    formHeading: string
    element: string
    elementHint: string
    principle: string
    principlePlaceholder: string
    description: string
    fix: string
    add: string
    saved: (n: number) => string
    remove: string
    submit: string
    needMore: (more: number) => string
    submitWarning: string
    errors: Record<string, string>
  }
> = {
  en: {
    toggle: 'Findings',
    formHeading: 'New Finding',
    element: 'Element',
    elementHint: 'Click it on the page.',
    principle: 'UX Principle',
    principlePlaceholder: 'Choose from the Glossary…',
    description: "What goes wrong, for the person using the page",
    fix: 'Proposed fix',
    add: 'Add Finding',
    saved: (n) => (n === 1 ? '1 Finding saved' : `${n} Findings saved`),
    remove: 'Remove',
    submit: 'Submit the report',
    needMore: (more) => `A submission needs at least ${more} more Finding${more === 1 ? '' : 's'}.`,
    submitWarning: 'Submission is final — the answers are revealed and nothing can be added afterwards.',
    errors: {
      'duplicate-element': 'A Finding already points at that element — one element, one Finding.',
      'unknown-element': 'Select the element by clicking it on the page.',
      'unknown-principle': 'Choose a Principle from the Glossary.',
      incomplete: 'Both written parts are required: the description and the fix.',
      submitted: 'This report is already submitted.',
      locked: 'The audit unlocks when all four Gate Quizzes are passed.',
      'too-few': 'Not enough Findings yet to submit.',
    },
  },
  ko: {
    toggle: 'Finding 목록',
    formHeading: '새 Finding',
    element: '요소',
    elementHint: '페이지에서 직접 클릭해 선택하세요.',
    principle: 'UX 원칙',
    principlePlaceholder: '용어집에서 선택…',
    description: '페이지를 쓰는 사람에게 무엇이 잘못되는지',
    fix: '고치는 방법 제안',
    add: 'Finding 추가',
    saved: (n) => `저장된 Finding ${n}개`,
    remove: '삭제',
    submit: '보고서 제출',
    needMore: (more) => `제출하려면 Finding이 ${more}개 더 필요합니다.`,
    submitWarning: '제출은 한 번뿐입니다 — 정답이 공개되고, 그 뒤에는 아무것도 추가할 수 없습니다.',
    errors: {
      'duplicate-element': '이미 그 요소를 가리키는 Finding이 있습니다 — 요소 하나에 Finding 하나입니다.',
      'unknown-element': '페이지에서 요소를 클릭해 선택하세요.',
      'unknown-principle': '용어집에서 원칙을 선택하세요.',
      incomplete: '설명과 고치는 방법, 두 서술이 모두 필요합니다.',
      submitted: '이미 제출된 보고서입니다.',
      locked: '관문 퀴즈 네 개를 모두 통과하면 감사가 열립니다.',
      'too-few': '제출하기에는 Finding이 아직 부족합니다.',
    },
  },
}

/**
 * The Finding drawer (#24): beside the page, never around it. The element
 * field cannot be typed into — it is filled by pointing at the page, which is
 * what makes a Korean Finding and an English Finding the same record.
 */
export function FindingsDrawer({
  lang,
  glossary,
  findings,
  minFindings,
}: {
  lang: Language
  glossary: { slug: string; name: string }[]
  findings: SavedFinding[]
  minFindings: number
}) {
  const copy = COPY[lang]
  const [open, setOpen] = useState(true)
  const [element, setElement] = useState('')
  const [principle, setPrinciple] = useState('')
  const [description, setDescription] = useState('')
  const [fix, setFix] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Only the embedded Practice Page speaks this message; same origin.
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; element?: string | null }
      if (data?.type === 'element-selected') setElement(data.element ?? '')
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const missing = Math.max(0, minFindings - findings.length)

  return (
    <aside className="flex w-full flex-col gap-4 border-l border-zinc-200 p-4 lg:max-w-sm dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-fit text-sm font-medium underline-offset-4 hover:underline"
        aria-expanded={open}
      >
        {copy.toggle} {open ? '▾' : '▸'}
      </button>

      {open && (
        <>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-zinc-500">{copy.formHeading}</h2>
            <label className="text-sm">
              {copy.element}
              <output className="mt-1 block rounded-md border border-zinc-200 px-2 py-1.5 font-mono text-xs dark:border-zinc-800">
                {element === '' ? copy.elementHint : element}
              </output>
            </label>
            <label className="text-sm">
              {copy.principle}
              <select
                value={principle}
                onChange={(event) => setPrinciple(event.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
              >
                <option value="">{copy.principlePlaceholder}</option>
                {glossary.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              {copy.description}
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
              />
            </label>
            <label className="text-sm">
              {copy.fix}
              <textarea
                value={fix}
                onChange={(event) => setFix(event.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
              />
            </label>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await saveFinding(lang, { element, principle, description, fix })
                  setError(result)
                  if (result === null) {
                    setElement('')
                    setPrinciple('')
                    setDescription('')
                    setFix('')
                  }
                })
              }
              className="w-fit rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-zinc-900"
            >
              {copy.add}
            </button>
            {error && <p className="text-sm text-red-700 dark:text-red-400">{copy.errors[error] ?? error}</p>}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-zinc-500">{copy.saved(findings.length)}</h2>
            <ul className="flex flex-col gap-2">
              {findings.map((finding) => (
                <li key={finding.id} className="rounded-md border border-zinc-200 p-2 text-sm dark:border-zinc-800">
                  <p className="font-mono text-xs">{finding.element}</p>
                  <p className="mt-1">{finding.description}</p>
                  <button
                    type="button"
                    onClick={() => startTransition(() => removeFinding(lang, finding.id))}
                    className="mt-1 text-xs text-zinc-500 underline-offset-4 hover:underline"
                  >
                    {copy.remove}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            {/* Told before submitting, not at the moment of refusal (#24). */}
            {missing > 0 ? (
              <p className="text-sm text-zinc-500">{copy.needMore(missing)}</p>
            ) : (
              <p className="text-sm text-zinc-500">{copy.submitWarning}</p>
            )}
            <button
              type="button"
              disabled={pending || missing > 0}
              onClick={() =>
                startTransition(async () => {
                  setError(await submitReport(lang))
                })
              }
              className="w-fit rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-zinc-900"
            >
              {copy.submit}
            </button>
          </section>
        </>
      )}
    </aside>
  )
}
