# [ERR-219] The decision against a dark theme was recorded everywhere except in the markup

## Summary

Reported from a screenshot: on the sign-in page — the one screen every Learner
must get through — **the only button was white on a near-white background** and
had to be hunted for. No error, no failing test, nothing in the logs. The
reporter's machine was in OS dark mode; the machines it was built on were not,
which is why the door had looked fine to everyone who built it.

| what was wrong | who it fails |
| --- | --- |
| `dark:bg-white dark:text-zinc-900` on the sign-in button, over a background that stays light | every Learner in OS dark mode, at the door, before they have an account |
| `dark:text-zinc-400` on the explanation under it | the same Learner, reading why one button serves two cohorts |
| twenty-eight more `dark:` variants across the audit surface, the drawer, the Findings library and the not-enrolled page | Learners and Maintainers, on the surfaces where the actual work happens |

The button is the severe one. A paragraph that drops to a paler grey is
uncomfortable; a control that is the same colour as what it sits on has stopped
being a control.

## Root cause

**This was found, diagnosed, written down and left. Twice.**

That is the finding. The mechanism itself is simple and was never in doubt:
`dark:` does not ask what colour the page is, it asks the operating system. So
a variant left on a button keeps firing long after the theme it belonged to was
deleted, repainting one element against a background that no longer moves with
it. The half-finished state is worse than either theme — a dark button on a
light page is merely wrong; a white button on a white page is gone.

Light-only is a decision, taken 2026-07-23 and recorded four times: DESIGN.md's
"Light only; there is no dark theme", its closing Don't, the note above the
tokens in `globals.css`, and the deletion of the scaffold's
`prefers-color-scheme: dark` block. Every one of those records is about *the
page*. None of them reaches a variant sitting on an element.

Then `ERR-210` (2026-07-31) hit this exact defect on the Maintainer dashboard,
measured it at 2.6:1, and wrote down both halves of what was still coming:

> `dark:` is a live media query even in a light-only product. A world that has
> decided against a dark theme should make the variant unavailable —
> `@custom-variant dark (&:where(.nothing))` or a lint rule — not merely unused.

and, in the same document, the list of surfaces it had knowingly not converted:

> the other six are the Self-Audit Report drawer, the Findings library, sign-in
> and not-enrolled

Those are the files in this document. The defect was not undiscovered for a
week — it was **inventoried**, by name, with the fix spelled out in the syntax
it eventually took, in a checklist item that was never checked. A prevention
item is a promise to do work later, and nothing in this repository was watching
whether later arrived.

**The second cause was found while verifying the first, and is the reason the
first could not stay fixed.** With all thirty variants deleted, the new test
still failed: the shipped stylesheet carried
`@media (prefers-color-scheme:dark)` anyway, including a `dark:text-zinc-500`
rule for a class no source file contains. Tailwind v4 scans the project, and
`errors/*.md` is part of the project. `ERR-202` quotes the offending markup in
its prose, so **the document describing the defect was compiling the defect's
CSS into production** — and this document, which quotes five more variants in
the table above, was about to do it again. A codebase where writing down a bug
re-creates it cannot be cleaned by deleting call sites.

## Resolution

Three changes, and only the first is about the pages.

**The variants are gone** — thirty of them, across six files: the sign-in page,
the not-enrolled page, the audit surface and its drawer, the Findings library
and a finding's detail. Pure subtraction: each sat beside a light-mode base
already carrying the real value (`text-zinc-600 dark:text-zinc-400`,
`border-zinc-200 dark:border-zinc-800`, `bg-zinc-900 text-white dark:bg-white
dark:text-zinc-900`), so removing the second half changes nothing for a visitor
whose system is light and restores the intended rendering for one whose system
is dark. No colour was chosen in this change.

**The variant is disarmed**, which is ERR-210's checkbox, in ERR-210's syntax:

```css
@custom-variant dark (&:where(.this-world-is-light-only));
```

`dark:` is rebound to a class nothing carries, so any `dark:` utility — in a
page, in a component, or quoted inside an error document — compiles to a
selector that can never match. The variant is now unavailable rather than
merely unused, and that is what makes the deletion above hold: the next one
typed is inert on arrival rather than waiting for the next screenshot.

**A test reads the served stylesheet**, not the source: no CSS the door serves
may contain `prefers-color-scheme` at all. It is placed there because the
stylesheet is where a theme actually exists — a grep over the files that exist
today would have missed both the documentation leak and every variant typed
after it. Confirmed failing on the tree before this change and passing after.

## Prevention

**A prevention item nobody is accountable for is a record of the next
incident, not a defence against it.** ERR-210 got the diagnosis right, got the
fix right, wrote it in the correct syntax, and shipped nothing. Seven days
later the same defect was reported from a screenshot of the front door, and the
only reason it was caught at all is that someone with a dark laptop tried to
sign in.

The checklist item was not weak; the format was. It asked for work in a file
that is read after failures, by whoever is investigating a different failure.
The three items that outrank it are the ones that turned into code the day they
were written — the global press rule (ERR-216/218), the focus ring, this
`@custom-variant`. **The honest reading is that this repository's prevention
checklists have no enforcement path, and an item that cannot be executed the
day it is written should be filed as an issue with an owner, not as a
checkbox.**

Two things this change does not fix, recorded rather than done:

- **`errors/*.md` is a Tailwind source.** Every class name quoted in every ERR
  document is a class the build will generate. The `dark:` ones are inert now,
  but the mechanism is general — a document quoting `text-[11px]` mints that
  utility, and the next audit of what the scale actually ships will find it and
  wonder who wrote it. `@source not "../errors"` is the one-line answer; it
  belongs to a change that can verify nothing legitimate was scanned out of the
  build.
- **DESIGN.md's Don'ts are unenforced as a class.** This one now has a test.
  The rest are prose, and the next to be violated will go the same way — by
  code written before the Don't existed, on a machine where it does not show.
