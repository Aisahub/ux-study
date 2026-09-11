# [ERR-237] The nested gate stood below the outer segment's boundary

## Summary

[ERR-235]'s resolution did not close the finding, and this is the other
half. CI went from two red gate assertions to one: the no-report refusals
became 307s, and the per-Stage refusal — a Stage 1 reader dialling a
Stage 2 Finding's address — still answered 200.

| request, Stage 1 reader | ERR-235's fix | this fix |
| --- | --- | --- |
| `/en/findings/<stage 2 id>` | `200` + streamed redirect | `307 → /en/audit` |

## Reproduction

Seed a reader with only Stage 1 submitted and a colleague's submitted
Stage 2 Finding; `curl -sD- --cookie "session=…"` its address. Before this
fix: `HTTP/1.1 200 OK` with the refusal inside the stream.

## Root cause

**A `loading.tsx` bounds its whole subtree, nested segments included.**
The library's skeleton sat at `findings/loading.tsx`, so the boundary it
declared wrapped `findings/[findingId]/layout.tsx` — the very layout
ERR-235 added to stand "above the boundary". Above *its own* segment's
boundary, yes; below the parent's. For a direct request the shell could
flush at the outer boundary while the per-Finding gate was still asking
Neon, and the status was 200 before the answer came back. ERR-235's
prevention asked whether the gate sat above *the* loading boundary, as if
there were one; with nested segments there is one per level, and the gate
must clear all of them.

## Resolution

A route group re-scopes the board's skeleton to the board alone:
`findings/(board)/page.tsx` + `findings/(board)/loading.tsx`. The URL is
unchanged — a group name never reaches the address bar. Above
`findings/[findingId]/layout.tsx` no boundary remains, so its refusals are
status codes again; the Finding page's own skeleton still sits below its
gate and covers the page's data wait.

The cost accepted: on a click-through, the gate's own queries now run
before the first skeleton paints, because a gate that can still become a
307 has to finish before anything streams. The skeleton still covers the
page's reads, which are the longer half.

## Prevention

**"Above the loading boundary" is a claim about every ancestor segment,
not the nearest one.** The check that catches it is the same curl per
gated route ERR-235 named — run against *each* distinct gate, not just the
first one that redirects.

- [ ] For every `loading.tsx`, list the nested segments it wraps; do any
      of them gate?
- [ ] Does each distinct refusal (signed out, nothing earned, this Stage
      not earned) answer with its status code, exercised separately?

## Related files

- `app/[lang]/findings/(board)/` — the board and its re-scoped skeleton
- `app/[lang]/findings/[findingId]/layout.tsx` — the gate, now truly first
- `test/surfaces.test.ts` — the assertion that stayed red until this half
