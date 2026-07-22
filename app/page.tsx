import { sql } from 'drizzle-orm'

import { db, schema } from '@/db'

// Read on every request. This page exists to prove the path is live, and a
// cached answer would prove nothing.
export const dynamic = 'force-dynamic'

/**
 * A placeholder front page. ADR-0008 replaces it with a guess at the reader's
 * language and a redirect to /ko or /en.
 */
export default async function Home() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.allowlist)

  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-3 p-16 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">ux-study</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        An internal UX learning platform for Aisahub staff in Korea and Indonesia.
      </p>
      <p className="text-sm text-zinc-500">allowlist entries: {count}</p>
    </main>
  )
}
