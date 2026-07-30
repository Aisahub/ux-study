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

export interface StageDeclaration {
  /** The Stage's number, which is also its position in the programme. */
  stage: number
  /** The Competency slugs that make up this Stage, in display order. */
  competencies: string[]
}

export interface ContentConfig {
  /** How many Quiz Items each Competency's pool is authored to hold. */
  poolSize: number
  /** How many items an Attempt draws from the pool. */
  drawSize: number
  /** How many drawn items must be answered correctly to pass. */
  passThreshold: number
  /** The fewest Findings a Self-Audit Report may carry. */
  minFindings: number
  /** Every Stage's Competencies (ADR-0001), in Stage order. */
  stages: StageDeclaration[]
}

/** The Competency slugs of one Stage, in display order; empty if no such Stage is declared. */
export function competenciesOfStage(config: ContentConfig, stage: number): string[] {
  return config.stages.find((entry) => entry.stage === stage)?.competencies ?? []
}

/**
 * Which Stage a Competency belongs to, or null if config.md declares it under
 * none. Null is what every consumer refuses on: a slug nothing declares is not
 * part of the curriculum, whether it arrived in a URL or in a content file.
 */
export function stageOf(config: ContentConfig, slug: string): number | null {
  return config.stages.find((entry) => entry.competencies.includes(slug))?.stage ?? null
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
  /** What the Learner can be seen to do afterwards — an observable action, never knowledge held. */
  objective: Bilingual
  /** What to audit given the Learner's role: developers the interface they built, PMs the flow they signed off. */
  roleHint: Bilingual
  /** Two or three questions to carry into the source article — a hypothesis instead of a skim. */
  preReadingQuestions: Bilingual[]
  /** The source article this Competency scaffolds around (ADR-0002). */
  source: { url: string; attribution: string }
  /**
   * Korean-only by design, so a plain string rather than an en/ko pair: the
   * source articles are English, and browser page translation is offered as
   * an aid to the Korean cohort alone (ADR-0002, amended).
   */
  koTranslationNotice?: string
  /** Null until the written-explanation trial (#29) fills exactly one. */
  explanation: Bilingual | null
  /** The full front matter, carrying fields authored later than this loader. */
  frontmatter: Record<string, unknown>
  body: string
}

export interface QuizItemOption {
  /** What the option proposes doing — short enough to compare four at a glance. */
  text: string
  /**
   * The grounds for it. Held apart from `text` so the four actions can be
   * scanned as a set and the reasoning read only where it is needed: the
   * reasoning is what separates a keyed answer from a plausible one, so it
   * must be present, but a wall of it is what stopped Learners reading.
   */
  reason: string
  correct: boolean
}

/**
 * One state in a sequence — a still, and the words for when it is.
 *
 * The caption says *when*, never what changed. "Three seconds after tapping
 * Save" is a caption; "no spinner appears" is the answer, and an item whose
 * captions carry the answer can be scored without looking at the states, which
 * is the definition question ADR-0006 rules out. See `content/items/AUTHORING.md`.
 */
export interface QuizItemStep {
  caption: Bilingual
  /** The state drawn, styled by `items/item-screen.css` exactly as a single screen is. */
  screen: Bilingual
}

