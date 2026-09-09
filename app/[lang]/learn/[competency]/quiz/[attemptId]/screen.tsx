'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { Language } from '@/lib/language'

/** Posted by the screen to its host; nothing else crosses the boundary. */
const HEIGHT_MESSAGE = 'item-screen-height'

/** Posted the other way, once, by a host that has started listening. */
const MEASURE_REQUEST = 'item-screen-measure'

/**
 * How far the screen may be shrunk to fit its column before shrinking stops
 * being the kinder answer.
 *
 * The item card's two-column row starts at a `1200px` window, where the screen
 * column is `539px` of the `720px` floor — `0.749`. This sits just under that,
 * so the row always scales and never cuts, and a box narrower than the row can
 * ever produce (a phone, a stacked card on a small tablet) falls back to
 * panning instead. Below three quarters the type stops being type: `0.52` on a
 * `375px` phone would set a `14px` body face at `7px`, which is not a screen
 * anybody can judge — it is a picture of one.
 */
const MIN_SCALE = 0.74

/** Shown under a screen its column is too narrow to hold, until it is panned. */
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
 * Which of an artefact's frames are wider than the box holding them.
 *
 * A map rather than a boolean, and reported by a callback that never changes
 * identity, for the same two reasons `useFrameHeights` is shaped this way: a
 * sequence has one frame per state, and an effect whose dependency is a fresh
 * arrow on every render measures forever.
 *
 * It is asked about named frames rather than about everything it has ever
 * heard, and that is the whole of the difference from a plain boolean. Neither
 * `ItemScreen` nor `ItemSequence` is remounted when the Learner moves to the
 * next item, so the map keeps the previous artefact's keys; answered over all
 * of them, a panned item 1 would put a pan hint under an item 2 that fits.
 * `useFrameHeights` is safe from this because it is read one key at a time.
 */
