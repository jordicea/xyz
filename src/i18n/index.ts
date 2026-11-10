import en from './en.json';
import es from './es.json';
import ca from './ca.json';

export type Lang = 'en' | 'es' | 'ca';
export const langs: Lang[] = ['en', 'es', 'ca'];
export const names: Record<Lang, { long: string; short: string; locale: string }> = {
  en: { long: 'English', short: 'EN', locale: 'en_US' },
  es: { long: 'Castellano', short: 'ES', locale: 'es_ES' },
  ca: { long: 'Català', short: 'CAT', locale: 'ca_ES' },
};
const dict: Record<Lang, Record<string, any>> = { en, es, ca };
export const getT = (lang: Lang): Record<string, any> => dict[lang];
