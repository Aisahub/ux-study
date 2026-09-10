# [ERR-228] An English writing habit punctuated two hundred Korean sentences

## Summary

Ruled on 2026-09-10: Korean screen copy uses neither 줄표 (`—`) nor 낫표
(`「」` `『』`). The 낫표 pair never appeared. The 줄표 stood in **205 places** in
Korean copy a Learner reads:

| | count |
| --- | --- |
| the chrome — the `ko` records the screens are written in | 23 |
| authored content, this platform's own voice | 117 |
| authored content, `screen` fields (the specimen a Learner judges) | 65 |

This commit is the 23. The content is the next tranche.

The 줄표 is in the 문장 부호 규정 and is not an error in Korean. What made it one
here is what it was carrying: in nearly every case a second **complete
sentence**, hung off the end of the first.

```
제출은 한 번뿐입니다 — 정답이 공개되고, 그 뒤에는 아무것도 추가할 수 없습니다.
```

That is an English construction. Korean writes it as two sentences, and the
dash was carrying nothing a full stop does not.

## Reproduction

```bash
grep -rn "—" app/ | grep "[가-힣]"
```

## Root cause

**The copy was written in two languages at once, and the punctuation came from
the wrong one.** Every screen holds an `en` record and a `ko` record side by
side in the same file, usually written in the same sitting. The English half
uses the em dash the way English does; the Korean half received it as though it
were a mark rather than a construction.

Nothing looked. `CONTEXT.md` held a banned-word list and a rule about particles
after a slot, and the test that enforces them reads whole words — punctuation
is neither a word nor a missing translation.

## Resolution

23 replaced. Nineteen were the sentence-off-a-sentence shape and became a full
stop with nothing added. Four were not sentences:

- **A list, not a sentence** — the Learn overview's visibility notice and the
  notes prompt. The list is now inside the sentence as its object
  (`운영자는 학습자가 어느 단계까지 수료했는지, … 볼 수 있습니다`) or has a
  sentence naming what it is a list of (`… 같은 것입니다`). It is deliberately
  *not* a bare full stop plus a copula: `A는 B이다` equates where the dash
  exemplified, which is the defect [ERR-226] records in the objectives.
- **A heading** — `퀴즈 — ${name}` is `${name} 퀴즈`. Korean puts the modifier
  in front of the noun it modifies; the dash was English word order held
  together by punctuation.
- **A row separator** — `${date} — ${draw}문항 중 ${score}문항` is now the
  가운뎃점, which is what this platform already separates a row's facts with
  (`시작 전 · 0회 시도`).
- **An absent value** — the allowlist printed a bare `—` where nobody is
  recorded as having added an entry. It says `알 수 없음` / `unknown` now. A
  dash meaning "no value" is not punctuation at all, and this platform says
  every other state in words.

`CONTEXT.md` now carries the rule under *Punctuation on a Korean screen*, and
`test/competencies.test.ts` holds it for the chrome, and holds 낫표 everywhere.

Two assertions quoted the old wording and were updated. The Learn one now
checks the three facts the English half is checked for, rather than one
sentence quoted whole — which is what that test was always about, and it will
not go red the next time the sentence is reworded.

## Prevention

**A punctuation mark is a construction, not a character, and it does not
translate.** The pair of `en` and `ko` records sitting in one file is what makes
this easy to get wrong: the two are written together, so the second inherits the
first's shape unless somebody stops it. What crosses between them is the
*meaning*; the sentence boundaries belong to each language separately.

**Checklist when writing a `ko` record beside an `en` one:**

- [ ] Does any mark in the Korean exist because the English needed it there?
- [ ] Where a dash is removed, is what follows a sentence (full stop), a list
      (fold it into the sentence), a heading (reorder), a row separator
      (가운뎃점), or an absent value (say it in words)?
- [ ] Was a copula reached for to join a list? That equates rather than
      exemplifies — see ERR-226.
- [ ] Would a Korean reader have written this mark here at all?

## Related files

- `CONTEXT.md` — *Punctuation on a Korean screen*
- `test/competencies.test.ts` — the guard
- `errors/ERR-226-a-rendering-rule-was-reached-for-where-the-defect-was-in-the-content.md`
