---
name: ux-study
description: An internal UX learning platform whose overview page is a route diagram, not a course dashboard.
colors:
  ground: "#EEF2F5"
  surface: "#FFFFFF"
  surface-sunk: "#F4F8F9"
  sand: "#E1D0B3"
  blue-grey: "#9BB4C0"
  khaki: "#A18D6D"
  oxblood: "#703B3B"
  ink: "#2E2723"
  ink-secondary: "rgba(46,39,35,.72)"
typography:
  display:
    fontFamily: "Gowun Batang, Nanum Myeongjo, serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Gowun Batang, Nanum Myeongjo, serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gowun Batang, Nanum Myeongjo, serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.008em"
  body-sm:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.008em"
  label:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
  micro:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  card: "22px"
  badge: "14px"
  pill: "999px"
spacing:
  gap: "14px"
  inset: "22px"
  card: "26px"
  page: "26px"
components:
  button-primary:
    backgroundColor: "{colors.oxblood}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "15px 26px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  card-warm:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 17px"
---

# Design System: ux-study

## Overview

**Creative North Star: "The Line"**

A metro route diagram, not a course dashboard. The programme is self-paced with no deadline, which makes drop-out — not difficulty — the way it fails. A route diagram is the object that answers, without being read, the only three questions a returning Learner has: where am I, what is next, how much is left. It also has no leaderboard: a line gives you a position, never a rank.

The surface it is drawn on is glass over a soft colour field: blue-grey and sand blooms lie on a near-white page, a frosted panel floats over them and lets the colour read through, and white cards float above the frost. The warmth is rationed on purpose: a single sand card per screen carries the one thing the Learner should do next. The colour lives in the atmosphere, not on the working surfaces.

This is an Operate world. Its Learners are working developers and PMs between tickets, and half of them are reading Korean while the other half read English. Expression never outranks the task, the state, or the familiar affordance. What carries the identity instead is precision: the rhythm of the spacing, the exactness of the station marks, the fact that every element on the page belongs to a container.

Confirmed anti-references: the LMS dashboard (progress ring, module card grid, streak counter, big "continue" CTA) and heavy-bordered enterprise form chrome. Both were considered and rejected.

**Key Characteristics:**
- Glass over a soft blue-grey-and-sand colour field; at most one warm card per screen
- Serif Korean display over sans body — the only decorative move in the system
- Depth, never lines: no borders anywhere
- Every status reads three ways at once — colour, shape, and words
- Light only; there is no dark theme

## Colors

Muted and papery: a cool blue-grey world with a single warm field and one deep red that means "you can act here".

### Primary
- **Oxblood** (`#703B3B`): The action colour. Primary buttons, the travelled part of the route line, a passed station's filled dot, the active navigation icon, the language currently in use. It carries text on white at 8.8:1 and on sand at 5.8:1.

### Secondary
- **Aged Sand** (`#E1D0B3`): The one warm field, spent only on the next thing to do. One sand card per screen, never two.

### Tertiary
- **Station Blue-Grey** (`#9BB4C0`): Everything real but not yet reached — unvisited station rings, the dotted line ahead, the ring on a not-yet badge, the marks beside an "in preparation" row. It fills no card: a not-yet-open card is white and says so in words. It is also the largest bloom of the colour field behind the glass.

### The colour field
The page is not a flat fill; it is a soft field of four radial blooms the frosted board floats on and shows through: blue-grey (`rgb(155 180 192)`) top-left and bottom-left, sand (`rgb(225 208 179)`) top-right, and a warm oxblood haze (`rgb(112 59 59 / 0.18)`) bottom-right, over a near-white base (`#EEF2F5`). This is where the world's blue-grey and sand live now — behind glass, not painted flat. It is `fixed`, so scrolling content passes over a still field.

