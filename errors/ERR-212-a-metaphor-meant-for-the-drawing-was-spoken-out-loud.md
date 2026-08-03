# [ERR-212] A metaphor meant for the drawing was spoken out loud

## Summary

A Competency page carried a chip reading `01번 역` beside a heading that reads
`전체 역량 보기`, and one paragraph under `어디에 적용해 볼까` that began
"개발자라면: … PM이라면: …". Both shipped in all twelve Competencies, in both
languages, on every signed-in visit to a Competency page.

Neither is a rendering fault. Every element is correctly drawn, contrasted and
labelled, and the suite was green.

## Root cause

**Two failures, and the second is the one worth keeping.**

*The chip.* `DESIGN.md` builds this platform on a route: a line, station marks,
a filled dot for a passed stop, a terminus holding a sheet of paper. That
vocabulary is drawn — it is stated ten times in `DESIGN.md` and appears nowhere
in Learner-facing copy except this one chip, which said the metaphor in words.
In Korean that cost twice over:

- `역` is the first syllable of `역량`, the word the same screen uses for the
  thing being numbered. A reader who has just clicked `전체 역량 보기` meets
  `01번 역` and cannot tell whether it is a stop on a line or an abbreviation.
  English has no such collision, so `Stop 1` read fine and nothing in the review
  of the English side could surface it.
- `번` is a counter, and Korean counters do not take a zero-padded numeral.
  `01번` names an identifier — a locker, a bus route — not a position.

*The paragraph.* `roleHint` was authored as one `en`/`ko` pair per Competency
holding both audiences' instructions in a single string. The page could
therefore only ever render one paragraph, and a developer had to read the PM's
half to discover it was not addressed to them. The two hints are alternatives;
a paragraph is the one shape that cannot say so.

The field's own doc comment described the split — "developers the interface they
built, PMs the flow they signed off" — so the structure was known when the field
was designed and simply was not given to the data. **The shape of the content
decided the shape of the page, and no amount of work in the component could have
undone it.**

## Reproduction

Signed in, before the fix:

1. `/ko/learn/visual-hierarchy` — the header row reads `01번 역 · 진행 중 ·
   2회 시도`. Two chips are natural Korean; the first is not.
2. The same page's first card runs both role hints together in one block, so
   neither role has a visible entry point into its own sentence.
3. `/en/learn/visual-hierarchy` — `Stop 1`, and the same run-on paragraph. The
   English chip is idiomatic, which is why this survived: the defect is in one
   language only, and the two variants were reviewed as translations of each
   other rather than each against its own reader.
4. All twelve `content/competencies/*.md` carry the same `Developers: … PMs: …`
   construction, so this is the authoring template, not a slip in one file.

## Solution

**The words name what the platform already calls things; the data carries the
split the page needs.**

- The chip reads `레슨 01` / `Lesson 01`. `CONTEXT.md` listed `lesson` under the
  Competency term's Avoid list; that line is amended rather than quietly broken,
  and records that Learner-facing copy names a *position in the route* this way
  while the project's own vocabulary keeps Competency.
- The numeral stays padded. The padding was never the fault — `번` was. With the
  counter gone the numeral is a label, and `/learn` badges this same position as
  `01`–`04`, so a Learner arriving from that list sees the row they clicked.
- `roleHint` becomes `{ developer, pm }`, each an `en`/`ko` pair, in all twelve
  files. The loader requires both: a Competency hinting only at what a developer
  should audit leaves half the cohort without an address for it.
- The page renders one block per role, each under a sunk chip carrying the role
  word — a chip rather than a heading, because it addresses a reader instead of
  opening a section.

Verified on the rendered pages rather than from the source: `ko` and `en` at
`1280px`, `ko` at `390px`, on `visual-hierarchy` (shortest hints) and
`form-burden` (longest), plus the `/ko/learn` list beside the detail page so the
`01` on the badge and the `01` in the chip can be read together.

## Prevention checklist

- [ ] A design-system metaphor that lives in the drawing stays in the drawing.
      Before putting one into copy, check it in every published language: the
      station/route vocabulary is precise in English and ambiguous in Korean,
      and `DESIGN.md` describing it at length is not permission to say it aloud.
- [ ] A Learner-facing Korean string is reviewed against Korean, not against its
      English counterpart. Bilingual parity means both variants test the same
      thing at the same difficulty — it does not mean a phrase that works in one
      works in the other, and reviewing them as a pair hides exactly the faults
      that exist in one language only.
- [ ] Zero-padding is for numerals read as labels, never for ones followed by a
      Korean counter (`번`, `개`, `회`). `01번` is an identifier; a position is
      `01` alone, or `첫 번째`.
- [ ] When a content field's doc comment describes two audiences, two cases or
      two branches, the field must hold two values. One string named "both" can
      only render as one block, and the component cannot recover the structure
      the author had and did not write down.
- [ ] A word this project has deliberately rejected (`CONTEXT.md`'s Avoid lists)
      may still be the right one later. Amend the list with the date and the
      reason so the next reader can tell a decision from a lapse — the enforced
      subset in `test/competencies.test.ts` is deliberately narrower than the
      lists, so nothing else would have stopped it.

## Related files

- `app/[lang]/learn/[competency]/page.tsx`
- `lib/content.ts`
- `content/competencies/*.md` (all twelve)
- `CONTEXT.md`
- `test/competencies.test.ts`, `test/content.test.ts`
