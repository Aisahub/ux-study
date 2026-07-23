# [ERR-202] The language switch became unavailable by vanishing

## Summary

A Learner inside an open Gate Quiz asked why the Korean version of the quiz
could not be seen. Nothing was broken: switching language mid-attempt is
forbidden on purpose (ADR-0008 amendment, #6). But the rule was enforced by
removing the switcher from the header, so the page gave no sign that another
language existed, let alone why it was refused. The Learner was left to
conclude the feature was missing or broken.

This is the exact defect three items in this platform's own pool describe —
`disabled-submit-dressed-as-enabled`, `place-order-wearing-the-disabled-grey`,
`remove-hiding-as-plain-text` — shipped in the platform that teaches them.

## Root cause

`app/[lang]/language-switcher.tsx` returned `null` on any open-attempt path:

```tsx
if (/^\/(en|ko)\/learn\/[^/]+\/quiz\/\d+/.test(pathname)) return null
```

`return null` is the cheapest way to express "not allowed here", and it is the
wrong one whenever the control exists everywhere else. Absence is not a
message. A header that carries `한국어` on twenty pages and carries nothing on
the twenty-first has not told the reader that the switch is unavailable — it
has told them nothing, and the reader supplies the explanation themselves,
usually "broken".

The second half of the cause is that the suite **asserted the defect**:

```ts
expect(visibleText(open)).not.toContain('한국어')
```

That assertion encodes the implementation (the word is gone) rather than the
intent (the switch cannot be taken). Written that way, the test does not merely
fail to catch the problem — it fails the moment anyone fixes it, so the defect
was pinned in place by a green suite.

## Reproduction

Before the fix, signed in with an attempt open on a Competency:

1. Open `/en/learn/<competency>/quiz/<id>`.
2. Look at the header — the `한국어` link that every other page carries is
   absent, with nothing in its place.
3. Type `/ko/learn/<competency>/quiz/<id>` by hand — a redirect returns you to
   `/en/...` without comment.

There is no path, and no stated reason, from inside the attempt to the other
language. 116/116 tests passed in this state.

## Solution

The switcher now names the other language and says why it cannot be taken,
instead of removing itself:

```tsx
if (/^\/(en|ko)\/learn\/[^/]+\/quiz\/\d+/.test(pathname)) {
  return (
    <span className="text-sm text-zinc-400 dark:text-zinc-500">
      <span lang={target}>{LABEL[target]}</span>
      <span className="ml-2 text-xs">({LOCKED[current]})</span>
    </span>
  )
}
```

The reason is written in the language of the page, because it is this reader
who is stuck. The rule itself is unchanged: there is still no link, and the
server-side redirect that pins an open attempt to its own language still
stands. Only the silence is gone.

The test was rewritten to assert the intent:

```ts
expect(open).not.toMatch(/href="\/ko\//)
expect(visibleText(open)).toContain('한국어')
expect(visibleText(open)).toContain('fixed until you submit')
```

## Prevention checklist

- [ ] A control that is unavailable should say so and say why. Reach for
      `return null` only when the control does not exist on comparable pages
      either — otherwise its absence is a question the reader cannot answer.
- [ ] Assert the intent, not the implementation. "No link to the other
      language" is the rule; "the string 한국어 does not appear" is one way of
      obeying it, and freezing that way into a test blocks every better one.
- [ ] When a rule is enforced in two places — a hidden control and a server
      redirect — check that at least one of them explains itself. Two silent
      enforcements leave the user with no account of what happened.
- [ ] This project teaches signifiers and disabled states. Any inert or absent
      control in its own UI should be read against its own item pool before it
      ships.

## Related files

- `app/[lang]/language-switcher.tsx`
- `app/[lang]/learn/[competency]/quiz/[attemptId]/page.tsx`
- `test/quiz.test.ts`
- `docs/adr/0008-language-in-the-url-path-and-flat-competency-routes.md`
