import React from 'react';
import { Film, Briefcase, Newspaper, GraduationCap, Cpu, Trophy, Tag } from 'lucide-react';
import { cn } from '../../utils/cn';

export const categoryMeta = {
  entertainment: {
    label: 'Entertainment',
    icon: Film,
    bg: 'bg-pink-500/10 hover:bg-pink-500/20',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    dot: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-600',
  },
  'jobs-careers': {
    label: 'Jobs & Careers',
    icon: Briefcase,
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-600',
  },
  news: {
    label: 'News',
    icon: Newspaper,
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 to-indigo-600',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    bg: 'bg-amber-500/10 hover:bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-600',
  },
  technology: {
    label: 'Technology',
    icon: Cpu,
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-500',
    gradient: 'from-purple-500 to-violet-600',
  },
  sports: {
    label: 'Sports',
    icon: Trophy,
    bg: 'bg-red-500/10 hover:bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    gradient: 'from-red-500 to-rose-600',
  },
};

export const getCategoryMeta = (slug) => {
  if (!slug) return null;
  const normalized = slug.toLowerCase().replace(/\s+/g, '-');
  return categoryMeta[normalized] || {
    label: slug.charAt(0).toUpperCase() + slug.slice(1),
    icon: Tag,
    bg: 'bg-slate-800 hover:bg-slate-750',
    text: 'text-brand-400',
    border: 'border-slate-700',
    dot: 'bg-brand-500',
    gradient: 'from-brand-500 to-purple-600',
  };
};

export const CategoryBadge = ({ category, showIcon = true, size = 'md', className = '', onClick }) => {
  const meta = typeof category === 'string' ? getCategoryMeta(category) : (category?.slug ? getCategoryMeta(category.slug) : null);
  const label = typeof category === 'string' ? (meta?.label || category) : (category?.name || meta?.label);
  const Icon = meta?.icon || Tag;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full font-medium border transition-colors cursor-pointer',
        meta ? `${meta.bg} ${meta.text} ${meta.border}` : 'bg-slate-800 text-slate-300 border-slate-700',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
