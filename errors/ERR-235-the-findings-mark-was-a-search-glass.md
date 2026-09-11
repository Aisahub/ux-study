# [ERR-235] The findings mark was a search glass

## Summary

Found on 2026-09-11 by the same `/ux-audit` pass as [ERR-232]. The rail's
mark for the Findings library was a magnifier — and from `sm` up the rail is
icon-only, labels living in `aria-label` and a tooltip alone (a documented
trade in `nav-rail.tsx`).

A magnifier's web-wide reading is *search*. The platform has no search, so
the rail's one guessable glyph promised a feature that does not exist, and
promised nothing about the one it opens. This is Mental-model inertia from
the platform's own curriculum: the meaning a reader carries in from every
other interface wins over the meaning a designer intended.

## Reproduction

The rail at `sm` and up, before ever opening the third mark. Say what it
does without hovering. `발견` is not the common answer; search is.

## Root cause

**Icon-only navigation spends the whole meaning budget on the glyph, and the
glyph was spent on the wrong convention.** The trade recorded in
`nav-rail.tsx` — tooltips and a wide screen behind every mark — covers a
glyph that is merely unfamiliar. It cannot cover one that is *confidently
misread*: a tooltip corrects a reader who wonders, not one who already
knows what a magnifier does.

## Resolution

The mark is a bulb, drawn in the set's one grammar (24px box, 1.7 stroke,
round caps, no fill). A bulb's carried-in reading — insight, what someone
noticed — is the library's actual content, and it collides with no feature
this platform lacks.

## Prevention

**For an unlabelled glyph, the first question is not "does this fit the
concept" but "what does this already mean everywhere else".**

- [ ] Does the glyph's strongest existing convention name this destination —
      or a different one?
- [ ] If the glyph is only defensible with its label beside it, is the label
      actually beside it at every width?

## Related files

- `app/[lang]/nav-rail.tsx` — the icon set and its grammar
