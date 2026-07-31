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
  return collapse(
    decodeEntities(
      html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]+>/g, ' '),
    ),
  )
}

const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

/**
 * Entities back into the characters a reader sees.
 *
 * React escapes `'` to `&#x27;` and `"` to `&quot;`, so without this a page
 * rendering "a screen's words" answers `toContain("a screen's words")` with no,
 * and copy would end up written around the helper rather than for the Learner.
 * The costlier direction is a `not.toContain` passing because the text it was
 * looking for was sitting there encoded.
 *
 * Runs after the tags are gone, so text that legitimately reads `&lt;div&gt;`
 * decodes to visible characters instead of becoming markup this then strips.
 */
function decodeEntities(text: string): string {
  return text.replace(/&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (!body.startsWith('#')) return NAMED[body] ?? whole
    const code =
      body[1] === 'x' || body[1] === 'X'
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10)
    // The range, not `Number.isFinite`: the pattern above guarantees a digit,
    // so `parseInt` cannot hand back NaN and that guard would never fire. What
    // it would have let past is `&#1114112;`, which is finite and makes
    // `String.fromCodePoint` throw — turning a failing assertion into a crashed
    // one, which reads as a broken suite rather than a broken page.
    return code <= 0x10ffff ? String.fromCodePoint(code) : whole
  })
}

// After decoding, so a `&nbsp;` is normalised to a space like any other gap —
// a Learner cannot see which kind of space they are looking at, and neither
// should an assertion.
function collapse(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
