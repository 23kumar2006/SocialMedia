import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, PlusCircle, Bell, MessageSquare, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = ({ onOpenCreatePost }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-nav border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors',
          location.pathname === '/' ? 'text-brand-400 font-bold' : 'text-slate-400'
        )}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </NavLink>

      <NavLink
        to="/explore"
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors',
          location.pathname.startsWith('/explore') || location.pathname.startsWith('/category')
            ? 'text-brand-400 font-bold'
            : 'text-slate-400'
        )}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Explore</span>
      </NavLink>

      {/* Create Button */}
      <button
        onClick={onOpenCreatePost}
        className="p-2 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/30 transform active:scale-95"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {isAuthenticated ? (
        <>
          <NavLink
            to="/messages"
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors relative',
              location.pathname.startsWith('/messages') ? 'text-brand-400 font-bold' : 'text-slate-400'
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Chat</span>
          </NavLink>

          <NavLink
            to={`/profile/${user?.username}`}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors',
              location.pathname.startsWith('/profile') ? 'text-brand-400 font-bold' : 'text-slate-400'
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/login"
          className={cn(
            'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-colors',
            location.pathname === '/login' ? 'text-brand-400 font-bold' : 'text-slate-400'
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Sign In</span>
        </NavLink>
      )}
    </nav>
  );
};
