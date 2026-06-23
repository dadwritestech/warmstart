import spawn from 'cross-spawn';
import type { RunResult, CommandRunner } from './verifier.js';

export const runCommand: CommandRunner = (command, opts) =>
  new Promise<RunResult>((resolve) => {
    const start = Date.now();
    const [bin, ...args] = command.split(/\s+/).filter(Boolean);
    const child = spawn(bin, args, { cwd: opts.cwd });
    let stdout = '', stderr = '', done = false;
    const finish = (r: RunResult) => { if (!done) { done = true; clearTimeout(timer); resolve(r); } };
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({ exitCode: 124, stdout, stderr, timedOut: true, durationMs: Date.now() - start });
    }, opts.timeoutMs);
    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });
    child.on('error', () =>
      finish({ exitCode: 127, stdout, stderr: `command not found: ${bin}`, timedOut: false, durationMs: Date.now() - start }));
    child.on('close', (code) =>
      finish({ exitCode: code ?? 1, stdout, stderr, timedOut: false, durationMs: Date.now() - start }));
  });
