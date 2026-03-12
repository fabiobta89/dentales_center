import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/main/Logo';
import LanguageToggle from '@/components/main/LanguageToggle';

export default function AdminNav() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const links = [
    { href: '/admin/appointments', label: t('admin.nav.appointments') },
  ];

  return (
    <nav className="bg-white border-b-2 border-gold-light px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex gap-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={"text-sm font-semibold " + (router.pathname === link.href ? "text-gold" : "text-gold-dark hover:text-gold")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <span className="text-xs text-gold-dark hidden sm:inline">{user?.email}</span>
          <button
            onClick={async () => { await signOut(); router.push('/admin/login'); }}
            className="text-sm text-red-600 font-semibold hover:underline"
          >
            {t('admin.nav.signOut')}
          </button>
        </div>
      </div>
    </nav>
  );
}
