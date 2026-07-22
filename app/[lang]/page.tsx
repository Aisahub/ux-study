import { sql } from 'drizzle-orm'

import { db, schema } from '@/db'
import { isLanguage, type Language } from '@/lib/language'

// Read on every request. This page exists to prove the path is live, and a
// cached answer would prove nothing.
export const dynamic = 'force-dynamic'

// Interface copy has no home in the content model yet — that model holds what a
// Learner studies, not what the application says about itself. The Learn
// overview (#20) is the first surface with enough copy to need one.
const COPY: Record<Language, { description: string; entries: string }> = {
  en: {
    description: 'An internal UX learning platform for Aisahub staff in Korea and Indonesia.',
    entries: 'allowlist entries',
  },
  ko: {
    description: 'Aisahub 한국·인도네시아 구성원을 위한 사내 UX 학습 플랫폼입니다.',
    entries: '허용 목록 항목',
  },
}

/**
 * A placeholder front page, now one per language. The Learn overview (#20)
 * replaces it with the four Competencies and where the Learner stands.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  // The layout has already turned an unpublished language into a 404; this
  // narrows the type rather than re-deciding it.
  const copy = COPY[isLanguage(lang) ? lang : 'en']

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.allowlist)

  return (
    // flex-1 rather than a full-height minimum: the switcher now sits above
    // this, so claiming the whole viewport would push the page past it and
    // lose the centring.
    <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center gap-3 p-16 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">ux-study</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{copy.description}</p>
      <p className="text-sm text-zinc-500">
        {copy.entries}: {count}
      </p>
    </main>
  )
}
