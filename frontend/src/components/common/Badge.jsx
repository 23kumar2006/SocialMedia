import React from 'react';
import { CheckCircle2, Sparkles, Building2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RoleBadge = ({ role, isVerified = false, className = '' }) => {
  if (role === 'admin') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20', className)}>
        <ShieldCheck className="w-3 h-3" />
        Admin
      </span>
    );
  }

  if (role === 'moderator') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20', className)}>
        <ShieldAlert className="w-3 h-3" />
        Moderator
      </span>
    );
  }

  if (role === 'organization') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20', className)}>
        <Building2 className="w-3 h-3" />
        Org
      </span>
    );
  }

  if (role === 'creator') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20', className)}>
        <Sparkles className="w-3 h-3" />
        Creator
      </span>
    );
  }

  if (isVerified) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-brand-400', className)} title="Verified User">
        <CheckCircle2 className="w-3.5 h-3.5 fill-brand-400/20 text-brand-400" />
      </span>
    );
  }

  return null;
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', styles[variant], className)}>
      {children}
    </span>
  );
};
