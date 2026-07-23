'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { counterpartPath, type Language } from '@/lib/language'

/** Each language names itself, so neither reader has to read the other's. */
const LABEL: Record<Language, string> = { en: 'English', ko: '한국어' }

/**
 * A link to the same page in the other language, offered on every page without
 * exception — an open quiz attempt included (ADR-0008 amendment, 2026-07-23).
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
