import { loadContent } from './content'

/**
 * The content, loaded once per server process. Build time already validated
 * it (next.config.ts), so this load cannot fail on anything the build let
 * through; module scope makes it a read, not a re-parse, on every request.
 *
 * Read from the same place the build validated. `CONTENT_DIR` is set only by
 * the test suite, which points it at broken fixture content to prove the build
 * refuses it — but until #133 only next.config.ts honoured it, so "the build
 * validated what the server serves" was true by coincidence rather than by
 * construction.
 */
export const content = loadContent(process.env.CONTENT_DIR)

/**
 * Projections of this content live in `served-content.ts`, not here. This
 * module is the load; that one is the rule about what a Learner may see.
 */
