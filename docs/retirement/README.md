# usersrole — retirement capture

"How it was set up and how it behaved" evidence for the Firebase app
**jdwillmsen/usersrole** (GCP project `usersrole`), captured read-only from the
live app and consoles before the project is retired and billing is unlinked. It
exists so the app's user-facing behaviour and its live cloud configuration
survive the shutdown.

- **Hosted app:** https://usersrole.web.app (also usersrole.firebaseapp.com)
- **API function:** https://us-central1-usersrole.cloudfunctions.net/api
- **Captured:** 2026-09-25 — app flows headless via
  `scripts/retirement-capture/app/capture.cjs`; console tour + signed-in app
  walkthrough via the headed capture browser.
- **Live config snapshot:** [`cli-snapshot.md`](./cli-snapshot.md)
- **Redacted request log:** [`api-calls.har.json`](./api-calls.har.json)
  (Authorization / App-Check headers and user records redacted)
- **Videos:** attached to the [`retired` release](https://github.com/jdwillmsen/usersrole/releases/tag/retired)
  as mp4 assets, with a `SHA256SUMS` manifest (kept out of git to keep clones small).
- **Run your own copy:** [`REPLICATE.md`](../../REPLICATE.md) — Firebase Emulator
  Suite quick start, plus a hardened own-project deploy.

## Why this was retired

Decided 2026-09-23. The app has **no active user base to serve** but carried
standing risk and cost on a pay-as-you-go (Blaze) plan:

- Uncapped Blaze billing with no budget kill switch.
- Publicly reachable functions, and an unauthenticated `POST /users` sign-up.
- Open storage rules (`allow read, write: if request.auth != null`).
- An API-layer privilege-escalation path (any signed-in user could self-grant
  admin — see Security findings).
- 117 third-party accounts across the two apps (89 here, 28 in usersrole-nx)
  with no ongoing purpose.

Options weighed:

| Option | Outcome | Verdict |
| --- | --- | --- |
| **A. Full retirement** | Capture everything, publish the record, delete the projects. | **Chosen** — removes the cost and risk while preserving the learning record. |
| B. Free-plan freeze | Downgrade to Spark. | Rejected — functions stop (broken demo) and the user PII stays live. |
| C. Keep and harden | Fix billing/rules/auth and maintain it. | Rejected — permanent maintenance for an app with no users. |
| D. Keep only usersrole-nx | Retire one, keep the other. | Rejected — both carry the same risks and neither is in use. |

## Timeline

- **2026-09-23** — decision to retire; risk findings recorded; epic filed.
- **2026-09-24/25** — headed capture browser stood up; app walkthroughs, CLI
  snapshot, and the Firebase/GCP console tour recorded read-only.
- **2026-09-26** — emulator + REPLICATE work, the escalation fix, and the
  retirement banner deployed to the live project (new sign-up now closed);
  this record and the `retired` release published.
- **Next** — unlink billing, stop CI/Renovate, archive the repo; delete the GCP
  project (by 2026-10-09).

## Contents

- `screenshots/` — masked PNG/JPEG stills, one per surface / app step.
- `captions/` — one short `.md` per console surface (and `ur-app.md` for the
  app run), each naming the video it maps to.
- `media/` — the `.webm` recordings (**gitignored**; uploaded as GitHub Release
  assets in a later step).
- `index.json` / `index.jsonl` — machine-readable capture log.
- `scripts/` — the console-tour capture harness (see `scripts/README.md`).

## Test accounts

Throwaway accounts created through the app's own password sign-up. All are plain
users (`roles: ['user']`); no roles were changed through normal sign-up. They are
deleted in a later retirement step.

| Email | UID | Notes |
| --- | --- | --- |
| ur-retire-2ec87571@example.com | cFFUpxjp6KP41Z9prhrd5dR0tpg2 | headless sign-up flow |
| ur-retire-4b6fd5fa@example.com | hrIYXqlTPcZulFB1sPO6JLKiXyO2 | earlier capture pass |
| ur-629-3f4b103b@example.com | EhGbIrHbyTMvfG6qovxdVb0Rlmg1 | headed app walkthrough |

## PII handling

Every Authentication/Users surface and Firestore user document was blurred
before navigation (init script) and again at screenshot time (blur + mask). On
the live **Authentication → Users** tab the column selectors covered the
Identifier (email) and User UID columns in both the masked stills and the
blur-only render the video carries — verified by eye. The text-scan additionally
blurs 28-char UIDs rendered in Firestore.

Blur/mask does **not** catch: (a) values inside `<input>` fields (only the
throwaway test account ever appears there), (b) OAuth client secrets, or (c)
human display names in GCP IAM. The secret-bearing surfaces (per-provider OAuth
config panes, function env/logs) were **deliberately not captured**. See the
human-review list below.

## Capture limitation — App Check

App Check is **ENFORCED** on this project (Identity Toolkit + Firestore). A
headless browser cannot produce a valid App Check attestation, so
`signInWithEmailAndPassword` is rejected headless. Sign-up still works headless
because it goes through the `api` function (server-side Admin SDK), which App
Check does not gate. Every signed-in flow was therefore captured in the **headed**
browser instead, where a real Chrome passes App Check.

## Flow checklist

| Flow | Status | Evidence |
| --- | --- | --- |
| Sign-up (password) | captured (headless) | `screenshots/flow-01-sign-up-*.jpg`, `ur-app-01..03` |
| Sign-in (password) | captured (headed) | `ur-app-04..05` |
| Home | captured (headed) | `ur-app-06` |
| Profile (Roles: User) | captured (headed) | `ur-app-07` |
| Theme switch (light/dark) | captured (headed) | `ur-app-08..09`, `screenshots/matrix-*.jpg` |
| Admin guard (`/admin` as plain user → 403) | captured (headed) | `ur-app-10-admin-guard` |
| Sign-out | captured (headed) | `ur-app-12` |
| Admin: list users / change roles | not captured | privileged screen; plain user is blocked at the client guard (403), and no real admin login was performed |
| Self-promote to admin (privilege-escalation demo) | not reproducible UI-only | see security finding 1 — the hole is at the API layer, not the UI |
| OAuth: Google / GitHub / Twitter | buttons + provider page only | completions not recorded (would require the owner's real IdP login) |
| PWA install prompt | not captured | needs a headed IdP session; skipped by decision |

OAuth popups from the headless run reached only the blank
`usersrole.firebaseapp.com/__/auth/handler` intermediary; the buttons and popup
launch are recorded. The real third-party login was intentionally not recorded,
to keep credential pages off video.

## Console tour — Firebase

| Surface | Screenshot | Notes |
| --- | --- | --- |
| Auth sign-in providers | `ur-fb-auth-providers` | Email/Password, Google, Twitter, GitHub **Enabled**; Anonymous disabled; SMS MFA disabled. |
| Auth settings (account linking) | `ur-fb-auth-settings` | Settings pane + menu. |
| Auth → Authorized domains | `ur-fb-auth-authorized-domains` | Defaults + `jdwillmsen.github.io` + a long list of stale `usersrole--pr###-…web.app` preview domains. |
| Auth → Blocking functions | `ur-fb-auth-blocking-functions` | beforeCreate → **beforecreated(us-central1)**; beforeSignin → None. |
| Auth → User actions | `ur-fb-auth-user-actions` | Create/delete enablement pane. |
| Auth email templates | `ur-fb-auth-templates` | Template settings. |
| Auth → Users (BLURRED) | `ur-fb-auth-users` | 89 real users; email + UID columns masked. |
| App Check | `ur-fb-appcheck` | **ENFORCED** — Firestore + Authentication verified; Storage/RTDB not enrolled. |
| Functions | `ur-fb-functions` | `api` + `beforecreated`. |
| Hosting | `ur-fb-hosting` | Site `usersrole`. |
| Storage | `ur-fb-storage` | "Get started" splash — never initialized in-console; see Storage note. |
| Firestore | `ur-fb-firestore` | `users` collection, doc id = Auth UID, stores `theme`; location `nam5`. UID doc-ids masked. |
| Realtime Database | `ur-fb-rtdb` | Presence check. |
| Project settings — general | `ur-fb-settings-general` | Web app config (Firebase web API key is public, not a secret). |
| Project settings — service accounts | `ur-fb-settings-serviceaccounts` | Admin SDK service account. |
| Project settings — integrations | `ur-fb-settings-integrations` | Integrations pane. |

### Storage note

The Firebase Storage product shows the onboarding splash, and GCS lists only
Cloud Functions artifact buckets (`gcf-*`) — there is **no `usersrole.appspot.com`
app bucket**. The repo's `storage.rules`
(`allow read, write: if request.auth != null`) is therefore declared but
effectively unused. This contrasts with usersrole-nx, which has a real bucket.

## Console tour — Google Cloud

| Surface | Screenshot | Notes |
| --- | --- | --- |
| APIs & Services | `ur-gcp-apis` | Enabled APIs dashboard. |
| Billing — linked account | `ur-gcp-billing-linked` | Billing account **"Firebase Payment"** (`01DF84-B8C2B6-98291D`). |
| Billing — reports | `ur-gcp-billing-reports` | Current-month spend **$0.00** (Blaze, within free tier). |
| Billing — budgets | `ur-gcp-billing-budgets` | Budgets/alerts pane. |
| IAM | `ur-gcp-iam` | Principals masked. Owner "Jacob Willmsen"; `firebase-adminsdk`; GitHub Actions `jdwillmsen/frontend`; compute + App Engine default SAs (Editor). Insight: 2 SAs with excess Owner/Editor. |
| Artifact Registry | `ur-gcp-artifacts` / `ur-gcp-artifacts-detail` | One repo `gcf-artifacts` (Docker/Standard, us-central1). |
| Cloud Run (functions) | `ur-gcp-run` / `ur-gcp-functions` | `api` + `beforecreated`, gen2, us-central1, Ingress All. |
| Cloud Storage buckets | `ur-gcp-storage-bucket` | Only `gcf-*` function buckets (see Storage note). |
| reCAPTCHA project — dashboard | `recaptcha-project-dashboard` | Linked project `recaptcha-enterprise-397606`, 0 assessments in 30 days. |
| reCAPTCHA project — keys | `recaptcha-keys` | Fraud Defense dashboard (no key values shown). |

## Security findings at retirement

Read-only observations of the live app and its code. Recorded because they are
worth carrying forward; none were exploited.

1. **Privilege escalation: any user can make itself admin (API layer).**
   `PATCH /users/:id` is guarded by
   `isAuthorized({ hasRole: ['admin','manager'], allowSameUser: true })`, so a
   signed-in user passes the guard for its **own** record regardless of role. The
   `patch` handler then copies `req.body.roles` straight into the account's
   custom claims — so a plain user can `PATCH /users/{ownUid}` with
   `roles:['admin']` and self-promote. The only app UI that calls this sits
   behind the client `RoleGuard`, which redirects a plain user to `/forbidden`
   (evidence: `ur-app-10-admin-guard`) — so it is **not reproducible through the
   UI** as a plain user, and demonstrating it would require a direct
   authenticated API call (out of scope for UI-only capture; no token
   scraping/replay was done). The client guard is a mitigation only; the
   server-side authorization gap is real. Fixed for anyone replicating the app in
   the deploy hardening (see `REPLICATE.md`).
2. **Unauthenticated account creation.** `POST /users` has no authentication
   (intentional, for sign-up) and no App Check gate; throttled to 15/hour per IP.
3. **Stale sign-in authorized domains.** The Identity Toolkit config still trusts
   ~18 expired PR preview-channel domains (`usersrole--prNNN-….web.app`) plus
   `jdwillmsen.github.io` as authorized sign-in domains.
4. **App Check is enforced here** (Identity Toolkit + Firestore) — the stronger
   posture, noted for contrast with `usersrole-nx`, where App Check is not
   enabled at all.

Exact values (enforcement modes, the full authorized-domain list, user counts,
billing linkage) are in [`cli-snapshot.md`](./cli-snapshot.md).

## Media (not committed)

Videos live under `media/` and are **gitignored** — a later step uploads them as
GitHub Release assets. Screenshots are committed (all well under 5 MB).

## Human PII/secret review required before publishing the videos

These recordings should be eyeballed before any public release:

- `ur-fb-auth-users` (+ its video) — confirm no unblurred email/UID across scroll.
- `ur-fb-firestore` (+ video) — confirm no user field exposed.
- `ur-gcp-iam`, `recaptcha-project-dashboard` — show the owner's own display /
  first name (no end-user PII).
- `ur-gcp-billing-*` — financial figures (owner's own project).
- App-flow stills — show only the throwaway accounts.

## Reproducing

```bash
export PATH=$HOME/.nvm/versions/node/v24.19.0/bin:$PATH
RETIREMENT_KEEP='<test-email>,<test-uid>' \
  scripts/retirement-capture/app/cli-snapshot.sh usersrole docs/retirement/cli-snapshot.md
NODE_PATH=<dir with playwright-core 1.63.x> TEST_EMAIL=<fresh> TEST_PASSWORD=<pw> \
  node scripts/retirement-capture/app/capture.cjs usersrole docs/retirement
```
