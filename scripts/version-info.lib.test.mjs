import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildVersionInfo, DEFAULT_ALLOW_LIST } from './version-info.lib.mjs';

const pkg = {
  version: '1.2.3',
  dependencies: { '@angular/core': '22.0.2', firebase: '^12.0.0', tslib: '2.5.3' },
  devDependencies: { typescript: '6.0.3' }
};

test('filters deps to the allow-list and keeps declared versions', () => {
  const info = buildVersionInfo(pkg, { commit: 'abc1234', builtAt: '2026-07-01T00:00:00Z', env: 'production' });
  assert.equal(info.app, '1.2.3');
  assert.equal(info.commit, 'abc1234');
  assert.equal(info.env, 'production');
  assert.equal(info.deps['@angular/core'], '22.0.2');
  assert.equal(info.deps['firebase'], '^12.0.0');
  assert.equal(info.deps['typescript'], '6.0.3');
  assert.equal(info.deps['tslib'], undefined); // not on allow-list
});

test('falls back when fields are missing', () => {
  const info = buildVersionInfo({}, {});
  assert.equal(info.app, 'unknown');
  assert.equal(info.commit, 'dev');
  assert.equal(info.builtAt, 'unknown');
  assert.equal(info.env, 'unknown');
  assert.deepEqual(info.deps, {});
});

test('DEFAULT_ALLOW_LIST includes the key libraries', () => {
  for (const name of ['@angular/core', '@angular/material', 'firebase', 'rxjs']) {
    assert.ok(DEFAULT_ALLOW_LIST.includes(name), `${name} missing`);
  }
});
