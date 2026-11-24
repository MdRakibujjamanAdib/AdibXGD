import express from 'express';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.resolve(process.cwd(), 'public')));

const PORT = 3889;

const PROTECTED_ORIGINALS = new Set([
  'mctlabs.png',
  'vray-god-rays.jpg',
  'greend-dashboard.png'
]);

// Recursively find all PNG and JPG images in public/images/projects
function getProjectImages(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getProjectImages(fullPath, baseDir));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        results.push(relative);
      }
    }
  }
  return results;
}

const projectsDir = path.resolve(process.cwd(), 'public/images/projects');
const allImages = getProjectImages(projectsDir);

console.log(`Found ${allImages.length} images to compress in public/images/projects`);

let processed = 0;
let totalOriginalBytes = 0;
let totalWebpBytes = 0;
const conversionMap: Record<string, string> = {};

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><title>Batch WebP Compression</title></head>
<body>
  <h2>Compressing Images to WebP (Quality 0.85, Max 1920px)...</h2>
  <div id="status">Starting...</div>
  <div id="progress"></div>
  <script>
    const images = ${JSON.stringify(allImages)};
    const total = images.length;
    let completed = 0;

    async function compressOne(relPath) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        // Encode URL segments properly
        const parts = relPath.split('/').map(encodeURIComponent);
        img.src = '/images/projects/' + parts.join('/');

        img.onload = async () => {
          try {
            let w = img.naturalWidth;
            let h = img.naturalHeight;
            const maxDim = 1920;
            if (w > maxDim || h > maxDim) {
              const scale = Math.min(maxDim / w, maxDim / h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            const dataUrl = canvas.toDataURL('image/webp', 0.85);

            await fetch('/save-webp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ relPath, dataUrl, width: w, height: h })
            });
            completed++;
            document.getElementById('status').innerText = 'Processed ' + completed + ' / ' + total + ' (' + relPath + ')';
            resolve();
          } catch (err) {
            console.error('Error processing', relPath, err);
            resolve();
          }
        };

        img.onerror = (err) => {
          console.error('Error loading image', relPath, err);
          completed++;
          resolve();
        };
      });
    }

    async function runQueue(concurrency = 4) {
      const queue = [...images];
      const workers = Array.from({ length: concurrency }, async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (item) await compressOne(item);
        }
      });
      await Promise.all(workers);
      document.getElementById('status').innerText = 'All images processed!';
      await fetch('/done', { method: 'POST' });
    }

    runQueue(4);
  </script>
</body>
</html>
  `);
});

app.post('/save-webp', (req, res) => {
  const { relPath, dataUrl, width, height } = req.body;
  if (!relPath || !dataUrl) {
    res.status(400).send('Invalid');
    return;
  }

  const base64Data = dataUrl.replace(/^data:image\/webp;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const oldExt = path.extname(relPath);
  const webpRelPath = relPath.slice(0, -oldExt.length) + '.webp';

  const originalFullPath = path.resolve(projectsDir, relPath);
  const webpFullPath = path.resolve(projectsDir, webpRelPath);

  let origSize = 0;
  if (fs.existsSync(originalFullPath)) {
    origSize = fs.statSync(originalFullPath).size;
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(webpFullPath), { recursive: true });
  fs.writeFileSync(webpFullPath, buffer);

  const newSize = buffer.length;
  totalOriginalBytes += origSize;
  totalWebpBytes += newSize;
  processed++;

  conversionMap[relPath] = webpRelPath;

  const reduction = origSize > 0 ? ((1 - newSize / origSize) * 100).toFixed(1) : 0;
  const origKb = (origSize / 1024).toFixed(1);
  const newKb = (newSize / 1024).toFixed(1);
  console.log(`[${processed}/${allImages.length}] ${relPath} (${origKb}KB) -> ${webpRelPath} (${newKb}KB, -${reduction}%) [${width}x${height}]`);

  // Delete original if not protected and if extension is changing
  const fileName = path.basename(relPath);
  if (!PROTECTED_ORIGINALS.has(fileName) && originalFullPath !== webpFullPath) {
    try {
      fs.unlinkSync(originalFullPath);
    } catch (e) {
      // Ignore
    }
  }

  res.json({ ok: true });
});

app.post('/done', (req, res) => {
  res.json({ ok: true });
  console.log('\n=========================================');
  console.log('BATCH WEBP CONVERSION COMPLETE!');
  console.log(`Images processed: ${processed}`);
  console.log(`Original total: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`New WebP total: ${(totalWebpBytes / (1024 * 1024)).toFixed(2)} MB`);
  const overallReduction = ((1 - totalWebpBytes / totalOriginalBytes) * 100).toFixed(1);
  console.log(`Overall savings: ${overallReduction}% reduction!`);
  console.log('=========================================\n');

  // Update references in src/
  updateCodeReferences(conversionMap);

  setTimeout(() => {
    process.exit(0);
  }, 1500);
});

function updateCodeReferences(map: Record<string, string>) {
  console.log('Updating image references across codebase...');
  const searchDirs = [
    path.resolve(process.cwd(), 'src/data/projects'),
    path.resolve(process.cwd(), 'src/data/blogs')
  ];

  let totalReplacements = 0;

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      for (const [oldRel, newRel] of Object.entries(map)) {
        const oldFile = path.basename(oldRel);
        // Skip updating protected files in blogs
        if (PROTECTED_ORIGINALS.has(oldFile) && dir.includes('blogs')) {
          continue;
        }

        const oldPatterns = [
          `/images/projects/${oldRel}`,
          `/images/projects/${oldRel.replace(/ /g, '%20')}`
        ];

        for (const pattern of oldPatterns) {
          if (content.includes(pattern)) {
            const replacement = `/images/projects/${newRel}`;
            content = content.split(pattern).join(replacement);
            changed = true;
            totalReplacements++;
          }
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated references in: ${file}`);
      }
    }
  }

  console.log(`Finished updating references. Total replacements: ${totalReplacements}`);
}

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `http://localhost:${PORT}`
  ]);

  chrome.on('close', (code) => {
    console.log(`Chrome closed with code ${code}`);
  });
});
