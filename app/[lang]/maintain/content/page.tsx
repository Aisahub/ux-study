import { notFound } from 'next/navigation'

import { isNotNull } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireMaintainer } from '@/lib/auth'
import { isLanguage } from '@/lib/language'
import { content } from '@/lib/server-content'

import { COPY, type Copy } from './copy'

export const dynamic = 'force-dynamic'

/**
 * One row of this shelf's two-part shape: what is being counted, and the count.
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
 * A file of its own from 2026-09-14, while the defect shelves used it too, and
 * back here now that they are one table with three figure columns and none.
 */
function Row({ name, value }: { name: string; value: string }) {
  return (
    <li className="grid gap-x-[14px] sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-baseline">
      <span className="min-w-0 text-body-sm text-ink [overflow-wrap:anywhere]">{name}</span>
      <span className="text-label font-bold text-ink">{value}</span>
    </li>
  )
}

/**
 * One Competency's items that nobody has been served yet, named and folded.
 *
 * The label is in full ink rather than the faded tone this page spends on an
 * absent figure: this is a control, and a control drawn in the colour of
 * unavailable text is the Perceived clickability defect this platform's fourth
 * Competency teaches. What is empty about the pool is said in the words.
 *
 * No `.press` class — `globals.css` reaches a `<summary>` by what it is, and a
 * control that has to remember to enrol itself is the bug ERR-218 recorded.
 * The native marker is dropped for a caret that can turn where this row needs
 * it. `min-h-11` because the row is the target: 44px belongs to whatever
 * answers a tap, not to the element around it.
 */
function NeverDrawn({ slugs, copy }: { slugs: string[]; copy: Copy }) {
  return (
    <details className="group">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-body-sm text-ink [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="text-ink-2 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
        >
          ▸
        </span>
        {copy.neverDrawnPool(slugs.length)}
      </summary>
      <ul className="flex flex-col gap-1.5 pb-1.5 pl-[22px]">
        {slugs.map((slug) => (
          <li key={slug} className="text-body-sm text-ink-2 [overflow-wrap:anywhere]">
            {slug}
          </li>
        ))}
      </ul>
    </details>
  )
}

/**
 * The Quiz Item half of the Maintainer's content page (#28), and the panel this
 * route opens on. Pass rates are per item, with the draw count beside every
 * rate so three draws never look settled (ADR-0006).
 *
 * The heading, the sentence true of every figure here, and the switch to the
 * other panel are the layout's; this file is the shelf.
 */
export default async function QuizItemHealth({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireMaintainer(lang)
  const copy = COPY[lang]

  const attempts = await db.select().from(schema.attempts).where(isNotNull(schema.attempts.submittedAt))

  // Per item: how often drawn, how often answered correctly.
  const byItem = new Map<string, { drawn: number; correct: number }>()
  for (const attempt of attempts) {
    for (const selection of attempt.selections ?? []) {
      const entry = byItem.get(selection.item) ?? { drawn: 0, correct: 0 }
      entry.drawn += 1
      if (selection.correct) entry.correct += 1
      byItem.set(selection.item, entry)
    }
  }

  return (
    <section aria-labelledby="items" className="rounded-card bg-surface p-[26px] shadow-card">
      <h2 id="items" className="font-serif text-headline font-bold text-ink">
        {copy.itemsHeading}
      </h2>
      <p className="mt-2 max-w-measure text-body-sm text-ink-2">{copy.itemsExplanation}</p>
      {/* Grouped by Stage, and every declared Competency is listed whether or
          not it has been authored yet. A Maintainer watching content health
          needs to see the gaps: a Stage whose Competencies simply do not
          appear looks identical to a Stage that is finished.
          The rhythm is the grouping: 22px between Stages, 14px between
          Competencies, 6px between the rows of one pool. One interval
          repeated would give thirty-two items and three Stages the same
          weight.

          Within a Competency the items that have been drawn are rows and
          the ones that have not are one line behind a press. This shelf
          listed all ninety-six as rows until 2026-09-14, and ninety-one of
          them said the same five words — `아직 출제되지 않음` — which made it
          3257px of the page's 5844 and left the five rows that carry a
          figure to be found by scanning the ninety-one that do not. The
          job that list was doing is still done, in one line that names the
          count: a pool nobody has been served is a fact about the pool,
          not eight facts about eight items.

          `<details>`, the way the passed-quiz review already offers the
          items a Learner got right: closed, named, and one press away. It
          folds before hydration and with JavaScript off, answers the
          keyboard, and tells a screen reader whether it is open. Nothing
          is hidden that a Maintainer cannot reach, and `⌘F` still finds a
          slug on a closed pool in every browser that searches collapsed
          `details` — which, where it does not, is one press from true. */}
      {content.config.stages.map(({ stage, competencies }) => (
        <div key={stage} className="mt-[22px]">
          <h3 className="text-title font-bold text-ink">{copy.stage(stage)}</h3>
          {competencies.map((slug) => {
            const competency = content.competencies.find((entry) => entry.slug === slug)
            const pool = content.items[slug] ?? []
            const drawn = pool.filter((item) => byItem.has(item.slug))
            const never = pool.filter((item) => !byItem.has(item.slug))
            return (
              <div key={slug} className="mt-[14px]">
                <h4 className="text-label font-bold text-ink">{competency?.name[lang] ?? slug}</h4>
                {pool.length === 0 && (
                  <p className="mt-1.5 text-body-sm text-ink-2">{copy.notAuthored}</p>
                )}
                {drawn.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {drawn.map((item) => {
                      const stats = byItem.get(item.slug)!
                      return (
                        <Row
                          key={item.slug}
                          name={item.slug}
                          value={copy.rate(stats.correct, stats.drawn)}
                        />
                      )
                    })}
                  </ul>
                )}
                {never.length > 0 && <NeverDrawn slugs={never.map((item) => item.slug)} copy={copy} />}
              </div>
            )
          })}
        </div>
      ))}
    </section>
  )
}
