export const ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL =
  'auth/account-exists-with-different-credential';
export const USER_NOT_FOUND = 'auth/user-not-found';
export const WRONG_PASSWORD = 'auth/wrong-password';
// Modern Firebase Auth collapses user-not-found/wrong-password into this
// single code when email enumeration protection is enabled (default).
export const INVALID_CREDENTIAL = 'auth/invalid-credential';
