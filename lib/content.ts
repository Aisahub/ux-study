import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { parse } from 'yaml'

/**
 * Loads `content/` — Markdown with YAML front matter under version control —
 * into the typed structures the application reads, validating everything in
 * one pass. `next.config.ts` runs this loader whenever the application is
 * built or started, so a content mistake fails the build instead of reaching
 * a Learner. Problems are collected before throwing, so one broken commit
 * reports every mistake at once.
 */

const LANGS = ['en', 'ko'] as const

export type Bilingual = { en: string; ko: string }

export interface ContentConfig {
  /** How many Quiz Items each Competency's pool is authored to hold. */
  poolSize: number
  /** How many items an Attempt draws from the pool. */
  drawSize: number
  /** How many drawn items must be answered correctly to pass. */
  passThreshold: number
  /** The fewest Findings a Self-Audit Report may carry. */
  minFindings: number
  /** The Competency slugs that make up Stage 1, in display order. */
  stage1Competencies: string[]
}

export interface GlossaryEntry {
  slug: string
  name: Bilingual
  definition: Bilingual
  justification: Bilingual
  competencies: string[]
  source: string
}

export interface Competency {
  slug: string
  name: Bilingual
  /** The full front matter, carrying fields authored later (#14) than this loader. */
  frontmatter: Record<string, unknown>
  body: string
}

export interface QuizItemOption {
  text: string
  correct: boolean
}

export interface QuizItem {
  slug: string
  competency: string
  /** The source-article section the item derives from — shown to a Learner who gets it wrong. */
  sourceSection: string
  /** UX Principles the item cites, each required to exist in the Glossary. */
  principles: string[]
  options: { en: QuizItemOption[]; ko: QuizItemOption[] }
  frontmatter: Record<string, unknown>
}

export interface Brief {
  slug: string
  /** UX Principles the brief cites, each required to exist in the Glossary. */
  principles: string[]
  frontmatter: Record<string, unknown>
  body: string
}

export interface PlantedDefect {
  slug: string
  element: string
  competency: string
  principle: string
  explanation: Bilingual
}

export interface PracticePage {
  html: Bilingual
  css: string
  /** The `data-element` identifiers, identical across both language variants. */
  elements: string[]
  defects: PlantedDefect[]
}

export interface Content {
  config: ContentConfig
  glossary: GlossaryEntry[]
  competencies: Competency[]
  /** Item pools keyed by Competency slug. */
  items: Record<string, QuizItem[]>
  briefs: Brief[]
  practicePage: PracticePage
}

export class ContentError extends Error {
  constructor(readonly problems: string[]) {
    super(['Content validation failed:', ...problems.map((problem) => `  - ${problem}`)].join('\n'))
    this.name = 'ContentError'
  }
}

export function loadContent(root: string = join(process.cwd(), 'content')): Content {
  const problems: string[] = []

  const config = loadConfig(root, problems)
  // Without the quantities and the Stage 1 list, nothing else can be judged.
  if (!config) throw new ContentError(problems)

  const glossary = loadGlossary(root, problems)
  const principles = new Set(glossary.map((entry) => entry.slug))
  const competencies = loadCompetencies(root, config, problems)
  const items = loadItems(root, config, principles, problems)
  const briefs = loadBriefs(root, principles, problems)
  const practicePage = loadPracticePage(root, config, principles, problems)

  if (problems.length > 0) throw new ContentError(problems)
  return { config, glossary, competencies, items, briefs, practicePage }
}

function loadConfig(root: string, problems: string[]): ContentConfig | null {
  const path = join(root, 'config.md')
  if (!existsSync(path)) {
    problems.push('config.md is missing — the fixed quantities live in content, not code')
    return null
  }
  const { data } = readFrontmatter(path, 'config.md', problems)

  let usable = true
  for (const field of ['poolSize', 'drawSize', 'passThreshold', 'minFindings'] as const) {
    if (!Number.isInteger(data[field]) || (data[field] as number) < 1) {
      problems.push(`config.md: ${field} must be a positive integer`)
      usable = false
    }
  }
  const list = data.stage1Competencies
  if (!Array.isArray(list) || list.length === 0 || list.some((slug) => typeof slug !== 'string')) {
    problems.push('config.md: stage1Competencies must list the Stage 1 Competency slugs')
    usable = false
  }
  if (!usable) return null

  const config: ContentConfig = {
    poolSize: data.poolSize as number,
    drawSize: data.drawSize as number,
    passThreshold: data.passThreshold as number,
    minFindings: data.minFindings as number,
    stage1Competencies: list as string[],
  }
  if (config.passThreshold > config.drawSize) problems.push('config.md: passThreshold cannot exceed drawSize')
  if (config.drawSize > config.poolSize) problems.push('config.md: drawSize cannot exceed poolSize')
  if (new Set(config.stage1Competencies).size !== config.stage1Competencies.length) {
    problems.push('config.md: stage1Competencies repeats a slug')
  }
  return config
}

