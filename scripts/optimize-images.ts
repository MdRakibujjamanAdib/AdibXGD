import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_IMAGES_DIR = path.resolve(process.cwd(), 'public/images');

// Calculate directory size
const getDirSize = (dirPath: string): number => {
    let size = 0;
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            size += getDirSize(filePath);
        } else {
            size += stats.size;
        }
    }
    return size;
};

// Recursively find all images
const findImages = (dirPath: string, fileList: string[] = []): string[] => {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            findImages(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
};

// Format bytes to MB/KB
const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
};

async function optimizeImages() {
    console.log('🖼️  Starting image optimization...');

    if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        console.warn(`⚠️ Directory not found: ${PUBLIC_IMAGES_DIR}`);
        return;
    }

    const initialSize = getDirSize(PUBLIC_IMAGES_DIR);
    console.log(`📊 Initial size: ${formatSize(initialSize)}`);

    const images = findImages(PUBLIC_IMAGES_DIR);
    console.log(`🔍 Found ${images.length} images to optimize.\n`);

    let optimizedCount = 0;
    let savedTotal = 0;

    for (const imagePath of images) {
        try {
            const tempPath = `${imagePath}.tmp`;
            const stats = fs.statSync(imagePath);
            const initialFileSize = stats.size;
            const ext = path.extname(imagePath).toLowerCase();

            let pipeline = sharp(imagePath);

            // Apply near-lossless compression settings based on format
            if (ext === '.jpg' || ext === '.jpeg') {
                pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
            } else if (ext === '.png') {
                pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
            } else if (ext === '.webp') {
                pipeline = pipeline.webp({ quality: 80 });
            }

            await pipeline.toFile(tempPath);

            const newStats = fs.statSync(tempPath);
            const newFileSize = newStats.size;

            // Only keep the optimized image if it's actually smaller
            if (newFileSize < initialFileSize) {
                fs.renameSync(tempPath, imagePath);
                const saved = initialFileSize - newFileSize;
                savedTotal += saved;
                optimizedCount++;
            } else {
                // If it's larger (which happens with already highly compressed images), discard the temp file
                fs.unlinkSync(tempPath);
            }
        } catch (error) {
            console.error(`❌ Error optimizing ${path.basename(imagePath)}:`, error);
        }
    }

    console.log('\n✅ Optimization complete!');
    console.log(`📈 Optimized ${optimizedCount} out of ${images.length} images.`);

    if (savedTotal > 0) {
        const finalSize = getDirSize(PUBLIC_IMAGES_DIR);
        console.log(`💾 Saved ${formatSize(savedTotal)}!`);
        console.log(`📊 Final size: ${formatSize(finalSize)}\n`);
    } else {
        console.log(`✅ Images were already fully optimized!\n`);
    }
}

optimizeImages();
