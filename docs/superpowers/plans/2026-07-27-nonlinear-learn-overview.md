# Non-linear Learn Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/learn` into a centred, non-linear programme directory where every Stage 1 Competency exposes its own Gate Quiz.

**Architecture:** Keep the existing server-rendered progress projection and route structure. Replace the inferred single-next-Competency presentation with independent row actions, use one reusable stage-heading component for all three Stages, and constrain the page to a readable desktop measure.

**Tech Stack:** Next.js 16 App Router, React 19 server components, Tailwind CSS, Vitest integration tests.

## Global Constraints

- English and Korean must expose the same information hierarchy and actions.
- Every Stage 1 Gate Quiz remains independently reachable.
- The Self-Audit Report remains locked until all four Gate Quizzes pass.
- Touch targets are at least 44px high.
- The Learn overview uses no sand next-action card because the Stage has no single next action.
- Production styling uses the existing `ux-study` colour, type, radius, elevation, and 4px-based spacing vocabulary.

---

### Task 1: Make the Learn directory non-linear

**Files:**
- Modify: `test/learn.test.ts`
- Modify: `test/audit.test.ts`
- Modify: `app/[lang]/learn/page.tsx`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `progressFor(email)`, `content.config.stage1Competencies`, and the existing `/<lang>/learn/<competency>/quiz` routes.
- Produces: four independent Gate Quiz links, one report action when unlocked, and visually identical Stage headings.

- [x] **Step 1: Write the failing integration test**

Fetch `/en/learn` for a fresh Learner and assert each configured Quiz route exists:

```ts
for (const slug of [
  'visual-hierarchy',
  'readability',
  'consistency',
  'perceived-clickability',
]) {
  expect(html).toContain(`href="/en/learn/${slug}/quiz"`)
}
expect(text.match(/Open the Gate Quiz/g)).toHaveLength(4)
expect(text).not.toContain('Next stop')
expect(text).not.toContain('You are here')
```

Update the existing programme-order test to verify `Programme contents`, Stage 1, Stage 2, and Stage 3 without depending on a separate next-action card. Update the outstanding-Competency audit assertion to verify `Not started`, not an inferred current position.

- [x] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
npm test -- test/learn.test.ts test/audit.test.ts
```

Expected: the new test fails because the overview has no per-Competency Quiz links and still renders `Next stop` and `You are here`.

- [x] **Step 3: Implement independent row actions and unified Stage headings**

In the Learn overview:

- remove `nextCompetency` and its copy;
- introduce a `StageHeading` component used by all three Stages;
- add localized Stage 1 descriptions and `Open the Gate Quiz` copy;
- render each Competency row as a non-nested structure containing a Competency-page link, status text, and Quiz link;
- expose the Self-Audit Report action only when `progress.allPassed` is true;
- remove the separate state-dependent action card;
- constrain the main surface with `mx-auto w-full max-w-4xl`;
- use 24px Stage separation, 8–12px parent-child grouping, and 16px row padding;
- update `DESIGN.md` to record the non-linear overview and its deliberate no-sand exception.

- [x] **Step 4: Run focused tests and verify green**

Run:

```bash
npm test -- test/learn.test.ts test/audit.test.ts
```

Expected: the build succeeds and both test files pass.

- [x] **Step 5: Run complete verification**

Run:

```bash
npm test
npx eslint 'app/[lang]/learn/page.tsx' test/learn.test.ts test/audit.test.ts
git diff --check
```

Expected: all tests pass, touched code has no lint errors, and the diff has no whitespace errors.

- [x] **Step 6: Verify the production layout**

Inspect `/ko/learn` and `/en/learn` at narrow and desktop widths. Confirm:

- the reading column no longer fills the desktop content area;
- Stage 1, Stage 2, and Stage 3 headings share one visual structure;
- all four Quiz actions are visible and usable;
- narrow actions move below their Competency objectives without horizontal overflow;
- the report remains visibly locked until all Quiz requirements pass.

- [x] **Step 7: Re-run Impeccable layout checks**

Run:

```bash
node /Users/jrkim/.codex/plugins/cache/impeccable/impeccable/3.9.1/skills/impeccable/scripts/detect.mjs --json --scope layout 'app/[lang]/learn/page.tsx'
```

Then answer the layout verification checklist with concrete selectors or values and leave no unresolved findings.
