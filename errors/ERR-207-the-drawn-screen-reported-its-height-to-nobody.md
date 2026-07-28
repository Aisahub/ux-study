# [ERR-207] The drawn screen reported its height to nobody

## Summary

A Gate Quiz item's drawn screen sometimes kept the `240px` placeholder its
frame is given before the real height arrives. Anything past `240px` was cut
off with no scrollbar, no seam and no message — and on an item whose question
is about what the screen shows, the part removed can be the part being judged.
It came and went between reloads of the same item, which is what a race looks
like from the outside.

The platform teaches Learners to find defects of exactly this shape: a surface
that silently shows less than it has. This one was on the page teaching it.

## Root cause

`ItemScreen` renders the artefact in a sandboxed frame that cannot touch the
host, so it reports its own height by `postMessage`. The frame announced;
nobody was required to be listening.

```js
new ResizeObserver(send).observe(document.body)
addEventListener('load', send)
send()
```

All three of those fire while the frame's document loads. The host's listener
is attached in an effect:

```tsx
useEffect(() => {
  window.addEventListener('message', receive)
  return () => window.removeEventListener('message', receive)
}, [slug])
```

On the first page load the frame's document is inside the server's HTML and its
inline script runs during parsing, while the host's own bundle is still being
fetched. The effect runs at hydration — after all three sends. Every one of
them is spoken to an empty room, and nothing speaks again: `ResizeObserver`
has already made its one starting call, and the body of a drawn screen does not
change size on its own afterwards. The only thing that recovers the height is a
window resize, which a Learner has no reason to perform.

The design flaw is the one-way announcement. A sender that speaks once, at a
time it does not control, to a receiver that attaches at a time it does not
control, works or does not by luck.

## Reproduction

Signed in with an open attempt, in the running application:

1. Open `/ko/learn/<competency>/quiz/<id>` on an item whose screen is taller
   than `240px` (`order-panel-scale-pair` measures `278px`).
2. Reload several times, watching the bottom of the drawn screen.
3. On some loads the last row of the artefact is missing. `document.querySelector('main iframe').style.height`
   reads `240px` on those loads and `278px` on the others.
4. Resize the window by one pixel and the screen snaps to its full height —
   the `ResizeObserver` finally has something to report, and by now the host is
   listening.

## Solution

The two sides shake hands, so whichever is ready second speaks. The screen
answers a request as well as volunteering:

```js
addEventListener('message', function (event) {
  if (event.data === '${MEASURE_REQUEST}') send()
})
```

and the host asks the moment it has started listening — after attaching, never
before, or the answer is lost the same way the first send was:

```tsx
window.addEventListener('message', receive)
frame.current?.contentWindow?.postMessage(MEASURE_REQUEST, '*')
```

Both orderings are now covered. If the screen loaded first, its own sends were
lost but the host's question arrives at a live listener inside the frame. If
the host mounted first, its question is dropped by a frame that does not exist
yet, and the frame's own first send arrives at a host that is by then
listening. The frame answers only to the exact request string, so it does not
chatter at anything else that posts into it.

## A diagnosis that was wrong, and how it was caught

While fixing this, the browser used for verification showed something far
worse: every item the Learner *stepped* to reported a height of `0`, so no
screen after the first would ever be sized. A second fix was written for it —
the screen chasing its own height across animation frames until the box was
laid out.

That fix was written, tested, and then deleted, because the finding was an
artifact of the test browser. The preview browser runs the page with
`document.visibilityState === 'hidden'`, and a hidden page gets no animation
frames and no layout for frames inserted into it, so a client-inserted iframe
genuinely measures `0 × 0` there and never recovers. The check that settled it
was one line in the host page:

```js
document.visibilityState  // "hidden"
```

The confirmation that the *original* bug was real, and not the same artifact,
is that it is visibility-independent: it is about who is listening, not about
what is rendered.

## Prevention checklist

- [ ] A one-way `postMessage` announcement between two contexts that mount
      independently is a race. Whichever side can be ready second must be able
      to ask, not only to listen.
- [ ] Attach the listener before sending the request that it answers. The
      handshake has the same failure mode it is fixing if the two lines are
      swapped.
- [ ] A placeholder that is also a plausible real value hides its own failure.
      `240px` looked like a measured screen; a sentinel that could not be
      mistaken for a measurement would have shown this years earlier.
- [ ] Before believing a rendering-timing bug reproduced in an automated
      browser, check `document.visibilityState`. A hidden page skips layout and
      animation frames, and anything measured there about *when* something is
      rendered is not evidence about a real Learner's browser.
- [ ] This project teaches Learners to notice surfaces that show less than they
      hold. Any clipped, truncated or silently shortened region in its own UI
      should be read against its own item pool before it ships.

## Related files

- `app/[lang]/learn/[competency]/quiz/[attemptId]/screen.tsx`
- `content/items/item-screen.css`
- `docs/adr/0006-objective-gate-quizzes-without-an-llm.md`
