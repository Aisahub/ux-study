# [ERR-236] The pending shell streamed the gate's refusal into a 200

## Summary

Found on 2026-09-11 by CI, four runs red in a row — the same two gate
assertions each time, and the flaky-suite prior did not survive the second
run. Introduced hours earlier by this branch's own `loading.tsx` files.

| request | before the skeletons | after | after the fix |
| --- | --- | --- | --- |
| `/en/findings`, no submitted report | `307 → /en/audit` | `200` + streamed redirect | `307 → /en/audit` |
| `/en/findings/<id>`, Stage not earned | `307 → /en/audit` | `200` + streamed redirect | `307 → /en/audit` |

The library's gate exists because an unearned Stage's Findings are its
answer key. The gate still *worked* in a browser — the streamed instruction
lands and the visitor ends at `/en/audit`, and no Finding content is in the
200's body because `redirect()` throws before the page renders. What broke
was the contract's spelling: to anything that reads the status line — the
suite's `redirect: 'manual'` assertions, a curl — the refusal had
disappeared into a success code carrying a skeleton.

## Reproduction

With `loading.tsx` present and the gate in the page:

```
curl -sD- http://localhost:3101/ko/findings          # no cookie
HTTP/1.1 200 OK        ← was 307
...<meta http-equiv="refresh" content="0;url=/ko/signin"/>
```

## Root cause

**A pending shell and an HTTP status cannot both be first.** `loading.tsx`
tells Next.js it may flush the shell before the page resolves, and the
status line goes out with the shell. A `redirect()` thrown inside the page
after that can only be delivered in-band — a meta refresh and a router
instruction inside a 200. The skeletons were added for the click-to-open
wait (the Stage 2 lesson), and the review that added them asked what they
showed, not what they *fixed in place* before the page had said anything.

## Resolution

The gates are asked a second time in segment layouts, which stand above the
loading boundary: `findings/layout.tsx` (session, and at least one earned
Stage) and `findings/[findingId]/layout.tsx` (this Finding's Stage earned).
A layout that redirects does so before any shell has streamed, so the
refusal is a 307 again; the happy path still suspends at the boundary and
shows its skeleton. The pages keep their own asks — layouts and pages
render in parallel, and the conditions are the findings module's either
way (#131); the layouts only change when the answer can still become a
status code.

## Prevention

**Adding a `loading.tsx` moves every `redirect()` and `notFound()` below it
from the status line into the stream.** The check is one curl per gated
route, not a browser walk — a browser cannot see the difference.

- [ ] After adding a pending state to a gated route, does an ungated
      request still answer with the status code the suite asserts?
- [ ] Is the gate asked somewhere above the loading boundary, and does the
      page still ask it too?

## Related files

- `app/[lang]/findings/layout.tsx` — the library's gate, above the boundary
- `app/[lang]/findings/[findingId]/layout.tsx` — one Finding's gate
- `app/[lang]/findings/loading.tsx`, `.../[findingId]/loading.tsx` — the
  boundary that moved the refusal
- `test/surfaces.test.ts` — the two assertions that caught it
