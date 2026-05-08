/**
 * Background removal script — flood-fill from corners + threshold.
 * Removes near-white/light-gray backgrounds and saves transparent PNGs.
 * Usage: node scripts/remove-bg.mjs
 */
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, extname, basename } from "path";

const BRANDS_DIR = "./public/brands";
const OUT_DIR = "./public/brands";
const THRESHOLD = 215; // pixels brighter than this (all channels) are treated as bg
const EDGE_SOFTNESS = 30; // feather edge pixels (partial transparency)

async function processImage(inputPath, outputPath) {
  const raw = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = raw;
  const { width, height } = info;
  const channels = 4; // RGBA after ensureAlpha

  /* ── flood-fill from all 4 corners to mark background ── */
  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);

  function idx(x, y) { return (y * width + x) * channels; }
  function pixelIdx(x, y) { return y * width + x; }

  function isBgColor(x, y) {
    const i = idx(x, y);
    return data[i] > THRESHOLD && data[i + 1] > THRESHOLD && data[i + 2] > THRESHOLD;
  }

  // BFS flood fill
  const queue = [];
  const corners = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
    // also seed from edges for better coverage
    [Math.floor(width / 2), 0], [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)], [Math.floor(width / 2), height - 1],
  ];

  for (const [sx, sy] of corners) {
    if (!visited[pixelIdx(sx, sy)] && isBgColor(sx, sy)) {
      queue.push([sx, sy]);
      visited[pixelIdx(sx, sy)] = 1;
    }
  }

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    isBackground[pixelIdx(cx, cy)] = 1;

    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = pixelIdx(nx, ny);
      if (visited[ni]) continue;
      visited[ni] = 1;
      if (isBgColor(nx, ny)) {
        queue.push([nx, ny]);
      }
    }
  }

  /* ── apply transparency with edge feathering ── */
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = pixelIdx(x, y);
      if (!isBackground[pi]) continue;

      const i = idx(x, y);
      const r = data[i], g = data[i + 1], b = data[i + 2];

      // Softness: pixels that are bright but near a non-bg pixel get partial alpha
      const brightness = (r + g + b) / 3;
      const t = Math.max(0, Math.min(1, (brightness - THRESHOLD) / EDGE_SOFTNESS));
      data[i + 3] = Math.floor(t * 0); // fully transparent for bg
    }
  }

  await sharp(Buffer.from(data), {
    raw: { width, height, channels },
  })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`✓ ${outputPath}`);
}

const files = await readdir(BRANDS_DIR);
const images = files.filter(
  (f) => /\.(jpg|jpeg|png)$/i.test(f) && !f.endsWith("-nobg.png")
);

for (const file of images) {
  const name = basename(file, extname(file));
  const input = join(BRANDS_DIR, file);
  const output = join(OUT_DIR, `${name}-nobg.png`);
  try {
    await processImage(input, output);
  } catch (e) {
    console.error(`✗ ${file}:`, e.message);
  }
}

console.log("\nDone! Transparent PNGs saved to public/brands/");
