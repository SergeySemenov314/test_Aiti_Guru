import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  onClear?: () => void;
  passwordToggle?: boolean;
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0 11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelClassName, leftIcon, rightIcon, error, onClear, passwordToggle, className = '', type, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const showToggle = isPassword && passwordToggle;
    const inputType = showToggle && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className={`text-sm font-medium text-gray-700 ${labelClassName ?? ''}`}>{label}</label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full h-[55px] rounded-lg border border-gray-300 bg-white
              px-4 text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              transition-colors duration-150
              disabled:bg-gray-50 disabled:text-gray-500
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || onClear || showToggle ? 'pr-10' : ''}
              ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''}
              ${className}
            `}
            {...rest}
          />
          {onClear && rest.value && !showToggle && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              tabIndex={-1}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          )}
          {rightIcon && !onClear && !showToggle && (
            <span className="absolute right-3 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
