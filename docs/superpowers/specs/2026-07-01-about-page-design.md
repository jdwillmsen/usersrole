# About Page — Design Spec

**Date:** 2026-07-01
**Branch:** `feat/about-page` (off `main`, Angular 22 / zoneless)
**Status:** Design approved; pending spec review → implementation plan.

## Purpose

Provide a public `/about` page that consolidates the app's stack versions,
build provenance, runtime facts, and project links in one place. Replaces the
originally-requested header version tag with a fuller, more maintainable page.
Also serves as an at-a-glance confirmation of what is actually deployed
(e.g. Angular version, commit, environment).

## Goals

- Single page showing: build info, framework/library versions, runtime facts,
  project links.
- Version data is **accurate by construction** — generated at build time, not
  hand-maintained.
- Publicly reachable (no auth guard), linked from a header info icon.
- Follows existing feature conventions; no new architectural patterns.

## Non-Goals

- No header version tag (superseded by this page).
- No admin/edit UI for the About content.
- No full dependency-tree listing — only a curated allow-list of key libraries.
- No i18n/localization beyond what the app already does.

## Codebase Conventions (verified on `main`)

- Feature areas are lazy-loaded: a thin `*.module.ts` (`@NgModule`) importing a
  standalone component + a `*-routing.module.ts`, wired via `loadChildren` in
  `app-routing.module.ts`. `home` is the reference (`HomeModule` imports
  `HomeRoutingModule` + standalone `HomeComponent`).
- Components are **standalone** (Angular 22); feature module exists only to give
  `loadChildren` a module target.
- Header (`src/app/shared/components/header/header.component.html`) is a
  `mat-toolbar`: menu button, app name, spacer, then `app-github-button`,
  `app-theme-selector`, `app-profile-card`.
- `package.json` `version` is `0.0.0`; `build` script is `ng build` with no
  `prebuild` hook.
- Environments live in `src/environments/` (`environment.ts`,
  `.development.ts`, `.production.ts`, `.local.ts`, `.template.ts`).

## Architecture

### Feature module

```
src/app/about/
  about.module.ts            # @NgModule imports AboutRoutingModule + AboutComponent
  about-routing.module.ts    # { path: '', component: AboutComponent }
  components/about/
    about.component.ts        # standalone
    about.component.html
    about.component.scss
    about.component.spec.ts    # jest
    about.component.cy.ts      # cypress CT
```

`app-routing.module.ts` gains:

```ts
{ path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) }
```

No auth guard on this route.

### Build-time version generation

`scripts/generate-version-info.mjs` (Node ESM), run via an npm `prebuild`
lifecycle script so it executes automatically before `ng build` on every build
path (local, PR preview, live deploy). Also exposed as `generate:version` for
manual/`start` use.

The script reads:

- `package.json` `version` → `app`.
- A curated **allow-list** of dependency names; for each present in
  `package.json` dependencies/devDependencies, record the declared version.
  Initial allow-list: `@angular/core`, `@angular/material`, `firebase`,
  `rxfire`, `ag-grid-community`/`ag-grid-angular`, `rxjs`, `typescript`.
  Missing entries are silently omitted (no error).
- `git rev-parse --short HEAD` → `commit`; on failure (no git) → `'dev'`.
- Build timestamp (ISO) → `builtAt`.
- Target environment string → `env` (from an env var the build passes, e.g.
  `NG_APP_ENV`/`NODE_ENV`, defaulting to `'unknown'`).

Writes `src/generated/version-info.ts`:

```ts
export interface VersionInfo {
  app: string;
  commit: string;      // short SHA or 'dev'
  builtAt: string;     // ISO 8601 or 'unknown'
  env: string;         // 'production' | 'development' | ... | 'unknown'
  deps: Record<string, string>;
}
export const VERSION_INFO: VersionInfo = { /* generated */ };
```

- `src/generated/version-info.ts` is **tracked (committed)** with placeholder
  values (`app` from package.json, `commit: 'dev'`, `builtAt: 'unknown'`,
  `env: 'unknown'`, `deps: {}`) so `ng serve`, editors, and fresh checkouts
  compile without running the generator. It is **not** git-ignored. The
  generator overwrites it in place at build time; in CI that overwrite is
  ephemeral (never committed). Developers do not commit the local regenerated
  churn (revert with `git checkout` if needed). Committing a normally-generated
  file is a deliberate exception that keeps the type import resolvable with zero
  setup.

### Runtime facts (read live in the component)

- Angular version: `import { VERSION } from '@angular/core'` → `VERSION.full`.
- Zoneless active: `typeof Zone === 'undefined'`.
- App Check status: presence check consistent with how the app initializes it
  (best-effort; "active"/"unknown").
- Browser / platform: `navigator.userAgent` / `navigator.platform`.

## Page Layout

`AboutComponent` renders Material cards (`mat-card`), one per category,
following existing theming and the app's XSmall breakpoint stacking:

1. **Build** — app version, commit (links to
   `https://github.com/jdwillmsen/usersrole/commit/<sha>` when `commit !== 'dev'`),
   build date, environment.
2. **Framework & libraries** — rows of name → version from `VERSION_INFO.deps`,
   plus live Angular `VERSION.full`.
3. **Runtime** — zoneless CD, App Check status, browser, platform.
4. **Project** — description, GitHub repo link, license, author/credits.

## Data Flow

```
package.json + git + env
      │  (npm prebuild)
      ▼
scripts/generate-version-info.mjs
      │  writes
      ▼
src/generated/version-info.ts  ──imports──▶  AboutComponent ──renders──▶ /about
navigator / @angular/core VERSION ──live──▶  AboutComponent
```

No runtime network calls; all data is compile-time or `navigator`-local.

## Error Handling

- All `VersionInfo` fields render safely: missing/unknown → `'—'` or
  `'unknown'`, never blank, never throwing.
- Commit→GitHub link only rendered when `commit` present and `!== 'dev'`.
- Generator: absent allow-list dep → omitted; git failure → `commit: 'dev'`;
  never fails the build.

## Testing

- **Generator unit test** — feed a fixture `package.json` + stubbed git output;
  assert output shape, allow-list filtering, and `'dev'`/`'unknown'` fallbacks.
- **Component spec (jest)** — renders each card; handles placeholder/unknown
  values; GitHub commit link is conditional on a real SHA.
- **Cypress CT (`about.component.cy.ts`)** — cards visible, values present,
  GitHub link `href` correct.
- **Header (`header.component.cy.ts`)** — info icon present and routes to
  `/about`.

## Header Entry Point

Add an info icon button to `header.component.html` between the app name/spacer
and `app-github-button`:

```html
<a mat-icon-button routerLink="/about" matTooltip="About" data-cy="about-button">
  <mat-icon>info</mat-icon>
</a>
```

Always visible (including signed-out), consistent with the public route.

## CI / Build Wiring

- Hooking generation to npm `prebuild` means every build path regenerates
  version info automatically; the Firebase PR-preview and merge workflows call
  `npm run build`, so **no workflow edits are required** — verify no path calls
  `ng build` directly, bypassing `prebuild`.
- `.gitignore`: no change — `src/generated/version-info.ts` stays tracked and is
  overwritten in place by the generator (see build-time generation above).

## Open Risks / Notes

- Committed generated fallback can drift from reality in local dev; acceptable
  because production/preview always regenerate. The fallback is clearly marked
  as placeholder (`commit: 'dev'`).
- `env` value depends on the build passing an environment identifier; if none is
  wired, it shows `'unknown'` (non-blocking, can be improved later).
