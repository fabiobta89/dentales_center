import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase';
import AdminNav from '@/components/main/AdminNav';
import ConfirmModal from '@/components/main/ConfirmModal';

const PER_PAGE = 30;
const STATUSES = ['pending', 'synced', 'confirmed', 'completed', 'cancelled', 'no_show'];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  synced: 'bg-purple-100 text-purple-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-gray-100 text-gray-800',
};

const STATUS_DOT_COLORS = {
  pending: 'bg-yellow-400',
  synced: 'bg-purple-400',
  confirmed: 'bg-blue-400',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-gray-400',
};

export default function Appointments() {
  const { user, loading } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const totalPages = Math.ceil(appointments.length / PER_PAGE);
  const paginatedAppointments = appointments.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login?redirect=/admin/appointments');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (!error && data) {
        setAppointments(data);
      }
      setFetching(false);
    }

    load();
  }, [user, supabase]);

  if (loading || !user) {
    return <div className="h-screen flex items-center justify-center">{t('common.loading')}</div>;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  async function handleDelete(id) {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    setDeleteId(null);

    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (data) setAppointments(data);
    }
  }

  async function handleStatusChange(id, newStatus) {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );

    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setAppointments(prev =>
          prev.map(apt => (apt.id === id ? data : apt))
        );
      }
    }
  }

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gold-dark mb-6">{t('admin.appointments.heading')}</h1>

        {/* Status guide */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-gold-dark mb-3">{t('admin.appointments.statusGuide')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STATUSES.map(status => (
              <div key={status} className="flex items-start gap-2">
                <span className={"mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 " + STATUS_DOT_COLORS[status]} />
                <div>
                  <span className="text-sm font-semibold text-gold-dark">{t(`status.${status}`)}</span>
                  <p className="text-xs text-gold-dark/60">{t(`status.desc.${status}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {fetching ? (
          <p className="text-gold-dark">{t('admin.appointments.loading')}</p>
        ) : appointments.length === 0 ? (
          <p className="text-gold-dark">{t('admin.appointments.empty')}</p>
        ) : (
          <>
          <div className="flex flex-col gap-4 lg:hidden">
            {paginatedAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-gold-dark">{apt.name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-gold-dark/60 block">{t('admin.appointments.date')}</span>
                    <span className="text-gold-dark capitalize">{formatDate(apt.date)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gold-dark/60 block">{t('admin.appointments.time')}</span>
                    <span className="text-gold-dark font-semibold">{apt.time}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gold-dark/60 block">{t('admin.appointments.email')}</span>
                    <span className="text-gold-dark break-all">{apt.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gold-dark/60 block">{t('admin.appointments.phone')}</span>
                    <span className="text-gold-dark">{apt.phone}</span>
                  </div>
                </div>
                {apt.message && (
                  <div className="text-sm">
                    <span className="text-xs text-gold-dark/60 block">{t('admin.appointments.reason')}</span>
                    <span className="text-gold-dark">{apt.message}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gold-dark/60 block mb-1">{t('admin.appointments.status')}</span>
                  <select
                    value={apt.status || 'pending'}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                    className={"w-full text-sm font-semibold rounded-lg px-3 py-2 border-0 outline-none " + STATUS_COLORS[apt.status || 'pending']}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{t(`status.${s}`)}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setDeleteId(apt.id)}
                  className="w-full text-sm text-red-600 font-semibold border-2 border-red-200 rounded-lg py-2 hover:bg-red-50"
                >
                  {t('admin.appointments.delete')}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gold-light text-gold-dark text-left text-sm">
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.date')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.time')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.name')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.email')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.phone')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.reason')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.appointments.status')}</th>
                  <th className="px-4 py-3 font-semibold">Dentalink</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="border-t border-gold-extralight hover:bg-gold-light/20">
                    <td className="px-4 py-3 text-sm text-gold-dark capitalize">{formatDate(apt.date)}</td>
                    <td className="px-4 py-3 text-sm text-gold-dark font-semibold">{apt.time}</td>
                    <td className="px-4 py-3 text-sm text-gold-dark">{apt.name}</td>
                    <td className="px-4 py-3 text-sm text-gold-dark">{apt.email}</td>
                    <td className="px-4 py-3 text-sm text-gold-dark">{apt.phone}</td>
                    <td className="px-4 py-3 text-sm text-gold-dark">{apt.message || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={apt.status || 'pending'}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className={"text-xs font-semibold rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer " + STATUS_COLORS[apt.status || 'pending']}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{t(`status.${s}`)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {apt.dentalink_id ? (
                        <span className="text-green-600 font-semibold">#{apt.dentalink_id}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteId(apt.id)}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        {t('admin.appointments.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm font-semibold text-gold-dark border-2 border-gold-light rounded-full px-4 py-2 disabled:opacity-30"
              >
                &larr;
              </button>
              <span className="text-sm text-gold-dark">
                {t('admin.appointments.page')} {page} {t('admin.appointments.of')} {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm font-semibold text-gold-dark border-2 border-gold-light rounded-full px-4 py-2 disabled:opacity-30"
              >
                &rarr;
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          message={t('admin.appointments.confirmDelete')}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
