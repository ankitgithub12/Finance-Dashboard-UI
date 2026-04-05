import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';
import InputField from './InputField';
import PasswordStrength from './PasswordStrength';
import { Eye, EyeOff, Lock, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';

const validateForm = (form) => {
  const errs = {};
  if (!form.password) errs.password = 'Password is required';
  else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
  else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include at least one uppercase letter';
  else if (!/[a-z]/.test(form.password)) errs.password = 'Must include at least one lowercase letter';
  else if (!/[0-9]/.test(form.password)) errs.password = 'Must include at least one number';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
    errs.password = 'Must include at least one special character';

  if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  return errs;
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuthStore();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token || token.length < 32) setTokenValid(false);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    const result = await resetPassword(token, {
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setServerError(result.message);
      if (result.errors) setErrors(result.errors);
      // Token is expired or invalid
      if (result.message?.toLowerCase().includes('invalid') || result.message?.toLowerCase().includes('expired')) {
        setTokenValid(false);
      }
    }
  };

  if (!tokenValid) {
    return (
      <AuthLayout title="Link expired" subtitle="This reset link is no longer valid">
        <div className="auth-success">
          <div className="auth-success__icon auth-success__icon--error">
            <AlertTriangle size={48} />
          </div>
          <p className="auth-success__text">
            This password reset link has expired or is invalid. Reset links are only valid for <strong>15 minutes</strong>.
          </p>
          <Link to="/forgot-password" className="auth-btn auth-btn--primary" style={{ marginTop: '1.5rem', display: 'flex' }}>
            <ShieldCheck size={18} />
            Request New Reset Link
          </Link>
          <Link to="/login" className="auth-btn auth-btn--ghost">
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert__icon">⚠️</span>
            <p>{serverError}</p>
          </div>
        )}

        <div>
          <InputField
            id="reset-password"
            label="New Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min 8 chars, uppercase, number, symbol"
            autoComplete="new-password"
            Icon={Lock}
            rightElement={
              <button
                type="button"
                className="auth-input__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <PasswordStrength password={form.password} />
        </div>

        <InputField
          id="reset-confirm-password"
          label="Confirm New Password"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          Icon={Lock}
          rightElement={
            <button
              type="button"
              className="auth-input__toggle"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <button
          type="submit"
          id="reset-submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-btn__loader" />
          ) : (
            <>
              <ShieldCheck size={18} />
              Reset Password
              <ArrowRight size={16} className="auth-btn__arrow" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
