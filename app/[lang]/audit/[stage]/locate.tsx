'use client'

/**
 * "Show me on the page."
 *
 * A Planted Defect and a Finding both name their element by identifier, which
 * is the right key and a poor label — `confirm-selected-orders` is a record,
 * not a thing a Learner can see. The quoted words beside it say which element
 * it is; this says *where*, by marking it on the subject itself.
 *
 * It reaches the frame through the document rather than through a ref, because
 * the frame belongs to the layout around these panels and the button belongs
 * to the panel inside it. One `id`, agreed between them, is a smaller contract
 * than threading a ref across a route boundary for a single message.
 *
 * Narrow screens carry the subject in a panel above the report, and that panel
 * may be collapsed. Opening it is part of answering the press: a control that
 * points somewhere the reader cannot see has not answered at all.
 *
 * Nothing is announced when the mark lands, and that is a decision rather than
 * an omission. What this control does is inherently visual — it puts an
 * outline around something — and the two things a reader who cannot see it
 * would want from it are already on the card above: the element's own words
 * and its identifier. A live region here would read a sentence about a change
 * nobody can perceive, and there would be one per card.
 */
export const SUBJECT_FRAME_ID = 'audit-subject'

export function LocateButton({ element, label }: { element: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const frame = document.getElementById(SUBJECT_FRAME_ID) as HTMLIFrameElement | null
        if (!frame) return

        const panel = frame.closest('details')
        if (panel && !panel.open) panel.open = true

        const post = () =>
          frame.contentWindow?.postMessage({ type: 'locate-element', element }, window.location.origin)
        // A frame inside a closed panel is still loaded by the browser, but it
        // may not have finished: a message sent before its listener exists is
        // a press that does nothing.
        if (frame.contentDocument?.readyState === 'complete') post()
        else frame.addEventListener('load', post, { once: true })

        // Where the subject sits above the report rather than beside it, the
        // mark is off-screen until the page goes to it.
        if (window.matchMedia('(max-width: 1099px)').matches) {
          frame.scrollIntoView({
            block: 'center',
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          })
        }
      }}
      // A pill, because it is pressed; sunk rather than oxblood, because this
      // repeats on every card and the action colour is spent on the one thing
      // a screen asks for. The Answering Control Rule already reaches `button`,
      // so the press is felt without a class saying so.
      className="press mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-sunk px-[17px] text-label font-bold text-ink"
    >
      {/* The rail's icon grammar: 24px box, 1.7 stroke, round caps, no fill.
          Khaki, which is where this system spends small icons. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-[15px] shrink-0 fill-none stroke-khaki stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <circle cx="12" cy="12" r="5.5" />
        <path d="M12 2.5v3.5M12 18v3.5M2.5 12h3.5M18 12h3.5" />
      </svg>
      {label}
    </button>
  )
}
