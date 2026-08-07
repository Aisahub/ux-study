# [ERR-210] The scale's own guard could not see the framework's defaults

## Summary

An audit of `/maintain/content` found the page had never been built in this
design system at all. It was still the scaffold's styling: fifteen `zinc-*`
colours, three type sizes that are not steps (`text-2xl` 24px, `text-sm` 14px,
`text-xs` 12px), two font weights the system says do not exist (`font-medium`
500, `font-semibold` 600), no cards, no tokens, and three `dark:` variants in a
world `DESIGN.md` declares light-only.

Three of those were shipped defects rather than untidiness:

- **Every figure on the page failed AA.** `zinc-500` on the frosted bed measured
  ≈4.1:1 against the 4.5:1 line. That is every pass rate, every missed-count,
  every location line and every section heading — on a platform whose Stage 3
  Competency is accessibility.
- **A Maintainer in OS dark mode lost the two explanatory paragraphs.**
  `dark:text-zinc-400` compiles into the shipped stylesheet as
  `@media (prefers-color-scheme:dark){color:#9f9fa9}`, while the page background
  does not change, because `globals.css` deliberately has no dark handling. The
  result is 2.6:1 — on the sentences that say how to read every number below.
- **12px came back.** `ERR-208` had raised the `label` step off 12px four days
  earlier precisely because 12px was the platform's hardest type to read. This
  page carried five instances of it, including two Stage sub-headings.

Every check in the repo passed on this page. The design detector returned `[]`.
`grep -rn "text-\[[0-9.]*px\]" app lib` — the guard `DESIGN.md` names as proof
the scale holds — returned nothing. TypeScript, ESLint and the test suite were
all green.

## Root cause

**The guard was written against the shape of the last defect, not against the
rule it was defending.**

`ERR-206` and `ERR-208` found the scale being bypassed by hand-written
arbitrary values — `text-[12px]`, `text-[11px]` — and installed a grep for
exactly that spelling. It is a good guard for that spelling and blind to every
other way of writing an off-scale size. Tailwind ships its own scale, and
`text-sm` is a 14px that no `[0-9]px` pattern will ever match. The rule is *the
size must be one of eight named steps*; the guard asks *is anyone writing a
bare px value*. Those are not the same question, and the gap between them is
the entire default utility set of the framework.

The second cause is that the audit that produced `ERR-206` converted the files
it was looking at. It was reading the Learner surfaces, so the Learner surfaces
were migrated and the Maintainer surfaces were not — and nothing recorded that
a division had been made. Nine files still hold the scaffold's styling. Three
of them are these Maintainer pages; the other six are the Self-Audit Report
drawer, the Findings library, sign-in and not-enrolled.

The third is the design detector's own silence. It reported zero findings on
the worst-drifted page in the application, both before and after this change.
It is a check on known mechanical spellings, and a page that is uniformly and
consistently wrong presents none of them. **A clean detector run is evidence
about the detector.**

## Reproduction

On the tree before this change:

```bash
# The guard DESIGN.md names — passes.
grep -rn "text-\[[0-9.]*px\]" app lib          # -> nothing

# The sizes it cannot see.
grep -on "text-\(xs\|sm\|base\|lg\|xl\|2xl\)\b" "app/[lang]/maintain/content/page.tsx"
# -> 21 matches: one 2xl, fifteen sm, five xs

# The design detector — passes.
node <impeccable>/scripts/detect.mjs --json "app/[lang]/maintain/content/page.tsx"
# -> []

# The dark-mode rule really ships.
npm run build && grep -o "@media (prefers-color-scheme:dark)[^@]*" .next/static/chunks/*.css
# -> .dark\:text-zinc-400{color:var(--color-zinc-400)}  /* #9f9fa9 */
```

Rendering the page and reading the computed values is what settles it; the
source cannot be read for a contrast ratio, because the bed is a translucent
surface over a gradient and the effective background is a composite.

## Solution

The three Maintainer pages were rebuilt in the system: white cards on the
frosted bed, tokens throughout, the eight-step scale, no borders, `44px`
targets on the allowlist's controls.

Measured on the rendered page afterwards, rather than asserted:

