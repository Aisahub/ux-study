# [ERR-217] The control for offboarding people could offboard the person holding it

## Summary

On **2026-08-05**, while adding `tod@` and `jordan@` to the allowlist on
production, `chloe@aisahub.com`'s seeded Maintainer row — `allowlist.id = 2` —
was deleted with one press of `Remove`. There was no confirmation step, no
warning, and no visible difference between that row's control and any other
row's.

The next request arrived as a Learner. Capability on this platform is resolved
against the allowlist on **every** request rather than cached in the session
(ADR-0004, #13), which is the property that makes offboarding immediate — and
it made this immediate too. `requireMaintainer` answers a non-Maintainer with a
404, so `/maintain/allowlist` stopped existing for the only person who could
have undone the deletion.

There was no route back through the interface. The row was restored by
hand-written SQL against the Neon **production** branch (project
`cold-star-06430305`, branch `br-delicate-waterfall-azk90fwc`).

## Root cause

**The remove action deleted whatever row id it was handed, and the code that
knew who the actor was had already thrown away the one fact needed to refuse.**

`resolveAccess` answered *what may you do* — `{ allowed, isMaintainer }` — and
discarded *on what grounds*. The grounds are the whole of the guard: the row
that admits the actor is precisely the row whose deletion demotes them. Having
computed it and dropped it on every request, the action had no cheap way to ask
the question, and nobody asked it.

Two things made the consequence unrecoverable rather than merely annoying.

**The refusal had to be about the resolved row, not the address.** A row is
either a full address or a domain wildcard, and the specific row wins. So a
string comparison of `row.pattern` against the actor's email gets the case
wrong in *both* directions: it would refuse to delete `@aisahub.com` — which
demotes nobody who has a row of their own — while happily deleting it out from
under a Maintainer whose only claim came from that wildcard. Whatever guard was
written had to key on identity of the resolved entry, and only `resolveAccess`
was in a position to know it.

**The screen said nothing.** Every row's `Remove` rendered identically, so the
one press that could not be undone looked exactly like the twenty that could.
This is the platform's own fourth Competency — perceived clickability — failing
on the platform's own most destructive control. `ERR-216`, landed the same day,
fixed the neighbouring half of this: a control that answers a press with
nothing. This is the other half — a control that should never have offered the
press.

## Reproduction

1. Sign in as a Maintainer who is on the allowlist by a row of their own.
2. Open `/en/maintain/allowlist` and press `Remove` on that row.
3. The row is gone and the page re-renders — as a 404, because the request that
   re-rendered it resolved the actor as a Learner.
4. Every subsequent request, in either language, is the same 404. Signing out
   and back in does not help: the allowlist no longer admits the address as a
   Maintainer, and the allowlist is the only thing that ever did.
5. The only remaining route is `INSERT` against the database by hand.

## Solution

**`resolveEntry` in `lib/auth.ts`** now answers which row admits an address —
specific over wildcard, `null` for nobody — and `resolveAccess` is derived from
it. One place still decides what "admits" means; the fact is simply no longer
discarded before anyone can use it.

**The action refuses.** `remove` re-resolves the acting Maintainer's admitting
row and returns without deleting when the target is that row. It re-resolves
rather than trusting anything captured at render, and it sits in the action
rather than only in the rendering, because a server action is reachable by a
request that never came from a screen where the control was offered.

**The row says why, in words.** Where that row's control would have been,
`Admits you — removing it would lock you out` / `본인을 들여보내는 항목 —
삭제하면 다시 들어올 수 없습니다`. Not a faded button: `DESIGN.md` requires
unavailability to be stated rather than simulated as an impairment, and a
control that looks live and then silently refuses is the same defect in a new
costume.

**Three tests in `test/surfaces.test.ts`.** The one that matters replays the
page's own progressive-enhancement form — the `$ACTION` fields Next.js renders
so the form works without JavaScript — with the row id swapped, which is the
crafted request the rendering cannot stop. It deletes a decoy row first, so a
request that never reached the action at all cannot pass as a refusal. A third
test builds a wildcard on its own throwaway domain and reads the same row as
two different Maintainers, pinning both directions the string comparison would
have got wrong.

## Prevention checklist

- [ ] A destructive control must ask whether the actor is the target before it
      asks whether the actor is authorised. Authorisation answers *may you do
      this to someone*; it never answers *may you do this to yourself*.
- [ ] When authority is resolved from data rather than stored, the resolution
      must be able to say **which record** granted it. An accessor that returns
      only the verdict makes every "is this the record holding me up?" guard
      impossible to write cheaply, and so unwritten.
- [ ] A guard over a rule set where specificity matters (wildcards, precedence,
      inheritance) keys on the **resolved** record, never on a field comparison
      that happens to look equivalent. Check both directions before believing
      the shortcut.
- [ ] An action whose effect includes "and now you cannot reach this page"
      needs a route back that is not the database. If there is none, the action
      may not be offered.
- [ ] A guard in the rendering is a courtesy; the guard in the server action is
      the boundary. Write the test against the boundary, and make the test
      prove its own request arrived — a refusal and a request that never
      landed are indistinguishable otherwise.

## Related files

- `lib/auth.ts` — `resolveEntry`, and `resolveAccess` derived from it
- `app/[lang]/maintain/allowlist/page.tsx` — the `remove` guard and the row's words
- `test/surfaces.test.ts` — the three tests, and `postRemove` which replays the form
- `errors/ERR-216-the-only-answer-to-a-press-was-the-screen-that-replaced-it.md` —
  the same Competency failing on the same page, from the opposite side
- `DESIGN.md` — "Unavailable is stated in words, never simulated as an impairment"
