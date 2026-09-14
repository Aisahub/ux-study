import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { requireMaintainer } from '@/lib/auth'
import { isLanguage } from '@/lib/language'

import { COPY } from './copy'
import { PanelSwitch } from './panel-switch'

export const dynamic = 'force-dynamic'

/**
 * Named here rather than on the two panels beneath, because the frame is what
 * both stand in and a Maintainer crossing between them is on one screen — the
 * same reason the submitted report titles its route once.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return { title: COPY[isLanguage(lang) ? lang : 'en'].heading }
}

/**
 * The frame this page's two panels stand in: the heading, the one sentence
 * true of every figure on either of them, and the switch between them.
 *
 * A layout rather than a header each panel draws, so that crossing between them
 * keeps the heading and the switch on screen instead of blanking and
 * re-rendering the identical strip.
 *
 * The gate is asked here and again on each panel. Next renders a layout and its
 * page concurrently, so a gate held only here would let a panel's queries run
 * for somebody the layout is about to refuse — nothing reaches them, but the
 * queries should not run at all.
 */
export default async function ContentHealthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireMaintainer(lang)
  const copy = COPY[lang]

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="px-1.5 pb-[26px]">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
        {/* Full ink rather than ink-2: the board is not a white card, and
            faded text is a white-card value here (DESIGN.md). */}
        <p className="mt-3 max-w-measure text-body text-ink">{copy.explanation}</p>
        <div className="mt-[22px]">
          <PanelSwitch
            lang={lang}
            labels={{ panels: copy.heading, items: copy.itemsPanel, defects: copy.defectsPanel }}
          />
        </div>
      </header>

      {children}
    </main>
  )
}
