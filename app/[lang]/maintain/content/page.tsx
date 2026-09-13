import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isNotNull } from 'drizzle-orm'

import { db, schema } from '@/db'
import { cohortOf, requireMaintainer } from '@/lib/auth'
import { elementLabels } from '@/lib/element-label'
import { isLanguage, type Language } from '@/lib/language'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

/** Named rather than written inline, because the column head below takes it. */
type Copy = {
  heading: string
  explanation: string
  itemsHeading: string
  stage: (n: number) => string
  notAuthored: string
  noSubject: string
  rate: (correct: number, drawn: number) => string
  neverDrawn: string
  defectsHeading: string
  defectsExplanation: string
  missedBy: (missed: number, of: number) => string
  locationsHeading: string
  locationsExplanation: string
  korea: string
  indonesia: string
  submitted: (reports: number) => string
  finders: (found: number) => string
  noReportsHere: string
  noReports: string
}

const COPY: Record<Language, Copy> = {
  en: {
    heading: 'Content health',
    // The cohort size is deliberately not a number here. It said "four
    // badly-prepared Learners" until 2026-07-31, which the Maintainer reading
    // this page can falsify from the allowlist one mark away.
    explanation:
      'An item everyone fails is far more likely a badly-worded item than a cohort who all prepared badly. Every figure is computed from attempts and reports as this page loads — nothing is stored separately.',
    itemsHeading: 'Quiz Item pass rates',
    stage: (n) => `Stage ${n}`,
    notAuthored: 'No pool authored yet',
    noSubject: 'no page authored to audit yet',
    rate: (correct, drawn) => `${correct} correct of ${drawn} drawn`,
    neverDrawn: 'never drawn',
    defectsHeading: 'Planted defects, most missed first',
    defectsExplanation: 'Across submitted reports: how many missed each defect.',
    missedBy: (missed, of) => `missed by ${missed} of ${of}`,
    locationsHeading: 'The two locations, same page',
    locationsExplanation:
      'Both cohorts audit identical input, so what each found is a controlled comparison. Workspace addresses are the Korea cohort; personal addresses are Indonesia.',
    korea: 'Korea',
    indonesia: 'Indonesia',
    submitted: (reports) => `${reports} submitted`,
    finders: (found) => `${found}`,
    noReportsHere: 'no reports yet',
    noReports: 'No submitted reports yet.',
  },
  ko: {
    heading: '콘텐츠 상태',
    explanation:
      '모두가 틀리는 문항은 준비 부족보다 문항이 잘못 작성되었을 가능성이 훨씬 큽니다. 모든 수치는 페이지를 열 때 시도와 보고서 기록에서 계산되며, 별도로 저장되지 않습니다.',
    itemsHeading: '문항별 정답률',
    stage: (n) => `${n}단계`,
    notAuthored: '아직 작성된 문항 풀이 없습니다',
    noSubject: '아직 점검할 페이지가 작성되지 않았습니다',
    rate: (correct, drawn) => `${drawn}회 출제 중 ${correct}회 정답`,
    neverDrawn: '아직 출제되지 않음',
    defectsHeading: '심어둔 결함 · 많이 놓친 순',
    defectsExplanation: '제출된 보고서 기준: 각 결함을 몇 명이 놓쳤는지입니다.',
    missedBy: (missed, of) => `${of}명 중 ${missed}명이 놓침`,
    locationsHeading: '같은 페이지 · 팀별 결함 발견 비교',
    locationsExplanation:
      '두 팀이 완전히 같은 페이지를 점검하므로, 발견의 차이는 통제된 비교가 됩니다. Workspace 주소는 한국팀, 개인 주소는 인도네시아팀입니다.',
    // The English column says `Korea`, and a bare `한국` beside a number would
    // read as the country rather than the people in it. `팀` is what makes the
    // Korean label name the same thing its English sibling names (CONTEXT.md).
    korea: '한국팀',
    indonesia: '인도네시아팀',
    submitted: (reports) => `${reports}명 제출`,
    finders: (found) => `${found}명`,
    noReportsHere: '아직 제출 없음',
    noReports: '제출된 보고서가 아직 없습니다.',
  },
}