| what | before | after |
| --- | --- | --- |
| distinct type sizes | 24 / 14 / 12px (0 on the scale) | 44 / 25 / 16 / 13.5px (4 of 4 on the scale) |
| body/figure contrast | ≈4.1:1 | 14.68:1 |
| secondary-text contrast | ≈4.1:1 | 5.88:1 |
| dark-mode rules matching an element | 3 | 0 |

Putting the text on white cards is what makes the contrast number *checkable*
at all: the frosted bed's effective colour varies with the colour field behind
it, so the same value measures differently in different corners of the page. A
card fixes the background at `#FFFFFF`, and `ink-2` is then 5.88:1 everywhere.
This is what `DESIGN.md`'s "faded text on white cards and nowhere else" rule
has always been for; it had never been written down as the reason.

Four defects the rebuild exposed, which the source alone did not show:

- The item identifier carried `truncate` and the figure carried `shrink-0`, so
  the row cut the only handle a Maintainer has for finding the item and kept
  the number they can always re-read. Now the pair stacks below `sm`.
- Name and figure sat a measured 506px apart (median) at the two ends of the
  card. Capping the name column at `22rem` — 47px above the longest authored
  name — brings it to 143px with the figures still aligned in one column.
- An absent cohort rendered as `0 of 0 found`. A panel that calls itself a
  controlled comparison reported "nobody here found it" and "nobody here has
  submitted yet" with the same words.
- Lengthening the navigation label from `콘텐츠` to `콘텐츠 상태` — to satisfy
  the rule that labels match their page's heading — made the bottom bar break
  it mid-word as `콘텐 / 츠 상태`. `word-break: keep-all` with
  `overflow-wrap: anywhere` as the fallback fixes it in both scripts.

## Prevention checklist

- [ ] A guard must be written against the rule, not against the last defect's
      spelling. The rule is "every size is one of eight named steps"; check for
      **any** size-bearing utility that is not one of the eight, framework
      defaults included: `grep -rn "text-\(xs\|sm\|base\|lg\|xl\|[2-9]xl\)\b"
      app lib` alongside the existing arbitrary-value grep. The same applies to
      `font-medium`/`font-semibold` against the Two Weights Rule.
- [ ] When an audit converts "the files it was looking at", record which files
      it did **not** convert. `ERR-206` migrated the Learner surfaces and left
      nine files behind with nothing naming them, so the split was invisible
      until someone opened one of those pages a month later.
- [x] `dark:` is a live media query even in a light-only product. A world that
      has decided against a dark theme should make the variant unavailable —
      `@custom-variant dark (&:where(.nothing))` or a lint rule — not merely
      unused. Text that darkens on a background that does not is worse than no
      dark theme at all.

      > **Done 2026-08-07**, in the syntax this line proposed — seven days late
      > and only because the defect was reported from a screenshot of the front
      > door, where the sign-in button was rendering white on near-white. The
      > six surfaces this document names below as unconverted are exactly the
      > six that were still shipping it; thirty variants were removed with it.
      > See `ERR-219`, which is about why this box stayed empty rather than
      > about dark mode.
- [ ] A clean design-detector run is evidence about the detector. It returned
      `[]` on the least system-conformant page in the application. Read the
      page against `DESIGN.md` by hand before concluding it conforms.
- [ ] Contrast on a translucent or filtered surface cannot be read from the
      source. Measure it with `getComputedStyle` on the rendered page,
      compositing alpha over the real backdrop — or put the text on an opaque
      card so there is a fixed value to check.
- [ ] Whichever element gets `truncate` in a two-column row is a decision about
      which of the two the reader is allowed to lose. Truncate the recoverable
      one, never the identifier.
- [ ] Lengthening any navigation label is a two-script check at `320px`. Korean
      breaks between characters by default, so a label that gains a space gains
      a mid-word break.

## Related files

- `app/[lang]/maintain/content/page.tsx`
- `app/[lang]/maintain/learners/page.tsx`
- `app/[lang]/maintain/allowlist/page.tsx`
- `app/[lang]/platform-nav.tsx`
- `app/[lang]/nav-rail.tsx`
- `app/globals.css`
- `DESIGN.md`
- `errors/ERR-206-the-design-system-could-be-read-but-not-enforced.md`
- `errors/ERR-208-raising-one-step-found-every-number-copied-out-of-it.md`
