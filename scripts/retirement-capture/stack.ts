import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { connect } from 'node:net';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import type { CaptureConfig } from './config.ts';

export type Service = 'launcher' | 'xvfb' | 'x11vnc' | 'websockify';

// Matched against /proc/<pid>/cmdline so a recycled pid belonging to some
// unrelated process is never signalled.
const CMDLINE_MARKER: Record<Service, string> = {
  launcher: 'capture.ts',
  xvfb: 'Xvfb',
  x11vnc: 'x11vnc',
  websockify: 'websockify'
};

export function ensureStateDir(cfg: CaptureConfig): void {
  mkdirSync(cfg.stateDir, { recursive: true, mode: 0o700 });
}

export const xauthFile = (cfg: CaptureConfig): string =>
  join(cfg.stateDir, 'Xauthority');
export const logFile = (cfg: CaptureConfig, name: string): string =>
  join(cfg.stateDir, `${name}.log`);
const pidFile = (cfg: CaptureConfig, svc: Service): string =>
  join(cfg.stateDir, `${svc}.pid`);

export function writePid(cfg: CaptureConfig, svc: Service, pid: number): void {
  writeFileSync(pidFile(cfg, svc), `${pid}\n`, { mode: 0o600 });
}

export function runningPid(
  cfg: CaptureConfig,
  svc: Service
): number | undefined {
  const file = pidFile(cfg, svc);
  if (!existsSync(file)) return undefined;
  const pid = Number(readFileSync(file, 'utf8').trim());
  if (!Number.isInteger(pid) || pid <= 1) return undefined;
  try {
    const cmdline = readFileSync(`/proc/${pid}/cmdline`, 'utf8');
    return cmdline.includes(CMDLINE_MARKER[svc]) ? pid : undefined;
  } catch {
    return undefined;
  }
}

export async function stopService(
  cfg: CaptureConfig,
  svc: Service,
  graceMs = 15000
): Promise<'stopped' | 'not-running'> {
  const pid = runningPid(cfg, svc);
  rmSync(pidFile(cfg, svc), { force: true });
  if (pid === undefined) return 'not-running';
  process.kill(pid, 'SIGTERM');
  for (let waited = 0; waited < graceMs; waited += 200) {
    if (!existsSync(`/proc/${pid}`)) return 'stopped';
    await sleep(200);
  }
  process.kill(pid, 'SIGKILL');
  return 'stopped';
}

function spawnDetached(
  cfg: CaptureConfig,
  svc: Service,
  cmd: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env
): number {
  const out = openSync(logFile(cfg, svc), 'a', 0o600);
  // Detached into its own session so a Ctrl-C aimed at the launcher's
  // terminal does not take the display or VNC down with it.
  const child = spawn(cmd, args, {
    detached: true,
    stdio: ['ignore', out, out],
    env
  });
  closeSync(out);
  if (child.pid === undefined) throw new Error(`failed to start ${cmd}`);
  child.unref();
  writePid(cfg, svc, child.pid);
  return child.pid;
}

export async function waitForPort(
  host: string,
  port: number,
  timeoutMs = 15000
): Promise<boolean> {
  for (let waited = 0; waited < timeoutMs; waited += 250) {
    const open = await new Promise<boolean>((done) => {
      const sock = connect({ host, port }, () => {
        sock.destroy();
        done(true);
      });
      sock.on('error', () => done(false));
    });
    if (open) return true;
    await sleep(250);
  }
  return false;
}

// Belt and braces over the bind flags: if anything ends up listening on this
// port on another address (a wildcard, IPv6), kill it rather than leave the
// session exposed.
function assertBoundOnlyTo(
  cfg: CaptureConfig,
  svc: Service,
  port: number
): void {
  const out = spawnSync('ss', ['-ltnH', `sport = :${port}`], {
    encoding: 'utf8'
  }).stdout;
  const locals = out
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim().split(/\s+/)[3]);
  const stray = locals.filter((addr) => addr !== `${cfg.bindIp}:${port}`);
  if (stray.length) {
    const pid = runningPid(cfg, svc);
    if (pid) process.kill(pid, 'SIGKILL');
    throw new Error(`${svc} also listened on ${stray.join(', ')}; killed it`);
  }
}

