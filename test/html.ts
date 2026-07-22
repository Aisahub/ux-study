/**
 * The text a visitor actually sees, with markup removed.
 *
 * Tests assert against this rather than against raw HTML, for two reasons.
 * React's server rendering inserts comment markers between a static string and
 * an interpolated value, so raw-HTML matching fails on a page that renders
 * correctly. And the streamed RSC payload repeats page text inside <script>
 * tags, so raw-HTML matching can also *pass* on a page that renders nothing —
 * the more dangerous of the two failures, which is why scripts are dropped
 * first.
 */
export function visibleText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
