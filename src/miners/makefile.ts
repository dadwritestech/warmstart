import type { Candidate } from '../types.js';
import { categoryForScript } from './types.js';

const TARGET = /^([a-zA-Z][a-zA-Z0-9_-]*)\s*:/;

export function mineMakefile(inputs: Record<string, string | undefined>): Candidate[] {
  const raw = inputs['Makefile'];
  if (raw === undefined) return [];
  const out: Candidate[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = TARGET.exec(line);
    if (!m) continue;
    const target = m[1];
    if (target.startsWith('.')) continue;
    const cat = categoryForScript(target);
    if (!cat) continue;
    out.push({
      category: cat, command: `make ${target}`,
      source: `Makefile:${target}`, provenance: `make target "${target}"`, confidence: 0.6,
    });
  }
  return out;
}
