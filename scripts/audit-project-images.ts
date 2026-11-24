import fs from 'fs';
import path from 'path';

const projectsDir = path.join(process.cwd(), 'src/data/projects');
const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));

console.log('--- PROJECT IMAGE BREAKDOWN AUDIT ---');
let totalUnused = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(projectsDir, file), 'utf8');
  // extract images array
  const imgMatch = content.match(/images:\s*\[([\s\S]*?)\]/);
  if (!imgMatch) continue;
  const imgs = Array.from(new Set(imgMatch[1].match(/\/images\/[^\s,'"]+/g) || []));

  // extract description
  const descMatch = content.match(/description:\s*([\s\S]*?),\s*(?:thumbnail|demoUrl|repoUrl|tags)/);
  const desc = descMatch ? descMatch[1] : '';

  const unused = imgs.filter((img) => !desc.includes(img));
  if (unused.length > 0) {
    totalUnused += unused.length;
    console.log(`\n${file}: ${unused.length} / ${imgs.length} images not in description`);
    unused.forEach((u) => console.log(`   - ${u}`));
  }
}

console.log(`\nTotal unused images in project descriptions: ${totalUnused}`);

console.log('\n--- BLOG IMAGE AUDIT ---');
const blogsDir = path.join(process.cwd(), 'src/data/blogs');
const blogFiles = fs.readdirSync(blogsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
for (const file of blogFiles) {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
  const coverMatch = content.match(/coverImage:\s*['"]([^'"]+)['"]/);
  const descMatch = content.match(/content:\s*([\s\S]*?)(?:,\s*tags|\s*};)/);
  const cover = coverMatch ? coverMatch[1] : '';
  const desc = descMatch ? descMatch[1] : '';
  const imgsInDesc = desc.match(/\/images\/[^\s,'"]+/g) || [];
  console.log(`${file}: cover=${cover}, embedded_imgs=${imgsInDesc.length}`);
}
