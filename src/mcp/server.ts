import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
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
  const server = new McpServer({ name: 'warmstart', version: '0.1.0' });

  // Resource: the whole verified manifest in one read.
  server.registerResource(
    'manifest',
    'warmstart://manifest',
    { title: 'warmstart manifest', description: 'Verified dev-loop commands for this repo', mimeType: 'application/json' },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: h.readManifest() }] }),
  );

  // Tool: get the verified command for a category (e.g. "test", "build").
  server.registerTool(
    'get_command',
    { title: 'get_command', description: 'Return the verified command for a category, or null', inputSchema: { category: z.string() } },
    async ({ category }) => {
      const cmd = h.getCommand(category);
      return { content: [{ type: 'text', text: cmd ?? 'null' }] };
    },
  );

  await server.connect(new StdioServerTransport());
}
