'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SignOut } from './sign-out'
import type { Language } from '@/lib/language'

export type RailId = 'learn' | 'me' | 'findings' | 'learners' | 'content' | 'allowlist'

export interface RailItem {
  id: RailId
  href: string
  label: string
}

/**
 * Drawn in one grammar: 24px box, 1.7 stroke, round caps, no fill. Mixing an
 * outline set with a filled one is the Consistency defect this platform's
 * first Stage teaches Learners to find.
 */
const ICON: Record<RailId, React.ReactNode> = {
  learn: <path d="M4 5h7v14H4zM13 5h7v14h-7z" />,
  me: <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />,
  findings: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  learners: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5M17 11.5a3 3 0 100-6M18 20c0-2.3-.7-3.8-2-4.6" />
    </>
  ),
  content: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  allowlist: (
    <>
      <circle cx="8" cy="12" r="3.2" />
      <path d="M11.2 12H21M18 12v3M15 12v2" />
    </>
  ),
}

/**
 * The rail. A client component only because the active mark needs the current
 * path; every item it renders was decided on the server (see platform-nav).
 *
 * Two forms, one component. From `sm` up it is the vertical rail DESIGN.md
 * draws: a column of circular marks, labels in `aria-label` alone. Below `sm`
 * it becomes the bottom bar — the same marks, laid along the bottom edge,
 * where a thumb can reach them.
 *
 * The bar shows its labels. Icon-only was survivable on the rail, where a
 * tooltip and a wide screen sit behind every glyph; on a phone there is no
 * hover to recover the word from, and a platform that teaches Perceived
 * clickability may not ship six unlabelled circles as its only navigation.
 *
 * It is fixed rather than stacked below the content because the pages here are
 * long and self-paced: navigation a Learner has to scroll to the end of a Gate
 * Quiz to reach is navigation they will not use. The layout reserves the
 * matching space, so nothing is ever hidden underneath it.
 *
 * From `sm` up the rail is two parts, not one: the marks at the top and
 * signing out at the foot, with the gap between them absorbing whatever height
 * the marks do not use — two for a Learner, six for a Maintainer.
 *
 * That foot has to be the foot of the *viewport*, which is why the column is
 * sticky and viewport-tall here. Left to stretch with the grid row it would be
 * as tall as the page, and on a Gate Quiz that puts signing out several
 * screens below the fold — the same defect the paragraph above refuses for the
 * bottom bar, arrived at from the other side. `min-h` rather than `h` so that
 * a viewport too short for six marks and the control grows the column and
 * scrolls instead of overlapping them.
 */
export function NavRail({ items, lang }: { items: RailItem[]; lang: Language }) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-(--bottom-bar) items-start justify-around gap-1 bg-white/72 px-2 pt-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_2px_rgb(28_44_52/0.10),0_-10px_24px_rgb(28_44_52/0.06)] backdrop-blur-[22px] backdrop-saturate-150 sm:sticky sm:top-3.5 sm:h-auto sm:min-h-[calc(100dvh-28px)] sm:flex-col sm:items-center sm:justify-start sm:gap-3 sm:self-start sm:bg-transparent sm:px-0 sm:pt-2.5 sm:pb-2.5 sm:shadow-none sm:backdrop-blur-none"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.id}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-[5px] rounded-[14px] py-0.5 sm:flex-none sm:gap-0 sm:py-0"
          >
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-full ${
                active ? 'bg-oxblood text-white' : 'bg-surface text-ink-2 shadow-pill'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-[19px] fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
              >
                {ICON[item.id]}
              </svg>
            </span>
            {/* Two lines' worth of room is reserved whether or not the label
                needs it, so the bar is the same height for a Learner with two
                marks and a Maintainer with six — a navigation that changed
                height as you moved through it would be the Consistency defect
                this platform's third Competency teaches. Labels are never
                shortened for the bar (see platform-nav).
                38px is two lines of the label step: it is derived from that
                step's size and line height (13.5 × 1.4 × 2 = 37.8), not chosen,
                so it moves when the step moves. It was 34px while the step was
                12px, and the mismatch is invisible until a bar mixes one-line
                and two-line labels — six marks at 320px does exactly that. */}
            <span
              aria-hidden
              className={`line-clamp-2 min-h-[38px] w-full text-center text-label font-bold text-balance sm:hidden ${
                active ? 'text-oxblood' : 'text-ink-2'
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}

      {/* `mt-auto` is what puts it at the foot: the marks keep their natural
          height at the top and this takes up the slack, so the control sits in
          the same place whether two marks are above it or six. Hidden below
          `sm`, where the bar has no room for a seventh mark and the top bar
          carries it instead (see the layout). */}
      <SignOut lang={lang} className="mt-auto hidden shrink-0 sm:block" />
    </nav>
  )
}
