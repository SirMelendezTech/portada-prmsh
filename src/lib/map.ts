import frame from '../data/map-frame.json';

/**
 * Projects lat/lon into the terrain SVG's viewBox using the same Web
 * Mercator frame `tools/build-terrain.mjs` used to draw the coastline,
 * so overlay points land exactly on the generated relief.
 */
export interface LatLon {
	lat: number;
	lon: number;
}

export const MAP_W = frame.width;
export const MAP_H = frame.height;

export function project({ lat, lon }: LatLon): { x: number; y: number } {
	const x = ((lon + 180) / 360) * frame.world - frame.origin.x;
	const r = (lat * Math.PI) / 180;
	const y =
		((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * frame.world - frame.origin.y;
	return { x: x * frame.scale, y: y * frame.scale };
}

/** Position as CSS percentages of the map frame (for HTML labels). */
export function percent(p: LatLon): { left: string; top: string } {
	const { x, y } = project(p);
	return {
		left: `${((x / MAP_W) * 100).toFixed(3)}%`,
		top: `${((y / MAP_H) * 100).toFixed(3)}%`,
	};
}

export const bbox = frame.bbox;

/** 66.5 → "66°30′" */
export function dms(value: number): string {
	const abs = Math.abs(value);
	const d = Math.floor(abs);
	const m = Math.round((abs - d) * 60);
	return m ? `${d}°${String(m).padStart(2, '0')}′` : `${d}°`;
}
