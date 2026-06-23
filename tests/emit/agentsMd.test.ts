import { describe, it, expect } from 'vitest';
import { renderAgentsMd, START, END } from '../../src/emit/agentsMd.js';
import { SCHEMA_VERSION, type Manifest } from '../../src/types.js';

const m: Manifest = {
  schemaVersion: SCHEMA_VERSION, generatedAt: '2026-06-22T00:00:00Z', repoRoot: '/x',
  platform: { os: 'darwin', arch: 'arm64', node: 'v20' },
  facts: [
    { category: 'test', command: 'pnpm run test', source: 's', provenance: 'p', confidence: 0.8,
      status: 'passed', lastVerified: '2026-06-22', platform: { os: 'darwin', arch: 'arm64', node: 'v20' } },
    { category: 'build', command: 'make deploy', source: 's', provenance: 'p', confidence: 0.6,
      status: 'destructive', reason: 'deploy/release/publish' },
  ],
};

describe('renderAgentsMd', () => {
  it('wraps content in warmstart delimiters', () => {
    const out = renderAgentsMd(m);
    expect(out).toContain(START);
    expect(out).toContain(END);
  });
  it('stamps passed commands with platform + date', () => {
    expect(renderAgentsMd(m)).toMatch(/pnpm run test.*✓ passed.*darwin\/arm64/s);
  });
  it('marks destructive as not-run', () => {
    expect(renderAgentsMd(m)).toMatch(/make deploy.*not-run: destructive/s);
  });
  it('never embeds raw command output (no stdout field)', () => {
    expect(renderAgentsMd(m)).not.toContain('stdout');
  });
});
