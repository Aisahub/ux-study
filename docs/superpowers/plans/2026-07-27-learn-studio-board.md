# Learn Studio Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/<lang>/learn` as a recognisable Studio Board while preserving non-linear access to every Stage 1 Gate Quiz and the existing report gate.

**Architecture:** Keep the existing server-rendered progress projection and route structure. Recompose the current `Learn` page into three visual units inside the same server component: an introduction with labelled progress, a non-interactive Stage strip, and a vertical list of independently actionable Competency panels followed by the report panel. No new state, route, dependency, or client component is required.

**Tech Stack:** Next.js 16 App Router, React 19 server components, Tailwind CSS, Vitest integration tests, existing `ux-study` design tokens.

## Global Constraints

- English and Korean expose the same hierarchy, state, and actions.
- All four Stage 1 Gate Quizzes remain independently reachable.
- No copy or styling identifies one Competency as the required next one.
- The Self-Audit Report action remains absent until all four Gate Quizzes pass.
- Multiple in-progress Competencies render without a unique-current treatment.
- The page remains centred at `max-w-4xl`.
- Interactive targets remain at least `44px` high.
- A `390px` CSS viewport has no horizontal overflow.
- Use only the committed palette, typography, radius, elevation, and focus tokens.
- Add no dependency, illustration system, dashboard metric, or decorative animation.

---

## File Map

- `app/[lang]/learn/page.tsx` — owns localized Learn copy, server-side progress data, Stage presentation, Competency panels, and report state.
- `test/learn.test.ts` — protects the bilingual non-linear directory, new Studio Board hierarchy, and four independent Quiz actions.
- `test/audit.test.ts` — continues to protect report gating and incomplete-Competency progress; no new test is expected unless implementation breaks this contract.
- `DESIGN.md` — records the Studio Board composition, Stage strip, and no-full-card-current rule.

No new production file is required. The page is one bounded server-rendered surface, and extracting single-use presentational components would add navigation cost without creating a reusable interface.

---

### Task 1: Compose the introduction and Stage strip

**Files:**
- Modify: `test/learn.test.ts`
- Modify: `app/[lang]/learn/page.tsx`

**Interfaces:**
- Consumes: `progress.stepsDone`, `progress.stepsTotal`, `COPY[lang]`, and the existing `Language` type.
- Produces: localized `intro`, `stageProgress`, `programmeStages`, and `open` copy; a labelled progress bar; one `StageCard` component used exactly three times.

- [ ] **Step 1: Write the failing hierarchy test**

Extend `the programme contents shows the whole route without inventing a next Competency` so it fetches both HTML and visible text and asserts the new structural contracts:

```ts
test('the programme contents shows the whole route without inventing a next Competency', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()
  const text = visibleText(html)

  expect(text).toContain('Choose any Competency')
  expect(html).toContain('aria-label="Programme stages"')
  expect(html.match(/data-stage="/g)).toHaveLength(3)
  expect(text.indexOf('Programme contents')).toBeLessThan(text.indexOf('Stage 2'))
  expect(text.indexOf('Stage 2')).toBeLessThan(text.indexOf('Stage 3'))
  expect(text).not.toContain('Next stop')
  expect(text).not.toContain('You are here')
})
```

Add bilingual copy coverage to `both languages present the same Competency set`:

```ts
expect(en).toContain('Choose any Competency')
expect(ko).toContain('원하는 역량부터')
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
npm test -- test/learn.test.ts
```

Expected: the build succeeds, then the updated hierarchy test fails because the existing page has no Studio Board introduction, `Programme stages` label, or `data-stage` structure.

- [ ] **Step 3: Replace detached fact-chip copy with Studio Board copy**

In both `COPY` branches:

- remove `stage` and `competencyCount`;
- add `intro`, `stageProgress`, `programmeStages`, and `open`.

Use these exact values:

```ts
// English
intro: 'Choose any Competency and train the observation skill you need now.',
stageProgress: 'Stage 1 progress',
programmeStages: 'Programme stages',
open: 'Open',

// Korean
intro: '원하는 역량부터 골라 지금 필요한 관찰력을 훈련하세요.',
stageProgress: '1단계 진도',
programmeStages: '프로그램 단계',
open: '열림',
```

- [ ] **Step 4: Replace `StageHeading` with a non-interactive `StageCard`**

Use one component for all three Stages:

```tsx
function StageCard({
  number,
  name,
  detail,
  status,
  open = false,
}: {
  number: number
  name: string
  detail: string
  status: string
  open?: boolean
}) {
  return (
    <div
      data-stage={number}
      className={`rounded-badge p-4 ${
        open ? 'bg-surface shadow-card' : 'bg-sunk text-ink-2'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={`grid size-9 place-items-center rounded-full text-[12px] font-bold ${
            open ? 'bg-oxblood text-white' : 'bg-surface text-ink-2'
          }`}
        >
          {number}
        </span>
        <span className="text-[12px] font-bold">{status}</span>
      </div>
      <h3 className="mt-4 text-[16px] leading-[1.4] font-bold tracking-[-0.015em] text-ink">
        {name}
      </h3>
      <p className="mt-1 text-[13.5px] leading-[1.55]">{detail}</p>
    </div>
  )
}
```

The future Stage cards have no `Link`, `button`, hover class, chevron, or click handler.

- [ ] **Step 5: Implement the introduction and labelled progress**

After `competencies`, calculate a safe percentage:

```ts
const completionPercent =
  progress.stepsTotal === 0
    ? 0
    : Math.min(100, Math.round((progress.stepsDone / progress.stepsTotal) * 100))
```

Replace the current `h1` plus three-chip header with:

```tsx
<header className="grid gap-5 px-1.5 pb-6 sm:grid-cols-[minmax(0,1fr)_240px] sm:items-end">
  <div>
    <h1 className="font-serif text-[44px] leading-[1.1] font-bold tracking-[-0.02em] text-ink">
      {copy.heading}
    </h1>
    <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.55] text-ink-2">
      {copy.intro}
    </p>
  </div>
  <div>
    <div className="flex items-center justify-between gap-3 text-[12px] font-bold">
      <span>{copy.stageProgress}</span>
      <span>{copy.done(progress.stepsDone, progress.stepsTotal)}</span>
    </div>
    <div
      className="mt-2 h-2 overflow-hidden rounded-full bg-blue-grey/35"
      role="progressbar"
      aria-label={copy.stageProgress}
      aria-valuemin={0}
      aria-valuemax={progress.stepsTotal}
      aria-valuenow={progress.stepsDone}
    >
      <span
        className="block h-full rounded-full bg-oxblood"
        style={{ width: `${completionPercent}%` }}
      />
    </div>
  </div>
</header>
```

Render the Stage strip immediately after the introduction and before any Competency:

```tsx
<section aria-label={copy.programmeStages}>
  <h2 className="sr-only">{copy.contentsTitle}</h2>
  <div className="grid gap-3 sm:grid-cols-3">
    <StageCard
      number={1}
      name={copy.stageOne}
      detail={copy.stageOneDetail}
      status={copy.open}
      open
    />
    {copy.stages.map((stage, index) => (
      <StageCard
        key={stage.name}
        number={index + 2}
        name={stage.name}
        detail={stage.detail}
        status={copy.preparing}
      />
    ))}
  </div>
