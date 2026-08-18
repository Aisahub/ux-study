import { NavRail, type RailItem } from './nav-rail'
import { getSession } from '@/lib/auth'
import { earnedStages } from '@/lib/findings'
import type { Language } from '@/lib/language'

const COPY: Record<
  Language,
  { learn: string; me: string; findings: string; learners: string; content: string; allowlist: string }
> = {
  en: {
    learn: 'Learn',
    me: 'My page',
    findings: 'Findings',
    learners: 'Learners',
    content: 'Content health',
    allowlist: 'Allowlist',
  },
  ko: {
    learn: '학습',
    me: '마이페이지',
    findings: '발견',
    learners: '학습자',
    content: '콘텐츠 상태',
    allowlist: '허용 목록',
  },
}

/**
 * The links between the platform's surfaces.
 *
 * Without these each page is an island: a Learner who lands on the overview
 * can go deeper into a Competency and nowhere else — not to their own
 * progress, and not back out to the rest of the platform.
 *
 * Signing out is not one of these items. It is not a place, so it is not a
 * link; it sits at the foot of the rail as its own control (see nav-rail).
 * Until 2026-07-29 it lived on My page and nowhere else, which made reaching
 * that page the only way to leave.
 *
 * That page was called My progress until the same day. It was renamed because
 * the name was the duplication: it promised the sentence this overview already
 * says — every Competency's status, its attempt count, the Stage total — and
 * so restated all of it. Progress is Learn's to say; My page holds the account
 * and the attempt history (#54).
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
 *
 * The Findings library is the one item that cannot, and the reason is
 * recorded here rather than left to be re-decided: its heading is a sentence.
 * `What colleagues found` wants three lines in a bottom-bar slot that holds
 * two — 57px wide at 375px with six marks. Korean's `동료들이 찾아낸 것` would
 * fit in its two, but a label that works in only one of the two scripts is
 * what the Two-Script Rule refuses, so neither language takes the heading.
 * Both name the record instead: `Findings`, and 발견 — the spelling CONTEXT.md
 * fixes for Korean copy, and the one the drawer a Learner writes into already
 * uses. This slot said the English `Finding` until 2026-08-14, on every
 * Korean page, for as long as the rail has existed.
 */
export async function PlatformNav({ lang }: { lang: Language }) {
  const session = await getSession()
  // Signed out: the sign-in and not-enrolled pages have nowhere to go yet.
  if (!session) return <div />
  const copy = COPY[lang]

  // Shared with the page's own progress read, so the rows are fetched once.
  const earned = await earnedStages(session.email)

  const items: RailItem[] = [
    { id: 'learn', href: `/${lang}/learn`, label: copy.learn },
    { id: 'me', href: `/${lang}/me`, label: copy.me },
  ]

  // Any submitted report opens the library — it then shows that Stage's shelf
  // and no other. The link is a door to what they have earned, so the check
  // for what that is belongs behind it, not here.
  if (earned.length > 0) {
    items.push({ id: 'findings', href: `/${lang}/findings`, label: copy.findings })
  }

  if (session.isMaintainer) {
    items.push(
      { id: 'learners', href: `/${lang}/maintain/learners`, label: copy.learners },
      { id: 'content', href: `/${lang}/maintain/content`, label: copy.content },
      { id: 'allowlist', href: `/${lang}/maintain/allowlist`, label: copy.allowlist },
    )
  }

  return <NavRail items={items} lang={lang} />
}
