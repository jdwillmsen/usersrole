import { attachCaptureContext } from './browser.ts';
import { loadConfig } from './config.ts';

// Looks up ONE throwaway account's UID in the Auth console by searching its
// email, so it can be reported for the deletion list. Only the just-created
// throwaway is queried; no other user's data is read or printed.
const cfg = loadConfig();
const project = process.argv[2];
const email = process.argv[3];
const { browser, context } = await attachCaptureContext(cfg);
const page = await context.newPage();
await page.goto(
  `https://console.firebase.google.com/project/${project}/authentication/users`,
  { waitUntil: 'domcontentloaded', timeout: 60000 }
);
await page.waitForTimeout(9000);
const search = page
  .locator('fire-search-bar input, input[placeholder*="Search by email" i]')
  .first();
await search.waitFor({ state: 'visible', timeout: 15000 });
await search.fill(email);
await page.waitForTimeout(6000);
// Return ONLY the UID that shares a table row with this throwaway's email, so
// no other user's identifier is read or printed.
const uid: string | null = await page.evaluate((e) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.includes(e)) {
      let row: HTMLElement | null = node.parentElement;
      for (let i = 0; i < 10 && row; i++) {
        const t = row.innerText || '';
        const m = t.match(/\b[A-Za-z0-9]{28}\b/);
        if (m && t.includes(e)) return m[0];
        row = row.parentElement;
      }
    }
  }
  return null;
}, email);
await page.close();
await browser.close();
console.log(`PROJECT=${project} EMAIL=${email} UID=${uid ?? 'NOT_FOUND'}`);
