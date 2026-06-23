import { describe, it, expect } from 'vitest';
import { SCHEMA_VERSION, type Manifest } from '../src/types.js';

describe('types', () => {
  it('exposes a numeric schema version', () => {
    expect(typeof SCHEMA_VERSION).toBe('number');
  });
  it('Manifest shape is constructible', () => {
    const m: Manifest = {
      schemaVersion: SCHEMA_VERSION, generatedAt: '2026-06-22T00:00:00Z',
      repoRoot: '/x', platform: { os: 'linux', arch: 'x64', node: 'v20' }, facts: [],
    };
    expect(m.facts).toEqual([]);
  });
});
