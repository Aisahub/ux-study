import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { requireSession } from '@/lib/auth'
import { isLanguage, type Language } from '@/lib/language'
import { attemptHistoryFor, reportsFor } from '@/lib/progress'
import { content } from '@/lib/server-content'

export const dynamic = 'force-dynamic'

const COPY: Record<
  Language,
  {
    heading: string
    account: string
    signedInAs: string
    roleLabel: string
    role: Record<'learner' | 'maintainer', string>
    languagePreference: string
    languageName: Record<Language, string>
    report: string
    reportSubmitted: (date: string) => string
    reportDraft: string
    reportNone: string
    attempts: string
    attemptsNone: string
    scoreLabel: string
  }
> = {
  en: {
    heading: 'My page',
    account: 'Account',
    signedInAs: 'Signed in as',
    roleLabel: 'Role',
    role: { learner: 'Learner', maintainer: 'Maintainer' },
    languagePreference: 'Working language',
    languageName: { en: 'English', ko: 'Korean' },
    report: 'Self-Audit Report',
    reportSubmitted: (date) => `Submitted ${date}`,
    reportDraft: 'Draft in progress',
    reportNone: 'Not started',
    attempts: 'Attempts',
    attemptsNone: 'No finished attempts yet.',
    scoreLabel: 'Score',
  },
  ko: {
    heading: '마이페이지',
    account: '계정',
    signedInAs: '로그인 계정',
    roleLabel: '역할',
    role: { learner: '학습자', maintainer: '운영자' },
    languagePreference: '사용 언어',
    languageName: { en: '영어', ko: '한국어' },
    report: '자가 점검 리포트',
    reportSubmitted: (date) => `${date} 제출`,
    reportDraft: '작성 중',
    reportNone: '시작 전',
    attempts: '시도 기록',
    attemptsNone: '아직 완료한 시도가 없습니다.',
    scoreLabel: '점수',
  },
}

/**
 * A label above a fact, in the pattern the account card repeats three times.
 *
 * The value wraps and is never truncated. An address is the fact this card
 * exists to state — it is written nowhere else in the interface since the
 * phone top bar became the avatar alone — and `review-ee968acc@ai…` states
 * nothing. `anywhere` rather than a word break because an email has no spaces
 * to break at, so the normal rule would leave it overflowing instead.
 */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-label font-bold text-ink-2">{label}</dt>
      <dd className="mt-1 text-body text-ink [overflow-wrap:anywhere]">{children}</dd>
    </div>
  )
}

/**
 * My page: who this Learner is, and what they have actually done.
 *
 * It deliberately does **not** say where they stand. The Learn overview
 * already carries every Competency's status, its attempt count and the Stage
 * total, from the same copy; until 2026-07-29 this page restated all of it and
 * added only two facts of its own, which is why it was renamed from My
 * progress and re-scoped rather than expanded (#54).
 *
 * What is left is the half Learn has no room for. Learn counts the attempts;
 * this names them — which Competency, which day, what it scored. And since the
 * phone top bar became the avatar alone (#53), the address and the role are
 * written nowhere else in the interface.
 *
 * This Learner and nobody else (#26): every row read here is filtered by the
 * session's own address, so no colleague's record is reachable from this page
 * or from anything it reads. Nothing totals them across Competencies either —
 * PRODUCT.md forbids a cumulative per-person score, and a page about one
 * person is exactly where such a total would otherwise appear.
 */
export default async function Me({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  const copy = COPY[lang]

  const history = await attemptHistoryFor(session.email)
  // Shared with the navigation's own read, which asks the same question on
  // every request; `reportsFor` is cached so the table is read once.
  //
  // The furthest report a Learner has, which is the one they are living in:
  // a Stage 2 draft is the answer for someone who submitted Stage 1 months
  // ago. Deliberately one line and not a tally of all three — a per-person
  // total across the programme is what PRODUCT.md rules out, and a column of
  // Stages with ticks against them is that total wearing a list (#61).
  const report = (await reportsFor(session.email)).at(-1) ?? null
  // The language preference as saved: the path cookie is this device's, the
  // users row is what a new device inherits at sign-in (#12).
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, session.email))
  const preference: Language = isLanguage(user?.language) ? user.language : lang

  const nameOf = (slug: string) =>
    content.competencies.find((competency) => competency.slug === slug)?.name[lang] ?? slug

  const reportState = report?.submittedAt
    ? copy.reportSubmitted(report.submittedAt.toISOString().slice(0, 10))
    : report
      ? copy.reportDraft
      : copy.reportNone

  return (
    <main className="mx-auto w-full max-w-4xl px-0.5">
      <header className="px-1.5 pb-[26px]">
        <h1 className="font-serif text-display font-bold text-ink">{copy.heading}</h1>
      </header>

      <div className="flex flex-col gap-[14px]">
        <section
          aria-labelledby="account"
          className="rounded-card bg-surface p-[26px] shadow-card"
        >
          <h2 id="account" className="sr-only">
            {copy.account}
          </h2>
          {/* The address column takes the extra width rather than sharing it
              equally: it is the only one of the three whose content is not a
              short fixed word, and at equal thirds it was the only one that
              had to wrap. */}
          <dl className="grid items-start gap-[22px] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Fact label={copy.signedInAs}>{session.email}</Fact>
            <Fact label={copy.roleLabel}>
              {session.isMaintainer ? copy.role.maintainer : copy.role.learner}
            </Fact>
            <Fact label={copy.languagePreference}>{copy.languageName[preference]}</Fact>
          </dl>
        </section>

        <section
          aria-labelledby="report"
          className="flex flex-wrap items-baseline justify-between gap-x-[22px] gap-y-1 rounded-card bg-surface p-[26px] shadow-card"
        >
          <h2 id="report" className="text-title font-bold text-ink">
            {copy.report}
          </h2>
          <p className="text-label font-bold text-ink-2">{reportState}</p>
        </section>

        <section aria-labelledby="attempts" className="rounded-card bg-surface p-[26px] shadow-card">
          <h2 id="attempts" className="text-title font-bold text-ink">
            {copy.attempts}
          </h2>

          {history.length === 0 ? (
            <p className="mt-[14px] text-body-sm text-ink-2">{copy.attemptsNone}</p>
          ) : (
            /* Newest first, and no verdict anywhere on the row. Whether an
               attempt passed is a status, and status is Learn's sentence to
               say; scored in ink rather than oxblood or green keeps this a
               record of what happened rather than a second place the platform
               judges. */
            <ol className="mt-[14px] flex flex-col gap-[14px]">
              {history.map((attempt) => (
                <li
                  key={attempt.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[14px]"
                >
                  <span className="min-w-0 text-title font-bold text-ink">
                    {nameOf(attempt.competency)}
                  </span>
                  <span className="text-label font-bold text-ink">
                    <span className="sr-only">{copy.scoreLabel} </span>
                    {attempt.score} / {attempt.drawn}
                  </span>
                  <span className="col-start-1 text-body-sm text-ink-2">
                    {attempt.submittedAt.toISOString().slice(0, 10)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  )
}
