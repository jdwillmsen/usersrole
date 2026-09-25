# Retirement capture browser — runbook

A headed Chrome on a virtual display, signed in once by a human over VNC, that
agents then drive to record the Firebase and GCP consoles before the project is
retired. Everything here holds a live, owner-level Google session, so the
teardown section is not optional.

## What runs where

| Piece | Listens on | Notes |
| --- | --- | --- |
| Xvfb | display `:99` (unix socket only, `-nolisten tcp`) | Guarded by an X auth key in the state dir |
| x11vnc | `<tailnet IP>:5900` only, no IPv6 | Password file `~/.vnc/usersrole-capture.pass`, set by the human |
| websockify + noVNC | `<tailnet IP>:6080` only | Serves `/usr/share/novnc` |
| Chrome (Playwright persistent context) | CDP on `127.0.0.1:9222` only | Profile `~/.cache/usersrole-capture-profile`, headed, `recordVideo` at 1920x1080 |

The bind address comes from `tailscale ip -4` and the scripts refuse anything
outside `100.64.0.0/10`, so a failed lookup can never fall back to `0.0.0.0`.
Runtime state (pid files, logs, X auth key) lives in
`$XDG_RUNTIME_DIR/usersrole-capture`, falling back to
`~/.cache/usersrole-capture`. Videos go to `videos/` next to this file, with
`videos/manifest.jsonl` recording which page each `.webm` belongs to.
`videos/`, `screenshots/` and `node_modules/` are gitignored.

## Setup

Needs `xvfb`, `x11vnc`, `novnc`, `websockify`, Google Chrome and Node 22.18 or
newer (the scripts are TypeScript run directly by Node).

```sh
sudo apt-get install -y xvfb x11vnc novnc websockify
cd scripts/retirement-capture
npm ci
```

`playwright` is pinned to the release whose Chromium build is cached on the
devbox. The default channel is the installed Google Chrome, because Google
sign-in is more willing to accept it than a bundled Chromium;
`CAPTURE_CHANNEL=chromium` switches back (run `npx playwright install chromium`
first if the pin has moved).

## Launch and hand over

```sh
node scripts/retirement-capture/capture.ts launch --detach
node scripts/retirement-capture/capture.ts            # status
```

Launch is idempotent. It starts Xvfb, noVNC and the browser at the Firebase
console, and starts x11vnc as soon as the password file exists. The browser
process and the default `videos/` belong to the checkout it was launched
from, so keep that checkout (and its `node_modules`) until teardown.

**Human, once, in a terminal outside any agent session** (a password typed
into an agent session ends up in its transcript):

```sh
mkdir -p ~/.vnc && x11vnc -storepasswd ~/.vnc/usersrole-capture.pass
```

Within a couple of seconds x11vnc comes up. Connect with either:

- a VNC client to `100.100.238.72:5900`, or
- a browser to `http://100.100.238.72:6080/vnc.html`

from a device on the tailnet, and sign in to Google in the Chrome window. The
sign-in page is recorded like every other page: once signed in, find its
`.webm` through `videos/manifest.jsonl` and delete it.

## Driving it from an agent

Attach to the running browser over CDP rather than relaunching it:

```ts
import { attachCaptureContext } from './browser.ts';
import { loadConfig } from './config.ts';
import { maskedScreenshot } from './redact.ts';

const cfg = loadConfig();
const { browser, context } = await attachCaptureContext(cfg);
const page = await context.newPage();
await page.goto('https://console.firebase.google.com/project/<project>/authentication/users');
await maskedScreenshot(page, { path: `${cfg.screenshotDir}/auth-users.png` });
await page.close(); // finalises this page's video
await browser.close(); // disconnects only; the launcher keeps the browser
```

Every context carries an init script that blurs Auth user-list email and UID
cells, and any text node that is an email or a 28-character UID, before the
first paint. `maskedScreenshot` adds `screenshot({ mask })` over the same
cells on top of the blur. The launcher records every page; a page opened by an
attached agent is recorded too, and `manifest.jsonl` maps it to its file by
time and URL.

> **Verify the blur on the real console before keeping any recording.** The
> column selectors are guesses at the console's markup and are unverified
> against the live signed-in Users page, and the text scan matches one node at
> a time, so an email split across sibling elements can slip through. On the
> real Authentication → Users page, open a page, take a `maskedScreenshot` and
> eyeball it: confirm every email and UID is covered, and widen
> `PII_SELECTORS` in `redact.ts` if anything shows through. Only then start
> capturing anything that will be kept.

If the browser has to restart (a crash, or a change to launch options), the
signed-in state is in the profile directory:

```sh
node scripts/retirement-capture/capture.ts stop-browser   # flushes videos, keeps display and VNC
node scripts/retirement-capture/capture.ts launch --detach
```

## Teardown

Do this as soon as capture is finished. The profile is a signed-in owner
session for as long as it exists.

1. Preview, then run the teardown:

   ```sh
   node scripts/retirement-capture/capture.ts teardown --dry-run
   node scripts/retirement-capture/capture.ts teardown
   ```

   It closes the browser (finalising videos), stops x11vnc, websockify and
   Xvfb, deletes `~/.cache/usersrole-capture-profile` and the runtime state
   dir. Videos and screenshots are kept.

2. Check nothing is left listening or on disk:

   ```sh
   ss -ltnp | grep -E ':(5900|6080|9222)\b'    # expect no output
   ls ~/.cache/usersrole-capture-profile        # expect "No such file or directory"
   ```

3. **Human only:** revoke the session server-side. Deleting the profile
   removes the local sign-in, but the session stays valid at Google until it
   is signed out. Go to Google Account → Security → Your devices, find the
   Linux / Chrome session from the devbox, and choose **Sign out**.

4. **Human only:** delete the VNC password file, which is not needed again:

   ```sh
   rm ~/.vnc/usersrole-capture.pass
   ```

5. Once the recordings have been reviewed and moved to wherever the
   retirement evidence is kept, delete `videos/` and `screenshots/`: the blur
   covers user emails and UIDs, but the recordings still show project
   configuration.
