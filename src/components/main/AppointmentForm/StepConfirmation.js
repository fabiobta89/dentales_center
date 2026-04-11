import { useLanguage } from '@/context/LanguageContext';
import { formatDisplay } from '@/lib/phone';

export default function StepConfirmation({ formData, onConfirm, onBack, submitting, error }) {
  const { t, locale } = useLanguage();

  const dateObj = new Date(formData.date + 'T12:00:00');
  const dateLabel = dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <p className="text-sm text-gold-dark mb-4">{t('form.confirm.title')}</p>

      <div className="bg-gold-light/40 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gold-dark/70">{t('form.confirm.name')}</span>
          <span className="text-sm font-semibold text-gold-dark">{formData.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gold-dark/70">{t('form.confirm.email')}</span>
          <span className="text-sm font-semibold text-gold-dark">{formData.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gold-dark/70">{t('form.confirm.phone')}</span>
          <span className="text-sm font-semibold text-gold-dark">{formatDisplay(formData.phone)}</span>
        </div>
        {formData.message && (
          <div className="flex justify-between">
            <span className="text-xs text-gold-dark/70">{t('form.confirm.reason')}</span>
            <span className="text-sm font-semibold text-gold-dark text-right max-w-[60%]">{formData.message}</span>
          </div>
        )}
        <hr className="border-gold-extralight" />
        <div className="flex justify-between">
          <span className="text-xs text-gold-dark/70">{t('form.confirm.date')}</span>
          <span className="text-sm font-semibold text-gold-dark capitalize">{dateLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gold-dark/70">{t('form.confirm.time')}</span>
          <span className="text-sm font-semibold text-gold-dark">{formData.time}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="h-12 flex-1 flex justify-center items-center text-sm sm:text-lg text-gold-dark border-2 border-gold-light font-semibold rounded-full"
        >
          {t('form.button.back')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="h-12 flex-1 flex justify-center items-center text-sm sm:text-lg text-white bg-gold font-semibold rounded-full disabled:opacity-50"
        >
          {submitting ? t('form.button.confirming') : t('form.button.confirm')}
        </button>
      </div>
    </div>
  );
}
