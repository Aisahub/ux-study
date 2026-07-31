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
    // Height: the account pill's height is set by its 30px avatar and two lines
    // of text and cannot be dialled to match, so on this axis the switcher is
    // the one that gives way — by stretching to whatever the row turns out to
    // be, not by carrying a copy of the number. It carried a fixed 34px until
    // 2026-07-31, which matched the account pill until the label step went 12px
    // -> 13.5px on 2026-07-29 and grew the pill's second line: the two then sat
    // 42px against 45.77px, off by four visible pixels. A height held by a
    // number copied out of a neighbour is a claim that stops being true the
    // moment the neighbour moves.
    //
    // The 34px stays as a floor, for the signed-out page where the switcher is
    // alone in the row and has no neighbour to take its height from.
    //
    // Width: the other way round, and deliberately so. shrink-0 and nowrap
    // together, because a language naming itself is one word and breaking
    // `한국어` across two lines states nothing; the account pill already
    // truncates, so on this axis it is the one that gives way. An email prefix
    // survives losing its tail; a language name does not survive losing its
    // second line. (Added 2026-07-29: at the 12px label step both pills fitted
    // a 375px row untouched, so neither axis had been forced yet.)
    <div className="flex shrink-0 self-stretch gap-0.5 rounded-full bg-surface p-1 shadow-pill">
      <span
        lang={current}
        aria-current="true"
        className="flex min-h-[34px] items-center rounded-full bg-oxblood px-3 text-label font-bold whitespace-nowrap text-white"
      >
        {LABEL[current]}
      </span>
      <Link
        href={counterpartPath(pathname, target)}
        lang={target}
        className="flex min-h-[34px] items-center rounded-full px-3 text-label font-bold whitespace-nowrap text-ink-2"
      >
        {LABEL[target]}
      </Link>
    </div>
  )
}
