# [ERR-221] The sweep that fixed the Korean names only read where they were taught

## Summary

Reported from a screenshot: rendering `/ko/specimen` at `375px` on 2026-08-14,
the bottom bar's third mark read **`Finding`** — a Latin word, in the
navigation, on every Korean page. No error, no failing test. It is older than
the work that found it; it has been on `origin/main` for as long as the rail
has existed.

Two defects in one label, and they point in different directions:

| what was wrong | who it fails |
| --- | --- |
| `findings: 'Finding'` in the `ko` record of the navigation's `COPY` | every Korean-reading Learner who has submitted a report, on every page, at every width |
| it is also the English **singular**, where the English label is `Findings` | anyone comparing the two languages: they did not name the same thing |

The first is a live breach of a written rule, not a gap in one. CONTEXT.md's
Learner-facing Korean section settles it outright — **발견**, never the English
`Finding`, in Korean copy — and the navigation bar is Learner-facing copy.

## Root cause

**The rule was written from a sweep, and the sweep only read half the
platform.**

`#96` (2026-08-03) is the change that produced this rule. It found around
twenty concept-naming splits, resolved them, and — correctly — did not stop at
resolving them: it wrote the rulings into CONTEXT.md so the next author would
not decide alone, and `test/competencies.test.ts` grew a sweep that fails when
Learner-facing copy uses a word CONTEXT.md rules out. That is the right shape.
The commit message even names this exact defect as one of the three that
contradicted CONTEXT.md outright: *"They were taught to record a 발견 and handed
a drawer whose every label said Finding."* It fixed twenty-four such strings.

It did not fix this one, and the test it left behind could not have caught it,
because both the sweep and the test read the same thing: **`loadContent()` —
the authored markdown under `content/`.** That is where the Competencies, the
Glossary, the briefs, the item pools and the specimen report live. It is not
where the screens live. The words a Learner reads on a *page* come from
`COPY` records inside the components, and no check has ever read one.

So the enforcement had a shape nobody chose: it covered the place these terms
are **taught** and not the place they are **displayed**. The drawer a Learner
writes a Finding into was fixed by hand, in that commit, because a human was
looking at it. The rail was not, because nobody was, and nothing was.

**The second cause is why an obvious-looking check would still have missed
it.** The natural way to scan for this is to find the Korean strings and read
them. `'Finding'` contains no Hangul. A scan that identifies Korean copy by
looking for Korean characters skips, precisely and silently, the one string
whose defect is that it is not Korean. The record has to be read *whole* — by
its position in a `ko:` block — or the check is worse than none, because it
reports green over the exact case it was written for.

**A third thing surfaced while choosing the replacement, and is recorded
because it is a real conflict rather than an oversight.** `PRODUCT.md` and the
rail's own comment state that labels match the headings of the pages they lead
to, "rather than being shortened for the bar — the platform should not fail the
Consistency lesson it teaches". Five of the six marks obey that literally, in
both languages. The Findings library cannot: its heading is a sentence.
Measured in the running bar — a label slot is `57px` wide at `375px` with six
marks, and holds two lines — `What colleagues found` wants three and is
clamped; Korean's `동료들이 찾아낸 것` fits in two. A label that works in only
one of the two scripts is what DESIGN.md's Two-Script Rule refuses, so the
heading is not available to either language here. This was not known before the
measurement, and the earlier assumption — that neither would fit — was wrong.

## Resolution

**The label is 발견.** Both languages name the record instead of the heading:
`Findings` in English, unchanged, and 발견 in Korean — the spelling CONTEXT.md
fixes, and the one the drawer a Learner writes into has used since `#96`. The
plural mismatch goes with it: Korean does not mark number, so 발견 answers
`Findings` rather than `Finding`.

**The reason is recorded where the decision is made**, in the rail's own
comment, with the measurement in it. The rule it departs from is stated two
lines above; a departure sitting silently next to the rule it breaks is how
this gets re-decided by the next author, alone, which is the failure `#96` was
written to end.

**The sweep now reads the screens.** Every `ko: { … }` record under `app/` —
twenty-two files, not only the navigation — is read out of the source and
checked against CONTEXT.md's rulings. Three things about how:

- The record is read **whole**, brace-matched, for the reason above. Every
  string literal inside a `ko` block is Korean copy by position, whatever
  alphabet it happens to be in.
- It is read from source rather than imported. A `COPY` record sits inside a
  server component that opens a database connection on import, and a check that
  needs a database to tell you a word is wrong is a check that will be skipped.
- The banned list is **anchored back to CONTEXT.md**, the same way the existing
  list above it is: the two English words are only bannable because CONTEXT.md
  says each "stays the record's name in code, issues and English copy", and if
  it stops saying so the anchor test fails rather than the rule quietly
  outliving its source.

Confirmed failing on the tree before this change — naming the file and the
string — and passing after.

## Prevention

**What this now catches, stated narrowly so nobody reads it as more:** an
English record name (`Finding`, `Note`) appearing in a Korean `COPY` record
under `app/`, and the five person-words the content sweep already banned.
That is the class this incident belongs to and it is now closed on both halves
of the platform.

Three things it does not catch, recorded rather than claimed:

- **The Korean-vs-Korean rulings are still review-only.** CONTEXT.md also
  settles 점검 over 감사 and 메모 over 노트, and those cannot be enforced as
  substrings: 감사합니다 is *thanks* and 노트북 is a *laptop*, so the check
  would fail on correct copy. This file already refuses that shape of test for
  the same reason, and pretending otherwise is what a green check nobody can
  fail looks like. If these are to be enforced it needs a Korean-aware rule,
  not a longer blacklist.
- **It reads source text, not the rendered page.** A label assembled at
  runtime, or one living outside a `ko:` block, is invisible to it. The check
  is a guard on the shape the platform's copy is written in today, and it will
  need revisiting the first time that shape changes.
- **The scan is `app/` only.** `lib/` carries no `COPY` record today —
  verified, not assumed — and the check will not notice the day one appears
  there.

**The general lesson is about where a rule is enforced, not about Korean.**
`#96` wrote its rulings down *and* wrote a test, which is more than most fixes
do, and the defect still shipped — because the test inherited its reach from
the thing it was written next to, the content loader, and nobody asked what the
loader could not see. **A check adopts the blind spot of whatever it was
convenient to read.** The question a sweep has to answer is not "does this
enforce the rule" but "over what does it enforce it, and what is outside that",
and the second half needs writing down at the time, because it is invisible
afterwards: a passing suite looks identical whether it covered one surface or
both.
