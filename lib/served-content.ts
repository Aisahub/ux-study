import { specimenAsServed, type PracticePage, type ServedSpecimen } from './content'
import { content } from './server-content'

/**
 * Content as a Learner is served it.
 *
 * One rule holds this module together: **nothing authored for a maintainer may
 * reach a Learner's view-source.** The practice page's stylesheet says in a
 * header comment where the Planted Defects live, the behaviour's says which
 * moments were built to go quiet, and the item screens' says which class
 * choices make a screen wrong — documentation for whoever maintains them, and
 * the answer for whoever is being asked to find them.
 *
 * The rule used to be applied wherever it was needed: the same comment pattern
 * was written twice in this file's predecessor and a third time in a test, so
 * the test asserted against its own reproduction of what production does rather
 * than against production. Projections live here now, and the pattern exists
 * once (#133).
 *
 * Everything is projected once at module scope. The content is loaded once per
 * server process, so a per-request strip would be the same work on every
 * request forever.
 */

/**
 * Both authored assets are written with block comments only, so one pattern
 * removes every comment in them. Line comments would need a second pattern and
 * a rule about strings; the authoring convention is what keeps this one line.
 */
const COMMENT = /\/\*[\s\S]*?\*\//g

/** An authored file as served: authoring comments stripped, leading blank space with them. */
export function asServed(source: string): string {
  return source.replace(COMMENT, '').trimStart()
}

function perStage(part: (page: PracticePage) => string): Map<number, string> {
  return new Map(content.practicePages.map((page) => [page.stage, asServed(part(page))]))
}

const css = perStage((page) => page.css)
const js = perStage((page) => page.js)

/** One Stage's subject stylesheet, as served. Empty where the Stage has no subject. */
export function practicePageCss(stage: number): string {
  return css.get(stage) ?? ''
}

/** One Stage's subject behaviour, as served. Empty where the subject does not walk. */
export function practicePageJs(stage: number): string {
  return js.get(stage) ?? ''
}

/** The stylesheet the drawn Quiz Item screens carry, as served. */
export const itemScreenCss = asServed(content.itemScreenCss)

/**
 * The specimen Self-Audit Report as a Learner reads it (ADR-0011), or null
 * where none is authored.
 *
 * The projection itself is `specimenAsServed`, beside the type it projects;
 * what lives here is that the surfaces read the projected one. Dropping it in
 * the projection rather than in each surface is what stops the next surface
 * from having to remember.
 */
export const specimen: ServedSpecimen | null = specimenAsServed(content)
