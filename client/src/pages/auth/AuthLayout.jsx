import { TrendingUp } from 'lucide-react';
import './auth.css';

/**
 * Shared layout wrapper for all auth pages.
 * Provides the animated gradient background, floating card, and branding.
 */
export default function AuthLayout({ title, subtitle, children }) {
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
        <div className="auth-brand">
          <div className="auth-brand__logo">
            <TrendingUp size={22} strokeWidth={2.5} />
          </div>
          <span className="auth-brand__name">FinanceIQ</span>
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
