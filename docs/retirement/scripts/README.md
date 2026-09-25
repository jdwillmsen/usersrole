# Capture harness

These are the read-only capture scripts used for the retirement tour. They import
the shared helpers (`browser.ts`, `config.ts`, `redact.ts`, `stack.ts`) from the
capture worktree's `scripts/retirement-capture/` directory and attach to the
already-running, human-signed-in headed Chrome over CDP — they never launch or
close that browser. Run them from the capture worktree (which has `node_modules`
and the live stack), with Node 24 on `PATH`.

- `tour.ts <targets.json> <outDir>` — navigate a list of URLs, one recorded page
  each, masked screenshot + caption per target.
- `clicktour.ts <steps.json> <outDir>` — like `tour.ts` but clicks a control
  (by visible text) to reach panes without a direct URL (Auth settings sub-panes).
- `appflow.ts` (env-driven) — drives a live app end to end: password sign-up,
  sign-in, profile, theme, the `/admin` route guard, sign-out; one video.
- `getuid.ts <project> <email>` — looks up one throwaway account's UID in the
  Auth console (for the deletion list); reads only the row matching that email.

All screenshots go through `maskedScreenshot` (blur + mask); `appflow.ts` adds
CSS to blur the admin grid's displayName column as a backstop.
