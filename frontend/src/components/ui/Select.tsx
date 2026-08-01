import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, id, children, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#374151]">
          {label}
          {props.required && <span className="text-[#dc2626] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={[
            'w-full h-10 pl-3 pr-9 rounded-lg border text-sm bg-white',
            'appearance-none transition-colors duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
            error
              ? 'border-[#f87171] text-[#111827]'
              : 'border-[#e5e7eb] text-[#111827] hover:border-[#d1d5db]',
            !props.value && props.value !== 0
              ? 'text-[#9ca3af]'
              : '',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-xs text-[#dc2626]" role="alert">{error}</p>}
    </div>
  ),
);

Select.displayName = 'Select';

export default Select;
