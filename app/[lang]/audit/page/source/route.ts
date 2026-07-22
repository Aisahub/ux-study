import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { requireSession } from '@/lib/auth'
import { content, practicePageCss } from '@/lib/server-content'
import { isLanguage } from '@/lib/language'

/**
 * The Practice Page's source, as authored (#23): the markup followed by the
 * stylesheet, served as plain text so the browser shows it instead of
 * rendering it. Linked from the post-submission reveal (#24) — after the
 * defects are on the table, reading how each one was built is part of the
 * lesson. Serving it earlier leaks nothing: the source carries no defect
 * markers, which the content checks prove.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const source = `${content.practicePage.html[lang]}\n\n/* practice-page.css */\n\n${practicePageCss}`
  return new Response(source, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
