import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { START, END } from './agentsMd.js';

export interface WriteOpts { force?: boolean; }

export function writeAgentsFile(path: string, block: string, _opts: WriteOpts): void {
  if (!existsSync(path)) { writeFileSync(path, block, 'utf8'); return; }
  const existing = readFileSync(path, 'utf8');
  const s = existing.indexOf(START), e = existing.indexOf(END);
  if (s !== -1 && e !== -1) {
    const next = existing.slice(0, s) + block.trim() + existing.slice(e + END.length);
    writeFileSync(path, next, 'utf8');
    return;
  }
  copyFileSync(path, path + '.bak');
  writeFileSync(path, existing.replace(/\s*$/, '') + '\n\n' + block, 'utf8');
}
