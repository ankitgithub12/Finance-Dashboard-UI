/**
 * Reusable input field with icon, error state, and optional right element.
 */
export default function InputField({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  Icon,
  rightElement,
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-field__label">
        {label}
      </label>
      <div className={`auth-input ${error ? 'auth-input--error' : ''} ${value ? 'auth-input--filled' : ''}`}>
        {Icon && (
          <span className="auth-input__icon">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="auth-input__control"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightElement && (
          <span className="auth-input__right">{rightElement}</span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="auth-field__error" role="alert">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
