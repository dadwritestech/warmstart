# Changelog

## 0.1.0 — unreleased

Initial MVP.

- `warmstart init` — scans `package.json` (with pnpm/yarn/npm/bun detection), `Makefile`, and `pyproject.toml` for dev-loop commands; previews a plan and asks consent; runs the safe ones and records honestly-scoped results (`passed` / `flaky` / `env-missing` / `destructive` / `timeout` / `failed`).
- Emits a delimited block in `AGENTS.md` (never clobbering hand-written prose; backs up files without markers) and writes `.warmstart/manifest.json`.
- Registers a Claude Code MCP server exposing a `warmstart://manifest` resource and a `get_command` tool.
- `warmstart serve` / `warmstart doctor` subcommands.
- Safety: no shell execution (cross-spawn), destructive-command denylist, secret/PII redaction, fully local (no telemetry/network beyond the repo's own commands).

### Deferred to a later release
justfile/Taskfile/tox/CI miners, passive observation, staleness re-verification, CI-stamped manifests, Cursor/Codex registration.
