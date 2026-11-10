# [ERR-242] The reveal screen's explanations were outside every Korean check

## Summary

Found on 2026-11-10, during the convergence passes that followed ERR-241. The owner asked for Korean copy to be rewritten until no awkward expression remained. Nine rounds of `korean-naturalness` reading over the chrome, the briefs, the 12 Competencies, the 31 Glossary entries, the specimen report, all 96 Quiz Items and the three practice pages took the high and medium findings from about 330 in the first round down to zero. All four areas were clean in the same state of the tree: two in round 8 with no change after, and two in round 9.

Two things surfaced that were not translationese:

- **The Planted Defect explanations were checked by nothing.** `content/practice-page/*/manifest.md` holds the text the reveal screen shows a Learner after submission. It is the platform's own voice, not the specimen's. Yet no copy test walked it, so it still said `이름표`, `묶음` and `갖고 있다` after both earlier sweeps. The stage-2 audit bar (`data-audit-chrome`), also platform chrome inside the practice page, still said `감사 도구` and `Finding`.
- **Applying a whole-sentence rewrite over a quoted fragment duplicated text.** Several findings quoted only the tail of a wrapped sentence while proposing the whole sentence. Replacing the tail left the head in place twice, for example `이 페이지를 읽는 사람 가운데 이 페이지를 읽는 사람은`. The next round's readers caught them. A mechanical scan for repeated three-word runs then confirmed none remained.

## Resolution

- Every high and medium finding across the nine rounds is applied.
- `koreanContentStrings()` in `test/competencies.test.ts` now walks the practice pages' defect explanations, so the coined-word, translationese and particle checks hold there too. Extending it failed on exactly the three misses above, and they are fixed.
- The stage-2 audit bar reads `점검 도구`, `클릭 모드`, `조작 모드: …` and `선택 모드: 클릭한 요소를 발견에 담습니다.`
- Wrapped YAML blocks the edits left on one long line were re-wrapped at spaces only. Folded scalars join with spaces, so every rendered string is unchanged, and this was asserted per block.

## Prevention

- A surface's checks follow its reader, not its folder. The manifest sits next to the specimen but is read on the reveal, so it is held like the briefs.
- When a finding's quoted text is shorter than its rewrite, read the whole sentence before replacing it. After any batch of applied rewrites, scan for repeated runs.

## Related files

- `content/practice-page/*/manifest.md`, `content/practice-page/stage-2/ko.html`
- `test/competencies.test.ts`
- [ERR-240], [ERR-241]
