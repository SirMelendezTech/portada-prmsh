import type { LatLon } from '../lib/map';

/**
 * ILLUSTRATIVE network for the hero map. Locations are real places
 * (verified coordinates) chosen to explain multihop routing across the
 * Cordillera Central. They are NOT a record of deployed nodes, measured
 * coverage or working links, and the map says so in its legend.
 */
export interface MapNode extends LatLon {
	id: string;
	label: string;
	/** Label placement relative to the point. */
	anchor: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
	/** Hide label below the tablet breakpoint to avoid crowding. */
	minor?: boolean;
}

export const nodes: MapNode[] = [
	{ id: 'mayaguez', label: 'Mayagüez', lat: 18.2013, lon: -67.1397, anchor: 'w' },
	{ id: 'guilarte', label: 'Monte Guilarte', lat: 18.1453, lon: -66.7633, anchor: 's' },
	{ id: 'punta', label: 'Cerro de Punta', lat: 18.1717, lon: -66.5917, anchor: 'n' },
	{ id: 'ponce', label: 'Ponce', lat: 18.0111, lon: -66.6141, anchor: 's', minor: true },
	{ id: 'cayey', label: 'Cayey', lat: 18.1119, lon: -66.166, anchor: 's' },
	{ id: 'yunque', label: 'El Yunque', lat: 18.3106, lon: -65.7914, anchor: 'n', minor: true },
	{ id: 'sanjuan', label: 'San Juan', lat: 18.4655, lon: -66.1057, anchor: 'n' },
];

/** Hops of the animated example route, in order. */
export const route: [string, string][] = [
	['mayaguez', 'guilarte'],
	['guilarte', 'punta'],
	['punta', 'cayey'],
	['cayey', 'sanjuan'],
];

/** Additional illustrative links drawn statically. */
export const branches: [string, string][] = [
	['ponce', 'punta'],
	['cayey', 'yunque'],
];
