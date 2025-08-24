import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar as traduções
import ptTranslation from '../locales/pt/translation.json';
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';

const resources = {
  pt: {
    translation: ptTranslation,
  },
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

i18n
  // Detecta o idioma do usuário
  .use(LanguageDetector)
  // Passa a instância i18n para react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources,
    fallbackLng: 'pt', // Idioma padrão
    debug: false, // Ativar para debug em desenvolvimento

    // Opções de detecção de idioma
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React já faz escape por padrão
    },

    // Configurações adicionais
    react: {
      useSuspense: false,
    },
  });

export default i18n;