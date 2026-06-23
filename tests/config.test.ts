import { describe, it, expect } from 'vitest';
import { parseConfig, DEFAULT_CONFIG } from '../src/config.js';

describe('parseConfig', () => {
  it('returns defaults for empty input', () => {
    expect(parseConfig(undefined, undefined)).toEqual(DEFAULT_CONFIG);
  });
  it('parses JSON overrides', () => {
    const c = parseConfig('{"timeoutMs": 5000, "flakyRuns": 3, "disable": ["make deploy"]}', undefined);
    expect(c.timeoutMs).toBe(5000);
    expect(c.flakyRuns).toBe(3);
    expect(c.disable).toContain('make deploy');
  });
  it('parses YAML overrides', () => {
    const c = parseConfig(undefined, 'timeoutMs: 7000\nnetwork: true\n');
    expect(c.timeoutMs).toBe(7000);
    expect(c.network).toBe(true);
  });
});