export interface QuizItem {
  slug: string
  competency: string
  /** The source-article section the item derives from — shown to a Learner who gets it wrong. */
  sourceSection: string
  /** UX Principles the item cites, each required to exist in the Glossary. */
  principles: string[]
  /**
   * The concrete thing the item asks a judgement about — a described page or a
   * pair of alternatives. An item with nothing to examine is a definition
   * question and does not belong in a pool (CONTEXT.md, Quiz Item).
   */
  artefact: Bilingual
  /**
   * The artefact drawn rather than described: an HTML fragment styled by
   * `items/item-screen.css` and rendered isolated from the platform. Optional,
   * because "a described page" is a format ADR-0006 allows. Where it is
   * present it becomes what the Learner judges, and `artefact` steps back to
   * being the equivalent for anyone who cannot see it.
   */
  screen?: Bilingual
  /**
   * The artefact drawn as a sequence of states instead of one, for a defect
   * that only exists across time — a wait, a state change, an error arriving.
   * Mutually exclusive with `screen`: an item shows one artefact, and two
   * would leave the Learner deciding which one the prompt is about.
   */
  sequence?: QuizItemStep[]
  /** The question asked about the artefact. */
  prompt: Bilingual
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
  /** The Stage this page is the audit subject for. */
  stage: number
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
  /** The one stylesheet every item screen is drawn with, so pools cannot drift visually. */
  itemScreenCss: string
  briefs: Brief[]
  /**
   * Audit subjects, keyed by Stage (#61). A Stage has one or none: a Learner
   * audits a different page at each Stage, because auditing the Stage 1 page
   * again would test recall of its manifest rather than the Competencies just
   * learned.
   *
   * Sparse on purpose while the later subjects are unauthored. Ask through
   * `practicePageOf`, which says "not authored" rather than handing back
   * undefined for a caller to misread as "nothing wrong here".
   */
  practicePages: PracticePage[]
}

/**
 * The audit subject a Stage owns, or null where nobody has authored one yet.
 *
 * Null is a real answer and every caller has to say something about it — the
 * surface that would show it says so in words rather than rendering an empty
 * frame, which is a state a reader cannot tell from a broken page.
 */
