import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// The worktree root, so the passfile guard can keep a credential out of any
// path git would track. Falls back to the package dir if git is unavailable,
// which still catches the common CAPTURE_VNC_PASSFILE-into-the-repo mistake.
function repoRoot(): string {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: here,
      encoding: 'utf8'
    }).trim();
  } catch {
    return resolve(here, '..', '..');
  }
}

function isInside(child: string, parent: string): boolean {
  return child === parent || child.startsWith(parent + sep);
}

export interface CaptureConfig {
  bindIp: string;
  display: string;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  vncPort: number;
  novncPort: number;
  novncWebRoot: string;
  cdpPort: number;
  profileDir: string;
  videoDir: string;
  screenshotDir: string;
  stateDir: string;
  vncPassFile: string;
  startUrl: string;
  channel: 'chrome' | 'chromium';
}

// Tailscale hands out addresses from the CGNAT block only. Refusing anything
// else is what keeps a typo or an empty lookup from turning into a VNC
// listener on 0.0.0.0 or a public interface.
export function isTailnetIpv4(ip: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return false;
  const octets = m.slice(1).map(Number);
  if (octets.some((o) => o > 255)) return false;
  return octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127;
}

function tailnetIp(env: NodeJS.ProcessEnv): string {
  const ip =
    env['CAPTURE_BIND_IP'] ??
    execFileSync('tailscale', ['ip', '-4'], { encoding: 'utf8' })
      .split('\n')[0]
      .trim();
  if (!isTailnetIpv4(ip)) {
    throw new Error(
      `bind address ${JSON.stringify(ip)} is not a tailnet (100.64.0.0/10) IPv4 address`
    );
  }
  return ip;
}

function port(env: NodeJS.ProcessEnv, key: string, fallback: number): number {
  const raw = env[key];
  if (raw === undefined) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1024 || n > 65535)
    throw new Error(`${key}=${raw} is not a port in 1024-65535`);
  return n;
}

export function loadConfig(
  env: NodeJS.ProcessEnv = process.env
): CaptureConfig {
  const home = homedir();
  const displayNum = env['CAPTURE_DISPLAY'] ?? '99';
  if (!/^\d+$/.test(displayNum))
    throw new Error(`CAPTURE_DISPLAY=${displayNum} must be a display number`);
  const channel = env['CAPTURE_CHANNEL'] ?? 'chrome';
  if (channel !== 'chrome' && channel !== 'chromium')
    throw new Error(`CAPTURE_CHANNEL=${channel} must be chrome or chromium`);
  // XDG_RUNTIME_DIR is a per-user tmpfs, so the X auth key and pid files never
  // reach disk; agent shells do not always export it, hence the fallback.
  const runtimeBase = env['XDG_RUNTIME_DIR'] ?? join(home, '.cache');
  const vncPassFile = resolve(
    env['CAPTURE_VNC_PASSFILE'] ?? join(home, '.vnc', 'usersrole-capture.pass')
  );
  // A passfile inside the tree is one `git add` away from committing the VNC
  // credential, so refuse it outright rather than lean on .gitignore alone.
  if (isInside(vncPassFile, repoRoot())) {
    throw new Error(
      `CAPTURE_VNC_PASSFILE ${vncPassFile} is inside the repository; put it somewhere like ~/.vnc so it cannot be committed`
    );
  }
  return {
    bindIp: tailnetIp(env),
    display: `:${displayNum}`,
    // Taller than the viewport so the whole window, toolbar included, fits on
    // screen for whoever is watching over VNC.
    screen: { width: 1920, height: 1200 },
    viewport: { width: 1920, height: 1080 },
    vncPort: port(env, 'CAPTURE_VNC_PORT', 5900),
    novncPort: port(env, 'CAPTURE_NOVNC_PORT', 6080),
    novncWebRoot: env['CAPTURE_NOVNC_WEB'] ?? '/usr/share/novnc',
    cdpPort: port(env, 'CAPTURE_CDP_PORT', 9222),
    profileDir: resolve(
      env['CAPTURE_PROFILE_DIR'] ??
        join(home, '.cache', 'usersrole-capture-profile')
    ),
    videoDir: resolve(env['CAPTURE_VIDEO_DIR'] ?? join(here, 'videos')),
    screenshotDir: resolve(
      env['CAPTURE_SCREENSHOT_DIR'] ?? join(here, 'screenshots')
    ),
    stateDir: resolve(
      env['CAPTURE_STATE_DIR'] ?? join(runtimeBase, 'usersrole-capture')
    ),
    vncPassFile,
    startUrl:
      env['CAPTURE_START_URL'] ?? 'https://console.firebase.google.com/',
    channel
  };
}
