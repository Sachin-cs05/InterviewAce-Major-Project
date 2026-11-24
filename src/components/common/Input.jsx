import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Reusable Dark-Mode Form Input Component
 *
 * @param {Object} props
 * @param {string} [props.label] - Field label text
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.)
 * @param {string} [props.name] - Form field name
 * @param {string|number} [props.value] - Controlled input value
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Inline error message (renders in red)
 * @param {string} [props.helperText] - Subtitle or hint text
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {boolean} [props.required=false] - Required indicator
 * @param {boolean} [props.disabled=false] - Disables the input
 * @param {string} [props.className=''] - Extra classes for the input element
 * @param {string} [props.containerClassName=''] - Extra classes for the outer wrapper
 * @param {string} [props.id] - Element ID
 */
export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  icon = null,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

  // Determine actual input type taking password toggle into account
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {/* Input Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-300 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-400 ml-1 font-semibold">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        {/* Leading Icon */}
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          type={resolvedType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200
            bg-slate-950/90 text-slate-100 placeholder-slate-400
            border ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 text-rose-100'
                : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
            }
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${className}
          `.trim()}
          {...rest}
        />

        {/* Password Visibility Toggle */}
        {isPassword && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-200 focus:outline-none transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 shrink-0" />
            ) : (
              <Eye className="w-4 h-4 shrink-0" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-0.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
