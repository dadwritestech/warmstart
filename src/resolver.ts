import type { Candidate, Category } from './types.js';

const ORDER: Category[] = ['install', 'build', 'typecheck', 'lint', 'test', 'run', 'dev'];

export function resolve(candidates: Candidate[]): Candidate[] {
  const byCmd = new Map<string, Candidate>();
  for (const cand of candidates) {
    const key = cand.command.trim();
    const prev = byCmd.get(key);
    if (!prev || cand.confidence > prev.confidence) byCmd.set(key, cand);
  }
  return [...byCmd.values()].sort((a, b) => {
    const d = ORDER.indexOf(a.category) - ORDER.indexOf(b.category);
    return d !== 0 ? d : b.confidence - a.confidence;
  });
}
