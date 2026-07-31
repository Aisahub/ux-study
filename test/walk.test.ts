import { join } from 'node:path'

import { JSDOM } from 'jsdom'
import { expect, test } from 'vitest'

import { loadContent, practicePageOf, type PracticePage } from '../lib/content'

/**
 * The no-branch check, built as a walk (ADR-0010).
 *
 * "Every walk visits the same three steps and exposes the same set of
 * `data-element` identifiers" is the one rule the whole Stage 2 subject rests
 * on: a Learner who cannot reach a Planted Defect has not missed it, and the
 * manifest then describes a walk they did not take. ADR-0010 requires the rule
 * to be stated on the identifier set so it can be checked rather than
 * remembered, and says why reading the markup is not enough — "it is also the
 * only kind that can see a branch".
 *
 * So this loads the authored subject into a DOM, runs its authored behaviour,
 * operates every control once, and compares what that reached against what the
 * content build says the subject exposes. A branch takes a control out of some
 * walks, and the identifier it carries stops arriving.
 *
 * The last test introduces a branch on purpose and requires this to go red. A
 * check never seen to fail is not known to work.
 */

const flow = practicePageOf(loadContent(join(__dirname, '..', 'content')), 2)!

interface Walk {
  /** Every panel the walk came to rest on, in order, by its authored label. */
  panels: string[]
  /** Every `data-element` the walk saw on screen at some point. */
  reached: Set<string>
}

/**
 * One walk of the subject: forward through every step, confirm, then start
 * again and leave by the exit. Both endings are walked because both are part
 * of the artefact — the point is that no *choice* decides which controls a
 * Learner meets, not that the flow has one ending.
 */
function walk(subject: PracticePage, lang: 'en' | 'ko', behaviour = subject.js): Walk {
  const dom = new JSDOM(subject.html[lang].replace('<script src="./practice-page.js"></script>', ''), {
    runScripts: 'dangerously',
  })
  const document = dom.window.document

  // The authored wait runs at once here. How long it lasts is a Planted Defect
  // and is judged elsewhere; what this walk asks is only whether its answer is
  // reachable at all.
  dom.window.setTimeout = ((run: () => void) => {
    run()
    return 0
  }) as never

  const script = document.createElement('script')
  script.textContent = behaviour
  document.body.appendChild(script)

  const panels: string[] = []
  const reached = new Set<string>()

  /** What is on screen right now. */
  function see() {
    for (const node of document.querySelectorAll('[data-element]')) {
      // `offsetParent` is not laid out under jsdom, so visibility is read from
      // the attribute the subject actually uses to put something away.
      if (!node.closest('[hidden]')) reached.add(node.getAttribute('data-element')!)
    }
  }

  /** What is on screen, and which panel the walk is resting on. */
  function record() {
    const panel = [...document.querySelectorAll('[data-step-label]')].find((node) => !(node as HTMLElement).hidden)
    if (panel) panels.push(panel.getAttribute('data-step-label')!)
    see()
  }

  const click = (selector: string) => (document.querySelector(selector) as HTMLElement | null)?.click()

  record()
  click('[data-element="step1-check-availability"]')
  see()
  click('[data-element="step1-continue"]')
  record()
  click('[data-element="step2-continue"]')
  record()
  // Confirm twice: once as someone who has left the one value the last step
  // refuses to be without, and once having supplied it. Two outcomes of one
  // control is not a branch — every walk meets the same control, and both of
  // the things it can say are part of the artefact.
  click('[data-element="step3-confirm"]')
  see()
  ;(document.getElementById('contact-phone') as HTMLInputElement).value = '010-0000-0000'
  click('[data-element="step3-confirm"]')
  record()

  // Round two, to the exit. Restarting keeps what was entered (ADR-0010), so
  // this is the same walk taking the other way out, not a different one.
  click('#audit-restart')
  click('[data-element="step1-continue"]')
  click('[data-element="step2-cancel"]')
  record()
  click('#cancel-confirmed')
  record()

  return { panels, reached }
}

test('walking the subject visits every step, in order, and ends where it says it does', () => {
  const { panels } = walk(flow, 'en')

  // Three steps and no more: a fourth resting place would be a screen the
  // authored set does not name.
  expect(panels.slice(0, 3)).toEqual([
    'Step 1 of 3 · Pickup and return',
    'Step 2 of 3 · Driver details',
    'Step 3 of 3 · Review and confirm',
  ])
  expect(panels[3]).toBe('Booking request received')
  expect(panels[panels.length - 1]).toBe('Step 1 of 3 · Pickup and return')
})

test('one walk reaches every element the subject exposes, so no control is behind a choice', () => {
  for (const lang of ['en', 'ko'] as const) {
    const { reached } = walk(flow, lang)
    expect([...reached].sort(), lang).toEqual([...flow.elements].sort())
  }
})

test('a branch makes the walk diverge from the authored set, and this check sees it', () => {
  // The failure mode the rule exists to prevent: a value entered at one step
  // decides which step comes next. Nothing about the markup changes, so the
  // element sets still match and the build stays green — this is the only
  // check that can tell.
  const branched = flow.js.replace(
    "show(steps[button.getAttribute('data-next')])",
    "show(steps[button.getAttribute('data-next') === '2' && " +
      "document.querySelector('input[name=\"cover\"]:checked') ? '3' : button.getAttribute('data-next')])",
  )
  expect(branched, 'the branch was not planted — this test proves nothing').not.toBe(flow.js)

  const { panels, reached } = walk(flow, 'en', branched)

  expect(panels).not.toContain('Step 2 of 3 · Driver details')
  expect([...reached].sort()).not.toEqual([...flow.elements].sort())
})
