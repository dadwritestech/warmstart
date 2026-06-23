import { describe, it, expect } from 'vitest';
import { minePackageJson } from '../../src/miners/packageJson.js';

const pkg = JSON.stringify({ scripts: { test: 'vitest', build: 'tsup', lint: 'eslint .' } });

describe('minePackageJson', () => {
  it('detects pnpm from lockfile and emits run commands', () => {
    const c = minePackageJson({ 'package.json': pkg, 'pnpm-lock.yaml': '' });
    const test = c.find((x) => x.category === 'test')!;
    expect(test.command).toBe('pnpm run test');
    expect(test.source).toBe('package.json:scripts.test');
    expect(c.find((x) => x.category === 'install')!.command).toBe('pnpm install');
  });
  it('defaults to npm when only package-lock present', () => {
    const c = minePackageJson({ 'package.json': pkg, 'package-lock.json': '' });
    expect(c.find((x) => x.category === 'test')!.command).toBe('npm run test');
  });
  it('ignores unknown scripts', () => {
    const c = minePackageJson({ 'package.json': JSON.stringify({ scripts: { postinstall: 'x' } }) });
    expect(c).toHaveLength(1);
    expect(c[0].category).toBe('install');
  });
  it('returns [] when no package.json', () => {
    expect(minePackageJson({})).toEqual([]);
  });
});
