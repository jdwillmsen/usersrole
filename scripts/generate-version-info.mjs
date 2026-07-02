import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVersionInfo } from './version-info.lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

let commit = 'dev';
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  // No git (e.g. exported source) — keep the 'dev' fallback.
}

const info = buildVersionInfo(pkg, {
  commit,
  builtAt: new Date().toISOString(),
  env: process.env.NODE_ENV || 'unknown'
});

const file = `// Generated at build time by scripts/generate-version-info.mjs. Do not edit.
export interface VersionInfo {
  app: string;
  commit: string;
  builtAt: string;
  env: string;
  deps: Record<string, string>;
}

export const VERSION_INFO: VersionInfo = ${JSON.stringify(info, null, 2)};
`;

mkdirSync(resolve(root, 'src/generated'), { recursive: true });
writeFileSync(resolve(root, 'src/generated/version-info.ts'), file);
console.log(`Wrote src/generated/version-info.ts (commit ${info.commit}, env ${info.env}).`);
