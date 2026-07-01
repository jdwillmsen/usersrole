# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public `/about` page consolidating build info, stack versions, runtime facts, and project links, with version data generated at build time.

**Architecture:** A Node prebuild script generates `src/generated/version-info.ts` from `package.json` + git. A standalone `AboutComponent`, lazy-loaded via a thin `AboutModule`, renders Material cards from that data plus live runtime facts. A header info icon links to it.

**Tech Stack:** Angular 22 (standalone components, zoneless), Angular Material, TypeScript, Node ESM scripts, `node --test`, Cypress component tests.

## Global Constraints

- Angular 22.0.2, zoneless — no `zone.js` runtime assumptions; use signals/plain fields.
- Feature areas are lazy-loaded: thin `@NgModule` importing a standalone component + a routing module, wired via `loadChildren`. Reference: `src/app/home`.
- Components are standalone with `imports: [...]`; no `declarations`.
- Component tests use Cypress CT (`*.cy.ts`, `cy.mount`, `cy.getByCy`). Jest (`*.spec.ts` under `src/`) is for services only — do not add jest component specs.
- Absolute imports resolve from repo root: `import { X } from 'src/...'`.
- Repo URL: `https://github.com/jdwillmsen/usersrole`.
- `package.json`: version `0.0.0`, author `Jake Willmsen`, license `ISC`, description `Users role and authentication template application.`.
- New control-flow syntax in templates (`@if`), matching `header.component.html`.

---

### Task 1: Build-time version-info generator

**Files:**
- Create: `scripts/version-info.lib.mjs`
- Create: `scripts/version-info.lib.test.mjs`
- Create: `scripts/generate-version-info.mjs`
- Create: `src/generated/version-info.ts` (tracked placeholder)
- Modify: `package.json` (add `generate:version`, `prebuild`, `test:scripts` scripts)

**Interfaces:**
- Produces: `buildVersionInfo(pkg, { commit, builtAt, env }, allowList?) → { app, commit, builtAt, env, deps }` and `DEFAULT_ALLOW_LIST: string[]` from `scripts/version-info.lib.mjs`.
- Produces: `src/generated/version-info.ts` exporting `interface VersionInfo` and `const VERSION_INFO: VersionInfo`.

- [ ] **Step 1: Write the failing test**

Create `scripts/version-info.lib.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildVersionInfo, DEFAULT_ALLOW_LIST } from './version-info.lib.mjs';

const pkg = {
  version: '1.2.3',
  dependencies: { '@angular/core': '22.0.2', firebase: '^12.0.0', tslib: '2.5.3' },
  devDependencies: { typescript: '6.0.3' }
};

test('filters deps to the allow-list and keeps declared versions', () => {
  const info = buildVersionInfo(pkg, { commit: 'abc1234', builtAt: '2026-07-01T00:00:00Z', env: 'production' });
  assert.equal(info.app, '1.2.3');
  assert.equal(info.commit, 'abc1234');
  assert.equal(info.env, 'production');
  assert.equal(info.deps['@angular/core'], '22.0.2');
  assert.equal(info.deps['firebase'], '^12.0.0');
  assert.equal(info.deps['typescript'], '6.0.3');
  assert.equal(info.deps['tslib'], undefined); // not on allow-list
});

test('falls back when fields are missing', () => {
  const info = buildVersionInfo({}, {});
  assert.equal(info.app, 'unknown');
  assert.equal(info.commit, 'dev');
  assert.equal(info.builtAt, 'unknown');
  assert.equal(info.env, 'unknown');
  assert.deepEqual(info.deps, {});
});

test('DEFAULT_ALLOW_LIST includes the key libraries', () => {
  for (const name of ['@angular/core', '@angular/material', 'firebase', 'rxjs']) {
    assert.ok(DEFAULT_ALLOW_LIST.includes(name), `${name} missing`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/version-info.lib.test.mjs`
Expected: FAIL — `Cannot find module './version-info.lib.mjs'`.

- [ ] **Step 3: Write the pure library**

Create `scripts/version-info.lib.mjs`:

```js
export const DEFAULT_ALLOW_LIST = [
  '@angular/core',
  '@angular/material',
  '@angular/cdk',
  'firebase',
  'rxfire',
  'ag-grid-community',
  'rxjs',
  'typescript'
];

export function buildVersionInfo(pkg, options = {}, allowList = DEFAULT_ALLOW_LIST) {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const deps = {};
  for (const name of allowList) {
    if (allDeps[name]) deps[name] = allDeps[name];
  }
  return {
    app: pkg.version || 'unknown',
    commit: options.commit || 'dev',
    builtAt: options.builtAt || 'unknown',
    env: options.env || 'unknown',
    deps
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/version-info.lib.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the generator IO wrapper**

Create `scripts/generate-version-info.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVersionInfo } from './version-info.lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

