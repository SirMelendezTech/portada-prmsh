/**
 * Site chrome (header, footer, accessibility strings) shared by every page,
 * in each supported language.
 */
const es = {
	lang: 'es-PR',
	ogLocale: 'es_PR',
	homeHref: '/',
	a11y: {
		skip: 'Saltar al contenido',
		newTab: '(abre en una pestaña nueva)',
		menuOpen: 'Abrir menú',
		menuClose: 'Cerrar menú',
		primaryNav: 'Principal',
		footerNav: 'Enlaces de PRMSH',
		home: 'PRMSH, inicio',
	},
	nav: {
		home: 'Inicio',
		meshtastic: 'Meshtastic',
		meshcore: 'MeshCore',
		protocols: 'Comparar',
		community: 'Comunidad',
		discord: 'Únete al Discord',
	},
	footer: {
		description: 'Comunidad de redes mesh LoRa en Puerto Rico.',
		platforms: 'Plataformas',
		community: 'Comunidad',
		guides: 'Guías',
		protocols: 'Meshtastic y MeshCore',
		legal:
			'PRMSH es un portal comunitario independiente. No está afiliado a Meshtastic LLC, al proyecto MeshCore ni a ningún fabricante de hardware. Meshtastic® es una marca registrada de Meshtastic LLC.',
		rights: 'PRMSH',
	},
	switchTo: { label: 'English', lang: 'en', title: 'Read this page in English' },
};

export type Chrome = typeof es;

const en: Chrome = {
	lang: 'en',
	ogLocale: 'en_US',
	homeHref: '/',
	a11y: {
		skip: 'Skip to content',
		newTab: '(opens in a new tab)',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		primaryNav: 'Main',
		footerNav: 'PRMSH links',
		home: 'PRMSH, home (Spanish)',
	},
	nav: {
		home: 'Home',
		meshtastic: 'Meshtastic',
		meshcore: 'MeshCore',
		protocols: 'Compare',
		community: 'Community',
		discord: 'Join the Discord',
	},
	footer: {
		description: 'LoRa mesh networking community in Puerto Rico.',
		platforms: 'Platforms',
		community: 'Community',
		guides: 'Guides',
		protocols: 'Meshtastic and MeshCore',
		legal:
			'PRMSH is an independent community portal. It is not affiliated with Meshtastic LLC, the MeshCore project or any hardware maker. Meshtastic® is a registered trademark of Meshtastic LLC.',
		rights: 'PRMSH',
	},
	switchTo: { label: 'Español', lang: 'es', title: 'Leer esta página en español' },
};

export const chrome = { es, en };
export type Locale = keyof typeof chrome;

/** Paths of pages that exist in both languages. */
export const routes = {
	protocols: { es: '/protocolos/', en: '/en/protocols/' },
} as const;