function loadGlossary(root: string, problems: string[]): GlossaryEntry[] {
  const entries: GlossaryEntry[] = []
  for (const file of markdownFiles(join(root, 'glossary'))) {
    const rel = `glossary/${file}`
    const slug = file.replace(/\.md$/, '')
    const { data } = readFrontmatter(join(root, 'glossary', file), rel, problems)
    checkLanguagePairs(data, rel, problems)

    if (data.slug !== slug) {
      problems.push(`${rel}: slug "${String(data.slug)}" does not match the filename`)
    }
    for (const field of ['name', 'definition', 'justification'] as const) {
      if (!isLanguagePair(data[field])) problems.push(`${rel}: ${field} must carry en and ko variants`)
    }
    // The Competency references are not checked against config.md: a Glossary
    // entry may cite a later-Stage Competency (cognitive-load already cites
    // form-burden, which is Stage 2).
    if (!Array.isArray(data.competencies) || data.competencies.length === 0 || data.competencies.some((c) => typeof c !== 'string')) {
      problems.push(`${rel}: competencies must list at least one Competency slug`)
    }
    if (typeof data.source !== 'string' || data.source.trim() === '') {
      problems.push(`${rel}: source must point at the article the Principle comes from`)
    }

    entries.push({
      slug,
      name: asBilingual(data.name),
      definition: asBilingual(data.definition),
      justification: asBilingual(data.justification),
      competencies: Array.isArray(data.competencies) ? data.competencies.filter((c): c is string => typeof c === 'string') : [],
      source: stringOrEmpty(data.source),
    })
  }
  return entries
}

function loadCompetencies(root: string, config: ContentConfig, problems: string[]): Competency[] {
  const competencies: Competency[] = []
  for (const file of markdownFiles(join(root, 'competencies'))) {
    const rel = `competencies/${file}`
    const slug = file.replace(/\.md$/, '')
    const { data, body } = readFrontmatter(join(root, 'competencies', file), rel, problems)
    checkLanguagePairs(data, rel, problems)

    if (!config.stage1Competencies.includes(slug)) {
      problems.push(`${rel}: "${slug}" is not a Competency declared in config.md`)
    }
    if (!isLanguagePair(data.name)) {
      problems.push(`${rel}: name must carry en and ko variants`)
    }

    competencies.push({ slug, name: asBilingual(data.name), frontmatter: data, body })
  }
  return competencies
}

