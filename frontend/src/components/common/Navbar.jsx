import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, Plus, User, LogOut, Settings, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { RoleBadge } from './Badge';

export const Navbar = ({ onOpenCreatePost }) => {
  const { user, isAuthenticated, logout, isAdmin, isModerator } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-purple-600 to-pink-500 p-[1.5px] transition-transform duration-200 group-hover:scale-105 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-400 text-xl tracking-tight">S</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Social<span className="text-brand-400">Sphere</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Discovery Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search topics, #hashtags, jobs, news, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-9 py-2 rounded-full border border-slate-800 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Action Controls & User Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Create Post Action Button */}
              <Button
                variant="gradient"
                size="sm"
                icon={Plus}
                onClick={onOpenCreatePost}
                className="hidden md:inline-flex text-xs font-semibold px-3.5"
              >
                Create
              </Button>

              {/* Messages Quick Link */}
              <Link
                to="/messages"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors relative"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-dark-bg" />
              </Link>

              {/* Notifications Quick Link */}
              <Link
                to="/notifications"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-dark-bg" />
              </Link>

              {/* User Dropdown */}
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 pl-1 group cursor-pointer">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'sphere'}`}
                      alt={user?.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-brand-500 transition-all"
                    />
                  </div>
                }
              >
                <div className="p-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                    <RoleBadge role={user?.role} isVerified={user?.isVerified} />
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">@{user?.username}</p>
                </div>

                <div className="py-1">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>

                  {(isAdmin || isModerator) && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-400 hover:bg-slate-800"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/settings"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Log Out
                  </button>
                </div>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join SocialSphere
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
