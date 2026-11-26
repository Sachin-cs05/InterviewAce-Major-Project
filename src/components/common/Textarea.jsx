import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Textarea Component (White & Emerald Theme)
 */
export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  ...rest
}) {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-slate-700 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm
          border transition-all duration-150 outline-none
          py-2.5 px-3.5 resize-y
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
