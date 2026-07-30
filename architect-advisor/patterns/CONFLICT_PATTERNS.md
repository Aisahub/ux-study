# 충돌 패턴 분석 (Conflict Patterns)

> 기반: `errors/` 하위 10개 ERR 문서 횡단 귀납
> 생성: 2026-07-30T05:00:53Z | 모드: 신규

Structural labels (`모드 N`, `[확립]`, `[잠정]`, `예방 규칙`) are the grep contract
that `to-tickets` reads and are deliberately left in Korean. The prevention rules
themselves are copied verbatim from the ERR documents, which this repository
writes in English (`AGENTS.md`).

## Changelog

- 2026-07-30: First generation. 10 ERRs → 4 patterns (확립 2 · 잠정 2), 3 singletons.

## 개요

- 총 ERR: 10 · 식별 패턴: 4 (확립 2 · 잠정 2) · 단일 사례: 3

The dominant finding is not any single pattern but their common parent: **nine of
the ten defects were shipped green.** Every one of them existed in a repository
where the type checker, the linter, the design detector and the test suite all
reported nothing wrong. Two patterns below split that into its two causes — the
rule was never encoded (모드 1), or the instrument could not see the property
(모드 2) — and both reached 5+ backing ERRs independently.

Note also that none of these four patterns is discoverable by module co-occurrence.
The automatic hook groups ERRs by shared module names; the strongest pattern here
(모드 1, 5건) spans `app/globals.css`, `test/db.ts`, a Maintainer dashboard and the
bottom navigation, which share no file at all. Same cause, different modules — the
case only a manual cross-cutting pass finds.

---

<!-- pattern-id: M1 -->
<!-- evidence: 확립 | ERR 근거 5건 -->
## 모드 1: A rule that lives in prose, memory, or a hand-copied number `[확립]`

**범주**: 규약 미집행 (unenforceable convention)
**증거 등급**: 확립 (근거 5건) — to-tickets가 필수 수락 기준으로 주입
**고위험 모듈 조합**: `DESIGN.md` ↔ `app/globals.css` ↔ any surface file · `test/db.ts` ↔ test fixtures · two sibling surfaces built for paired tickets

**전형적 증상**: A value or a treatment is correct only for as long as the next
author remembers it. Because the wrong value stays spellable, nothing in the
build can refuse it, and derived copies of it cannot even be found by `grep`. The
defect surfaces later as drift, not as a failure.

**과거 사례 (5건)**:

- `ERR-201` — the intended typeface was declared in three places and applied in a fourth, so a `<header>` written correctly by every visible convention still came out in Arial.
- `ERR-204` (empty cohort) — the sibling dashboard branched on the empty case and this one did not. "The failure is one of consistency, not of knowledge."
- `ERR-204` (test identities) — four fixture-naming conventions were live at once, one of them from a test that no longer existed, so any cleanup rule shaped as a list of prefixes was stale before it was written.
- `ERR-206` — "The system was prose, and prose cannot refuse anything." 83 hand-typed type sizes across 9 files; the rule meant to stop them was named "The Seven Steps Rule" and listed eight.
- `ERR-208` — raising one token moved 3 of 17 call sites. `--bottom-bar: 99px` and `min-h-[34px]` were arithmetic on the old step, recorded as constants with the derivation only in a comment, so `grep` for the old value found neither.

**예방 규칙** (to-tickets 수락 기준):

- [ ] A design rule that only exists in prose will be broken. If a value is enumerable — sizes, spacings, radii, shadows — put it in `@theme` and let the wrong value be unspellable. Reserve the document for the rules that cannot be encoded.
- [ ] A style that only works because every element opts in is a convention, not a rule. Put the value where inheritance carries it, so the next element written is right by default instead of right by remembering.
- [ ] Before raising a token, `grep` for its **current rendered value** as a literal, not just for the token name. `text-[12px]` is the same decision as `text-label` and neither the compiler nor the linter knows it.
- [ ] A constant computed from a token is a copy of that token that `grep` cannot find. Put the arithmetic in the comment beside it *and* re-measure it on the rendered page when the token moves.
- [ ] A token with zero users is not adopted, it is decoration. Check adoption per step, not per file.
- [ ] Before writing a size, a mark, or a state treatment, look for where this product already draws that thing.
- [ ] When two surfaces are built for paired tickets, diff their treatment of the degenerate cases before calling either done.
- [ ] When a framework scaffold sets a value the project then configures properly elsewhere, delete the scaffold's version rather than leaving both. Two declarations of one thing is the Consistency defect this project exists to teach.
- [ ] Clean up by naming what survives, never by listing what to delete.
- [ ] Copy is not complete until it exists in both `en` and `ko` in the surface's `COPY` record, and a test that only exercises one language does not know whether the other is there.

---

<!-- pattern-id: M2 -->
<!-- evidence: 확립 | ERR 근거 6건 -->
## 모드 2: Green from an instrument that cannot contain the hazard `[확립]`

