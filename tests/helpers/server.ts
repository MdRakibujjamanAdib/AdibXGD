import { spawn, spawnSync, ChildProcess } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

let serverProc: ChildProcess | null = null;
let serverUrl = 'http://localhost:3000';

let distHttpServer: http.Server | null = null;
let distServerUrl = 'http://localhost:4173';

const ADIBX_MARKERS = [
  'Md Rakibujjaman Adib',
  'adibx.me',
  'vb-hero',
  'ADIB X ME',
];

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

interface VercelHeaderRule {
  source: string;
  headers: Array<{ key: string; value: string }>;
}

function loadVercelHeaderRules(rootDir: string): Array<{ regex: RegExp; headers: Array<{ key: string; value: string }> }> {
  try {
    const vercelPath = path.join(rootDir, 'vercel.json');
    if (!fs.existsSync(vercelPath)) return [];
    const parsed = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    if (!Array.isArray(parsed?.headers)) return [];
    return parsed.headers
      .filter((r: VercelHeaderRule) => r?.source && Array.isArray(r?.headers))
      .map((r: VercelHeaderRule) => ({
        regex: new RegExp(`^${r.source}$`),
        headers: r.headers,
      }));
  } catch {
    return [];
  }
}

interface ProbeResult {
  up: boolean;
  statusCode?: number;
  body: string;
  isAdibx: boolean;
}

function probeServer(url: string, timeoutMs = 1500): Promise<ProbeResult> {
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
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            if (body.length < 65536) {
              body += chunk;
            }
          });
          res.on('end', () => {
            const up = Boolean(res.statusCode && res.statusCode < 500);
            const isAdibx = up && ADIBX_MARKERS.some((marker) => body.includes(marker));
            resolve({ up, statusCode: res.statusCode, body, isAdibx });
          });
        }
      );

      req.on('error', () => resolve({ up: false, body: '', isAdibx: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ up: false, body: '', isAdibx: false });
      });
      req.end();
    } catch {
      resolve({ up: false, body: '', isAdibx: false });
    }
  });
}

export async function isServerUp(url = serverUrl, timeoutMs = 1500): Promise<boolean> {
  const probe = await probeServer(url, timeoutMs);
  return probe.up;
}

export async function isAdibxServer(url = serverUrl, timeoutMs = 1500): Promise<boolean> {
  const probe = await probeServer(url, timeoutMs);
  return probe.isAdibx;
}

export async function ensureServer(port = 3000, maxWaitMs = 30000): Promise<string> {
  serverUrl = `http://localhost:${port}`;

  const existing = await probeServer(serverUrl, 1200);
  if (existing.up) {
    if (!existing.isAdibx) {
      throw new Error(
        `Port ${port} is already occupied by a non-ADIBX.ME process (status ${existing.statusCode}). Refusing to hijack.`
      );
    }
    return serverUrl;
  }

  // Launch Vite dev server on the specified port
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  serverProc = spawn(cmd, ['vite', '--port', String(port), '--host', '127.0.0.1', '--strictPort'], {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    stdio: 'ignore',
  });

  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 400));
    const probe = await probeServer(serverUrl, 1000);
    if (probe.isAdibx) {
      return serverUrl;
    }
  }

  stopServer();
  throw new Error(`Local dev server failed to start on ${serverUrl} within ${maxWaitMs}ms`);
}

function resolveStaticFile(distDir: string, urlPathname: string): { filePath: string | null; is404: boolean } {
  let decodedPath = '/';
  try {
    decodedPath = decodeURIComponent(urlPathname || '/');
  } catch {
    return { filePath: null, is404: true };
  }

  const normalized = path.posix.normalize(decodedPath);
  if (normalized.includes('..')) {
    return { filePath: null, is404: true };
  }

  const relPath = normalized.replace(/^\/+/, '');
  const isFile = (p: string): boolean => {
    try {
      return fs.existsSync(p) && fs.statSync(p).isFile();
    } catch {
      return false;
    }
  };

  if (!relPath) {
    const indexPath = path.join(distDir, 'index.html');
    return isFile(indexPath) ? { filePath: indexPath, is404: false } : { filePath: null, is404: true };
  }

  // 1. Exact static file match
  const exactPath = path.join(distDir, relPath);
  if (isFile(exactPath)) {
    return { filePath: exactPath, is404: false };
  }

  // 2. Clean URL .html match (e.g., /about -> dist/about.html)
  const cleanRel = relPath.replace(/\/+$/, '');
  const htmlPath = path.join(distDir, `${cleanRel}.html`);
  if (isFile(htmlPath)) {
    return { filePath: htmlPath, is404: false };
  }

  // 3. Directory index.html match (e.g., /about/ -> dist/about/index.html)
  const dirIndexPath = path.join(distDir, cleanRel, 'index.html');
  if (isFile(dirIndexPath)) {
    return { filePath: dirIndexPath, is404: false };
  }

  return { filePath: null, is404: true };
}

export async function ensureDistServer(port = 4173, maxWaitMs = 15000): Promise<string> {
  distServerUrl = `http://localhost:${port}`;
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
    throw new Error(`Static build directory not found at ${distDir}. Run 'npm run build' first.`);
  }

  const existing = await probeServer(distServerUrl, 1000);
  if (existing.up) {
    if (!existing.isAdibx) {
      throw new Error(
        `Port ${port} is already occupied by a non-ADIBX.ME process (status ${existing.statusCode}). Refusing to hijack.`
      );
    }
    return distServerUrl;
  }

  const headerRules = loadVercelHeaderRules(process.cwd());
  const notFoundPath = path.join(distDir, '404.html');

  distHttpServer = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url || '/', distServerUrl);
    const pathname = parsedUrl.pathname;

    // Apply matching vercel.json headers
    for (const rule of headerRules) {
      if (rule.regex.test(pathname)) {
        for (const h of rule.headers) {
          res.setHeader(h.key, h.value);
        }
      }
    }

    const { filePath, is404 } = resolveStaticFile(distDir, pathname);

    if (is404 || !filePath) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      if (fs.existsSync(notFoundPath)) {
        res.end(fs.readFileSync(notFoundPath));
      } else {
        res.end('<!doctype html><html><body><h1>404 Not Found</h1></body></html>');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Static dist server timed out starting on port ${port}`)), maxWaitMs);
    distHttpServer!.once('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    distHttpServer!.listen(port, () => {
      clearTimeout(timer);
      resolve();
    });
  });

  const probe = await probeServer(distServerUrl, 2000);
  if (!probe.isAdibx) {
    stopDistServer();
    throw new Error(`Static dist server on ${distServerUrl} did not serve valid ADIBX.ME HTML`);
  }

  return distServerUrl;
}

export function stopDistServer(): void {
  if (distHttpServer) {
    try {
      distHttpServer.close();
    } catch {}
    distHttpServer = null;
  }
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

// Clean up child process and static server when node process terminates
process.on('exit', () => {
  stopServer();
  stopDistServer();
});
process.on('SIGINT', () => {
  stopServer();
  stopDistServer();
  process.exit(1);
});
