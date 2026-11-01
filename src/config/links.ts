/**
 * Every external destination on the site lives here. Components import
 * from this module; never hard-code these URLs elsewhere.
 */

export type LinkId = 'meshtastic' | 'meshcore' | 'discord' | 'facebook' | 'reddit';

export interface Destination {
	id: LinkId;
	/** Exact URL as supplied by the community. */
	url: `https://${string}`;
	/** Hostname + path shown as a technical annotation. */
	display: string;
	/** Off-site (third-party) links open in a new tab. Community subsites do not. */
	external: boolean;
}

export const links = {
	meshtastic: {
		id: 'meshtastic',
		url: 'https://meshtastic.prmsh.com/',
		display: 'meshtastic.prmsh.com',
		external: false,
	},
	meshcore: {
		id: 'meshcore',
		url: 'https://meshcore.prmsh.com/',
		display: 'meshcore.prmsh.com',
		external: false,
	},
	discord: {
		id: 'discord',
		url: 'https://discord.gg/3v6rRhNRpD',
		display: 'discord.gg/3v6rRhNRpD',
		external: true,
	},
	facebook: {
		id: 'facebook',
		url: 'https://www.facebook.com/groups/3150733368394141/',
		display: 'facebook.com/groups/3150733368394141',
		external: true,
	},
	reddit: {
		id: 'reddit',
		url: 'https://www.reddit.com/r/MeshtasticPuertoRico/',
		display: 'r/MeshtasticPuertoRico',
		external: true,
	},
} as const satisfies Record<LinkId, Destination>;

/** Attributes for an anchor pointing at a destination. */
export function linkAttrs(id: LinkId) {
	const d: Destination = links[id];
	return d.external
		? { href: d.url, target: '_blank', rel: 'noopener noreferrer' }
		: { href: d.url };
}

export const site = {
	url: 'https://prmsh.com/',
	name: 'PRMSH',
	descriptor: 'Puerto Rico Mesh Network Community',
} as const;