**범주**: 검증 환경·표상 불일치 (verification mismatch)
**증거 등급**: 확립 (근거 6건) — to-tickets가 필수 수락 기준으로 주입
**고위험 모듈 조합**: `drizzle.config.ts` ↔ `test/server.ts` ↔ `package.json` · `test/*.test.ts` ↔ any rendered surface · `.github/workflows/test.yml` ↔ `package-lock.json`

**전형적 증상**: The check passes, and it was never capable of failing. Two
sub-shapes recur. **Wrong environment**: the check runs where the hazard cannot
exist — a suite that provisions its own environment, a command never run locally,
a build step that only ever meets the richest environment. **Wrong
representation**: the check reads text or source while the defect lives in the
rendered page — typography, geometry, size, timing. In both, green was read as
evidence of a property it never examined.

**과거 사례 (6건)**:

- `ERR-200` — `npm test` reported 2/2 passing while the browser returned a 500. The suite builds its own environment, which is correct and is exactly why it says nothing about the developer's.
- `ERR-201` — "No test caught it." Assertions over extracted text cannot see a typeface.
- `ERR-203` — one build script run in two environments with unequal capabilities. The hazard never fired only because nobody pushed a branch in the twenty minutes it existed.
- `ERR-205` — the command that would have caught the incomplete lockfile (`npm ci`) is not the command anyone runs locally (`npm install`). CI failed in five seconds on its first run.
- `ERR-206` — 129 tests passing and the mechanical design detector reporting zero, with six drifts visible on the page.
- `ERR-208` — 129 tests pass because not one of them asserts a rendered size; 47 bare sizes were invisible to every check in the repo.

**예방 규칙** (to-tickets 수락 기준):

- [ ] A suite that provisions its own environment does not prove the developer path works. Open the application in a browser before calling a database task done.
- [ ] A build script runs in more than one environment. Before adding a step to it, name which environments can satisfy that step, and guard it if the answer is not "all of them".
- [ ] Assertions over `visibleText()` cannot see typography, colour, spacing or layout. A change to the shared shell needs a look at the rendered page — or a computed-style check — not only a green suite.
- [ ] Layout conclusions must be measured on the rendered page, not derived from the source.
- [ ] The design detector reporting zero is not evidence of quality.
- [ ] A defect that only a clean environment can see is still a defect.
- [ ] A hazard that has not fired yet is still a defect.
- [ ] Load the primary mobile surface and do not scroll. If the first screen carries no action, orientation has eaten the work — on a self-paced programme where drop-out is the failure mode, that is a defect and not a layout preference.
- [ ] Before believing a rendering-timing bug reproduced in an automated browser, check `document.visibilityState`. A hidden page skips layout and animation frames, and anything measured there about *when* something is rendered is not evidence about a real Learner's browser.

---

<!-- pattern-id: M3 -->
<!-- evidence: 잠정 | ERR 근거 3건 -->
## 모드 3: A state communicated by rendering nothing `[잠정]`

**범주**: 조용한 성능 저하 (silent degradation)
**증거 등급**: 잠정 (근거 3건) — to-tickets가 참고로만 주입. 근거 5건이 되면 확립으로 승격
**고위험 모듈 조합**: any surface rendering a collection · any control conditionally removed · any frame or region whose size is measured at runtime

**전형적 증상**: The interface expresses "unavailable", "none", or "not measured
yet" by showing nothing, or by showing a placeholder indistinguishable from a real
value. The reader cannot tell a reassuring blank from a broken screen, and
supplies the explanation themselves — usually "broken".

**과거 사례 (3건)**:

- `ERR-202` — the language switcher returned `null` inside an open attempt. "Absence is not a message." A header carrying `한국어` on twenty pages and nothing on the twenty-first has told the reader nothing.
- `ERR-204` (empty cohort) — `map` over an empty array rendered a heading, a paragraph, and then nothing at all. A collection has three cases and only two were designed.
- `ERR-207` — the drawn screen kept its `240px` placeholder and clipped the rest with no scrollbar, no seam and no message. The placeholder was also a plausible real value, so it hid its own failure.

**예방 규칙** (참고 — 수락 기준으로 강제하지 않음):

- A control that is unavailable should say so and say why. Reach for `return null` only when the control does not exist on comparable pages either — otherwise its absence is a question the reader cannot answer.
- Before rendering a collection, name what none, one, and many each look like. `map` over an empty array is silent, so "none" is the case that review and manual testing will not surface — it has to be designed deliberately rather than discovered.
- An empty state must say which emptiness it is. "Nothing here yet, and here is when something will appear" answers the reader's actual question; a bare "no results" leaves them unable to rule out a broken screen.
- A placeholder that is also a plausible real value hides its own failure. A sentinel that could not be mistaken for a measurement would have shown this years earlier.

---

<!-- pattern-id: M4 -->
<!-- evidence: 잠정 | ERR 근거 4건 -->
## 모드 4: The platform shipped the defect its own curriculum teaches `[잠정]`

