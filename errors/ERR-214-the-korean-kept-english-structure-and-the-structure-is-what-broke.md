# [ERR-214] The Korean kept English structure, and the structure is what broke

## Summary

An audit of every Korean surface — 64 Quiz Items, 12 Competency articles, 31
Glossary entries, the Self-Audit Report brief, and the application's own
chrome — found roughly 190 defects. The words were rarely wrong. What was wrong
was that the Korean had inherited an English *shape*, and three of those shapes
cannot hold in Korean at all.

**The sentence Learners are asked to say out loud could not be said.** The
justification sentence is, by `CONTEXT.md`, "the platform's primary authored
asset" — the words a Learner puts in a pull request or a standup, and the reason
the Glossary exists at all. Twenty-five of the thirty-one templates wrote a
particle directly after a `[slot]`:

```
[쉬운 말]로 바꾸면 …        →  "결제 수단로 바꾸면"   (must be 수단으로)
[요소 A]와 [요소 B]는 …     →  "저장 버튼와"          (must be 버튼과)
[무엇]을 덜어내면 …          →  "안내 문구을"          (must be 문구를)
```

Korean chooses a particle's form from whether the word before it ends in a
consonant. The slot's filler is unknown when the template is written, so a fixed
particle is right for half the words that can land there. Two templates
(`undo`, `appropriate-feedback`) were ungrammatical for *every* filler.

**Nine rendered sentences carried a visible typo.** Prose is authored as a
folded scalar (`>-`), where YAML turns each line break into a space. Wrapping a
line between a word and its particle put a space inside what must be one word:
`"보관함" 입니다`, `읽기 쉬워 집니다`, `"2026-07-31 까지의`. Nothing in the
source looks wrong — the particle sits where a wrapped English word would sit.

**Ten items said something the English did not.** `Assigned to` became
`사용자 지정`, which in a Korean interface means "custom settings", so the item
described a different form than the one it drew. The correct option of another
item read as *how to get around the limit* where the English said *what to do
next*. The Glossary's `contrast` entry stated the principle itself wrongly:
"no stronger than the elements around it" became "no different from them",
dropping half the cases. The Self-Audit brief invented a `채점자` — a grader —
for a programme whose `CONTEXT.md` says the Maintainer "**Judges nothing**" and
lists `grader` among the words to avoid.

## Root cause

**A bilingual asset was reviewed for translation and never for structure.**

Every check the repo had asked whether the Korean was *present* — `en` and `ko`
both non-empty, options keyed at the same index, a Principle citable in both
languages. None asked whether an authoring *technique* survived the crossing.
The three failures above are all the same mistake at different scales:

- a template with a fixed particle is a correct English pattern (`the [thing]`
  never inflects) and a broken Korean one;
- wrapping a line at any space is safe in English, where every space is already
  a word boundary, and unsafe in Korean, where a particle is not a word;
- an em-dash insertion can be closed and resumed in English (`the summary — X —
  sits above`), which in Korean strands the subject marker outside it
  (`— 이 있고`).

In each case **the English sibling of the very same field is correct**, so a
reviewer comparing the two sees agreement and moves on. The defect is invisible
from the language it was authored in. That is the same shape as `ERR-213`, where
`56ch` was right in English and half a line in Korean: a decision made once, in
one language, silently carrying an assumption that only that language satisfies.

The content mistranslations have a second cause. Korean forces a translator to
make choices English left open — `us` must become a specific person, a relative
clause must pick a head noun — and those choices are made by whoever writes the
Korean, with no reviewer who reads both. `채점자` was not sloppiness; it was a
plausible filling of a hole the English did not have.

## Reproduction

Fill any Glossary justification with a word that ends in a consonant:

1. Open `content/glossary/plain-language.md`
2. Substitute `[쉬운 말]` with `결제 수단`, a realistic filler
3. The sentence reads `결제 수단로 바꾸면` — ungrammatical; Korean requires
   `수단으로`

For the rendered typo, fold a field the way the page does and read it back:

```
NODE_PATH=$PWD/node_modules node -e 'const fs=require("fs"),yaml=require("js-yaml");
  const f="content/items/consistency/archive-in-the-menu-storage-on-the-page.md";
  const d=yaml.load(fs.readFileSync(f,"utf8").match(/^---\n([\s\S]*?)\n---/)[1]);
  console.log(d.artefact.ko.match(/제목은.{0,14}/)[0])'
```

Before this change that prints `제목은 "보관함" 입니다.`, after it `제목은 "보관함"입니다.`
— the source line break moved; the sentence did not.

## Solution

Two checks now run in the content build, both of which fail on a real past
mistake and neither of which fires on correct Korean:

- **`checkKoreanParticleSpacing`** walks every `ko` string — including the
  option lists, which are not string pairs — and rejects a space before a bound
  particle. Screens are skipped: they are literal blocks (`|-`) that cannot
  acquire the defect, and their copy is a Planted Defect rather than a typo.
  Bound nouns Korean *does* space (`뿐`, `만큼`) and `보다`, which is also a
  verb, are deliberately absent — a check that cries wolf gets turned off.
- **`checkKoreanSlotParticles`** rejects a varying particle written straight
  after a `[slot]` in a justification, exempting slots that end in a fixed noun
  (`[읽는 사람]`, `[몇 명]`), which settle the agreement themselves.

The 25 templates were rewritten rather than patched with `을(를)`: this sentence
is meant to be spoken, and nobody says a bracket. Each slot was moved to a
position where the attachment cannot vary — a fixed noun after it
(`[무엇] 하나를`), a copula ending (`[무엇]입니다`), or a comma and a resumptive
(`[요소], 이건`). Filling all 55 substitutable slots with a consonant-ending and
a vowel-ending word yields 110 grammatical sentences.

## Prevention checklist

- [ ] When an authoring *pattern* is introduced (a template, a wrap width, a
      punctuation convention), ask what it assumes about the script — not
      whether the words translate.
- [ ] A check that passes in one language proves nothing about the other. State
      which language a check is about.
- [ ] Where Korean forces a choice English left open — who "we" are, what a
      pronoun points at — treat the choice as new content needing review, not
      as translation.
- [ ] A fill-in-the-blank sentence meant to be spoken cannot contain written-only
      notation (`을(를)`, `and/or`). Move the blank instead.
- [ ] Compare a Korean field against its English sibling for *shape*, not only
      for meaning: an option list whose four items are parallel in English and
      not in Korean leaks its answer.

## Related files

- `lib/content.ts` — both checks, beside `checkLanguagePairs`
- `test/content.test.ts` — each check seen to fail, and seen not to over-fire
- `content/glossary/*.md` — 25 rewritten justification templates
- `content/items/**/*.md` — particle splits, mistranslations, option shapes
- `content/briefs/self-audit-report.md` — the invented grader
- `CONTEXT.md` — `Maintainer` ("Judges nothing"), `Self-Audit Report`
- `ERR-213` — the same failure in a CSS unit
