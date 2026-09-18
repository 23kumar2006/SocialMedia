import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 active:scale-[0.98]',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50',
  outline: 'bg-transparent border border-brand-500/40 text-brand-400 hover:bg-brand-500/10',
  gradient: 'bg-gradient-to-r from-brand-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-semibold shadow-lg shadow-purple-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-base rounded-xl gap-2.5',
  icon: 'p-2 rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
