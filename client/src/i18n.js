import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English
import enTranslation from './locales/en/translation.json';
import enLegal from './locales/en/legal.json';

// French
import frTranslation from './locales/fr/translation.json';
import frLegal from './locales/fr/legal.json';

// German
import deTranslation from './locales/de/translation.json';
import deLegal from './locales/de/legal.json';

// Italian
import itTranslation from './locales/it/translation.json';
import itLegal from './locales/it/legal.json';

// Dutch
import nlTranslation from './locales/nl/translation.json';
import nlLegal from './locales/nl/legal.json';

export const supportedLanguages = ['en', 'fr', 'de', 'it', 'nl'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation, legal: enLegal },
      fr: { translation: frTranslation, legal: frLegal },
      de: { translation: deTranslation, legal: deLegal },
      it: { translation: itTranslation, legal: itLegal },
      nl: { translation: nlTranslation, legal: nlLegal },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    ns: ['translation', 'legal'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
