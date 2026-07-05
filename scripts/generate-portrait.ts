/**
 * Samples the source photo into particle target positions for the Act III
 * portrait formation. Particles map to LIGHT (luminance): the face glows,
 * dark features (sunglasses, hair) read as negative space, with a faint
 * ghost-fill giving the hair mass some form.
 *
 * Outputs src/content/portrait.json ([x, y, z, shade] per point, world
 * units, centered) and dot/crop previews in assets-src for visual tuning.
 *
 * Run: bun scripts/generate-portrait.ts
 */
import sharp from "sharp";

const SRC = "assets-src/portfolio-picture.JPG";
const OUT_JSON = "src/content/portrait.json";

// Crop window as fractions of the (EXIF-rotated) source image.
const CROP = { left: 0.42, top: 0.26, width: 0.24, height: 0.2 };

const GRID_W = 150;
const LIT_POINTS = 3000;
const GHOST_POINTS = 500;
const WORLD_HEIGHT = 3.2;

const rotated = await sharp(SRC).rotate().toBuffer();
const meta = await sharp(rotated).metadata();
const W = meta.width!;
const H = meta.height!;

const region = {
  left: Math.round(CROP.left * W),
  top: Math.round(CROP.top * H),
  width: Math.round(CROP.width * W),
  height: Math.round(CROP.height * H),
};

await sharp(rotated)
  .extract(region)
  .resize(420)
  .png()
  .toFile("assets-src/portrait-crop-preview.png");

const gridH = Math.round((GRID_W * region.height) / region.width);
const { data } = await sharp(rotated)
  .extract(region)
  .resize(GRID_W, gridH, { fit: "fill" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

interface Sample {
  x: number;
  y: number;
  shade: number;
}

const lit: Sample[] = [];
const ghost: Sample[] = [];
for (let y = 0; y < gridH; y++) {
  for (let x = 0; x < GRID_W; x++) {
    const i = (y * GRID_W + x) * 3;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isSky = b > r + 30 && b > g + 15;
    if (isSky) continue;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const isGrayCloth = Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && lum > 140;
    if (isGrayCloth) continue;
    const bright = lum / 255;
    if (bright >= 0.25) {
      lit.push({ x, y, shade: bright });
    } else {
      ghost.push({ x, y, shade: 0.16 });
    }
  }
}

function weightedPick(pool: Sample[], n: number, gamma: number): Sample[] {
  return pool
    .map((c) => ({ c, key: Math.random() ** (1 / Math.pow(c.shade, gamma)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, n)
    .map((w) => w.c);
}

const picked = [
  ...weightedPick(lit, LIT_POINTS, 2.2),
  ...weightedPick(ghost, GHOST_POINTS, 1),
];

const aspect = GRID_W / gridH;
const points: number[] = [];
for (const c of picked) {
  const jx = (Math.random() - 0.5) / GRID_W;
  const jy = (Math.random() - 0.5) / gridH;
  const xw = (c.x / GRID_W - 0.5 + jx) * WORLD_HEIGHT * aspect;
  const yw = (0.5 - c.y / gridH + jy) * WORLD_HEIGHT;
  const zw = (Math.random() - 0.5) * 0.25;
  const shade = c.shade >= 0.25 ? 0.2 + 0.8 * Math.pow(c.shade, 1.5) : c.shade;
  points.push(
    Math.round(xw * 1000) / 1000,
    Math.round(yw * 1000) / 1000,
    Math.round(zw * 1000) / 1000,
    Math.round(shade * 1000) / 1000
  );
}

await Bun.write(OUT_JSON, JSON.stringify({ points }));

// Dot preview for eyeballing the likeness.
const PS = 420;
const PH = Math.round(PS / aspect);
let circles = "";
for (let i = 0; i < points.length; i += 4) {
  const x = PS / 2 + (points[i] / (WORLD_HEIGHT * aspect)) * PS;
  const y = PH / 2 - (points[i + 1] / WORLD_HEIGHT) * PH;
  circles += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="rgb(52,211,153)" fill-opacity="${(0.2 + 0.8 * points[i + 3]).toFixed(2)}"/>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PS}" height="${PH}"><rect width="100%" height="100%" fill="#050d0a"/>${circles}</svg>`;
await sharp(Buffer.from(svg)).png().toFile("assets-src/portrait-dots-preview.png");

console.log(
  `source ${W}x${H} | crop ${region.width}x${region.height} | grid ${GRID_W}x${gridH}`
);
console.log(
  `lit ${lit.length} ghost ${ghost.length} | sampled ${points.length / 4} -> ${OUT_JSON}`
);
