'use client'

import { useEffect, useRef, useState } from 'react'

import type { Language } from '@/lib/language'

/** Posted by the screen to its host; nothing else crosses the boundary. */
const HEIGHT_MESSAGE = 'item-screen-height'

/** Shown under a screen the phone is too narrow to hold, until it is panned. */
const PAN_HINT: Record<Language, string> = {
  en: 'Drag the screen sideways to see all of it.',
  ko: '화면을 옆으로 밀면 전체가 보입니다.',
}

/**
 * Reports the rendered height so the host can size the frame to the screen
 * rather than guess. Runs inside the sandbox, which is why it can only speak
 * by postMessage — it has no access to the host document at all.
 *
 * It measures `body`, never `documentElement`: the root element stretches to
 * whatever the frame is, so measuring it measures the answer the host already
 * gave and the two chase each other upwards.
 */
const MEASURE_SCRIPT = `
  var send = function () {
    parent.postMessage(
      { type: '${HEIGHT_MESSAGE}', slug: SLUG, height: Math.ceil(document.body.getBoundingClientRect().height) },
      '*',
    )
  }
  new ResizeObserver(send).observe(document.body)
  addEventListener('load', send)
  send()
`

/**
 * The artefact drawn rather than described (ADR-0006: "a good scenario item
 * needs a real screenshot").
 *
 * It renders in a sandboxed frame for the reason #23 served the Practice Page
 * from a route handler: what the Learner judges must be exactly what the
 * author drew. Inline in the page, the platform's own typeface, colours and
 * Tailwind reset would inherit into it, and an item about a button's weight
 * would be asking about a button the author never made. The sandbox carries
 * no `allow-same-origin`, so the screen cannot read or touch the quiz around
 * it — it can only say how tall it is.
 *
 * Not an image file, for three reasons that all point the same way: a
 * screenshot needs re-cutting for both languages, cannot be diffed in review,
 * and goes blurry on the display where the difference between #9ca3af and
 * #6b7280 is the entire question.
 */
export function ItemScreen({
  slug,
  lang,
  html,
  css,
  description,
}: {
  slug: string
  lang: Language
  html: string
  css: string
  /** The prose artefact, which is what a Learner who cannot see the screen gets. */
  description: string
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const [panned, setPanned] = useState(false)
  // Kept per item, not as one number. This component is not remounted when
  // the Learner moves between items, so a single height would be the previous
  // screen's until the new one reported — briefly cutting off a screen that
  // happens to be taller. Remembering them also makes stepping Back instant
  // and correct rather than re-measured.
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    function receive(event: MessageEvent) {
      // A frame for a different item may still be unmounting; its height is
      // not this one's.
      if (event.source !== frame.current?.contentWindow) return
      const data = event.data
      if (data?.type !== HEIGHT_MESSAGE || data.slug !== slug) return
      if (typeof data.height !== 'number' || data.height <= 0) return
      setHeights((previous) => (previous[slug] === data.height ? previous : { ...previous, [slug]: data.height }))
    }

    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [slug])

  // Enough to show most screens before the first measurement lands, so the
  // page does not visibly jump on a fast connection.
  const height = heights[slug] ?? 240

  const srcDoc = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><style>${css}</style></head>
<body>${html}<script>var SLUG = ${JSON.stringify(slug)};${MEASURE_SCRIPT}</script></body>
</html>`

  return (
    <div>
      {/*
        The screen is held to a floor width and panned when the phone is
        narrower, rather than allowed to reflow into the space available.
        Reflow looks like the accommodating choice and is the one thing this
        component may not do: thirteen of the thirty-two items are two or more
        panes shown side by side, or a row of figures read across, and in every
        one of them the arrangement *is* the question. Squeezed into 375px
        those panes clip their own numbers, and an item asking which of two
        layouts leads the eye becomes an item about which one got cut off.
        Panning keeps the Learner judging what the author drew.

        This is a floor, not a fix. An item examined through a window narrower
        than itself is still not being seen at a glance, which is what several
        of them ask about — the screens need a phone-native form of their own,
        and that is content authoring rather than layout.
      */}
      <div
        ref={viewport}
        onScroll={() => setPanned(true)}
        className="overflow-x-auto rounded-badge"
      >
        <iframe
          ref={frame}
          // Remounting on the slug gives each item a frame of its own, so a
          // stale height can never be applied to the screen that replaced it.
          key={slug}
          title={description}
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          scrolling="no"
          style={{ height }}
          // Lifted off the card rather than outlined on it: this system draws
          // no borders, and the artefact has to read as a separate object from
          // the page asking about it.
          className="w-full min-w-(--item-screen-floor) rounded-badge bg-white shadow-card"
        />
      </div>

      {/* Said only while it is true. An artefact that pans with nothing to say
          so is the Perceived clickability defect this platform's fourth
          Competency teaches Learners to find, committed on the page teaching
          it — and it stops being worth saying the moment they have panned. */}
      {!panned && (
        <p className="mt-2.5 text-[12px] font-bold text-ink-2 sm:hidden">{PAN_HINT[lang]}</p>
      )}
    </div>
  )
}
