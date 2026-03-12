import { type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = '', ...rest }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className={`
          h-4 w-4 rounded border-gray-300 text-primary
          focus:ring-2 focus:ring-primary/30 cursor-pointer
          ${className}
        `}
        {...rest}
      />
      {label && <span className="text-[16px] font-medium leading-[150%] tracking-normal text-[#9C9C9C]">{label}</span>}
    </label>
  );
}
