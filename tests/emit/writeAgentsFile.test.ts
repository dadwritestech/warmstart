import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeAgentsFile } from '../../src/emit/writeAgentsFile.js';
import { START, END } from '../../src/emit/agentsMd.js';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'ws-')); });
const block = `${START}\nGEN\n${END}\n`;

describe('writeAgentsFile', () => {
  it('creates the file when absent', () => {
    writeAgentsFile(join(dir, 'AGENTS.md'), block, {});
    expect(readFileSync(join(dir, 'AGENTS.md'), 'utf8')).toContain('GEN');
  });
  it('replaces only the delimited block, preserving user prose', () => {
    const p = join(dir, 'AGENTS.md');
    writeFileSync(p, `# My notes\n\n${START}\nOLD\n${END}\n\nmore prose\n`);
    writeAgentsFile(p, block, {});
    const out = readFileSync(p, 'utf8');
    expect(out).toContain('# My notes');
    expect(out).toContain('more prose');
    expect(out).toContain('GEN');
    expect(out).not.toContain('OLD');
  });
  it('backs up a hand-written file with no markers, then injects block', () => {
    const p = join(dir, 'AGENTS.md');
    writeFileSync(p, '# Hand written\n');
    writeAgentsFile(p, block, {});
    expect(existsSync(p + '.bak')).toBe(true);
    expect(readFileSync(p, 'utf8')).toContain('GEN');
    expect(readFileSync(p, 'utf8')).toContain('# Hand written');
  });
});
