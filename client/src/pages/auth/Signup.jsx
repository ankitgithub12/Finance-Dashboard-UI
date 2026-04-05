import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AuthLayout from './AuthLayout';
import InputField from './InputField';
import PasswordStrength from './PasswordStrength';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

const validateForm = (form) => {
  const errs = {};

  if (!form.name.trim()) errs.name = 'Full name is required';
  else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
  else if (!/^[a-zA-Z\s'-]+$/.test(form.name))
    errs.name = 'Name can only contain letters, spaces, hyphens and apostrophes';

  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = 'Please enter a valid email address';

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

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
      if (result.errors) setErrors(result.errors);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Finance Dashboard and take control of your finances"
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert__icon">⚠️</span>
            <p>{serverError}</p>
          </div>
        )}

        <InputField
          id="signup-name"
          label="Full Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
          autoComplete="name"
          Icon={User}
        />

        <InputField
          id="signup-email"
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

        <div>
          <InputField
            id="signup-password"
            label="Password"
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
          id="signup-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
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
          id="signup-submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-btn__loader" />
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
              <ArrowRight size={16} className="auth-btn__arrow" />
            </>
          )}
        </button>

        <p className="auth-form__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link auth-link--bold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
