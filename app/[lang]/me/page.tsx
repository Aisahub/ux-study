import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { isComplete, progressFor } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    signedInAs: string
    languagePreference: string
    languageName: Record<Language, string>
    competencies: string
    status: Record<'unstarted' | 'in-progress' | 'passed', string>
    attempts: (n: number) => string
    report: string
    reportSubmitted: (date: string) => string
    reportDraft: string
    reportNone: string
    complete: string
  }
> = {
  en: {
    heading: 'My progress',
    signedInAs: 'Signed in as',
    languagePreference: 'Working language',
    languageName: { en: 'English', ko: 'Korean' },
    competencies: 'Competencies',
    status: { unstarted: 'Not started', 'in-progress': 'In progress', passed: 'Passed' },
    attempts: (n) => (n === 1 ? '1 attempt' : `${n} attempts`),
    report: 'Self-Audit Report',
    reportSubmitted: (date) => `Submitted ${date}`,
    reportDraft: 'Draft in progress',
    reportNone: 'Not started',
    complete: 'Stage 1 complete',
  },
  ko: {
    heading: '나의 진행',
    signedInAs: '로그인 계정',
    languagePreference: '사용 언어',
    languageName: { en: '영어', ko: '한국어' },
    competencies: '역량',
    status: { unstarted: '시작 전', 'in-progress': '진행 중', passed: '통과' },
    attempts: (n) => `${n}회 시도`,
    report: '셀프 감사 보고서',
    reportSubmitted: (date) => `${date} 제출`,
    reportDraft: '작성 중',
    reportNone: '시작 전',
    complete: '1단계 수료',
  },
}

/**
 * This Learner, and nobody else (#26): everything on this page is derived
 * from their own attempt and report rows on every request, and the queries
 * are filtered by the session's address — no other Learner's progress is
 * reachable from here or from anything this page reads.
 */
export default async function Me({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const progress = await progressFor(session.email)
  const [report] = await db.select().from(schema.reports).where(eq(schema.reports.email, session.email))
  // The language preference as saved: the path cookie is this device's, the
  // users row is what a new device inherits at sign-in (#12).
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, session.email))
  const preference: Language = isLanguage(user?.language) ? user.language : lang

  const competencies = content.config.stage1Competencies.map(
    (slug) => content.competencies.find((competency) => competency.slug === slug)!,
  )

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {copy.signedInAs} {session.email} · {copy.languagePreference}: {copy.languageName[preference]}
      </p>

      <section>
        <h2 className="text-sm font-medium text-zinc-500">{copy.competencies}</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {competencies.map((competency) => {
            const quiz = progress.quizzes[competency.slug]
            return (
              <li key={competency.slug} className="flex items-baseline justify-between rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <span>{competency.name[lang]}</span>
                <span className="text-zinc-500">
                  <span className={quiz.status === 'passed' ? 'text-green-700 dark:text-green-400' : ''}>
                    {copy.status[quiz.status]}
                  </span>
                  {quiz.attempts > 0 && <> · {copy.attempts(quiz.attempts)}</>}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
        <span className="font-medium">{copy.report}</span>
        <span className="ml-2 text-zinc-500">
          {report?.submittedAt
            ? copy.reportSubmitted(report.submittedAt.toISOString().slice(0, 10))
            : report
              ? copy.reportDraft
              : copy.reportNone}
        </span>
      </section>

      {isComplete(progress) && (
        <p className="text-sm font-medium text-green-700 dark:text-green-400">{copy.complete}</p>
      )}
    </main>
  )
}
