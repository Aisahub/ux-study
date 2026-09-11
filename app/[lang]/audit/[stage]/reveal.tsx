import { auditStanding, draftFor } from '@/lib/audit'
import { requireSession } from '@/lib/auth'
import type { PlantedDefect } from '@/lib/content'
import type { Language } from '@/lib/language'
import { content } from '@/lib/server-content'

import { LocateButton, SUBJECT_FRAME_ID } from './locate'
import { PanelSwitch } from './panel-switch'

/**
 * The submitted Self-Audit Report, read as two surfaces (#24's shape, kept).
 *
 * Before submission the audit is the Practice Page beside the drawer the
 * Learner writes into. Afterwards it was a single column of identifiers: what
 * was planted, then what they wrote, with the page they are about nowhere on
 * screen. A Learner reading `shipping-help-text` had no way to tell which
 * thing on the page that was, and no way to go and look without leaving the
 * report.
 *
 * So the reveal keeps the two-surface shape the audit already had. The subject
 * stays on the left; the right holds the two panels of the report itself —
 * what was planted, and what this Learner found — and every element on either
 * panel can be marked on the subject without the report moving.
 *
 * Both panels group by Competency, which is the attribute the whole programme
 * is cut along: a Learner's accumulated Competencies *are* their audit
 * checklist (PRODUCT.md), so "the hierarchy ones were all found and the
 * consistency one was missed" is the reading the grouping exists to make
 * possible. Nothing counts them. A found-count would be a per-person total,
 * which this platform does not keep — the status is said on each card, in the
 * three ways every status here is said.
 */

export const COPY: Record<
  Language,
  {
    heading: (stage: number) => string
    intro: string
    panels: string
    planted: string
    yours: string
    subject: string
    source: string
    locate: string
    found: string
    missed: string
    principle: string
    fix: string
    issueHeading: string
    issueSave: string
    issueSaved: string
    complete: (stage: number) => string
    defectStep: (step: number, of: number) => string
  }
> = {
  en: {
    heading: (stage) => `Stage ${stage} Self-Audit Report`,
    intro:
      'Every planted defect, and whether one of your Findings pointed at it. Missing some is normal — the point was the looking.',
    panels: 'This report',
    planted: 'What was planted',
    yours: 'Your Findings',
    subject: 'The page you audited',
    source: 'Read the page source',
    locate: 'Show me on the page',
    found: 'Found',
    missed: 'Missed',
    principle: 'Principle',
    fix: 'Proposed fix',
    issueHeading: 'Optional: show a fix',
    issueSave: 'Save link',
    issueSaved: 'Saved.',
    complete: (stage) => `Stage ${stage} complete — every Gate Quiz passed and the report submitted.`,
    // Where the subject is walked, the element alone does not locate a defect:
    // the same control is on screen at more than one moment, and the moment is
    // the thing to go back to. Worded as the subject words it, so a Learner
    // reads the same phrase here and on the screen they are being sent to.
    defectStep: (step, of) => `Step ${step} of ${of}`,
  },
  ko: {
    heading: (stage) => `${stage}단계 자가 점검 리포트`,
    intro:
      '심어둔 결함 전부와, 내 발견이 그중 무엇을 가리켰는지입니다. 몇 개를 놓치는 건 정상입니다. 중요한 건 들여다보는 일이었습니다.',
    panels: '이 리포트',
    planted: '심어 둔 것들',
    yours: '나의 발견',
    subject: '점검한 페이지',
    source: '페이지 소스 보기',
    locate: '화면에서 보기',
    found: '발견',
    missed: '놓침',
    principle: '원칙',
    // `제안` dropped on this reading surface (ERR-236): the reveal shows a
    // proposal already made, and the request the word carries belongs to the
    // drawer, where the writing happens.
    fix: '고치는 방법',
    issueHeading: '선택: 고친 것을 보여 주기',
    issueSave: '링크 저장',
    issueSaved: '저장되었습니다.',
    complete: (stage) => `${stage}단계 수료 · 퀴즈 전부 통과, 보고서 제출 완료.`,
    // 화면, not 단계: the subject calls these 단계, but on this page 단계 is
    // already the Stage — `2단계 수료` sits a few lines below — and one word
    // cannot mean both in one view.
    defectStep: (step, of) => `${of}개 화면 중 ${step}번째`,
  },
}

/**
 * Everything both panels of the submitted report look up, or null where there
 * is no submitted report to frame.
 *
 * Asked by the frame and again by the panel inside it, which is why the two
 * reads underneath are cached per request: a layout is not told which of its
 * children is rendering, so it cannot hand the answer down.
 */
export async function loadReveal(lang: Language, stage: number) {
  const session = await requireSession(lang)
  const standing = await auditStanding(session.email, stage)
  if (standing.state !== 'open') return null

  const { report, findings } = await draftFor(session.email, stage)
  if (!report?.submittedAt) return null

  return { standing, subject: standing.subject, brief: standing.brief, report, findings }
}

