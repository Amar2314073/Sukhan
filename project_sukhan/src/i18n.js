import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        poets: "Poets",
        poems: "Poems",
        collections: "Collections",
        dictionary: "Dictionary"
      }
    },
    hi: {
      translation: {
        home: "होम",
        poets: "शायर",
        poems: "कविताएँ",
        collections: "संग्रह",
        dictionary: "शब्दकोश"
      }
    },
    ur: {
      translation: {
        home: "ہوم",
        poets: "شاعر",
        poems: "نظمیں",
        collections: "مجموعے",
        dictionary: "لغت"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
