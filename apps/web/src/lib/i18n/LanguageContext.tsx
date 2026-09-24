'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationSchema } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    // Read from localStorage on client mount
    try {
      const stored = localStorage.getItem('mediscan_lang') as Language;
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'gu')) {
        setLangState(stored);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
        }
      }
    } catch {
      // Storage access disabled or unavailable
    }

    const handleLanguageChange = () => {
      try {
        const stored = localStorage.getItem('mediscan_lang') as Language;
        if (stored && (stored === 'en' || stored === 'hi' || stored === 'gu')) {
          setLangState(stored);
          if (typeof document !== 'undefined') {
            document.documentElement.lang = stored;
          }
        }
      } catch {}
    };

    window.addEventListener('language_changed', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('language_changed', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('mediscan_lang', newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
      window.dispatchEvent(new Event('language_changed'));
    } catch {}
  };

  const currentTranslations = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      t: translations.en
    };
  }
  return context;
}
