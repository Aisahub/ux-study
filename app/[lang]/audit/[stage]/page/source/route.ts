import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { requireSession } from '@/lib/auth'
import { practicePage, practicePageCss } from '@/lib/server-content'
import { isLanguage } from '@/lib/language'

/**
 * A Stage's Practice Page source, as authored (#23): the markup followed by
 * the stylesheet, served as plain text so the browser shows it instead of
 * rendering it. Linked from the post-submission reveal (#24) — after the
 * defects are on the table, reading how each one was built is part of the
 * lesson. Serving it earlier leaks nothing: the source carries no defect
 * markers, which the content checks prove.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const number = Number(stage)
  const subject = Number.isInteger(number) ? practicePage(number) : null
  if (!subject) notFound()

  const source = `${subject.html[lang]}\n\n/* practice-page.css */\n\n${practicePageCss(number)}`
  return new Response(source, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
