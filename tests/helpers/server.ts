import { spawn, spawnSync, ChildProcess } from 'child_process';
import http from 'http';

let serverProc: ChildProcess | null = null;
let serverUrl = 'http://localhost:3000';

export function isServerUp(url = serverUrl, timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = http.request(
        {
          hostname: u.hostname,
          port: u.port || 80,
          path: u.pathname || '/',
          method: 'GET',
          timeout: timeoutMs,
        },
        (res) => {
          resolve(Boolean(res.statusCode && res.statusCode < 500));
        }
      );

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

export async function ensureServer(port = 3000, maxWaitMs = 30000): Promise<string> {
  serverUrl = `http://localhost:${port}`;

  const alreadyRunning = await isServerUp(serverUrl, 1000);
  if (alreadyRunning) {
    return serverUrl;
  }

  // Launch Vite server on the specified port
  // Note: On Windows, npx runs via cmd/shell or npx.cmd
  serverProc = spawn('npx.cmd', ['vite', '--port', String(port), '--host', '127.0.0.1', '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'ignore',
  });

  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 400));
    const up = await isServerUp(serverUrl, 800);
    if (up) {
      return serverUrl;
    }
  }

  stopServer();
  throw new Error(`Local dev server failed to start on ${serverUrl} within ${maxWaitMs}ms`);
}

export function stopServer(): void {
  if (serverProc) {
    try {
      if (process.platform === 'win32' && serverProc.pid) {
        // Kill tree on Windows synchronously
        spawnSync('taskkill', ['/pid', String(serverProc.pid), '/f', '/t'], { stdio: 'ignore' });
      } else {
        serverProc.kill('SIGTERM');
      }
    } catch {}
    serverProc = null;
  }
}

// Clean up child process when node process terminates
process.on('exit', () => {
  stopServer();
});
process.on('SIGINT', () => {
  stopServer();
  process.exit(1);
});
