# Gating a production deploy behind a green test suite

## What was asked

Today a `git push` to `main` is the deploy trigger. Vercel builds the commit, runs
`drizzle-kit migrate` against the production database, and serves whatever comes out.
Nothing checks first. The question is what the 2025–2026 practice is for putting a green
test suite between the push and the deploy on GitHub, and whether that ceremony earns its
keep when the maintainer is one person and the other contributors are AI agents working in
her checkout. The answer turned on a fact about this repository's GitHub plan that decides
most of it, so that is stated up front in the first section rather than saved for the end.

Everything below was checked against the repository as it stands: `package.json`,
`vercel.json` on `origin/main`, `test/server.ts`, `drizzle.config.ts`, the absence of
`.github/`, and the live GitHub API for the repository's protection settings.

---

## 1. The mechanism

GitHub has two mechanisms for "this branch will not accept a change until a check is
green", and it is steering people to the newer one. **Repository rulesets** are the
current form; **classic branch protection rules** still work and are still documented, and
GitHub's own page for them now carries a pointer away from itself — "Only a single branch
protection rule can apply at a time, which means it can be difficult to know which rule
will apply when multiple versions of a rule target the same branch. For information about
an alternative to branch protection rules, see About rulesets"
([About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).
The rulesets page confirms both coexist: "Rulesets work alongside any branch protection
rules"
([About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)).

What rulesets do that classic rules cannot: several rulesets can apply to the same branch
at once and all of them are evaluated, rather than one rule silently winning; a ruleset has
an enforcement status — active, evaluate, or disabled — so a rule can be switched off
without being deleted; anyone with read access can see which rulesets are active, where
classic rules were visible only to admins; and rulesets can constrain commit metadata such
as message format and author email. Rulesets also scale up to the organisation level for
Team and Enterprise customers, and a repository may hold up to 75 of them
([About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)).
The one thing classic rules give you that rulesets do not is nothing worth having here.

The rule that matters is **"Require status checks to pass"**, which "ensures all required
CI tests are passing before collaborators can make changes to a branch or tag targeted by
your ruleset". It carries a sub-option, **"Require branches to be up to date before
merging"**. Checked (strict), "the topic branch **must** be up to date with the base branch
before merging"; unchecked (loose), it "does not have to be". GitHub states the trade
plainly: strict "requires more builds as branches need updating when the target branch
changes", loose reduces builds but risks "incompatible changes after merge"
([Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)).
Strict is what serialises merges: every merge invalidates every other open branch, each of
which must then be updated and re-tested. With one open branch at a time it costs nothing
because there is nothing to invalidate; with several it is a queue you operate by hand.

Two details are easy to miss and both bite. First, a check does not have to be green — it
has to not be red: required checks must have a "successful, `skipped`, or `neutral` status",
and more sharply, "A job that is skipped will report its status as 'Success'. It will not
prevent a pull request from merging, even if it is a required check"
([About status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)).
A required check guarded by a path filter is therefore a gate that opens itself whenever
the filter misses. Second, required checks do not by themselves force a pull request.
GitHub says "After all required status checks pass, any commits must either be pushed to
another branch and then merged **or pushed directly to the protected branch**"
([About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).
Forcing the PR is a separate rule, "Require a pull request before merging", and it can be
configured with zero required approvals — which is exactly the shape a solo maintainer
wants, and is covered in section 5.

**For this repo.** None of it is available. `Aisahub/ux-study` is a private repository owned
by an organisation on the **free** plan, and the rulesets API answers a request for this
repository's rulesets with `403 Upgrade to GitHub Pro or make this repository public to
enable this feature`. GitHub's own gating data says the same: "Rulesets are available in
public repositories with free user and free team plans for organizations, and in public and
private repositories with pro, team, and GitHub Enterprise Cloud plans"
([gated-features/repo-rules](https://raw.githubusercontent.com/github/docs/main/data/reusables/gated-features/repo-rules.md)),
and GitHub Free for organisations does not list protected branches or required reviewers
among its features, while GitHub Team does
([GitHub's plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)).
`main` currently reports `protected: false` and there is no `.github/` directory at all.

So the mechanism this whole question is about cannot be switched on here without either
paying for GitHub Team — listed at "$4 USD per user/month for the first 12 months"
([GitHub pricing](https://github.com/pricing)), across the organisation's 33 filled seats,
so roughly $130 a month — or making the repository public. That is the fact the rest of
this document has to work around, and it is not a technicality: it converts "should we
adopt the standard practice" into "is the standard practice worth a billing change", which
is the same question [ADR-0006](../adr/0006-objective-gate-quizzes-without-an-llm.md)
already answered once, in the negative, about the LLM.

---

## 2. Merge queues

A merge queue exists to close one specific hole: a pull request that is green against the
base branch as it was when the checks ran, and broken against the base branch as it is when
the merge lands. Nobody's tests were wrong; the two changes were merely incompatible. That
is the semantic-conflict problem, and the "require branches to be up to date" option in
section 1 is the manual, serial answer to it. GitHub's description of the queue is
"automating pull request merges into a busy branch and ensuring the branch is never broken
by incompatible changes"
([Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)).
Mechanically it builds temporary branches named `gh-readonly-queue/{base_branch}/…`
containing the base plus the queued changes, runs the required checks against those, and
merges in first-in-first-out order — so the thing that gets tested is the state that will
actually exist after the merge, and several pull requests can be validated as one group
rather than one at a time.

The word "busy" is doing the work. The queue pays for itself when the cost of re-testing
serially exceeds the cost of running the machinery, which happens when merges arrive faster
than a full check cycle takes. With a suite of roughly 30–100 seconds plus a `next build`,
break-even sits somewhere around a merge every couple of minutes, sustained. One human and
her agents do not approach that; on the busiest day this repository has ever had, the whole
day's commits would clear the queue in a few minutes.

There is also a hard availability wall. "Pull request merge queues are available in any
public repository owned by an organization, or in private repositories owned by
organizations using GitHub Enterprise Cloud"
([gated-features/merge-queue](https://raw.githubusercontent.com/github/docs/main/data/reusables/gated-features/merge-queue.md)).
And using one is not free of work: "You **must** use the `merge_group` event to trigger
your GitHub Actions workflow when a pull request is added to a merge queue"
([Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)) —
a workflow written only for `push` and `pull_request` never runs in the queue, and a
required check that never runs is a merge that never happens.

**For this repo.** Out of the question twice over: the repository is private and
organisation-owned, so it would need GitHub Enterprise Cloud, and the throughput is two
orders of magnitude below where the feature starts helping. Worth knowing that the problem
it solves is real even here in miniature — two agent branches open at once can each be
green and jointly broken — but the answer to that at this scale is "keep one branch open at
a time", not a queue.

---

## 3. The double-build problem

If CI runs `next build` and Vercel then builds the same commit again, the second build is
genuinely redundant work. There are four ways out and they are not equally supported.

**Building in CI and deploying the artefact** is documented by Vercel itself, in the
GitHub-integration page: install the CLI, `vercel pull --yes --environment=production`,
`vercel build --prod`, then `vercel deploy --prebuilt --prod`
([Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)).
This is first-party, not folklore. It also carries a caveat that is fatal to this project's
current arrangement: "When using the `--prebuilt` flag, System Environment Variables will
be missing at build time, so frameworks that rely on them at build time may not function
correctly… If you need System Environment Variables at build time, do not use the
`--prebuilt` flag or use Git-based deployments"
([vercel deploy](https://vercel.com/docs/cli/deploy)). `VERCEL_ENV` is a System Environment
Variable, and `vercel-build` is written as `if [ "$VERCEL_ENV" = production ]; then
drizzle-kit migrate; fi && next build`. With the variable absent the test is false, the
migration silently does not run, and the deploy ships code ahead of its schema — the exact
hazard the script exists to prevent, reintroduced quietly rather than loudly. Moving the
build into CI therefore means rewriting the migration trigger to key off something CI
controls, or lifting migration out of the build entirely into its own workflow step. That
is a real change to a load-bearing arrangement, undertaken to save one build.

**The Ignored Build Step** is a Vercel project setting that runs a command at the start of
a build: "If the command exits with code `1`, the build continues as normal. If the command
exits with code `0`, the build is immediately aborted, and the deployment state is set to
`CANCELED`". The command runs in the root directory and "can access all System Environment
Variables"
([Project settings](https://vercel.com/docs/project-configuration/project-settings)). The
inverted exit codes are not a typo and they are the single most misremembered detail in
this area. Vercel also warns that this is not free: "Canceled builds are counted as full
deployments… any canceled builds initiated using the ignore build step will still count
towards your deployment quotas and concurrent build slots". Using it to consult a CI result
means having that command call GitHub's API for the commit's check runs and poll until they
settle — Vercel documents the hook and the environment it runs in, but *nothing* about
querying CI from inside it. That pattern is community folklore. It is also racy by
construction: the push starts the Vercel build and the CI run simultaneously, so the ignore
command is polling for a result that does not exist yet, while holding a build slot.

**Deploy Hooks** are documented and simple: "unique URLs that accept HTTP `POST` requests in
order to trigger deployments", "uniquely linked to your project, repository, and branch, so
there is no need to use any authentication mechanism". They are rate-limited to 60 per hour
per project, and Vercel is explicit that the URL is a credential — "This allows anyone with
the URL to deploy your project, so treat it with the same security as you would any other
token or password"
([Creating & Triggering Deploy Hooks](https://vercel.com/docs/deploy-hooks)). Used as a
gate, the shape is: turn Vercel's Git deployments off entirely, and let a green CI run fire
the hook. It works, and it costs the branch-to-commit precision — a hook is bound to a
branch, not to the SHA that CI just proved green, so a commit landing during the CI run is
what actually deploys.

**An official Vercel GitHub Action** does not appear to exist. The Vercel documentation's
own instructions install the CLI into a workflow rather than referencing a published
action, and the marketplace actions people use are third-party. Vercel does publish
first-party `repository_dispatch` events in the other direction — `vercel.deployment.success`,
`vercel.deployment.error`, `vercel.deployment.ignored` and others, with the deployment URL
in `client_payload` — which is the supported way to run something *after* a deploy, not to
gate one
([Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)).

**For this repo.** The double build is smaller than it looks, because `vercel.json` already
sets `git.deploymentEnabled` to `{"**": false, "main": true}`. Vercel never builds a topic
branch and never builds a pull request head. Whatever CI does, Vercel still builds exactly
once, on the merge commit. The redundancy is one extra `next build` inside the CI run, on a
project whose whole suite is 30–100 seconds plus that build — a minute or two of machine
time on infrastructure that is free for the first 2,000 minutes a month
([Billing for GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions)).
That is not a cost worth restructuring the migration trigger to avoid. Leave the Vercel Git
integration alone.

---

## 4. Databases in CI

Neon publishes first-party GitHub Actions for exactly this: a create-branch action, a
delete-branch action, a reset-branch action that resets a branch to its parent, and a
schema-diff action that comments the difference on a pull request
([Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions)).
Credentials are handled the ordinary way — a `NEON_API_KEY` repository *secret* and a
`NEON_PROJECT_ID` repository *variable* — and Neon's GitHub integration will create both
for you rather than making you paste them
([The Neon GitHub integration](https://neon.com/docs/guides/neon-github-integration)). I
found no documented OIDC path from GitHub Actions to Neon; the documented mechanism is an
API key in a repository secret. That is noted again in the last section.

Branch-per-pull-request is the pattern the actions are built for: create on `opened` or
`reopened`, delete on `closed`. It gives perfect isolation and costs an API key in CI plus
discipline about deletion, since branches are capped at 10 per project on both the Free and
Launch plans and 25 on Scale
([Neon plans](https://neon.com/docs/introduction/plans)). A workflow that creates and never
deletes hits that ceiling in a fortnight.

One long-lived shared test branch is cheaper and is what this project already has. Its
hazard is concurrency, and here it is not theoretical. `test/server.ts` ends every run by
truncating `users`, `sessions`, `attempts`, `reports`, `findings` and `agreements` and
deleting every allowlist row not marked `added_by = 'seed migration'`. Two runs against one
branch means one run's teardown deleting the other run's fixtures mid-assertion — and worse,
the failure would look like a flaky test rather than a collision. The mitigation is a
GitHub Actions concurrency group, where "Only a single job or workflow using the same
concurrency group will run at a time"; note that the default behaviour cancels a *pending*
run when a newer one queues, so a gate must set `cancel-in-progress: false`, and `queue:
max` is what makes runs actually wait in line rather than displace each other
([Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency)).
Vitest's own contract is compatible with this: `globalSetup` "is called before the test
workers are created and only if there is at least one test queued, and teardown is called
after all test files have finished running"
([globalSetup](https://vitest.dev/config/globalsetup)) — the sweep is once per run, so
serialising runs is sufficient. Nothing finer-grained is needed.

**For this repo.** A shared branch plus a concurrency group is the right size. Branch-per-PR
would buy isolation this project does not need at one contributor's throughput, in exchange
for a Neon API key living in GitHub, a deletion workflow that must not fail, and a 10-branch
ceiling to watch. The real cost of running the suite in CI at all — either way — is that
`DATABASE_URL_TEST` has to exist as a GitHub repository secret. That is one more place
holding a live database credential, which is precisely the trade commit `b8c39f6` refused
when it declined to give Preview a database. The difference is that here the credential buys
something: the test branch is the only way CI can run this suite, because the suite has no
fake and no in-memory path by design.

---

## 5. Is it worth it at this scale

A pull-request flow bundles two things that have nothing to do with each other. One is an
**automated gate** — a machine that refuses to let an unproven commit reach production. The
other is **human review** — a second person reading the diff. A solo maintainer gets
literally nothing from the second and can perfectly well want the first, and most of the
argument about "PR ceremony for one person" is people talking past that seam.

On the review half, the research is not ambiguous. DORA's finding is that "no evidence was
found to support the hypothesis that a more formal, external review process was associated
with lower change fail rates", and that "heavyweight approaches tend to slow down the
delivery process leading to the release of larger batches less frequently… likely to be
associated with higher levels of risk and thus higher change fail rates"
([Streamlining change approval](https://dora.dev/capabilities/streamlining-change-approval/)).
DORA recommends peer review where segregation of duties is the goal — a compliance goal
that does not exist for a private internal training tool with one maintainer. Requiring an
approval here would mean approving your own pull requests, which is theatre.

On the gate half, the practitioner literature is equally clear and points somewhere
specific: it says the gate belongs *before* the push, not after it. trunkbaseddevelopment.com,
describing teams that commit straight to trunk — "Most likely it is because they are a small
team with each team member knowing what the others are up to" — states the condition
plainly: developers must "run the full build (the same build the CI demon would do) before
the commit/push, and only pushing to trunk if that passes. **This is an essential
integration activity**"
([Committing straight to the trunk](https://trunkbaseddevelopment.com/committing-straight-to-the-trunk/)).
Fowler says the same thing from the other end: "The one prerequisite for a developer
committing to the mainline is that they can correctly build their code", and describes the
workflow as updating, building locally, and pushing only if the build passes
([Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)).
Both are practitioner opinion rather than vendor documentation and are labelled as such —
but they are the two most-cited statements of the practice, and they agree.

Taking the four candidate arrangements in turn:

**Do nothing** is the status quo and it is wrong here, for a reason specific to this
project rather than a general one. `vercel-build` runs `drizzle-kit migrate` *before*
`next build`. A commit that migrates cleanly and then fails to compile leaves production
with the new schema and the old code still serving traffic, because Vercel keeps the
previous deployment live when a build fails. The suite catches exactly this, because `npm
test` is `next build && vitest run` and `test/server.ts` runs `drizzle-kit migrate` against
the test branch before booting the app — a run proves the migration and the build together,
in that order, which is the order production will do it in. This is the strongest argument
in the document for gating anything at all, and it has nothing to do with team size.

**PR flow with required checks and auto-merge** is the textbook answer and it works well:
require a pull request with zero approvals, require one status check, leave "up to date"
unchecked, and use auto-merge, which "merges a pull request automatically after all required
reviews and status checks pass"
([Automatically merging a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request)).
The ceremony reduces to branch, push, open, `--auto`, walk away. It is unavailable on this
repository's plan, and the two ways to buy it — about $130 a month across 33 seats, or
publishing the source of an internal training platform — are both decisions about something
other than testing.

**CI on push to `main` plus an Ignored Build Step consulting the result** does not work,
and it is worth saying why rather than listing it as an option. The push starts the Vercel
build and the CI run at the same moment. The ignore command runs at the head of the Vercel
build, before CI has finished, so it must poll — an undocumented use of the hook — while
occupying a concurrent build slot, and a cancelled build still counts against quota. Even
when it works, `main` is already red; only the deploy was stopped. It buys the weakest form
of the guarantee at the highest complexity.

**A local `pre-push` hook** is the arrangement the practitioner sources actually describe,
and its usual objections mostly do not apply here. "Hooks aren't cloned" is answered by
committing them and setting `core.hooksPath` once. "It only protects one machine" is
answered by the fact that in this project there is one machine: the agents are Claude Code
sessions in Chloe's checkout, running `git push` as her. The objection that survives is
`--no-verify`, which no hook can prevent — a hook is a convention with teeth, not an
enforcement point, and an agent that has been told the suite is slow can step around it.

**For this repo.** The gate is worth having, the review is not, and the mechanism that
would enforce the gate is behind a paywall that costs more than the problem. That leaves
the pre-push hook as the thing that genuinely refuses to deploy a red commit — because in
this project the push *is* the deploy, so refusing the push is refusing the deploy, which is
a stronger position than any post-push gate can occupy without the ruleset.

---

## 6. Bots and agents

Required status checks do not care who authored a commit. Rules apply to every actor not
named on the ruleset's bypass list, and that list is opt-in: repository admins, organisation
and enterprise owners, the maintain or write roles, teams, GitHub Apps and Dependabot are
all *eligible*, but each has to be added
([Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)).
Classic branch protection is the opposite way round and this is the trap: "By default, the
restrictions of a branch protection rule do not apply to people with admin permissions to
the repository or custom roles with the 'bypass branch protections' permission", and you
turn that off with "Do not allow bypassing the above settings"
([About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).
A solo maintainer who sets up classic protection and does not check that box has built a
gate that is open for the only person who uses it. Whether an admin *should* bypass their
own rules is a judgement, and for a one-person repository the honest answer is that the
bypass should exist and should be used deliberately and rarely — a gate you cannot open in
an incident is a gate you will delete after the first incident.

The `GITHUB_TOKEN` restriction is real and specific: "With the exception of
`workflow_dispatch` and `repository_dispatch`, other `GITHUB_TOKEN`-triggered events do not
create workflow runs at all", and when a pull request is created or updated by a workflow
using `GITHUB_TOKEN`, the resulting `pull_request` runs "require approval"; the documented
escape is a GitHub App installation access token or a personal access token
([Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)).

**For this repo.** It does not bite, and it is worth being precise about why. The agents
here do not act through `GITHUB_TOKEN`; they run `git push` in a local checkout using
Chloe's credentials, so the push event is authored by a human token and every workflow
listening for it fires normally. The restriction would only bite if a *workflow* were made
to open the pull request or push the merge — so the rule to remember is simply: do not
automate the PR creation from inside Actions. Separately, Vercel's deploy is triggered by
its own GitHub App webhook and not by Actions at all, so nothing in this restriction can
reach the deploy path in either direction.

---

## Recommendation

**Install a tracked `pre-push` hook that runs `npm test` and refuses the push when it
fails, and add a GitHub Actions workflow that runs the same suite on push to `main` as an
alarm.** The hook lives in the repository and is enabled with a single
`git config core.hooksPath` so a fresh clone is one command from protected. It is the only
arrangement available on this plan that actually stops a red commit from reaching
production, and it stops it at the strongest possible point — the push, which in this
project is the deploy. The workflow is the second half: it re-runs the suite against the
existing shared Neon test branch, inside a concurrency group with `cancel-in-progress:
false`, so that a push made with `--no-verify`, or from another machine, produces a red mark
on `main` within about two minutes instead of never.

What it costs. Every push now waits for `next build` plus the suite — call it two minutes,
paid by the person who is already waiting for the deploy anyway. The hook is bypassable by
anyone who types `--no-verify`, so this is a convention with teeth rather than an
enforcement point, and it should be described that way in `CLAUDE.md` so agents treat the
hook as part of pushing rather than an obstacle to it. The workflow requires
`DATABASE_URL_TEST` to exist as a GitHub repository secret — one more place holding a live
database credential, the same trade `b8c39f6` declined for Preview, accepted here because
the suite has no fake and this is the only way it can run off-machine. If that trade is not
acceptable, drop the workflow and keep the hook; the hook is the part that gates.

**Runner-up: the pull-request flow with a repository ruleset requiring one status check,
zero required approvals, "up to date" left unchecked, and auto-merge.** It is the better
arrangement on the merits — an enforcement point rather than a convention, with a visible
history of what was proven before each merge — and it is what I would recommend the moment
this repository sits on a plan that has it. It loses today on price. Enabling it means
either upgrading the Aisahub organisation from Free to Team at about $130 a month across 33
seats, to gate one repository maintained by one person, or making an internal training
platform's source public. Both are decisions about billing and disclosure that happen to
unlock a testing feature, and neither should be made because of a testing feature. Merge
queues lose earlier still: unavailable on a private organisation repository without
Enterprise Cloud, and aimed at a merge rate two orders of magnitude above this one.

Do not move the build into CI. `vercel.json` already prevents Vercel from building anything
but `main`, so the redundant work is a single `next build` inside the CI run, and buying it
back with `vercel build` + `vercel deploy --prebuilt` would strip `VERCEL_ENV` from the
build environment and silently disable the production migration.

---

## What I could not verify

- **Whether a required status check actually rejects a direct `git push` of a new commit.**
  GitHub says required checks must pass "before collaborators can make changes to a
  protected branch" and that after they pass, commits may be "pushed directly to the
  protected branch". Since a commit that has never been pushed anywhere has no checks at
  all, the practical consequence is that the push is refused — but I could not find a
  sentence in GitHub Docs that says so outright, and I could not test it, because rulesets
  are unavailable on this repository's plan.
- **Whether repository admins bypass rulesets by default.** The documentation describes the
  bypass list as something you add actors to, and never says admins are on it implicitly, in
  clear contrast to the explicit statement that they *are* exempt from classic branch
  protection by default. I read that as "rulesets do not exempt admins unless you say so",
  but it is an inference from an absence.
- **Whether `vercel-build` formally takes precedence over `build`.** The only Vercel page I
  found that documents a `vercel-build` script is the Node.js advanced-configuration page,
  where it is described in the narrower context of building outputs into a function; the
  build-configuration page mentions only `build`. The precedence is how this project
  demonstrably behaves in production, but I could not point to a Vercel page that states the
  rule.
- **Whether an auto-merge merge triggers `push` workflows.** Auto-merge is performed by
  GitHub on the enabling user's behalf, which suggests it does, but I found no documentation
  either way. It does not affect the recommendation, which chains no workflows.
- **Whether a Deploy Hook deploys the branch tip at request time or some pinned commit.**
  The documentation says hooks are "uniquely linked to your project, repository, and
  branch" and never mentions a SHA, so I have assumed branch tip. This matters only to the
  deploy-hook design, which is not recommended.
- **OIDC from GitHub Actions to Neon.** I found no first-party Neon documentation for
  federated credentials from Actions; every Neon guide I read uses a `NEON_API_KEY`
  repository secret. Absence of documentation is not proof of absence of the feature.
- **Neon plan limits beyond branch counts.** I confirmed the 10/10/25 branch ceilings but
  did not check whether a CI-created branch's compute is billed differently from an idle
  one, which would matter to a branch-per-PR design.
