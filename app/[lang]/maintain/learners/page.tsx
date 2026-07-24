import { notFound } from 'next/navigation'

import { asc } from 'drizzle-orm'

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
    position: (passed: number, total: number) => string
    reportSubmitted: string
    lastActivity: string
    daysAgo: (days: number) => string
    today: string
    never: string
    attemptsLabel: string
    nobodyYet: string
  }
> = {
  en: {
    heading: 'Learners',
    explanation:
      'Where everyone is, and how long since they last did anything — so a stalled colleague is noticed before they quietly disappear. Nothing here ranks anyone.',
    position: (passed, total) => `${passed} of ${total} quizzes passed`,
    reportSubmitted: 'report submitted',
    lastActivity: 'last activity',
    daysAgo: (days) => (days === 1 ? '1 day ago' : `${days} days ago`),
    today: 'today',
    never: 'no activity yet',
    attemptsLabel: 'attempts',
    nobodyYet: 'No one has signed in yet. Anyone who does appears here from their first visit.',
  },
  ko: {
    heading: '학습자',
    explanation:
      '모두가 어디쯤 있고, 마지막 활동이 얼마나 지났는지입니다 — 멈춘 동료를 조용히 사라지기 전에 알아차리기 위한 화면입니다. 순위는 어디에도 없습니다.',
    position: (passed, total) => `퀴즈 ${total}개 중 ${passed}개 통과`,
    reportSubmitted: '보고서 제출',
    lastActivity: '마지막 활동',
    daysAgo: (days) => `${days}일 전`,
    today: '오늘',
    never: '아직 활동 없음',
    attemptsLabel: '시도',
    nobodyYet: '아직 아무도 로그인하지 않았습니다. 로그인한 사람은 첫 방문부터 여기에 나타납니다.',
  },
}

/**
 * The people half of the Maintainer dashboard (#27): position, inactivity,
 * attempts per Competency — across everyone, ordered by address so the order
 * carries no judgement. Maintainer flag only, enforced before the first
 * query.
 */
export default async function Learners({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireMaintainer(lang)
  const copy = COPY[lang]
  const slugs = content.config.stage1Competencies

  const users = await db.select().from(schema.users).orderBy(asc(schema.users.email))
  const attempts = await db.select().from(schema.attempts)
  const reports = await db.select().from(schema.reports)

  const now = Date.now()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.heading}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{copy.explanation}</p>

      {users.length === 0 ? (
        // A cohort that has not arrived yet looks exactly like a broken page
        // unless the page says which it is. Reachable on a freshly deployed
        // branch, before the first sign-in writes the first row.
        <p className="text-sm text-zinc-500">{copy.nobodyYet}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => {
            const own = attempts.filter((attempt) => attempt.email === user.email)
            const report = reports.find((entry) => entry.email === user.email)
            const passed = slugs.filter((slug) =>
              own.some((attempt) => attempt.competency === slug && attempt.passed === true),
            ).length

            const timestamps = [
              ...own.map((attempt) => attempt.submittedAt ?? attempt.createdAt),
              ...(report ? [report.submittedAt ?? report.createdAt] : []),
            ].map((date) => date.getTime())
            const last = timestamps.length > 0 ? Math.max(...timestamps) : null
            const days = last === null ? null : Math.floor((now - last) / (24 * 60 * 60 * 1000))

            return (
              <li key={user.email} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium">{user.email}</span>
                  <span className="text-zinc-500">
                    {copy.lastActivity}:{' '}
                    {days === null ? copy.never : days === 0 ? copy.today : copy.daysAgo(days)}
                  </span>
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {copy.position(passed, slugs.length)}
                  {report?.submittedAt && <> · {copy.reportSubmitted}</>}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {copy.attemptsLabel}:{' '}
                  {slugs
                    .map((slug) => {
                      const n = own.filter((attempt) => attempt.competency === slug).length
                      return `${content.competencies.find((c) => c.slug === slug)!.name[lang]} ${n}`
                    })
                    .join(' · ')}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
