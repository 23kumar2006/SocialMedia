import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return <Loader2 className={cn('animate-spin text-brand-500', sizeClasses[size], className)} />;
};

export const PostSkeleton = () => {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800 animate-pulse space-y-4">
      {/* Author & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800" />
          <div className="space-y-1.5">
            <div className="w-28 h-3.5 bg-slate-800 rounded" />
            <div className="w-16 h-2.5 bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="w-20 h-5 bg-slate-800 rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-slate-800 rounded" />
        <div className="w-4/5 h-4 bg-slate-800 rounded" />
        <div className="w-2/3 h-4 bg-slate-800 rounded" />
      </div>

      {/* Media Mock */}
      <div className="w-full h-52 bg-slate-800/80 rounded-xl" />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-6">
          <div className="w-12 h-5 bg-slate-800 rounded" />
          <div className="w-12 h-5 bg-slate-800 rounded" />
          <div className="w-12 h-5 bg-slate-800 rounded" />
        </div>
        <div className="w-6 h-5 bg-slate-800 rounded" />
      </div>
    </div>
  );
};
