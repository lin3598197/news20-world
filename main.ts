// newsrepo20 — the FRIDAY 20 NOVEMBER 2026 one-sheet entry (Node 22, standard library only).
//
// The image this program ships is entry.png beside this file. Before copying it to
// $MAKEFUN_OUTPUT_DIR/entry.png we refuse to ship anything that is not a real PNG,
// not exactly 1024 x 1024, or over the 1 MiB cap — the gate accepts only those.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node --experimental-strip-types main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = new URL('./entry.png', import.meta.url);
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1_048_576;

function check(bytes) {
  if (bytes.length < 24) return 'file is shorter than a PNG header';
  if (!bytes.subarray(0, 8).equals(PNG_SIG)) return 'not a PNG (bad signature)';
  // width and height are big-endian u32 in the IHDR chunk, at offsets 16 and 20
  const w = bytes.readUInt32BE(16);
  const h = bytes.readUInt32BE(20);
  if (w !== 1024 || h !== 1024) return `expected 1024x1024, got ${w}x${h}`;
  if (bytes.length > MAX_BYTES) return `over 1 MiB: ${bytes.length} bytes`;
  return null;
}

const bytes = readFileSync(SRC);
const problem = check(bytes);
if (problem) {
  console.error(`entry.png failed the gate check: ${problem}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, join(OUT_DIR, 'entry.png'));
console.log(`shipped entry.png: 1024x1024, ${bytes.length} bytes -> ${join(OUT_DIR, 'entry.png')}`);
