import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Candidate } from './types.js';
import { minePackageJson } from './miners/packageJson.js';
import { mineMakefile } from './miners/makefile.js';
import { minePyproject } from './miners/pyproject.js';

const FILES = ['package.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb',
  'package-lock.json', 'Makefile', 'pyproject.toml'];

function readAll(repoRoot: string): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const f of FILES) {
    const p = join(repoRoot, f);
    if (existsSync(p)) out[f] = readFileSync(p, 'utf8');
  }
  return out;
}

export function scanRepo(repoRoot: string): Candidate[] {
  const inputs = readAll(repoRoot);
  return [...minePackageJson(inputs), ...mineMakefile(inputs), ...minePyproject(inputs)];
}
