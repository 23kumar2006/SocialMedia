import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  Bookmark,
  Settings,
  Film,
  Briefcase,
  Newspaper,
  GraduationCap,
  Cpu,
  Trophy,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const mainNavItems = [
  { name: 'For You', path: '/', icon: Home },
  { name: 'Explore', path: '/explore', icon: Compass },
  { name: 'Notifications', path: '/notifications', icon: Bell, requiresAuth: true },
  { name: 'Messages', path: '/messages', icon: MessageSquare, requiresAuth: true },
  { name: 'Saved', path: '/saved', icon: Bookmark, requiresAuth: true },
  { name: 'All Categories', path: '/categories', icon: Layers },
];

const categoryShortcuts = [
  { name: 'Entertainment', slug: 'entertainment', icon: Film, color: 'text-pink-400', bg: 'hover:bg-pink-500/10' },
  { name: 'Jobs & Careers', slug: 'jobs-careers', icon: Briefcase, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' },
  { name: 'News', slug: 'news', icon: Newspaper, color: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
  { name: 'Education', slug: 'education', icon: GraduationCap, color: 'text-amber-400', bg: 'hover:bg-amber-500/10' },
  { name: 'Technology', slug: 'technology', icon: Cpu, color: 'text-purple-400', bg: 'hover:bg-purple-500/10' },
  { name: 'Sports', slug: 'sports', icon: Trophy, color: 'text-red-400', bg: 'hover:bg-red-500/10' },
];

export const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pr-3 space-y-6">
      {/* Primary Navigation Menu */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {mainNavItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) return null;
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive ? 'text-brand-400' : 'text-slate-400')} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Structured Category Hub */}
      <div className="space-y-1 pt-4 border-t border-slate-800/80">
        <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Categories</span>
          <Sparkles className="w-3 h-3 text-brand-400" />
        </div>

        {categoryShortcuts.map((cat) => {
          const Icon = cat.icon;
          const catPath = `/category/${cat.slug}`;
          const isCatActive = location.pathname === catPath;

          return (
            <NavLink
              key={cat.slug}
              to={catPath}
              className={cn(
                'flex items-center justify-between px-3.5 py-2 rounded-xl text-sm transition-all group',
                isCatActive
                  ? 'bg-slate-800 text-white font-semibold border-l-4 border-brand-500 shadow-sm'
                  : `text-slate-400 hover:text-slate-200 ${cat.bg}`
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', cat.color)} />
                <span className="truncate">{cat.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Category Discovery Promo Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/60 to-purple-950/40 border border-brand-500/20 text-xs">
        <p className="font-bold text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Smart Category Feeds
        </p>
        <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
          Switch channels or customize your personal stream with targeted categories.
        </p>
      </div>
    </aside>
  );
};
