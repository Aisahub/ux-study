import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { competenciesOfStage, stageOf } from '@/lib/content'
import type { Language } from '@/lib/language'
import { progressFor, stageProgress, type QuizStatus } from '@/lib/progress'
import { content } from '@/lib/server-content'

/**
 * What both panels of a Competency share: which Competency it is, where it
 * stands, and the switch between the two.
 *
 * The Competency became two addresses on 2026-08-12 — the taught material at
 * `/learn/<slug>` and the Learner's own notes at `/learn/<slug>/notes`. Two
 * addresses rather than one address with a `?tab=`, for a reason the language
 * switcher decides: it builds the counterpart from the **pathname** alone, so a
 * query string is dropped on the way across. A Korean Learner switching to
 * English from their notes would have landed on the material, silently — which
 * bilingual parity does not allow. A path segment survives the crossing
 * untouched, is bookmarkable, and matches how the Gate Quiz already hangs off
 * this route.
 *
 * The cost of the split is real and is recorded here rather than left to be
 * rediscovered: the Competency page used to be one numbered column in the
 * order the work is done, and a Learner writing a note can no longer see the
 * article or the pre-reading questions while they write. That was the whole
 * argument for putting the notes step between the reading and the gate. The
 * split was chosen anyway, deliberately, to keep the material column short.
 */

export type Panel = 'competency' | 'notes'

const COPY: Record<
  Language,
  {
    back: string
    station: (number: string) => string
    status: Record<QuizStatus, string>
    attempts: (n: number) => string
    panels: string
    competency: string
    notes: string
  }
> = {
  en: {
    back: 'All Competencies',
    station: (number) => `Lesson ${number}`,
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    panels: 'This Competency',
    competency: 'The Competency',
    notes: 'Your notes',
  },
  ko: {
    back: '전체 역량 보기',
    station: (number) => `레슨 ${number}`,
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    panels: '이 역량',
    competency: '역량',
    notes: '내 메모',
  },
}

/**
 * Everything both panels have to look up before they can render: that the
 * Competency exists, who is reading, and how their Gate Quiz stands.
 *
 * Shared rather than written twice, because the two panels are one page as far
 * as a Learner is concerned — a heading that disagreed with itself across a
 * tab switch would be the Consistency defect this platform's third Competency
 * teaches, committed by the page that teaches it.
 */
export async function loadCompetency(lang: Language, slug: string) {
  const competency = content.competencies.find((entry) => entry.slug === slug)
  const stage = stageOf(content.config, slug)
  if (!competency || stage === null) notFound()
  const session = await requireSession(lang)

  const quiz = stageProgress(await progressFor(session.email), stage).quizzes[slug]
  // Numbered within its own Stage, so Stage 1 still counts 1–4, and padded to
  // two digits to match the 01–04 badges the Learn overview list carries.
  const station = String(competenciesOfStage(content.config, stage).indexOf(slug) + 1).padStart(2, '0')

  return { session, competency, stage, quiz, station }
}

/**
 * The state of this one station, in the three ways the design system requires
 * every status to read: colour, shape, and the word beside it.
 */
function StatusChip({ status, label }: { status: QuizStatus; label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
      <i
        aria-hidden
        className={`size-[11px] rounded-full ${
          status === 'passed'
            ? 'bg-oxblood'
            : status === 'in-progress'
              ? 'bg-linear-[90deg,var(--oxblood)_0_50%,#fff_50%_100%] shadow-[inset_0_0_0_2.5px_var(--oxblood)]'
              : 'bg-white shadow-[inset_0_0_0_2.5px_var(--blue-grey)]'
        }`}
      />
      {label}
    </span>
  )
}

