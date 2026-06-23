import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import type { CommandRunner } from './verifier.js';
import { verifyCandidate } from './verifier.js';
import { scanRepo } from './scan.js';
import { resolve } from './resolver.js';
import { saveManifest } from './store.js';
import { renderAgentsMd } from './emit/agentsMd.js';
import { writeAgentsFile } from './emit/writeAgentsFile.js';
import { parseConfig, type WarmstartConfig } from './config.js';
import { SCHEMA_VERSION, type Fact, type Manifest } from './types.js';

export interface InitOptions {
  repoRoot: string;
  consent: (plan: string) => Promise<boolean>;
  run: CommandRunner;
}
export interface InitResult { verified: boolean; manifest?: Manifest; }

function loadConfig(repoRoot: string): WarmstartConfig {
  const j = join(repoRoot, '.warmstartrc.json'), y = join(repoRoot, '.warmstartrc.yaml');
  return parseConfig(
    existsSync(j) ? readFileSync(j, 'utf8') : undefined,
    existsSync(y) ? readFileSync(y, 'utf8') : undefined,
  );
}

export async function runInit(opts: InitOptions): Promise<InitResult> {
  const cfg = loadConfig(opts.repoRoot);
  const candidates = resolve(scanRepo(opts.repoRoot)).filter((c) => !cfg.disable.includes(c.command));
  const plan = candidates.map((c) => `  ${c.category}: ${c.command}`).join('\n');
  if (!(await opts.consent(plan))) return { verified: false };

  const facts: Fact[] = [];
  for (const c of candidates) {
    facts.push(await verifyCandidate(c, { timeoutMs: cfg.timeoutMs, flakyRuns: cfg.flakyRuns, cwd: opts.repoRoot }, opts.run));
  }
  const manifest: Manifest = {
    schemaVersion: SCHEMA_VERSION, generatedAt: new Date().toISOString(),
    repoRoot: opts.repoRoot, platform: { os: process.platform, arch: process.arch, node: process.version }, facts,
  };
  saveManifest(join(opts.repoRoot, '.warmstart', 'manifest.json'), manifest);
  writeAgentsFile(join(opts.repoRoot, 'AGENTS.md'), renderAgentsMd(manifest), {});
  return { verified: true, manifest };
}
