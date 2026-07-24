# [ERR-204] An empty cohort was indistinguishable from a broken page

## Summary

The people half of the Maintainer dashboard rendered `users.map(...)` into a
`<ul>` with no branch for the case where there are no users. With the table
empty, the page rendered its heading and its explanation paragraph, and then
nothing at all — no list, no message, no indication of which of the two
possible situations the Maintainer was looking at: a screen that had failed to
load its data, or a cohort that had not arrived yet.

The state is not hypothetical. It is what a freshly deployed branch is in
before the first sign-in writes the first row, and — since #33 added the
teardown that sweeps the test branch back to its seeded allowlist rows — what
the test branch is left in after every run.

## Root cause

`Array.prototype.map` over an empty array is not an error. It renders nothing,
silently, and the surrounding markup renders exactly as intended. Nothing in
the type system, the linter or the build notices, because nothing is wrong:
the page is doing precisely what it says.

The gap is upstream of the code. A collection has three cases — none, one,
many — and only two of them were designed. Development and manual review both
happen against a database that has rows in it, so the missing case is also the
case that is never seen while the work is being done.

What makes this a defect rather than an omission is that the project already
knew better. The sibling content dashboard, written for the neighbouring
ticket, branches on `reports.length === 0` in both of the sections that depend
on submitted reports, and its item-rate section iterates over authored content
rather than over rows, so it degrades to `never drawn` instead of to nothing.
The same author, the same week, the same design instinct — applied to one half
of the dashboard and not the other. The failure is one of consistency, not of
knowledge.

A dashboard is read to answer "is everything alright?". A blank region is the
one answer it must never give ambiguously, because the reader cannot tell a
reassuring blank from an alarming one, and the cost of guessing wrong is
opposite in each direction.

## Reproduction

With the `users` table empty, as a Maintainer:

```
GET /en/maintain/learners
```

The response contains the heading and the explanation paragraph, followed by
an empty `<ul>`. Nothing on the page distinguishes this from a data-loading
failure.

## Solution

The list is now behind a branch, and the empty case says which situation it is:

```tsx
{users.length === 0 ? (
  <p className="text-sm text-zinc-500">{copy.nobodyYet}</p>
) : (
  <ul className="flex flex-col gap-2">…</ul>
)}
```

The copy joins the page's existing `COPY` record in both languages. Both
sentences matter, and the second one is the one that does the work:

- **en** — `No one has signed in yet. Anyone who does appears here from their
  first visit.`
- **ko** — `아직 아무도 로그인하지 않았습니다. 로그인한 사람은 첫 방문부터 여기에
  나타납니다.`

"No one has signed in yet" alone still leaves the Maintainer wondering whether
the page merely failed to find anyone. Stating when a row *will* appear is what
converts a blank screen into a report about the cohort.

The test in `test/surfaces.test.ts` empties the table and asserts the sentence
appears in both languages, and that the phrase every learner row carries —
`quizzes passed` — does not. Asserting on the absence of a row's own text
rather than on a row count is deliberate: the suite shares one database, so a
count is a claim about the whole branch, while the absence of rendered text is
a claim about this one response. Emptying the table is safe only because no
other test file writes `users` and tests within a file run in order; both are
worth re-checking before that delete is copied anywhere else.

## Prevention checklist

- [ ] Before rendering a collection, name what none, one, and many each look
      like. `map` over an empty array is silent, so "none" is the case that
      review and manual testing will not surface — it has to be designed
      deliberately rather than discovered.
- [ ] An empty state must say which emptiness it is. "Nothing here yet, and
      here is when something will appear" answers the reader's actual question;
      a bare "no results" leaves them unable to rule out a broken screen.
- [ ] When two surfaces are built for paired tickets, diff their treatment of
      the degenerate cases before calling either done. The gap here was
      inconsistency between siblings, and reading the sibling would have found
      it faster than reading the page itself.
- [ ] Copy is not complete until it exists in both `en` and `ko` in the
      surface's `COPY` record, and a test that only exercises one language does
      not know whether the other is there.
- [ ] Against the shared test branch, assert on what a response rendered, not
      on a global count. Any test that deletes a whole table is asserting
      something about every other test file at the same time.

## Related files

- `app/[lang]/maintain/learners/page.tsx`
- `test/surfaces.test.ts`
