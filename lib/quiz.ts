import { randomInt } from 'node:crypto'

/**
 * Drawing and ordering for Gate Quiz attempts (#21, #22). Pure functions —
 * the database writes live in the quiz actions.
 */

/**
 * A random draw of `count` slugs, never identical to the previous attempt's
 * set (#22), and setting aside every item this Learner has already answered
 * correctly so a retry spends its slots on what they have not shown yet.
 *
 * `mastered` cannot always be honoured. The pool is 8 and a draw is 5, so from
 * the fourth item set aside onward there are no longer five others to take.
 * The draw is then topped up from the mastered ones rather than served short:
 * an attempt of four items would quietly change what the pass threshold means.
 */
export function drawItems(
  pool: string[],
  count: number,
  previous: string[] | null,
  mastered: string[] = [],
): string[] {
  const setAside = new Set(mastered)
  const open = pool.filter((slug) => !setAside.has(slug))

  // Too few left: make the shortfall up from the set-aside items, at random,
  // so two retries in this state still differ from each other.
  if (open.length < count) {
    const topUp = take(pool.filter((slug) => setAside.has(slug)), count - open.length)
    return take([...open, ...topUp], count)
  }

  // Exactly enough left means there is a single possible set, so asking for a
  // different one than last time would never return.
  if (open.length === count) return take(open, count)

  // 5 of 8 leaves 56 possible sets, so redrawing on a collision ends fast.
  for (;;) {
    const drawn = take(open, count)
    if (!previous || !sameSet(drawn, previous)) return drawn
  }
}

/** `count` of `from`, without replacement, in random order. */
function take(from: string[], count: number): string[] {
  const remaining = [...from]
  const taken: string[] = []
  while (taken.length < count && remaining.length > 0) {
    taken.push(...remaining.splice(randomInt(remaining.length), 1))
  }
  return taken
}

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index])
}

export interface ScoredSelection {
  item: string
  choice: number
  correct: boolean
}

/**
 * Scores a submitted draw (#21). Correctness is decided against the keyed
 * option's authored index and frozen into the selections, so re-scoring the
 * stored attempt yields the same verdict even after an item is reworded.
 */
export function scoreDraw(
  drawn: string[],
  keyedIndexBySlug: Record<string, number>,
  choices: Record<string, number>,
  passThreshold: number,
): { selections: ScoredSelection[]; score: number; passed: boolean } {
  const selections = drawn.map((slug) => {
    const choice = choices[slug]
    return {
      item: slug,
      // An unanswered item is stored as -1: chosen nothing, correct nowhere.
      choice: typeof choice === 'number' ? choice : -1,
      correct: typeof choice === 'number' && choice === keyedIndexBySlug[slug],
    }
  })
  const score = selections.filter((selection) => selection.correct).length
  return { selections, score, passed: score >= passThreshold }
}

/**
 * A deterministic permutation of option positions. The authored files key the
 * correct answer in a recognisable position, so serving authored order would
 * leak it; seeding the shuffle from the attempt and the item keeps one
 * attempt's order stable across refreshes and back-navigation.
 */
export function shuffledOrder(seed: string, length: number): number[] {
  let state = 2166136261
  for (const char of seed) {
    state ^= char.charCodeAt(0)
    state = Math.imul(state, 16777619)
  }
  const order = Array.from({ length }, (_, index) => index)
  for (let i = length - 1; i > 0; i--) {
    // xorshift32 — quality is irrelevant, determinism is the point.
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    const j = Math.abs(state) % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
