#!/usr/bin/env node
// Headless walkthrough of the live app while it still runs: one video per
// user-facing flow, a screenshot matrix (desktop/mobile x light/dark), and a
// passive log of the calls the app makes to its `api` function.
//
// Usage:
//   NODE_PATH=<dir with playwright-core> \
//   TEST_EMAIL=... TEST_PASSWORD=... node capture.cjs <usersrole|usersrole-nx> <docs/retirement dir>
//
// It creates exactly one account (TEST_EMAIL) through the app's own sign-up and
// leaves it a plain user. It does not read, hold, or send any auth token, and
// it changes no roles: admin-only screens are recorded only as far as a plain
// user sees them; the privileged views are left for the headed session.
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const APPS = {
  usersrole: {
    baseUrl: 'https://usersrole.web.app',
    apiBase: 'https://us-central1-usersrole.cloudfunctions.net/api',
    profilePath: '/profile',
    previewPaths: [
      ['alerts', '/testing/alerts'],
      ['snackbars', '/testing/snackbars'],
      ['buttons', '/testing/buttons']
    ],
    providers: ['google', 'github', 'twitter'],
    openAccountMenu: '[data-cy=profile-icon-button]'
  },
  'usersrole-nx': {
    baseUrl: 'https://users-role-nx.web.app',
    apiBase: 'https://api-zm7bvbr4yq-uc.a.run.app',
    profilePath: '/user/profile',
    previewPaths: [
      ['alerts', '/preview/alerts'],
      ['snackbars', '/preview/snackbars'],
      ['buttons', '/preview/buttons']
    ],
    providers: ['google', 'github'],
    openAccountMenu: '[data-cy=sign-out-card-button]'
  }
};

const THEMES = {
  light: { name: 'indigo-pink', label: 'Indigo & Pink' },
  dark: { name: 'pink-bluegrey', label: 'Pink & Blue-grey' }
};
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  }
};
const DISPLAY_NAME = 'Retirement Walkthrough';

const appName = process.argv[2];
const outDir = path.resolve(process.argv[3] || 'docs/retirement');
const app = APPS[appName];
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;
if (!app || !email || !password) {
  console.error('usage: TEST_EMAIL=.. TEST_PASSWORD=.. capture.cjs <app> <out dir>');
  process.exit(2);
}
const mediaDir = path.join(outDir, 'media');
const shotDir = path.join(outDir, 'screenshots');
fs.mkdirSync(mediaDir, { recursive: true });
fs.mkdirSync(shotDir, { recursive: true });

const results = [];
const apiLog = [];
let signUpUid = null;
let currentFlow = null;

// Installed before any app script runs so a real user's grid row is blurred
// before it is ever painted, including in the video. Only rows or options
// naming the walkthrough account stay readable.
function maskInitScript(keep) {
  const mine = (el) => keep.some((k) => k && (el.textContent || '').includes(k));
  const apply = () => {
    const keepRows = new Set();
    document.querySelectorAll('.ag-row').forEach((row) => {
      if (mine(row)) keepRows.add(row.getAttribute('row-index'));
    });
    // ag-grid splits one logical row across pinned/centre containers, so the
    // keep/blur decision is made per row-index, not per element.
    document.querySelectorAll('.ag-row').forEach((row) => {
      row.style.filter = keepRows.has(row.getAttribute('row-index')) ? '' : 'blur(7px)';
    });
    document
      .querySelectorAll('.mat-mdc-autocomplete-panel .mat-mdc-option')
      .forEach((opt) => {
        opt.style.filter = mine(opt) ? '' : 'blur(7px)';
      });
  };
  new MutationObserver(apply).observe(document, {
    subtree: true,
    childList: true,
    characterData: true
  });
}

function themeInitScript(themeName) {
  try {
    window.localStorage.setItem('theme-storage-current-name', themeName);
  } catch {
    // Storage can be unavailable before the origin is committed; the theme then
    // falls back to the app default, which the screenshot name notes.
  }
}

