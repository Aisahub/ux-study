---
name: ux-audit
description: Audit any screen or user flow for UI/UX defects against 26 named usability principles, and write findings a third person could verify. Use when asked to review, check, audit, critique, or inspect a UI, page, screen, form, or flow — "看看这个页面有什么问题", "UI 检查", "UX 审查", "review this screen", "usability audit", "why does this page feel off", "check the design". Launches the page in Chromium and measures contrast, font-size ranking, label spacing, line length, click affordances and interaction feedback, then filters out taste-based findings before reporting.
---

# UX audit

Audits a running screen against **26 named principles**, using measurements instead of taste. Distilled from the twelve-competency curriculum in the `ux-study` platform (Nielsen Norman Group sources).

The whole point is the last step: **most UI "review" output is preference wearing a principle's name.** This skill measures what can be measured, and puts every finding through a four-way filter that throws taste away.

**Set `$UXA` to this skill's own directory before running anything.** The skill lives in two places — a per-machine install at `~/.claude/skills/ux-audit/`, and a versioned copy committed inside the `ux-study` repo at `.claude/skills/ux-audit/`. This line picks whichever exists:

```bash
UXA=~/.claude/skills/ux-audit; [ -d "$UXA" ] || UXA="$(git rev-parse --show-toplevel)/.claude/skills/ux-audit"
```

Everything below uses `$UXA`, so it works from either. The repo copy is the backup and the record of how the checklist was derived; the home copy is what makes `/ux-audit` available in *other* projects. If you change one, copy it to the other.

## Pairs with `/browser-qa`

Different layers — run browser-qa **first**:

- **`/browser-qa` asks "is it broken?"** — console errors, 4xx/5xx, dead links, Core Web Vitals, WCAG violations, visual regression.
- **`/ux-audit` asks "is it well made?"** — hierarchy, wording, feedback timing, whether Back eats your input.

A page that 500s or has a dead nav doesn't need a hierarchy critique yet. Fix the broken thing, then audit the design. If browser-qa reports contrast/label WCAG violations, those are the same measurements this skill's `contrast` and `legibility` entries use — don't report them twice.

**For a logged-in screen, prefer `probe.mjs --session`** (see below) — it keeps the full 26-principle pack. Reach for browser-qa's live session only when you are already mid-flow in it and don't want to lose that state: paste `references/live-probe.js` into `browser_evaluate` for the four highest-signal measurements (largest text, faintest controls, links with no signifier, labels glued to the wrong field), verified to produce numbers identical to `probe.mjs` on the same page. It is a **partial** pass — say so rather than implying all 26 were checked.

## Setup (once per machine)

```bash
npm install --prefix "$UXA"
```

Installs Playwright into the skill directory. Chromium downloads on first run if it isn't cached.

## Run: static pass

For anything you can see standing still — hierarchy, contrast, type, spacing, affordances.

```bash
node "$UXA/probe.mjs" http://localhost:3000/orders --out /tmp/uxa/orders
```

Takes a URL, or a path to a local `.html` file. Writes into `--out`:

- `evidence.json` — every measurement, keyed by principle slug (`byPrinciple.contrast`, `byPrinciple.scale`, …)
- `desktop.png` — full-page screenshot
- `desktop-squint.png` — **blurred**. This is the squint test: detail drops away and only the hierarchy is left. If what survives isn't what the page is for, that's finding #1. **Always look at this one.**

Add `--mobile` for a 390×844 pass, `--wait MS` for slow-loading pages.

## Run: pages behind a login

**Most real screens are behind a sign-in, and a probe that starts signed out audits the login page and reports confidently on the wrong screen.** There are three ways in. Try them in this order.

### 1. Mint a session with the project's own test helper — preferred

A project with tests almost always has a way to make a signed-in session for a throwaway identity without a password. **Go and look for it before asking anyone for anything.** Search the repo for:

- a fixture helper — `sessionCookieFor`, `loginAs`, `authedRequest`, `createSession`
- a seed script — `db/seed*`, `scripts/seed*`, `prisma/seed*`, a `seed` npm script
- e2e auth setup — `*.setup.ts`, `globalSetup`, `storageState` in a Playwright config
- the test docs — `CONTRIBUTING.md`, `docs/`, `AGENTS.md`, `CLAUDE.md`

In `ux-study` it is `sessionCookieFor(email)` in `test/db.ts`, which inserts a row into `sessions` on the **test** branch and returns `session=<token>`. Its own comment states the intent: the OAuth handshake is deliberately not driven by tests, and *"a session row plus its cookie stands in for it"*.

Run that helper, then hand the probe what it returns:

```bash
node "$UXA/probe.mjs" http://localhost:3100/en/audit/1 --out /tmp/uxa/audit --cookie "session=<token>"
```

This is the best route on every count: **no password exists to be mishandled**, the identity is disposable, and it points at the test database rather than anyone's real one. Mint the session for an address that is obviously a probe (`ux-audit-probe@…`), never a real colleague's.

Check the app is pointed at its **test** database first. Auditing production data is a different and much more consequential act than auditing a test row.

### 2. Test credentials the repo itself provides

