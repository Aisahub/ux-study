import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { requireSession } from '@/lib/auth'
import { practicePageOf } from '@/lib/content'
import { practicePageCss, practicePageJs } from '@/lib/served-content'
import { content } from '@/lib/server-content'
import { isLanguage } from '@/lib/language'

/**
 * A Stage's audit subject, served whole (#23). A route handler rather than a
 * React page, so the response is exactly the authored document: no navigation,
 * no logo, no sidebar can appear inside its bounds because nothing of the
 * platform is in the response at all. A Learner asked to find what is wrong
 * with this page must never be able to report our own chrome.
 *
 * Three things are added at serve time, none visible as content: the stylesheet
 * and — where the subject walks — its behaviour are inlined (the authored
 * relative paths would not survive this route's URL shape), and a small script
 * makes every identified element selectable. A Finding names its element by
 * pointing at it (ADR-0008), and the selection is reported to the surrounding
 * audit surface (#24) via postMessage.
 */

/**
 * Clicking is two jobs on a walkable subject, and ADR-0010 splits them into
 * two named modes the subject itself carries. This script is the Select half.
 *
 * A subject that declares a mode is operable, and a click only names an element
 * while that subject says it is selecting; in Operate mode the click is left
 * alone and the flow answers it. A subject that declares no mode is inert, as
 * Stage 1's Practice Page has always been, and every click on it selects.
 *
 * Selecting stops the click rather than merely preventing its default, because
 * on an operable subject preventing the default still leaves the flow's own
 * listeners to run, and a Learner pointing at a control would silently operate
 * it. The audit tools are excluded from both: they are never selectable and
 * they always work, whichever mode is on.
 */
const SELECTION_SCRIPT = `<script>
document.addEventListener('click', function (event) {
  if (event.target.closest('[data-audit-chrome]')) return
  var mode = document.body.getAttribute('data-audit-mode')
  if (mode !== null && mode !== 'select') return
  var element = event.target.closest('[data-element]')
  event.preventDefault()
  event.stopPropagation()
  if (!element) return
  var previous = document.querySelector('[data-selected]')
  if (previous && previous !== element) previous.removeAttribute('data-selected')
  element.toggleAttribute('data-selected')
  parent.postMessage(
    {
      type: 'element-selected',
      element: element.hasAttribute('data-selected') ? element.getAttribute('data-element') : null,
    },
    '*',
  )
}, true)
</script>
<style>
[data-element] { cursor: pointer; }
body[data-audit-mode='operate'] [data-element] { cursor: auto; }
[data-selected] { outline: 3px solid #2563eb; outline-offset: 2px; }
</style>`

/**
 * The same subject with nothing to point at, for a reader who is checking a
 * claim about it rather than auditing it (#120).
 *
 * The specimen Self-Audit Report sends a reader here to see whether a Finding
 * is true of the real element. Served the auditing way, every element would
 * carry a pointer cursor and take a selection outline, and the selection would
 * be posted to a surrounding surface that is not there — a control that
 * answers a press by doing nothing, which is the defect this platform's fourth
 * Competency is about. Withholding the script is how it stops being one.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const selectable = !request.nextUrl.searchParams.has('read')

  const number = Number(stage)
  const subject = Number.isInteger(number) ? practicePageOf(content, number) : null
  // A Stage with no authored subject has no document to serve. The surface
  // around this frame is where that is said in words; a route that can only
  // answer in HTML says not-found rather than returning a blank page.
  if (!subject) notFound()

  const document = subject.html[lang]
    .replace('<link rel="stylesheet" href="./practice-page.css">', `<style>\n${practicePageCss(number)}</style>`)
    .replace('<script src="./practice-page.js"></script>', `<script>\n${practicePageJs(number)}</script>`)
    .replace('</body>', selectable ? `${SELECTION_SCRIPT}\n</body>` : '</body>')

  return new Response(document, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}
