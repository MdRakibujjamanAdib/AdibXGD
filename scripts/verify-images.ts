import fs from 'fs';
import path from 'path';

let missing = 0;
let checked = 0;

function checkDir(dir: string) {
  const fullDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return;
  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.ts') && !f.startsWith('_') && f !== 'index.ts');

  for (const f of files) {
    const content = fs.readFileSync(path.join(fullDir, f), 'utf-8');
    const matches = content.match(/\/images\/projects\/[a-zA-Z0-9_\-\.\/ %]+/g) || [];

    for (const m of matches) {
      // Decode URI components if any
      const decoded = decodeURIComponent(m);
      const cleanPath = decoded.split(/[?#]/)[0];
      const diskPath = path.join(process.cwd(), 'public', cleanPath);
      checked++;
      if (!fs.existsSync(diskPath)) {
        console.error(`MISSING: ${f} -> ${cleanPath} (disk: ${diskPath})`);
        missing++;
      }
    }
  }
}

checkDir('src/data/projects');
checkDir('src/data/blogs');

console.log(`Verified ${checked} image references.`);
if (missing === 0) {
  console.log('SUCCESS: All image references exist on disk!');
  process.exit(0);
} else {
  console.error(`FAILED: ${missing} missing image references found!`);
  process.exit(1);
}
