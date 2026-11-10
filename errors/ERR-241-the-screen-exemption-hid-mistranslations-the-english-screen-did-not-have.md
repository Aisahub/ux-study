# [ERR-241] The screen exemption hid mistranslations the English screen did not have

## Summary

Found on 2026-11-10, while four `korean-naturalness` passes read the platform voice of all 96 Quiz Items (artefact, prompt, options, captions). They returned about 330 findings, and about 310 of them were applied. Most were translationese. A handful were worse, because they changed what an item tests:

- **Mistranslated device names inside the screens.** An inverter was `접속함`, which is a junction box, in an item that is about calling equipment by its real name. Landed cost was `육상원가` across seven places. A repository migration read as `6월 이전`, which means "before June". None of these defects exists on the English screen.
- **A screen that disagreed with its own description.** The description said `PG사` appears four times. The Korean screen showed it three times.
- **A distractor that changed side in translation.** The English option "put every tab in all-capitals" is a third style that settles nothing. Its Korean was "add `확인하기` to every tab", which is the newest tab's own style, so in Korean the distractor quietly picked a winner.
- **Coined words in the content.** A label was `이름표` and the gate was `관문`. The owner's Korean writing convention replaces both, and the owner settled on 2026-11-10 that the convention takes precedence over this repository's own rulings.

## Root cause

Every Korean check here exempts `screen.ko`, and it is right to: a screen is the defective specimen, and its badness is the lesson (ERR-229). But the exemption is keyed on *where* the text is, not on *whether the defect is the lesson*. A Korean screen can be broken in a way the English one is not, and then the difference is not the lesson. It is a mistranslation, and it changes the item's difficulty in one language only. Nothing compared the two screens, so these defects were exempt by location.

## Resolution

- Applied every finding with a rewrite. The screen-level ones were applied only where the Korean screen was broken differently from the English one. They are `인버터`, `수입원가`, `저장소 이전`, the fourth `PG사`, and `모든 사람의 저장된 리포트` (it was `모두의 저장한`).
- Restored parity on the tab-style item. The Korean distractor is now a typographic change that, like all-capitals, leaves both naming styles standing.
- Changed `이름표` to `레이블` (with particles re-fitted, since 레이블 ends in a consonant), `관문` to `게이트`, and `묶음` to `그룹` where it meant a visual group.
- `CONTEXT.md` gains a **Coined words** section recording the precedence. `test/korean.ts` adds `COINED`, which `competencies.test.ts` enforces over the chrome and every Learner-facing field, anchored to that section.

## Prevention

- When reviewing a screen, the question is not "is this inside `screen.ko`" but "is this defect also on the English screen". The `korean-naturalness` agent already says so in its brief. This sweep is the first that acted on it at scale.
- A distractor is reviewed for which side it lands on in each language, not only for whether it reads well.
- Coined words are now refused mechanically. Two words on the convention's list stay allowed because here they carry a real domain sense the convention does not mean: `원장` (an accounting ledger) and `서식` (part of a tax form's name). `CONTEXT.md` says why.

## Related files

- `content/items/**`
- `test/korean.ts`, `test/competencies.test.ts`, `CONTEXT.md`
- [ERR-229], [ERR-240]
