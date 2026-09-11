# [ERR-234] The board named authors by their full address

## Summary

Found on 2026-09-11 by the same `/ux-audit` pass as [ERR-232], loudest at
`390px`: the author line wrapped mid-address, `작성 learner-` on one line and
`c076c8d6f951@aisahub.com · 동의 0명` on the next.

| | before | after |
| --- | --- | --- |
| author line, 390px | two lines, broken inside the address | one line |
| what a reader must scan past | `@aisahub.com`, identical on every card | nothing |

The Korea cohort shares one domain (ADR-0004), so on its board the domain
distinguishes nobody — twelve identical characters standing between the
reader and the next card's count.

## Reproduction

`/ko/findings` at `390px`, any shelf with Findings on it. Compare the author
line with the top bar's account pill, which names the same kind of person.

## Root cause

**Two surfaces answered "who is this" and only one had decided.** The layout
had already settled how a person is spelled — the account pill renders
`session.email.split('@')[0]`, with a comment on why the rest of the address
lives on My page instead. The board and the Finding page printed
`row.author` raw because neither asked; the full address is the identity the
schema stores (ADR-0004), and what a schema stores is what a surface prints
until someone writes down the difference.

## Resolution

Both Finding surfaces print the address's local part and carry the full
address in `title`, for the rare cross-cohort namesake — the Indonesia
cohort's personal domains mean two local parts can collide, and the hover
keeps that resolvable without spending every card's width on it.
`test/surfaces.test.ts` now asserts the local part is visible and the full
address is not.

## Prevention

**How a person is spelled is one decision, not one per surface.**

- [ ] Does a new surface that prints a person reuse the spelling an existing
      surface already committed to?
- [ ] Was the line read at `390px`, where an address is wider than a column?

## Related files

- `app/[lang]/findings/page.tsx` — the board's author line
- `app/[lang]/findings/[findingId]/page.tsx` — the Finding's author line
- `app/[lang]/layout.tsx` — the account pill that had already decided
- `test/surfaces.test.ts` — the assertion that moved with it
