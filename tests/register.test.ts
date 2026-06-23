import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { registerClaudeCode, mcpEntry } from '../src/register.js';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'ws-reg-')); });

describe('registration', () => {
  it('produces a valid MCP server entry', () => {
    expect(mcpEntry()).toEqual({ command: 'npx', args: ['warmstart', 'serve'] });
  });
  it('writes .mcp.json for Claude Code', () => {
    registerClaudeCode(dir);
    const cfg = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'));
    expect(cfg.mcpServers.warmstart.command).toBe('npx');
  });
  it('merges into an existing .mcp.json without dropping other servers', () => {
    const p = join(dir, '.mcp.json');
    writeFileSync(p, JSON.stringify({ mcpServers: { other: { command: 'x' } } }));
    registerClaudeCode(dir);
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    expect(cfg.mcpServers.other).toBeTruthy();
    expect(cfg.mcpServers.warmstart).toBeTruthy();
  });
});
