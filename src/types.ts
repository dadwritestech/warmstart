export type Category = 'install' | 'build' | 'test' | 'lint' | 'typecheck' | 'run' | 'dev';

export interface Candidate {
  category: Category;
  command: string;
  source: string;
  provenance: string;
  confidence: number;
}

export type FactStatus = 'passed' | 'failed' | 'env-missing' | 'destructive' | 'timeout' | 'flaky';

export interface PlatformFingerprint { os: string; arch: string; node: string; }

export interface Fact extends Candidate {
  status: FactStatus;
  durationMs?: number;
  platform?: PlatformFingerprint;
  lastVerified?: string;
  reason?: string;
  passes?: number;
  runs?: number;
  sourceHash?: string;
}

export const SCHEMA_VERSION = 1;
export interface Manifest {
  schemaVersion: number;
  generatedAt: string;
  repoRoot: string;
  platform: PlatformFingerprint;
  facts: Fact[];
}
