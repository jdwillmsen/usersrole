import { defineString } from 'firebase-functions/params';

// Empty means nobody may sign up: a fresh deploy stays closed until its owner
// lists who is welcome, instead of letting anyone on the internet create an
// account and run up Auth and Functions usage.
export const signupAllowlist = defineString('SIGNUP_ALLOWLIST', {
  default: '',
  description:
    'Comma-separated emails or @domains allowed to create accounts; empty closes sign-up'
});

// Entries are exact addresses (jane@example.com) or whole domains
// (@example.com). Matching is case-insensitive because providers differ in
// how they case the address they hand back.
export function isEmailAllowed(
  email: string | undefined,
  allowlist: string
): boolean {
  if (!email) {
    return false;
  }
  const address = email.trim().toLowerCase();
  const at = address.lastIndexOf('@');
  if (at <= 0) {
    return false;
  }
  const domain = address.slice(at);
  return allowlist
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0)
    .some((entry) =>
      entry.startsWith('@') ? entry === domain : entry === address
    );
}
