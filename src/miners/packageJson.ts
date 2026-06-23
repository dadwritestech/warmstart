import type { Candidate } from '../types.js';
import { categoryForScript } from './types.js';

function detectPm(inputs: Record<string, string | undefined>): string {
  if (inputs['pnpm-lock.yaml'] !== undefined) return 'pnpm';
  if (inputs['yarn.lock'] !== undefined) return 'yarn';
  if (inputs['bun.lockb'] !== undefined) return 'bun';
  return 'npm';
}

export function minePackageJson(inputs: Record<string, string | undefined>): Candidate[] {
  const raw = inputs['package.json'];
  if (raw === undefined) return [];
  let pkg: { scripts?: Record<string, string> };
  try { pkg = JSON.parse(raw); } catch { return []; }
  const pm = detectPm(inputs);
  const out: Candidate[] = [{
    category: 'install', command: `${pm} install`,
    source: 'package.json', provenance: `${pm} install (from lockfile)`, confidence: 0.85,
  }];
  for (const [name, body] of Object.entries(pkg.scripts ?? {})) {
    const cat = categoryForScript(name);
    if (!cat || cat === 'install') continue;
    out.push({
      category: cat, command: `${pm} run ${name}`,
      source: `package.json:scripts.${name}`,
      provenance: `${pm} script "${name}" (${body})`, confidence: 0.8,
    });
  }
  return out;
}