If the only route is the login form and the repo ships a test account for exactly that (a seeded `test@example.com` in a fixture or `.env.example`), driving the form with those is fine — they are test fixtures, not anyone's credentials. Never with a real person's login, never with credentials from a password manager, and never a value you had to ask a human to read out.

### 3. The person signs in themselves — for staging, production, or SSO

When there is no test path — an OAuth-only app, a staging environment, a real account — do this, once per app:

```bash
node "$UXA/probe.mjs" http://localhost:3000/login --save-session /tmp/uxa-auth.json
```

A **visible** browser opens. **The person at the keyboard signs in themselves** and navigates to the screen to be audited, then presses Enter in the terminal. Cookies and localStorage are saved to the file. No password is ever typed by, passed to, or visible to this script — it only carries the session that signing in produced. Never type someone's credentials on their behalf; open the window and hand it over.

Then every later run reuses it, with the full 26-principle pack intact:

```bash
node "$UXA/probe.mjs" http://localhost:3000/settings --out /tmp/uxa/settings --session /tmp/uxa-auth.json
```

**Always confirm you audited the right screen** — check `evidence.json`'s `title` and look at `desktop.png`. If it says "Sign in", the session expired; re-run `--save-session`.

The session file is a live login. Keep it in `/tmp`, never in the repo, and delete it when the audit is done.

## Run: interactive pass

Ten of the 26 principles are invisible in a screenshot — feedback, validation timing, error wording, whether Back eats your input. These need `--act`, a JSON list of steps:

```bash
cat > /tmp/act.json <<'JSON'
[
  {"do":"click","selector":"#check","label":"Does it acknowledge the wait?","settle":2500},
  {"do":"type","selector":"#email","value":"jr","label":"Half-typed email — premature-error probe"},
  {"do":"click","selector":"#continue","label":"Does the flagged error block anything?"},
  {"do":"click","selector":"#submit","label":"Submit invalid — read the rejection"},
  {"do":"click","selector":"#back","label":"Go back — is what I typed still there?"}
]
JSON
node "$UXA/probe.mjs" http://localhost:3000/book --out /tmp/uxa/book --act /tmp/act.json
```

`do` is `click` | `fill` | `type` | `press` | `wait` | `back` | `forward`. Each step records:

- `acknowledgedWithin300ms` — **the system-status answer.** `false` plus an empty `newTextAfterSettle` means the click did nothing visible at all.
- `newTextAt300ms` vs `newTextAfterSettle` — what it said immediately vs what it said in the end. Different questions.
- `textDisappeared` — catches Back wiping out entered values.
- `invalidFields` + `liveRegions` — validation state and the messages actually on screen.

A screenshot lands per step (`act-NN.png`) plus `after-interaction.png`.

## Report: the visual verdict leads

**This skill exists to judge whether a screen honours the visual principles.** Structural and accessibility findings — a missing `h1`, no `<main>` — are real and worth fixing, but they change nothing anyone can see, and a report that leads with them has quietly answered a different question than the one asked.

So every report opens with the visual verdict, in this order:

1. **视觉层级 / visual hierarchy — pass or fail, with `*-squint.png` as the evidence.** State it even when it passes. "No visual defect found, and here is the blurred render that says so" is a finding; silently omitting the line and filling the report with invisible fixes is not.
2. Then the rest of the A-group visual principles.
3. Then B-group (interaction) findings.
4. **Structural / accessibility findings last, labelled "not visible on screen".** Never present them as the audit's headline.

If the visual pass genuinely turns up nothing, say so plainly and hand over the squint image. **Do not manufacture a visible finding to fill the space** — a preference dressed as a principle is the one thing the four-way filter below exists to stop, and inventing one to satisfy a quota is the worst version of it.

## Then: walk the checklist

Read `references/checklist.md` and go through all 26 in order. Each entry gives the definition, where its evidence sits in `evidence.json`, the fail condition, and a sentence template.

**Tick = checked and found nothing wrong**, not "this principle exists". Don't skip a principle because the probe reported nothing — six of them are marked `[判断]` and are yours to judge from the screenshot or the text corpus.

## Finally: filter before reporting

