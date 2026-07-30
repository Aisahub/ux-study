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
    noReports: string
  }
> = {
  en: {
    heading: 'Content health',
    explanation:
      'An item everyone fails is far more likely a badly-worded item than four badly-prepared Learners. Every figure is a projection over attempts and reports — nothing is stored separately.',
    itemsHeading: 'Item pass rates',
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
    noReports: 'No submitted reports yet.',
  },
  ko: {
    heading: '콘텐츠 상태',
    explanation:
      '모두가 틀리는 문항은 준비가 부족한 학습자 넷보다, 잘못 쓰인 문항일 가능성이 훨씬 큽니다. 모든 수치는 시도와 보고서 기록에서 그때그때 계산됩니다 — 따로 저장되는 것은 없습니다.',
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
    noReports: '제출된 보고서가 아직 없습니다.',
  },
}

/**
 * The content half of the Maintainer dashboard (#28). Pass rates are per
 * item, with the draw count beside every rate so three draws never look
 * settled (ADR-0006); the location panel is the controlled comparison the
 * shared Practice Page makes possible.
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-8 font-sans">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{copy.explanation}</p>
      </header>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.itemsHeading}</h2>
        {/* Grouped by Stage, and every declared Competency is listed whether or
            not it has been authored yet. A Maintainer watching content health
            needs to see the gaps: a Stage whose Competencies simply do not
            appear looks identical to a Stage that is finished. */}
        {content.config.stages.map(({ stage, competencies }) => (
          <div key={stage} className="mt-4">
            <h3 className="text-sm font-semibold">{copy.stage(stage)}</h3>
            {competencies.map((slug) => {
              const competency = content.competencies.find((entry) => entry.slug === slug)
              const pool = content.items[slug]
              return (
                <div key={slug} className="mt-3 pl-3">
                  <h4 className="text-sm font-medium">{competency?.name[lang] ?? slug}</h4>
                  {!pool || pool.length === 0 ? (
                    <p className="mt-1 text-sm text-zinc-500">{copy.notAuthored}</p>
                  ) : (
                    <ul className="mt-1 flex flex-col gap-1 text-sm">
                      {pool.map((item) => {
                        const stats = byItem.get(item.slug)
                        return (
                          <li key={item.slug} className="flex justify-between gap-4">
                            <span className="truncate font-mono text-xs">{item.slug}</span>
                            <span className="shrink-0 text-zinc-500">
                              {stats ? copy.rate(stats.correct, stats.drawn) : copy.neverDrawn}
                            </span>
                          </li>
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

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.defectsHeading}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.defectsExplanation}</p>
        {subjects.map((subject) => (
          <div key={subject.stage} className="mt-3">
            <h3 className="text-xs font-medium text-zinc-500">{copy.stage(subject.stage)}</h3>
            {subject.reports === 0 ? (
              <p className="mt-1 text-sm text-zinc-500">{copy.noReports}</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1 text-sm">
                {subject.defects.map(({ defect, missed }) => (
                  <li key={defect.slug} className="flex justify-between gap-4">
                    <span className="font-mono text-xs">{defect.element}</span>
                    <span className="shrink-0 text-zinc-500">{copy.missedBy(missed, subject.reports)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {unauthored.map((stage) => (
          <p key={stage} className="mt-3 text-sm text-zinc-500">
            {copy.stage(stage)} — {copy.noSubject}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.locationsHeading}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.locationsExplanation}</p>
        {subjects.map((subject) => (
          <div key={subject.stage} className="mt-3">
            <h3 className="text-xs font-medium text-zinc-500">{copy.stage(subject.stage)}</h3>
            {subject.reports === 0 ? (
              <p className="mt-1 text-sm text-zinc-500">{copy.noReports}</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-2 text-sm">
                {subject.defects.map(({ defect, koreaFound, indonesiaFound }) => (
                  <li key={defect.slug}>
                    <p className="font-mono text-xs">{defect.element}</p>
                    <p className="text-zinc-500">
                      {copy.korea}: {copy.foundBy(koreaFound, subject.koreaReports)} · {copy.indonesia}:{' '}
                      {copy.foundBy(indonesiaFound, subject.indonesiaReports)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