function loadItems(
  root: string,
  config: ContentConfig,
  principles: Set<string>,
  problems: string[],
): Record<string, QuizItem[]> {
  const pools: Record<string, QuizItem[]> = {}
  const dir = join(root, 'items')
  if (!existsSync(dir)) return pools

  const poolDirs = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  for (const competency of poolDirs) {
    if (!config.stage1Competencies.includes(competency)) {
      problems.push(`items/${competency}: item pool for a Competency not declared in config.md`)
    }

    const pool: QuizItem[] = []
    for (const file of markdownFiles(join(dir, competency))) {
      const rel = `items/${competency}/${file}`
      const { data } = readFrontmatter(join(dir, competency, file), rel, problems)
      checkLanguagePairs(data, rel, problems)

      if (typeof data.sourceSection !== 'string' || data.sourceSection.trim() === '') {
        problems.push(`${rel}: missing sourceSection, the source-article pointer shown on a wrong answer`)
      }

      const options: QuizItem['options'] = { en: [], ko: [] }
      const rawOptions = isRecord(data.options) ? data.options : {}
      for (const lang of LANGS) {
        const list = rawOptions[lang]
        if (!Array.isArray(list) || list.length === 0) {
          problems.push(`${rel}: options.${lang} must be a non-empty list`)
          continue
        }
        options[lang] = list.map((option): QuizItemOption => {
          const record = isRecord(option) ? option : {}
          if (typeof record.text !== 'string' || record.text.trim() === '') {
            problems.push(`${rel}: an option in options.${lang} has no text`)
          }
          return { text: stringOrEmpty(record.text), correct: record.correct === true }
        })
        const correct = options[lang].filter((option) => option.correct).length
        if (correct !== 1) {
          problems.push(`${rel}: options.${lang} keys ${correct} correct answers where exactly one is required`)
        }
      }

      pool.push({
        slug: file.replace(/\.md$/, ''),
        competency,
        sourceSection: stringOrEmpty(data.sourceSection),
        principles: citedPrinciples(data.principles, rel, principles, problems),
        options,
        frontmatter: data,
      })
    }

    // A pool that has not been authored yet (no directory) is not a mistake —
    // the four Stage 1 pools arrive in tickets of their own. Once a pool
    // directory exists, an Attempt must be able to draw a full set from it,
    // so an empty one fails like any other undersized pool.
    if (pool.length < config.drawSize) {
      problems.push(`items/${competency}: a pool of ${pool.length} is smaller than the ${config.drawSize} items an attempt draws`)
    }
    pools[competency] = pool
  }
  return pools
}

function loadBriefs(root: string, principles: Set<string>, problems: string[]): Brief[] {
  const briefs: Brief[] = []
  for (const file of markdownFiles(join(root, 'briefs'))) {
    const rel = `briefs/${file}`
    const { data, body } = readFrontmatter(join(root, 'briefs', file), rel, problems)
    checkLanguagePairs(data, rel, problems)
    briefs.push({
      slug: file.replace(/\.md$/, ''),
      principles: citedPrinciples(data.principles, rel, principles, problems),
      frontmatter: data,
      body,
    })
  }
  return briefs
}

const ELEMENT_ATTRIBUTE = /data-element="([^"]+)"/g

function loadPracticePage(
  root: string,
  config: ContentConfig,
  principles: Set<string>,
  problems: string[],
): PracticePage {
  const dir = join(root, 'practice-page')

  const html: Bilingual = { en: '', ko: '' }
  for (const lang of LANGS) {
    const path = join(dir, `${lang}.html`)
    if (existsSync(path)) html[lang] = readFileSync(path, 'utf8')
    else problems.push(`practice-page/${lang}.html is missing`)
  }

  const cssPath = join(dir, 'practice-page.css')
  let css = ''
  if (existsSync(cssPath)) css = readFileSync(cssPath, 'utf8')
  else problems.push('practice-page/practice-page.css is missing — most Planted Defects live in the styling')

  const identifiers = {
    en: [...html.en.matchAll(ELEMENT_ATTRIBUTE)].map((match) => match[1]),
    ko: [...html.ko.matchAll(ELEMENT_ATTRIBUTE)].map((match) => match[1]),
  }
  for (const lang of LANGS) {
    const seen = new Set<string>()
    for (const id of identifiers[lang]) {
      // A repeated identifier would make a Finding ambiguous about which
      // element it names.
      if (seen.has(id)) problems.push(`practice-page/${lang}.html: element identifier "${id}" appears more than once`)
      seen.add(id)
    }
  }

  const elements = new Set(identifiers.en)
  const koElements = new Set(identifiers.ko)
  const enOnly = [...elements].filter((id) => !koElements.has(id))
  const koOnly = [...koElements].filter((id) => !elements.has(id))
  if (enOnly.length > 0 || koOnly.length > 0) {
    problems.push(
      'practice-page: the two language variants do not expose an identical set of element identifiers' +
        (enOnly.length > 0 ? ` — only in en: ${enOnly.join(', ')}` : '') +
        (koOnly.length > 0 ? ` — only in ko: ${koOnly.join(', ')}` : ''),
    )
  }

  const defects: PlantedDefect[] = []
  const manifestPath = join(dir, 'manifest.md')
  if (!existsSync(manifestPath)) {
    problems.push('practice-page/manifest.md is missing — the Planted Defects are the Stage 1 reference answer')
  } else {
    const rel = 'practice-page/manifest.md'
    const { data } = readFrontmatter(manifestPath, rel, problems)
    checkLanguagePairs(data, rel, problems)

    let list: unknown[] = []
    if (Array.isArray(data.defects)) list = data.defects
    else problems.push(`${rel}: defects must be a list`)

    for (const raw of list) {
      const record = isRecord(raw) ? raw : {}
      const slug = stringOrEmpty(record.slug)
      const label = slug === '' ? 'a defect' : `defect "${slug}"`

      for (const field of ['slug', 'element', 'competency', 'principle'] as const) {
        if (typeof record[field] !== 'string' || record[field].trim() === '') {
          problems.push(`${rel}: ${label} is missing its ${field}`)
        }
      }
      if (!isLanguagePair(record.explanation)) {
        problems.push(`${rel}: ${label} must carry an en/ko explanation`)
      }

      const defect: PlantedDefect = {
        slug,
        element: stringOrEmpty(record.element),
        competency: stringOrEmpty(record.competency),
        principle: stringOrEmpty(record.principle),
        explanation: asBilingual(record.explanation),
      }
      // Empty fields were already reported above; skip the follow-on checks
      // rather than reporting the same omission twice.
      if (defect.element !== '' && !elements.has(defect.element)) {
        problems.push(`${rel}: ${label} names element "${defect.element}", which does not exist on the Practice Page`)
      }
      if (defect.competency !== '' && !config.stage1Competencies.includes(defect.competency)) {
        problems.push(`${rel}: ${label} cites Competency "${defect.competency}", outside the Stage 1 Competencies`)
      }
      if (defect.principle !== '' && !principles.has(defect.principle)) {
        problems.push(`${rel}: ${label} cites UX Principle "${defect.principle}", absent from the Glossary`)
      }
      defects.push(defect)
    }
  }

  return { html, css, elements: [...elements], defects }
}

