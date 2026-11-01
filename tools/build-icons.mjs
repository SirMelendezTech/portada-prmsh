#!/usr/bin/env node
// Rasterises public/favicon.svg into apple-touch-icon.png and favicon.ico (PNG-in-ICO).
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
await sharp(svg, { density: 1200 })
	.resize(180, 180)
	.flatten({ background: '#0B0D0C' })
	.png()
	.toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname);

const png32 = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, png32]));
console.log('icons written');
