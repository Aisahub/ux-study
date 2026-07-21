---
status: accepted
---

# Put the language in the URL path, and keep competency routes flat

## Background

The platform is bilingual ([ADR-0002](0002-scaffold-around-source-articles.md)): every Competency, Quiz Item, brief, Principle Glossary entry and the Practice Page is authored in English and Korean, and a Learner works in one of them.

Two questions have to be answered before the first route exists, because URLs are the one part of an interface that other people copy, paste and keep:

- **Is the language part of the address, or a property of the viewer?**
- **Does the Stage grouping appear in the path?**

The first question was sharpened by [ADR-0007](0007-stage-1-assessed-against-an-authored-practice-page.md) and the spec's finding that the Principle Glossary is used *during real work* — a Learner citing a named principle in a pull request. That makes a Glossary URL an artefact with a life outside the programme, pasted where the reader may not be the sender.

## Decision

**Every page carries a language segment.** Routes are `/<lang>/…` where `<lang>` is `ko` or `en`. There are no unlocalised pages, including sign-in.

- `/` guesses from the browser's `Accept-Language` and redirects. Once a Learner is signed in, their saved preference wins over the guess.
- **The language switcher navigates to the counterpart of the current page**, never to a section root.
- **Competency routes are flat**: `/<lang>/learn/<competency>`. The Stage is a grouping displayed on the overview, not a path segment.
- The Practice Page is authored per language and served at `/<lang>/audit/page`. **Both variants must expose an identical set of element identifiers**, enforced by the content build.

## Rationale

- **An address that renders differently per viewer is not reportable.** With language as an invisible profile property, two Learners looking at "the same URL" see different pages, and a screenshot cannot be reconciled with the address it came from. Every support conversation, bug report and content correction would begin by establishing something the URL should have stated.
- **The cost of a path segment is smaller than it first appears, in the case that matters most.** A Korean link pasted into a pull request opens in Korean for an English-speaking reader — but a Glossary entry displays both language names, definitions and justification sentences by design. The link lands on the right concept regardless of which variant it names. This is the scenario the Glossary exists for, and it survives.
- **No search-engine consideration applies.** The platform is behind an allowlist ([ADR-0004](0004-access-by-allowlist-over-google-sign-in.md)), so neither the usual argument against path locales (duplicate indexing) nor the usual argument for them (crawlable per-language URLs) is in play. The decision rests entirely on how people copy and paste links, which is the right basis for it.
- **A Stage segment would encode a grouping into an address.** The Stage a Competency belongs to is curriculum structure, and curriculum structure is the most likely thing in this project to be revised. Baking it into the path means every link to that Competency breaks when it moves. The Stage is already recoverable from the Competency's own content.
- **In the MVP a Stage segment carries no information at all**, since there is exactly one Stage. A constant in every URL is a cost with no corresponding benefit.
- **Element identifier parity is what makes the cross-location comparison real.** Because the two Practice Page variants are separate documents, nothing structural forces them to offer the same selectable elements. If they diverge, a Finding naming the primary button in Seoul and one naming it in Jakarta become different records, and the comparison ADR-0007 justified the Practice Page with silently stops measuring anything. A build check is the only place this can be caught cheaply.

## Considered alternatives

- **Language as a profile setting, no path segment.** Strongest benefit: one concept, one address — a pasted link opens in the recipient's own language, which directly serves the shared-vocabulary goal the whole project exists for. Rejected because an address that renders differently per viewer makes any report about a page unreproducible, and because the Glossary's bilingual display already delivers most of that benefit without it.
- **Language as a query parameter** (`?lang=ko`). Strongest benefit: the path stays clean and an override is trivial. Rejected because query parameters are routinely dropped when links are retyped or rewritten by chat clients, and because it presents the language as optional when every page has exactly one.
- **A subdomain per language** (`ko.…`). Strongest benefit: complete separation of the two variants. Rejected because session cookies would need extra configuration to be shared, which buys nothing that a path segment does not already provide.
- **Stage in the path** (`/learn/stage-1/<competency>`). Strongest benefit: the address states where in the programme a Competency sits. Rejected as described above — a constant today, and a broken link the first time the curriculum is revised.

## Consequences

- **Every route in the application is language-parameterised.** Adding an unlocalised page later becomes an exception that has to be argued for rather than a default that happens quietly.
- **A pasted link opens in the sender's language, not the reader's.** On a Glossary entry this is largely harmless; elsewhere the reader uses the switcher. This is the accepted cost of the decision and it is not mitigated further.
- **The switcher becomes a real requirement rather than a default.** Mapping a route to its counterpart has to be implemented deliberately; the common failure — redirecting to the section root — loses the reader's place and would be worst on exactly the deep pages that get shared.
- **The content build gains an element-parity check**, joining the checks that already fail the build on a missing translation, an uncited Principle, or an unmarked answer key.
- **Attempt records are unaffected.** An attempt already stores the language it was taken in, so nothing about scoring or comparison changes.
- **A third language would be a path segment and a content pass**, not a structural change. Nothing here assumes two.

## Follow-up work

- Add the Practice Page element-parity check to the content build.
- Verify the language switcher lands on the counterpart route for every page type, including a quiz in progress and the Practice Page.
- **Decide what switching language mid-attempt means.** Item identifiers are shared across languages, so the drawn items have counterparts and the switch is coherent — but the attempt's recorded language then describes only where it started. Either forbid the switch during an attempt or define what the field means. Neither is decided here.
- Confirm the `/` language guess never overrides a signed-in Learner's saved preference.
