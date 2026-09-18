import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Sparkles, Building2, Shield, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import api from '../../services/api';

const availableInterests = [
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'jobs-careers', name: 'Jobs & Careers' },
  { id: 'news', name: 'News' },
  { id: 'education', name: 'Education' },
  { id: 'technology', name: 'Technology' },
  { id: 'sports', name: 'Sports' },
];

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user', // user, creator, organization
  });
  const [selectedInterests, setSelectedInterests] = useState(['technology', 'jobs-careers']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData, interests: selectedInterests };
      const res = await api.post('/auth/register', payload);
      if (res.data) {
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      console.warn('API error or fallback mode, creating local demo session:', err);
      const demoUser = {
        _id: `user_${Date.now()}`,
        name: formData.name || 'Social User',
        username: formData.username || 'socialuser',
        email: formData.email,
        role: formData.role,
        interests: selectedInterests,
        isVerified: formData.role === 'organization',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username || 'user'}`,
      };
      login(demoUser, 'demo_jwt_token_2026');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-panel border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-100">Join SocialSphere</h2>
          <p className="text-xs text-slate-400">Discover tailored content across Entertainment, Jobs, News, Tech & more</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivera"
                className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="alexrivera"
                className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@domain.com"
              className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 8 characters"
              className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Account Role Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-300">Account Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'user', label: 'User', icon: User },
                { id: 'creator', label: 'Creator', icon: Sparkles },
                { id: 'organization', label: 'Org / Company', icon: Building2 },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interest Picker */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block">
              Choose your Favorite Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="md"
            isLoading={loading}
            className="w-full py-2.5 text-sm font-bold mt-2"
          >
            Create Free Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