/**
 * Where a Competency stands in the curriculum, so that groups come out in the
 * order `config.md` declares rather than in the order the data happens to be
 * in. Every Stage, not only this one: a subject may carry a defect against a
 * Competency from an earlier Stage, which is the honest shape of real work.
 */
const CURRICULUM_ORDER = content.config.stages.flatMap((entry) => entry.competencies)

function competencyName(slug: string, lang: Language): string {
  return content.competencies.find((entry) => entry.slug === slug)?.name[lang] ?? slug
}

export interface CompetencyGroup<T> {
  slug: string
  name: string
  items: T[]
}

/** One list, cut into the Competencies it belongs to, in curriculum order. */
export function byCompetency<T>(
  items: T[],
  competencyOf: (item: T) => string,
  lang: Language,
): CompetencyGroup<T>[] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const slug = competencyOf(item)
    const existing = groups.get(slug)
    if (existing) existing.push(item)
    else groups.set(slug, [item])
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      // A slug the curriculum does not declare sorts last rather than first,
      // which is what a plain indexOf of -1 would do.
      const rank = (slug: string) => {
        const index = CURRICULUM_ORDER.indexOf(slug)
        return index === -1 ? CURRICULUM_ORDER.length : index
      }
      return rank(a) - rank(b)
    })
    .map(([slug, items]) => ({ slug, name: competencyName(slug, lang), items }))
}

/**
 * Which Competency a Learner's Finding belongs to: the one taught by the
 * Principle they chose.
 *
 * A Principle may feed more than one Competency, and where it does, the one
 * this Learner has been taught is the one meant — the two are never in the
 * same Stage. Beyond that the Glossary's own first entry decides, so a Finding
 * always lands somewhere rather than in a bucket named "other".
 */
export function competencyOfPrinciple(principle: string, stage: number): string {
  const entry = content.glossary.find((item) => item.slug === principle)
  if (!entry || entry.competencies.length === 0) return principle
  const taught = content.config.stages
    .filter((declared) => declared.stage <= stage)
    .flatMap((declared) => declared.competencies)
  return entry.competencies.find((slug) => taught.includes(slug)) ?? entry.competencies[0]
}

/**
 * The heading a group of cards sits under.
 *
 * The Competency's name and nothing else. No count rides it: a tally of what
 * was found and what was missed is a per-person total, and this platform keeps
 * none — the design system forbids the whole vocabulary that leads back to a
 * ranking, and the status is already on every card.
 */
function GroupHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-2 px-1.5 font-serif text-headline font-bold text-ink first:mt-0">{children}</h2>
}

/**
 * The element a card is about, in the two things a Learner needs from it: the
 * words it shows on the page, and the identifier the record is keyed by.
 *
 * Both, not one. The quoted words are what makes a list of Findings readable
 * at a glance; the identifier is what a Learner types into a pull request and
 * what makes their Finding and a colleague's the same record, so it stays.
 */
function ElementName({ label, identifier }: { label: string; identifier: string }) {
  return (
    <>
      <p className="text-title font-bold text-ink">{label}</p>
      <p className="mt-1 font-mono text-body-sm break-all text-ink-2">{identifier}</p>
    </>
  )
}

/**
 * Found or missed, in the three channels this design system requires of every
 * status: the mark's colour, the mark's shape, and the word beside it. A
 * filled mark is a defect one of the Learner's Findings pointed at; a hollow
 * ring is one nobody reached — the same two silhouettes the Learn directory's
 * badges and the Gate Quiz's stations already use.
 */
function FoundMark({ found, label }: { found: boolean; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sunk px-[17px] py-[9px] text-label font-bold text-ink">
      <i
        aria-hidden
        className={`size-[11px] rounded-full ${
          found ? 'bg-oxblood' : 'bg-white shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
        }`}
      />
      {label}
    </span>
  )
}

/** One Planted Defect, against whether a Finding reached it. */
export function DefectCard({
  defect,
  found,
  label,
  explanation,
  steps,
  copy,
}: {
  defect: PlantedDefect
  found: boolean
  label: string
  explanation: string
  steps: number
  copy: (typeof COPY)[Language]
}) {
  return (
    <li className="rounded-card bg-surface p-[26px] shadow-card">
      <div className="flex flex-wrap items-start gap-2.5">
        <FoundMark found={found} label={found ? copy.found : copy.missed} />
        {defect.step !== undefined && (
          <span className="inline-flex items-center rounded-full bg-sunk px-[17px] py-[9px] text-label font-bold text-ink">
            {copy.defectStep(defect.step, steps)}
          </span>
        )}
      </div>
      <div className="mt-4">
        <ElementName label={label} identifier={defect.element} />
      </div>
      <p className="mt-3 max-w-measure text-body-sm text-ink">{explanation}</p>
      <LocateButton element={defect.element} label={copy.locate} />
    </li>
  )
}

