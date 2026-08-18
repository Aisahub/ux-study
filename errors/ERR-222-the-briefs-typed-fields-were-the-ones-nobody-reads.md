# [ERR-222] The brief's typed fields were the ones nobody reads

## Summary

Found on 2026-08-18 while walking the content layer for the architecture
review, not from a failure: `Brief` (`lib/content.ts`) declared `slug`, `stage`,
`principles`, an untyped `frontmatter` record and the markdown body — and none
of the four paragraphs the audit surface puts on the screen.

Those four were read back out of the untyped record by a cast:

```ts
// app/[lang]/audit/[stage]/page.tsx
function briefField(brief: Brief, name: string): Bilingual {
  return brief.frontmatter[name] as Bilingual
}
```

`title`, `intro`, `whatCounts` and `advice` were fetched this way at eight call
sites, and `loadBriefs` validated none of them. The consequence is a class of
authoring mistake with no owner: a brief written without `title` passes the
content build, passes `npm run test:content`, deploys, and throws

```
TypeError: Cannot read properties of undefined (reading 'ko')
```

on the Self-Audit Report surface of whichever Stage that brief belongs to — a
crash on the capstone of a Stage, reached only by a Learner who has already
passed every Gate Quiz in it. Three Learners are inside Stage 1 as of
2026-08-18, so the audience for the failure is real.

Nothing was broken when this was found. All three authored briefs carry all
four fields; the defect is that nothing was holding them to it.

## Root cause

**The bilingual check descends into fields that exist, so an absent field is
invisible to it — and the type system had been told to look away.**

Two guards should each have caught this and neither could.

`checkLanguagePairs` is the generic walker, and it is the right shape for what
it does: it recurses through the whole front matter, and wherever it finds a
record whose keys are `en`/`ko` it requires both to be non-empty. Any field a
future author adds inherits the rule for free — real leverage, and the reason
most bilingual defects in this repository are caught at the build. But it can
only inspect what is there. A brief missing `title` has no `title` node to
descend into, so the walker passes it, correctly and uselessly.

The type would have been the other guard, and the cast disarmed it.
`frontmatter: Record<string, unknown>` is honest about what a parsed YAML
document is; `as Bilingual` at the point of use is where the honesty stops.
Every field in that record is `unknown` until someone asserts otherwise, and an
assertion is not a check. The loader's own per-artefact rules — which are
otherwise good and specific, `loadCompetencies` requires `name` and `objective`
as pairs and says so by name — never covered these four, because from the
loader's point of view they were not fields of anything. They were entries in a
bag it was passing through.

The deeper reason both gaps went unnoticed: **the bag made the brief's real
interface invisible.** Reading `Brief` tells you almost nothing about what a
brief is, so nobody comparing the type against the audit surface would notice
that they disagree — there was nothing to compare. The same bag is what let
`optionalFix` be authored in all three briefs, in both languages, and read by
no surface at all (#135, filed rather than fixed here).

## Resolution

`title`, `intro`, `whatCounts` and `advice` are declared on `Brief` and required
in `loadBriefs`, with the addressed message the other loaders use — `briefs/
self-audit-report.md: title must carry en and ko variants`. `peerReview` is
declared as what it is, Stage 3's alone (ADR-0011): absent is fine, half-written
or written as a bare string is not.

The audit surface reads `brief.title[lang]`. Both helper functions on the page
are gone with the cast, and the reason briefs are keyed by Stage rather than
shared moved onto the type, beside the fields it explains.

Three tests were added to the content suite: a brief missing a paragraph a
Learner reads, a Peer Review paragraph written as one string rather than a pair,
and one written in a single language. The baseline fixture grew the four fields,
which is what makes the first of those fail for its own planted mistake.

## Prevention

**A field a Learner reads is a field of the type.** The bag is for what the
loader passes through untouched; the moment a surface reaches into it by name,
that field has become part of the artefact's interface and belongs on it. The
test is not "is this validated" but "does anything render it".

**A cast is where a check should have been.** `as` at a call site converts a
build failure into a runtime one and moves it from the author, who can fix it in
seconds, to a Learner, who cannot. Where an artefact's field is read, the type
should already say it is there.

**A generic walker cannot see an absence.** Rules that are structural — this
record must carry both languages — inherit for free and should be written that
way. Rules that are existential — this artefact must carry this field — have to
be stated per artefact, because there is no node for a generic pass to find.
