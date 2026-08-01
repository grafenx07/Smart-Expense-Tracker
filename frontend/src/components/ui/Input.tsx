import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#374151]">
          {label}
          {props.required && <span className="text-[#dc2626] ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          'w-full h-10 px-3 rounded-lg border text-sm text-[#111827] bg-white',
          'placeholder:text-[#9ca3af] transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
          error
            ? 'border-[#f87171] bg-[#fef2f2]'
            : 'border-[#e5e7eb] hover:border-[#d1d5db]',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-[#dc2626]" role="alert">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
    </div>
  ),
);

Input.displayName = 'Input';

export default Input;
