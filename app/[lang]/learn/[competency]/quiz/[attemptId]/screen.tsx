'use client'

import { useEffect, useRef, useState } from 'react'

import type { Language } from '@/lib/language'

/** Posted by the screen to its host; nothing else crosses the boundary. */
const HEIGHT_MESSAGE = 'item-screen-height'

/** Posted the other way, once, by a host that has started listening. */
const MEASURE_REQUEST = 'item-screen-measure'

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
 *
 * It answers a request as well as volunteering, because everything it
 * volunteers can be said to an empty room. On the first page load this
 * document arrives inside the server's HTML and its script runs while the
 * host's own bundle is still being fetched, so all three of the sends below —
 * on parse, on load, and the one `ResizeObserver` makes when it starts
 * observing — can be spent before the host is listening. Nothing after that
 * recovers the height except a resize the Learner has no reason to perform,
 * and the frame keeps its placeholder: a screen silently cut off at `240px`,
 * which on a Gate Quiz item can remove the very thing being judged.
 *
 * So whichever side is ready second speaks. The host asks the moment it starts
 * listening; if the screen has not loaded yet that question is lost instead,
 * and the screen's own first send lands on a host that is by then listening.
 * One of the two always arrives.
 */
const MEASURE_SCRIPT = `
  var send = function () {
    parent.postMessage(
      { type: '${HEIGHT_MESSAGE}', slug: SLUG, height: Math.ceil(document.body.getBoundingClientRect().height) },
      '*',
    )
  }
  addEventListener('message', function (event) {
    if (event.data === '${MEASURE_REQUEST}') send()
  })
  new ResizeObserver(send).observe(document.body)
  addEventListener('load', send)
  send()
`

/**
 * Remembers how tall each frame reported itself to be, keyed by a string the
 * caller invents.
 *
 * The map is held here rather than inside a frame because neither `ItemScreen`
 * nor `ItemSequence` is remounted when the Learner moves between items. A
 * single number would be the previous artefact's until the new one reported,
 * briefly cutting off whatever is taller; a map also makes stepping Back
 * instant and correct rather than re-measured.
 */
function useFrameHeights() {
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    function receive(event: MessageEvent) {
      const data = event.data
      if (data?.type !== HEIGHT_MESSAGE || typeof data.slug !== 'string') return
      if (typeof data.height !== 'number' || data.height <= 0) return
      setHeights((previous) =>
        previous[data.slug] === data.height ? previous : { ...previous, [data.slug]: data.height },
      )
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [])

  // Enough to show most screens before the first measurement lands, so the
  // page does not visibly jump on a fast connection.
  return (frameKey: string) => heights[frameKey] ?? 240
}

/**
 * One drawn state in its own sandbox, sized to what it reports.
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
function Frame({
  frameKey,
  lang,
  html,
  css,
  title,
  height,
  onPan,
}: {
  frameKey: string
  lang: Language
  html: string
  css: string
  /** The frame's accessible name — what a Learner who cannot see it is given. */
  title: string
  height: number
  onPan: () => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // The other half of the handshake. A frame that has not loaded yet drops
    // this, which is the case where its own send arrives instead; the listener
    // in `useFrameHeights` is already attached by the time this runs, because
    // a parent's effects run after its children's.
    frame.current?.contentWindow?.postMessage(MEASURE_REQUEST, '*')
  }, [frameKey])

  const srcDoc = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><style>${css}</style></head>
<body>${html}<script>var SLUG = ${JSON.stringify(frameKey)};${MEASURE_SCRIPT}</script></body>
</html>`

  return (
    /*
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
    */
    <div onScroll={onPan} className="overflow-x-auto rounded-badge">
      <iframe
        ref={frame}
        // Remounting on the key gives each state a frame of its own, so a
        // stale height can never be applied to the screen that replaced it.
        key={frameKey}
        title={title}
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
  )
}

/** Said only while it is true, and once for the artefact rather than once per frame. */
function PanHint({ lang, panned }: { lang: Language; panned: boolean }) {
  // An artefact that pans with nothing to say so is the Perceived clickability
  // defect this platform's fourth Competency teaches Learners to find,
  // committed on the page teaching it — and it stops being worth saying the
  // moment they have panned.
  if (panned) return null
  return <p className="mt-2.5 text-label font-bold text-ink-2 sm:hidden">{PAN_HINT[lang]}</p>
}

/** The artefact drawn as one still (ADR-0006: "a good scenario item needs a real screenshot"). */
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
  const heightOf = useFrameHeights()
  const [panned, setPanned] = useState(false)

  return (
    <div>
      <Frame
        frameKey={slug}
        lang={lang}
        html={html}
        css={css}
        title={description}
        height={heightOf(slug)}
        onPan={() => setPanned(true)}
      />
      <PanHint lang={lang} panned={panned} />
    </div>
  )
}

/**
 * The artefact drawn as several states, for a defect that only exists across
 * time — a wait, a state change, an error arriving (#64).
 *
 * **Stacked, not played.** Every state is on the page at once, in time order,
 * top to bottom. Nothing moves, nothing auto-advances, and there is no control
 * to operate: a Learner who cannot or will not watch an animation reads exactly
 * what everyone else reads, and an Attempt renders identically every time it is
 * opened. It also means the states can be compared — which is the whole
 * judgement in an item asking what the interface failed to say between two
 * moments, and precisely what a player showing one at a time takes away.
 *
 * **Down, not across.** Two columns cannot carry an order — reading order forks
 * at the top of every row — so the only way to say "this comes after that" is
 * to put it after it. Side by side would also multiply the 720px floor by the
 * number of states, and the arrangement inside each state is frequently the
 * question.
 *
 * An ordered list, so the position of each state is in the markup rather than
 * only in the captions: a screen reader announces "2 of 3" without the author
 * having to write it, in either language, and the numbering cannot drift out of
 * step with the states the way a hand-typed "Step 2" would.
 */
export function ItemSequence({
  slug,
  lang,
  steps,
  css,
  description,
}: {
  slug: string
  lang: Language
  steps: { caption: string; html: string }[]
  css: string
  /** The prose artefact — every state in order, for a Learner who cannot see them. */
  description: string
}) {
  const heightOf = useFrameHeights()
  const [panned, setPanned] = useState(false)

  return (
    <div>
      {/*
        The prose artefact names the whole sequence rather than each frame. On
        a single screen it is the frame's own accessible name, which is right
        when there is one frame; repeated across three, a screen reader would
        read the entire description three times over before reaching the first
        caption.
      */}
      <ol aria-label={description} className="flex flex-col gap-[22px]">
        {steps.map((step, index) => {
          const frameKey = `${slug}#${index}`
          return (
            <li key={frameKey}>
              {/* The caption above its state, because it says which moment is
                  about to be looked at. Underneath it would be read after the
                  looking it was meant to frame. */}
              <p className="pb-2 text-label font-bold text-ink-2">{step.caption}</p>
              <Frame
                frameKey={frameKey}
                lang={lang}
                html={step.html}
                css={css}
                title={step.caption}
                height={heightOf(frameKey)}
                onPan={() => setPanned(true)}
              />
            </li>
          )
        })}
      </ol>
      <PanHint lang={lang} panned={panned} />
    </div>
  )
}