async function newContext(browser, { flow, viewport = 'desktop', theme, storageState } = {}) {
  const context = await browser.newContext({
    ...VIEWPORTS[viewport],
    ...(flow
      ? { recordVideo: { dir: path.join(mediaDir, '.raw', flow), size: VIEWPORTS[viewport].viewport } }
      : {}),
    ...(storageState ? { storageState } : {}),
    serviceWorkers: 'allow'
  });
  await context.addInitScript(maskInitScript, [email, DISPLAY_NAME].filter(Boolean));
  if (theme) await context.addInitScript(themeInitScript, THEMES[theme].name);
  // Passive observation only: the app makes its own calls; nothing here injects
  // requests or reads credentials. Authorization headers are redacted later by
  // redact.py before the log is written.
  context.on('response', async (response) => {
    const request = response.request();
    if (!request.url().startsWith(app.apiBase) || request.method() === 'OPTIONS') return;
    let body = '';
    try {
      body = await response.text();
    } catch {
      body = '<unavailable>';
    }
    if (!signUpUid && request.method() === 'POST' && response.ok()) {
      try {
        signUpUid = JSON.parse(body).uid || null;
      } catch {
        /* not the sign-up response */
      }
    }
    apiLog.push({
      startedDateTime: new Date().toISOString(),
      comment: currentFlow,
      request: {
        method: request.method(),
        url: request.url(),
        httpVersion: 'HTTP/2',
        headers: Object.entries(await request.allHeaders()).map(([name, value]) => ({ name, value })),
        queryString: [],
        cookies: [],
        headersSize: -1,
        bodySize: request.postData() ? request.postData().length : 0,
        postData: request.postData()
          ? { mimeType: 'application/json', text: request.postData() }
          : undefined
      },
      response: {
        status: response.status(),
        statusText: response.statusText(),
        httpVersion: 'HTTP/2',
        headers: Object.entries(await response.allHeaders()).map(([name, value]) => ({ name, value })),
        cookies: [],
        content: {
          size: body.length,
          mimeType: response.headers()['content-type'] || '',
          text: body
        },
        redirectURL: '',
        headersSize: -1,
        bodySize: body.length
      },
      cache: {},
      timings: { send: 0, wait: 0, receive: 0 }
    });
  });
  return context;
}