**범주**: 자기 교재 위반 (self-contradiction)
**증거 등급**: 잠정 (근거 4건) — to-tickets가 참고로만 주입. 근거 5건이 되면 확립으로 승격
**고위험 모듈 조합**: any Learner-facing surface ↔ `content/items/` · any Learner-facing surface ↔ `content/glossary/`

**전형적 증상**: A defect ships whose exact description already exists in this
project's own Item Pool or Glossary. Product Principle 1 states that a defect
shipped here "is not embarrassing, it is disproof" — and it has happened four
times without anyone checking the pool first.

**과거 사례 (4건)**:

- `ERR-202` — "This is the exact defect three items in this platform's own pool describe — `disabled-submit-dressed-as-enabled`, `place-order-wearing-the-disabled-grey`, `remove-hiding-as-plain-text` — shipped in the platform that teaches them."
- `ERR-207` — "The platform teaches Learners to find defects of exactly this shape: a surface that silently shows less than it has. This one was on the page teaching it."
- `ERR-201` — two typefaces on one screen for no reason, in the platform whose third Competency is Consistency.
- `ERR-208` — the label step carrying every status word on the platform was the hardest type to read at arm's length, on a product whose second Competency is Readability.

**예방 규칙** (참고 — 수락 기준으로 강제하지 않음):

- This project teaches signifiers and disabled states. Any inert or absent control in its own UI should be read against its own item pool before it ships.
- This project teaches Learners to notice surfaces that show less than they hold. Any clipped, truncated or silently shortened region in its own UI should be read against its own item pool before it ships.
- Before calling a visual defect a matter of taste, check whether the stylesheet is contradicting itself. "Which font should we use" is a decision; "two fonts on one screen for no reason" is a bug.

---

## 고위험 모듈 조합 Top 5

| 순위 | 모듈 조합 | 공현 | 주요 리스크 |
|---|---|---|---|
| 1 | `app/[lang]/layout.tsx` ↔ `app/globals.css` | 3건 | M1 — the shell declares a value that surfaces then re-declare by hand |
| 2 | `DESIGN.md` ↔ `app/globals.css` / `nav-rail` / `language-switcher` | 2건 each | M1, M2 — a rule in prose, checked by nothing |
| 3 | `app/[lang]/language-switcher.tsx` ↔ `quiz/[attemptId]/page.tsx` | 2건 | M3 — a control removed to express a rule |
| 4 | `drizzle.config.ts` ↔ `test/server.ts` / `package.json` | 2건 | M2 — one config, two environments with unequal capabilities |
| 5 | `app/[lang]/maintain/learners/page.tsx` ↔ `test/db.ts` | 2건 | M1, M3 — a surface read against data that tests left behind |

## to-tickets용 빠른 체크리스트

신규/수정이 다음 모듈을 건드릴 때 해당 예방 규칙 주입:

| 모듈 카테고리 | 확립 패턴 (필수) | 잠정 패턴 (참고) |
|---|---|---|
| Design tokens, type scale, `globals.css`, `DESIGN.md` | M1, M2 | M4 |
| Any rendered Learner-facing surface | M1, M2 | M3, M4 |
| Config or a value fanning out to many call sites | M1, M2 | — |
| Database migration, build script, CI workflow | M2 | — |
| A surface rendering a collection, or a conditionally removed control | M1 | M3 |
| Two sibling surfaces built for paired tickets | M1 | M3 |
| Authored bilingual content (`en` + `ko` parity) | M1 | — |
| A frame or region whose size is measured at runtime | M2 | M3 |
| ADR or decision-only work (no code) | — | — |

---

## 단일 사례 (Singletons)

재발 시 자동 승격 후보.

- `ERR-207` — a one-way `postMessage` announcement between two contexts that mount independently, resolved by luck (근본 원인 카테고리: "경쟁 조건"). Prevention: whichever side can be ready second must be able to *ask*, not only to listen; attach the listener before sending the request it answers.
- `ERR-204` (test identities) — a test that writes to a shared, persistent database owns the rows it creates; fresh random identities buy isolation within a run and are not a cleanup strategy (근본 원인 카테고리: "소유권 미지정").
- `ERR-208` — a flex item defaults to `min-width: auto`, so any flex row whose children truncate needs `min-w-0` on the row (근본 원인 카테고리: "플랫폼 기본값").

## 데이터 품질 비고

`err_scan.py` parsed all 10 documents with zero `missing_fields`. Two observations
worth normalising in the ERR template:

- **ID collision**: two documents both claim `ERR-204` — `ERR-204-an-empty-cohort-was-indistinguishable-from-a-broken-page.md` and `ERR-204-the-test-suite-kept-every-identity-it-invented.md`. Every reference to "ERR-204" in this analysis therefore needs a parenthetical to be unambiguous. Renumbering one of them would fix it permanently.
- **Header naming**: the documents use `## Related files` where the skill's parser also accepts `## Affected Modules`. Parsing succeeded, so this is a note rather than a defect — recorded only so a future template change does not silently break the scan.
