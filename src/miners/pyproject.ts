import { parse } from 'smol-toml';
import type { Candidate, Category } from '../types.js';

interface Rule { section: string; category: Category; command: string; }
const RULES: Rule[] = [
  { section: 'tool.poetry', category: 'install', command: 'poetry install' },
  { section: 'tool.pytest.ini_options', category: 'test', command: 'pytest' },
  { section: 'tool.ruff', category: 'lint', command: 'ruff check .' },
  { section: 'tool.mypy', category: 'typecheck', command: 'mypy .' },
];

function hasSection(obj: unknown, dotted: string): boolean {
  let cur: any = obj;
  for (const part of dotted.split('.')) {
    if (cur == null || typeof cur !== 'object' || !(part in cur)) return false;
    cur = cur[part];
  }
  return true;
}

export function minePyproject(inputs: Record<string, string | undefined>): Candidate[] {
  const raw = inputs['pyproject.toml'];
  if (raw === undefined) return [];
  let doc: unknown;
  try { doc = parse(raw); } catch { return []; }
  const out: Candidate[] = [];
  for (const r of RULES) {
    if (!hasSection(doc, r.section)) continue;
    out.push({
      category: r.category, command: r.command,
      source: `pyproject.toml:[${r.section}]`,
      provenance: `inferred from [${r.section}]`, confidence: 0.7,
    });
  }
  return out;
}
