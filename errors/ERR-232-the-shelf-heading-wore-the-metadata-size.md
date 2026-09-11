# [ERR-232] The shelf heading wore the metadata size

## Summary

Found on 2026-09-11 by the same `/ux-audit` pass as [ERR-231], and confirmed
by the squint image: blurred, the board keeps its title and its cards and
loses the one line that says where a Stage's shelf begins.

The page rendered exactly two font sizes:

| element | before | after |
| --- | --- | --- |
| `h1` | `44px` | `44px` |
| shelf `h2` | `13.5px` bold | `16px` bold |
| card text, author line | `13.5px` | `13.5px` |

A shelf heading at the author line's own size, one step of grey apart, is a
heading only to a reader who already knows it is one. With two shelves on the
page — and up to five as Stages are authored — the boundary between them is
what the heading is for.

## Reproduction

`/ko/findings` with two earned Stages. Squint, or stand back: find where
Stage 2's shelf starts without reading.

## Root cause

**The scale's middle step existed and nothing on the page used it.** The type
scale defines `--text-title: 1rem` with its own comment — "body's size, bold
is the difference" — written for precisely this rank of heading. The board
was composed entirely in `text-body-sm`, so its `h2` had nowhere to stand
between a display-size `h1` and the body: bold at the metadata's size was all
that was left, and bold is also how the author line's labels are set.

## Resolution

The shelf `h2` takes `text-title`. Three sizes on the page — `44 / 16 /
13.5` — and the heading now survives the squint image that caught it.

## Prevention

**A heading rank that shares its size with the smallest text on the page is
a candidate defect, not a style.**

- [ ] Does each heading rank sit on its own step of the documented scale?
- [ ] Does the squint image keep every boundary a reader is expected to
      navigate by?

## Related files

- `app/[lang]/findings/page.tsx` — the shelf heading
- `app/globals.css` — `--text-title`, the step that was waiting
