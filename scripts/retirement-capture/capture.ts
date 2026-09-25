import { spawn } from 'node:child_process';
import { closeSync, existsSync, openSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cdpEndpoint, launchCaptureContext } from './browser.ts';
import { loadConfig, type CaptureConfig } from './config.ts';
import {
  ensureStateDir,
  logFile,
  runningPid,
  startWebsockify,
  startX11vnc,
  startXvfb,
  stopService,
  waitForPort,
  writePid
} from './stack.ts';

const self = fileURLToPath(import.meta.url);
const cmd = 'node scripts/retirement-capture/capture.ts';

const USAGE: Record<string, string> = {
  status: `usage: ${cmd} [status]\nPrints what is running and where to connect. Default when no subcommand is given.`,
  launch: `usage: ${cmd} launch [--detach]\nStarts Xvfb, noVNC, x11vnc (once the password file exists) and the headed, recorded browser.\nIdempotent: running pieces are reused. --detach returns once the browser is up.`,
  'stop-browser': `usage: ${cmd} stop-browser\nCloses the browser (flushing its videos) but keeps the display and VNC up, so the same profile can be relaunched.`,
  teardown: `usage: ${cmd} teardown [--dry-run]\nStops the browser, x11vnc, websockify and Xvfb, then deletes the profile directory and runtime state. Videos are kept.`
};

function print(
  lines: Record<string, string | number>,
  help: string[] = []
): void {
  for (const [k, v] of Object.entries(lines)) console.log(`${k}: ${v}`);
  if (help.length) {
    console.log(`help[${help.length}]:`);
    for (const h of help) console.log(`  ${h}`);
  }
}

function fail(message: string, help: string[] = []): never {
  print({ error: message }, help);
  process.exit(1);
}

const passfileHelp = (cfg: CaptureConfig): string =>
  `human, in a terminal outside any agent session: mkdir -p ~/.vnc && x11vnc -storepasswd ${cfg.vncPassFile.replace(homedir(), '~')}`;

function status(cfg: CaptureConfig): void {
  const pid = (svc: Parameters<typeof runningPid>[1]): string => {
    const p = runningPid(cfg, svc);
    return p ? `running pid=${p}` : 'stopped';
  };
  const vnc = runningPid(cfg, 'x11vnc')
    ? `running ${cfg.bindIp}:${cfg.vncPort}`
    : existsSync(cfg.vncPassFile)
      ? 'stopped'
      : `waiting for ${cfg.vncPassFile}`;
  const videos = existsSync(cfg.videoDir)
    ? readdirSync(cfg.videoDir).filter((f) => f.endsWith('.webm')).length
    : 0;
  const browserUp = runningPid(cfg, 'launcher') !== undefined;
  print(
    {
      xvfb: `${pid('xvfb')} display=${cfg.display}`,
      vnc,
      novnc: runningPid(cfg, 'websockify')
        ? `running http://${cfg.bindIp}:${cfg.novncPort}/vnc.html`
        : 'stopped',
      browser: browserUp
        ? `${pid('launcher')} cdp=${cdpEndpoint(cfg)} channel=${cfg.channel}`
        : 'stopped',
      profile: `${cfg.profileDir} (${existsSync(cfg.profileDir) ? 'exists' : 'absent'})`,
      videos: `${cfg.videoDir} (${videos} webm)`
    },
    [
      ...(existsSync(cfg.vncPassFile) ? [] : [passfileHelp(cfg)]),
      browserUp
        ? `drive it: attachCaptureContext() from browser.ts (CDP ${cdpEndpoint(cfg)})`
        : `${cmd} launch --detach`,
      `${cmd} teardown --dry-run`
    ]
  );
}

async function launchDetached(cfg: CaptureConfig): Promise<void> {
  if (!runningPid(cfg, 'launcher')) {
    ensureStateDir(cfg);
    const out = openSync(logFile(cfg, 'launcher'), 'a', 0o600);
    const child = spawn(process.execPath, [self, 'launch'], {
      detached: true,
      stdio: ['ignore', out, out],
      env: process.env
    });
    closeSync(out);
    child.unref();
    if (!(await waitForPort('127.0.0.1', cfg.cdpPort, 60000)))
      fail(`browser did not come up; see ${logFile(cfg, 'launcher')}`);
    if (existsSync(cfg.vncPassFile)) await waitForPort(cfg.bindIp, cfg.vncPort);
  }
  status(cfg);
}

