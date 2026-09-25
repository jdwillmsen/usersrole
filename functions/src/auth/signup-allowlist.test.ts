import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { isEmailAllowed, signupAllowlist } from './signup-allowlist';

test('an empty or whitespace-only allowlist closes sign-up', () => {
  assert.equal(isEmailAllowed('jane@example.com', ''), false);
  assert.equal(isEmailAllowed('jane@example.com', '   '), false);
  assert.equal(isEmailAllowed('jane@example.com', ' , '), false);
});

test('an unset SIGNUP_ALLOWLIST falls back to the closed default', () => {
  delete process.env.SIGNUP_ALLOWLIST;
  assert.equal(signupAllowlist.value(), '');
  assert.equal(
    isEmailAllowed('anyone@example.com', signupAllowlist.value()),
    false
  );
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
