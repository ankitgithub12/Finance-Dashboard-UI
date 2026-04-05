import { useMemo } from 'react';

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  if (checks.length) score++;
  if (checks.longLength) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'var(--auth-danger)', percent: 25 };
  if (score <= 3) return { score, label: 'Fair', color: 'var(--auth-warning)', percent: 50 };
  if (score <= 4) return { score, label: 'Good', color: 'var(--auth-info)', percent: 75 };
  return { score, label: 'Strong', color: 'var(--auth-success)', percent: 100 };
};

const REQUIREMENTS = [
  { key: 'length', test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { key: 'uppercase', test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { key: 'lowercase', test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { key: 'number', test: (p) => /[0-9]/.test(p), label: 'One number' },
  { key: 'special', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: 'One special character (!@#...)' },
];

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="pw-strength" aria-live="polite">
      {/* Progress bar */}
      <div className="pw-strength__bar-row">
        <div className="pw-strength__bar-track">
          <div
            className="pw-strength__bar-fill"
            style={{
              width: `${strength.percent}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
        <span className="pw-strength__label" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul className="pw-strength__list">
        {REQUIREMENTS.map(({ key, test, label }) => {
          const passed = test(password);
          return (
            <li
              key={key}
              className={`pw-strength__item ${passed ? 'pw-strength__item--pass' : ''}`}
            >
              <span className="pw-strength__check">{passed ? '✓' : '○'}</span>
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
