import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm font-semibold text-gold-dark border-2 border-gold-light rounded-full px-3 py-1 hover:border-gold"
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
