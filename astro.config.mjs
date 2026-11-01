// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://prmsh.com',
	trailingSlash: 'ignore',
	integrations: [
		svelte(),
		sitemap({
			i18n: { defaultLocale: 'es', locales: { es: 'es-PR' } },
		}),
	],
});