export async function startXvfb(cfg: CaptureConfig): Promise<number> {
  const existing = runningPid(cfg, 'xvfb');
  if (existing) return existing;
  // Without an X auth key any local account could attach to the display and
  // read the signed-in console off the screen. The key goes in over stdin
  // so it never shows up in a process listing.
  const xauth = xauthFile(cfg);
  rmSync(xauth, { force: true });
  const xauthKey = randomBytes(16).toString('hex');
  const res = spawnSync('xauth', ['-q', '-f', xauth, 'source', '-'], {
    input: `add ${cfg.display} . ${xauthKey}\n`
  });
  if (res.status !== 0)
    throw new Error(`xauth failed: ${res.stderr.toString().trim()}`);
  const { width, height } = cfg.screen;
  const pid = spawnDetached(cfg, 'xvfb', 'Xvfb', [
    cfg.display,
    '-screen',
    '0',
    `${width}x${height}x24`,
    '-auth',
    xauth,
    '-nolisten',
    'tcp'
  ]);
  const socket = `/tmp/.X11-unix/X${cfg.display.slice(1)}`;
  for (let waited = 0; waited < 10000; waited += 200) {
    if (existsSync(socket)) return pid;
    await sleep(200);
  }
  throw new Error(`Xvfb did not create ${socket}; see ${logFile(cfg, 'xvfb')}`);
}

export async function startX11vnc(
  cfg: CaptureConfig
): Promise<number | 'no-passfile'> {
  const existing = runningPid(cfg, 'x11vnc');
  if (existing) return existing;
  if (!existsSync(cfg.vncPassFile)) return 'no-passfile';
  const pid = spawnDetached(cfg, 'x11vnc', 'x11vnc', [
    '-display',
    cfg.display,
    '-auth',
    xauthFile(cfg),
    '-rfbauth',
    cfg.vncPassFile,
    '-listen',
    cfg.bindIp,
    '-rfbport',
    String(cfg.vncPort),
    '-noipv6',
    // libvncserver opens its own IPv6 wildcard listener on 5900, ignoring both
    // -rfbport and -noipv6; a negative port is the only thing that stops it.
    '-rfbportv6',
    '-1',
    '-forever',
    '-shared',
    '-noxdamage'
  ]);
  if (!(await waitForPort(cfg.bindIp, cfg.vncPort)))
    throw new Error(`x11vnc is not listening; see ${logFile(cfg, 'x11vnc')}`);
  assertBoundOnlyTo(cfg, 'x11vnc', cfg.vncPort);
  return pid;
}

export async function startWebsockify(cfg: CaptureConfig): Promise<number> {
  const existing = runningPid(cfg, 'websockify');
  if (existing) return existing;
  // The listen address is an IPv4 literal, not a hostname, so websockify
  // resolves it to a single AF_INET socket and never opens the wildcard IPv6
  // listener that a bare port or a dual-stack name would. Its only v6 switch
  // (--prefer-ipv6) is left off, and assertBoundOnlyTo below is the backstop.
  const pid = spawnDetached(cfg, 'websockify', 'websockify', [
    '--web',
    cfg.novncWebRoot,
    `${cfg.bindIp}:${cfg.novncPort}`,
    `${cfg.bindIp}:${cfg.vncPort}`
  ]);
  if (!(await waitForPort(cfg.bindIp, cfg.novncPort)))
    throw new Error(
      `websockify is not listening; see ${logFile(cfg, 'websockify')}`
    );
  assertBoundOnlyTo(cfg, 'websockify', cfg.novncPort);
  return pid;
}
