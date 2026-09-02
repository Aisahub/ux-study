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
 * The Locate half, for a surface that points *at* the subject rather than
 * letting the reader point at it — the reveal, where a Planted Defect and a
 * Finding both name an element the Learner has to find again.
 *
 * It listens and never speaks: no click is intercepted, no message is posted
 * back. The reveal's report is a record of something already submitted, so a
 * click on the subject there has nothing to change, and a page that took a
 * selection it could not act on would be the Perceived clickability defect
 * this platform's fourth Competency teaches.
 *
 * The mark is the same outline the Select half draws. A Learner has already
 * spent an audit learning that this outline means "this element, the one the
 * report is about", and inventing a second treatment for the same statement on
 * the next surface is the Consistency defect the third Competency teaches.
 *
 * Matched by walking the identified elements rather than by building a
 * selector out of the message: an identifier is authored content, and a
 * `querySelector` assembled from it would throw on a value that happens not to
 * be a valid selector.
 */
const LOCATE_SCRIPT = `<script>
window.addEventListener('message', function (event) {
  if (event.origin !== window.location.origin) return
  var data = event.data
  if (!data || data.type !== 'locate-element') return
  var previous = document.querySelector('[data-located]')
  if (previous) previous.removeAttribute('data-located')
  var target = null
  var candidates = document.querySelectorAll('[data-element]')
  for (var i = 0; i < candidates.length; i++) {
    if (candidates[i].getAttribute('data-element') === data.element) target = candidates[i]
  }
  if (!target) return
  target.setAttribute('data-located', '')
  // This document's own scroller, moved by hand rather than by
  // scrollIntoView. That walks the whole scroll chain, so it dragged the
  // report outside this frame along with it — the surface pointing at the
  // subject moved itself out from under the reader's eye.
  //
  // A hard cut, with no smooth behaviour asked for. It is what this design
  // system already does when a Gate Quiz moves between stations — a train
  // arrives at the next station, it does not dissolve into it — and a smooth
  // scroll requested from outside a frame is unreliable across that boundary
  // anyway: measured here, it started and stopped at 13 of 558 pixels.
  var scroller = document.scrollingElement || document.documentElement
  var box = target.getBoundingClientRect()
  var middle = scroller.scrollTop + box.top - (document.documentElement.clientHeight - box.height) / 2
  scroller.scrollTop = Math.max(0, middle)
})
</script>
<style>
[data-located] { outline: 3px solid #2563eb; outline-offset: 2px; scroll-margin: 24px; }
</style>`

/**
 * The subject in one of three modes, because three surfaces want three
 * different things from it.
 *
 * **Selecting** is the default and is the audit itself: a Finding names its
 * element by pointing at it (ADR-0008).
 *
 * **`?read`** has nothing to point at, for a reader who is checking a claim
 * about the subject rather than auditing it (#120). The specimen Self-Audit
 * Report sends a reader here to see whether a Finding is true of the real
 * element. Served the auditing way, every element would carry a pointer cursor
 * and take a selection outline, and the selection would be posted to a
 * surrounding surface that is not there — a control that answers a press by
 * doing nothing, which is the defect this platform's fourth Competency is
 * about. Withholding the script is how it stops being one.
 *
 * **`?locate`** is the reveal's: the surface points, the subject answers, and
 * a click still does nothing.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const query = request.nextUrl.searchParams
  const tools = query.has('read') ? '' : query.has('locate') ? LOCATE_SCRIPT : SELECTION_SCRIPT

  const number = Number(stage)
  const subject = Number.isInteger(number) ? practicePageOf(content, number) : null
  // A Stage with no authored subject has no document to serve. The surface
  // around this frame is where that is said in words; a route that can only
  // answer in HTML says not-found rather than returning a blank page.
  if (!subject) notFound()

  const document = subject.html[lang]
    .replace('<link rel="stylesheet" href="./practice-page.css">', `<style>\n${practicePageCss(number)}</style>`)
    .replace('<script src="./practice-page.js"></script>', `<script>\n${practicePageJs(number)}</script>`)
    .replace('</body>', tools === '' ? '</body>' : `${tools}\n</body>`)

  return new Response(document, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}
