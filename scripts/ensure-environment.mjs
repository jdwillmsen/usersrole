// Angular's fileReplacements refuse to swap in environment.emulator.ts unless
// the file it replaces exists, and environment.ts is gitignored because real
// deployments fill it from a secret. A fresh clone gets the blank template;
// an existing environment.ts is never touched.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/environments'
);
const target = resolve(dir, 'environment.ts');

if (!existsSync(target)) {
  copyFileSync(resolve(dir, 'environment.template.ts'), target);
  console.log('Created src/environments/environment.ts from the template');
}
