import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';
import InputField from './InputField';
import { Mail, Send, ArrowLeft, CheckCircle } from 'lucide-react';

const validateEmail = (email) => {
  if (!email.trim()) return 'Email address is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email address';
  return '';
};

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) { setError(validationError); return; }

    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.message);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent you a password reset link">
        <div className="auth-success">
          <div className="auth-success__icon">
            <CheckCircle size={48} />
          </div>
          <p className="auth-success__text">
            A password reset link has been sent to{' '}
            <strong className="auth-success__email">{email}</strong>.
            <br />
            The link expires in <strong>15 minutes</strong>.
          </p>
          <p className="auth-success__hint">
            Didn't receive the email? Check your spam folder, or{' '}
            <button
              type="button"
              className="auth-link auth-link--bold"
              onClick={() => setSubmitted(false)}
            >
              try again
            </button>
            .
          </p>
          <Link to="/login" className="auth-btn auth-btn--secondary" style={{ marginTop: '1.5rem', display: 'flex' }}>
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries — we'll send you reset instructions"
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert__icon">⚠️</span>
            <p>{serverError}</p>
          </div>
        )}

        <div className="auth-alert auth-alert--info">
          <span className="auth-alert__icon">💡</span>
          <p>Enter the email address associated with your account and we'll send you a link to reset your password.</p>
        </div>

        <InputField
          id="forgot-email"
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          error={error}
          placeholder="you@example.com"
          autoComplete="email"
          Icon={Mail}
        />

        <button
          type="submit"
          id="forgot-submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-btn__loader" />
          ) : (
            <>
              <Send size={18} />
              Send Reset Link
            </>
          )}
        </button>

        <Link to="/login" className="auth-btn auth-btn--ghost">
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </form>
    </AuthLayout>
  );
}
