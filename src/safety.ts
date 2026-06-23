export interface SafetyVerdict { safe: boolean; reason?: string; }

const DENY: Array<[RegExp, string]> = [
  [/\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, 'recursive force remove'],
  [/\bgit\s+(push|reset\s+--hard|clean\s+-[a-z]*f)/i, 'destructive git'],
  [/\b(npm|pnpm|yarn|bun)\s+publish\b/i, 'package publish'],
  [/\b(deploy|release|publish)\b/i, 'deploy/release/publish'],
  [/\bcurl\b[^\n]*\|\s*(sh|bash|zsh)/i, 'pipe-to-shell'],
  [/\bsudo\b/i, 'sudo'],
  [/\b(drop\s+(table|database)|truncate\s+table)\b/i, 'destructive SQL'],
  [/\bdropdb\b/i, 'drop database'],
  [/\b(kubectl|aws|gcloud|az)\b[^\n]*\b(delete|rm)\b/i, 'cloud delete'],
  [/\b(shutdown|reboot|mkfs)\b/i, 'system-level'],
  [/\b(format)\s+[a-z]:/i, 'disk format'],
];

export function classifyCommand(command: string): SafetyVerdict {
  for (const [re, reason] of DENY) {
    if (re.test(command)) return { safe: false, reason };
  }
  return { safe: true };
}
