#!/usr/bin/env node
// UX audit evidence probe.
//
// Loads a screen in Chromium and returns the *measurements* an auditor would
// otherwise have to eyeball: contrast ratios, the font-size ranking, label
// gaps, line lengths, link affordances, control inventories. It does NOT
// decide what is a defect — it hands back numbers a reader can argue with.
//
//   node probe.mjs <url> [--out DIR] [--mobile] [--act FILE] [--wait MS]
//   node probe.mjs <url> --save-session auth.json   # sign in yourself, once
//   node probe.mjs <url> --session auth.json        # then audit signed in
//
// Every measurement is tagged with the Principle slug it feeds, so the agent
// reading evidence.json can walk the checklist in order.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const argv = process.argv.slice(2);
if (!argv.length || argv[0].startsWith('-')) {
  console.error([
    'usage: node probe.mjs <url|file> [options]',
    '  --out DIR            where evidence.json and screenshots go',
    '  --mobile             390x844 pass instead of 1280x900',
    '  --wait MS            settle time after load (default 600)',
    '  --act FILE           JSON step list for the interactive pass',
    '  --save-session FILE  open a visible browser, you sign in, save the session',
    '  --session FILE       reuse a saved session so the audit runs signed in',
    '  --cookie "a=1; b=2"   inject a session cookie the project minted for testing',
  ].join('\n'));
  process.exit(2);
}
const flag = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1]; };
const has = (n) => argv.includes(n);

let target = argv[0];
if (!/^https?:|^file:/.test(target)) target = 'file://' + resolve(target);
const outDir = resolve(flag('--out', './ux-audit-out'));
const settle = Number(flag('--wait', 600));
const viewport = has('--mobile') ? { width: 390, height: 844 } : { width: 1280, height: 900 };
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------- in-page ---
// Runs inside the document. Everything here is measurement, not judgement.
const COLLECT_SRC = readFileSync(new URL('./collect.js', import.meta.url), 'utf8');

// ------------------------------------------------------------------ drive ---
// Most real screens sit behind a login, so a probe that always starts signed
// out audits the login page and reports confidently on the wrong screen.
//
// --save-session opens a VISIBLE browser and waits: the person signs in
// themselves, presses Enter, and the resulting cookies and localStorage are
// written to a file. Nobody's password is ever typed by, passed to, or visible
// to this script — it only carries the session that signing in produced.
// --session then replays that file, so every later run starts signed in.
const sessionFile = flag('--session', null);
const saveSession = flag('--save-session', null);

const browser = await chromium.launch({ headless: !saveSession });
const ctx = await browser.newContext({
  viewport, deviceScaleFactor: 2, reducedMotion: 'no-preference',
  ...(sessionFile && existsSync(resolve(sessionFile)) ? { storageState: resolve(sessionFile) } : {}),
});
// A project's own test suite almost always has a way to mint a signed-in
// session for a throwaway identity — a seed script, a fixture helper, a
// `sessionCookieFor(email)`. That is the cheapest and safest way in: it needs
// no password, invents no account, and points at the test database rather than
// anyone's real one. --cookie takes what that helper returns, in Cookie-header
// form ("session=abc" or "a=1; b=2").
const cookieArg = flag('--cookie', null);
if (cookieArg) {
  const origin = new URL(target).origin;
  await ctx.addCookies(cookieArg.split(';').map((pair) => {
    const i = pair.indexOf('=');
    if (i === -1) throw new Error(`--cookie needs name=value, got: ${pair.trim()}`);
    return { name: pair.slice(0, i).trim(), value: pair.slice(i + 1).trim(), url: origin };
  }));
}

const page = await ctx.newPage();

if (saveSession) {
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
  console.error(`\n  A browser window is open at ${target}`);
  console.error('  Sign in there yourself, navigate to the screen you want audited,');
  console.error('  then press Enter here to save the session.\n');
  await new Promise((r) => { process.stdin.resume(); process.stdin.once('data', r); });
  await ctx.storageState({ path: resolve(saveSession) });
  console.error(`saved session -> ${resolve(saveSession)}`);
  console.error('Re-run with --session <file> to audit signed in. This file holds a live');
  console.error('login: keep it out of the repo and delete it when the audit is done.');
  await browser.close();
  process.exit(0);
}

const console_ = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console_.push(`${m.type()}: ${m.text()}`.slice(0, 300)); });
page.on('pageerror', (e) => console_.push('pageerror: ' + String(e).slice(0, 300)));

await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 }).catch(async () => {
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
});
await page.waitForTimeout(settle);

const evidence = await page.evaluate(`${COLLECT_SRC}; collectUxEvidence()`);
evidence.consoleMessages = console_;
evidence.capturedAs = has('--mobile') ? 'mobile' : 'desktop';