async function launch(cfg: CaptureConfig): Promise<void> {
  const existing = runningPid(cfg, 'launcher');
  if (existing && existing !== process.pid)
    fail(`browser already running (pid ${existing})`, [`${cmd} stop-browser`]);
  ensureStateDir(cfg);
  await startXvfb(cfg);
  await startWebsockify(cfg);
  writePid(cfg, 'launcher', process.pid);

  const context = await launchCaptureContext(cfg);

  // The human sets the VNC password in their own terminal after the stack is
  // up, so keep checking rather than making them restart anything.
  // A failure here is a bind or auth problem that retrying will not fix, and
  // retrying would restart a listener that was just killed for exposure.
  const ensureVnc = (): void => {
    startX11vnc(cfg).catch((e: unknown) => {
      clearInterval(vncWatch);
      console.error(`x11vnc: ${String(e)}; not retrying`);
    });
  };
  const vncWatch = setInterval(ensureVnc, 2000);
  ensureVnc();

  let closing = false;
  const shutdown = async (): Promise<void> => {
    if (closing) return;
    closing = true;
    clearInterval(vncWatch);
    // Videos are only finalised when their page closes; a hard exit would
    // leave truncated files behind.
    await context.close().catch(() => undefined);
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());
  context.on('close', () => void shutdown());

  const page = context.pages()[0] ?? (await context.newPage());
  await page
    .goto(cfg.startUrl)
    .catch((e: unknown) => console.error(`start page: ${String(e)}`));
  console.log(`browser up: ${cdpEndpoint(cfg)}`);
}

async function teardown(cfg: CaptureConfig, dryRun: boolean): Promise<void> {
  const home = homedir();
  const profile = resolve(cfg.profileDir);
  // rm -rf on a configurable path: only ever something that is recognisably a
  // browser profile, and never home itself or anything above it.
  const looksLikeProfile =
    !existsSync(profile) ||
    readdirSync(profile).length === 0 ||
    existsSync(join(profile, 'Local State'));
  if (profile === '/' || home.startsWith(profile) || !looksLikeProfile) {
    fail(`refusing to delete ${profile}: not a browser profile directory`);
  }
  const plan = ['launcher', 'x11vnc', 'websockify', 'xvfb'] as const;
  if (dryRun) {
    const would: Record<string, string> = {};
    for (const svc of plan)
      would[`would stop ${svc}`] = runningPid(cfg, svc)
        ? `pid ${runningPid(cfg, svc)}`
        : 'not running';
    would['would delete profile'] =
      `${profile} (${existsSync(profile) ? 'exists' : 'absent'})`;
    would['would delete state'] = cfg.stateDir;
    would['would keep videos'] = cfg.videoDir;
    print(would, [`${cmd} teardown`]);
    return;
  }
  const done: Record<string, string> = {};
  for (const svc of plan) done[svc] = await stopService(cfg, svc);
  // force suppresses "already gone" but still throws on a permission or busy
  // failure; catch it so a partial wipe becomes a loud error instead of an
  // unhandled rejection. This dir holds the live Google session.
  let wipeError: string | undefined;
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch (e) {
    wipeError = e instanceof Error ? e.message : String(e);
  }
  rmSync(cfg.stateDir, { recursive: true, force: true });
  done['videos'] = `kept ${cfg.videoDir}`;
  // The profile still existing means the signed-in session was NOT wiped, so
  // exit non-zero and say so unmistakably rather than report success.
  if (existsSync(profile)) {
    done['profile'] = `STILL PRESENT ${profile}`;
    fail(
      `profile was not deleted; the Google session is still on disk at ${profile}${wipeError ? ` (${wipeError})` : ''} -- delete it by hand`,
      [
        'human: Google Account > Security > Your devices > sign out this session (see RUNBOOK.md)'
      ]
    );
  }
  done['profile'] = `deleted ${profile}`;
  print(done, [
    'human: Google Account > Security > Your devices > sign out this session (see RUNBOOK.md)'
  ]);
}

async function main(): Promise<void> {
  const [sub = 'status', ...rest] = process.argv.slice(2);
  if (rest.includes('--help') || sub === '--help' || sub === 'help') {
    console.log(USAGE[sub] ?? Object.values(USAGE).join('\n\n'));
    return;
  }
  let cfg: CaptureConfig;
  try {
    cfg = loadConfig();
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
  }
  switch (sub) {
    case 'status':
      return status(cfg);
    case 'launch':
      return rest.includes('--detach') ? launchDetached(cfg) : launch(cfg);
    case 'stop-browser':
      return print({ browser: await stopService(cfg, 'launcher') }, [
        `${cmd} launch --detach`
      ]);
    case 'teardown':
      return teardown(cfg, rest.includes('--dry-run'));
    default:
      fail(
        `unknown subcommand ${sub}`,
        Object.keys(USAGE).map((k) => `${cmd} ${k} --help`)
      );
  }
}

main().catch((e: unknown) => fail(e instanceof Error ? e.message : String(e)));
