'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Language } from '@/lib/language'

/**
 * The switch between this page's two panels — the Quiz Item pools, and the
 * Planted Defects on the audit subjects.
 *
 * The same silhouette the Competency's panel switch, the submitted report's,
 * and the language switcher already wear, because it says what they say: the
 * same subject, in the other version. A second drawing for one relationship is
 * the drift this platform's own Consistency lesson is about.
 *
 * Links, not buttons, and a path segment rather than a `?tab=`. Each panel is a
 * real address, so it survives a refresh, opens in a new tab, works before
 * hydration, and — the reason that settles it — the language switcher builds
 * its counterpart from the pathname alone. A query string would be dropped on
 * the way across and a Maintainer reading the defect panel would land silently
 * on the item panel, which bilingual parity does not allow.
 *
 * No `role="tab"`. That role promises a scripted widget where arrow keys move
 * between panels without leaving the page; these are navigation, and
 * `aria-current="page"` is the honest way to say which one you are on.
 *
 * Two panels, and two is the ceiling (DESIGN.md). A third would make this a
 * section index wearing a switch, and the moment a Maintainer has to hunt
 * through panels for a figure, this page has committed the defect its own
 * first Stage teaches.
 */
export function PanelSwitch({
  lang,
  labels,
}: {
  lang: Language
  labels: { panels: string; items: string; defects: string }
}) {
  const pathname = usePathname()
  const base = `/${lang}/maintain/content`
  const active = pathname.endsWith('/defects') ? 'defects' : 'items'

  const panels = [
    { id: 'items' as const, href: base, label: labels.items },
    { id: 'defects' as const, href: `${base}/defects`, label: labels.defects },
  ]

  return (
    <nav
      aria-label={labels.panels}
      className="flex w-fit max-w-full gap-0.5 rounded-full bg-surface p-1 shadow-pill"
    >
      {panels.map((panel) => (
        <Link
          key={panel.id}
          href={panel.href}
          aria-current={active === panel.id ? 'page' : undefined}
          // min-h-11 on the link itself: 44px belongs to whatever answers the
          // tap, not to the strip around it.
          className={`press flex min-h-11 items-center rounded-full px-[17px] text-label font-bold break-keep ${
            active === panel.id ? 'bg-oxblood text-white' : 'text-ink'
          }`}
        >
          {panel.label}
        </Link>
      ))}
    </nav>
  )
}
