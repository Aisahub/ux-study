# [ERR-237] The reading surfaces borrowed their headings from the form

## Summary

Raised on 2026-09-11 by the platform's owner reading the Finding page —
"한국어가 어색하지 않나?" — and confirmed by a Korean-naturalness pass over
every surface that names a Finding's written parts.

The Finding page had taken its Korean section headings from the drawer's
form prompts. A prompt and a heading are different sentences: the drawer's
`무엇이 잘못되는지` is an embedded question clause that leans on a verb the
form's context supplies (`…적으세요`), and standing alone over an already
written answer it reads as a sentence cut off mid-thought — a clause-level
carry-over from `What goes wrong`. `고치는 방법 제안` carries a request
(`제안`) that the *reader* of a submitted Finding is not being made.

The same field also wore three spellings across four surfaces:

| surface | said | now |
| --- | --- | --- |
| Finding page | `무엇이 잘못되는지` / `고치는 방법 제안` | `잘못된 점` / `고치는 방법` |
| specimen report | `무엇이 잘못되는가` / `제안하는 수정` | `잘못된 점` / `고치는 방법` |
| reveal | `고치는 방법 제안` | `고치는 방법` |
| drawer error | `…두 서술이 모두 필요합니다.` | `…모두 채워 주세요.` |

## Reproduction

Read `/ko/findings/<id>`'s three headings aloud; the second does not end.
Then open `/ko/specimen` and find the same two parts under two different
names — on the platform whose third Competency teaches Consistency.

## Root cause

**The copy was translated field-by-field, not surface-by-surface.** Each
screen rendered the English key's Korean counterpart in isolation:
`What goes wrong` became a clause where English tolerates one as a heading
and Korean does not, and `Proposed fix` became three different noun
attempts. Nothing compared the four surfaces, and the briefs never expose
the defect because their prose always completes the clause
(`…무엇이 잘못되는지 **적은 설명**`).

The register was settled with the owner (2026-09-11): reading surfaces
carry noun-phrase headings — `UX 원칙 / 잘못된 점 / 고치는 방법` — keeping
the briefs' own stem (`고치는 방법`), which is also what the drawer's error
copy already called that part. A platform-wide business-register pass over
the remaining conversational copy was scoped as separate work, deliberately
not folded into this fix.

## Prevention

**A label that will be read on more than one surface is one decision.**

- [ ] Does a new surface reuse the spelling an existing surface committed
      to — checked by grepping the Korean string, not by memory?
- [ ] Is a Korean heading a phrase that ends, not a clause waiting for its
      verb?
- [ ] Was the wording read on the surface it will live on (a prompt above
      an empty box, or a heading above a written answer)?

## Related files

- `app/[lang]/findings/[findingId]/page.tsx` — the Finding page's headings
- `app/[lang]/specimen/page.tsx` — the specimen's matching pair
- `app/[lang]/audit/[stage]/reveal.tsx` — the reveal's fix column
- `app/[lang]/audit/drawer.tsx` — the error copy; its prompts are part of
  the platform-wide register pass, not this fix
- `content/briefs/self-audit-report*.md` — where the parts' names come from
