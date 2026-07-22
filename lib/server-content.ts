import { loadContent } from './content'

/**
 * The content, loaded once per server process. Build time already validated
 * it (next.config.ts), so this load cannot fail on anything the build let
 * through; module scope makes it a read, not a re-parse, on every request.
 */
export const content = loadContent()

/**
 * The Practice Page stylesheet as served (#23): authoring comments stripped.
 * The authored file's header comment says where the planted defects live —
 * documentation for a maintainer, a hint for a Learner. Nothing authored may
 * reach the Learner's view-source that the audit is meant to withhold.
 */
export const practicePageCss = content.practicePage.css.replace(/\/\*[\s\S]*?\*\//g, '').trimStart()
