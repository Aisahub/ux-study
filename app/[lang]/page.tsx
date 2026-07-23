import { notFound, redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import { isLanguage } from '@/lib/language'

export const dynamic = 'force-dynamic'

/**
 * The front door. It holds no content of its own: a Learner who arrives here
 * wants either to get in or to get on, so it sends them to the sign-in or to
 * the Stage 1 overview and stays out of the way.
 *
 * It replaces the placeholder that stood here from #3, whose visible proof
 * that the database was reachable — an allowlist row count — was a developer's
 * diagnostic that a Learner had no use for. That proof now comes from every
 * surface in the suite, each of which can only render what it read.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()

  redirect((await getSession()) ? `/${lang}/learn` : `/${lang}/signin`)
}
