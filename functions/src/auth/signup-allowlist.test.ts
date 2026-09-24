import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { isEmailAllowed } from './signup-allowlist';

test('an empty allowlist closes sign-up', () => {
  assert.equal(isEmailAllowed('jane@example.com', ''), false);
  assert.equal(isEmailAllowed('jane@example.com', ' , '), false);
});

test('exact addresses match case-insensitively', () => {
  const list = 'Jane@Example.com, bob@example.org';
  assert.equal(isEmailAllowed('jane@example.com', list), true);
  assert.equal(isEmailAllowed('BOB@example.org', list), true);
  assert.equal(isEmailAllowed('eve@example.com', list), false);
});

test('@domain entries admit the whole domain and nothing else', () => {
  const list = '@example.com';
  assert.equal(isEmailAllowed('anyone@example.com', list), true);
  assert.equal(isEmailAllowed('anyone@notexample.com', list), false);
  assert.equal(isEmailAllowed('anyone@sub.example.com', list), false);
  assert.equal(isEmailAllowed('example.com@evil.test', list), false);
});

test('a missing or malformed email is never allowed', () => {
  assert.equal(isEmailAllowed(undefined, '@example.com'), false);
  assert.equal(isEmailAllowed('', '@example.com'), false);
  assert.equal(isEmailAllowed('@example.com', '@example.com'), false);
});
