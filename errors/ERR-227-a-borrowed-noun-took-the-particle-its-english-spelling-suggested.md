# [ERR-227] A borrowed noun took the particle its English spelling suggested

## Summary

Found on 2026-09-10 by the `korean-naturalness` review of one objective in
PR #155. It reported the particle error it had been asked about, then said the
same mistake stood in five other places nobody had asked about. A sweep of
`content/` found a seventh.

`컨트롤` ends in the consonant ㄹ, so it takes `을` and `이`. Seven strings gave
it `를` and `가` — the particles a noun ending in a vowel takes:

```
content/competencies/mental-model-mismatch.md      주요 컨트롤를 누를 때
content/competencies/testing-with-real-users.md    누를 컨트롤를 이름으로
content/glossary/realistic-task.md                 어떤 컨트롤를 누르라고
content/glossary/mental-model.md                   어떤 컨트롤가 무엇을
content/items/system-status/board-drops-…:141      필터 컨트롤를 눌러야
content/items/system-status/board-drops-…:143      위쪽 컨트롤가 아니라
content/items/system-status/export-greys-…:19      표 위에는 컨트롤가 둘
```

An eighth, of the same class on a native noun, was found by the same sweep:
`이름표을` in `visual-hierarchy.md` — `표` ends in a vowel, so it takes `를`.

Four directories, four kinds of field: a Competency's role hint, two glossary
definitions, an item's artefact and two of its answer options. Nothing was
common to them but the noun.

## Reproduction

```bash
grep -rn "컨트롤를\|컨트롤가" content/
```

## Root cause

**The particle was chosen by ear, and the ear was hearing English.**

Korean picks `을`/`를`, `이`/`가`, `은`/`는`, `과`/`와` by whether the noun's last
syllable carries a final consonant. `컨트롤` does — the ㄹ of `롤`. But a reader
who hears the word as the English "control" hears it end in a vowel sound, and
reaches for the vowel-final particle. The rest of each sentence is fine, so
there is nothing for a reviewer's eye to catch: the defect is one syllable
inside an otherwise correct paragraph.

It also cannot be caught by the checks that already existed. `CONTEXT.md`'s
banned-word sweep looks for whole words; `checkLanguagePairs` looks for a
missing translation. A particle is neither.

## Resolution

All eight corrected. The seven `컨트롤` occurrences are this commit;
`testing-with-real-users` was corrected in PR #155, which this branch is
stacked on.

`test/competencies.test.ts` now checks every borrowed noun in the Korean
content and in the screens' own `COPY` records against the particle its final
syllable calls for. Screens are excluded, as everywhere else in that file:
their copy is the defective specimen a Learner judges.

**The first draft of that guard made the same mistake it was written to catch,
in the same direction.** It carried a hand-written list of "consonant-final
loanwords" that included `텍스트`, `링크`, `카드`, `배너` and `필터` — all of
which end in a *vowel* in Korean, because transliteration adds ㅡ after a final
consonant. The test went red on 69 correct strings on its first run. The rule
is now **computed** from the last syllable's code point:

```ts
function hasFinalConsonant(syllable: string): boolean {
  const code = syllable.codePointAt(0)!
  return (code - 0xac00) % 28 !== 0
}
```

The word list says only *which* nouns to look at. Nothing in the test asserts
what any of them ends in.

## Prevention

**A rule about a script has to be read off the script, not off the word.** Both
the content's mistake and the guard's first draft came from the same place —
looking at a borrowed word and recalling how it is spelled in the language it
was borrowed from. Where a property is decidable from the characters, decide it
from the characters; a hand-maintained list of "which words are like this" is
the defect waiting to be re-entered by whoever extends it.

**Checklist when writing a check over Korean copy:**

- [ ] Is the property computed from the Hangul, or written down beside the word?
- [ ] Did the check go red on its first run against known-good content? That is
      the check being wrong, not the content — read the hits before editing
      anything.
- [ ] Are `screen` fields excluded? They are a fictional product's words.
- [ ] Does the failure name the string and the field, so the reader of a red
      suite knows which one to fix?

## Related files

- `test/competencies.test.ts` — the guard, and `hasFinalConsonant`
- `content/competencies/{mental-model-mismatch,visual-hierarchy}.md`
- `content/glossary/{realistic-task,mental-model}.md`
- `content/items/system-status/{board-drops-the-delayed-filter-overnight,export-greys-out-while-the-stock-count-runs}.md`
