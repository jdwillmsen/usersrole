import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync
} from 'node:fs';
import { basename, join } from 'node:path';
import type { Page } from 'playwright';
import { attachCaptureContext } from './browser.ts';
import { loadConfig } from './config.ts';
import { applyPiiBlurNow, maskedScreenshot } from './redact.ts';

// A capture harness driven by a JSON target list, so adding a console surface
// is a data change, not a code change. Each target is recorded in its own page
// (hence its own .webm) and gets a masked screenshot plus a caption stub.
interface Target {
  name: string;
  url: string;
  caption: string;
  pii?: boolean;
  fullPage?: boolean;
  waitMs?: number;
}

const cfg = loadConfig();
const [targetsPath, outBase] = process.argv.slice(2);
if (!targetsPath || !outBase) {
  console.error('usage: node tour.ts <targets.json> <outBaseDir>');
  process.exit(1);
}
const targets: Target[] = JSON.parse(readFileSync(targetsPath, 'utf8'));
const shotDir = join(outBase, 'screenshots');
const capDir = join(outBase, 'captions');
mkdirSync(shotDir, { recursive: true });
mkdirSync(capDir, { recursive: true });

const webms = (): string[] =>
  existsSync(cfg.videoDir)
    ? readdirSync(cfg.videoDir).filter((f) => f.endsWith('.webm'))
    : [];

const { browser, context } = await attachCaptureContext(cfg);
const index: Array<Record<string, unknown>> = [];

for (const t of targets) {
  const before = new Set(webms());
  const page: Page = await context.newPage();
  let status = 'ok';
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (e) {
    status = `nav-error: ${e instanceof Error ? e.message : String(e)}`;
  }
  // Consoles are Angular/React SPAs that keep polling, so networkidle never
  // settles; a fixed settle beats waiting for a quiet network that never comes.
  await page.waitForTimeout(t.waitMs ?? 6000);
  await applyPiiBlurNow(page).catch(() => undefined);
  if (t.pii) await page.waitForTimeout(1500);
  const shot = join(shotDir, `${t.name}.png`);
  try {
    await maskedScreenshot(page, { path: shot, fullPage: t.fullPage ?? false });
  } catch (e) {
    status += ` shot-error: ${e instanceof Error ? e.message : String(e)}`;
  }
  const finalUrl = page.url();
  const title = await page.title().catch(() => '');
  await page.close(); // finalises this page's video
  await new Promise((r) => setTimeout(r, 800));
  const after = webms();
  const newWebm = after.find((f) => !before.has(f)) ?? '';

  const cap = join(capDir, `${t.name}.md`);
  const capBody = [
    `# ${t.name}`,
    '',
    t.caption,
    '',
    `- Requested URL: ${t.url}`,
    `- Landed URL: ${finalUrl}`,
    `- Page title: ${title}`,
    `- PII surface: ${t.pii ? 'yes (blur + mask applied)' : 'no'}`,
    `- Screenshot: screenshots/${t.name}.png`,
    `- Video (in 627 videos/, to move to media/): ${newWebm || '(none captured)'}`,
    `- Capture status: ${status}`,
    ''
  ].join('\n');
  writeFileSync(cap, capBody);
  const rec = {
    name: t.name,
    url: t.url,
    finalUrl,
    title,
    pii: !!t.pii,
    webm: newWebm,
    screenshot: `screenshots/${t.name}.png`,
    status
  };
  index.push(rec);
  appendFileSync(join(outBase, 'index.jsonl'), JSON.stringify(rec) + '\n');
  console.log(
    `${t.name}: ${status.startsWith('ok') ? 'OK' : status} | ${finalUrl} | webm=${newWebm ? basename(newWebm) : 'NONE'}`
  );
}

await browser.close(); // disconnect only; launcher keeps the browser
writeFileSync(
  join(outBase, 'index.json'),
  JSON.stringify(index, null, 2) + '\n'
);
console.log(`done: ${index.length} targets -> ${outBase}`);