### Neutral
- **Board** (`rgb(255 255 255 / 0.32)` + `blur(22px) saturate(1.5)`): The one frosted-glass surface the whole app sits on. Translucent on purpose — the colour field reads through it, softened. It runs to every viewport edge, so it is neither rounded nor shadowed: there is no edge to round. Its own `14px` inset is the breathing space the glass shows above, below and beside the content.
- **Card** (`#FFFFFF`): Every reading surface. Opaque, so cards read as solid objects floating above the frosted board.
- **Sunk** (`#F4F8F9`): Inset chips inside a card — station numbers, counters.
- **Ink** (`#2E2723`): All body copy, at 14.2:1 on white.
- **Ink 72%**: Secondary copy on white only, at 5.9:1.
- **Khaki** (`#A18D6D`): Small icons and hairline dividers. **Never text** — 3.2:1 on white fails AA at any size.

### Named Rules

**The One Warm Field Rule.** At most one sand surface per screen, and it is always the single next action. A second sand card is a bug: it means the screen has stopped saying what to do next. Some screens carry none. Inside an open Gate Quiz the next action is the item itself. The Learn overview also carries none because its four Stage 1 Competencies are independent entry points; a warm field there would invent an order that the programme does not have.

**The One Coloured Card Rule.** At most one card on any screen carries a fill. Every other card is white. Colour is scarce here on purpose — a screen with two filled cards has spent the budget that makes the next action obvious.

**The Headings Are Ink Rule.** Every heading, at every level, is ink. Not oxblood, not khaki. A coloured heading spends the action colour on something you cannot act on, and once headings are coloured the button stops being the loudest thing on the screen.

**The Oxblood Means Two Things Rule.** Deep red marks only (a) something you can act on, and (b) something you have already passed. It is never decoration, never a heading, never a border.

**The Unreadable Two Rule.** Khaki and blue-grey never carry text. Blue-grey may hold ink at any size (6.8:1) but never white (2.2:1) and never small oxblood (4.1:1 — large text only). Check the pair before inventing a new combination.

## Typography

