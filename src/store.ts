import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Manifest } from './types.js';

export function serializeManifest(m: Manifest): string {
  const sorted: Manifest = {
    ...m,
    facts: [...m.facts].sort((a, b) =>
      a.category === b.category ? a.command.localeCompare(b.command)
        : a.category.localeCompare(b.category)),
  };
  return JSON.stringify(sorted, null, 2) + '\n';
}

export function saveManifest(path: string, m: Manifest): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serializeManifest(m), 'utf8');
}

export function loadManifest(path: string): Manifest | null {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')) as Manifest; } catch { return null; }
}