/** One Finding this Learner wrote, in the four parts every Finding has. */
export function FindingCard({
  finding,
  label,
  principle,
  copy,
}: {
  finding: { element: string; description: string; fix: string }
  label: string
  principle: string
  copy: (typeof COPY)[Language]
}) {
  return (
    <li className="rounded-card bg-surface p-[26px] shadow-card">
      <span className="inline-flex items-center rounded-full bg-sunk px-[17px] py-[9px] text-label font-bold text-ink">
        {copy.principle} · {principle}
      </span>
      <div className="mt-4">
        <ElementName label={label} identifier={finding.element} />
      </div>
      <p className="mt-3 max-w-measure text-body-sm text-ink">{finding.description}</p>
      <p className="mt-2 max-w-measure text-body-sm text-ink-2">
        <span className="font-bold">{copy.fix}</span> — {finding.fix}
      </p>
      <LocateButton element={finding.element} label={copy.locate} />
    </li>
  )
}

/** A panel's groups, each under the Competency it belongs to. */
export function GroupedPanel<T>({
  groups,
  render,
}: {
  groups: CompetencyGroup<T>[]
  render: (item: T, index: number) => React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {groups.map((group) => (
        <section key={group.slug} className="flex flex-col gap-3.5">
          <GroupHeading>{group.name}</GroupHeading>
          <ul className="flex flex-col gap-3.5">{group.items.map(render)}</ul>
        </section>
      ))}
    </div>
  )
}

/**
 * The frame both panels stand in: what this report is, the subject it is
 * about, the switch between the two panels, and the two things that belong to
 * the report as a whole rather than to either panel.
 *
 * The subject is one frame, held by the layout, so crossing between the panels
 * never reloads it — a page that blanked and scrolled back to the top on every
 * crossing would defeat the arrangement. Below `wide` it becomes a panel above
 * the report rather than beside it: a phone cannot keep two surfaces useful at
 * once, and the report is what a Learner came to read.
 */
export function RevealShell({
  lang,
  stage,
  copy,
  issue,
  children,
}: {
  lang: Language
  stage: number
  copy: (typeof COPY)[Language]
  issue: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="flex w-full flex-1 flex-col gap-3.5 px-0.5 font-sans">
      <header className="px-1.5">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading(stage)}</h1>
        <p className="mt-2.5 max-w-measure text-ink-2">{copy.intro}</p>
      </header>

      <div className="flex flex-col gap-3.5 wide:flex-row wide:items-start">
        {/* Open at both widths, and collapsible at both. A control that is
            there on one screen and gone on another is the Consistency defect
            the third Competency teaches; what changes with width is where the
            subject sits, not whether it can be put away.

            Open on a phone as well, and the cost is recorded rather than
            glossed: a panel that starts closed there would put the report on
            the first screen, which is what a Learner came back for. `open` is
            an attribute and not a style, so nothing in CSS can set it per
            breakpoint, and driving it from a media query in the client means a
            flash of the wrong state on every load — the same wall the brief
            above the audit ran into. It answered with two elements, which is
            free for two paragraphs of prose and would be a second copy of the
            subject here. So the frame is a strip instead: tall enough to hold
            an element in its surroundings, short enough that the switch and
            the first card are on the first screen, and one tap puts it away
            entirely. */}
        <details
          open
          className="group w-full rounded-card bg-surface p-[26px] shadow-card wide:sticky wide:top-3.5 wide:min-w-0 wide:flex-1"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden
              className="text-ink-2 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
            >
              ▸
            </span>
            {/* A heading inside the summary, not a styled span: the subject
                panel is a section of this page and belongs in its outline
                beside the Competency groups. */}
            <h2 className="font-serif text-headline font-bold text-ink">{copy.subject}</h2>
          </summary>

          <iframe
            id={SUBJECT_FRAME_ID}
            // `locate`, not the audit's selecting mode: this report is
            // submitted, so a click on the subject has nothing left to change
            // and a page that took a selection it could not act on would be
            // the Perceived clickability defect this platform teaches.
            src={`/${lang}/audit/${stage}/page?locate`}
            title={copy.subject}
            className="mt-4 h-[32vh] max-h-[420px] min-h-[220px] w-full rounded-badge bg-white wide:h-[calc(100vh-16rem)] wide:max-h-none wide:min-h-[420px]"
          />
          <p className="mt-3">
            <a
              href={`/${lang}/audit/${stage}/page/source`}
              className="text-body-sm text-ink-2 underline underline-offset-4"
            >
              {copy.source}
            </a>
          </p>
        </details>

        <div className="flex w-full flex-col gap-3.5 wide:w-[440px] wide:shrink-0">
          <div className="px-1.5">
            <PanelSwitch
              lang={lang}
              stage={stage}
              labels={{ panels: copy.panels, planted: copy.planted, yours: copy.yours }}
            />
          </div>
          {children}
          {issue}
          <p className="px-1.5 pb-1 text-body-sm font-bold text-oxblood">{copy.complete(stage)}</p>
        </div>
      </div>
    </main>
  )
}
