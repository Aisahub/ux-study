/**
 * What an element of an audit subject looks like, in the subject's own words.
 *
 * A Finding and a Planted Defect both name their element by identifier —
 * `confirm-selected-orders` — because an identifier is what makes a Korean
 * Finding and an English Finding the same record (ADR-0008). It is the right
 * key and the wrong label: on the reveal it left a Learner reading a list of
 * slugs with no way to tell which thing on the page each one was.
 *
 * The label is quoted from the served document rather than authored beside it.
 * Three reasons, in the order they mattered:
 *
 * - It cannot drift. A written-down name is a second description of an element
 *   that already describes itself, and the two go out of step the first time
 *   the subject is edited.
 * - It is bilingual for free, and identically so. Both variants expose the same
 *   identifiers by construction, so the same key yields each language's own
 *   words with nothing to keep in parity by hand.
 * - It is what the Learner is looking at. A label invented here could be
 *   clearer than the page — and being clearer than the page is exactly the
 *   thing a Learner is being asked to notice for themselves.
 *
 * Deliberately not a general HTML parser. These are three authored documents
 * this project writes, serves and tests; a scanner that assumes well-formed
 * markup with quoted attributes is honest about that, and the content build
 * already refuses a subject whose identifiers do not line up.
 */

/** Elements that carry no children, so their own attributes are all they say. */
const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

/** Form controls whose visible name is a `<label>` standing outside them. */
const LABELLED = new Set(['input', 'select', 'textarea'])

/**
 * Long enough to recognise a paragraph by its opening, short enough that a
 * card stays a card. The help-text defect is a 400-word wall on purpose, and a
 * label is a handle on it rather than a preview of it.
 */
const MAX_LENGTH = 42

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  thinsp: ' ',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  mdash: '—',
  ndash: '–',
  hellip: '…',
}

function decode(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body.startsWith('#')) {
      const code = body.startsWith('#x') || body.startsWith('#X') ? parseInt(body.slice(2), 16) : Number(body.slice(1))
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole
  })
}

/** One attribute off an opening tag's attribute run, or null where it carries none. */
function attribute(attributes: string, name: string): string | null {
  const match = new RegExp(`\\s${name}="([^"]*)"`).exec(attributes)
  return match ? match[1] : null
}

/**
 * Where an element ends, counting its own kind on the way so that a form
 * inside a form closes at the right one. Unclosed markup falls out at the end
 * of the document rather than throwing: a label is worth degrading, never
 * worth taking a page down for.
 */
function endOf(html: string, tag: string, from: number): number {
  const boundary = new RegExp(`<(/?)${tag}\\b`, 'gi')
  boundary.lastIndex = from
  let depth = 1
  let match: RegExpExecArray | null
  while ((match = boundary.exec(html)) !== null) {
    depth += match[1] === '/' ? -1 : 1
    if (depth === 0) return match.index
  }
  return html.length
}

/** The words inside a slice of markup, with anything unspoken taken out. */
function textOf(html: string): string {
  return decode(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function shorten(text: string): string {
  return text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH).trimEnd()}…` : text
}

/**
 * Every identified element of one language variant, against the words that
 * element shows on screen.
 *
 * Read at render time from `subject.html[lang]` rather than stored on the
 * loaded subject: it is wanted on one surface, the document is a few kilobytes,
 * and a derived field on `PracticePage` would be a second thing the content
 * build has to keep true.
 */
export function elementLabels(html: string): Record<string, string> {
  const labels: Record<string, string> = {}
  // An opening tag, with quoted attribute values allowed to contain `>`.
  const opening = /<([a-zA-Z][\w-]*)((?:[^>"]|"[^"]*")*)>/g
  let match: RegExpExecArray | null

  while ((match = opening.exec(html)) !== null) {
    const [whole, rawTag, attributes] = match
    const identifier = attribute(attributes, 'data-element')
    if (identifier === null) continue

    const tag = rawTag.toLowerCase()
    let text = ''

    // A control names itself through the label standing beside it, so that is
    // the word a Learner would use for it. Its own value is the data somebody
    // typed, which names the field only by accident.
    if (LABELLED.has(tag)) {
      const id = attribute(attributes, 'id')
      const labelled = id === null ? null : new RegExp(`<label[^>]*\\sfor="${id}"[^>]*>([\\s\\S]*?)</label>`).exec(html)
      text = labelled ? textOf(labelled[1]) : ''
      if (text === '') text = decode(attribute(attributes, 'placeholder') ?? attribute(attributes, 'value') ?? '')
    }

    if (text === '' && !VOID.has(tag)) {
      const from = match.index + whole.length
      text = textOf(html.slice(from, endOf(html, tag, from)))
    }

    if (text === '') text = decode(attribute(attributes, 'aria-label') ?? attribute(attributes, 'alt') ?? '')

    // An element with nothing to quote keeps its identifier as its own name,
    // which is what the surface showed before this existed. Silence would be
    // worse than the slug it replaced.
    labels[identifier] = text === '' ? identifier : shorten(text)
  }

  return labels
}
