import { describe, it, expect } from 'vitest';
import { parseArgs } from '../src/cli.js';

describe('parseArgs', () => {
  it('parses init with --yes', () => {
    expect(parseArgs(['init', '--yes'])).toEqual({ command: 'init', yes: true, json: false });
  });
  it('defaults to no command', () => {
    expect(parseArgs([])).toEqual({ command: undefined, yes: false, json: false });
  });
  it('parses serve', () => {
    expect(parseArgs(['serve'])).toEqual({ command: 'serve', yes: false, json: false });
  });
});
