import { notFound, redirect } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { earnedStages } from '@/lib/findings'
import { isLanguage } from '@/lib/language'

/**
 * The library's gate, asked above the loading boundary (ERR-236).
 *
 * The findings routes carry a `loading.tsx`, and a pending shell that has
 * started streaming has already fixed the status at 200 — a `redirect()`
 * inside the page arrives as an in-band instruction, not as an HTTP 307. For
 * a browser the two are the same journey; for everything that reads the
 * status line — the test suite's gate assertions, a curl, a crawler — the
 * refusal had disappeared. A layout stands above the boundary, so the same
 * questions asked here still answer with a real redirect.
 *
 * The page asks them again. That is deliberate, not forgetfulness: layouts
 * and pages render in parallel, and the conditions are the findings
 * module's either way (#131) — this layer only changes *when* the answer
 * can still become a status code.
 */
export default async function FindingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  const session = await requireSession(lang)
  if ((await earnedStages(session.email)).length === 0) redirect(`/${lang}/audit`)
  return children
}
