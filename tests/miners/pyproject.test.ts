import { describe, it, expect } from 'vitest';
import { minePyproject } from '../../src/miners/pyproject.js';

const toml = [
  '[tool.poetry]', 'name = "x"', '',
  '[tool.pytest.ini_options]', 'addopts = "-q"', '',
  '[tool.ruff]', 'line-length = 100', '',
  '[tool.mypy]', 'strict = true',
].join('\n');

describe('minePyproject', () => {
  it('infers tool commands from sections', () => {
    const c = minePyproject({ 'pyproject.toml': toml });
    const cmds = Object.fromEntries(c.map((x) => [x.category, x.command]));
    expect(cmds.install).toBe('poetry install');
    expect(cmds.test).toBe('pytest');
    expect(cmds.lint).toBe('ruff check .');
    expect(cmds.typecheck).toBe('mypy .');
  });
  it('returns [] without pyproject.toml', () => {
    expect(minePyproject({})).toEqual([]);
  });
});
