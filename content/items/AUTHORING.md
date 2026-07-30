# Authoring a Quiz Item's artefact

Every item asks a judgement about something. That something is the **artefact**,
and it can take one of three forms. Pick the cheapest one that still makes the
item unanswerable from memory of the article.

| Form | Front matter | Use it when |
| --- | --- | --- |
| Described | `artefact` alone | The judgement is about a situation, not a rendering. |
| Drawn | `artefact` + `screen` | The defect is visible in one still. All of Stage 1. |
| Drawn across time | `artefact` + `sequence` | The defect only exists between two moments. Most of Stage 2. |

`screen` and `sequence` are mutually exclusive, and the content build says so.
An item showing two artefacts leaves the Learner working out which one the
prompt is about.

## `artefact` is not optional, ever

It is the prose equivalent, and it is what a Learner who cannot see the drawing
is given — the frame's accessible name for a `screen`, the list's label for a
`sequence`. It is never printed beside the drawing: a paragraph saying a button
is light grey on white answers the question before the screen is looked at.

For a `sequence`, `artefact` describes **every state, in order**. A description
of only the first state is a description of a still, and the item is about the
change.

## `sequence`

```yaml
sequence:
  - caption:
      en: The moment Save is tapped
      ko: 저장을 누른 순간
    screen:
      en: |-
        <div class="screen">…</div>
      ko: |-
        <div class="screen">…</div>
  - caption:
      en: Three seconds later
      ko: 3초 뒤
    screen:
      en: |-
        <div class="screen">…</div>
      ko: |-
        <div class="screen">…</div>
```

Each state's HTML is styled by `item-screen.css`, exactly as a single `screen`
is. Read that file's header before composing one: an item makes its screen
wrong by choosing among those classes, not by inventing new ones.

Every state is rendered at once, stacked in time order. Nothing moves, nothing
auto-advances, and there is no control to operate — so the states can be
compared, which is usually the whole judgement, and a Learner who cannot watch
an animation reads what everyone else reads.

### The caption says *when*, never *what changed*

This is the rule that keeps a sequence item from becoming a definition
question, and it is the one thing here a build cannot check for you.

- ✅ `Three seconds after tapping Save`
- ✅ `After entering an email address and moving to the next field`
- ❌ `No spinner appears, so the user cannot tell it is working`
- ❌ `The error arrives before the address is finished`

The second pair can be answered without looking at a single state. An item
scoreable from its own captions tests whether the Learner read the captions,
which ADR-0006 rules out.

Write the captions, then cover the states with your hand and try to answer the
prompt. If you can, the captions are carrying the answer.

### Two states is the floor

One state is a `screen` and already has a spelling. Three is common; more than
four is usually two items.

### Both languages, together

Each state carries its own `caption` and `screen` in `en` and `ko`. The content
build rejects a half-authored pair — a missing variant renders blank for one
cohort and would otherwise ship unnoticed, because a suite that exercises one
language does not know whether the other is there.

The two language variants are the same states at the same moments. If the
Korean sequence needs a fourth state to make its point, the item is testing
something different in each language and is not one item.

## What a drawn artefact costs a phone

Screens are held to a floor width and panned sideways below it rather than
reflowed, because in many items the arrangement *is* the question. A sequence
inherits this: each state pans, and the hint to pan is said once for the whole
artefact.

Keep a state no wider than it needs to be. A state that fits without panning is
read at a glance, and "at a glance" is a property several items ask about.