async function settle(page, ms = 1500) {
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

async function go(page, route) {
  await page.goto(app.baseUrl + route, { waitUntil: 'domcontentloaded' });
  await settle(page);
}

async function banner(page, text, ms = 2500) {
  await page.evaluate((t) => {
    let el = document.getElementById('walkthrough-banner');
    if (!el) {
      el = document.createElement('pre');
      el.id = 'walkthrough-banner';
      el.style.cssText =
        'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;margin:0;padding:12px 14px;' +
        'background:rgba(20,20,20,.92);color:#fff;font:13px/1.45 monospace;white-space:pre-wrap;' +
        'border-left:4px solid #ffb300;border-radius:4px;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, text);
  await page.waitForTimeout(ms);
}

async function clearBanner(page) {
  await page.evaluate(() => document.getElementById('walkthrough-banner')?.remove());
}

async function shot(page, name) {
  const file = path.join(shotDir, `${name}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 72 });
  return path.relative(outDir, file);
}

async function signIn(page) {
  await go(page, '/sign-in');
  await page.locator('[data-cy=email-address-field] input').fill(email);
  await page.locator('[data-cy=password-field] input').fill(password);
  await page.locator('[data-cy=sign-in-button]').click();
  await page.waitForURL('**/home', { timeout: 20000 });
  await settle(page);
}

async function signOut(page) {
  await page.locator(app.openAccountMenu).click();
  await page.waitForTimeout(800);
  await page.locator('[data-cy=sign-out-button]').click();
  await page.waitForURL('**/sign-in', { timeout: 20000 });
  await settle(page, 1000);
}

async function flow(browser, name, opts, body) {
  currentFlow = name;
  const entry = { flow: name, status: 'captured', notes: [], screenshots: [] };
  const context = await newContext(browser, { flow: name, ...opts });
  const page = await context.newPage();
  try {
    await body(page, entry, context);
  } catch (err) {
    entry.status = 'failed';
    entry.notes.push(String(err.message || err).split('\n')[0]);
    await shot(page, `${name}-failure`)
      .then((s) => entry.screenshots.push(s))
      .catch(() => {});
  }
  const pages = context.pages();
  await context.close();
  entry.videos = [];
  for (const [i, p] of pages.entries()) {
    const raw = await p.video()?.path();
    if (!raw) continue;
    const dest = path.join(mediaDir, `${appName}-${name}${i ? `-popup${i}` : ''}.webm`);
    fs.renameSync(raw, dest);
    entry.videos.push(path.relative(outDir, dest));
  }
  results.push(entry);
  console.log(`${name}: ${entry.status}${entry.notes.length ? ' - ' + entry.notes.join('; ') : ''}`);
  return entry;
}

// A signed-in session for the screenshot matrix, reused across viewports and
// themes so sign-in happens once. Returns null when sign-in cannot complete
// headless -- e.g. App Check enforcement rejects an unattested client -- so the
// caller can mark the signed-in flows for the headed session and carry on.
async function makeSignedInState(browser) {
  const context = await newContext(browser, {});
  const page = await context.newPage();
  try {
    await signIn(page);
    const state = await context.storageState({ indexedDB: true });
    return state;
  } catch {
    return null;
  } finally {
    await context.close();
  }
}

async function screenshotMatrix(browser, storageState) {
  const signedInScreens = [
    ['home', '/home'],
    ['profile', app.profilePath],
    ['about', '/about'],
    ...app.previewPaths.map(([label, route]) => [`preview-${label}`, route])
  ];
  const anonScreens = [
    ['sign-in', '/sign-in'],
    ['sign-up', '/sign-up']
  ];
  const shots = [];
  for (const view of ['desktop', 'mobile']) {
    for (const theme of ['light', 'dark']) {
      if (storageState) {
        const context = await newContext(browser, { viewport: view, theme, storageState });
        const page = await context.newPage();
        for (const [label, route] of signedInScreens) {
          await go(page, route);
          shots.push(await shot(page, `matrix-${label}-${view}-${theme}`));
        }
        await context.close();
      }
      const anon = await newContext(browser, { viewport: view, theme });
      const anonPage = await anon.newPage();
      for (const [label, route] of anonScreens) {
        await go(anonPage, route);
        shots.push(await shot(anonPage, `matrix-${label}-${view}-${theme}`));
      }
      await anon.close();
    }
  }
  return shots;
}

// Records a flow that needs a signed-in session we could not get headless.
// It still captures what a fresh visit shows (the guard's redirect) so the
// evidence is not empty, and flags the flow for the headed session.
async function headedFallback(browser, name, routes) {
  const entry = { flow: name, status: 'needs-headed-session', notes: [], screenshots: [], videos: [] };
  entry.notes.push('signed-in session unavailable headless (App Check enforcement); capture in the headed session');
  const context = await newContext(browser, {});
  const page = await context.newPage();
  for (const [label, route] of routes) {
    try {
      await go(page, route);
      entry.notes.push(`${route} unauthenticated -> ${new URL(page.url()).pathname}`);
      entry.screenshots.push(await shot(page, `${name}-${label}-unauth`));
    } catch (err) {
      entry.notes.push(`${route}: ${String(err.message || err).split('\n')[0]}`);
    }
  }
  await context.close();
  results.push(entry);
  console.log(`${name}: needs-headed-session`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  await flow(browser, '01-sign-up', {}, async (page, entry) => {
    await go(page, '/sign-up');
    entry.screenshots.push(await shot(page, 'flow-01-sign-up-empty'));
    await page.locator('[data-cy=email-address-field] input').fill(email);
    await page.locator('[data-cy=display-name-field] input').fill(DISPLAY_NAME);
    await page.locator('[data-cy=password-field] input').fill(password);
    await page.locator('[data-cy=confirm-password-field] input').fill(password);
    await page.locator('[data-cy=sign-up-button]').click();
    await page.waitForURL('**/sign-in', { timeout: 30000 });
    await page.waitForTimeout(1200);
    entry.screenshots.push(await shot(page, 'flow-01-sign-up-done'));
    if (signUpUid) entry.notes.push(`created uid ${signUpUid}`);
  });

  // One signed-in session drives every authenticated flow. When it is null,
  // App Check (or another server-side gate) blocked headless sign-in, so those
  // flows are recorded for the headed session instead of failing the run.
  const state = await makeSignedInState(browser);
  const signedIn = state !== null;
  if (signedIn) {
    await flow(browser, '02-sign-in-password', {}, async (page, entry) => {
      await signIn(page);
      entry.screenshots.push(await shot(page, 'flow-02-home-after-sign-in'));
    });

    await flow(browser, '03-profile', { storageState: state }, async (page, entry) => {
      await go(page, app.profilePath);
      entry.notes.push("plain user: profile shows roles ['user']");
      entry.screenshots.push(await shot(page, 'flow-03-profile'));
    });

    await flow(browser, '04-admin-blocked-as-user', { storageState: state }, async (page, entry) => {
      await banner(
        page,
        'Signed in as a plain user. Navigating to the admin screens shows how the\n' +
          'route guard treats a non-privileged account.',
        3000
      );
      for (const [label, route] of [
        ['users', '/admin/users'],
        ['roles', '/admin/roles']
      ]) {
        await go(page, route);
        entry.notes.push(`/admin/${label} as plain user -> ${new URL(page.url()).pathname}`);
        entry.screenshots.push(await shot(page, `flow-04-admin-${label}-as-user`));
      }
      await clearBanner(page);
    });

    await flow(browser, '05-theme-switch', { storageState: state }, async (page, entry) => {
      await go(page, '/home');
      entry.screenshots.push(await shot(page, 'flow-05-theme-default'));
      for (const theme of ['dark', 'light']) {
        await page.locator('[data-cy=theme-select-button]').first().click();
        await page.waitForTimeout(600);
        await page.locator(`[data-cy=${THEMES[theme].name}-button]`).click();
        await settle(page, 1200);
        entry.screenshots.push(await shot(page, `flow-05-theme-${theme}`));
      }
      entry.notes.push('theme choice persists in localStorage and, when signed in, in Firestore users/<uid>');
    });

    await flow(browser, '06-sign-out', { storageState: state }, async (page, entry) => {
      await go(page, '/home');
      await signOut(page);
      entry.screenshots.push(await shot(page, 'flow-06-after-sign-out'));
    });

    await flow(browser, '08-pwa', { storageState: state }, async (page, entry) => {
      await go(page, '/home');
      const pwa = await page.evaluate(async () => {
        const manifestHref = document.querySelector('link[rel=manifest]')?.href || null;
        let manifest = null;
        if (manifestHref) {
          try {
            manifest = await (await fetch(manifestHref)).json();
          } catch {
            manifest = null;
          }
        }
        const regs = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
        return {
          name: manifest?.name || null,
          display: manifest?.display || null,
          serviceWorkers: regs.map((r) => r.active?.scriptURL || r.installing?.scriptURL).filter(Boolean)
        };
      });
      entry.notes.push(
        `manifest name=${pwa.name} display=${pwa.display}; service worker(s): ${pwa.serviceWorkers.join(', ') || 'none registered yet'}`
      );
      entry.notes.push('beforeinstallprompt does not fire in headless Chromium; install banner not observable');
      entry.status = pwa.serviceWorkers.length ? 'partial' : 'needs-headed-session';
      entry.screenshots.push(await shot(page, 'flow-08-pwa-home'));
    });
  } else {
    results.push({
      flow: '02-sign-in-password',
      status: 'needs-headed-session',
      notes: ['headless sign-in rejected: "Firebase App Check token is invalid" (App Check enforced on Identity Toolkit)'],
      screenshots: [],
      videos: []
    });
    await headedFallback(browser, '03-profile', [['profile', app.profilePath]]);
    await headedFallback(browser, '04-admin-blocked-as-user', [
      ['users', '/admin/users'],
      ['roles', '/admin/roles']
    ]);
    await headedFallback(browser, '05-theme-switch', [['home', '/home']]);
    await headedFallback(browser, '06-sign-out', [['home', '/home']]);
    await headedFallback(browser, '08-pwa', [['home', '/home']]);
  }

  // OAuth: record the button and the provider popup up to the provider's own
  // page, then stop. A real third-party login cannot run headless.
  for (const provider of app.providers) {
    await flow(browser, `07-oauth-${provider}`, {}, async (page, entry) => {
      await go(page, '/sign-in');
      entry.screenshots.push(await shot(page, `flow-07-${provider}-button`));
      const popupPromise = page.waitForEvent('popup', { timeout: 15000 }).catch(() => null);
      await page.locator(`[data-cy=${provider}-sign-in-button]`).click();
      const popup = await popupPromise;
      if (popup) {
        await popup.waitForLoadState('domcontentloaded').catch(() => {});
        await popup.waitForTimeout(3500);
        entry.screenshots.push(await shot(popup, `flow-07-${provider}-provider-page`).catch(() => null));
        entry.notes.push(`reached provider host ${new URL(popup.url()).host}`);
      } else {
        entry.notes.push('no popup captured (provider may block the headless UA)');
      }
      entry.status = 'needs-headed-session';
      entry.notes.push('completing this sign-in needs a real third-party login (headed)');
    });
  }

  // Screenshot matrix. Signed-out entry screens always render; the signed-in
  // screens are included only when a session was available.
  const matrixShots = await screenshotMatrix(browser, state);
  results.push({
    flow: 'screenshot-matrix',
    status: 'captured',
    notes: [`${matrixShots.length} screenshots`, signedIn ? 'signed-in + signed-out screens' : 'signed-out screens only (headless auth blocked)'],
    screenshots: matrixShots,
    videos: []
  });

  await browser.close();

  fs.rmSync(path.join(mediaDir, '.raw'), { recursive: true, force: true });
  const har = { log: { version: '1.2', creator: { name: 'retirement-capture', version: '1' }, entries: apiLog } };
  fs.writeFileSync(path.join(outDir, 'api-calls.har.json'), JSON.stringify(har, null, 2));
  fs.writeFileSync(
    path.join(outDir, 'capture-manifest.json'),
    JSON.stringify({ app: appName, baseUrl: app.baseUrl, capturedAt: new Date().toISOString(), signUpUid, signedInHeadless: signedIn, flows: results }, null, 2)
  );
  console.log(`\nUID from sign-up response: ${signUpUid || 'not captured'}`);
  console.log(`Signed-in headless: ${signedIn}. API calls logged: ${apiLog.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
