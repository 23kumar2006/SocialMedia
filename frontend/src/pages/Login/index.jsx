import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Shield, Building2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import api from '../../services/api';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('user@socialsphere.io');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data) {
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      // For standalone demo mode before backend auth endpoints are mounted:
      console.warn('API error or backend initializing, using demo session fallback:', err);
      const demoUser = {
        _id: 'demo_user_1',
        name: email.split('@')[0],
        username: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : email.includes('org') ? 'organization' : 'creator',
        isVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      };
      login(demoUser, 'demo_jwt_token_2026');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail, rolePass = 'Password123!') => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-slate-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to SocialSphere to access your personalized feeds</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <a href="#" className="text-[11px] text-brand-400 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            icon={LogIn}
            className="w-full py-2.5 text-sm font-bold"
          >
            Sign In to SocialSphere
          </Button>
        </form>

        {/* Quick-Fill Demo Roles */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Quick Demo Roles
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@socialsphere.io')}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('org@techcorp.com')}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              Org
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('creator@socialsphere.io')}
              className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Creator
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-bold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
