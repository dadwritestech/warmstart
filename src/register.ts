import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function mcpEntry() {
  return { command: 'npx', args: ['warmstart', 'serve'] };
}

export function registerClaudeCode(repoRoot: string): void {
  const p = join(repoRoot, '.mcp.json');
  let cfg: { mcpServers: Record<string, unknown> } = { mcpServers: {} };
  if (existsSync(p)) {
    try {
      const parsed = JSON.parse(readFileSync(p, 'utf8')) as { mcpServers?: Record<string, unknown> };
      cfg = { mcpServers: parsed.mcpServers ?? {} };
    } catch { cfg = { mcpServers: {} }; }
  }
  cfg.mcpServers.warmstart = mcpEntry();
  writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
}
