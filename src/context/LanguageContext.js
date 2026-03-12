import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

const translations = { es, en };
const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    const saved = localStorage.getItem('locale');
    if (saved && translations[saved]) {
      setLocale(saved);
      return;
    }
    const browserLang = navigator.language?.slice(0, 2);
    if (browserLang === 'en') {
      setLocale('en');
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'es' ? 'en' : 'es';
      localStorage.setItem('locale', next);
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    return translations[locale]?.[key] ?? translations['es']?.[key] ?? key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
