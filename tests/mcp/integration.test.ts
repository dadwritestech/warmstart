import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildServer } from '../../src/mcp/server.js';
import { SCHEMA_VERSION, type Manifest } from '../../src/types.js';

const manifest: Manifest = {
  schemaVersion: SCHEMA_VERSION, generatedAt: 'now', repoRoot: '/x',
  platform: { os: 'linux', arch: 'x64', node: 'v20' },
  facts: [{ category: 'test', command: 'npm run test', source: 's', provenance: 'p', confidence: 0.8, status: 'passed' }],
};

async function connectedClient(load: () => Manifest | null): Promise<Client> {
  const server = buildServer(load);
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

describe('mcp serve (integration over a live client)', () => {
  it('exposes the manifest resource', async () => {
    const client = await connectedClient(() => manifest);
    const res = await client.readResource({ uri: 'warmstart://manifest' });
    const text = (res.contents[0] as { text: string }).text;
    expect(JSON.parse(text).facts[0].command).toBe('npm run test');
    await client.close();
  });

  it('answers get_command for a verified category', async () => {
    const client = await connectedClient(() => manifest);
    const out = await client.callTool({ name: 'get_command', arguments: { category: 'test' } });
    expect((out.content as { text: string }[])[0].text).toBe('npm run test');
    await client.close();
  });

  it('lists the registered resource and tool', async () => {
    const client = await connectedClient(() => manifest);
    const resources = await client.listResources();
    const tools = await client.listTools();
    expect(resources.resources.some((r) => r.uri === 'warmstart://manifest')).toBe(true);
    expect(tools.tools.some((t) => t.name === 'get_command')).toBe(true);
    await client.close();
  });
});
