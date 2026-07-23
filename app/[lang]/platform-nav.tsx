import Link from 'next/link'

import { eq } from 'drizzle-orm'

import { db, schema } from '@/db'
import { getSession } from '@/lib/auth'
import type { Language } from '@/lib/language'

const COPY: Record<
  Language,
  { learn: string; me: string; findings: string; learners: string; content: string; allowlist: string }
> = {
  en: {
    learn: 'Learn',
    me: 'My progress',
    findings: 'Findings',
    learners: 'Learners',
    content: 'Content',
    allowlist: 'Allowlist',
  },
  ko: {
    learn: '학습',
    me: '나의 진행',
    findings: 'Finding',
    learners: '학습자',
    content: '콘텐츠',
    allowlist: '허용 목록',
  },
}

/**
 * The links between the platform's surfaces.
 *
 * Without these each page is an island: a Learner who lands on the overview
 * can go deeper into a Competency and nowhere else — not to their own
 * progress, and so not to the sign-out that lives there.
 *
 * Two surfaces are deliberately absent. The Self-Audit Report has no
 * navigation slot of its own (#20) — it is the end of Stage 1, reached from
 * the bottom of the overview, not a fifth subject. And the Findings library
 * appears only once the reader has submitted their own report, because before
 * that it is an answer key (#25).
 *
 * Labels match the headings of the pages they lead to, rather than being
 * shortened for the bar — the platform should not fail the Consistency
 * lesson it teaches.
 */
export async function PlatformNav({ lang }: { lang: Language }) {
  const session = await getSession()
  // Signed out: the sign-in and not-enrolled pages have nowhere to go yet.
  if (!session) return null
  const copy = COPY[lang]

  const [report] = await db
    .select({ submittedAt: schema.reports.submittedAt })
    .from(schema.reports)
    .where(eq(schema.reports.email, session.email))

  const link = 'text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100'

  return (
    <nav className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
      <Link href={`/${lang}/learn`} className={link}>
        {copy.learn}
      </Link>
      <Link href={`/${lang}/me`} className={link}>
        {copy.me}
      </Link>
      {report?.submittedAt && (
        <Link href={`/${lang}/findings`} className={link}>
          {copy.findings}
        </Link>
      )}
      {session.isMaintainer && (
        <>
          <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
            |
          </span>
          <Link href={`/${lang}/maintain/learners`} className={link}>
            {copy.learners}
          </Link>
          <Link href={`/${lang}/maintain/content`} className={link}>
            {copy.content}
          </Link>
          <Link href={`/${lang}/maintain/allowlist`} className={link}>
            {copy.allowlist}
          </Link>
        </>
      )}
    </nav>
  )
}
