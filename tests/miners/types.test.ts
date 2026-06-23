import { describe, it, expect } from 'vitest';
import { categoryForScript } from '../../src/miners/types.js';

describe('categoryForScript', () => {
  it('maps known names', () => {
    expect(categoryForScript('test')).toBe('test');
    expect(categoryForScript('build')).toBe('build');
    expect(categoryForScript('lint')).toBe('lint');
    expect(categoryForScript('typecheck')).toBe('typecheck');
    expect(categoryForScript('tsc')).toBe('typecheck');
    expect(categoryForScript('dev')).toBe('dev');
    expect(categoryForScript('start')).toBe('run');
  });
  it('returns null for unknown', () => {
    expect(categoryForScript('postinstall')).toBeNull();
  });
});