/**
 * One row of this page's two-part shape: what is being counted, and the count.
 *
 * The identifier takes the flexible column and wraps; the figure sits in a
 * column that never shrinks. It was the other way round until 2026-07-31 —
 * `truncate` on the identifier, `shrink-0` on the figure — which cut the only
 * handle a Maintainer has for finding the item to fix and preserved the number
 * they can always re-read. Below `sm` the two stack rather than sharing a
 * 208px line.
 *
 * An absent figure is set apart by tone and weight as well as by its words:
 * `never drawn` is not a rate of zero, and this platform teaches in its first
 * Stage that one channel is not enough.
 *
 * The name column is capped rather than elastic. Pushed to the two ends of an
 * 896px card the pair sat a measured 506px apart, and seventy rows of that is
 * an invitation to read one item's name against the row below's figure. 22rem
 * holds the longest authored name (305px) with room to spare and still lands
 * every figure on one vertical line, so the column stays scannable downward:
 * median gap 143px. A name longer than the cap wraps; nothing is cut.
 */
function Row({
  name,
  detail,
  value,
  absent,
}: {
  name: React.ReactNode
  detail?: React.ReactNode
  value: string
  absent?: boolean
}) {
  return (
    <li className="grid gap-x-[14px] sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-baseline">
      <span className="min-w-0 [overflow-wrap:anywhere]">
        <span className={detail ? 'block text-title font-bold text-ink' : 'block text-body-sm text-ink'}>
          {name}
        </span>
        {detail}
      </span>
      <span className={absent ? 'text-body-sm text-ink-2' : 'text-label font-bold text-ink'}>
        {value}
      </span>
    </li>
  )
}

/**
 * The second line under a Planted Defect's name, on both shelves that list one.
 *
 * A defect is named here the way the reveal already names one: the words the
 * element shows on the page, above the identifier the record is keyed by.
 * Both, and in that order. The identifier alone is what these shelves showed
 * until 2026-09-13, and `shipping-help-text` says which thing on the page it is
 * only to somebody who has the subject open in another window — which on the
 * one surface a Maintainer watches content health from is the wrong way round.
 * The identifier stays because it is what they search `manifest.md` for.
 *
 * The label is quoted from the served document by `lib/element-label`, so it is
 * the subject's own Korean and English rather than a third description of an
 * element that already describes itself twice.
 *
 * The Principle rides this line too, because an element's words say *which*
 * thing and never *what is wrong with it*: `마지막 갱신 09:12` is not a defect
 * until `크기` is beside it. It is read from the manifest, which authors a
 * Principle per defect — nothing here is inferred.
 */
function DefectDetail({ principle, identifier }: { principle: string; identifier: string }) {
  return (
    <span className="mt-0.5 block text-body-sm text-ink-2">
      {principle} · <span className="font-mono">{identifier}</span>
    </span>
  )
}

/** The Principle's name in the reader's language, or its slug where the Glossary lost it. */
function principleName(slug: string, lang: Language): string {
  return content.glossary.find((entry) => entry.slug === slug)?.name[lang] ?? slug
}

/**
 * One team, and how many of them submitted a report for this Stage.
 *
 * The denominator belongs to the Stage, not to each defect, so it is said once
 * here instead of inside twelve cells. A team that has submitted nothing for
 * this Stage says so here, in words, and its figures below stay empty — a
 * controlled comparison may not report an absent team as a finding of zero,
 * because the two readings ask a Maintainer for opposite actions.
 */
function TeamCaption({ label, reports, copy }: { label: string; reports: number; copy: Copy }) {
  return (
    // `break-keep` because these boxes are narrow enough for Korean to break
    // inside a word: `아직 제출 없음` does not fit one line on a phone, and the
    // default rule cut it after `없` rather than at the space.
    <>
      <span className="block break-keep text-label font-bold text-ink">{label}</span>
      <span className="block break-keep text-body-sm text-ink-2">
        {reports === 0 ? copy.noReportsHere : copy.submitted(reports)}
      </span>
    </>
  )
}

/**
 * How many of that team found this defect. Tabular numerals, because the column
 * exists to be read downward and proportional digits make a `1` sit narrower
 * than a `3` in the one place on this page where that is the point.
 *
 * Empty rather than `0` for a team with no reports, for `TeamCaption`'s reason.
 */
