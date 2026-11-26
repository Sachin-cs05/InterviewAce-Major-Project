import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Select Dropdown Component (White & Emerald Theme)
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  ...rest
}) {
  const selectId = id || name || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full rounded-xl bg-white text-slate-900 text-sm
          border transition-all duration-150 outline-none
          py-2.5 px-3.5 cursor-pointer
          ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
              : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15'
          }
          ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60 text-slate-500' : ''}
          ${className}
        `}
        {...rest}
      >
        {options.map((opt, i) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={i} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

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
