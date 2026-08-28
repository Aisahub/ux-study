# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Git identity (required)

Every commit in this repository must be authored as:

```
JR Kim <jeongrankim99@gmail.com>
```

In a fresh clone or a sandboxed/cloud session, set this **before the first commit**:

```bash
git config user.name "JR Kim" && git config user.email "jeongrankim99@gmail.com"
```

Never fall back to the signed-in Claude account's email (e.g. `jordan@aisahub.com`).
GitHub matches the commit's author email to an account, so the wrong email attributes
the work to the wrong GitHub user.
