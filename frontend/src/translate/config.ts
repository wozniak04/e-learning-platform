import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './pl.json';
import en from './en.json';

const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        return savedLanguage;
    }
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'pl' || browserLang === 'en') ? browserLang : 'pl';
};

export const resources = {
    pl: { translation: pl },
    en: { translation: en },
} as const;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: 'pl',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: typeof resources['pl'];
    }
}