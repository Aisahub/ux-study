/**
 * How one attempt came out, drawn.
 *
 * It lived inside the doorstep until 2026-08-06, which is why the verdict
 * screen — the one place a Learner actually reads the outcome — had no mark at
 * all and said `통과` in a single ink word. `통과` and `미통과` differ by one
 * syllable and the two screens are otherwise identical in silhouette, so the
 * whole verdict rested on that syllable. DESIGN.md's first Do is that every
 * status is told three ways at once, colour, shape and words; this component is
 * the shape, and it is here rather than in one page so both places can say it.
 *
 * Never alone. It is `aria-hidden` on purpose: the word beside it carries the
 * state, and the mark repeats that in a channel a Learner who cannot read
 * colour still gets — filled, half-filled, hollow, distinguishable with no hue
 * at all (DESIGN.md, The Filling Mark Rule).
 */
export function AttemptMark({
  state,
  /**
   * Two sizes, both already in the system: `14` beside a row of text, `24` —
   * the route line's station — beside a display heading, where 14 would read
   * as a speck of dust next to 44px of serif. A third size would be a number
   * nobody decided.
   */
  size = 14,
}: {
  state: 'passed' | 'failed' | 'open'
  size?: 14 | 24
}) {
  return (
    <i
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${size === 24 ? 'size-[24px]' : 'size-[14px]'} ${
        state === 'passed'
          ? 'bg-oxblood'
          : state === 'open'
            ? 'bg-linear-[90deg,var(--oxblood)_0_50%,#fff_50%_100%] shadow-[inset_0_0_0_2.5px_var(--oxblood)]'
            : 'bg-white shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
      }`}
    />
  )
}
