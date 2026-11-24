import express from 'express';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.resolve(process.cwd(), 'public')));

const PORT = 3888;

const targets = [
  { video: 'Flour Sack 2D Animation.mp4', out: 'Flour Sack 2D Animation Thumbnail.png', seek: 1.0 },
  { video: 'MY First Motion Graphics in After Effects.mp4', out: 'Underwater Motion Graphics Thumbnail.png', seek: 2.0 },
  { video: 'My First 3D Animation.mp4', out: 'Robotic Arm 3D Animation Thumbnail.png', seek: 1.5 },
  { video: 'Physics Based Animation 1.mp4', out: 'Physics Based Animation Thumbnail.png', seek: 1.5 },
  { video: 'Vray Shoe Animation.mp4', out: 'Vray Shoe Animation Thumbnail.png', seek: 1.5 },
  { video: 'vray DOF video.mp4', out: 'Vray DOF Video Thumbnail.png', seek: 1.0 }
];

let remaining = targets.length;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><title>Extract Frames</title></head>
<body>
<h1>Extracting Frames...</h1>
<div id="status">Starting...</div>
<script>
const targets = ${JSON.stringify(targets)};

async function processTarget(target) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = '/images/projects/' + encodeURIComponent(target.video);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(target.seek, video.duration / 2);
    };

    video.onseeked = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      await fetch('/save-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: target.out, dataUrl })
      });
      resolve();
    };

    video.onerror = (err) => {
      console.error('Error loading video', target.video, err);
      resolve();
    };
  });
}

async function run() {
  for (const t of targets) {
    document.getElementById('status').innerText = 'Processing ' + t.video;
    await processTarget(t);
  }
  document.getElementById('status').innerText = 'Done!';
}
run();
</script>
</body>
</html>
  `);
});

app.post('/save-thumbnail', (req, res) => {
  const { filename, dataUrl } = req.body;
  if (!filename || !dataUrl) {
    res.status(400).send('Invalid');
    return;
  }
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
  const filePath = path.resolve(process.cwd(), 'public/images/projects', filename);
  fs.writeFileSync(filePath, base64Data, 'base64');
  console.log(`Saved thumbnail: ${filename}`);
  remaining--;
  res.json({ ok: true, remaining });

  if (remaining <= 0) {
    console.log('All thumbnails extracted successfully!');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  // Launch Chrome headless
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