</section>
```

Delete the old Stage 1 `StageHeading` block and the old bottom
`copy.stages.map(...)` block in the same edit. Until Task 2 replaces the list,
keep the existing Competency and report rows directly below the new Stage
strip so the page remains usable.

- [ ] **Step 6: Run the focused test and verify green**

Run:

```bash
npm test -- test/learn.test.ts
```

Expected: all Learn tests pass. The existing Competency list may still use its old visual container, but the introduction and Stage hierarchy are now functional and truthful.

- [ ] **Step 7: Commit the introduction and Stage strip**

```bash
git add test/learn.test.ts 'app/[lang]/learn/page.tsx'
git commit -m "feat: add the learn studio header"
```

---

### Task 2: Turn Stage 1 into a vertical task board

**Files:**
- Modify: `test/learn.test.ts`
- Modify: `app/[lang]/learn/page.tsx`

**Interfaces:**
- Consumes: the existing `competencies`, `progress.quizzes`, `progress.allPassed`, and `progress.reportSubmitted` projections.
- Produces: `data-layout="studio-board"`, four `data-competency-panel` list items, and one `data-report-panel="true"` report item.

- [ ] **Step 1: Write the failing Studio Board structure test**

Add:

```ts
test('Stage 1 is rendered as four task panels followed by the report panel', async () => {
  const cookie = await sessionCookieFor(freshLearner())

  const html = await (await fetch(`${BASE_URL}/en/learn`, { headers: { cookie } })).text()

  expect(html).toContain('data-layout="studio-board"')
  expect(html.match(/data-competency-panel="/g)).toHaveLength(4)
  expect(html).toContain('data-report-panel="true"')
  expect(html.indexOf('data-stage="3"')).toBeLessThan(
    html.indexOf('data-competency-panel="visual-hierarchy"'),
  )
})
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
npm test -- test/learn.test.ts
```

Expected: FAIL because the existing Competency rows do not expose the Studio Board semantic structure.

- [ ] **Step 3: Replace the large contents card with a Stage 1 task section**

Keep the Stage strip outside this section. Replace the current one-card list with:

```tsx
<section
  data-layout="studio-board"
  aria-labelledby="stage-one-tasks"
  className="mt-4"
>
  <div className="flex flex-wrap items-end justify-between gap-3 px-1.5 pb-3">
    <div>
      <h2
        id="stage-one-tasks"
        className="font-serif text-[25px] leading-[1.2] font-bold tracking-[-0.015em] text-ink"
      >
        {copy.contentsTitle}
      </h2>
      <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-2">
        {copy.stageOneDetail}
      </p>
    </div>
    <span className="text-[12px] font-bold text-ink-2">
      {copy.done(progress.stepsDone, progress.stepsTotal)}
    </span>
  </div>
</section>
```

Task 2 Step 4 appends the complete `ol` immediately before this section's
closing tag.

- [ ] **Step 4: Render each Competency as an independent panel**

Immediately after the section heading from Step 3, add
`<ol className="space-y-3">`, retain the existing
`competencies.map((competency, index) => { ... })`, and use this exact status
projection before its `return`:

```tsx
const quiz = progress.quizzes[competency.slug]
const rowMeta = [
  copy.status[quiz.status],
  quiz.attempts > 0 ? copy.attempts(quiz.attempts) : null,
]
  .filter(Boolean)
  .join(' · ')
```

Return this exact panel, then close the map and the `ol`:

```tsx
<li
  key={competency.slug}
  data-competency-panel={competency.slug}
  className="grid gap-4 rounded-card bg-surface p-5 shadow-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
>
  <Link
    href={`/${lang}/learn/${competency.slug}`}
    className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-4"
  >
    <span
      className={`grid size-[52px] place-items-center rounded-badge font-serif text-[19px] font-bold ${
        quiz.status === 'passed'
          ? 'bg-oxblood text-white'
          : quiz.status === 'in-progress'
            ? 'bg-sunk text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
            : 'bg-sunk text-ink-2 shadow-[inset_0_0_0_2px_var(--blue-grey)]'
      }`}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
    <span>
      <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
        {competency.name[lang]}
      </span>
      <span className="mt-1 block max-w-[65ch] text-[13.5px] leading-[1.55] text-ink-2">
        {competency.objective[lang]}
      </span>
    </span>
  </Link>
  <span className="ml-[68px] flex flex-wrap items-center justify-between gap-3 sm:ml-0 sm:min-w-40 sm:flex-col sm:items-end">
    <span className="text-[12px] font-bold whitespace-nowrap text-ink-2">
      {rowMeta}
    </span>
    <Link
      href={`/${lang}/learn/${competency.slug}/quiz`}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-oxblood px-4 text-[12px] font-bold text-white shadow-pill"
    >
      {copy.openQuiz}
    </Link>
  </span>
</li>
```

Do not add a full-card status fill. The numbered cell is the only state-coloured
surface, so multiple `in-progress` panels remain valid.

- [ ] **Step 5: Render the report as the final non-Competency panel**

Move the existing report state expressions into the final `li`:

```tsx
<li
  data-report-panel="true"
  className="grid gap-4 rounded-card bg-surface p-5 shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
>
  <div className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-4">
    <span
      className={`grid size-[52px] place-items-center rounded-badge ${
        progress.reportSubmitted
          ? 'bg-oxblood text-white'
          : progress.allPassed
            ? 'bg-sunk text-oxblood shadow-[inset_0_0_0_2px_var(--oxblood)]'
            : 'bg-sunk text-ink-2 shadow-[inset_0_0_0_2px_var(--blue-grey)]'
      }`}
    >
      <ReportMark className="size-5" />
    </span>
    <span>
      <span className="text-[16px] leading-[1.4] font-bold tracking-[-0.015em]">
        {copy.capstoneHeading}
      </span>
      <span className="mt-1 block max-w-[65ch] text-[13.5px] leading-[1.55] text-ink-2">
        {progress.allPassed ? copy.capstoneExplanation : copy.capstoneLocked}
      </span>
    </span>
  </div>
  {(progress.allPassed || progress.reportSubmitted) && (
    <span className="ml-[68px] flex flex-wrap items-center justify-between gap-3 sm:ml-0 sm:min-w-40 sm:flex-col sm:items-end">
      {progress.reportSubmitted && (
        <span className="text-[12px] font-bold text-ink-2">
          {copy.capstoneSubmitted}
        </span>
      )}
      <Link
        href={`/${lang}/audit`}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-oxblood px-4 text-[12px] font-bold text-white shadow-pill"
      >
        {copy.capstoneOpen}
      </Link>
    </span>
  )}
</li>
```

- [ ] **Step 6: Keep the visibility notice outside the board**

Leave the notice after the Stage 1 section and use:

```tsx
<p className="mx-auto mt-4 max-w-[72ch] px-2 text-[11px] leading-[1.7]">
  {copy.visibility}
</p>
```

- [ ] **Step 7: Run focused Learn and audit tests**

Run:

```bash
npm test -- test/learn.test.ts test/audit.test.ts
```

Expected: both files pass. In particular, all four Quiz links remain, incomplete progress still reads `4 / 5 done`, and the report remains locked until all four Quizzes pass.

- [ ] **Step 8: Commit the task board**

```bash
git add test/learn.test.ts 'app/[lang]/learn/page.tsx'
git commit -m "feat: turn Stage 1 into a studio board"
```

---

### Task 3: Record and verify the production design

**Files:**
- Modify: `DESIGN.md`
- Verify: `app/[lang]/learn/page.tsx`
- Verify: `test/learn.test.ts`
- Verify: `test/audit.test.ts`

**Interfaces:**
- Consumes: the completed Studio Board markup and existing design tokens.
- Produces: an updated design-system contract and evidence that the responsive implementation is ready to merge.

- [ ] **Step 1: Update the Learn overview rules in `DESIGN.md`**

Replace the paragraph beginning `A directory is a column; an attempt is a column`
with:

```md
**A directory is a Studio Board; an attempt is a column.** The Learn overview uses one centred `896px` board. Its programme structure appears first as three non-interactive Stage cards; Stage 1 is open, while Stage 2 and Stage 3 explicitly remain `In preparation`. Stage 1 then becomes a vertical rhythm of elevated Competency task panels, each with its own status and Gate Quiz action. The panels are not an equal-height card grid and no panel is designated as the required next one. The three Gate Quiz surfaces remain single columns: the doorstep and verdict use `720px`, and the wizard `880px`.
```

Add this named rule after the One Warm Field Rule:

```md
**The No False Current Rule.** The Learn overview may show any number of Competencies as `In progress`. Status colour belongs to each panel's number mark and words, never to a unique full-card highlight. A full oxblood Competency card would invent one current task in a non-linear programme.
```

- [ ] **Step 2: Run static verification**

Run:

```bash
npx eslint 'app/[lang]/learn/page.tsx' test/learn.test.ts test/audit.test.ts
node /Users/jrkim/.codex/plugins/cache/impeccable/impeccable/3.9.1/skills/impeccable/scripts/detect.mjs --json --scope layout 'app/[lang]/learn/page.tsx'
git diff --check
```

Expected: ESLint exits `0`, the detector returns `[]`, and the diff check emits no output.

- [ ] **Step 3: Run the full suite**

Run:

```bash
npm test
```

Expected: the production build completes and all Vitest files pass.

- [ ] **Step 4: Verify Korean and English in the running app**

Inspect `http://localhost:3000/ko/learn` and
`http://localhost:3000/en/learn` at desktop and narrow widths. At a desktop
viewport, confirm:

- the introduction, labelled progress, Stage strip, four panels, and report are visible;
- Stage 2 and Stage 3 have no interactive semantics;
- every Competency has one Quiz action;
- multiple in-progress states do not create a unique full-card highlight.

At a `390px` CSS viewport, evaluate:

```js
() => ({
  viewportWidth: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  quizHeights: [...document.querySelectorAll('a[href$="/quiz"]')].map(
    (link) => link.getBoundingClientRect().height,
  ),
  stageColumns: getComputedStyle(
    document.querySelector('[aria-label="Programme stages"] > div'),
  ).gridTemplateColumns,
})
```

Expected:

```js
{
  viewportWidth: 390,
  scrollWidth: 390,
  quizHeights: [44, 44, 44, 44],
  stageColumns: '358px'
}
```

The exact single-column pixel width may differ with browser scrollbar handling;
the required condition is one Stage column with `scrollWidth ===
viewportWidth`.

- [ ] **Step 5: Commit the design contract**

```bash
git add DESIGN.md
git commit -m "docs: record the learn studio board"
```

- [ ] **Step 6: Land through the protected-main workflow**

From a clean worktree based on the latest `origin/main`, use the exact branch
name `codex/learn-studio-board`:

```bash
git push -u origin codex/learn-studio-board
pr_url=$(gh pr create --base main --head codex/learn-studio-board \
  --title "Redesign Learn as a Studio Board" \
  --body-file /tmp/ux-study-learn-studio-board-pr.md)
pr_number=${pr_url##*/}
gh pr merge --rebase --auto "$pr_number"
gh pr checks "$pr_number" --watch --interval 10
```

Create `/tmp/ux-study-learn-studio-board-pr.md` before running the command,
using `apply_patch`, with this exact content:

```md
## Summary
- turn the Learn overview into a Studio Board
- add a truthful Stage strip and labelled progress
- preserve independent Quiz access and report gating

## Verification
- `npm test`
- focused ESLint
- Impeccable layout detector
- Korean and English desktop/narrow browser checks
```

Expected: the protected `test` check passes, auto-merge lands the PR, and a
fresh
`gh pr view "$pr_number" --json state,mergedAt,statusCheckRollup`
reports `MERGED` with a successful `test` conclusion.
