'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { counterpartPath, type Language } from '@/lib/language'

/** Each language names itself, so neither reader has to read the other's. */
const LABEL: Record<Language, string> = { en: 'English', ko: '한국어' }

/** Said in the language of the page, because it is this reader who is stuck. */
const LOCKED: Record<Language, string> = {
  en: 'fixed until you submit',
  ko: '제출할 때까지 고정',
}

/**
 * A link to the same page in the other language.
 *
 * It is a link and not a button because switching is navigation: it can be
 * opened in a new tab, it works before the page has hydrated, and following it
 * is what records the preference (see `middleware.ts`). The counterpart is
 * computed from the current path, so a Learner on a deep page stays where
 * they are instead of being returned to a section root.
 */
export function LanguageSwitcher({ current }: { current: Language }) {
  const pathname = usePathname()
  const target: Language = current === 'ko' ? 'en' : 'ko'

  // The one place the switch must not happen: an open quiz attempt. It is
  // forbidden mid-attempt (ADR-0008 amendment, #6) — the recorded language must
  // describe every item of the attempt, not where it started.
  //
  // Unavailable, and saying so. This used to render nothing, which left a
  // Learner looking for the other language with no answer and no clue that one
  // existed — the precise failure this platform's own item pool calls a
  // disabled control that will not say what it wants. So the name of the other
  // language stays put, dimmed, with the reason beside it.
  if (/^\/(en|ko)\/learn\/[^/]+\/quiz\/\d+/.test(pathname)) {
    return (
      <span className="text-sm text-zinc-400 dark:text-zinc-500">
        <span lang={target}>{LABEL[target]}</span>
        <span className="ml-2 text-xs">({LOCKED[current]})</span>
      </span>
    )
  }

  return (
    <Link
      href={counterpartPath(pathname, target)}
      lang={target}
      className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {LABEL[target]}
    </Link>
  )
}
