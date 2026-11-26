import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Reusable Form Input Component (White & Emerald Theme)
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
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm
            border transition-all duration-150 outline-none
            py-2.5 px-3.5
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15'
            }
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60 text-slate-500' : ''}
            ${className}
          `}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-0.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