**Display Font:** Gowun Batang (with Nanum Myeongjo, then the platform's Korean serif)
**Body Font:** Pretendard, self-hosted (SIL OFL) in Regular 400 and Bold 700 only

**Character:** A Korean serif over a Korean workhorse sans. The serif is the only ornament the system permits, and it earns its place by carrying both scripts at display size without either looking like the afterthought — which a Latin display serif paired with a Korean fallback cannot do.

### Hierarchy

Seven steps, and no eighth. The first draft of this system used thirteen sizes between 10.5px and 44px — most of them one-offs invented at the moment they were needed. That is not a scale, and a platform that teaches Consistency cannot ship one.

- **Display** (serif, 700, 44px, 1.1, -0.02em): The page title. One per screen.
- **Headline-lg** (serif, 700, 34px, 1.15, -0.02em): The next-action card's subject. One per screen at most.
- **Headline** (serif, 700, 25px, 1.2, -0.015em): Card titles.
- **Title** (sans, 700, 16px, 1.4, -0.015em): Row names — a competency inside a list. Same size as body; the weight is the difference.
- **Body** (sans, 400, 16px, 1.55, -0.008em): Prose. Objectives wrap at roughly 56ch.
- **Body-sm** (sans, 400, 13.5px, 1.55): Supporting lines — a row's one-line objective, a station's label, breadcrumbs, the standing visibility notice.
- **Label** (sans, 700, 12px, 1.4): Status words, counts, chips, station meta.
- **Micro** (sans, 700, 11px, 0.2em, usually uppercase): Kickers above a card title, English competency names under their Korean name.

### Named Rules

**The Two Weights Rule.** The body face ships Regular (400) and Bold (700) and nothing between. A Korean weight costs ~262KB, so a third was not bought; anything else the code asks for is synthesised by the browser into a stretched fake bold, which Hangul shows badly. Weights 500, 600 and 800 do not exist in this system.

**The Seven Steps Rule.** Every piece of type on every screen is one of the seven steps above. A size that is not on the list is not a smaller heading; it is an unfinished decision. If a case genuinely needs an eighth, add it here first.

**The White-Only Fade Rule.** Faded text (ink at 72%) is allowed on white cards and nowhere else. On the blue-grey ground the same value drops to 3.6:1 and fails; there, secondary text stays full ink and separates by weight instead.

**The Two-Script Rule.** Every heading and label must survive both Korean and English at the same box width. Korean runs shorter and taller; English runs longer and flatter. If a layout only works in one of them, it is not finished.

## Layout

A glass stack, outermost first: the colour field (page) → a frosted board filling the viewport (translucent white + `blur(22px)`, `14px` inset, no radius, no shadow) → a brighter frosted bed (`22px` radius, `22px` padding) → opaque white cards (`22px` radius, `26px` padding). The board's translucency is load-bearing — it is what makes the colour read through as glass; do not make it opaque. The page itself carries no padding: the board is the background, so anything outside it would read as a margin around the app rather than as the app.

Paired cards share a row. The working area is one grid, not two stacked columns — the route card and the next-action card are row one, the station list and what-comes-next are row two — so each pair's cards are the same height, the way the reference lays its media block against its sidebar. A stretched card puts its action at the foot rather than leaving a hole beneath it.

Content sits in a `1240px`-wide centred column with a `26px` page margin. A two-column layout runs `78px` navigation rail | content, both on the frosted board; the content column is inset `22px` off the board's edges. The Learn overview narrows its programme directory to a centred `896px` (`max-w-4xl`) reading column so its rows remain scannable on a wide desktop.

**A directory is a column; an attempt is a column.** The Learn overview is one centred directory: Stage 1 expands its independent Competencies and their Gate Quiz actions, while Stage 2 and Stage 3 use the same heading structure and remain collapsed as `In preparation`. The three Gate Quiz surfaces are also single columns: the doorstep and the verdict use `720px`, and the wizard `880px`. A quiz is one thread with one thing to decide at a time. The wizard is wider because a drawn screen is being examined rather than read; prose inside its card is still held to the `56ch` reading measure.

One spacing rhythm throughout: `14px` between siblings, `22px` content inset off the board, `26px` inside a card. More space above a heading than below it.

Desktop and mobile are equally primary. On narrow screens the rail becomes a bottom bar, the two columns stack with the next-action card first, and the route line turns vertical — stations run top to bottom with the position marker still the only pointing element on the screen.

## Elevation & Depth

This system separates surfaces with **depth and translucency**. There are no borders on any container — not on cards, chips, pills, badges, or the navigation rail. One frosted board floats on the colour field; opaque white cards are lifted above it. The board takes a bright top sheen (light catching glass); the cards take a soft drop.

Every lift is a stack of at least two shadows: a short, comparatively dark **contact** shadow that makes the edge read as an edge, and a wide, very light **ambient** shadow that says how high the surface floats. A single wide blur was tried and rejected — with no contact layer the eye has nothing exact to land on, and the boundary reads as fog.

### Shadow Vocabulary
- **Card lift** (`0 1px 2px rgba(28,44,52,.13), 0 4px 8px rgba(28,44,52,.07), 0 14px 26px rgba(28,44,52,.06)`): Every white card.
- **Warm card lift** (`0 1px 2px rgba(74,46,30,.16), 0 4px 8px rgba(74,46,30,.09), 0 14px 26px rgba(74,46,30,.08)`): The sand card. Warmer and one step stronger — a shadow on a tinted surface reads weaker than the same shadow on white.
- **Pill lift** (`0 1px 2px rgba(28,44,52,.12), 0 3px 6px rgba(28,44,52,.06)`): Chips, the language switcher, the account pill, rail icons.

### Named Rules

**The No-Line Rule.** No container in this system has a border. If an edge is unclear, the fix is a deeper contact shadow or a wider value gap between the surfaces — never a stroke. A drawn line reads as a form; this is an app.

**The Contact Layer Rule.** Every shadow declaration includes a layer at `≤2px` blur. A shadow without one is fog, not elevation.

## Shapes

Generously rounded and consistently so: `22px` on cards, `30px` on the outer frame, `14px` on the small inset badges, fully round on anything that behaves like a control — buttons, chips, the language switcher, the account pill, rail icons. The rule is behavioural rather than decorative: **if you can press it, it is a pill; if it holds content, it is a `22px` rectangle.**

Station marks are the one place geometry carries meaning. A passed station is a filled circle, the current one a half-filled circle, an unvisited one a hollow ring, and the terminus — the Self-Audit Report — a rounded square holding a drawn sheet of paper. Shape is doing real work there — see the Do's.

The terminus was a rotated square until 2026-07-24. Geometry alone said "a different kind of stop" without saying which kind, and in the station list, where the four Competencies wear numbered rounded badges, a fifth rounded badge standing on its corner read as one more of the same. The report now carries one mark, and carries it identically on the line and in the list.

## Components

### Buttons
- **Shape:** Fully round (`999px`).
- **Primary:** Oxblood ground, white label, `15px 26px`, full width inside its card. A trailing `small` carries a quiet detail ("5문항") at 72% opacity.
- **Hover / Focus:** Oxblood deepens; focus shows a visible ring — never removed, this platform teaches keyboard operability.
- There is no secondary button. A screen has one action; anything else is a link.

### Chips
- **Style:** White pill, `9px 17px`, pill lift, `12.5px/600` label with a `15px` khaki-stroked icon. Numerals inside a chip go bold and oxblood.
- **Use:** Read-only facts about the page — competency count, last activity, steps complete. Chips are never controls.

### Cards / Containers
- **Corner Style:** `22px`.
- **Background:** White by default; sand only when a screen has one unambiguous next action. What is real but not yet open is a white card whose marks and words say so.
- **Shadow Strategy:** See Elevation. Tinted cards take the warmer/stronger stack.
- **Border:** None. Ever.
- **Internal Padding:** `26px`.

### Navigation
- **Rail:** A `78px` column of `44px` circular icon buttons on white pills, the active one filled oxblood with a white glyph. Labels live in `aria-label`, not on screen.
- **Language switcher:** A white pill holding two segments; the current language is an oxblood pill with white text, the other is plain ink. It navigates to the counterpart of the current page, never to a section root.
- **Mobile:** The rail becomes a bottom bar with the same marks.

### Route Line (signature component)
The Gate Quiz's progress indicator. A horizontal run of stations uses a `4px` solid oxblood line before the current position and a `4px` dotted blue-grey line after it. Stations are `24px` marks: filled oxblood when answered and hollow blue-grey when unanswered. A `현재 위치` marker sits above the current item and is the only pointing element permitted on the page: the label is set in a sunk chip, with its point drawn rather than typed.

In a Gate Quiz the same line carries the five drawn items; an unanswered item is a hollow station the Learner can click to return to. Movement between items is a hard cut — a train arrives at the next station, it does not dissolve into it.

Two channels there, saying two different things. The **mark** says whether that item has been answered — filled oxblood if it has, a hollow blue-grey ring if it has not — and every station is clickable, answered or not, so checking an earlier answer does not mean stepping back one item at a time. The **line** says where the Learner is standing: solid up to the marker, dotted after it. They come apart on purpose, because a Learner can be on item 5 with item 2 still blank, and one channel cannot draw both. No half-filled mark appears here: "current" is what the `현재 위치` marker is for, and having the mark say it too would leave an answered item that happens to be current looking less finished than the one before it.

## Do's and Don'ts

### Do:
- **Do** encode every status three ways at once — colour, shape, and words. A passed station is oxblood **and** filled **and** labelled `통과`. This platform teaches that colour alone is unreadable to some Learners; it may not fail its own lesson.
- **Do** use a sand field only when the screen has one unambiguous next action.
- **Do** give every element a container. A control floating directly on the ground with no surface of its own is unfinished.
- **Do** pair each shadow with a `≤2px` contact layer.
- **Do** show work that does not exist yet as explicitly "not yet open" (`준비 중`), in blue-grey. Stage 2 and Stage 3 are real commitments with no content written; the interface says exactly that.
- **Do** check any new colour pairing against the measured table in Colors before using it.

### Don't:
- **Don't** draw a border on a container.
- **Don't** put text on khaki or white text on blue-grey.
- **Don't** fade text on the blue-grey ground; use full ink and change the weight.
- **Don't** add a second pointing element to a screen. One `현재 위치` marker, no arrows, no pulsing dots.
- **Don't** introduce a dark theme. This world is light-only, confirmed 2026-07-23.
- **Don't** add badges, streaks, trophies, confetti, or any per-person total. PRODUCT.md forbids ranking; this system forbids the visual vocabulary that leads back to it.
- **Don't** use blur or reduced legibility to represent "locked" or "not yet". Unavailable is stated in words, never simulated as an impairment.
