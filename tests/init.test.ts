import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInit } from '../src/init.js';
import type { CommandRunner } from '../src/verifier.js';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'ws-init-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'vitest' } }));
  writeFileSync(join(dir, 'package-lock.json'), '');
});
const pass: CommandRunner = async () => ({ exitCode: 0, stdout: 'ok', stderr: '', timedOut: false, durationMs: 1 });

describe('runInit', () => {
  it('writes manifest + AGENTS.md when consent granted', async () => {
    const res = await runInit({ repoRoot: dir, consent: async () => true, run: pass });
    expect(res.verified).toBe(true);
    expect(readFileSync(join(dir, 'AGENTS.md'), 'utf8')).toContain('npm run test');
    expect(readFileSync(join(dir, '.warmstart', 'manifest.json'), 'utf8')).toContain('"status": "passed"');
  });
  it('aborts without running commands when consent denied', async () => {
    let ran = false;
    const spy: CommandRunner = async () => { ran = true; return { exitCode: 0, stdout: '', stderr: '', timedOut: false, durationMs: 1 }; };
    const res = await runInit({ repoRoot: dir, consent: async () => false, run: spy });
    expect(res.verified).toBe(false);
    expect(ran).toBe(false);
  });
});
