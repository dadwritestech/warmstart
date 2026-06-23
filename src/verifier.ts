import type { Candidate, Fact, PlatformFingerprint } from './types.js';
import { classifyCommand } from './safety.js';
import { redact } from './redact.js';

export interface RunResult { exitCode: number; stdout: string; stderr: string; timedOut: boolean; durationMs: number; }
export type CommandRunner = (command: string, opts: { cwd?: string; timeoutMs: number }) => Promise<RunResult>;
export interface VerifyOpts { timeoutMs: number; flakyRuns: number; cwd?: string; }

const ENV_HINT = /command not found|not recognized|ENOENT|No such file|ECONNREFUSED|connection refused|EACCES|missing.*environment|\.env\b/i;

function platform(): PlatformFingerprint {
  return { os: process.platform, arch: process.arch, node: process.version };
}
function distill(r: RunResult): string {
  const tail = (r.stderr || r.stdout).split(/\r?\n/).filter(Boolean).slice(-3).join(' ');
  return redact(tail).slice(0, 300);
}

export async function verifyCandidate(c: Candidate, opts: VerifyOpts, run: CommandRunner): Promise<Fact> {
  const base: Fact = { ...c, status: 'failed', platform: platform(), lastVerified: new Date().toISOString() };
  const verdict = classifyCommand(c.command);
  if (!verdict.safe) return { ...base, status: 'destructive', reason: verdict.reason };

  const first = await run(c.command, { cwd: opts.cwd, timeoutMs: opts.timeoutMs });
  base.durationMs = first.durationMs;
  if (first.timedOut) return { ...base, status: 'timeout' };
  if (first.exitCode !== 0) {
    return { ...base, status: ENV_HINT.test(first.stderr) ? 'env-missing' : 'failed', reason: distill(first) };
  }
  let passes = 1;
  for (let i = 1; i < opts.flakyRuns; i++) {
    const r = await run(c.command, { cwd: opts.cwd, timeoutMs: opts.timeoutMs });
    if (r.exitCode === 0 && !r.timedOut) passes++;
  }
  if (passes < opts.flakyRuns) return { ...base, status: 'flaky', passes, runs: opts.flakyRuns };
  return { ...base, status: 'passed' };
}
