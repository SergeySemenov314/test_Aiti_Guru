import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, onClear, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full h-[55px] rounded-lg border border-gray-300 bg-white
              px-4 text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              transition-colors duration-150
              disabled:bg-gray-50 disabled:text-gray-500
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || onClear ? 'pr-10' : ''}
              ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''}
              ${className}
            `}
            {...rest}
          />
          {onClear && rest.value && (
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
          {rightIcon && !onClear && (
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
