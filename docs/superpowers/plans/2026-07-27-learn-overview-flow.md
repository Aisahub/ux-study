# Learn Overview Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present the complete programme and the Learner's current position before the next Gate Quiz action without repeating Stage 1.

**Architecture:** Keep the existing server-rendered Learn page and progress projection. Remove the route-only view, fold future stages into the station list, and let one document-ordered grid place the unified contents before the existing state-dependent action.

**Tech Stack:** Next.js 16 App Router, React 19 server components, Tailwind CSS, Vitest integration tests.

## Global Constraints

- Repository documentation is English.
- Learner-facing content is English and Korean.
- Do not add an accordion or new interaction.
- Preserve existing Competency links, progress states, attempt counts, report states, and visibility notice.
- GitHub issue #39 defines acceptance.

---

### Task 1: Unify the Learn overview

**Files:**
- Modify: `test/learn.test.ts`
- Modify: `app/[lang]/learn/page.tsx`

**Interfaces:**
- Consumes: `progressFor(email)` and the existing Stage 1 Competency configuration.
- Produces: a server-rendered overview whose visible text follows `Programme contents` → Stage 1 rows → Stage 2 and Stage 3 → `Next stop`.

- [ ] **Step 1: Write the failing integration test**

Add a test that fetches `/en/learn`, derives visible text, and asserts:

```ts
expect(text).toContain('Programme contents')
expect(text).not.toContain('The Stage 1 line')
expect(text).not.toContain('After this line')
expect(text.indexOf('Programme contents')).toBeLessThan(text.indexOf('Next stop'))
expect(text.indexOf('Stage 1')).toBeLessThan(text.indexOf('Stage 2'))
expect(text.indexOf('Stage 2')).toBeLessThan(text.indexOf('Stage 3'))
```

- [ ] **Step 2: Run the test and verify the intended failure**

Run:

```bash
npm test -- test/learn.test.ts
```

Expected: the new test fails because `Programme contents` is absent and the old route/future-stage headings remain.

- [ ] **Step 3: Implement the unified contents**

In the existing page:

- replace `routeTitle` and `listTitle` with one localized contents title;
- remove the route-only types, helpers, marks, and JSX;
- make the unified contents the first section in document order;
- keep the four linked Competency rows and report row, adding each row's current status;
- append Stage 2 and Stage 3 to the same section;
- render the existing next-action state immediately after the contents;
- use one-column stacking below `wide` and a wider contents/narrower action split at `wide`, without CSS order reversal.

- [ ] **Step 4: Run the focused test and verify green**

Run:

```bash
npm test -- test/learn.test.ts
```

Expected: build succeeds and all Learn tests pass.

- [ ] **Step 5: Verify the complete suite and touched-file lint**

Run:

```bash
npm test
npx eslint 'app/[lang]/learn/page.tsx' test/learn.test.ts
git diff --check
```

Expected: all tests pass, the touched files have no lint errors, and the diff has no whitespace errors.

- [ ] **Step 6: Inspect the rendered flow**

Open `/ko/learn` and `/en/learn` at 375×812 and a desktop width. Confirm the page reads contents → current progress → next action; links and touch targets remain usable; no duplicate Stage 1 route remains.
