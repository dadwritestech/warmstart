import { describe, it, expect } from 'vitest';
import { verifyCandidate, type CommandRunner } from '../src/verifier.js';
import type { Candidate } from '../src/types.js';

const cand: Candidate = { category: 'test', command: 'pytest', source: 's', provenance: 'p', confidence: 0.8 };
const ok: CommandRunner = async () => ({ exitCode: 0, stdout: 'ok', stderr: '', timedOut: false, durationMs: 5 });

describe('verifyCandidate', () => {
  it('marks passed and stamps platform', async () => {
    const f = await verifyCandidate(cand, { timeoutMs: 1000, flakyRuns: 1 }, ok);
    expect(f.status).toBe('passed');
    expect(f.platform?.os).toBeTruthy();
    expect(f.lastVerified).toBeTruthy();
  });
  it('never runs destructive commands', async () => {
    let called = false;
    const spy: CommandRunner = async () => { called = true; return { exitCode: 0, stdout: '', stderr: '', timedOut: false, durationMs: 1 }; };
    const f = await verifyCandidate({ ...cand, command: 'git push' }, { timeoutMs: 1000, flakyRuns: 1 }, spy);
    expect(f.status).toBe('destructive');
    expect(called).toBe(false);
  });
  it('distinguishes env-missing from failed', async () => {
    const envFail: CommandRunner = async () => ({ exitCode: 127, stdout: '', stderr: 'pytest: command not found', timedOut: false, durationMs: 2 });
    const f = await verifyCandidate(cand, { timeoutMs: 1000, flakyRuns: 1 }, envFail);
    expect(f.status).toBe('env-missing');
  });
  it('records flaky when a re-run fails', async () => {
    let n = 0;
    const flaky: CommandRunner = async () => ({ exitCode: n++ === 0 ? 0 : 1, stdout: '', stderr: 'assert', timedOut: false, durationMs: 1 });
    const f = await verifyCandidate(cand, { timeoutMs: 1000, flakyRuns: 2 }, flaky);
    expect(f.status).toBe('flaky');
    expect(f.runs).toBe(2);
    expect(f.passes).toBe(1);
  });
  it('redacts the failure reason', async () => {
    const leak: CommandRunner = async () => ({ exitCode: 1, stdout: '', stderr: 'GITHUB_TOKEN=ghp_secret bad', timedOut: false, durationMs: 1 });
    const f = await verifyCandidate(cand, { timeoutMs: 1000, flakyRuns: 1 }, leak);
    expect(f.reason).not.toContain('ghp_secret');
  });
});
