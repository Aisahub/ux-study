'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
 * Labels live in `aria-label` and `title` rather than under the glyphs, which
 * is how the approved design draws it. Worth revisiting: an icon-only rail is
 * exactly the kind of thing this platform trains Learners to flag.
 */
export function NavRail({ items }: { items: RailItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col items-center gap-3 py-2.5">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.id}
            href={item.href}
            title={item.label}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className={`grid size-11 place-items-center rounded-full ${
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
          </Link>
        )
      })}
    </nav>
  )
}
