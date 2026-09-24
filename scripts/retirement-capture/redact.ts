import type {
  BrowserContext,
  Locator,
  Page,
  PageScreenshotOptions
} from 'playwright';

export const PII_ATTR = 'data-capture-pii';

// Candidate column selectors for the Authentication > Users table. The console
// markup is not a public contract, so these are a first line only; the text
// scan below is what actually guarantees coverage when a class name changes.
export const PII_SELECTORS = [
  '.mat-column-email',
  '.mat-column-identifier',
  '.mat-column-uid',
  '.mat-column-userId',
  '.mat-column-user-uid',
  '[data-test-id*="email" i]',
  '[data-test-id*="uid" i]',
  `[${PII_ATTR}]`
];

export const EMAIL_PATTERN = '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';
// Firebase Auth UIDs are 28 base62 characters; matching the whole text node
// rather than a substring keeps ordinary long tokens elsewhere unblurred.
export const UID_PATTERN = '^[A-Za-z0-9]{28}$';

export function looksLikePii(text: string): boolean {
  const t = text.trim();
  return new RegExp(EMAIL_PATTERN).test(t) || new RegExp(UID_PATTERN).test(t);
}

interface BlurArgs {
  attr: string;
  selectors: string[];
  email: string;
  uid: string;
}

// Serialised into every frame by addInitScript, so it may only use its
// argument and browser globals.
function installBlur({ attr, selectors, email, uid }: BlurArgs): void {
  const w = window as unknown as Record<string, unknown>;
  if (w['__capturePiiBlur']) return;
  w['__capturePiiBlur'] = true;

  const emailRe = new RegExp(email);
  const uidRe = new RegExp(uid);
  const css = `${selectors.join(',\n')} { filter: blur(6px) !important; }`;

  const addStyle = (): void => {
    if (document.getElementById('capture-pii-blur')) return;
    const style = document.createElement('style');
    style.id = 'capture-pii-blur';
    style.textContent = css;
    (document.head ?? document.documentElement).appendChild(style);
  };

  const tagText = (n: Node): void => {
    const text = (n.nodeValue ?? '').trim();
    const el = n.parentElement;
    if (!text || !el || el.hasAttribute(attr)) return;
    if (emailRe.test(text) || uidRe.test(text)) el.setAttribute(attr, '');
  };
  // A TreeWalker never yields its own root, and a text node added on its own
  // (textContent assignment, framework re-render) arrives as exactly that root.
  const tag = (root: Node): void => {
    if (root.nodeType === Node.TEXT_NODE) return tagText(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) tagText(n);
  };

  // The style has to exist before first paint, but at document-start there is
  // no documentElement yet, so wait for the parser to create one.
  const start = (): void => {
    addStyle();
    tag(document.documentElement);
    new MutationObserver((records) => {
      addStyle();
      for (const r of records) {
        if (r.type === 'characterData') tag(r.target);
        r.addedNodes.forEach((node) => tag(node));
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  };
  if (document.documentElement) start();
  else
    new MutationObserver((_, obs) => {
      if (!document.documentElement) return;
      obs.disconnect();
      start();
    }).observe(document, { childList: true });
}

const blurArgs: BlurArgs = {
  attr: PII_ATTR,
  selectors: PII_SELECTORS,
  email: EMAIL_PATTERN,
  uid: UID_PATTERN
};

/** Must run before the first navigation, or the first paint goes out unblurred. */
export async function installPiiBlur(context: BrowserContext): Promise<void> {
  await context.addInitScript(installBlur, blurArgs);
}

/** For a page that was already loaded before the init script existed, e.g. after attaching over CDP. */
export async function applyPiiBlurNow(page: Page): Promise<void> {
  for (const frame of page.frames())
    await frame.evaluate(installBlur, blurArgs);
}

export function piiMasks(page: Page, extra: Locator[] = []): Locator[] {
  return [page.locator(PII_SELECTORS.join(', ')), ...extra];
}

/**
 * Blur is cosmetic and can lose a race with a fast re-render; mask paints over
 * the matched boxes at capture time, so stills get both.
 */
export async function maskedScreenshot(
  page: Page,
  options: PageScreenshotOptions & { path: string; mask?: Locator[] }
): Promise<Buffer> {
  await applyPiiBlurNow(page);
  return page.screenshot({
    ...options,
    mask: piiMasks(page, options.mask),
    maskColor: '#444'
  });
}
