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
  /**
   * What to audit given the Learner's role, one hint each: developers the
   * interface they built, PMs the flow they signed off. Held apart rather than
   * written as one paragraph naming both roles, because a Learner reads only
   * the half addressed to them and the second half was hiding behind the first.
   */
  roleHint: { developer: Bilingual; pm: Bilingual }
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
  /**
   * The Stage whose audit surface reads this brief (#71). A Stage's subject is
   * its own — Stage 1 reads a page, Stage 2 walks a flow — so the instructions
   * cannot be shared, and the surface picks by Stage rather than by a filename.
   */
  stage: number
  /** UX Principles the brief cites, each required to exist in the Glossary. */
  principles: string[]
  frontmatter: Record<string, unknown>
  body: string
}

export interface PlantedDefect {
  slug: string
  element: string
  /**
   * The step of a walkable subject this defect occurs in (ADR-0010), or
   * undefined on a subject that is one page. A Stage 2 defect is often a
   * moment rather than a thing, and the step is where that moment happened.
   */
  step?: number
  competency: string
  principle: string
  explanation: Bilingual
}

export interface PracticePage {
  /** The Stage this page is the audit subject for. */
  stage: number
  html: Bilingual
  css: string
  /** The behaviour both variants share, or empty where the subject is inert. */
  js: string
  /** The `data-element` identifiers, identical across both language variants. */
  elements: string[]
  /** The steps a walkable subject declares, ascending; empty where it is one page. */
  steps: number[]
  defects: PlantedDefect[]
}

/**
 * What the specimen's author was doing in one Finding (ADR-0011).
 *
 * The specimen is a report of deliberately mixed quality, and these are the
 * four shapes the mix is made of. The label is authoring-side and never
 * reaches a Learner: it exists so the build can prove all four are present,
 * and so the next author can tell a wrong Principle we chose from one we
 * mistyped. Which Finding is which is settled for the reader by the Stage 1
 * manifest they have already been shown, not by us telling them.
 */
export const SPECIMEN_QUALITIES = ['sound', 'wrong-principle', 'taste', 'not-a-defect'] as const

export type SpecimenQuality = (typeof SPECIMEN_QUALITIES)[number]

/** One Finding of the specimen, in the four parts every Finding has. */
export interface SpecimenFinding {
  element: string
  principle: string
  /** Authoring-side only — stripped by `specimenAsServed`. */
  quality: SpecimenQuality
  defect: Bilingual
  fix: Bilingual
}

export interface Specimen {
  /**
   * The Stage whose Practice Page this report reviews — Stage 1 (ADR-0011).
   * Not the Stage it is read at, which is a different number: this is Stage 3
   * material about a Stage 1 page.
   */
  subject: number
  /**
   * The Competency whose page links to this report (#120).
   *
   * Declared in content rather than named in a surface's JSX, because which
   * Competency owns this artefact is the curriculum's to say — the same reason
   * config.md holds the Stage lists. A slug typed into a page would go on
   * compiling after the curriculum moved, and the link would simply stop
   * appearing with nothing to notice it.
   */
  competency: string
  findings: SpecimenFinding[]
}

/** The specimen as a Learner meets it: the same report, with no answer on it. */
export interface ServedSpecimen {
  subject: number
  findings: Omit<SpecimenFinding, 'quality'>[]
}

export interface Content {
  config: ContentConfig
  glossary: GlossaryEntry[]
  competencies: Competency[]
  /**
   * Item pools keyed by Competency slug.
   *
   * Sparse on purpose, exactly as `practicePages` is: config.md may declare a
   * Competency before anyone writes its pool, and `loadItems` treats a missing
   * pool directory as unwritten rather than broken. Ask through `itemPoolOf`,
   * which says "not authored" rather than handing back undefined.
   */
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
  /**
   * The specimen Self-Audit Report (ADR-0011), or null where nobody has
   * written one. Null the same way an unauthored subject is null, and read
   * through `specimenAsServed` by anything a Learner sees.
   */
  specimen: Specimen | null
}