/**
 * The switch between the two panels.
 *
 * It is the language switcher's shape, and deliberately so: that control is
 * already this platform's way of saying "the same page, in the other version",
 * which is exactly what this says. Inventing a second silhouette for the same
 * relationship is the drift the design system's own Consistency lesson is
 * about. Links rather than buttons, because each panel is a real address — so
 * it works before hydration, opens in a new tab, and survives a refresh.
 *
 * No `role="tab"`. That role promises a JavaScript widget where arrow keys
 * move between panels without leaving the page; these are navigation, and
 * `aria-current="page"` is the honest way to say which one you are on.
 *
 * The note count rides the notes panel as a trailing quiet detail at 72%,
 * which is the treatment the Gate Quiz button's "5 items" already uses. It is
 * a count of notes, never of the Learner: nothing anywhere totals a person.
 */
function PanelSwitch({
  lang,
  slug,
  active,
  noteCount,
  copy,
}: {
  lang: Language
  slug: string
  active: Panel
  noteCount: number
  copy: (typeof COPY)[Language]
}) {
  const panels = [
    { id: 'competency' as const, href: `/${lang}/learn/${slug}`, label: copy.competency, count: 0 },
    { id: 'notes' as const, href: `/${lang}/learn/${slug}/notes`, label: copy.notes, count: noteCount },
  ]

  return (
    <nav
      aria-label={copy.panels}
      className="flex w-fit max-w-full gap-0.5 rounded-full bg-surface p-1 shadow-pill"
    >
      {panels.map((panel) => (
        <Link
          key={panel.id}
          href={panel.href}
          aria-current={active === panel.id ? 'page' : undefined}
          // min-h-11: the target is the link, and 44px belongs to whatever
          // actually answers the tap rather than to the strip around it.
          className={`press flex min-h-11 items-center gap-2 rounded-full px-[17px] text-label font-bold break-keep ${
            active === panel.id ? 'bg-oxblood text-white' : 'text-ink'
          }`}
        >
          {panel.label}
          {panel.count > 0 && (
            <span className={active === panel.id ? 'opacity-70' : 'text-ink-2'}>{panel.count}</span>
          )}
        </Link>
      ))}
    </nav>
  )
}

/**
 * One Competency's chrome: the way back out, what this Competency is called,
 * how it stands, and the switch between its two panels. The panel itself is
 * the child.
 */
export function CompetencyShell({
  lang,
  slug,
  name,
  quiz,
  station,
  active,
  noteCount,
  children,
}: {
  lang: Language
  slug: string
  name: { en: string; ko: string }
  quiz: { status: QuizStatus; attempts: number }
  station: string
  active: Panel
  noteCount: number
  children: React.ReactNode
}) {
  const copy = COPY[lang]

  return (
    // A column, the width the Gate Quiz doorstep next door uses. The
    // Competency is one thread of reading that ends at that doorstep, and
    // handing it the full working area would only widen the cards around a
    // measure that is fixed at the reading measure anyway.
    <main className="mx-auto w-full max-w-[720px] px-0.5">
      <nav className="px-1.5 pb-3.5">
        <Link
          href={`/${lang}/learn`}
          className="press inline-flex items-center gap-2 rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill"
        >
          <span aria-hidden>←</span>
          {copy.back}
        </Link>
      </nav>

      <div className="flex flex-wrap items-center gap-4 px-1.5 pb-5">
        <div>
          <h1 className="font-serif text-display font-bold text-ink">{name[lang]}</h1>
          {/* The English name under the Korean one — a Learner reading Korean
              still has to recognise the term in a pull request written by the
              Indonesia cohort. In English there is nothing to put underneath. */}
          {lang === 'ko' && (
            <p className="mt-1.5 text-micro font-bold text-ink-2 uppercase">{name.en}</p>
          )}
        </div>
        <div className="ml-auto flex flex-wrap gap-2.5">
          <span className="rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
            {copy.station(station)}
          </span>
          <StatusChip status={quiz.status} label={copy.status[quiz.status]} />
          {quiz.attempts > 0 && (
            <span className="rounded-full bg-surface px-[17px] py-[9px] text-label font-bold shadow-pill">
              {copy.attempts(quiz.attempts)}
            </span>
          )}
        </div>
      </div>

      <div className="px-1.5 pb-3.5">
        <PanelSwitch lang={lang} slug={slug} active={active} noteCount={noteCount} copy={copy} />
      </div>

      {children}
    </main>
  )
}
