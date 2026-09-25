# Users Role — retirement walkthrough

Behavioural record of the live app captured while it still runs, before billing
is unlinked and the Firebase project is retired. It exists so the app's
user-facing behaviour and its live cloud configuration survive the shutdown.

- **Hosted app:** https://usersrole.web.app (also usersrole.firebaseapp.com)
- **API function:** https://us-central1-usersrole.cloudfunctions.net/api
- **Captured:** 2026-09-25, headless Chromium via `scripts/retirement-capture/app/capture.cjs`
- **Live config snapshot:** [`cli-snapshot.md`](./cli-snapshot.md)
- **Redacted request log:** [`api-calls.har.json`](./api-calls.har.json) (Authorization/App-Check headers and user records redacted)

## Test accounts

Throwaway accounts created through the app's own password sign-up. Both are
plain users (`roles: ['user']`); no roles were changed. They are deleted in a
later retirement step.

| Email | UID | Notes |
| --- | --- | --- |
| ur-retire-2ec87571@example.com | cFFUpxjp6KP41Z9prhrd5dR0tpg2 | primary; sign-up flow recorded with this one |
| ur-retire-4b6fd5fa@example.com | hrIYXqlTPcZulFB1sPO6JLKiXyO2 | created on an earlier capture pass; also needs deletion |

## How auth capture was limited

App Check is **ENFORCED** on this project's Identity Toolkit and Firestore. A
headless browser cannot produce a valid App Check attestation, so
`signInWithEmailAndPassword` is rejected with *"Firebase App Check token is
invalid"*. Sign-up still works headless because it goes through the `api`
function (server-side Admin SDK), which App Check does not gate. Every flow that
needs a signed-in session is therefore marked **needs headed session** and left
for the headed VNC browser.

## Flow checklist

| Flow | Status | Evidence |
| --- | --- | --- |
| Sign-up (password) | captured | `media/usersrole-01-sign-up.webm`, `screenshots/flow-01-sign-up-*.jpg` |
| Sign-in (password) | needs headed session | App Check blocks headless sign-in |
| Profile | needs headed session | — |
| Admin: list users | needs headed session | privileged view; headed only |
| Admin: change roles | needs headed session | privileged view; headed only |
| Self-promote to admin (privilege-escalation demo) | needs headed session | see security finding 1; **not automated here** |
| Theme switch (light/dark) | needs headed session | selector only shows when signed in |
| Sign-out | needs headed session | — |
| PWA install prompt | needs headed session | not observable headless (see nx notes) |
| OAuth: Google | needs headed session | `media/usersrole-07-oauth-google*.webm`, button screenshot captured |
| OAuth: GitHub | needs headed session | `media/usersrole-07-oauth-github*.webm`, button screenshot captured |
| OAuth: Twitter | needs headed session | `media/usersrole-07-oauth-twitter*.webm`, button screenshot captured |
| Screenshot matrix (sign-in/sign-up, desktop+mobile, light+dark) | captured | `screenshots/matrix-*.jpg` (8) |

OAuth popups here reached only the blank `usersrole.firebaseapp.com/__/auth/handler`
intermediary, not the provider consent screen — the handler does not redirect to
Google/GitHub/Twitter for an unattested headless client. The buttons and the
popup launch are recorded; the real third-party login must be done headed.

## Media (videos, not committed)

Videos live under `media/` and are **gitignored** — a later step uploads them as
GitHub Release assets. Screenshots are committed (all JPEG, well under 5 MB).

| File | Size |
| --- | --- |
| usersrole-01-sign-up.webm | 295 KB |
| usersrole-07-oauth-google.webm | 286 KB |
| usersrole-07-oauth-github.webm | 266 KB |
| usersrole-07-oauth-twitter.webm | 283 KB |
| usersrole-07-oauth-{google,github,twitter}-popup1.webm | ~24 KB each |

## Security findings at retirement

Read-only observations of the live app and its code. Recorded here because they
are worth carrying forward; none were exploited.

1. **Privilege escalation: any user can make itself admin.** `PATCH /users/:id`
   runs `isAuthorized({ hasRole: ['admin','manager'], allowSameUser: true })`,
   so a signed-in user passes the guard for its **own** record. The `patch`
   handler then copies `req.body.roles` straight into the account's custom
   claims. A plain user can therefore send its own ID and
   `roles: ['user','admin']` and become admin, after which admin screens expose
   every user's email and display name. The self-promotion demonstration and the
   admin screens are left for the headed session; the hole is inherent to the
   `allowSameUser` branch plus the unfiltered role copy.
2. **Unauthenticated account creation.** `POST /users` has no authentication
   (intentional, to allow sign-up) and no App Check gate on the function; it is
   throttled to 15/hour per IP. Anyone can create `role: ['user']` accounts.
3. **Stale sign-in authorized domains.** The Identity Toolkit config still
   trusts roughly eighteen expired PR preview-channel domains
   (`usersrole--prNNN-….web.app`) plus `jdwillmsen.github.io` as authorized
   sign-in domains. These should have been pruned as previews expired.
4. **App Check is enforced here** (Identity Toolkit + Firestore), which is the
   stronger posture — noted for contrast with `usersrole-nx`, where App Check is
   not enabled at all.

Exact values (enforcement modes, the full authorized-domain list, user counts,
billing linkage) are in [`cli-snapshot.md`](./cli-snapshot.md).

## Reproducing

```bash
export PATH=$HOME/.nvm/versions/node/v24.19.0/bin:$PATH
RETIREMENT_KEEP='<test-email>,<test-uid>' \
  scripts/retirement-capture/app/cli-snapshot.sh usersrole docs/retirement/cli-snapshot.md
NODE_PATH=<dir with playwright-core 1.63.x> TEST_EMAIL=<fresh> TEST_PASSWORD=<pw> \
  node scripts/retirement-capture/app/capture.cjs usersrole docs/retirement
```
