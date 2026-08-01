import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: number;
  maxChars?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, charCount, maxChars, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-[#374151]">
            {label}
          </label>
          {maxChars !== undefined && charCount !== undefined && (
            <span className="text-xs text-[#9ca3af]">
              {charCount}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        id={id}
        className={[
          'w-full px-3 py-2.5 rounded-lg border text-sm text-[#111827] bg-white resize-none',
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

Textarea.displayName = 'Textarea';

export default Textarea;
