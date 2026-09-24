import assert from 'node:assert/strict';
import { test } from 'node:test';
import { looksLikePii } from './redact.ts';

test('flags emails, including inside surrounding text', () => {
  assert.equal(looksLikePii('someone@example.com'), true);
  assert.equal(
    looksLikePii('  Signed in as first.last+tag@sub.example.co.uk '),
    true
  );
});

test('flags a bare 28-character Firebase UID', () => {
  assert.equal(looksLikePii('a1B2c3D4e5F6g7H8i9J0k1L2m3N4'), true);
});

test('leaves ordinary console text alone', () => {
  for (const text of [
    'Authentication',
    'usersrole',
    'Sep 24, 2026',
    'Google',
    'a1B2c3D4e5F6g7H8i9J0k1L2m3N4x',
    'project-id-with-dashes-12345'
  ]) {
    assert.equal(looksLikePii(text), false, text);
  }
});
