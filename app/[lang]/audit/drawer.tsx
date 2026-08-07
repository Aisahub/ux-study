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
    close: string
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
    close: 'Close',
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
      // Not "all four": the count is per Stage and lives in config.md, and a
      // number copied into a sentence here is one nobody would think to change.
      locked: 'The audit unlocks once every Gate Quiz in this Stage is passed.',
      'no-subject': 'This Stage has no page to audit yet.',
      'too-few': 'Not enough Findings yet to submit.',
    },
  },
  ko: {
    toggle: '발견 목록',
    close: '닫기',
    formHeading: '새 발견',
    element: '요소',
    elementHint: '페이지에서 직접 클릭해 선택하세요.',
    principle: 'UX 원칙',
    principlePlaceholder: '용어집에서 선택…',
    description: '페이지를 쓰는 사람에게 무엇이 잘못되는지',
    fix: '고치는 방법 제안',
    add: '발견 추가',
    saved: (n) => `저장된 발견 ${n}개`,
    remove: '삭제',
    submit: '보고서 제출',
    needMore: (more) => `제출하려면 발견이 ${more}개 더 필요합니다.`,
    submitWarning: '제출은 한 번뿐입니다 — 정답이 공개되고, 그 뒤에는 아무것도 추가할 수 없습니다.',
    errors: {
      'duplicate-element': '이미 그 요소를 가리키는 발견이 있습니다 — 요소 하나에 발견 하나입니다.',
      'unknown-element': '페이지에서 요소를 클릭해 선택하세요.',
      'unknown-principle': '용어집에서 원칙을 선택하세요.',
      incomplete: '설명과 고치는 방법, 두 서술이 모두 필요합니다.',
      submitted: '이미 제출된 보고서입니다.',
      locked: '이 단계의 퀴즈를 모두 통과하면 자가 점검이 열립니다.',
      'no-subject': '이 단계에는 아직 점검할 페이지가 없습니다.',
      'too-few': '제출하기에는 발견이 아직 부족합니다.',
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
  stage,
  glossary,
  findings,
  minFindings,
}: {
  lang: Language
  /** Which Stage's report this drawer writes into — carried on every action (#61). */
  stage: number
  glossary: { slug: string; name: string }[]
  findings: SavedFinding[]
  minFindings: number
}) {
  const copy = COPY[lang]
  const [open, setOpen] = useState(true)
  const [mobileSheet, setMobileSheet] = useState<'none' | 'composer' | 'list'>('none')
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
      if (data?.type === 'element-selected') {
        const selected = data.element ?? ''
        setElement(selected)
        if (selected !== '' && window.matchMedia('(max-width: 1099px)').matches) {
          setMobileSheet('composer')
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const missing = Math.max(0, minFindings - findings.length)

  function clearDraft() {
    setElement('')
    setPrinciple('')
    setDescription('')
    setFix('')
  }

  function saveCurrentFinding(onSaved?: () => void) {
    startTransition(async () => {
      const result = await saveFinding(lang, stage, { element, principle, description, fix })
      setError(result)
      if (result === null) {
        clearDraft()
        onSaved?.()
      }
    })
  }

  const findingForm = (onSaved?: () => void) => (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-zinc-500">{copy.formHeading}</h2>
      <label className="text-sm">
        {copy.element}
        <output className="mt-1 block rounded-md border border-zinc-200 px-2 py-1.5 font-mono text-xs">
          {element === '' ? copy.elementHint : element}
        </output>
      </label>
      <label className="text-sm">
        {copy.principle}
        <select
          value={principle}
          onChange={(event) => setPrinciple(event.target.value)}
          className="mt-1 block min-h-11 w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm"
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
          className="mt-1 block w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-sm">
        {copy.fix}
        <textarea
          value={fix}
          onChange={(event) => setFix(event.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm"
        />
      </label>
      <button
        type="button"
        disabled={pending}
        onClick={() => saveCurrentFinding(onSaved)}
        className="min-h-11 w-fit rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
      >
        {copy.add}
      </button>
      {error && <p className="text-sm text-red-700">{copy.errors[error] ?? error}</p>}
    </section>
  )

  const savedFindings = (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-zinc-500">{copy.saved(findings.length)}</h2>
      <ul className="flex flex-col gap-2">
        {findings.map((finding) => (
          <li key={finding.id} className="rounded-md border border-zinc-200 p-2 text-sm">
            <p className="font-mono text-xs">{finding.element}</p>
            <p className="mt-1">{finding.description}</p>
            <button
              type="button"
              onClick={() => startTransition(() => removeFinding(lang, stage, finding.id))}
              className="mt-1 min-h-11 text-xs text-zinc-500 underline-offset-4 hover:underline"
            >
              {copy.remove}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )

  const submission = (
    <section className="mt-auto flex flex-col gap-2 border-t border-zinc-200 pt-3">
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
            setError(await submitReport(lang, stage))
          })
        }
        className="min-h-11 w-fit rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
      >
        {copy.submit}
      </button>
    </section>
  )

  return (
    <>
      {/* A phone cannot keep the Practice Page and a growing report useful at
          the same time. The page therefore owns the screen: selecting an
          element opens one focused composer, saving returns to the page, and
          the floating count opens the report as a separate surface (#37). */}
      <div className="pointer-events-none absolute inset-0 z-20 wide:hidden">
        {mobileSheet === 'none' && (
          <button
            type="button"
            onClick={() => setMobileSheet('list')}
            className="pointer-events-auto absolute right-3 bottom-3 flex min-h-14 items-center rounded-full bg-oxblood px-5 text-sm font-bold text-white shadow-card"
          >
            {copy.toggle} · {findings.length}
          </button>
        )}

        {mobileSheet === 'composer' && (
          <aside className="pointer-events-auto absolute inset-0 flex flex-col rounded-card bg-surface p-4 shadow-card">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-base font-bold">{copy.formHeading}</h2>
              <button
                type="button"
                onClick={() => setMobileSheet('none')}
                className="min-h-11 px-2 text-sm font-medium text-zinc-500"
              >
                {copy.close}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{findingForm(() => setMobileSheet('none'))}</div>
          </aside>
        )}

        {mobileSheet === 'list' && (
          <aside className="pointer-events-auto absolute inset-0 flex flex-col gap-4 overflow-y-auto rounded-card bg-surface p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">{copy.saved(findings.length)}</h2>
              <button
                type="button"
                onClick={() => setMobileSheet('none')}
                className="min-h-11 px-2 text-sm font-medium text-zinc-500"
              >
                {copy.close}
              </button>
            </div>
            {savedFindings}
            {submission}
          </aside>
        )}
      </div>

      {/* The desktop keeps the established two-surface report: the page and
          its drawer remain visible beside one another. */}
      <aside className="hidden w-full flex-col gap-4 border-l border-zinc-200 p-4 wide:flex wide:max-w-sm">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="min-h-11 w-fit text-sm font-medium underline-offset-4 hover:underline"
          aria-expanded={open}
        >
          {copy.toggle} {open ? '▾' : '▸'}
        </button>

        {open && (
          <>
            {findingForm()}
            {savedFindings}
            {submission}
          </>
        )}
      </aside>
    </>
  )
}