let commit = 'dev';
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  // No git (e.g. exported source) — keep the 'dev' fallback.
}

const info = buildVersionInfo(pkg, {
  commit,
  builtAt: new Date().toISOString(),
  env: process.env.NODE_ENV || 'unknown'
});

const file = `// Generated at build time by scripts/generate-version-info.mjs. Do not edit.
export interface VersionInfo {
  app: string;
  commit: string;
  builtAt: string;
  env: string;
  deps: Record<string, string>;
}

export const VERSION_INFO: VersionInfo = ${JSON.stringify(info, null, 2)};
`;

mkdirSync(resolve(root, 'src/generated'), { recursive: true });
writeFileSync(resolve(root, 'src/generated/version-info.ts'), file);
console.log(`Wrote src/generated/version-info.ts (commit ${info.commit}, env ${info.env}).`);
```

- [ ] **Step 6: Generate the tracked placeholder and wire npm scripts**

Run the generator once to create the file, then hand-normalize it to placeholder values so the committed copy is deterministic:

Run: `node scripts/generate-version-info.mjs`

Then overwrite `src/generated/version-info.ts` with this deterministic placeholder (so the tracked copy does not carry a real local SHA/date):

```ts
// Generated at build time by scripts/generate-version-info.mjs. Do not edit.
export interface VersionInfo {
  app: string;
  commit: string;
  builtAt: string;
  env: string;
  deps: Record<string, string>;
}

export const VERSION_INFO: VersionInfo = {
  "app": "0.0.0",
  "commit": "dev",
  "builtAt": "unknown",
  "env": "unknown",
  "deps": {}
};
```

Add to `package.json` `scripts` (after `"build": "ng build",`):

```json
    "prebuild": "node scripts/generate-version-info.mjs",
    "generate:version": "node scripts/generate-version-info.mjs",
    "test:scripts": "node --test scripts/",
```

- [ ] **Step 7: Verify the prebuild wiring and script test**

Run: `npm run test:scripts`
Expected: PASS (3 tests).

Run: `npm run generate:version`
Expected: logs `Wrote src/generated/version-info.ts (commit <sha>, env ...)`; `src/generated/version-info.ts` now shows a real short SHA. Restore the placeholder afterward: `git checkout src/generated/version-info.ts`.

- [ ] **Step 8: Commit**

```bash
git add scripts/version-info.lib.mjs scripts/version-info.lib.test.mjs scripts/generate-version-info.mjs src/generated/version-info.ts package.json
git commit -m "feat: generate build/version info at build time"
```

---

### Task 2: About feature module, route, and minimal component

**Files:**
- Create: `src/app/about/about.module.ts`
- Create: `src/app/about/about-routing.module.ts`
- Create: `src/app/about/components/about/about.component.ts`
- Create: `src/app/about/components/about/about.component.html`
- Create: `src/app/about/components/about/about.component.scss`
- Create: `src/app/about/components/about/about.component.cy.ts`
- Modify: `src/app/app-routing.module.ts` (add public `about` route)

**Interfaces:**
- Consumes: nothing yet (content added in Task 3).
- Produces: `AboutComponent` (selector `app-about`), `AboutModule`, route `/about`.

- [ ] **Step 1: Write the failing component test**

Create `src/app/about/components/about/about.component.cy.ts`:

```ts
import { AboutComponent } from './about.component';
import { ActivatedRoute } from '@angular/router';

describe('AboutComponent', () => {
  it('should mount', () => {
    cy.mount(AboutComponent, {
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    });
    cy.getByCy('about-page').should('be.visible');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run cy:run:ct -- --spec src/app/about/components/about/about.component.cy.ts`
Expected: FAIL — cannot resolve `./about.component`.

- [ ] **Step 3: Create the minimal standalone component**

`src/app/about/components/about/about.component.ts`:

```ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [MatCardModule]
})
export class AboutComponent {}
```

`src/app/about/components/about/about.component.html`:

```html
<div class="about" data-cy="about-page">
  <h1>About</h1>
</div>
```

`src/app/about/components/about/about.component.scss`:

```scss
.about {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run cy:run:ct -- --spec src/app/about/components/about/about.component.cy.ts`
Expected: PASS.

- [ ] **Step 5: Create the feature module and routing**

`src/app/about/about-routing.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
```

`src/app/about/about.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  imports: [AboutRoutingModule, AboutComponent]
})
export class AboutModule {}
```

- [ ] **Step 6: Register the public route**

In `src/app/app-routing.module.ts`, add this entry to the `routes` array immediately after the `home` entry (before the `path: ''` authentication entry so it is matched first; no `authGuard`):

```ts
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule)
  },
