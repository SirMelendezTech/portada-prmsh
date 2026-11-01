#!/usr/bin/env node
/**
 * Builds the Puerto Rico terrain artwork used in the hero.
 *
 * Source data: AWS Open Data "Terrain Tiles" (Terrarium encoding,
 * https://registry.opendata.aws/terrain-tiles/), which aggregates SRTM,
 * USGS 3DEP/NED and other public DEMs. Tiles are downloaded at zoom 10
 * (~150 m/px at this latitude), stitched, and contoured with d3-contour.
 *
 * Output:
 *   public/terrain/puerto-rico.svg   static terrain (coastline + contours)
 *   src/data/map-frame.json          projection constants shared with the
 *                                    Astro overlay (nodes, graticule, labels)
 *
 * Projection: Web Mercator pixel space, cropped to the bounding box below.
 * Over 0.7° of latitude this is visually indistinguishable from an
 * equal-area projection and keeps every overlay coordinate exact.
 *
 * Run: npm run terrain   (needs network; output is committed)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { contours as d3contours } from 'd3-contour';

const Z = 10;
const TILE = 256;
const WORLD = TILE * 2 ** Z;

// Main island + Vieques + Culebra. Mona/Desecheo are left out to keep
// the composition legible; the frame says so in its caption.
const BBOX = { west: -67.32, east: -65.2, north: 18.56, south: 17.86 };

// Contour levels in metres. 0 m is the coastline.
const LEVELS = [0, 50, 150, 300, 450, 600, 750, 900, 1050, 1200];

const lonToX = (lon) => ((lon + 180) / 360) * WORLD;
const latToY = (lat) => {
	const r = (lat * Math.PI) / 180;
	return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * WORLD;
};

const x0 = lonToX(BBOX.west);
const x1 = lonToX(BBOX.east);
const y0 = latToY(BBOX.north);
const y1 = latToY(BBOX.south);

const tx0 = Math.floor(x0 / TILE);
const tx1 = Math.floor(x1 / TILE);
const ty0 = Math.floor(y0 / TILE);
const ty1 = Math.floor(y1 / TILE);

async function fetchTile(x, y) {
	const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	return PNG.sync.read(Buffer.from(await res.arrayBuffer()));
}

const gridW = (tx1 - tx0 + 1) * TILE;
const gridH = (ty1 - ty0 + 1) * TILE;
const elev = new Float32Array(gridW * gridH);

console.log(`Downloading ${(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} tiles…`);
for (let ty = ty0; ty <= ty1; ty++) {
	for (let tx = tx0; tx <= tx1; tx++) {
		const png = await fetchTile(tx, ty);
		for (let py = 0; py < TILE; py++) {
			for (let px = 0; px < TILE; px++) {
				const i = (py * TILE + px) * 4;
				const h = png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768;
				const gx = (tx - tx0) * TILE + px;
				const gy = (ty - ty0) * TILE + py;
				elev[gy * gridW + gx] = h;
			}
		}
	}
}

// Crop to bbox.
const cx = Math.floor(x0 - tx0 * TILE);
const cy = Math.floor(y0 - ty0 * TILE);
const W = Math.ceil(x1 - x0);
const H = Math.ceil(y1 - y0);
const crop = new Float64Array(W * H);
for (let y = 0; y < H; y++) {
	for (let x = 0; x < W; x++) {
		// Tiny positive bias at sea level removes speckle from bathymetry noise.
		crop[y * W + x] = elev[(y + cy) * gridW + (x + cx)] - 0.5;
	}
}

// Terrarium tiles contain occasional void/spike cells (one reported 2448 m
// near El Yunque; the real summit is ~1065 m). Replace any cell that
// deviates from its 3x3 median by more than 120 m with that median.
function despike(src, w, h) {
	const out = Float64Array.from(src);
	const win = [];
	let fixed = 0;
	for (let y = 1; y < h - 1; y++) {
		for (let x = 1; x < w - 1; x++) {
			win.length = 0;
			for (let dy = -1; dy <= 1; dy++)
				for (let dx = -1; dx <= 1; dx++) win.push(src[(y + dy) * w + x + dx]);
			win.sort((p, q) => p - q);
			const med = win[4];
			if (Math.abs(src[y * w + x] - med) > 120) {
				out[y * w + x] = med;
				fixed++;
			}
		}
	}
	console.log(`despiked ${fixed} cells`);
	return out;
}
const clean = despike(despike(crop, W, H), W, H);

// Light 3x3 box blur so contours read as cartographic lines, not pixel stairs.
function blur(src, w, h) {
	const out = new Float64Array(src.length);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let s = 0;
			let n = 0;
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					const xx = x + dx;
					const yy = y + dy;
					if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
					s += src[yy * w + xx];
					n++;
				}
			}
			out[y * w + x] = s / n;
		}
	}
	return out;
}
const smooth = blur(clean, W, H);
// Interior relief gets two extra passes; the coastline keeps the sharper grid.
const relief = blur(blur(smooth, W, H), W, H);

// Output scale: viewBox units per DEM pixel.
const SCALE = 1;

// Ramer–Douglas–Peucker. Closed rings are split at the vertex farthest
// from the start so the base segment is never degenerate.
function rdp(points, eps) {
	if (points.length < 4) return points;
	let far = 0;
	let farD = -1;
	for (let i = 1; i < points.length - 1; i++) {
		const d = Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]);
		if (d > farD) ((farD = d), (far = i));
	}
	const a = rdpOpen(points.slice(0, far + 1), eps);
	const b = rdpOpen(points.slice(far), eps);
	return a.concat(b.slice(1));
}

function rdpOpen(points, eps) {
	if (points.length < 4) return points;
	const keep = new Uint8Array(points.length);
	keep[0] = keep[points.length - 1] = 1;
	const stack = [[0, points.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop();
		const [ax, ay] = points[a];
		const [bx, by] = points[b];
		const dx = bx - ax;
		const dy = by - ay;
		const len = Math.hypot(dx, dy) || 1;
		let maxD = 0;
		let idx = -1;
		for (let i = a + 1; i < b; i++) {
			const d = Math.abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) / len;
			if (d > maxD) {
				maxD = d;
				idx = i;
			}
		}
		if (maxD > eps && idx > 0) {
			keep[idx] = 1;
			stack.push([a, idx], [idx, b]);
		}
	}
	return points.filter((_, i) => keep[i]);
}

const ringArea = (ring) => {
	let a = 0;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		a += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
	}
	return Math.abs(a / 2);
};

const fmt = (n) => (Math.round(n * 10) / 10).toString();

function toPath(multi, { eps, minArea }) {
	let d = '';
	for (const polygon of multi.coordinates) {
		for (const ring of polygon) {
			if (ringArea(ring) < minArea) continue;
			const pts = rdp(ring, eps);
			if (pts.length < 4) continue;
			d += 'M' + pts.map(([x, y]) => `${fmt(x * SCALE)} ${fmt(y * SCALE)}`).join('L') + 'Z';
		}
	}
	return d;
}

const gen = d3contours().size([W, H]);
const coast = gen.thresholds([0])(Array.from(smooth));
const bands = [coast[0], ...gen.thresholds(LEVELS.slice(1))(Array.from(relief))];

// Hypsometric fills: very restrained steps from surface to elevated surface.
const FILLS = [
	'#151a17', // 0–50 m coastal plains
	'#171e1a',
	'#1a231e',
	'#1d2822',
	'#212d26',
	'#25332b',
	'#2a3930',
	'#2f3f35',
	'#35463b',
	'#3c4e42',
];
const STROKES = [
	'#5d6d61', // coastline
	'#2a332d',
	'#2f3a33',
	'#354139',
	'#3b483f',
	'#425046',
	'#49584d',
	'#506054',
	'#58695c',
	'#617364',
];

let fills = '';
let lines = '';
bands.forEach((band, i) => {
	const d = toPath(band, { eps: i === 0 ? 0.5 : 0.9, minArea: i === 0 ? 14 : 18 });
	if (!d) return;
	fills += `<path d="${d}" fill="${FILLS[i]}"/>`;
	const isIndex = LEVELS[i] % 300 === 0 && LEVELS[i] > 0;
	lines += `<path d="${d}" fill="none" stroke="${STROKES[i]}" stroke-width="${
		i === 0 ? 1.1 : isIndex ? 0.75 : 0.45
	}" stroke-linejoin="round"/>`;
});

const vbW = W * SCALE;
const vbH = H * SCALE;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${vbW}" height="${vbH}"><title>Relieve de Puerto Rico</title><g>${fills}</g><g>${lines}</g></svg>`;

await mkdir(new URL('../public/terrain/', import.meta.url), { recursive: true });
await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/terrain/puerto-rico.svg', import.meta.url), svg);

// Highest point in the crop, as a sanity check on the data.
let maxH = -Infinity;
let maxI = 0;
for (let i = 0; i < clean.length; i++) if (clean[i] > maxH) ((maxH = clean[i]), (maxI = i));
const peakX = maxI % W;
const peakY = Math.floor(maxI / W);

const frame = {
	source: 'AWS Terrain Tiles (Terrarium), zoom 10 — SRTM / USGS 3DEP',
	zoom: Z,
	world: WORLD,
	origin: { x: x0, y: y0 },
	scale: SCALE,
	width: vbW,
	height: vbH,
	bbox: BBOX,
	levels: LEVELS,
	maxElevation: { metres: Math.round(maxH), x: peakX * SCALE, y: peakY * SCALE },
};
await writeFile(
	new URL('../src/data/map-frame.json', import.meta.url),
	JSON.stringify(frame, null, 2) + '\n',
);

// Elevation profile for the "how it works" diagram: Ponce (south coast)
// → Cerro de Punta → Arecibo (north coast), sampled from the despiked DEM.
const PROFILE_STOPS = [
	{ id: 'ponce', name: 'Ponce', lat: 17.985, lon: -66.612 },
	{ id: 'punta', name: 'Cerro de Punta', lat: 18.1717, lon: -66.5917 },
	{ id: 'arecibo', name: 'Arecibo', lat: 18.472, lon: -66.716 },
];
const toPx = ({ lat, lon }) => [lonToX(lon) - x0, latToY(lat) - y0];
const sampleAt = (px, py) => {
	const x = Math.max(0, Math.min(W - 1, Math.round(px)));
	const y = Math.max(0, Math.min(H - 1, Math.round(py)));
	return clean[y * W + x];
};
const haversine = (a, b) => {
	const R = 6371;
	const r = Math.PI / 180;
	const dLat = (b.lat - a.lat) * r;
	const dLon = (b.lon - a.lon) * r;
	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
};
const profile = [];
let dist = 0;
const stops = [];
for (let s = 0; s < PROFILE_STOPS.length - 1; s++) {
	const a = PROFILE_STOPS[s];
	const b = PROFILE_STOPS[s + 1];
	const segKm = haversine(a, b);
	const n = Math.round(segKm * 2); // ~500 m spacing
	const [ax, ay] = toPx(a);
	const [bx, by] = toPx(b);
	if (s === 0) stops.push({ ...a, km: 0 });
	for (let i = s === 0 ? 0 : 1; i <= n; i++) {
		const t = i / n;
		profile.push({
			km: Math.round((dist + segKm * t) * 100) / 100,
			m: Math.max(0, Math.round(sampleAt(ax + (bx - ax) * t, ay + (by - ay) * t))),
		});
	}
	dist += segKm;
	stops.push({ ...b, km: Math.round(dist * 100) / 100 });
}
for (const st of stops) {
	const [px, py] = toPx(st);
	let best = 0;
	for (let dy = -2; dy <= 2; dy++)
		for (let dx = -2; dx <= 2; dx++) best = Math.max(best, sampleAt(px + dx, py + dy));
	st.m = Math.max(0, Math.round(best));
}
await writeFile(
	new URL('../src/data/profile.json', import.meta.url),
	JSON.stringify({ source: frame.source, stops, samples: profile }) + '\n',
);
console.log('profile stops', stops.map((s) => `${s.name} ${s.km} km ${s.m} m`).join(' | '));

console.log(`viewBox ${vbW}×${vbH}, svg ${(svg.length / 1024).toFixed(1)} KB`);
console.log(`highest DEM cell: ${Math.round(maxH)} m at px ${peakX},${peakY}`);