function Found({ found, reports, copy }: { found: number; reports: number; copy: Copy }) {
  return <>{reports === 0 ? '' : copy.finders(found)}</>
}

const FIGURE = 'text-label font-bold text-ink [font-variant-numeric:tabular-nums]'

/**
 * The content half of the Maintainer dashboard (#28). Pass rates are per
 * item, with the draw count beside every rate so three draws never look
 * settled (ADR-0006); the location panel is the controlled comparison the
 * shared Practice Page makes possible.
 *
 * Three shelves, three white cards on the frosted bed. Until 2026-07-31 this
 * page carried none: it was scaffold-era zinc text sitting directly on the
 * board, which put every figure on it at roughly 4.1:1 — under AA on the
 * platform whose Stage 3 teaches accessibility — and gave a Maintainer in OS
 * dark mode two explanatory paragraphs at 2.6:1, because `dark:` variants
 * darkened the text on a page whose background stays light by decision.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return { title: COPY[isLanguage(lang) ? lang : 'en'].heading }
}

export default async function ContentHealth({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireMaintainer(lang)
  const copy = COPY[lang]

  const attempts = await db.select().from(schema.attempts).where(isNotNull(schema.attempts.submittedAt))
  const reports = await db.select().from(schema.reports).where(isNotNull(schema.reports.submittedAt))
  const findings = await db.select().from(schema.findings)

  // Per item: how often drawn, how often answered correctly.
  const byItem = new Map<string, { drawn: number; correct: number }>()
  for (const attempt of attempts) {
    for (const selection of attempt.selections ?? []) {
      const entry = byItem.get(selection.item) ?? { drawn: 0, correct: 0 }
      entry.drawn += 1
      if (selection.correct) entry.correct += 1
      byItem.set(selection.item, entry)
    }
  }

  const submittedIds = new Set(reports.map((report) => report.id))
  const submittedFindings = findings.filter((finding) => submittedIds.has(finding.reportId))

  // One shelf of statistics per authored subject (#61). A defect is only
  // missed by someone who was looking at the page it is on, so every count
  // here divides by that Stage's reports and not by all of them — pooling the
  // Stages would report a Stage 2 defect as missed by every Stage 1 Learner
  // who never saw it.
  const subjects = content.practicePages.map((page) => {
    const stageReports = reports.filter((report) => report.stage === page.stage)
    const korea = stageReports.filter((report) => cohortOf(report.email) === 'korea').length
    // Read once per subject rather than once per row: both shelves below list
    // the same defects, and the scan walks a few kilobytes of markup.
    const labels = elementLabels(page.html[lang])

    return {
      stage: page.stage,
      reports: stageReports.length,
      koreaReports: korea,
      indonesiaReports: stageReports.length - korea,
      defects: page.defects
        .map((defect) => {
          const finders = stageReports.filter((report) =>
            submittedFindings.some((finding) => finding.reportId === report.id && finding.element === defect.element),
          )
          return {
            defect,
            label: labels[defect.element] ?? defect.element,
            principle: principleName(defect.principle, lang),
            found: finders.length,
            missed: stageReports.length - finders.length,
            koreaFound: finders.filter((report) => cohortOf(report.email) === 'korea').length,
            indonesiaFound: finders.filter((report) => cohortOf(report.email) !== 'korea').length,
          }
        })
        .sort((a, b) => b.missed - a.missed),
    }
  })

  // Stages the curriculum declares but nobody has authored a subject for.
  // Named rather than left off: a Maintainer reading a list of two where the
  // programme has three cannot tell a missing subject from a missing section.
  const unauthored = content.config.stages
    .map((entry) => entry.stage)
    .filter((stage) => !subjects.some((subject) => subject.stage === stage))

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="px-1.5 pb-[26px]">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
        {/* Full ink rather than ink-2: the board is not a white card, and
            faded text is a white-card value here (DESIGN.md). */}
        <p className="mt-3 max-w-measure text-body text-ink">{copy.explanation}</p>
      </header>

      <div className="flex flex-col gap-[14px]">
        <section aria-labelledby="items" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="items" className="font-serif text-headline font-bold text-ink">
            {copy.itemsHeading}
          </h2>
          {/* Grouped by Stage, and every declared Competency is listed whether or
              not it has been authored yet. A Maintainer watching content health
              needs to see the gaps: a Stage whose Competencies simply do not
              appear looks identical to a Stage that is finished.
              The rhythm is the grouping: 22px between Stages, 14px between
              Competencies, 6px between the rows of one pool. One interval
              repeated would give thirty-two items and three Stages the same
              weight. */}
          {content.config.stages.map(({ stage, competencies }) => (
            <div key={stage} className="mt-[22px]">
              <h3 className="text-title font-bold text-ink">{copy.stage(stage)}</h3>
              {competencies.map((slug) => {
                const competency = content.competencies.find((entry) => entry.slug === slug)
                const pool = content.items[slug]
                return (
                  <div key={slug} className="mt-[14px]">
                    <h4 className="text-label font-bold text-ink">{competency?.name[lang] ?? slug}</h4>
                    {!pool || pool.length === 0 ? (
                      <p className="mt-1.5 text-body-sm text-ink-2">{copy.notAuthored}</p>
                    ) : (
                      <ul className="mt-1.5 flex flex-col gap-1.5">
                        {pool.map((item) => {
                          const stats = byItem.get(item.slug)
                          return (
                            <Row
                              key={item.slug}
                              name={item.slug}
                              value={stats ? copy.rate(stats.correct, stats.drawn) : copy.neverDrawn}
                              absent={!stats}
                            />
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </section>

        <section aria-labelledby="defects" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="defects" className="font-serif text-headline font-bold text-ink">
            {copy.defectsHeading}
          </h2>
          <p className="mt-2 max-w-measure text-body-sm text-ink-2">{copy.defectsExplanation}</p>
          {subjects.map((subject) => (
            <div key={subject.stage} className="mt-[22px]">
              <h3 className="text-title font-bold text-ink">{copy.stage(subject.stage)}</h3>
              {subject.reports === 0 ? (
                <p className="mt-1.5 text-body-sm text-ink-2">{copy.noReports}</p>
              ) : (
                // 6px held one-line rows apart; a defect is two lines now, so
                // the interval that separates entries has to beat the one that
                // binds a name to the line under it.
                <ul className="mt-[14px] flex flex-col gap-[14px]">
                  {subject.defects.map(({ defect, label, principle, missed }) => (
                    <Row
                      key={defect.slug}
                      name={label}
                      detail={<DefectDetail principle={principle} identifier={defect.element} />}
                      value={copy.missedBy(missed, subject.reports)}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
          {/* The unauthored Stages are one group, not one paragraph each: 22px
              separates them from the Stage above, 14px holds them together. */}
          {unauthored.length > 0 && (
            <div className="mt-[22px] flex flex-col gap-[14px]">
              {unauthored.map((stage) => (
                <p key={stage} className="text-body-sm text-ink-2">
                  {copy.stage(stage)} — {copy.noSubject}
                </p>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="locations" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="locations" className="font-serif text-headline font-bold text-ink">
            {copy.locationsHeading}
          </h2>
          <p className="mt-2 max-w-measure text-body-sm text-ink-2">{copy.locationsExplanation}</p>
          {subjects.map((subject) => (
            <div key={subject.stage} className="mt-[22px]">
              <h3 className="text-title font-bold text-ink">{copy.stage(subject.stage)}</h3>
              {subject.reports === 0 ? (
                <p className="mt-1.5 text-body-sm text-ink-2">{copy.noReports}</p>
              ) : (
                // A comparison of two teams over one list of defects, in the
                // two shapes that hold it. Until 2026-09-12 there was one
                // shape and it held at neither width: each defect was a stack
                // of its name and a sentence per team, in wrapping flex boxes
                // whose left edges moved with the width of the sentence beside
                // them, so nothing lined up in a column a Maintainer could read
                // down — which is the one reading a panel called a comparison
                // owes its reader.
                //
                // From `sm` it is a table, because that is what two axes are:
                // a row per defect, a column per team, `scope` tying a figure
                // to the team above it for a screen reader. Below `sm` the same
                // two axes do not fit side by side — three columns in a 233px
                // card on a 320px phone left a name 65px wide, which wrapped
                // `shipping-form` over six lines and made this panel 7191px
                // tall — so the figures move under the name instead of beside
                // it, on a two-column grid that keeps the teams aligned with
                // the heads above them. A table that scrolls sideways was tried
                // first and rejected: it cut the second team off at the card's
                // edge with nothing to say it was there, which on a comparison
                // hides exactly the half being compared.
                //
                // Both shapes are rendered and one is hidden. `hidden` takes it
                // out of the accessibility tree as well as the page, and two
                // short markups that each say what they mean beat one that
                // reflows into a shape its own semantics no longer describe.
                <>
                  {/* Narrow: the heads once, then the figures under each name. */}
                  <div className="mt-[14px] sm:hidden">
                    <div className="grid grid-cols-2 gap-x-[14px]">
                      <div>
                        <TeamCaption label={copy.korea} reports={subject.koreaReports} copy={copy} />
                      </div>
                      <div>
                        <TeamCaption
                          label={copy.indonesia}
                          reports={subject.indonesiaReports}
                          copy={copy}
                        />
                      </div>
                    </div>
                    <ul className="mt-[14px] flex flex-col gap-[22px]">
                      {subject.defects.map(({ defect, label, principle, koreaFound, indonesiaFound }) => (
                        <li key={defect.slug}>
                          <span className="block text-title font-bold text-ink [overflow-wrap:anywhere]">
                            {label}
                          </span>
                          <DefectDetail principle={principle} identifier={defect.element} />
                          {/* The team's name rides each figure for a screen
                              reader, which has no columns to read them in. */}
                          <div className="mt-1 grid grid-cols-2 gap-x-[14px]">
                            <span className={FIGURE}>
                              <span className="sr-only">{copy.korea} </span>
                              <Found found={koreaFound} reports={subject.koreaReports} copy={copy} />
                            </span>
                            <span className={FIGURE}>
                              <span className="sr-only">{copy.indonesia} </span>
                              <Found
                                found={indonesiaFound}
                                reports={subject.indonesiaReports}
                                copy={copy}
                              />
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Wide: the same data with the teams as columns. The table
                      stops at 36rem rather than running to the card's edge, and
                      its name column is the same 22rem `Row` above is capped at,
                      for the reason written there: pushed to the two ends of an
                      896px card, a name and its figure sat 506px apart and
                      invited the eye to read one row's name against the next
                      row's number. The blank space belongs outside the table,
                      not between its columns. */}
                  <table className="mt-[14px] hidden w-full table-fixed border-separate border-spacing-0 text-left sm:table sm:w-[36rem]">
                    <caption className="sr-only">
                      {copy.stage(subject.stage)} — {copy.locationsHeading}
                    </caption>
                    <colgroup>
                      <col className="w-[22rem]" />
                      <col className="w-[7rem]" />
                      <col className="w-[7rem]" />
                    </colgroup>
                    <thead>
                      <tr>
                        <td />
                        <th scope="col" className="pb-[14px] pr-[14px] text-left align-baseline last:pr-0">
                          <TeamCaption label={copy.korea} reports={subject.koreaReports} copy={copy} />
                        </th>
                        <th scope="col" className="pb-[14px] pr-[14px] text-left align-baseline last:pr-0">
                          <TeamCaption
                            label={copy.indonesia}
                            reports={subject.indonesiaReports}
                            copy={copy}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.defects.map(({ defect, label, principle, koreaFound, indonesiaFound }) => (
                        <tr key={defect.slug}>
                          <th
                            scope="row"
                            className="py-[7px] pr-[14px] text-left align-baseline font-normal [overflow-wrap:anywhere]"
                          >
                            <span className="block text-title font-bold text-ink">{label}</span>
                            <DefectDetail principle={principle} identifier={defect.element} />
                          </th>
                          <td className={`py-[7px] pr-[14px] align-baseline last:pr-0 ${FIGURE}`}>
                            <Found found={koreaFound} reports={subject.koreaReports} copy={copy} />
                          </td>
                          <td className={`py-[7px] pr-[14px] align-baseline last:pr-0 ${FIGURE}`}>
                            <Found
                              found={indonesiaFound}
                              reports={subject.indonesiaReports}
                              copy={copy}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
