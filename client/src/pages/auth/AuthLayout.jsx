import { TrendingUp, Sun, Moon } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import './auth.css';

/**
 * Shared layout wrapper for all auth pages.
 * Provides the animated gradient background, floating card, and branding.
 */
export default function AuthLayout({ title, subtitle, children }) {
  const { theme, toggleTheme } = useFinanceStore();
  return (
    <div className="auth-root">
      {/* Animated background blobs */}
      <div className="auth-bg">
        <div className="auth-bg__blob auth-bg__blob--1" />
        <div className="auth-bg__blob auth-bg__blob--2" />
        <div className="auth-bg__blob auth-bg__blob--3" />
      </div>

      {/* Grid overlay */}
      <div className="auth-grid" />

      <div className="auth-container">
        {/* Brand header */}
        <div className="auth-brand w-full justify-between pr-2">
          <div className="flex items-center gap-2">
            <div className="auth-brand__logo">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <span className="auth-brand__name">NexusFin</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-textDim hover:text-textMain transition-colors rounded-lg bg-black/5 dark:bg-white/5 border border-borderLight hover:border-border cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">{title}</h1>
            <p className="auth-card__subtitle">{subtitle}</p>
          </div>
          <div className="auth-card__body">{children}</div>
        </div>

        {/* Footer */}
        <p className="auth-page-footer">
          &copy; {new Date().getFullYear()} FinanceIQ · By signing in you agree to our{' '}
          <a href="#terms" className="auth-link">Terms</a> &amp;{' '}
          <a href="#privacy" className="auth-link">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
