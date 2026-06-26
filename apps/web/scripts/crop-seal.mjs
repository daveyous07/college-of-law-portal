import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const officialPath = join(publicDir, "csu-official-seal.png");
const logoPath = join(publicDir, "csu-logo.png");
const bannerPath = join(publicDir, "csu-banner.png");
const sealPath = join(publicDir, "csu-seal.png");

const OUTPUT = 1024;
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function circleMask(size, inset = 3) {
  const r = size / 2 - inset;
  const c = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${c}" cy="${c}" r="${r}" fill="white"/></svg>`,
  );
}

async function saveSeal(pipeline, source) {
  await pipeline
    .resize(OUTPUT, OUTPUT, { fit: "contain", background: TRANSPARENT, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .composite([{ input: circleMask(OUTPUT, 4), blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(sealPath);

  console.log(`Saved csu-seal.png — ${source}, ${OUTPUT}px`);
}

async function fromOfficialSeal() {
  const trimmed = await sharp(officialPath).trim({ threshold: 12 }).png().toBuffer();
  await saveSeal(sharp(trimmed), "official CSU seal (trimmed)");
}

async function detectSealBounds(imagePath, maxX = 72) {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width;
  let maxXFound = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < Math.min(width, maxX); x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      if (a > 50 && r + g + b > 80) {
        minX = Math.min(minX, x);
        maxXFound = Math.max(maxXFound, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    left: minX,
    top: minY,
    width: maxXFound - minX + 1,
    height: maxY - minY + 1,
  };
}

async function detectBannerSealBounds() {
  const { data, info } = await sharp(bannerPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < 250; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;
      const isStone = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 140 && r < 220;
      const colorful = a > 100 && !isStone && r + g + b > 120 && Math.max(r, g, b) - Math.min(r, g, b) > 25;

      if (colorful) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const size = Math.max(maxX - minX + 1, maxY - minY + 1);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return {
    left: Math.max(0, Math.round(cx - size / 2)),
    top: Math.max(0, Math.round(cy - size / 2)),
    width: size,
    height: size,
  };
}

function squarePad(bounds) {
  const size = Math.max(bounds.width, bounds.height);
  const padTop = Math.max(0, Math.round((size - bounds.height) / 2));
  const padBottom = Math.max(0, size - bounds.height - padTop);
  const padLeft = Math.max(0, Math.round((size - bounds.width) / 2));
  const padRight = Math.max(0, size - bounds.width - padLeft);
  return { size, padTop, padBottom, padLeft, padRight };
}

async function fromBanner() {
  const bounds = await detectBannerSealBounds();
  const { padTop, padBottom, padLeft, padRight } = squarePad(bounds);

  await saveSeal(
    sharp(bannerPath)
      .extract(bounds)
      .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: TRANSPARENT }),
    "banner crop",
  );
}

async function fromHorizontalLogo() {
  const bounds = await detectSealBounds(logoPath);
  const { padTop, padBottom, padLeft, padRight } = squarePad(bounds);

  await saveSeal(
    sharp(logoPath)
      .extract(bounds)
      .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: TRANSPARENT }),
    "horizontal logo strip",
  );
}

async function extractSeal() {
  if (existsSync(officialPath)) {
    await fromOfficialSeal();
    return;
  }

  if (existsSync(bannerPath)) {
    await fromBanner();
    return;
  }

  if (existsSync(logoPath)) {
    await fromHorizontalLogo();
    return;
  }

  console.error("No CSU seal source found — run fetch-csu-assets.mjs first");
  process.exit(1);
}

await extractSeal();