/**
 * The specimen with its authoring labels removed, or null where none exists.
 *
 * The Practice Page is served the same way — comments stripped, because a note
 * to whoever maintains the file is a hint to whoever is being asked to find
 * something. Here the note is the quality label, and dropping it in the
 * projection rather than in each surface is what stops the next surface from
 * having to remember.
 */
export function specimenAsServed(content: Content): ServedSpecimen | null {
  const specimen = content.specimen
  if (!specimen) return null
  return {
    subject: specimen.subject,
    findings: specimen.findings.map(({ element, principle, defect, fix }) => ({ element, principle, defect, fix })),
  }
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

/**
 * A Competency's item pool, or null where nobody has authored one yet.
 *
 * The same answer `practicePageOf` gives, for the same reason. `loadItems`
 * tolerates a Competency with no pool directory — config.md says declaring a
 * Stage is not authoring it — so every reader of a pool meets that state
 * sooner or later, and reading `content.items[slug]` straight hands back
 * `undefined` for it. The Gate Quiz's draw called `.map` on that undefined and
 * crashed the Competency's own doorstep, on a route flat enough (ADR-0008)
 * that a Learner needed only a session to reach it (ERR-220).
 *
 * A pool that is present is always full: once the directory exists, a pool
 * smaller than one draw fails the build. So null is the only "cannot draw"
 * this has to say, and it is said in words on the doorstep.
 */
export function itemPoolOf(content: Content, slug: string): QuizItem[] | null {
  return content.items[slug] ?? null
}

/**
 * The brief a Stage's audit surface reads, or null where none is authored.
 *
 * Null the same way `practicePageOf` is null, and for the same reason: a Stage
 * with a subject but no instructions is a state the surface has to say out
 * loud, not one it should paper over by falling back to another Stage's brief.
 * Telling a Learner walking a three-step flow to examine "the page" is worse
 * than telling them the brief is missing.
 */
export function briefOf(content: Content, stage: number): Brief | null {
  return content.briefs.find((brief) => brief.stage === stage) ?? null
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
  const briefs = loadBriefs(root, config, principles, problems)
  const practicePages = loadPracticePages(root, config, principles, problems)
  const specimen = loadSpecimen(root, config, principles, practicePages, problems)

  if (problems.length > 0) throw new ContentError(problems)
  return { config, glossary, competencies, items, itemScreenCss, briefs, practicePages, specimen }
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
    const justification = data.justification
    if (isRecord(justification) && typeof justification.ko === 'string') {
      checkKoreanSlotParticles(justification.ko, rel, problems)
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
    for (const field of ['name', 'objective'] as const) {
      if (!isLanguagePair(data[field])) {
        problems.push(`${rel}: ${field} must carry en and ko variants`)
      }
    }

    // Both roles are required, not one-or-the-other: a Competency that hints
    // only at what a developer should audit leaves half the cohort without an
    // address for it, and the page has a heading standing ready for each.
    const roleHint = isRecord(data.roleHint) ? data.roleHint : {}
    for (const role of ['developer', 'pm'] as const) {
      if (!isLanguagePair(roleHint[role])) {
        problems.push(`${rel}: roleHint.${role} must carry en and ko variants`)
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
      roleHint: { developer: asBilingual(roleHint.developer), pm: asBilingual(roleHint.pm) },
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

function loadBriefs(root: string, config: ContentConfig, principles: Set<string>, problems: string[]): Brief[] {
  const briefs: Brief[] = []
  const declared = new Set(config.stages.map((entry) => entry.stage))
  const claimed = new Map<number, string>()

  for (const file of markdownFiles(join(root, 'briefs'))) {
    const rel = `briefs/${file}`
    const { data, body } = readFrontmatter(join(root, 'briefs', file), rel, problems)
    checkLanguagePairs(data, rel, problems)

    const stage = data.stage
    if (!Number.isInteger(stage) || !declared.has(stage as number)) {
      problems.push(`${rel}: stage must name a Stage declared in config.md — this brief reaches no audit surface`)
    } else {
      // Two briefs claiming one Stage is not a preference between them: the
      // surface reads whichever the directory listing hands over first, so the
      // Learner's instructions would depend on a filename nobody was choosing.
      const already = claimed.get(stage as number)
      if (already) problems.push(`${rel}: Stage ${stage} already has a brief in ${already}`)
      else claimed.set(stage as number, rel)
    }

    briefs.push({
      slug: file.replace(/\.md$/, ''),
      stage: Number.isInteger(stage) ? (stage as number) : 0,
      principles: citedPrinciples(data.principles, rel, principles, problems),
      frontmatter: data,
      body,
    })
  }
  return briefs
}

const ELEMENT_ATTRIBUTE = /data-element="([^"]+)"/g
const STEP_ATTRIBUTE = /data-step="(\d+)"/g

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

  // A subject that declares steps is walked rather than read (ADR-0010), and
  // the walking is behaviour. Like the stylesheet it is one file loaded by both
  // variants, because a flow that behaved differently in Korean would not be
  // the same flow.
  const steps = {
    en: [...new Set([...html.en.matchAll(STEP_ATTRIBUTE)].map((match) => Number(match[1])))].sort((a, b) => a - b),
    ko: [...new Set([...html.ko.matchAll(STEP_ATTRIBUTE)].map((match) => Number(match[1])))].sort((a, b) => a - b),
  }
  if (steps.en.join() !== steps.ko.join()) {
    problems.push(
      `practice-page/${name}: the two language variants walk different steps — en: ${steps.en.join(', ') || 'none'}, ko: ${steps.ko.join(', ') || 'none'}`,
    )
  }

  const jsPath = join(dir, 'practice-page.js')
  let js = ''
  if (existsSync(jsPath)) js = readFileSync(jsPath, 'utf8')
  else if (steps.en.length > 0) {
    problems.push(
      `practice-page/${name}/practice-page.js is missing — a subject that walks needs the behaviour both variants share`,
    )
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

      // On a walkable subject the step is not decoration: it is what the
      // reveal tells a Learner in order to send them back to the moment. A
      // defect with no step, or one naming a step the flow does not have,
      // points at nothing walkable.
      const step = typeof record.step === 'number' && steps.en.includes(record.step) ? record.step : undefined
      if (steps.en.length === 0) {
        if (record.step !== undefined) {
          problems.push(`${rel}: ${label} names a step, but this subject is one page and walks nowhere`)
        }
      } else if (step === undefined) {
        problems.push(`${rel}: ${label} must name the step it occurs in, one of ${steps.en.join(', ')}`)
      }

      const defect: PlantedDefect = {
        slug,
        element: stringOrEmpty(record.element),
        ...(step === undefined ? {} : { step }),
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

  return { stage, html, css, js, elements: [...elements], steps: steps.en, defects }
}

/**
 * The specimen Self-Audit Report (ADR-0011, artefact B).
 *
 * Every rule here is one `addFinding` already enforces on a Learner's own
 * submission: the element exists on the subject, the Principle is a Glossary
 * slug, one element carries one Finding, and the report is no thinner than a
 * complete one. A specimen breaking any of them is a report this platform
 * would have refused, and a Learner asked to judge it would be judging
 * something that could not have happened.
 *
 * The wrongness the artefact is made of therefore lives entirely in the
 * *prose* — a Principle that is real but not the one this element breaks, a
 * defect that is a preference, a defect that is not there. None of it is
 * spellable as a broken record, which is what keeps "this is authored badly on
 * purpose" from ever being an excuse the build has to take on trust.
 *
 * A missing file is not a failure: it is an artefact nobody has written yet,
 * the same tolerance an unauthored item pool and an unauthored subject have.
 */
function loadSpecimen(
  root: string,
  config: ContentConfig,
  principles: Set<string>,
  practicePages: PracticePage[],
  problems: string[],
): Specimen | null {
  const rel = 'specimen-report.md'
  const path = join(root, rel)
  if (!existsSync(path)) return null

  const { data } = readFrontmatter(path, rel, problems)
  checkLanguagePairs(data, rel, problems)

  // Named `subject` rather than `stage` all the way down, because this
  // artefact has two Stages about it and they are different numbers: it is
  // read on the way to a Stage 3 Competency and it reviews Stage 1's page.
  // Renaming it to `stage` on arrival is how the two get confused.
  const subject = data.subject
  if (typeof subject !== 'number' || !Number.isInteger(subject)) {
    problems.push(`${rel}: subject must name the Stage whose Practice Page this report reviews`)
    return null
  }
  if (!config.stages.some((entry) => entry.stage === subject)) {
    problems.push(`${rel}: reviews Stage ${subject}, which config.md does not declare`)
    return null
  }
  const page = practicePages.find((candidate) => candidate.stage === subject)
  if (!page) {
    // Without the page there is nothing to check an element against, so every
    // rule below would pass by having nothing to compare with.
    problems.push(`${rel}: reviews Stage ${subject}, which has no authored subject`)
    return null
  }

  // The Competency whose page carries the link to this report. Checked against
  // the curriculum rather than trusted, so moving a slug in config.md breaks
  // the build instead of quietly unhooking the only route to this artefact.
  const competency = stringOrEmpty(data.competency)
  const declaredCompetencies = config.stages.flatMap((entry) => entry.competencies)
  if (competency === '') {
    problems.push(`${rel}: competency must name the Competency whose page links to this report`)
  } else if (!declaredCompetencies.includes(competency)) {
    problems.push(`${rel}: names Competency "${competency}", which config.md does not declare`)
  }

  let list: unknown[] = []
  if (Array.isArray(data.findings)) {
    list = data.findings
    // No floor under this check: an empty list is a report carrying nothing,
    // which is the one length a "report is too thin" rule must not let past.
    if (list.length < config.minFindings) {
      problems.push(
        `${rel}: carries ${list.length} Findings, fewer than the ${config.minFindings} a complete report requires`,
      )
    }
  } else problems.push(`${rel}: findings must be a list`)

  const findings: SpecimenFinding[] = []
  const claimed = new Set<string>()
  for (const [index, raw] of list.entries()) {
    const record = isRecord(raw) ? raw : {}
    // Located the way `checkLanguagePairs` locates the same record's prose, so
    // one broken Finding reports under one address rather than two.
    const label = `findings[${index}]`

    for (const field of ['element', 'principle', 'quality'] as const) {
      if (typeof record[field] !== 'string' || record[field].trim() === '') {
        problems.push(`${rel}: ${label} is missing its ${field}`)
      }
    }
    for (const field of ['defect', 'fix'] as const) {
      if (!isLanguagePair(record[field])) problems.push(`${rel}: ${label} must carry an en/ko ${field}`)
    }

    const element = stringOrEmpty(record.element)
    const principle = stringOrEmpty(record.principle)
    const quality = stringOrEmpty(record.quality)

    // Empty fields were reported above; reporting the same omission twice
    // would bury the one line that says what to do about it.
    if (element !== '' && !page.elements.includes(element)) {
      problems.push(
        `${rel}: ${label} names element "${element}", which does not exist on the Stage ${subject} subject`,
      )
    } else if (element !== '') {
      if (claimed.has(element)) {
        problems.push(`${rel}: two Findings on element "${element}" — one element, one Finding, as a submission is`)
      }
      claimed.add(element)
    }
    if (principle !== '' && !principles.has(principle)) {
      problems.push(`${rel}: ${label} cites UX Principle "${principle}", absent from the Glossary`)
    }
    if (quality !== '' && !SPECIMEN_QUALITIES.includes(quality as SpecimenQuality)) {
      problems.push(`${rel}: ${label} declares quality "${quality}", which is none of ${SPECIMEN_QUALITIES.join(', ')}`)
    }

    findings.push({
      element,
      principle,
      quality: quality as SpecimenQuality,
      defect: asBilingual(record.defect),
      fix: asBilingual(record.fix),
    })
  }

  return { subject, competency, findings }
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
    checkKoreanParticleSpacing(node.ko, rel, `${path || 'content'}.ko`, problems)
  }
  for (const [key, value] of Object.entries(node)) {
    checkLanguagePairs(value, rel, problems, path === '' ? key : `${path}.${key}`)
  }
}

/**
 * Korean particles attach to the word in front of them. A space before one is
 * always wrong — `"보관함" 입니다` is a typo a Korean reader stops at, the way
 * `the boo k` is in English.
 *
 * This is a mistake English cannot make, and the reason it reaches Korean is
 * the file format rather than the writing. Prose here is authored as a folded
 * scalar (`>-`), where YAML turns every line break into a space, so a line
 * wrapped between a word and its particle renders as two. Nothing about the
 * source looks wrong: the particle sits at the start of the next line, which
 * is exactly where a wrapped English word would sit. The English variant of
 * the same field is unaffected, because English already had a space there.
 *
 * Only particles that can never legitimately follow a space are listed. The
 * bound nouns a Korean writer *does* space — `뿐`, `만큼`, `수` — are left out,
 * as is `보다`, which is also the verb "to see". A check that cries wolf gets
 * turned off.
 *
 * Screens are skipped. They are authored as literal blocks (`|-`), which keep
 * their line breaks and so cannot acquire this defect, and their copy is
 * deliberately bad — a Planted Defect is not a typo to be corrected.
 */
const KOREAN_BOUND_PARTICLES =
  /[가-힣0-9"”』」\)] (입니다|입니까|이다|이고|이며|이라고|이라는|이라서|라고|라는|까지|부터|처럼|마다|집니다|졌습니다)/g

/**
 * A justification is a fill-in-the-blank sentence a Learner says out loud, so
 * every `[slot]` is replaced by a word nobody knows in advance. Korean picks
 * the form of a particle from whether the word before it ends in a consonant —
 * 을/를, 은/는, 이/가, 와/과, 으로/로 — so a particle written directly after a
 * slot is right for half the words that can land there and wrong for the rest.
 *
 * English has no such agreement, which is why the English template is fine and
 * its Korean sibling is not. The written dodge, "을(를)", is unavailable here:
 * this sentence is meant to be spoken in a standup, and nobody says a bracket.
 * The fix is to move the slot — put a fixed noun after it (`[무엇] 하나를`), or
 * let it land where a copula ends the clause (`[무엇]입니다`).
 *
 * A slot whose own text ends in a fixed noun (`[읽는 사람]`, `[몇 명]`) settles
 * the question itself: the Learner replaces the qualifier, not that noun.
 */
const VARYING_PARTICLES = /\[[^\]]*\]\s*(은|는|이|가|을|를|와|과|으로|로|이라면|라면|이라고|라고|이나|이며|이라는|라는)(?![가-힣])/g
const SELF_TERMINATING_SLOT = /(사람|명)\]$/

function checkKoreanSlotParticles(korean: string, rel: string, problems: string[]): void {
  for (const found of korean.matchAll(VARYING_PARTICLES)) {
    const slot = found[0].slice(0, found[0].indexOf(']') + 1)
    if (SELF_TERMINATING_SLOT.test(slot)) continue
    problems.push(
      `${rel}: justification.ko puts "${found[1]}" straight after ${slot}, and that particle changes ` +
        `with whatever fills the slot. Move the slot, or put a fixed noun between them.`,
    )
  }
}

/**
 * The Korean side of a pair is not always one string: an option list is
 * `options.ko[]`, each option carrying its own `text` and `reason`. Those
 * are the sentences a Learner reads after answering, so they are walked too.
 */
function checkKoreanParticleSpacing(korean: unknown, rel: string, path: string, problems: string[]): void {
  if (Array.isArray(korean)) {
    korean.forEach((child, index) => checkKoreanParticleSpacing(child, rel, `${path}[${index}]`, problems))
    return
  }
  if (isRecord(korean)) {
    for (const [key, value] of Object.entries(korean)) {
      checkKoreanParticleSpacing(value, rel, `${path}.${key}`, problems)
    }
    return
  }
  if (typeof korean !== 'string' || /<[a-zA-Z]/.test(korean)) return
  for (const found of korean.matchAll(KOREAN_BOUND_PARTICLES)) {
    problems.push(
      `${rel}: ${path || 'content'} splits a particle from its word — "${found[0]}". ` +
        `Korean particles carry no space before them; move the line break so "${found[1]}" stays joined.`,
    )
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
