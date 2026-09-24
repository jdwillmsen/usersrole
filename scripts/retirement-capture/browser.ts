import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page
} from 'playwright';
import type { CaptureConfig } from './config.ts';
import { installPiiBlur } from './redact.ts';
import { xauthFile } from './stack.ts';

export const cdpEndpoint = (cfg: CaptureConfig): string =>
  `http://127.0.0.1:${cfg.cdpPort}`;

// Every page records its own video under a random name, and a client attached
// over CDP cannot ask Playwright which file is its page's, so the launcher
// keeps this index for later scripts to find their recording by time and URL.
function trackVideo(cfg: CaptureConfig, page: Page): void {
  const manifest = join(cfg.videoDir, 'manifest.jsonl');
  const video = page.video()?.path();
  if (!video) return;
  // Timestamp and URL are taken when the event fires, not when the path
  // resolves, so the entry describes the moment it is about.
  const log = (event: string): void => {
    const entry = { event, at: new Date().toISOString(), url: page.url() };
    void video.then((path) =>
      appendFileSync(manifest, JSON.stringify({ ...entry, video: path }) + '\n')
    );
  };
  log('opened');
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) log('navigated');
  });
  page.on('close', () => log('closed'));
}

export async function launchCaptureContext(
  cfg: CaptureConfig
): Promise<BrowserContext> {
  mkdirSync(cfg.videoDir, { recursive: true });
  const context = await chromium.launchPersistentContext(cfg.profileDir, {
    channel: cfg.channel === 'chrome' ? 'chrome' : undefined,
    headless: false,
    viewport: cfg.viewport,
    recordVideo: { dir: cfg.videoDir, size: cfg.viewport },
    env: { ...process.env, DISPLAY: cfg.display, XAUTHORITY: xauthFile(cfg) },
    // Google refuses sign-in from a browser that advertises automation, which
    // is what the default --enable-automation flag and navigator.webdriver do.
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      // Loopback only: this port hands out the whole signed-in session, so it
      // must never be reachable from the tailnet the way VNC is.
      `--remote-debugging-address=127.0.0.1`,
      `--remote-debugging-port=${cfg.cdpPort}`,
      '--window-position=0,0',
      `--window-size=${cfg.screen.width},${cfg.screen.height}`
    ]
  });
  await installPiiBlur(context);
  context.pages().forEach((p) => trackVideo(cfg, p));
  context.on('page', (p) => trackVideo(cfg, p));
  return context;
}

/**
 * Drive the browser the launcher already has open, without restarting it and
 * risking a fresh Google sign-in challenge. Recording is done by the launcher.
 */
export async function attachCaptureContext(
  cfg: CaptureConfig
): Promise<{ browser: Browser; context: BrowserContext }> {
  const browser = await chromium.connectOverCDP(cdpEndpoint(cfg));
  const context = browser.contexts()[0];
  if (!context)
    throw new Error(`no browser context behind ${cdpEndpoint(cfg)}`);
  await installPiiBlur(context);
  return { browser, context };
}
