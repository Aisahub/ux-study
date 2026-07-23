# [ERR-201] The shell rendered in a different typeface from the page inside it

## Summary

Every page in the application rendered in two typefaces at once: the navigation
bar in Arial, the page beneath it in Geist. No test caught it, and nothing
looked wrong until the shell gained content of its own — the defect had been
present since the skeleton and was simply invisible while the shell held only a
one-word language switcher.

## Root cause

Three decisions agreed with each other and one did not.

`app/[lang]/layout.tsx` loads Geist through `next/font/google` and puts its
variable class on `<html>`. `app/globals.css` maps that variable into
Tailwind's theme token:

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
}
```

Every page component then writes `className="… font-sans"` on its `<main>`,
which resolves to Geist. So far so consistent.

But the same stylesheet also carried a line left by `create-next-app`:

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

That is the **inherited default for the whole document**, and nothing overrode
it except an explicit `font-sans`. The arrangement therefore worked exactly as
long as every rendered element sat inside a `<main>` that named the font — an
invariant nobody had stated and nothing enforced. Adding a `<header>` to the
layout broke it on the first try.

The deeper fault is not the Arial line. It is that the intended face was
declared in three places and applied in a fourth, so a new element could be
written correctly by every visible convention in the file and still come out
wrong.

## Reproduction

Before the fix, on any page:

```js
getComputedStyle(document.body).fontFamily    // "Arial, Helvetica, sans-serif"
getComputedStyle(document.querySelector('main')).fontFamily   // "Geist, …"
getComputedStyle(document.querySelector('header')).fontFamily // "Arial, …"
```

The suite reported 114/114 passing throughout, in both states.

## Solution

`app/globals.css` now points the document default at the face the layout
actually loads, so inheritance carries it and no element has to opt in:

```css
body {
  font-family: var(--font-geist-sans), sans-serif;
}
```

The per-page `font-sans` classes are left in place. They are now redundant
rather than load-bearing, which is the correct direction: removing them would
be a second edit to every page for no behavioural gain, and keeping them costs
nothing.

## Prevention checklist

- [ ] When a framework scaffold sets a value the project then configures
      properly elsewhere, delete the scaffold's version rather than leaving both.
      Two declarations of one thing is the Consistency defect this project
      exists to teach.
- [ ] A style that only works because every element opts in is a convention, not
      a rule. Put the value where inheritance carries it, so the next element
      written is right by default instead of right by remembering.
- [ ] Assertions over `visibleText()` cannot see typography, colour, spacing or
      layout. A change to the shared shell needs a look at the rendered page —
      or a computed-style check — not only a green suite.
- [ ] Before calling a visual defect a matter of taste, check whether the
      stylesheet is contradicting itself. "Which font should we use" is a
      decision; "two fonts on one screen for no reason" is a bug.

## Related files

- `app/globals.css`
- `app/[lang]/layout.tsx`
- `app/[lang]/platform-nav.tsx`
