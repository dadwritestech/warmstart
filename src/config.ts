import { parse as parseYaml } from 'yaml';

export interface WarmstartConfig {
  timeoutMs: number;
  flakyRuns: number;
  network: boolean;
  disable: string[];
  env: Record<string, string>;
}

export const DEFAULT_CONFIG: WarmstartConfig = {
  timeoutMs: 120_000, flakyRuns: 1, network: false, disable: [], env: {},
};

export function parseConfig(json?: string, yaml?: string): WarmstartConfig {
  let raw: Partial<WarmstartConfig> = {};
  if (json !== undefined) { try { raw = JSON.parse(json); } catch { raw = {}; } }
  else if (yaml !== undefined) { try { raw = (parseYaml(yaml) as Partial<WarmstartConfig>) ?? {}; } catch { raw = {}; } }
  return { ...DEFAULT_CONFIG, ...raw, disable: raw.disable ?? [], env: raw.env ?? {} };
}
