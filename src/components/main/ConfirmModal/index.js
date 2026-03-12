import { useLanguage } from '@/context/LanguageContext';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
        <p className="text-gold-dark text-base font-semibold text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 text-sm font-semibold text-gold-dark border-2 border-gold-light rounded-full hover:border-gold"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
