import { loadContent, practicePageOf, type PracticePage } from './content'

/**
 * The content, loaded once per server process. Build time already validated
 * it (next.config.ts), so this load cannot fail on anything the build let
 * through; module scope makes it a read, not a re-parse, on every request.
 */
export const content = loadContent()

/** This Stage's audit subject, or null where none is authored yet (#61). */
export function practicePage(stage: number): PracticePage | null {
  return practicePageOf(content, stage)
}

/**
 * A Practice Page's stylesheet as served (#23): authoring comments stripped.
 * The authored file's header comment says where the planted defects live —
 * documentation for a maintainer, a hint for a Learner. Nothing authored may
 * reach the Learner's view-source that the audit is meant to withhold.
 *
 * Stripped once per Stage at module scope rather than per request, as it was
 * when there was one page to strip.
 */
const strippedCss = new Map(
  content.practicePages.map((page) => [page.stage, page.css.replace(/\/\*[\s\S]*?\*\//g, '').trimStart()]),
)

export function practicePageCss(stage: number): string {
  return strippedCss.get(stage) ?? ''
}

/**
 * The item-screen stylesheet as served, comments stripped for the same reason.
 * Its header explains to an author which class choices make a screen wrong —
 * a Learner reading it would be handed the thing the item asks them to find.
 */
export const itemScreenCss = content.itemScreenCss.replace(/\/\*[\s\S]*?\*\//g, '').trimStart()
