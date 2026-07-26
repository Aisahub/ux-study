# ux-study

## Documentation language

Repository documentation — `CONTEXT.md`, `docs/adr/`, `docs/agents/` — is written in **English**, matching the identifiers used in code and issue titles. Domain terms in `CONTEXT.md` additionally carry `한국어 / 中文` glosses.

Learner-facing course content is a separate concern and is authored in **both English and Korean**, since Learners are hired in Korea and in Indonesia. See ADR-0002.

## Landing changes

`main` is protected by a repository ruleset, and in this project a merge to
`main` is a production deploy — Vercel builds only that branch. So there is no
pushing to `main` directly; the push is refused. Every change lands the same
way:

1. Branch, commit, push the branch, open a pull request against `main`.
2. The `test` workflow runs `next build && vitest run` against the Neon test
   branch. It must go green — the ruleset will not let the PR merge otherwise,
   and green here is the promise that the migration and the build both succeed
   in the order production will run them.
3. Merge when it is green. There is one maintainer, so no review is required;
   `gh pr merge --rebase --auto` lands it the moment the check passes and keeps
   `main` linear.

The gate is the automated check, not a second person. If the suite is red the
answer is to fix the suite, never to reach for a bypass — the ruleset has an
empty bypass list on purpose. The one deliberate escape hatch is the
maintainer disabling the ruleset for a named incident, which should be rare
enough to be memorable.

## Agent skills

### Issue tracker

Issues live as GitHub issues on `Aisahub/ux-study`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage labels, used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
