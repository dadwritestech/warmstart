import { describe, it, expect } from 'vitest';
import { checkToolchain } from '../src/doctor.js';
import type { CommandRunner } from '../src/verifier.js';

const present: CommandRunner = async () => ({ exitCode: 0, stdout: 'v20', stderr: '', timedOut: false, durationMs: 1 });
const missing: CommandRunner = async () => ({ exitCode: 127, stdout: '', stderr: 'not found', timedOut: false, durationMs: 1 });

describe('checkToolchain', () => {
  it('reports a present tool', async () => {
    expect(await checkToolchain(['node'], present)).toEqual([{ tool: 'node', present: true }]);
  });
  it('reports a missing tool', async () => {
    expect(await checkToolchain(['frobnicate'], missing)).toEqual([{ tool: 'frobnicate', present: false }]);
  });
});