const shot = join(outDir, `${evidence.capturedAs}.png`);
await page.screenshot({ path: shot, fullPage: true });

// The squint test, from the visual-hierarchy course: blur the detail away and
// see what survives. If it isn't what the page is for, that's the first fix.
await page.addStyleTag({ content: 'html{filter:blur(4px)!important}' });
const squint = join(outDir, `${evidence.capturedAs}-squint.png`);
await page.screenshot({ path: squint, fullPage: false });
await page.addStyleTag({ content: 'html{filter:none!important}' });

// --- interactive pass: the Stage 2 principles you cannot see standing still ---
// --act takes [{"do":"click|fill|press","selector":"...","value":"...","label":"..."}]
evidence.interactions = [];
const actFile = flag('--act', null);
if (actFile) {
  const steps = JSON.parse(readFileSync(resolve(actFile), 'utf8'));
  for (const [i, s] of steps.entries()) {
    const before = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    const t0 = Date.now();
    let error = null;
    try {
      if (s.do === 'click') await page.click(s.selector, { timeout: 5000 });
      else if (s.do === 'fill') await page.fill(s.selector, s.value ?? '', { timeout: 5000 });
      else if (s.do === 'type') await page.type(s.selector, s.value ?? '', { delay: 60, timeout: 5000 });
      else if (s.do === 'press') await page.press(s.selector, s.value ?? 'Enter', { timeout: 5000 });
      else if (s.do === 'wait') await page.waitForTimeout(Number(s.value ?? 500));
      // The browser's own Back is the only honest way to test way-back-and-control:
      // clicking a link that happens to point at the previous screen is navigation,
      // not going back, and it silently drops whatever state the URL was carrying.
      else if (s.do === 'back') await page.goBack({ waitUntil: 'domcontentloaded' });
      else if (s.do === 'forward') await page.goForward({ waitUntil: 'domcontentloaded' });
    } catch (e) { error = String(e).split('\n')[0].slice(0, 200); }

    // What the interface said in the first 300ms is the system-status answer;
    // what it said by the end is the outcome. They are different questions.
    await page.waitForTimeout(300);
    const at300 = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    await page.waitForTimeout(Math.max(0, (s.settle ?? 1200) - 300));
    const after = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));

    const diff = (a, b) => { const A = new Set(a.split(/(?<=[.!?])\s|\s{2,}/)); return b.split(/(?<=[.!?])\s|\s{2,}/).filter((x) => x.trim() && !A.has(x)).slice(0, 8); };
    const shotPath = join(outDir, `act-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    evidence.interactions.push({
      step: i + 1, label: s.label || `${s.do} ${s.selector}`, action: s, error,
      elapsedMs: Date.now() - t0,
      acknowledgedWithin300ms: at300 !== before,          // system-status / appropriate-feedback
      newTextAt300ms: diff(before, at300),
      newTextAfterSettle: diff(before, after),
      textDisappeared: diff(after, before),
      screenshot: shotPath,
      // Only regions the user can actually see right now. A hidden node still
      // holds last week's error text, and reporting it as "the interface said
      // this" invents a message nobody was shown.
      liveRegions: await page.evaluate(() => [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')]
        .filter((el) => {
          const r = el.getBoundingClientRect(), s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05;
        })
        .map((el) => ({ role: el.getAttribute('role') || el.getAttribute('aria-live'), text: (el.innerText || '').trim().slice(0, 200) })).filter((x) => x.text)),
      invalidFields: await page.evaluate(() => [...document.querySelectorAll('[aria-invalid=true],:invalid')]
        .filter((el) => el.matches('input,select,textarea')).map((el) => el.id || el.name || el.tagName)),
    });
  }
  const final = join(outDir, 'after-interaction.png');
  await page.screenshot({ path: final, fullPage: true });
  evidence.finalScreenshot = final;
}

writeFileSync(join(outDir, 'evidence.json'), JSON.stringify(evidence, null, 2));
await browser.close();

const p = evidence.byPrinciple;
console.log(`probed  ${evidence.url}`);
console.log(`out     ${outDir}`);
console.log(`shots   ${shot}\n        ${squint}${evidence.finalScreenshot ? '\n        ' + evidence.finalScreenshot : ''}`);
console.log(`counts  ${p['cognitive-load'].interactiveCount} interactive · ${p['smart-defaults'].length} fields · ${p.readability.length} text blocks · ${p['cognitive-load'].distinctFontSizes.length} font sizes`);
console.log(`largest text on page: "${(p.scale[0] || {}).text}" @ ${(p.scale[0] || {}).fontSize}px`);
console.log(`faintest control:     "${(p.contrast[0] || {}).text}" @ contrast ${(p.contrast[0] || {}).textContrast}`);
