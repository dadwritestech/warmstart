import type { Candidate, Category } from '../types.js';

/** A miner is a pure function: source text(s) → candidates. fs stays out. */
export type Miner = (inputs: Record<string, string | undefined>) => Candidate[];

const MAP: Record<string, Category> = {
  test: 'test', tests: 'test',
  build: 'build', compile: 'build',
  lint: 'lint', format: 'lint',
  typecheck: 'typecheck', tsc: 'typecheck', 'type-check': 'typecheck',
  dev: 'dev', watch: 'dev',
  start: 'run', serve: 'run', run: 'run',
  install: 'install',
};

export function categoryForScript(name: string): Category | null {
  return MAP[name.toLowerCase()] ?? null;
}
