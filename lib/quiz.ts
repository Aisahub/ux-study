import { randomInt } from 'node:crypto'

/**
 * Drawing and ordering for Gate Quiz attempts (#21, #22). Pure functions —
 * the database writes live in the quiz actions.
 */

/** A random draw of `count` slugs, never identical to the previous attempt's set (#22). */
export function drawItems(pool: string[], count: number, previous: string[] | null): string[] {
  // 5 of 8 leaves 56 possible sets, so redrawing on a collision ends fast.
  for (;;) {
    const remaining = [...pool]
    const drawn: string[] = []
    while (drawn.length < count) {
      drawn.push(...remaining.splice(randomInt(remaining.length), 1))
    }
    if (!previous || !sameSet(drawn, previous)) return drawn
  }
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
