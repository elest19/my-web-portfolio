// Derives the favicon set from a portrait photo by cropping a square,
// resampling it, and applying a rounded-plate mask.
//
// Usage:
//   node tools/profile-favicon.mjs preview        -> contact sheet of crops
//   node tools/profile-favicon.mjs build [cropY]  -> write icons (cropY in 0..1)
//
// cropY is the vertical centre of the square crop as a fraction of the source
// height. 0.5 is the middle; lower values favour the face.
import { inflateSync, deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = resolve(import.meta.dirname, "../client/public/Portfolio-Profile.png");
const OUT_DIR = resolve(import.meta.dirname, "../client/public");

/* ---------------- PNG decode (8-bit RGBA, non-interlaced) ---------------- */

function readChunks(buf) {
  const chunks = [];
  let i = 8;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString("ascii", i + 4, i + 8);
    chunks.push({ type, data: buf.subarray(i + 8, i + 8 + len) });
    i += 12 + len;
    if (type === "IEND") break;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function decodePng(path) {
  const chunks = readChunks(readFileSync(path));
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];
  if (depth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(`unsupported PNG: depth=${depth} colorType=${colorType} interlace=${interlace}`);
  }

  const bpp = 4;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)));
  const out = Buffer.alloc(height * stride);

  // Undo the per-scanline filters in place.
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      cur[x] = v & 0xff;
    }
  }
  return { width, height, data: out };
}

/* ---------------- PNG encode ---------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------------- sampling ---------------- */

const img = decodePng(SRC);
console.log(`source ${img.width}x${img.height}`);

/**
 * Fit the ENTIRE source image inside a square plate, centred, without cropping
 * anything. Because the photo is portrait (3294x4392) the fitted result is
 * narrower than the plate, so the leftover bars are filled with the site's ink
 * colour rather than black, keeping the icon consistent with the design.
 *
 * Each output cell is area-averaged over the full source footprint rather than
 * point-sampled, which prevents the high-frequency speckle you get from
 * undersampling a portrait at 32px. Averaging is done in premultiplied alpha so
 * soft edges stay clean.
 */
function fitSquare(size, radiusFrac = 0.22) {
  const out = Buffer.alloc(size * size * 4);
  const r = radiusFrac * size;

  // "Contain" fit: the whole image is scaled to fit inside the plate.
  const scale = Math.min(size / img.width, size / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const offX = (size - drawW) / 2;
  const offY = (size - drawH) / 2;

  // Source footprint of one output pixel.
  const stepX = img.width / drawW;
  const stepY = img.height / drawH;
  const nX = Math.max(1, Math.min(6, Math.ceil(stepX / 2)));
  const nY = Math.max(1, Math.min(6, Math.ceil(stepY / 2)));
  const weight = 1 / (nX * nY);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let cr;
      let cg;
      let cb;
      let ca;

      // Outside the fitted image: pad with the site ink colour.
      if (px < offX || px >= offX + drawW || py < offY || py >= offY + drawH) {
        cr = 0x10;
        cg = 0x12;
        cb = 0x10;
        ca = 1;
      } else {
        const fx = px - offX;
        const fy = py - offY;
        const x0 = Math.floor(fx * stepX);
        const y0 = Math.floor(fy * stepY);

        let sr = 0, sg = 0, sb = 0, sa = 0;
        for (let j = 0; j < nY; j++) {
          const sy = Math.min(img.height - 1, Math.max(0, y0 + Math.floor(((j + 0.5) * stepY) / nY)));
          for (let i = 0; i < nX; i++) {
            const sx = Math.min(img.width - 1, Math.max(0, x0 + Math.floor(((i + 0.5) * stepX) / nX)));
            const k = (sy * img.width + sx) * 4;
            const al = img.data[k + 3] / 255;
            sr += img.data[k] * al;
            sg += img.data[k + 1] * al;
            sb += img.data[k + 2] * al;
            sa += al;
          }
        }
        sa *= weight;
        if (sa > 0) {
          cr = Math.round((sr * weight) / sa);
          cg = Math.round((sg * weight) / sa);
          cb = Math.round((sb * weight) / sa);
        } else {
          cr = cg = cb = 0;
        }
        ca = sa;
      }

      // Rounded-rect coverage, 1px feather.
      const qx = Math.abs(px + 0.5 - size / 2) - (size / 2 - r);
      const qy = Math.abs(py + 0.5 - size / 2) - (size / 2 - r);
      const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
      const mask = Math.min(1, Math.max(0, 0.5 - d));

      const i = (py * size + px) * 4;
      out[i] = cr;
      out[i + 1] = cg;
      out[i + 2] = cb;
      out[i + 3] = Math.round(ca * mask * 255);
    }
  }
  return out;
}

/* ---------------- entry point ---------------- */

const mode = process.argv[2] ?? "build";

if (mode === "preview") {
  // Each real icon rendered at its actual pixel size, then centred on a
  // checkerboard so the padding bars, corners, and small-size legibility are
  // all visible at a glance.
  const sizes = [32, 180, 192, 512];
  const cell = 512;
  const gap = 24;
  const width = sizes.length * cell + (sizes.length - 1) * gap;
  const sheet = Buffer.alloc(width * cell * 4);

  for (let y = 0; y < cell; y++) {
    for (let x = 0; x < width; x++) {
      const shade = ((x >> 4) + (y >> 4)) % 2 ? 210 : 160;
      const i = (y * width + x) * 4;
      sheet[i] = shade;
      sheet[i + 1] = shade;
      sheet[i + 2] = shade;
      sheet[i + 3] = 255;
    }
  }

  sizes.forEach((size, idx) => {
    const tile = fitSquare(size);
    const offX = idx * (cell + gap) + Math.floor((cell - size) / 2);
    const offY = Math.floor((cell - size) / 2);
    for (let y = 0; y < size; y++) {
      const dst = ((y + offY) * width + offX) * 4;
      const src = y * size * 4;
      // Straight copy would ignore the plate's rounded alpha, so blend over
      // the checker using the icon's own alpha.
      for (let x = 0; x < size; x++) {
        const s = src + x * 4;
        const d = dst + x * 4;
        const a = tile[s + 3] / 255;
        sheet[d] = Math.round(tile[s] * a + sheet[d] * (1 - a));
        sheet[d + 1] = Math.round(tile[s + 1] * a + sheet[d + 1] * (1 - a));
        sheet[d + 2] = Math.round(tile[s + 2] * a + sheet[d + 2] * (1 - a));
      }
    }
  });

  const out = resolve(import.meta.dirname, "fit-preview.png");
  writeFileSync(out, encodePng(width, cell, sheet));
  console.log(`sizes ${sizes.join(", ")} -> ${out}`);
} else {
  for (const [name, size] of [
    ["favicon-32x32.png", 32],
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
  ]) {
    writeFileSync(resolve(OUT_DIR, name), encodePng(size, size, fitSquare(size)));
    console.log(`wrote ${name} (${size}x${size}, full image fit)`);
  }
}