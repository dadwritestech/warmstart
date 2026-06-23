import { describe, it, expect } from 'vitest';
import { buildHandlers } from '../../src/mcp/server.js';
import { SCHEMA_VERSION, type Manifest } from '../../src/types.js';

const m: Manifest = {
  schemaVersion: SCHEMA_VERSION, generatedAt: 'now', repoRoot: '/x',
  platform: { os: 'linux', arch: 'x64', node: 'v20' },
  facts: [{ category: 'test', command: 'npm run test', source: 's', provenance: 'p', confidence: 0.8, status: 'passed' }],
};

describe('mcp handlers', () => {
  it('manifest resource returns the stored manifest', () => {
    const h = buildHandlers(() => m);
    expect(JSON.parse(h.readManifest()).facts[0].command).toBe('npm run test');
  });
  it('get_command returns the passed command for a category', () => {
    const h = buildHandlers(() => m);
    expect(h.getCommand('test')).toBe('npm run test');
  });
  it('get_command returns null for a missing category', () => {
    const h = buildHandlers(() => m);
    expect(h.getCommand('build')).toBeNull();
  });
});
