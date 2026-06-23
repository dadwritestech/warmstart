import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scanRepo } from '../src/scan.js';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'ws-scan-')); });

describe('scanRepo', () => {
  it('runs all miners over files present in the repo', () => {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'vitest' } }));
    writeFileSync(join(dir, 'package-lock.json'), '');
    const cands = scanRepo(dir);
    expect(cands.find((c) => c.command === 'npm run test')).toBeTruthy();
  });
  it('returns [] for an empty repo', () => {
    expect(scanRepo(dir)).toEqual([]);
  });
});
