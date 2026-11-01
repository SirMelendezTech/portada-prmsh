import { es, type Dictionary } from './es';

export type Locale = 'es';

const dictionaries: Record<Locale, Dictionary> = { es };

export const defaultLocale: Locale = 'es';

export function useCopy(locale: Locale = defaultLocale): Dictionary {
	return dictionaries[locale];
}
