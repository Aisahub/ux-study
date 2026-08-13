# [ERR-220] The loader called an unwritten pool tolerable and the draw called it a list

## Summary

A Learner who opened the Gate Quiz of a Competency nobody has written items
for, and pressed Start, got a 500 and this:

```
TypeError: Cannot read properties of undefined (reading 'map')
    at startAttempt (app/[lang]/learn/[competency]/quiz/actions.ts:57:42)
```

Four Competencies are in that state today — the whole of Stage 3: `jargon`,
`mental-model-mismatch`, `heuristic-evaluation` and `testing-with-real-users`.
Each one is declared in `config.md`, each one has a definition file and a
Competency page, and each one's page links to a quiz that cannot exist yet.
The Competency route is flat (ADR-0008), so nothing but a session stood
between a Learner and the crash: no Stage gate, no pass requirement, no
sequence. The doorstep offered **Start** in a warm field, the way it does on a
Competency that is ready, and answered the press with a stack trace.

Worse than the error is what the error replaced. The state is not a fault —
it is "these items are still being written", which is the most ordinary thing
that can be true of a curriculum whose Stages are declared before they are
authored. The platform already knows how to say that: the audit surface says
it for a Stage with no subject, and the Maintainer's content page says it for
this very pool. Only the Learner's own doorstep did not.

## Root cause

**Two parts of the codebase held opposite beliefs about the same fact, and
neither of them stated it.**

`loadItems` decided, deliberately and in writing, that an unwritten pool is
not a mistake:

> A pool that has not been authored yet (no directory) is not a mistake — the
> four Stage 1 pools arrive in tickets of their own.

`config.md` says the same thing about the curriculum as a whole: *"Declaring a
Stage is not authoring it."* So the loader skips the directory that is not
there, and `content.items` comes out sparse — by design.

`startAttempt` believed the opposite:

```ts
const pool = content.items[competency].map((item) => item.slug)
```

There is no bug visible in that line. It reads like a lookup of something that
exists, because `Record<string, QuizItem[]>` is a type that promises exactly
that: index it with a string and receive an array. TypeScript raised nothing.
The type said "a pool for every slug"; the loader had already decided that was
untrue; and the only thing standing between the two was a habit of indexing
directly.

**The tolerance was implemented and never given a name.** The identical
sparseness in `practicePages` *was* named — `practicePageOf` answers `null`, its
doc comment says why, and both surfaces that read a subject branch on it and
say something. `items` got the tolerance and not the accessor, so every reader
had to remember, unprompted, that this particular `Record` lies. Three of the
four readers happened to remember: the Maintainer's content page tests
`!pool || pool.length === 0`, and the two attempt-scoped readers are only
reachable through an attempt, which can only exist where a pool did. The draw
is the one place a Learner reaches *before* an attempt exists — the entry
point, and the only reader that had to be right.

The shape is ERR-218's, one layer down. There the rule was global in its
comment and enumerated in its selector; here the tolerance was documented in
the loader and absent from the type, and both gaps stayed invisible for
exactly as long as nobody arrived at the uncovered case. Stage 3 being
declared before it was authored is what arrived.

## Reproduction

1. Sign in as any Learner.
2. Visit `/en/learn/testing-with-real-users/quiz` — a Competency declared in
   `config.md` with no directory under `content/items/`.
3. Press **Start**.

Before the fix: `POST … 500`, and the TypeError above in the server log. No
attempt row is written, so nothing is corrupted — the Learner is simply shown
an error page where the platform should have shown them a sentence.

## Solution

**`itemPoolOf(content, slug)`, answering `null` where nobody has authored a
pool** — the accessor `practicePageOf` already models, for the same reason and
with the same consequence: null is a real answer and every caller has to say
something about it.

- `lib/content.ts` — the accessor, plus the sparseness stated on the `items`
  field itself where it was previously stated only in `loadItems`.
- `app/[lang]/learn/[competency]/quiz/actions.ts` — `startAttempt` reads the
  pool through it and refuses a null, beside the Stage check and before the
  session, like the other things the browser's word is not taken for. The draw
  then maps a value the type knows is an array.
- `app/[lang]/learn/[competency]/quiz/page.tsx` — the doorstep branches on the
  same null and says it: *"This Competency has no Gate Quiz yet."* followed by
  the reason it is not a fault. A white card, not the sand one — there is no
  next action to carry, and the One Warm Field Rule reserves sand for the
  single way through a gate that has one.

The refusal in the action is not redundant with the page. The page is what
removes the crash for a person; the action is what keeps a stale form post, or
a pool deleted after the page was rendered, from reaching the draw.

## Prevention checklist

- **A `Record` that the loader is allowed to leave sparse must not be read by
  indexing it.** Give it an accessor that answers `null`, and say in the field's
  own doc comment that it is sparse. `Record<string, T>` promises a `T` for
  every key; a loader that deliberately omits keys has made that promise false,
  and TypeScript will not notice.
- **Tolerance in the loader is half a decision.** The other half is what every
  reader does with the state it tolerates. `content/config.md` may declare a
  Stage before anyone writes it — so before adding the next such tolerance,
  name the surfaces a Learner can reach in that state and check each one says
  something.
- **A flat route (ADR-0008) means "reachable today", not "reachable when the
  content is finished."** Any surface keyed by a slug from `config.md` is live
  from the moment the slug is declared. Its unauthored state is a state a
  Learner will meet, not a hypothetical.
- **An empty state is copy, not an absence.** Two sentences: what the state is,
  then that it is a gap in the writing rather than something the Learner broke.
  Both languages, and no button that cannot do anything.

## Related files

- `lib/content.ts` — `itemPoolOf`, `loadItems`, the `items` field on `Content`
- `app/[lang]/learn/[competency]/quiz/actions.ts` — `startAttempt`
- `app/[lang]/learn/[competency]/quiz/page.tsx` — the doorstep
- `test/content.test.ts` — the null answer, on a fixture root, so it survives
  Stage 3 being authored
- `test/quiz.test.ts` — the doorstep of an unwritten Competency over HTTP
- `content/config.md` — "Declaring a Stage is not authoring it"
