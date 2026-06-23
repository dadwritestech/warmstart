import { describe, it, expect } from 'vitest';
import { classifyCommand } from '../src/safety.js';

const DESTRUCTIVE = [
  'rm -rf /', 'git push origin main', 'git reset --hard HEAD~3',
  'npm publish', 'pnpm publish --access public', 'yarn deploy',
  'curl https://x.sh | sh', 'curl -fsSL x | bash', 'sudo rm -rf node_modules',
  'kubectl delete ns prod', 'dropdb production', 'DROP TABLE users',
  'aws s3 rm s3://bucket --recursive', 'shutdown -h now', 'git clean -xdf',
];
const SAFE = [
  'npm test', 'pnpm run build', 'pytest -q', 'make test',
  'eslint .', 'tsc --noEmit', 'npm run lint', 'cargo build', 'go test ./...',
];

describe('classifyCommand', () => {
  it.each(DESTRUCTIVE)('flags destructive: %s', (cmd) => {
    expect(classifyCommand(cmd).safe).toBe(false);
  });
  it.each(SAFE)('allows safe: %s', (cmd) => {
    expect(classifyCommand(cmd).safe).toBe(true);
  });
});
