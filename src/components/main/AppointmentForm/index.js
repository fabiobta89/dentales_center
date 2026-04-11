import { useState } from 'react';
import * as Yup from 'yup';
import { useLanguage } from '@/context/LanguageContext';
import { isValidPhone, normalizeToE164 } from '@/lib/phone';
import StepCustomer from './StepCustomer';
import StepDateTime from './StepDateTime';
import StepConfirmation from './StepConfirmation';

export default function AppointmentForm() {
  const { t } = useLanguage();

  const STEPS = [t('form.steps.data'), t('form.steps.datetime'), t('form.steps.confirmation')];

  const customerSchema = Yup.object().shape({
    name: Yup.string().min(2, t('form.validation.tooShort')).max(70, t('form.validation.tooLong')).required(t('form.validation.required')),
    email: Yup.string().email(t('form.validation.invalidEmail')).required(t('form.validation.required')),
    phone: Yup.string().required(t('form.validation.required')).test('phone', t('form.validation.invalidPhone'), isValidPhone),
    message: Yup.string(),
  });

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: null,
    time: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  async function handleCustomerSubmit(values) {
    const phone = normalizeToE164(values.phone);
    setFormData(prev => ({ ...prev, ...values, phone }));
    setStep(1);
  }

  function handleDateTimeSelect(date, time) {
    setFormData(prev => ({ ...prev, date, time }));
    setStep(2);
  }

  function handleBack() {
    setStep(prev => prev - 1);
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('form.error.save'));
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFormData({ name: '', email: '', phone: '', message: '', date: null, time: null });
    setStep(0);
    setSubmitted(false);
    setError(null);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-2xl font-semibold text-gold-dark mb-2">{t('form.success.heading')}</h3>
        <p className="text-gold-dark text-center mb-2">
          {t('form.success.date')} <strong>{formData.date}</strong> {t('form.success.time')} <strong>{formData.time}</strong>.
        </p>
        <p className="text-gold-dark text-center text-sm mb-6">
          {t('form.success.reminder')} <strong>{formData.email}</strong>.
        </p>
        <button
          onClick={handleReset}
          className="text-gold font-semibold underline text-sm"
        >
          {t('form.success.another')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {STEPS.map((label, i) => {
          const isActive = i <= step;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={"flex items-center justify-center w-9 h-9 min-w-9 rounded-full text-sm font-bold " + (isActive ? "bg-gold text-white" : "bg-gold-extralight text-gold-dark")}>
                  {i + 1}
                </div>
                <span className={"text-sm hidden sm:inline " + (isActive ? "text-gold-dark font-semibold" : "text-gold-dark/50")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-gold-extralight" />}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <StepCustomer
          initialValues={formData}
          validationSchema={customerSchema}
          onSubmit={handleCustomerSubmit}
        />
      )}

      {step === 1 && (
        <StepDateTime
          onSelect={handleDateTimeSelect}
          onBack={handleBack}
          selectedDate={formData.date}
          selectedTime={formData.time}
        />
      )}

      {step === 2 && (
        <StepConfirmation
          formData={formData}
          onConfirm={handleConfirm}
          onBack={handleBack}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
}
