'use client'

import { useLinkStatus } from 'next/link'
import { useFormStatus } from 'react-dom'

/**
 * What a control shows while the server is still thinking.
 *
 * `globals.css` answers the press itself, instantly and in CSS, because that
 * answer is owed before any request is made. This file answers the wait after
 * it, which CSS cannot: only React knows when a form action or a navigation
 * has actually finished.
 *
 * The wait is not incidental here. Every screen a Learner moves between is
 * `force-dynamic` and most of them are a database round trip away, and the
 * Gate Quiz doorstep is the worst of them — it draws a set, writes it, and
 * redirects before the next screen renders. A control that stays perfectly
 * still through all of that has told the Learner it did not hear them, and
 * they do the only sensible thing, which is press it again.
 */

/**
 * A turning half-ring, sized from the text beside it so it matches whatever
 * step the control is set in and inherits its colour on the oxblood pill and
 * the white one alike.
 *
 * `motion-reduce` stops it turning rather than removing it: a Learner who has
 * asked for less motion has not asked to be told less, and the changed label
 * beside it carries the meaning on its own.
 */
export function Spinner() {
  return (
    <span
      aria-hidden
      className="size-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent border-b-transparent motion-reduce:animate-none"
    />
  )
}

/**
 * A form's submit button, which reports its own form's flight.
 *
 * `useFormStatus` reads the nearest form above it, so this has to be rendered
 * inside the `<form>` rather than wrapped around it. Idle, it renders exactly
 * what a plain `<button>` did — same classes, same children, nothing added —
 * so nothing about the resting screen moves.
 *
 * Disabling while in flight is not decoration. `restartAttempt` deletes the
 * open attempt and draws a new one; two presses of a button that looked dead
 * after the first ran that twice.
 */
export function SubmitButton({
  className,
  children,
  pendingLabel,
  'aria-label': ariaLabel,
}: {
  className?: string
  children: React.ReactNode
  /** What the button says while it works. Falls back to its resting label. */
  pendingLabel?: string
  'aria-label'?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} aria-busy={pending} aria-label={ariaLabel} className={className}>
      {pending ? (
        <span className="inline-flex items-center gap-2.5">
          <Spinner />
          {pendingLabel ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

/**
 * The same report for a `<Link>` drawn as a button, from inside the link.
 *
 * Absolute rather than in the flow, so the label does not jump sideways the
 * instant it is pressed — a control that rearranges itself under the finger
 * reads as a misfire, which is the opposite of what this is for. Its `<Link>`
 * therefore has to be `relative`; every caller is a full-width pill with
 * `26px` of padding, and the ring sits in that.
 */
export function LinkPending() {
  const { pending } = useLinkStatus()
  if (!pending) return null

  return (
    <span className="absolute top-1/2 right-[17px] -translate-y-1/2">
      <Spinner />
    </span>
  )
}
