import { createInterface } from 'node:readline/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInit } from './init.js';
import { serve } from './mcp/server.js';
import { loadManifest } from './store.js';
import { checkToolchain } from './doctor.js';
import { runCommand } from './runner.js';
import { registerClaudeCode } from './register.js';

export interface CliArgs { command?: string; yes: boolean; json: boolean; }

export function parseArgs(argv: string[]): CliArgs {
  return { command: argv[0], yes: argv.includes('--yes'), json: argv.includes('--json') };
}

async function askConsent(plan: string): Promise<boolean> {
  process.stdout.write(`warmstart will run these commands to verify them:\n${plan}\n`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = (await rl.question('Proceed? [y/N] ')).trim().toLowerCase();
  rl.close();
  return ans === 'y' || ans === 'yes';
}

export async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  const cwd = process.cwd();
  switch (args.command) {
    case 'init': {
      const res = await runInit({ repoRoot: cwd, run: runCommand,
        consent: args.yes ? async () => true : askConsent });
      if (res.verified) { registerClaudeCode(cwd); console.log('warmstart: AGENTS.md + MCP ready.'); }
      else console.log('warmstart: aborted (no consent).');
      return res.verified ? 0 : 1;
    }
    case 'serve':
      await serve(() => loadManifest(join(cwd, '.warmstart', 'manifest.json')));
      return 0;
    case 'doctor': {
      const r = await checkToolchain(['node', 'npm', 'git'], runCommand);
      for (const t of r) console.log(`${t.present ? '✓' : '✗'} ${t.tool}`);
      return 0;
    }
    default:
      console.log('usage: warmstart <init|serve|doctor> [--yes] [--json]');
      return args.command ? 1 : 0;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}
