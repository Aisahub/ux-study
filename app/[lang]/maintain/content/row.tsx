/**
 * One row of this page's two-part shape: what is being counted, and the count.
 * Shared by both panels, which is why it is a file rather than a local — the
 * two shelves that use it are now two routes.
 *
 * The identifier takes the flexible column and wraps; the figure sits in a
 * column that never shrinks. It was the other way round until 2026-07-31 —
 * `truncate` on the identifier, `shrink-0` on the figure — which cut the only
 * handle a Maintainer has for finding the item to fix and preserved the number
 * they can always re-read. Below `sm` the two stack rather than sharing a
 * 208px line.
 *
 * The name column is capped rather than elastic. Pushed to the two ends of an
 * 896px card the pair sat a measured 506px apart, and seventy rows of that is
 * an invitation to read one item's name against the row below's figure. 22rem
 * holds the longest authored name (305px) with room to spare and still lands
 * every figure on one vertical line, so the column stays scannable downward:
 * median gap 143px. A name longer than the cap wraps; nothing is cut.
 *
 * A `detail` line under the name lifts the name to the `title` step — the one
 * this system assigns to a row name — and leaves the second line to say what
 * kind of thing it is. Without one the name stays at `body-sm`, which is what
 * a bare identifier has always been here.
 */
export function Row({
  name,
  detail,
  value,
  absent,
}: {
  name: React.ReactNode
  detail?: React.ReactNode
  value: string
  absent?: boolean
}) {
  return (
    <li className="grid gap-x-[14px] sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-baseline">
      <span className="min-w-0 [overflow-wrap:anywhere]">
        <span className={detail ? 'block text-title font-bold text-ink' : 'block text-body-sm text-ink'}>
          {name}
        </span>
        {detail}
      </span>
      <span className={absent ? 'text-body-sm text-ink-2' : 'text-label font-bold text-ink'}>
        {value}
      </span>
    </li>
  )
}
