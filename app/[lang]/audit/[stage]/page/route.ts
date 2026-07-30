import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { requireSession } from '@/lib/auth'
import { practicePage, practicePageCss } from '@/lib/server-content'
import { isLanguage } from '@/lib/language'

/**
 * A Stage's Practice Page, served whole (#23). A route handler rather than a
 * React page, so the response is exactly the authored document: no navigation,
 * no logo, no sidebar can appear inside its bounds because nothing of the
 * platform is in the response at all. A Learner asked to find what is wrong
 * with this page must never be able to report our own chrome.
 *
 * Two things are added at serve time, neither visible as content: the
 * stylesheet is inlined (the authored link's relative path would not survive
 * this route's URL shape), and a small script makes every identified element
 * selectable — a Finding names its element by pointing at it (ADR-0008), and
 * the selection is reported to the surrounding audit surface (#24) via
 * postMessage.
 */

const SELECTION_SCRIPT = `<script>
document.addEventListener('click', function (event) {
  var element = event.target.closest('[data-element]')
  // The artefact is inert: nothing on it navigates or submits.
  event.preventDefault()
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
[data-selected] { outline: 3px solid #2563eb; outline-offset: 2px; }
</style>`

export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string; stage: string }> }) {
  const { lang, stage } = await params
  if (!isLanguage(lang)) notFound()
  await requireSession(lang)

  const number = Number(stage)
  const subject = Number.isInteger(number) ? practicePage(number) : null
  // A Stage with no authored subject has no document to serve. The surface
  // around this frame is where that is said in words; a route that can only
  // answer in HTML says not-found rather than returning a blank page.
  if (!subject) notFound()

  const document = subject.html[lang]
    .replace('<link rel="stylesheet" href="./practice-page.css">', `<style>\n${practicePageCss(number)}</style>`)
    .replace('</body>', `${SELECTION_SCRIPT}\n</body>`)

  return new Response(document, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}
