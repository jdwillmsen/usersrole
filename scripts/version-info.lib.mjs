export const DEFAULT_ALLOW_LIST = [
  '@angular/core',
  '@angular/material',
  '@angular/cdk',
  'firebase',
  'rxfire',
  'ag-grid-community',
  'rxjs',
  'typescript'
];

export function buildVersionInfo(pkg, options = {}, allowList = DEFAULT_ALLOW_LIST) {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const deps = {};
  for (const name of allowList) {
    if (allDeps[name]) deps[name] = allDeps[name];
  }
  return {
    app: pkg.version || 'unknown',
    commit: options.commit || 'dev',
    builtAt: options.builtAt || 'unknown',
    env: options.env || 'unknown',
    deps
  };
}
