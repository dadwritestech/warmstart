import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCommand } from '../src/runner.js';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'ws-run-')); });

describe('runCommand', () => {
  it('captures exit 0 and stdout', async () => {
    const r = await runCommand('node --version', { timeoutMs: 5000 });
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toLowerCase()).toContain('v');
  });
  it('captures non-zero exit', async () => {
    const f = join(dir, 'fail.js'); writeFileSync(f, 'process.exit(3)');
    const r = await runCommand(`node ${f}`, { timeoutMs: 5000 });
    expect(r.exitCode).toBe(3);
  });
  it('reports missing binary as exit 127', async () => {
    const r = await runCommand('frobnicate-xyz-123', { timeoutMs: 5000 });
    expect(r.exitCode).toBe(127);
  });
  it('flags timeout', async () => {
    const f = join(dir, 'sleep.js'); writeFileSync(f, 'setTimeout(() => {}, 10000)');
    const r = await runCommand(`node ${f}`, { timeoutMs: 300 });
    expect(r.timedOut).toBe(true);
  });
});
