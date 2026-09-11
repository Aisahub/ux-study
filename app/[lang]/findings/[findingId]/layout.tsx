import { notFound, redirect } from 'next/navigation'

import { requireSession } from '@/lib/auth'
import { mayRead, submittedFinding } from '@/lib/findings'
import { isLanguage } from '@/lib/language'

/**
 * One Finding's gate, asked above the loading boundary — the same reason as
 * the segment above (ERR-236), for the question the segment above cannot
 * ask: whether *this* Finding's Stage has been earned. Reaching a Stage 2
 * Finding by its address is the route a Learner mid-way through Stage 2
 * would take to read its answer key (#61), and that refusal has to survive
 * as a status code, not only as an instruction streamed into a 200.
 */
export default async function FindingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string; findingId: string }>
}) {
  const { lang, findingId } = await params
  if (!isLanguage(lang)) notFound()
  const id = Number.parseInt(findingId, 10)
  if (!Number.isInteger(id)) notFound()
  const session = await requireSession(lang)

  const row = await submittedFinding(id)
  if (!row) notFound()
  if (!(await mayRead(session.email, row.stage))) redirect(`/${lang}/audit`)
  return children
}