Every finding needs four parts — **element** (named the way the screen names it, in the user's language), **principle** (a slug from the 26), **observation** (reproducible by a third party), **fix** (actionable).

Then label each one and drop two of the four kinds:

| | |
|---|---|
| **sound** | right, argued against the principle it names, actionable → **report** |
| **wrong-principle** | right element, right observation, wrong principle → **re-file and report** |
| **taste** | a preference wearing a principle's name; nothing said about what goes wrong for a reader → **discard** |
| **not-a-defect** | ordinary arrangement read as a fault; the proposed fix would introduce the defect it claims to find → **discard** |

The fastest taste test: **"what specifically goes wrong for the reader here?"** No answer, or "everything I've used does it differently" — that's taste.

For the three language/model principles (22–26), you must first write down **who the reader is** in one line. Whether a word is jargon is a fact about its readers, never about the word.

## Gotchas

- **Never rank `textContrast` and `fillVsSurround` against each other** — they are different quantities. Use `filledControls` (ranked by fill-vs-surround) and `flatControls` (ranked by text contrast), and compare a control only with its own peer group. On a real dashboard, one ladder put the page's loudest button 22nd of 89; sorting by the other number put it 64th of 90. Both numbers were correct and both rankings were fiction — the squint image settled it.
- **`textContrast: "unmeasurable-image-background"`** is not a bug. A gradient or photo behind the text has no single background colour, so any ratio would be fiction. Look at the screenshot instead. An earlier version reported `1.07` for white-on-gradient text, which was wrong and would have produced a false finding.
- **`consistency.synonymCandidates` over-reports by design.** It flags same-verb-family labels ("Export CSV" / "Download"), which catches the real defect but also pairs unrelated things ("Confirm selected orders" / "Save settings"). Confirm the two really are one job before reporting.
- **`liveRegions` only lists *visible* regions.** Hidden `role=alert` nodes hold last week's error text; reporting those invents a message nobody was shown.
- **`proximity` falls back to "the next control below"** when a `<label>` has no `for`. That's deliberate — it's how a reader reads it — but it means the `ownField` guess can be wrong in exotic layouts. `readsAsCaptionForFieldAbove: true` is the signal that matters.
- **`charsPerLine` assumes ~0.5em per latin glyph.** For CJK text it under-counts; judge from the screenshot.
- **The squint image is viewport-only, not full-page.** Full-page blur costs a lot and blurs across scroll seams. Re-run with `--wait` and scroll if you need a lower section.
- **Use `{"do":"back"}` for way-back-and-control, never a link that points at the previous screen.** Clicking such a link is navigation, not going back: it drops whatever state the URL carried, and you will report a filter-loss defect the product does not have.
- **Static pass alone cannot judge B-group principles.** Reporting "no status feedback" from a screenshot is guessing. Run `--act` or say the principle was not checked.
- **browser-qa's MCP blocks the `file:` protocol** — `Access to "file:" protocol is blocked`. To audit a local HTML file through a browser-qa session, serve it first (`python3 -m http.server 8791` in its directory). `probe.mjs` has no such restriction and takes a bare path.
- **`probe.mjs` starts a fresh browser with no cookies** unless `--session` is given. Verified on a gated fixture: without it the probe reported `largest text: "Please sign in"`; with it, `"Dashboard"` and a payout button at contrast 1.17. Always check `evidence.json`'s `title` is the screen you meant.
- **Look for the project's test-session helper before asking a human for anything.** Route 1 above is faster, more repeatable, and involves no credential at all. Asking someone to sign in when the repo already ships `sessionCookieFor` is wasted effort.
- **Never sign in as a real person.** Route 3 exists so the person at the keyboard types their own password into their own browser window. Don't ask for someone's credentials, don't paste them into a form, don't put them in an `--act` script, and don't read them out of a password manager or a secrets file.
- **Confirm which database the app is pointed at** before auditing a signed-in screen. A minted session on a test branch is a throwaway row; the same trick against production is not.
- **`evidence.json`'s `consoleMessages` is not a smoke test.** It only catches what the page logs itself. Headless Chromium doesn't even request `favicon.ico`, so browser-initiated 404s never appear — on the same page browser-qa reported 1 console error and this probe reported 0, and browser-qa was right. Don't claim a page is error-free on this field; that's browser-qa's job.
- **`collect.js` is the single source of truth** for the measurements; `probe.mjs` reads it at runtime rather than holding its own copy. `references/live-probe.js` is a deliberately trimmed sibling for hand-pasting — if you change a formula, change it in both or the two routes will disagree.

## Troubleshooting

**`Cannot find package 'playwright'`** — the install step wasn't run. `npm install --prefix "$UXA"`.

**`browserType.launch: Executable doesn't exist`** — browser binary missing for this Playwright version:
```bash
npx --prefix "$UXA" playwright install chromium
```

**`page.goto: net::ERR_CONNECTION_REFUSED`** — the dev server isn't up. Start it first; this skill does not launch app servers.

**`--act` step reports `error: ...Timeout 5000ms exceeded`** — the selector didn't match. The step is recorded with the error and the run continues, so read `evidence.json` and fix the selector rather than assuming the app broke.

**Every contrast reads as pure black on white** — the page hadn't painted yet. Raise `--wait`.

## Validation

The driver was built against the `ux-study` practice pages, which carry manifests of deliberately planted defects. It surfaces **6/6** of the Stage 1 planted defects (contrast, scale, proximity, readability, consistency, signifier) and the Stage 2 interaction defects (appropriate-feedback, premature-error, inline-validation, error-recovery, undo) via `--act`.

```bash
node "$UXA/probe.mjs" \
  <ux-study>/content/practice-page/stage-1/en.html --out /tmp/uxa/stage1
```
Expected: `largest text on page: "09:12" @ 40px` and `faintest control: "Confirm selected orders" @ contrast 2.19` — both planted.

The browser-qa route was cross-checked against the same page (served over HTTP, since `file:` is blocked there) and returned identical figures — contrast `2.19`, `09:12` @ 40px, `tax-invoice-link` with no signifier, and the two labels with `gapAbove: 4` against `gapOwn: 16`.
