import { useEffect, useState } from 'react';
import { fetchAvailability } from '@/lib/availability';
import { useLanguage } from '@/context/LanguageContext';

function getMonthLabel(year, month, locale) {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { month: 'long', year: 'numeric' });
}

function getDaysGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  return { firstDay, daysInMonth };
}

export default function StepDateTime({ onSelect, onBack, selectedDate, selectedTime }) {
  const { t, locale } = useLanguage();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickedDate, setPickedDate] = useState(selectedDate);
  const [pickedTime, setPickedTime] = useState(selectedTime);

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  useEffect(() => {
    setLoading(true);
    fetchAvailability(yearMonth)
      .then(data => setAvailability(data))
      .catch(() => setAvailability([]))
      .finally(() => setLoading(false));
  }, [yearMonth]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const canGoPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1);

  const availMap = {};
  availability.forEach(a => { availMap[a.date] = a.slots; });

  const { firstDay, daysInMonth } = getDaysGrid(year, month);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const slots = pickedDate ? (availMap[pickedDate] || []) : [];

  function handleSelectDate(dateStr) {
    setPickedDate(dateStr);
    setPickedTime(null);
  }

  function handleConfirm() {
    if (pickedDate && pickedTime) {
      onSelect(pickedDate, pickedTime);
    }
  }

  const dayNames = t('form.calendar.days');

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="text-gold-dark font-semibold px-2 disabled:opacity-30"
        >
          &larr;
        </button>
        <span className="text-gold-dark font-semibold capitalize">{getMonthLabel(year, month, locale)}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="text-gold-dark font-semibold px-2"
        >
          &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="text-center py-8 text-gold-dark">{t('form.calendar.loading')}</div>
      ) : (
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gold-dark/60 py-1">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
            const hasSlots = availMap[dateStr] && availMap[dateStr].length > 0;
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === pickedDate;

            return (
              <button
                key={day}
                type="button"
                disabled={!hasSlots || isPast}
                onClick={() => handleSelectDate(dateStr)}
                className={`text-sm py-2 rounded-md transition-colors
                  ${isSelected ? 'bg-gold text-white font-bold' : ''}
                  ${!isSelected && hasSlots && !isPast ? 'hover:bg-gold-light text-gold-dark cursor-pointer' : ''}
                  ${(!hasSlots || isPast) ? 'text-gray-300 cursor-default' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* Time slots */}
      {pickedDate && (
        <div className="mb-4">
          <p className="text-xs text-gold-dark mb-2 font-semibold">{t('form.calendar.available')}</p>
          {slots.length === 0 ? (
            <p className="text-sm text-gold-dark/60">{t('form.calendar.none')}</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {slots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPickedTime(slot)}
                  className={`text-sm py-2 px-1 rounded-md border-2 transition-colors
                    ${pickedTime === slot
                      ? 'border-gold bg-gold text-white font-bold'
                      : 'border-gold-light text-gold-dark hover:border-gold cursor-pointer'}
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-1 flex justify-center items-center text-lg text-gold-dark border-2 border-gold-light font-semibold rounded-full"
        >
          {t('form.button.back')}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!pickedDate || !pickedTime}
          className="h-12 flex-1 flex justify-center items-center text-lg text-white bg-gold font-semibold rounded-full disabled:opacity-40"
        >
          <span className="mr-2" aria-hidden="true">&rarr;</span>
          {t('form.button.next')}
        </button>
      </div>
    </div>
  );
}
