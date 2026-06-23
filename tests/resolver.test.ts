import { describe, it, expect } from 'vitest';
import { resolve } from '../src/resolver.js';
import type { Candidate } from '../src/types.js';

const c = (over: Partial<Candidate>): Candidate => ({
  category: 'test', command: 'x', source: 's', provenance: 'p', confidence: 0.5, ...over,
});

describe('resolve', () => {
  it('dedupes identical commands, keeping highest confidence', () => {
    const out = resolve([c({ command: 'pytest', confidence: 0.5 }), c({ command: 'pytest', confidence: 0.9 })]);
    expect(out).toHaveLength(1);
    expect(out[0].confidence).toBe(0.9);
  });
  it('orders install before build before test', () => {
    const out = resolve([
      c({ category: 'test', command: 't' }),
      c({ category: 'install', command: 'i' }),
      c({ category: 'build', command: 'b' }),
    ]);
    expect(out.map((x) => x.category)).toEqual(['install', 'build', 'test']);
  });
});
