# Contributing to warmstart

Thanks for helping! warmstart aims to be small, honest, and safe.

## Dev setup

```bash
npm install
npm test          # vitest, run once
npm run test:watch
npm run typecheck
npm run build
```

## Conventions

- **TDD.** Write the failing test first, then the implementation.
- **ESM.** Relative imports use `.js` extensions even on `.ts` files (`import { x } from './x.js'`).
- **No shell execution.** Commands are run via `cross-spawn` with tokenized args — never `shell: true`. This is a security invariant, not a style choice.
- **Pure logic, thin shells.** Miners and helpers are pure functions; fs/process side-effects live in orchestrators (`scan.ts`, `init.ts`, `runner.ts`). Keep it that way so units stay testable.
- **Honest stamps only.** Never emit a bare "verified" — a stamp must state what was proven, where, and when.

## Adding a miner

1. Create `src/miners/<name>.ts` exporting a pure `(inputs) => Candidate[]`.
2. Add a fixture-based test in `tests/miners/`.
3. Register it in `src/scan.ts` (add its source files to `FILES`, call it in `scanRepo`).

## Safety-critical code

`src/safety.ts` (destructive denylist) and `src/redact.ts` (secret/PII scrubbing) get the most adversarial tests. If you touch them, add cases — don't weaken existing ones.
