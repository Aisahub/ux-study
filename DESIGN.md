---
name: ux-study
description: An internal UX learning platform whose overview page is a Studio Board, not a course dashboard.
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
    fontSize: "13.5px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
  micro:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "13.5px"
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

**Creative North Star: "The Studio Board"**

A working board, not a course dashboard. The programme is self-paced and its
Stage 1 Competencies may be learned in any order. The board first shows the
whole programme, the open Stage, and total progress; beneath that, each
Competency is a practical task panel with its own learning and Gate Quiz
actions. The structure answers the returning Learner's questions without
inventing a prescribed next course or ranking anyone.

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

Eight steps, and no ninth. The first draft of this system used thirteen sizes between 10.5px and 44px — most of them one-offs invented at the moment they were needed. That is not a scale, and a platform that teaches Consistency cannot ship one.

(This section said "seven steps, and no eighth" until 2026-07-28 while listing eight. The rule below was named after the miscount, and an audit found the ninth step it was supposed to prevent had already shipped — 11px regular in the standing visibility notice. A rule whose own name cannot count is not a rule; both are corrected here.)

- **Display** (serif, 700, 44px, 1.1, -0.02em): The page title. One per screen.
- **Headline-lg** (serif, 700, 34px, 1.15, -0.02em): The next-action card's subject. One per screen at most.
- **Headline** (serif, 700, 25px, 1.2, -0.015em): Card titles.
- **Title** (sans, 700, 16px, 1.4, -0.015em): Row names — a competency inside a list. Same size as body; the weight is the difference.
- **Body** (sans, 400, 16px, 1.55, -0.008em): Prose. Objectives wrap at roughly 56ch.
- **Body-sm** (sans, 400, 13.5px, 1.55): Supporting lines — a row's one-line objective, a station's label, breadcrumbs, the standing visibility notice.
- **Label** (sans, 700, 13.5px, 1.4): Status words, counts, chips, station meta. Body-sm's size; the weight and the tighter line box are the difference. (Raised from 12px on 2026-07-29, because 12px was the hardest thing on the platform to read at arm's length and it carried every status word, count and chip — which a platform teaching Readability cannot ship. Raising the step rather than exempting a call site is what kept it one decision: the scale is still eight named steps, now over **five** distinct sizes — 44, 34, 25, 16, 13.5 — and Label pairs with Body-sm exactly as Title pairs with Body. Micro was raised to 13.5 in the same decision, so Body-sm, Label and Micro now share a size and are separated by weight, tracking and case alone.)
- **Micro** (sans, 700, 13.5px, 0.2em, usually uppercase): Kickers above a card title, English competency names under their Korean name. (Raised from 11px on 2026-07-29, in the same decision as Label. 11px was the platform's actual type floor — smaller than the step raised above it — so leaving it would have moved the complaint rather than answered it. The tracking and the case, not the size, are what set a kicker apart now. This step also had no token users at all until this change: all three call sites wrote `text-[11px]` by hand, so `--text-micro` was declared and unread, which is exactly how a step drifts without anyone deciding to move it.)

### Named Rules

**The Two Weights Rule.** The body face ships Regular (400) and Bold (700) and nothing between. A Korean weight costs ~262KB, so a third was not bought; anything else the code asks for is synthesised by the browser into a stretched fake bold, which Hangul shows badly. Weights 500, 600 and 800 do not exist in this system.

**The Fixed Scale Rule.** Every piece of type on every screen is one of the eight steps above. A size that is not on the list is not a smaller heading; it is an unfinished decision. If a case genuinely needs a ninth, add it here first.

The steps are tokens, not numbers retyped at each call site: `text-display`, `text-headline-lg`, `text-headline`, `text-title`, `text-body`, `text-body-sm`, `text-label`, `text-micro`, declared once in `app/globals.css`. Each carries its own size, line height and letter spacing; weight stays an explicit `font-bold` so the two never fight over which declaration wins. A written-down scale cannot refuse an addition — that is how the ninth step arrived unnoticed — and a utility can.

Until 2026-07-29 this described an intention rather than the build: 47 type sizes were still written as bare `px` at the call site, and the Label change had to be made twice — once in the token, once by hand in every place that had copied the number out of it. They are all tokens now, and `grep -rn "text-\[[0-9.]*px\]" app lib` returning nothing is the check that keeps it that way. Two conversions moved a rendered value rather than preserving one, and are noted as such: nine button and link labels were set at the browser's default line height, which is not a step, and are now `title`; the Gate Quiz station label is now `label`, the step this document already assigns to station meta.

**The Reader's Size Rule.** The scale is declared in `rem`, against the reader's own browser default. At the default setting 1rem is 16px and every step renders at the pixel size listed above, so nothing moves for anyone who has not asked it to. A Learner who has raised their browser's default font size gets a page that answers. Accessibility is a Stage 3 Competency here; a scale nailed to px ignores the one accessibility preference a reader sets before they ever arrive. Fixed `px` in a type size is now a defect, not a shorthand.

**The White-Only Fade Rule.** Faded text (ink at 72%) is allowed on white cards and nowhere else. On the blue-grey ground the same value drops to 3.6:1 and fails; there, secondary text stays full ink and separates by weight instead.

**The Two-Script Rule.** Every heading and label must survive both Korean and English at the same box width. Korean runs shorter and taller; English runs longer and flatter. If a layout only works in one of them, it is not finished.

## Layout

A glass stack, outermost first: the colour field (page) → a frosted board filling the viewport (translucent white + `blur(22px)`, `14px` inset, no radius, no shadow) → a brighter frosted bed (`22px` radius, `22px` padding) → opaque white cards (`22px` radius, `26px` padding). The board's translucency is load-bearing — it is what makes the colour read through as glass; do not make it opaque. The page itself carries no padding: the board is the background, so anything outside it would read as a margin around the app rather than as the app.

A working stack is never split into two columns of unlike cards. Cards may share a row only when they are peers of one kind and carry no order between them — the three Stage cards on the Learn overview are the case that qualifies, and a row is right for them precisely because Stage 1, 2 and 3 are being compared rather than stepped through. Everything else reads down one column. Two side-by-side arrangements survive that rule, and neither is a sequence laid out sideways: the Self-Audit Report's, which is two *surfaces* — the Practice Page and the report drawer — rather than two columns of one page (last paragraph of this section), and the Gate Quiz item card, which is one card holding the drawn screen beside the question about it. Both are the same relationship: something being examined, and what the Learner does about it, kept in view at once. Neither has an order a row could get wrong, because the eye is meant to cross between them continuously rather than finish one and start the other.

The paired-card grid, which used to hold a content card beside its action card, was removed from the Competency page on 2026-07-28. Reading order forks at the top of every row, so a grid cannot say that one card comes after another: it had put the Gate Quiz — the last step of that page — second on a wide screen, and on a phone `order-first` handed the Learner the assessment before the article it examines. Where cards are a sequence, the sequence has to be the layout.

Content sits in a `1240px`-wide centred column with a `26px` page margin. A two-column layout runs `78px` navigation rail | content, both on the frosted board; the content column is inset `22px` off the board's edges. The Learn overview narrows its programme directory to a centred `896px` (`max-w-4xl`) reading column so its rows remain scannable on a wide desktop.

**A board is a column; a Competency is a column; an attempt is a column.** The
Learn overview is one centred Studio Board: all three Stages establish the whole
route first, then Stage 1 expands into independent Competency task panels and
their Gate Quiz actions. Stage 2 and Stage 3 use the same information structure
and remain non-interactive as `In preparation`. A Competency page is a `720px`
column of four numbered steps, in the order the work is done: what the Learner
will be able to do, the questions to carry into the reading, the source article,
then the Gate Quiz. It takes the doorstep's width rather than the board's
because it is the same thread of reading, continued — and because its prose is
held at `56ch` either way, so a wider card would only add blank space beside a
fixed measure. The Gate Quiz doorstep and verdict are single columns of `720px`
too. A quiz is one thread with one thing to decide at a time.

The wizard is the one surface that outgrew that (amended 2026-07-28). It ran at
`880px` on the reasoning that a drawn screen is examined rather than read and
wants more room than prose; the omission was that the screen and the question
about it were stacked, so the Learner scrolled between the thing being judged
and the judgment, and by the fourth option the screen was off the top of the
window. From `wide` the wizard takes the full `1240px` content column, and its
item card lays the screen and the question in one row as soon as the card is
`1198px` — the `720px` screen floor, a `26px` gap, the `400px` least a column of
options can be read in, and the card's own padding. The threshold is asked of
the card, not the viewport, so the row appears when the room is really there.
Below it the card stacks, and its four options pair into two columns wherever
the card is at least `880px`. Prose is held to the `56ch` reading measure in
every one of those arrangements; it is the edge that moves, from centred in a
stacked card to flush with the screen's own left edge.

Two consequences, both accepted. The screen sits at exactly its `720px` floor in
the two-column row rather than the `824px` a stacked `880px` card gave it — the
floor is the width the screens are authored to survive, and seeing the screen
beside the options is worth more than the `104px`. And the left column ends
where the drawn screen ends, which on a short item leaves the card taller than
its screen. Nothing is invented to fill that; the artefact is as tall as it is.

**The Studio Board Rule.** Show orientation before work: programme Stages and
progress precede the task stack. Each open Competency gets one white task panel
with a Learning Objective, status, Attempt count, Competency link, and separate
Gate Quiz action. The Self-Audit Report is the final task panel, but its
document mark keeps it distinct from the numbered Competencies.

**The No False Current Rule.** When tasks may be chosen in any order, no panel
receives a unique full-card current treatment and the page never names a
`next` Competency. Several panels may simultaneously say `In progress`; status
is encoded on each panel through its mark's colour and shape plus explicit
words. Progress describes completion, not sequence.

**The Numbered Steps Rule.** Two surfaces carry numerals, for two different
reasons, and the difference is what keeps them from contradicting each other.

On the **Competency page** the numerals say *do this, then this*: the order is
the information. They are set in the display face at `25px`, sit in a fixed
`34px` gutter (`26px` below `sm`) so the four of them line up down the left
edge of the column, and are `aria-hidden` — reading order already carries the
sequence to a screen reader, and speaking "01" before every heading would say
it twice.

On the **Learn overview** the numerals label the entries of a table of
contents, which is what that section is called. A table of contents numbers its
chapters without demanding you read chapter 3 last; the number is a stable
handle, so a Learner in Seoul and one in Jakarta can name the same Competency
without reciting its title in two languages. They ride inside the status mark
at `label` size, not in the display face, precisely so they never read as
headline steps. They are `aria-hidden` for the same reason as above.

The boundary between them is what the No False Current Rule actually forbids:
**a numeral may label an entry; it may never be the thing that says what to do
next.** That is why the Learn overview still names no `next` Competency, gives
no panel a current treatment, lets several rows say `In progress` at once, and
spends its marks on status rather than on position. Take the numbers away and
nothing about the order of that programme changes — which is the test. On a
surface where removing the numerals *would* change what a Learner does next,
they were carrying the sequence, and they are the defect the two rules exist
to refuse. (Confirmed 2026-07-28: this rule arrived with #48 saying numbering
appears nowhere but the Competency page, while the Learn overview had carried
its `01`–`04` since #43. The overview keeps them; the rule is what was
incomplete.)

One spacing rhythm throughout: `14px` between siblings, `22px` content inset off the board, `26px` inside a card. More space above a heading than below it.

Desktop and mobile are equally primary. On narrow screens the rail becomes a bottom bar. In the Learn directory, each Gate Quiz action drops below its Competency description and keeps a `44px` minimum touch height; the programme order itself does not change.

**The Stage Strip Rule** (decided 2026-07-28). The three Stage cards are three cards in a row from `sm`, and three rows inside one card below it. Only the container count changes with the band; the grouping does not, because the strip is one object at both. Three stacked cards cost 446px on a phone — 53% of the viewport — to say that Stage 1 is open and the other two are not written yet, and that pushed the first Competency, the only thing on the page a Learner can act on, entirely below the fold. Orientation precedes work on this board; it may not consume the screen the work needed. Any future summary strip on a narrow screen owes the same test: what does the Learner's first screen let them do?

**The Target Is The Link Rule.** A `44px` row height belongs to whatever actually answers a tap, not to the element around it. A heading given `min-h-11` with an inline link inside it looks like a 44px target and offers 22px — which is the Perceived clickability defect this platform's fourth Competency teaches, committed by the page that lists it.

Three bands, cut by available width rather than device class (decided 2026-07-27, #38). Below `640px` the bottom bar carries the marks with their labels — there is no hover on a phone to recover a word from, and a platform teaching Perceived clickability does not ship unlabelled circles as its only navigation. From `640px` the rail returns: a portrait tablet keeps the rail because it has the width for it. From `1100px` — not Tailwind's 1024, which is exactly iPad Pro 13" portrait and would hand a portrait screen the landscape grid — the Self-Audit Report sets its two surfaces side by side. Since 2026-07-28 that is the only split in the app: every other surface is one column at every width, so for them the third band changes nothing. The Gate Quiz's drawn screens never reflow below their authored width: the arrangement on those screens is the question, so a phone pans them, told once that it can.

Three bands, and no fourth. Where a component needs a threshold of its own — the Gate Quiz item card, which seats its screen beside its options at `1198px` and pairs its options at `880px` — it asks the container it is standing in, not the viewport. A fourth viewport band would be a claim about the platform; a container query is a claim about one component, which is all any of these thresholds ever knew.

The Self-Audit Report becomes a finding-at-a-time flow below `1100px` (decided 2026-07-27, #37). The Practice Page owns the available screen until the Learner selects an element; that selection opens one focused Finding composer, and a successful save returns to the page at the same position. A floating count opens the saved Findings and final submission as their own surface. This deliberately changes the report from a document drafted beside its subject into a stream of short entries: a narrow screen cannot keep both surfaces useful, and preserving the Learner's place between entries matters more than preserving a sliver of the page while the keyboard and form cover the rest. At `1100px` and above, the established two-surface layout remains: Practice Page and report drawer side by side.

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

**The Filling Mark Rule** (decided 2026-07-28). Wherever a mark carries a three-state progress — the Learn directory's numbered badges, the Gate Quiz doorstep's attempt marks — the states are told by **how full the mark is**, and nothing is ever attached to it to say so:

- **not started** — an even hollow ring, blue-grey;
- **started, not finished** — an oxblood ring whose base is thickened to `5px`, so the mark reads as filling from the bottom;
- **finished** — solid oxblood.

Three silhouettes, distinguishable with no hue at all, which is the point: colour alone is unreadable to some Learners and this platform teaches that in its first Stage.

The Learn badge carried a `6px` dot in its lower-right corner for this until 2026-07-28. Two things were wrong with it. It was a second vocabulary for a state the doorstep's attempt mark already drew as a partial fill — the Consistency defect the third Competency teaches, in the list that teaches it. And a small circle stuck to the corner of a numbered badge is the notification-count pattern everywhere else on the web, so it read as an alert rather than as a state. A mark says its state by its own shape; it does not wear a second object to say it.

## Components

### Buttons
- **Shape:** Fully round (`999px`).
- **Primary:** Oxblood ground, white label, `15px 26px`, full width inside its card. A trailing `small` carries a quiet detail ("5문항") at 72% opacity.
- **Hover / Focus:** Oxblood deepens; focus shows a visible ring — never removed, this platform teaches keyboard operability.
- There is no secondary button. A screen has one action; anything else is a link.

**The Row Action Exception.** A directory is the one place the rule above does not hold: where a screen lists peers that may be entered in any order, each row carries the same primary button, and the repetition is the point. The Learn overview ships four (five once the report opens). This is not four competing actions — it is one action offered four times, once per independent entry point, and picking one of them out with a heavier treatment would invent the sequence the No False Current Rule exists to refuse.

The exception is narrow. It applies only to a list of peers, only to the identical action repeated, and never alongside a second differently-weighted button on the same screen. Everywhere else, one action per screen still holds. (Recorded 2026-07-28: the Layout section had described this per-row action since the Studio Board was built, while this section still said one action per screen. The build followed Layout; the rule had simply never been written down.)

### Chips
- **Style:** White pill, `9px 17px`, pill lift, a `label`-step word with a `15px` khaki-stroked icon. (Corrected 2026-07-29: this line read `12.5px/600` and had never matched the build. 12.5px is not a step on the scale, and 600 is a weight the Two Weights Rule says does not exist here — the code has always shipped a label-step word at 700. Naming the step instead of a number is also what stops the two drifting again.) Numerals inside a chip go bold and oxblood.
- **Use:** Read-only facts about the page — competency count, last activity, steps complete. Chips are never controls.

### Cards / Containers
- **Corner Style:** `22px`.
- **Background:** White by default; sand only when a screen has one unambiguous next action. What is real but not yet open is a white card whose marks and words say so.
- **Shadow Strategy:** See Elevation. Tinted cards take the warmer/stronger stack.
- **Border:** None. Ever.
- **Internal Padding:** `26px`.

### Navigation
- **Rail:** A `78px` column in two parts. The **marks** sit at the top — `44px` circular icon buttons on white pills, the active one filled oxblood with a white glyph, labels in `aria-label` and not on screen. **Signing out** sits at the foot, drawn as one more mark and never filled, because it is an action and not a place. The gap between the two absorbs whatever height the marks do not use, so the control lands identically for a Learner with two marks and a Maintainer with six. The column is sticky and viewport-tall: the foot has to be the foot of the screen, or on a Gate Quiz signing out is several screens below the fold.
- **Language switcher:** A white pill holding two segments; the current language is an oxblood pill with white text, the other is plain ink. It navigates to the counterpart of the current page, never to a section root.
- **Mobile:** Below `640px` the rail's two parts go to two different edges. The marks become the bottom bar, where a thumb reaches them and where they show their labels. Signing out goes to the **top bar**, last in the trailing group after the account pill — the bottom bar is full at six marks, and a seventh puts every target under `44px` on a `320px` screen. It sits after the pill rather than before the language switcher so that who you are and how you leave stay adjacent, and so the pill, the only item in that group that truncates, keeps the slack between two fixed widths.

  A control that changes place with width is normally the Consistency defect the third Competency teaches, so the reason is recorded here rather than left to be rediscovered: on a phone the rail does not shrink, it is dismantled, and its two parts are re-housed in the two bars that remain. What stays constant is the drawing — the same `44px` mark, at both widths — and that the control is never a link.

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