export function practicePageOf(content: Content, stage: number): PracticePage | null {
  return content.practicePages.find((page) => page.stage === stage) ?? null
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
  const itemScreenCss = loadItemScreenCss(root, items, problems)
  const briefs = loadBriefs(root, principles, problems)
  const practicePages = loadPracticePages(root, config, principles, problems)

  if (problems.length > 0) throw new ContentError(problems)
  return { config, glossary, competencies, items, itemScreenCss, briefs, practicePages }
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
  const declared = data.stages
  const stages: StageDeclaration[] = []
  if (!Array.isArray(declared) || declared.length === 0) {
    problems.push('config.md: stages must declare each Stage and the Competency slugs it holds')
    usable = false
  } else {
    for (const entry of declared) {
      const stage = isRecord(entry) ? entry.stage : undefined
      const competencies = isRecord(entry) ? entry.competencies : undefined
      if (!Number.isInteger(stage) || (stage as number) < 1) {
        problems.push('config.md: every stage must carry a positive integer stage number')
        usable = false
        continue
      }
      if (
        !Array.isArray(competencies) ||
        competencies.length === 0 ||
        competencies.some((slug) => typeof slug !== 'string')
      ) {
        problems.push(`config.md: stage ${stage} must list its Competency slugs`)
        usable = false
        continue
      }
      stages.push({ stage: stage as number, competencies: competencies as string[] })
    }
    // Stage order is the programme's order (ADR-0001: a Stage is a rung on a
    // ladder of detection difficulty), so the file has to be written in it —
    // a reader who has to sort the list before trusting it will not.
    if (stages.some((entry, index) => index > 0 && entry.stage <= stages[index - 1].stage)) {
      problems.push('config.md: stages must be declared in ascending Stage order, each Stage once')
    }
  }
  if (!usable) return null

  const config: ContentConfig = {
    poolSize: data.poolSize as number,
    drawSize: data.drawSize as number,
    passThreshold: data.passThreshold as number,
    minFindings: data.minFindings as number,
    stages,
  }
  if (config.passThreshold > config.drawSize) problems.push('config.md: passThreshold cannot exceed drawSize')
  if (config.drawSize > config.poolSize) problems.push('config.md: drawSize cannot exceed poolSize')
  // Across the whole declaration, not within one Stage: a slug in two Stages
  // would give the same Competency two positions in the programme, and every
  // lookup here answers with whichever it met first.
  const slugs = config.stages.flatMap((entry) => entry.competencies)
  if (new Set(slugs).size !== slugs.length) {
    problems.push('config.md: stages repeat a Competency slug')
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

    if (stageOf(config, slug) === null) {
      problems.push(`${rel}: "${slug}" is not a Competency declared under any Stage in config.md`)
    }
    for (const field of ['name', 'objective', 'roleHint'] as const) {
      if (!isLanguagePair(data[field])) {
        problems.push(`${rel}: ${field} must carry en and ko variants`)
      }
    }

    const questions = Array.isArray(data.preReadingQuestions) ? data.preReadingQuestions : null
    if (!questions || questions.length === 0 || questions.some((question) => !isLanguagePair(question))) {
      problems.push(`${rel}: preReadingQuestions must be a list of en/ko question pairs`)
    }

    const source = isRecord(data.source) ? data.source : {}
    if (
      typeof source.url !== 'string' ||
      source.url.trim() === '' ||
      typeof source.attribution !== 'string' ||
      source.attribution.trim() === ''
    ) {
      problems.push(`${rel}: source must carry the article url and its attribution`)
    }

    if (data.koTranslationNotice !== undefined && typeof data.koTranslationNotice !== 'string') {
      problems.push(`${rel}: koTranslationNotice is Korean-only by design and must be a plain string`)
    }

    // Present-and-empty is the MVP state (ADR-0002); the trial (#29) turns
    // exactly one into a filled en/ko pair. Anything else is a mistake.
    let explanation: Bilingual | null = null
    if (isLanguagePair(data.explanation)) explanation = asBilingual(data.explanation)
    else if (data.explanation !== undefined && data.explanation !== null && data.explanation !== '') {
      problems.push(`${rel}: explanation must be empty or an en/ko pair`)
    }

    competencies.push({
      slug,
      name: asBilingual(data.name),
      objective: asBilingual(data.objective),
      roleHint: asBilingual(data.roleHint),
      preReadingQuestions: (questions ?? []).filter(isLanguagePair).map(asBilingual),
      source: { url: stringOrEmpty(source.url), attribution: stringOrEmpty(source.attribution) },
      koTranslationNotice: typeof data.koTranslationNotice === 'string' ? data.koTranslationNotice : undefined,
      explanation,
      frontmatter: data,
      body,
    })
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
    if (stageOf(config, competency) === null) {
      problems.push(`items/${competency}: item pool for a Competency declared under no Stage in config.md`)
    }

    const pool: QuizItem[] = []
    for (const file of markdownFiles(join(dir, competency))) {
      const rel = `items/${competency}/${file}`
      const { data } = readFrontmatter(join(dir, competency, file), rel, problems)
      checkLanguagePairs(data, rel, problems)

      if (typeof data.sourceSection !== 'string' || data.sourceSection.trim() === '') {
        problems.push(`${rel}: missing sourceSection, the source-article pointer shown on a wrong answer`)
      }
      // An item is a judgement about something. Without an artefact there is
      // nothing to judge, and the options can only be answered from memory of
      // the article — which is the definition question ADR-0006 rules out.
      if (!isLanguagePair(data.artefact)) {
        problems.push(`${rel}: missing artefact — an item with nothing to examine is a definition question`)
      }
      if (!isLanguagePair(data.prompt)) {
        problems.push(`${rel}: prompt must carry en and ko variants`)
      }

      // Each step's caption and screen are checked for both languages by
      // `checkLanguagePairs` above, which walks the whole front matter — a
      // half-authored pair is reported as `sequence[1].screen is missing its
      // ko language variant` before anything here runs. What is left is the
      // shape around them.
      const sequence = readSequence(data.sequence, rel, problems)
      if (sequence && data.screen !== undefined) {
        problems.push(`${rel}: an item draws either one screen or a sequence, never both`)
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
          // Required on every option, never on some. An option that alone
          // carries its grounds — or alone lacks them — is answerable from its
          // shape, which is the format cue the pool exists to avoid.
          if (typeof record.reason !== 'string' || record.reason.trim() === '') {
            problems.push(`${rel}: an option in options.${lang} has no reason`)
          }
          return {
            text: stringOrEmpty(record.text),
            reason: stringOrEmpty(record.reason),
            correct: record.correct === true,
          }
        })
        const correct = options[lang].filter((option) => option.correct).length
        if (correct !== 1) {
          problems.push(`${rel}: options.${lang} keys ${correct} correct answers where exactly one is required`)
        }
      }

      // The keyed option must sit at the same index in both languages. Display
      // order is shuffled from a seed that ignores language, and scoring reads
      // the key from whichever pool is to hand, so a pair that disagrees would
      // mark a Learner wrong for the language they chose.
      const keyed = LANGS.map((lang) => options[lang].findIndex((option) => option.correct))
      if (keyed[0] !== -1 && keyed[1] !== -1 && keyed[0] !== keyed[1]) {
        problems.push(
          `${rel}: the correct option is #${keyed[0] + 1} in en but #${keyed[1] + 1} in ko — they must be the same`,
        )
      }

      // A drawn screen is optional, but a half-authored one is a mistake: the
      // two language variants must exist together or the item renders blank
      // for one cohort. The pair walker above already caught an empty variant;
      // this catches a `screen` that is not a language pair at all.
      if (data.screen !== undefined && !isLanguagePair(data.screen)) {
        problems.push(`${rel}: screen must carry en and ko variants`)
      }

      pool.push({
        slug: file.replace(/\.md$/, ''),
        competency,
        sourceSection: stringOrEmpty(data.sourceSection),
        principles: citedPrinciples(data.principles, rel, principles, problems),
        artefact: asBilingual(data.artefact),
        screen: isLanguagePair(data.screen) ? asBilingual(data.screen) : undefined,
        sequence,
        prompt: asBilingual(data.prompt),
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

/**
 * A sequence out of front matter, or null when the item does not draw one.
 *
 * Two states is the floor. One state is a screen and already has a spelling;
 * accepting it here would give the same artefact two ways to be authored, and
 * the next author would have to guess which the pool used.
 */
function readSequence(value: unknown, rel: string, problems: string[]): QuizItemStep[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value) || value.length < 2) {
    problems.push(`${rel}: sequence must list at least two states — one state is a screen`)
    return undefined
  }

  const steps: QuizItemStep[] = []
  value.forEach((entry, index) => {
    const step = isRecord(entry) ? entry : {}
    if (!isLanguagePair(step.caption)) {
      problems.push(`${rel}: sequence[${index}].caption must carry en and ko variants — it says when this state is`)
    }
    if (!isLanguagePair(step.screen)) {
      problems.push(`${rel}: sequence[${index}].screen must carry en and ko variants`)
    }
    steps.push({ caption: asBilingual(step.caption), screen: asBilingual(step.screen) })
  })
  return steps
}

/**
 * The stylesheet item screens are drawn with. Required only once something
 * draws one — until then it would be a file the project asks for and nothing
 * reads. Missing it while items reference it is worth failing the build over:
 * the screens would still render, unstyled, and a Learner would be judging a
 * layout nobody authored.
 */
function loadItemScreenCss(root: string, items: Record<string, QuizItem[]>, problems: string[]): string {
  const drawn = Object.values(items).some((pool) => pool.some((item) => item.screen || item.sequence))
  const path = join(root, 'items', 'item-screen.css')
  if (existsSync(path)) return readFileSync(path, 'utf8')
  if (drawn) problems.push('items/item-screen.css is missing — items draw screens that nothing styles')
  return ''
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

/**
 * The audit subjects, one per Stage that has one (#61).
 *
 * A Stage owes a subject once `practice-page/stage-N/` exists — authoring one
 * is what declares it, and from that moment the directory owes all three
 * parts. A Stage with no directory owes nothing yet and is not a failure here;
 * that a Stage the curriculum declares has no subject is said out loud on the
 * Maintainer's content page and on the Learner's audit surface, not left to be
 * inferred from a screen with nothing on it.
 *
 * A directory naming no declared Stage is a failure, because it is content
 * nobody can ever reach.
 */
function loadPracticePages(
  root: string,
  config: ContentConfig,
  principles: Set<string>,
  problems: string[],
): PracticePage[] {
  const root_ = join(root, 'practice-page')
  if (!existsSync(root_)) return []

  const declared = new Set(config.stages.map((entry) => entry.stage))
  const pages: PracticePage[] = []

  for (const name of readdirSync(root_).sort()) {
    const match = /^stage-(\d+)$/.exec(name)
    if (!match) {
      problems.push(
        `practice-page/${name}: an audit subject lives in a directory named stage-N, naming the Stage it belongs to`,
      )
      continue
    }
    const stage = Number(match[1])
    if (!declared.has(stage)) {
      problems.push(`practice-page/${name}: Stage ${stage} is not declared in config.md, so no Learner can reach this`)
      continue
    }
    pages.push(loadPracticePage(root_, name, stage, config, principles, problems))
  }

  return pages
}

function loadPracticePage(
  parent: string,
  name: string,
  stage: number,
  config: ContentConfig,
  principles: Set<string>,
  problems: string[],
): PracticePage {
  const dir = join(parent, name)

  const html: Bilingual = { en: '', ko: '' }
  for (const lang of LANGS) {
    const path = join(dir, `${lang}.html`)
    if (existsSync(path)) html[lang] = readFileSync(path, 'utf8')
    else problems.push(`practice-page/${name}/${lang}.html is missing`)
  }

  const cssPath = join(dir, 'practice-page.css')
  let css = ''
  if (existsSync(cssPath)) css = readFileSync(cssPath, 'utf8')
  else {
    problems.push(`practice-page/${name}/practice-page.css is missing — most Planted Defects live in the styling`)
  }

  const identifiers = {
    en: [...html.en.matchAll(ELEMENT_ATTRIBUTE)].map((match) => match[1]),
    ko: [...html.ko.matchAll(ELEMENT_ATTRIBUTE)].map((match) => match[1]),
  }
  for (const lang of LANGS) {
    const seen = new Set<string>()
    for (const id of identifiers[lang]) {
      // A repeated identifier would make a Finding ambiguous about which
      // element it names.
      if (seen.has(id)) {
        problems.push(`practice-page/${name}/${lang}.html: element identifier "${id}" appears more than once`)
      }
      seen.add(id)
    }
  }

  const elements = new Set(identifiers.en)
  const koElements = new Set(identifiers.ko)
  const enOnly = [...elements].filter((id) => !koElements.has(id))
  const koOnly = [...koElements].filter((id) => !elements.has(id))
  if (enOnly.length > 0 || koOnly.length > 0) {
    problems.push(
      `practice-page/${name}: the two language variants do not expose an identical set of element identifiers` +
        (enOnly.length > 0 ? ` — only in en: ${enOnly.join(', ')}` : '') +
        (koOnly.length > 0 ? ` — only in ko: ${koOnly.join(', ')}` : ''),
    )
  }

  const defects: PlantedDefect[] = []
  const manifestPath = join(dir, 'manifest.md')
  if (!existsSync(manifestPath)) {
    problems.push(
      `practice-page/${name}/manifest.md is missing — the Planted Defects are this Stage's reference answer`,
    )
  } else {
    const rel = `practice-page/${name}/manifest.md`
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
      // This Stage's Competencies, not merely declared ones: a Learner reaching
      // this subject has been taught the Stage it belongs to, so a defect on it
      // citing a later Stage's Competency is one they have not been taught to
      // see. Earlier Stages are allowed — those Competencies are behind them,
      // and a Stage 2 page whose layout is also badly ordered is the honest
      // shape of real work.
      const teachable = config.stages
        .filter((entry) => entry.stage <= stage)
        .flatMap((entry) => entry.competencies)
      if (defect.competency !== '' && !teachable.includes(defect.competency)) {
        problems.push(
          `${rel}: ${label} cites Competency "${defect.competency}", which no Learner reaching Stage ${stage} has been taught`,
        )
      }
      if (defect.principle !== '' && !principles.has(defect.principle)) {
        problems.push(`${rel}: ${label} cites UX Principle "${defect.principle}", absent from the Glossary`)
      }
      defects.push(defect)
    }
  }

  return { stage, html, css, elements: [...elements], defects }
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
