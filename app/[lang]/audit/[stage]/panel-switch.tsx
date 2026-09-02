'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Language } from '@/lib/language'

/**
 * The switch between the submitted report's two panels — what was planted, and
 * what this Learner found.
 *
 * It is the shape the Competency's panel switch and the language switcher
 * already use, because it says the same thing they do: the same subject, in
 * the other version. A second silhouette for one relationship is the drift the
 * design system's own Consistency lesson is about.
 *
 * Links, not buttons: each panel is a real address, so it survives a refresh,
 * opens in a new tab, works before hydration, and — the reason that settles it
 * — the language switcher builds its counterpart from the pathname alone. A
 * `?tab=` would be dropped on the way across and a Korean Learner reading their
 * own Findings would land silently on the answer key, which bilingual parity
 * does not allow.
 *
 * `usePathname` rather than a prop, for the same reason the language switcher
 * reads it: the frame around these panels is a layout, and a layout is not
 * told which of its children is being rendered.
 *
 * No `role="tab"`. That role promises a scripted widget where arrow keys move
 * between panels without leaving the page; these are navigation, and
 * `aria-current="page"` is the honest way to say which one you are on.
 */
export function PanelSwitch({
  lang,
  stage,
  labels,
}: {
  lang: Language
  stage: number
  labels: { panels: string; planted: string; yours: string }
}) {
  const pathname = usePathname()
  const base = `/${lang}/audit/${stage}`
  const active = pathname.endsWith('/findings') ? 'yours' : 'planted'

  const panels = [
    { id: 'planted' as const, href: base, label: labels.planted },
    { id: 'yours' as const, href: `${base}/findings`, label: labels.yours },
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
