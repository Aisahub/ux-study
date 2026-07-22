/**
 * The two languages the platform publishes, and the rules for choosing between
 * them. See ADR-0008: the language is a path segment, not a property of the
 * viewer, so that a link means the same page for whoever receives it.
 */

export const LANGUAGES = ['en', 'ko'] as const

export type Language = (typeof LANGUAGES)[number]

/**
 * Where a reader's choice is kept. Nothing sensitive lives here, and a Learner
 * who has not signed in still gets to keep their language, so this is written
 * from the path rather than from a session.
 */
export const LANGUAGE_COOKIE = 'lang'

/** A year. Long enough that a preference set once is not re-set every morning. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** English is the fallback: the Indonesia cohort works in it (ADR-0002). */
export const DEFAULT_LANGUAGE: Language = 'en'

export function isLanguage(value: string | undefined | null): value is Language {
  return LANGUAGES.includes(value as Language)
}

/**
 * The best of the languages we publish, read from an `Accept-Language` header.
 *
 * Browsers list every language a reader accepts, in preference order and with
 * explicit quality values — and the first entry is often one we do not publish,
 * so taking it and giving up would send a Korean reader to the English page
 * whenever their browser also mentions, say, Indonesian first.
 */
export function guessLanguage(header: string | null | undefined): Language {
  if (!header) return DEFAULT_LANGUAGE

  const preferences = header
    .split(',')
    .map((entry) => {
      const [tag, ...parameters] = entry.split(';').map((part) => part.trim())
      const quality = parameters
        .map((parameter) => /^q=(.*)$/.exec(parameter)?.[1])
        .find((value) => value !== undefined)
      const weight = quality === undefined ? 1 : Number.parseFloat(quality)
      // A malformed q is a header we cannot trust to rank; treat it as least
      // preferred rather than letting NaN decide the sort.
      return { language: tag.split('-')[0].toLowerCase(), weight: Number.isNaN(weight) ? 0 : weight }
    })
    .filter((preference) => preference.weight > 0)
    .sort((a, b) => b.weight - a.weight)

  return preferences.map((preference) => preference.language).find(isLanguage) ?? DEFAULT_LANGUAGE
}

/**
 * The same page in the other language.
 *
 * The switcher's whole job. Replacing only the language segment keeps the
 * reader where they were; the failure this exists to prevent is redirecting to
 * a section root, which loses their place on exactly the deep pages people
 * paste to each other.
 */
export function counterpartPath(pathname: string, target: Language): string {
  const segments = pathname.split('/').filter(Boolean)
  if (isLanguage(segments[0])) segments[0] = target
  else segments.unshift(target)
  return `/${segments.join('/')}`
}
