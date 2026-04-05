import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';
import InputField from './InputField';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const validateForm = (form) => {
  const errs = {};
  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = 'Please enter a valid email address';
  if (!form.password) errs.password = 'Password is required';
  return errs;
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login({ email: form.email, password: form.password });
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
      if (result.errors) setErrors(result.errors);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Finance Dashboard account"
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert__icon">⚠️</span>
            <p>{serverError}</p>
          </div>
        )}

        <InputField
          id="login-email"
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          Icon={Mail}
        />

        <InputField
          id="login-password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
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

        <div className="auth-form__forgot">
          <Link to="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          id="login-submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-btn__loader" />
          ) : (
            <>
              <LogIn size={18} />
              Sign In
              <ArrowRight size={16} className="auth-btn__arrow" />
            </>
          )}
        </button>

        <p className="auth-form__footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link auth-link--bold">
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
