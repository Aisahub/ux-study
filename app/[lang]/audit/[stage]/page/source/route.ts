import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { requireSession } from '@/lib/auth'
import { practicePageOf } from '@/lib/content'
import { practicePageCss, practicePageJs } from '@/lib/served-content'
import { content } from '@/lib/server-content'
import { isLanguage } from '@/lib/language'

/**
 * A Stage's audit subject as authored (#23): the markup, the stylesheet, and —
 * where the subject walks — the behaviour, served as plain text so the browser
 * shows them instead of running them. Linked from the post-submission reveal
 * (#24): after the defects are on the table, reading how each one was built is
 * part of the lesson, and for a Stage 2 defect the build is the behaviour, so
 * publishing the markup alone would publish none of the answer.
 *
 * Serving it earlier leaks nothing: the source carries no defect markers, which
 * the content checks prove.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const number = Number(stage)
  const subject = Number.isInteger(number) ? practicePageOf(content, number) : null
  if (!subject) notFound()

  const js = practicePageJs(number)
  const source =
    `${subject.html[lang]}\n\n/* practice-page.css */\n\n${practicePageCss(number)}` +
    (js === '' ? '' : `\n\n/* practice-page.js */\n\n${js}`)
  return new Response(source, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
