# warmstart

**Stop your AI agent from relearning your repo every session.**

Every coding agent — Claude Code, Cursor, Codex, Copilot — pays the same tax on every repo, every session: it burns its first several turns *guessing* the test command, the build incantation, the package manager, the entry point, and stepping on gotchas the last session already figured out and threw away.

`warmstart` ends that. One command discovers your repo's real dev-loop, **runs the commands to prove they work**, and writes a committed `AGENTS.md` plus a live MCP server — so any agent reads the verified truth in one shot instead of fumbling.

```bash
npx warmstart init
```

![warmstart demo](docs/demo.gif)

> *Watch an agent waste 8 turns finding the test command → watch it read `AGENTS.md` and nail it in 1.*

## Why it's different from a hand-written AGENTS.md

A hand-written `AGENTS.md` rots the moment a command changes, so agents don't trust it and re-verify by trial anyway. `warmstart` keeps itself **honest**: every command carries a precise, scoped stamp of what was actually proven.

| Stamp | Meaning |
|---|---|
| `✓ passed — darwin/arm64, v20, 2026-06-22` | Ran and exited 0 — *here, then*. Not a portability promise. |
| `~ flaky (2/3 passes)` | Non-deterministic across repeated runs. |
| `⚠ unverified (env-missing — command may be correct)` | Failed for a likely environmental reason (missing secret/service). |
| `⚠ unverified (not-run: destructive)` | Matched a dangerous pattern — never auto-run. |
| `⚠ unverified (timeout)` / `✗ failed` | Recorded with a redacted, distilled reason. |

The stamp states **what was proven, where, and when** — never a bare "verified."

## How it works

1. **Scan** — mines your `package.json` scripts, `Makefile` targets, and `pyproject.toml` for candidate commands.
2. **Consent** — previews the exact command plan and asks before running anything.
3. **Verify** — runs the safe candidates and records honest, scoped results.
4. **Emit** — writes a delimited block in `AGENTS.md` (never clobbering your prose) and registers a `warmstart serve` MCP server for Claude Code.

## Safety & privacy

- **Runs fully locally.** No telemetry. No network except your repo's own commands.
- **Never auto-runs destructive commands.** `deploy`, `publish`, `rm -rf`, `git push`, `drop`, and similar are listed but never executed.
- **No shell execution.** Commands run via `cross-spawn` with tokenized args — no shell-injection surface, and Windows `.cmd` shims work correctly.
- **Never commits secrets.** Command output is redacted (tokens, credentials, home paths) and raw output is never embedded in `AGENTS.md`.
- **Never clobbers your files.** An existing hand-written `AGENTS.md` is backed up and preserved; only a delimited block is managed.

## Configuration (`.warmstartrc.json` or `.warmstartrc.yaml`)

```json
{
  "timeoutMs": 120000,
  "flakyRuns": 1,
  "network": false,
  "disable": ["make deploy"],
  "env": {}
}
```

## Commands

- `warmstart init` — scan, verify (with consent), emit `AGENTS.md` + register MCP. `--yes` for non-interactive/CI.
- `warmstart serve` — run the MCP server exposing the manifest.
- `warmstart doctor` — check toolchain availability.

## Supported sources

**Now:** `package.json` (+ pnpm/yarn/npm/bun detection), `Makefile`, `pyproject.toml`.
**Planned:** `justfile`, `Taskfile.yml`, `tox.ini`, CI workflows (as hint sources), passive observation, staleness re-verification, CI-stamped manifests.

## License

MIT