/**
 * Bilingual content is authored as sibling `en`/`ko` fields. Anywhere one
 * language appears without the other — a name, a prompt, an option list, a
 * defect explanation — is a missing language variant and fails the build.
 * Deliberately single-language content (such as the Korean-only
 * browser-translation notice) must therefore use a plain field name, not an
 * en/ko pair.
 */
function checkLanguagePairs(node: unknown, rel: string, problems: string[], path = ''): void {
  if (Array.isArray(node)) {
    node.forEach((child, index) => checkLanguagePairs(child, rel, problems, `${path}[${index}]`))
    return
  }
  if (!isRecord(node)) return
  if (isLanguagePair(node)) {
    for (const lang of LANGS) {
      const value = node[lang]
      const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
      if (empty) problems.push(`${rel}: ${path || 'content'} is missing its ${lang} language variant`)
    }
  }
  for (const [key, value] of Object.entries(node)) {
    checkLanguagePairs(value, rel, problems, path === '' ? key : `${path}.${key}`)
  }
}

function citedPrinciples(value: unknown, rel: string, principles: Set<string>, problems: string[]): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.some((slug) => typeof slug !== 'string')) {
    problems.push(`${rel}: principles must be a list of Glossary slugs`)
    return []
  }
  for (const slug of value as string[]) {
    // Glossary entries are themselves validated to carry both language
    // variants, so existence here means the Principle is citable in either.
    if (!principles.has(slug)) problems.push(`${rel}: cites UX Principle "${slug}", absent from the Glossary`)
  }
  return value as string[]
}

function readFrontmatter(path: string, rel: string, problems: string[]): { data: Record<string, unknown>; body: string } {
  const text = readFileSync(path, 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) {
    problems.push(`${rel}: missing front matter`)
    return { data: {}, body: text }
  }
  try {
    const data: unknown = parse(match[1])
    return { data: isRecord(data) ? data : {}, body: text.slice(match[0].length) }
  } catch (error) {
    problems.push(`${rel}: front matter is not valid YAML — ${(error as Error).message}`)
    return { data: {}, body: '' }
  }
}

function markdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .sort()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLanguagePair(value: unknown): boolean {
  if (!isRecord(value)) return false
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((key) => key === 'en' || key === 'ko')
}

function asBilingual(value: unknown): Bilingual {
  const record = isRecord(value) ? value : {}
  return { en: stringOrEmpty(record.en), ko: stringOrEmpty(record.ko) }
}

function stringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : ''
}
