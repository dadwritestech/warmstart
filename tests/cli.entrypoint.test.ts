import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, symlinkSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isEntrypoint } from '../src/cli.js';

let dir: string;
beforeEach(() => { dir = realpathSync(mkdtempSync(join(tmpdir(), 'ws-ep-'))); });

describe('isEntrypoint', () => {
  it('matches a direct invocation', () => {
    const real = join(dir, 'cli.js'); writeFileSync(real, '// stub');
    expect(isEntrypoint(real, pathToFileURL(real).href)).toBe(true);
  });

  it('matches when invoked via a symlink (the global-install regression)', () => {
    const real = join(dir, 'cli.js'); writeFileSync(real, '// stub');
    const link = join(dir, 'warmstart');
    try { symlinkSync(real, link); } catch { return; } // skip if symlinks unavailable (Windows non-admin)
    // argv[1] is the symlink, import.meta.url is the resolved real file — must still match.
    expect(isEntrypoint(link, pathToFileURL(real).href)).toBe(true);
  });

  it('does not match an unrelated path', () => {
    const real = join(dir, 'cli.js'); writeFileSync(real, '// stub');
    const other = join(dir, 'other.js'); writeFileSync(other, '// x');
    expect(isEntrypoint(other, pathToFileURL(real).href)).toBe(false);
  });

  it('returns false when there is no argv[1]', () => {
    const real = join(dir, 'cli.js'); writeFileSync(real, '// stub');
    expect(isEntrypoint(undefined, pathToFileURL(real).href)).toBe(false);
  });
});
