// Simple hero image conversion to WebP/JPEG using Sharp (ESM)
// Usage: npm run img:hero

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputWebp = path.join(imagesDir, 'zen-hero.webp');
const outputJpg = path.join(imagesDir, 'zen-hero.jpg');

// Candidate input filenames in priority order
const candidates = [
  'zen-hero-source.jpg',
  'zen-hero-source.png',
  'zen-hero.jpg',
  'zen-hero.png',
  'zen-hero-placeholder.svg'
];

function findInput() {
  for (const name of candidates) {
    const p = path.join(imagesDir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function run() {
  try {
    const input = findInput();
    if (!input) {
      console.error('No se encontró ninguna imagen de entrada en', imagesDir);
      process.exit(1);
    }
    console.log('Usando input:', path.basename(input));

    // Convert and resize to a hero-friendly size
    await sharp(input)
      .resize({ width: 1600, height: 900, fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(outputWebp);
    console.log('Generado:', path.basename(outputWebp));

    await sharp(input)
      .resize({ width: 1600, height: 900, fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(outputJpg);
    console.log('Generado:', path.basename(outputJpg));

    console.log('Conversión completada. Puedes apuntar el hero a /images/zen-hero.webp');
  } catch (err) {
    console.error('Error convirtiendo imagen del hero:', err);
    process.exit(1);
  }
}

run();