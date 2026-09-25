import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync
} from 'node:fs';
import { basename, join } from 'node:path';
import { attachCaptureContext } from './browser.ts';
import { loadConfig } from './config.ts';
import { applyPiiBlurNow, maskedScreenshot } from './redact.ts';

// Like tour.ts, but each step navigates then clicks a control (by visible text)
// to reach a pane that has no direct URL — e.g. Auth Settings sub-panes and the
// per-provider config dialogs. The screenshot is taken whether or not the click
// matched, so a missed click is visible in the still rather than silent.
interface Step {
  name: string;
  url: string;
  click?: string; // visible text to click
  clickNth?: number;
  caption: string;
  pii?: boolean;
  fullPage?: boolean;
  waitMs?: number;
}

const cfg = loadConfig();
const [stepsPath, outBase] = process.argv.slice(2);
if (!stepsPath || !outBase) {
  console.error('usage: node clicktour.ts <steps.json> <outBaseDir>');
  process.exit(1);
}
const steps: Step[] = JSON.parse(readFileSync(stepsPath, 'utf8'));
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

for (const s of steps) {
  const before = new Set(webms());
  const page = await context.newPage();
  let status = 'ok';
  let clickResult = 'n/a';
  try {
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (e) {
    status = `nav-error: ${e instanceof Error ? e.message : String(e)}`;
  }
  await page.waitForTimeout(s.waitMs ?? 7000);
  if (s.click) {
    try {
      const loc = page.getByText(s.click, { exact: false }).nth(s.clickNth ?? 0);
      await loc.click({ timeout: 8000 });
      clickResult = `clicked "${s.click}"`;
      await page.waitForTimeout(3500);
    } catch (e) {
      clickResult = `click-miss "${s.click}": ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  await applyPiiBlurNow(page).catch(() => undefined);
  await page.waitForTimeout(800);
  const shot = join(shotDir, `${s.name}.png`);
  try {
    await maskedScreenshot(page, { path: shot, fullPage: s.fullPage ?? false });
  } catch (e) {
    status += ` shot-error: ${e instanceof Error ? e.message : String(e)}`;
  }
  const finalUrl = page.url();
  await page.close();
  await new Promise((r) => setTimeout(r, 800));
  const newWebm = webms().find((f) => !before.has(f)) ?? '';
  writeFileSync(
    join(capDir, `${s.name}.md`),
    [
      `# ${s.name}`,
      '',
      s.caption,
      '',
      `- URL: ${s.url}`,
      `- Landed: ${finalUrl}`,
      `- Click: ${clickResult}`,
      `- PII surface: ${s.pii ? 'yes (blur + mask applied)' : 'no'}`,
      `- Screenshot: screenshots/${s.name}.png`,
      `- Video: ${newWebm || '(none)'}`,
      `- Status: ${status}`,
      ''
    ].join('\n')
  );
  const rec = {
    name: s.name,
    url: s.url,
    finalUrl,
    click: clickResult,
    pii: !!s.pii,
    webm: newWebm,
    screenshot: `screenshots/${s.name}.png`,
    status
  };
  index.push(rec);
  appendFileSync(join(outBase, 'index.jsonl'), JSON.stringify(rec) + '\n');
  console.log(
    `${s.name}: ${status} | ${clickResult} | ${finalUrl} | webm=${newWebm ? basename(newWebm) : 'NONE'}`
  );
}
await browser.close();
console.log(`clicktour done: ${index.length} steps -> ${outBase}`);
