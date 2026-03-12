import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/main/Logo';
import LanguageToggle from '@/components/main/LanguageToggle';

export default function Login() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin/appointments');
    }
  }, [user, loading, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: 'https://dentalescenter.com/admin/login' },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage(t('admin.login.checkEmail'));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(router.query.redirect || '/admin/appointments');
      }
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="bg-white rounded-xl px-8 py-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-semibold text-gold-dark text-center mb-6">
          {isSignUp ? t('admin.login.signUp') : t('admin.login.signIn')}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 text-sm rounded-md p-3 mb-4">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-gold-dark mb-1" htmlFor="email">{t('admin.login.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gold-light rounded-md h-12 outline-none px-4"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gold-dark mb-1" htmlFor="password">{t('admin.login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-2 border-gold-light rounded-md h-12 outline-none px-4"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-12 mt-2 flex justify-center items-center text-lg text-white bg-gold font-semibold rounded-full w-full disabled:opacity-50"
          >
            {submitting ? '...' : isSignUp ? t('admin.login.submitSignUp') : t('admin.login.submitSignIn')}
          </button>
        </form>

        <p className="text-center text-sm text-gold-dark mt-6">
          {isSignUp ? t('admin.login.hasAccount') : t('admin.login.noAccount')}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            className="text-gold font-semibold underline"
          >
            {isSignUp ? t('admin.login.switchToSignIn') : t('admin.login.switchToSignUp')}
          </button>
        </p>
      </div>
    </div>
  );
}