function useFrameOverflow(frameKeys: string[]) {
  const [frames, setFrames] = useState<Record<string, boolean>>({})

  const report = useCallback((frameKey: string, overflowing: boolean) => {
    setFrames((previous) =>
      previous[frameKey] === overflowing ? previous : { ...previous, [frameKey]: overflowing },
    )
  }, [])

  // Any of this artefact's own: its frames share one column, so in practice
  // they overflow together — but the hint is about the artefact, and it is
  // true the moment one state of it is cut off.
  return { overflowing: frameKeys.some((frameKey) => frames[frameKey]), report }
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
  onOverflow,
}: {
  frameKey: string
  lang: Language
  html: string
  css: string
  /** The frame's accessible name — what a Learner who cannot see it is given. */
  title: string
  height: number
  onPan: () => void
  /** Told whenever this frame is wider than the box, so the host can say so. */
  onOverflow: (frameKey: string, overflowing: boolean) => void
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

  // Whether the frame is actually wider than the box holding it, which is the
  // only thing that makes the pan hint true. It used to be inferred from a
  // breakpoint — the hint was `sm:hidden`, on the assumption that only a phone
  // was ever too narrow. That stopped being true on 2026-09-09, when the item
  // card began setting the screen beside its question from `wide`: between
  // roughly 1100px and 1380px of window the column is under the screen's own
  // width and the screen pans on a desktop, where the hint was hidden and
  // macOS hides the scrollbar until it is already being used. A screen that
  // pans and does not say so is the Perceived clickability defect this
  // platform's fourth Competency teaches. Measured, so it is right at every
  // width and needs no number of its own.
  const box = useRef<HTMLDivElement>(null)

  // What the measurement decided: how far the screen is being shrunk, and the
  // width it is being shrunk from. One value and not two, because they are one
  // reading of the DOM — a scale without the floor it was taken against cannot
  // size the box that holds it. `{ scale: 1 }` until the first measurement, so
  // the server's render and the first paint draw the screen exactly as they
  // did before scaling existed.
  const [fit, setFit] = useState<{ scale: number; floor: number }>({ scale: 1, floor: 0 })

  useEffect(() => {
    const element = box.current
    if (!element) return
    // Read from the token that declares it rather than retyped:
    // `--item-screen-floor` is the same number the frame's `min-width` and the
    // wizard's column track are built from, and a second copy here would be
    // the one that failed to move when the floor did.
    const floor =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--item-screen-floor'),
      ) || 0

    const measure = () => {
      const width = element.clientWidth
      const ratio = floor > 0 && width > 0 && width < floor ? width / floor : 1
      setFit((previous) => {
        const scale = ratio >= MIN_SCALE ? ratio : 1
        return previous.scale === scale && previous.floor === floor ? previous : { scale, floor }
      })
      // A pixel of slack: a fractional column width leaves `scrollWidth` a
      // hair over `clientWidth` on a screen that is fully visible, and a hint
      // that appears on a screen with nothing hidden is worse than none.
      onOverflow(frameKey, element.scrollWidth > element.clientWidth + 1)
    }
    measure()
    // Both edges move: the box with the window, and the frame's own height
    // arrives after the first paint and can change the box's scrollbar. One
    // observer on the box catches both; `srcDoc` changing re-runs the effect.
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [srcDoc, frameKey, onOverflow])

  // Shrink the whole screen to the room there is, rather than hide the part
  // that does not fit. Everything scales together — type, rules, gaps, the
  // columns of a table — so the arrangement the item is asking about survives
  // exactly, which is the difference between this and reflowing the frame into
  // a narrower viewport. Reflow is the thing this component may never do; a
  // smaller picture of the same drawing is not that.
  //
  // Not free, and the cost is worth naming: the screen ends up drawn smaller
  // than the card around it, which is a difference in size the author did not
  // put there. Two of the ninety-six items turn on absolute type size — one
  // sets a panel at `10px` against a `14px` page and asks what the squinting
  // means — and for those the *ratio* is what carries the answer, and the
  // ratio is exactly what scaling preserves.
  const { scale } = fit

  return (
    /*
      The screen is held to a floor width and panned when its column is
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
    <div ref={box} onScroll={onPan} className="overflow-x-auto rounded-badge">
      {/* The scaled box. A transform moves what is painted and not what is
          laid out, so without this wrapper the frame would still occupy its
          full `720px` and the column would go on offering a sideways scroll
          over empty space. Given the drawn size instead, it is the thing the
          card lays out and the thing the pan measurement reads — so a scaled
          screen reports no overflow, and the hint stays silent because there
          is nothing hidden to say. */}
      <div
        // Two things only while it is holding a scaled screen, and both would
        // be wrong at full size.
        //
        // `overflow-hidden`, because a transform moves paint and not layout:
        // without the clip the frame would still occupy its full `720px` and
        // the column would offer a sideways scroll over empty space. Left on
        // at full size it would do the opposite of nothing — an unscaled frame
        // is `720px` inside a narrower box on purpose, and hiding that
        // overflow would cut the screen off with no way to reach the rest.
        //
        // And the lift. `shadow-card` is on the frame, and a shadow paints
        // outside the box it belongs to, so this clip — which is exactly the
        // drawn size — removed it entirely: the artefact went flat against the
        // card asking about it, which is the one thing DESIGN.md asks the
        // shadow to prevent. An element's own shadow is not clipped by its own
        // overflow, so the box that does the clipping is the box that must
        // carry it.
        className={
          scale < 1 ? 'overflow-hidden rounded-badge bg-white shadow-card' : 'rounded-badge'
        }
        style={
          scale < 1
            ? { width: Math.floor(fit.floor * scale), height: Math.ceil(height * scale) }
            : undefined
        }
      >
        <iframe
          ref={frame}
          // Remounting on the key gives each state a frame of its own, so a
          // stale height can never be applied to the screen that replaced it.
          key={frameKey}
          title={title}
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          scrolling="no"
          style={
            scale < 1
              ? {
                  height,
                  width: fit.floor,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }
              : { height }
          }
          // Lifted off the card rather than outlined on it: this system draws
          // no borders, and the artefact has to read as a separate object from
          // the page asking about it.
          className="w-full min-w-(--item-screen-floor) rounded-badge bg-white shadow-card"
        />
      </div>
    </div>
  )
}

/** Said only while it is true, and once for the artefact rather than once per frame. */
function PanHint({
  lang,
  panned,
  overflowing,
}: {
  lang: Language
  panned: boolean
  /** True while any of the artefact's frames is wider than the box holding it. */
  overflowing: boolean
}) {
  // An artefact that pans with nothing to say so is the Perceived clickability
  // defect this platform's fourth Competency teaches Learners to find,
  // committed on the page teaching it — and it stops being worth saying the
  // moment they have panned, or the moment the whole screen fits.
  if (panned || !overflowing) return null
  return <p className="mt-2.5 text-label font-bold text-ink-2">{PAN_HINT[lang]}</p>
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
  const { overflowing, report } = useFrameOverflow([slug])
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
        onOverflow={report}
      />
      <PanHint lang={lang} panned={panned} overflowing={overflowing} />
    </div>
  )
}

/** One state's frame key, written once because two places now spell it. */
function frameKeyOf(slug: string, index: number): string {
  return `${slug}#${index}`
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
  const { overflowing, report } = useFrameOverflow(steps.map((_, index) => frameKeyOf(slug, index)))
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
          const frameKey = frameKeyOf(slug, index)
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
                onOverflow={report}
              />
            </li>
          )
        })}
      </ol>
      <PanHint lang={lang} panned={panned} overflowing={overflowing} />
    </div>
  )
}
