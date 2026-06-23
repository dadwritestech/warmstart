import { describe, it, expect } from 'vitest';
import { redact } from '../src/redact.js';

describe('redact', () => {
  it('masks AWS access keys', () => {
    expect(redact('key=AKIAIOSFODNN7EXAMPLE')).not.toContain('AKIAIOSFODNN7EXAMPLE');
  });
  it('masks *_TOKEN / *_SECRET assignments', () => {
    expect(redact('GITHUB_TOKEN=ghp_abc123def')).toContain('GITHUB_TOKEN=***');
    expect(redact('API_SECRET: hunter2')).toContain('API_SECRET');
    expect(redact('API_SECRET: hunter2')).not.toContain('hunter2');
  });
  it('masks credentials embedded in URLs', () => {
    expect(redact('postgres://user:pass@db:5432/x')).toContain('***:***@');
  });
  it('rewrites home paths to ~', () => {
    expect(redact('at C:\\Users\\vamsi\\repo\\a.ts')).toContain('~');
    expect(redact('at C:\\Users\\vamsi\\repo\\a.ts')).not.toContain('vamsi');
    expect(redact('/home/alice/proj/b.ts')).not.toContain('alice');
    expect(redact('/Users/bob/proj/c.ts')).not.toContain('bob');
  });
  it('leaves ordinary text intact', () => {
    expect(redact('3 tests passed in 1.2s')).toBe('3 tests passed in 1.2s');
  });
});
