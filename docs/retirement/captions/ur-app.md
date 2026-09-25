# ur-app — usersrole live app walkthrough (headed, App Check enforced)

Single recorded session driving https://usersrole.web.app as a freshly minted
throwaway password account. App Check is enforced on this project, so these
authed flows only work from a real headed browser (this is why they were
deferred from the headless run).

Throwaway account used (add to the deletion list): `ur-629-3f4b103b@example.com`,
role `user`.

Steps (screenshots `ur-app-01` … `ur-app-12`, one video):

- `01-signup-empty` / `02-signup-filled` / `03-signup-result` — password sign-up
  via the app's own form; create succeeds and redirects to sign-in.
- `04-signin-filled` / `05-after-signin` — password sign-in; lands on `/home`.
- `06-home` — home, signed in.
- `07-profile-before` — profile shows Roles: **User** (the before state).
- `08-theme-menu` / `09-theme-changed` — theme switch (toolbar palette changes).
- `10-admin-guard` — navigating to `/admin/users` as a plain user is **blocked
  by the client `RoleGuard` and redirects to `/forbidden` (403)**.
- `11-profile-menu` / `12-signed-out` — sign-out via the profile menu.

Not captured here (require the owner's real IdP login — hand to the human in
VNC; do not record accounts.google.com/github.com credential pages):

- Google / GitHub / Twitter OAuth sign-in completion (buttons visible on the
  sign-in screenshots).
- PWA install prompt.

Admin self-promotion demo: NOT reproducible through the app UI as a plain user —
the client `RoleGuard(['read','manager','admin'])` hides the admin/role-edit
control from a `user`, redirecting to `/forbidden` (evidence: `10-admin-guard`).
The privilege-escalation finding is real but lives at the API layer; see the
README "Privilege-escalation finding" section.
