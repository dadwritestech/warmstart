import type { CommandRunner } from './verifier.js';

export interface ToolStatus { tool: string; present: boolean; }

export async function checkToolchain(tools: string[], run: CommandRunner): Promise<ToolStatus[]> {
  const out: ToolStatus[] = [];
  for (const tool of tools) {
    const r = await run(`${tool} --version`, { timeoutMs: 5000 });
    out.push({ tool, present: r.exitCode === 0 });
  }
  return out;
}
