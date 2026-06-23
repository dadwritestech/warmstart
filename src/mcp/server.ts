import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Category, Manifest } from '../types.js';

export interface Handlers {
  readManifest(): string;
  getCommand(category: string): string | null;
}

export function buildHandlers(load: () => Manifest | null): Handlers {
  return {
    readManifest: () => JSON.stringify(load() ?? { facts: [] }),
    getCommand: (category) => {
      const f = (load()?.facts ?? []).find((x) => x.category === (category as Category) && x.status === 'passed');
      return f?.command ?? null;
    },
  };
}

export async function serve(load: () => Manifest | null): Promise<void> {
  const h = buildHandlers(load);
  const server = new Server({ name: 'warmstart', version: '0.1.0' }, { capabilities: { resources: {}, tools: {} } });
  // Best-effort transport glue. All business logic lives in buildHandlers (unit-tested).
  // If the installed @modelcontextprotocol/sdk request-handler API differs, keep buildHandlers
  // exactly as above and adjust ONLY this serve() wiring so it typechecks and connects.
  await server.connect(new StdioServerTransport());
}
