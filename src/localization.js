import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './locale-codes.js';

const localeModules = {
  'tr': () => import('./locales/tr.js'),
};

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale) => localeModules[locale]?.() || Promise.resolve({}),
});

export const setLocaleFromUrl = async () => {
  const url = new URL(window.location.href);
  const locale = url.searchParams.get('locale') || sourceLocale;
  await setLocale(locale);
};

