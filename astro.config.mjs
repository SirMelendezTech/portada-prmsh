// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://prmsh.com',
	trailingSlash: 'ignore',
	i18n: {
		locales: ['es', 'en'],
		defaultLocale: 'es',
		routing: { prefixDefaultLocale: false },
	},
	integrations: [
		svelte(),
		sitemap({
			i18n: { defaultLocale: 'es', locales: { es: 'es-PR', en: 'en-US' } },
		}),
	],
});
