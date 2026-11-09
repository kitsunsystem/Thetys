// Optimisation des images : génère des déclinaisons AVIF + WebP responsives
// et un manifeste (dimensions, couleur dominante, aperçu flouté).
// Usage : node scripts/optimize-media.mjs [dossier-sources]
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'media/originals'));
const OUT = path.join(ROOT, 'media/img');
const MANIFEST = path.join(ROOT, 'media/images.json');
const WIDTHS = [480, 960, 1440, 2048];
const CONCURRENCY = 4;

const slug = (s) => s.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\.(jpe?g|png|webp|gif)$/i, '')
  .replace(/-scaled$/, '')
  .replace(/-\d{2,5}x\d{2,5}$/, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
let manifest = {};
try { manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
await fs.mkdir(OUT, { recursive: true });

const taken = new Map(Object.entries(manifest).map(([id, m]) => [id, m.source]));
function idFor(file) {
  // fichiers nommés "AAAA__MM__nom.ext" (chemin wp-content/uploads aplati)
  const parts = file.split('__');
  const base = slug(parts[parts.length - 1]);
  const source = file;
  for (const [id, src] of taken) if (src === source) return id;
  let id = base;
  if (taken.has(id)) id = `${base}-${parts.slice(0, -1).join('-')}`;
  taken.set(id, source);
  return id;
}

async function processOne(file) {
  const id = idFor(file);
  const input = path.join(SRC, file);
  const img = sharp(input, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const w = meta.autoOrient?.width || meta.width;
  const h = meta.autoOrient?.height || meta.height;
  const widths = WIDTHS.filter((x) => x < w);
  if (!widths.length || w - widths[widths.length - 1] > 120) widths.push(Math.min(w, 2400));
  const alpha = !!meta.hasAlpha;
  for (const width of widths) {
    const base = path.join(OUT, `${id}-${width}`);
    const resized = sharp(input, { failOn: 'none' }).rotate().resize({ width, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 3 }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 76, alphaQuality: 90 }).toFile(`${base}.webp`);
  }
  const stats = await sharp(input, { failOn: 'none' }).stats();
  const d = stats.dominant;
  const lqipBuf = await sharp(input, { failOn: 'none' }).rotate().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[id] = {
    source: file,
    w, h, alpha,
    widths,
    color: '#' + [d.r, d.g, d.b].map((v) => v.toString(16).padStart(2, '0')).join(''),
    lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
  };
  return id;
}

let i = 0, done = 0;
async function worker() {
  while (i < files.length) {
    const f = files[i++];
    try { await processOne(f); } catch (e) { console.error('échec', f, e.message); }
    if (++done % 20 === 0) console.log(`${done}/${files.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1));
console.log('images :', Object.keys(sorted).length);