```

- [ ] **Step 7: Verify the route builds**

Run: `npx ng build --configuration development`
Expected: build succeeds; output includes a lazy chunk for `about`.

- [ ] **Step 8: Commit**

```bash
git add src/app/about src/app/app-routing.module.ts
git commit -m "feat: add public /about route and feature module"
```

---

### Task 3: About page content — version cards + runtime facts

**Files:**
- Modify: `src/app/about/components/about/about.component.ts`
- Modify: `src/app/about/components/about/about.component.html`
- Modify: `src/app/about/components/about/about.component.cy.ts`

**Interfaces:**
- Consumes: `VERSION_INFO` from `src/generated/version-info` (Task 1).
- Produces: rendered cards with `data-cy` hooks: `build-card`, `libraries-card`, `runtime-card`, `project-card`, and `commit-link` (only when a real SHA).

- [ ] **Step 1: Extend the component test**

Replace `src/app/about/components/about/about.component.cy.ts` with:

```ts
import { AboutComponent } from './about.component';
import { ActivatedRoute } from '@angular/router';

describe('AboutComponent', () => {
  beforeEach(() => {
    cy.mount(AboutComponent, {
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    });
  });

  it('should mount', () => {
    cy.getByCy('about-page').should('be.visible');
  });

  it('renders all four info cards', () => {
    cy.getByCy('build-card').should('be.visible');
    // Assert the live Angular runtime line, not a generated dep: during CT the
    // component reads the committed placeholder version-info.ts (deps {}), since
    // `prebuild` only runs for `npm run build`, not for cypress.
    cy.getByCy('libraries-card').should('be.visible').and('contain.text', 'Angular (runtime)');
    cy.getByCy('runtime-card').should('be.visible');
    cy.getByCy('project-card').should('be.visible').and('contain.text', 'jdwillmsen/usersrole');
  });

  it('hides the commit link for the placeholder dev build', () => {
    // Tracked version-info.ts ships commit 'dev', so no GitHub commit link renders.
    cy.getByCy('commit-link').should('not.exist');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run cy:run:ct -- --spec src/app/about/components/about/about.component.cy.ts`
Expected: FAIL — `build-card` not found.

- [ ] **Step 3: Implement the component logic**

Replace `src/app/about/components/about/about.component.ts` with:

```ts
import { Component, VERSION } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { VERSION_INFO } from 'src/generated/version-info';

const REPO_URL = 'https://github.com/jdwillmsen/usersrole';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [MatCardModule, KeyValuePipe]
})
export class AboutComponent {
  readonly info = VERSION_INFO;
  readonly repoUrl = REPO_URL;
  readonly angularVersion = VERSION.full;

  // Zoneless CD ships without zone.js; its absence confirms the mode at runtime.
  readonly zoneless = typeof (window as unknown as { Zone?: unknown }).Zone === 'undefined';
  readonly appCheck = 'enabled'; // App Check is always initialized in AppFirebaseModule.
  readonly browser = navigator.userAgent;
  readonly platform = navigator.platform;

  readonly project = {
    description: 'Users role and authentication template application.',
    author: 'Jake Willmsen',
    license: 'ISC'
  };

  get commitUrl(): string | null {
    return this.info.commit && this.info.commit !== 'dev'
      ? `${this.repoUrl}/commit/${this.info.commit}`
      : null;
  }
}
```

- [ ] **Step 4: Implement the template**

Replace `src/app/about/components/about/about.component.html` with:

```html
<div class="about" data-cy="about-page">
  <h1>About</h1>

  <mat-card data-cy="build-card">
    <mat-card-header><mat-card-title>Build</mat-card-title></mat-card-header>
    <mat-card-content>
      <p>Version: {{ info.app }}</p>
      <p>
        Commit:
        @if (commitUrl) {
          <a [href]="commitUrl" target="_blank" rel="noopener" data-cy="commit-link">{{ info.commit }}</a>
        } @else {
          {{ info.commit }}
        }
      </p>
      <p>Built: {{ info.builtAt }}</p>
      <p>Environment: {{ info.env }}</p>
    </mat-card-content>
  </mat-card>

  <mat-card data-cy="libraries-card">
    <mat-card-header><mat-card-title>Framework &amp; libraries</mat-card-title></mat-card-header>
    <mat-card-content>
      <p>Angular (runtime): {{ angularVersion }}</p>
      @for (dep of info.deps | keyvalue; track dep.key) {
        <p>{{ dep.key }}: {{ dep.value }}</p>
      }
    </mat-card-content>
  </mat-card>

  <mat-card data-cy="runtime-card">
    <mat-card-header><mat-card-title>Runtime</mat-card-title></mat-card-header>
    <mat-card-content>
      <p>Zoneless change detection: {{ zoneless ? 'enabled' : 'disabled' }}</p>
      <p>App Check: {{ appCheck }}</p>
      <p>Browser: {{ browser }}</p>
      <p>Platform: {{ platform }}</p>
    </mat-card-content>
  </mat-card>

  <mat-card data-cy="project-card">
    <mat-card-header><mat-card-title>Project</mat-card-title></mat-card-header>
    <mat-card-content>
      <p>{{ project.description }}</p>
      <p>Author: {{ project.author }}</p>
      <p>License: {{ project.license }}</p>
      <p>Repository: <a [href]="repoUrl" target="_blank" rel="noopener">jdwillmsen/usersrole</a></p>
    </mat-card-content>
  </mat-card>
</div>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run cy:run:ct -- --spec src/app/about/components/about/about.component.cy.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Format and commit**

```bash
npx prettier "src/app/about/**/*.{ts,html,scss}" --write
git add src/app/about
git commit -m "feat: render build, library, runtime, and project info on /about"
```

---

### Task 4: Header info icon linking to /about

**Files:**
- Modify: `src/app/shared/components/header/header.component.html`
- Modify: `src/app/shared/components/header/header.component.cy.ts`

**Interfaces:**
- Consumes: route `/about` (Task 2).
- Produces: header control with `data-cy="about-button"` and `routerLink="/about"`.

Note: `HeaderComponent` already imports `RouterLink`, `MatButtonModule`, `MatIconModule`, and `MatTooltipModule` — no `.ts` change needed.

- [ ] **Step 1: Add the failing header test**

The existing spec mounts with an `AUTH` mock and an `ActivatedRoute` stub but no real router, so `routerLink` renders no `href`. This new test mounts with `provideRouter([])` so the link serializes. Add the `provideRouter` import and the test to `src/app/shared/components/header/header.component.cy.ts` (keep existing tests and imports intact):

```ts
import { ActivatedRoute, provideRouter } from '@angular/router';
```

(replace the existing `import { ActivatedRoute } from '@angular/router';` line), then add inside the `describe` block:

```ts
  it('shows an about button linking to /about', () => {
    cy.mount(HeaderComponent, {
      imports: [MatSnackBarModule],
      providers: [{ provide: AUTH, useValue: authMock }, provideRouter([])]
    });
    cy.getByCy('about-button')
      .should('be.visible')
      .and('have.attr', 'href', '/about');
    cy.getByCy('about-button').find('mat-icon').should('contain.text', 'info');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run cy:run:ct -- --spec src/app/shared/components/header/header.component.cy.ts`
Expected: FAIL — `about-button` not found.

- [ ] **Step 3: Add the info icon to the header**

In `src/app/shared/components/header/header.component.html`, insert this element immediately before the `<app-github-button ...>` line (after the `<span class="spacer"></span>`):

```html
  <a
    mat-icon-button
    routerLink="/about"
    matTooltip="About"
    data-cy="about-button"
  >
    <mat-icon>info</mat-icon>
  </a>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run cy:run:ct -- --spec src/app/shared/components/header/header.component.cy.ts`
Expected: PASS (existing tests + the new about-button test).

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/components/header/header.component.html src/app/shared/components/header/header.component.cy.ts
git commit -m "feat: link to /about from a header info icon"
```

---

## Final Verification

- [ ] Run generator test: `npm run test:scripts` → PASS.
- [ ] Run the About and header component tests: `npm run cy:run:ct -- --spec "src/app/about/**/*.cy.ts,src/app/shared/components/header/header.component.cy.ts"` → PASS.
- [ ] Production build with generation: `NODE_ENV=production npm run build` → succeeds; `src/generated/version-info.ts` shows a real SHA and `env: "production"`; restore placeholder with `git checkout src/generated/version-info.ts` before finishing.
- [ ] Lint/format clean: `npm run lint && npx prettier "src/app/about/**/*" scripts --check`.
- [ ] Manual: `npm start`, visit `/about` (signed out) — four cards render; header info icon navigates there.
