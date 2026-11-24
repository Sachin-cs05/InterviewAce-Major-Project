import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component for Dark-Mode SaaS Theme
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary'] - Button visual style
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size scale
 * @param {boolean} [props.isLoading=false] - When true, displays spinner and prevents clicks
 * @param {boolean} [props.disabled=false] - Disables button interaction
 * @param {boolean} [props.fullWidth=false] - Stretches button across container width
 * @param {React.ReactNode} [props.icon] - Icon element to display alongside text
 * @param {'left' | 'right'} [props.iconPosition='left'] - Position of icon relative to children
 * @param {string} [props.type='button'] - Standard HTML button type
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {function} [props.onClick] - Click handler function
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  // Base styling with dark SaaS aesthetics
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none';

  // Sizing variants
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold',
  };

  // Color & background variants matching the dark-slate theme
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/20 hover:shadow-indigo-500/35',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 shadow-sm',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 border border-rose-500/30',
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={isButtonDisabled ? undefined : onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 flex items-center">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 flex items-center">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
