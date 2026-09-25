import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  appendFileSync
} from 'node:fs';
import { join } from 'node:path';
import type { Page } from 'playwright';
import { attachCaptureContext } from './browser.ts';
import { loadConfig } from './config.ts';
import { applyPiiBlurNow, maskedScreenshot } from './redact.ts';

// Drives a live usersrole/-nx app end to end in one recorded page (one webm per
// app), capturing password sign-up, sign-in, profile, theme, the /admin route
// guard as a plain user, and sign-out. All screenshots are masked; extra CSS
// blurs the admin grid's displayName column, which the email/UID text scan does
// not cover, in case the guard ever fails to redirect.
const cfg = loadConfig();
const base = process.env['APP_BASE']!;
const email = process.env['APP_EMAIL']!;
const authArg = process.env['APP_CRED']!;
const displayName = process.env['APP_DISPLAYNAME'] ?? 'Retirement Capture 629';
const outBase = process.env['APP_OUT']!;
const prefix = process.env['APP_PREFIX']!;
if (!base || !email || !authArg || !outBase || !prefix) {
  console.error('missing env: APP_BASE APP_EMAIL APP_CRED APP_OUT APP_PREFIX');
  process.exit(1);
}
const shotDir = join(outBase, 'screenshots');
const capDir = join(outBase, 'captions');
mkdirSync(shotDir, { recursive: true });
mkdirSync(capDir, { recursive: true });

const extraBlurCss = `
.ag-cell[col-id="displayName"], .ag-cell[col-id="email"], .ag-cell[col-id="uid"],
[data-cy="role-chip"] { filter: blur(6px) !important; }`;

const webms = (): string[] =>
  existsSync(cfg.videoDir)
    ? readdirSync(cfg.videoDir).filter((f) => f.endsWith('.webm'))
    : [];
const before = new Set(webms());

const { browser, context } = await attachCaptureContext(cfg);
const page: Page = await context.newPage();
const steps: Array<Record<string, unknown>> = [];

async function shot(name: string, note: string): Promise<void> {
  await applyPiiBlurNow(page).catch(() => undefined);
  await page.addStyleTag({ content: extraBlurCss }).catch(() => undefined);
  await page.waitForTimeout(500);
  const p = join(shotDir, `${prefix}-${name}.png`);
  await maskedScreenshot(page, { path: p, fullPage: false }).catch((e) =>
    console.error(`shot ${name}: ${String(e)}`)
  );
  steps.push({ name, note, url: page.url(), screenshot: `screenshots/${prefix}-${name}.png` });
  console.log(`  shot ${name} @ ${page.url()}`);
}

async function fill(sel: string, val: string): Promise<void> {
  const loc = page.locator(sel).first();
  await loc.waitFor({ state: 'visible', timeout: 15000 });
  await loc.fill(val);
}

try {
  // 1. Sign up (password) via the app's own form
  await page.goto(`${base}/sign-up`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await shot('01-signup-empty', 'Sign-up form (password provider).');
  await fill('[data-cy="email-address-field"] input', email);
  await fill('[data-cy="display-name-field"] input', displayName);
  await fill('[data-cy="password-field"] input', authArg);
  await fill('[data-cy="confirm-password-field"] input', authArg);
  await shot('02-signup-filled', 'Sign-up form filled with the throwaway 629 account.');
  await page.locator('[data-cy="sign-up-button"]').click({ timeout: 15000 });
  await page.waitForTimeout(7000); // App Check + api create round trip
  await shot('03-signup-result', 'Sign-up submitted (App Check enforced path).');

  // 2. Sign in with the new account
  if (!page.url().includes('/sign-in')) {
    await page.goto(`${base}/sign-in`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
  }
  await fill('[data-cy="email-address-field"] input', email);
  await fill('[data-cy="password-field"] input', authArg);
  await shot('04-signin-filled', 'Sign-in with the throwaway account.');
  await page.locator('[data-cy="sign-in-button"]').click({ timeout: 15000 });
  await page.waitForTimeout(8000);
  await shot('05-after-signin', 'Landing after sign-in (home).');

  // 3. Home + Profile (roles: USER — the BEFORE state)
  await page.goto(`${base}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await shot('06-home', 'Home page (signed in).');
  await page.goto(`${base}/profile`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await shot('07-profile-before', 'Profile page BEFORE: roles should read USER.');

  // 4. Theme switch
  try {
    await page.locator('[data-cy="theme-select-button"]').click({ timeout: 10000 });
    await page.waitForTimeout(1500);
    await shot('08-theme-menu', 'Theme selector menu open.');
    await page.locator('.mat-mdc-menu-item').nth(1).click({ timeout: 8000 });
    await page.waitForTimeout(2500);
    await shot('09-theme-changed', 'Theme switched to a different palette.');
  } catch (e) {
    console.error(`theme step: ${String(e)}`);
  }

  // 5. Admin route as a plain user -> observe the client RoleGuard
  await page.goto(`${base}/admin/users`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  await applyPiiBlurNow(page).catch(() => undefined);
  await page.addStyleTag({ content: extraBlurCss }).catch(() => undefined);
  await page.waitForTimeout(1500);
  await shot('10-admin-guard', 'Navigated to /admin/users as a plain user; observe the guard (expect redirect to /forbidden).');
  const adminUrl = page.url();

  // 6. Sign out
  await page.goto(`${base}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  try {
    await page.locator('[data-cy="profile-card-button"]').click({ timeout: 10000 });
    await page.waitForTimeout(1500);
    await shot('11-profile-menu', 'Profile menu with sign-out.');
    await page.locator('[data-cy="sign-out-button"]').click({ timeout: 8000 });
    await page.waitForTimeout(5000);
    await shot('12-signed-out', 'After sign-out.');
  } catch (e) {
    console.error(`sign-out step: ${String(e)}`);
  }

  console.log(`ADMIN_GUARD_RESULT_URL=${adminUrl}`);
} catch (e) {
  console.error(`appflow error: ${e instanceof Error ? e.stack : String(e)}`);
  await shot('99-error-state', 'Error state.');
} finally {
  await page.close();
  await new Promise((r) => setTimeout(r, 1000));
  const newWebm = webms().find((f) => !before.has(f)) ?? '';
  writeFileSync(
    join(outBase, `${prefix}-appflow-index.json`),
    JSON.stringify({ prefix, base, webm: newWebm, steps }, null, 2) + '\n'
  );
  appendFileSync(
    join(outBase, 'index.jsonl'),
    JSON.stringify({ name: `${prefix}-appflow`, webm: newWebm, steps: steps.length }) + '\n'
  );
  console.log(`APPFLOW_WEBM=${newWebm}`);
  await browser.close();
}
