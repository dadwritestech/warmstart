import { describe, it, expect } from 'vitest';
import { mineMakefile } from '../../src/miners/makefile.js';

const mk = ['test:', '\tpytest', '', 'build:', '\tgo build ./...', '', '.PHONY: test build'].join('\n');

describe('mineMakefile', () => {
  it('extracts known targets as make commands', () => {
    const c = mineMakefile({ Makefile: mk });
    expect(c.find((x) => x.category === 'test')!.command).toBe('make test');
    expect(c.find((x) => x.category === 'build')!.command).toBe('make build');
  });
  it('skips .PHONY and pattern lines', () => {
    const c = mineMakefile({ Makefile: mk });
    expect(c.some((x) => x.command.includes('PHONY'))).toBe(false);
  });
  it('returns [] without a Makefile', () => {
    expect(mineMakefile({})).toEqual([]);
  });
});
