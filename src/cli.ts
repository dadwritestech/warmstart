import { pathToFileURL } from 'node:url';

export function main(argv: string[]): number {
  const cmd = argv[0];
  console.log(`warmstart: ${cmd ?? 'no command'}`);
  return 0;
}

// Cross-platform entrypoint check: pathToFileURL handles Windows backslashes
// and the file:/// vs file:// difference that breaks a naive string compare.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
