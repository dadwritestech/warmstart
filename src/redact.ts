const RULES: Array<[RegExp, string]> = [
  [/AKIA[0-9A-Z]{16}/g, '***'],
  [/\b([A-Za-z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|PWD|APIKEY|API_KEY|KEY))\b(\s*[:=]\s*)\S+/gi, '$1$2***'],
  [/\/\/([^/\s:@]+):([^/\s:@]+)@/g, '//***:***@'],
  [/[A-Za-z]:\\Users\\[^\\\s"']+/g, '~'],
  [/\/(?:home|Users)\/[^/\s"']+/g, '~'],
];

export function redact(text: string): string {
  let out = text;
  for (const [re, repl] of RULES) out = out.replace(re, repl);
  return out;
}
