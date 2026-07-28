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
 *
 * Both languages are shown rather than only the one on offer. A single "한국어"
 * link states what you would get but not what you are currently reading, and
 * on a bilingual platform the second half is the half a Learner checks.
 */
export function LanguageSwitcher({ current }: { current: Language }) {
  const pathname = usePathname()
  const target: Language = current === 'ko' ? 'en' : 'ko'

  return (
    // The two segments carry a fixed 34px height rather than vertical padding,
    // so this pill lands at the same 42px as the account pill beside it: the
    // account pill's height is set by its 30px avatar and two lines of text and
    // cannot be dialled to match, so the switcher is the one that gives way.
    <div className="flex gap-0.5 rounded-full bg-surface p-1 shadow-pill">
      <span
        lang={current}
        aria-current="true"
        className="flex h-[34px] items-center rounded-full bg-oxblood px-3 text-label font-bold text-white"
      >
        {LABEL[current]}
      </span>
      <Link
        href={counterpartPath(pathname, target)}
        lang={target}
        className="flex h-[34px] items-center rounded-full px-3 text-label font-bold text-ink-2"
      >
        {LABEL[target]}
      </Link>
    </div>
  )
}
