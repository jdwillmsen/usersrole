import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isTailnetIpv4, loadConfig } from './config.ts';

test('accepts only the tailnet CGNAT range', () => {
  for (const ip of ['100.64.0.1', '100.100.238.72', '100.127.255.254'])
    assert.equal(isTailnetIpv4(ip), true, ip);
  for (const ip of [
    '0.0.0.0',
    '127.0.0.1',
    '100.63.0.1',
    '100.128.0.1',
    '192.168.1.10',
    '100.100.238.256',
    '',
    '::'
  ]) {
    assert.equal(isTailnetIpv4(ip), false, ip);
  }
});

test('refuses to configure a wildcard bind address', () => {
  assert.throws(
    () => loadConfig({ CAPTURE_BIND_IP: '0.0.0.0' }),
    /not a tailnet/
  );
});
