import { NavRail, type RailItem } from './nav-rail'
import { getSession } from '@/lib/auth'
import type { Language } from '@/lib/language'
import { reportFor } from '@/lib/progress'

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
  if (!session) return <div />
  const copy = COPY[lang]

  // Shared with the page's own progress read, so the row is fetched once.
  const report = await reportFor(session.email)

  const items: RailItem[] = [
    { id: 'learn', href: `/${lang}/learn`, label: copy.learn },
    { id: 'me', href: `/${lang}/me`, label: copy.me },
  ]

  if (report?.submittedAt) {
    items.push({ id: 'findings', href: `/${lang}/findings`, label: copy.findings })
  }

  if (session.isMaintainer) {
    items.push(
      { id: 'learners', href: `/${lang}/maintain/learners`, label: copy.learners },
      { id: 'content', href: `/${lang}/maintain/content`, label: copy.content },
      { id: 'allowlist', href: `/${lang}/maintain/allowlist`, label: copy.allowlist },
    )
  }

  return <NavRail items={items} />
}
