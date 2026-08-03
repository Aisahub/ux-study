import { notFound } from 'next/navigation'

import { isNotNull } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireMaintainer } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
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
    foundBy: (found: number, of: number) => string
    noReportsHere: string
    noReports: string
  }
> = {
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
    foundBy: (found, of) => `${found} of ${of} found`,
    noReportsHere: 'no reports yet',
    noReports: 'No submitted reports yet.',
  },
  ko: {
    heading: '콘텐츠 상태',
    explanation:
      '모두가 틀리는 문항은, 다 함께 준비가 부족했던 것보다 잘못 쓰인 문항일 가능성이 훨씬 큽니다. 모든 수치는 이 페이지를 열 때 시도와 보고서 기록에서 계산됩니다 — 따로 저장되는 것은 없습니다.',
    itemsHeading: '문항별 정답률',
    stage: (n) => `${n}단계`,
    notAuthored: '아직 작성된 문항 풀이 없습니다',
    noSubject: '아직 감사할 페이지가 작성되지 않았습니다',
    rate: (correct, drawn) => `${drawn}회 출제 중 ${correct}회 정답`,
    neverDrawn: '아직 출제되지 않음',
    defectsHeading: '심어 둔 결함, 많이 놓친 순',
    defectsExplanation: '제출된 보고서 기준: 각 결함을 몇 명이 놓쳤는지입니다.',
    missedBy: (missed, of) => `${of}명 중 ${missed}명이 놓침`,
    locationsHeading: '두 거점, 같은 페이지',
    locationsExplanation:
      '두 코호트가 완전히 같은 페이지를 감사하므로, 발견의 차이는 통제된 비교가 됩니다. Workspace 주소는 한국, 개인 주소는 인도네시아 코호트입니다.',
    korea: '한국',
    indonesia: '인도네시아',
    foundBy: (found, of) => `${of}명 중 ${found}명 발견`,
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
function Row({ name, value, absent }: { name: string; value: string; absent?: boolean }) {
  return (
    <li className="grid gap-x-[14px] sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-baseline">
      <span className="min-w-0 text-body-sm text-ink [overflow-wrap:anywhere]">{name}</span>
      <span className={absent ? 'text-body-sm text-ink-2' : 'text-label font-bold text-ink'}>
        {value}
      </span>
    </li>
  )
}

/** One cohort's result for one defect, or the fact that it has no reports to speak for it. */
function Cohort({ label, value, absent }: { label: string; value: string; absent: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-body-sm text-ink-2">{label}</dt>
      <dd className={absent ? 'text-body-sm text-ink-2' : 'text-label font-bold text-ink'}>
        {value}
      </dd>
    </div>
  )
}

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
  const isKorea = (email: string) => email.endsWith('@aisahub.com')

  // One shelf of statistics per authored subject (#61). A defect is only
  // missed by someone who was looking at the page it is on, so every count
  // here divides by that Stage's reports and not by all of them — pooling the
  // Stages would report a Stage 2 defect as missed by every Stage 1 Learner
  // who never saw it.
  const subjects = content.practicePages.map((page) => {
    const stageReports = reports.filter((report) => report.stage === page.stage)
    const korea = stageReports.filter((report) => isKorea(report.email)).length

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
            found: finders.length,
            missed: stageReports.length - finders.length,
            koreaFound: finders.filter((report) => isKorea(report.email)).length,
            indonesiaFound: finders.filter((report) => !isKorea(report.email)).length,
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
                <ul className="mt-1.5 flex flex-col gap-1.5">
                  {subject.defects.map(({ defect, missed }) => (
                    <Row
                      key={defect.slug}
                      name={defect.element}
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
              {/* 22px between defects, 4px between a defect and its two cohort
                  lines: each entry here is three lines, so the interval that
                  separates entries has to beat the one that binds them. */}
              {subject.reports === 0 ? (
                <p className="mt-1.5 text-body-sm text-ink-2">{copy.noReports}</p>
              ) : (
                <ul className="mt-1.5 flex flex-col gap-[22px]">
                  {subject.defects.map(({ defect, koreaFound, indonesiaFound }) => (
                    <li key={defect.slug}>
                      <p className="text-body-sm text-ink [overflow-wrap:anywhere]">{defect.element}</p>
                      {/* A cohort with no reports for this Stage says so
                          instead of rendering `0 of 0 found`. A panel that
                          calls itself a controlled comparison may not report
                          an absent cohort as a finding of zero — the two
                          readings ask a Maintainer for opposite actions. */}
                      <dl className="mt-1 flex flex-wrap gap-x-[22px] gap-y-1">
                        <Cohort
                          label={copy.korea}
                          absent={subject.koreaReports === 0}
                          value={
                            subject.koreaReports === 0
                              ? copy.noReportsHere
                              : copy.foundBy(koreaFound, subject.koreaReports)
                          }
                        />
                        <Cohort
                          label={copy.indonesia}
                          absent={subject.indonesiaReports === 0}
                          value={
                            subject.indonesiaReports === 0
                              ? copy.noReportsHere
                              : copy.foundBy(indonesiaFound, subject.indonesiaReports)
                          }
                        />
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
