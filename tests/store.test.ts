import { describe, it, expect } from 'vitest';
import { serializeManifest } from '../src/store.js';
import { SCHEMA_VERSION, type Manifest } from '../src/types.js';

const m: Manifest = {
  schemaVersion: SCHEMA_VERSION, generatedAt: '2026-06-22T00:00:00Z', repoRoot: '/x',
  platform: { os: 'linux', arch: 'x64', node: 'v20' },
  facts: [
    { category: 'test', command: 'b', source: 's', provenance: 'p', confidence: 0.5, status: 'passed' },
    { category: 'test', command: 'a', source: 's', provenance: 'p', confidence: 0.5, status: 'passed' },
  ],
};

describe('serializeManifest', () => {
  it('is stable: facts sorted by command, deterministic output', () => {
    const out = serializeManifest(m);
    expect(out.indexOf('"command": "a"')).toBeLessThan(out.indexOf('"command": "b"'));
    expect(serializeManifest(m)).toBe(out);
  });
  it('includes schemaVersion', () => {
    expect(JSON.parse(serializeManifest(m)).schemaVersion).toBe(SCHEMA_VERSION);
  });
});
