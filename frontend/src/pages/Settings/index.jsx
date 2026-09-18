import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('interests');

  const [interests, setInterests] = useState(['technology', 'jobs-careers', 'entertainment']);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const categories = [
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'jobs-careers', label: 'Jobs & Careers' },
    { id: 'news', label: 'News' },
    { id: 'education', label: 'Education' },
    { id: 'technology', label: 'Technology' },
    { id: 'sports', label: 'Sports' },
  ];

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-1.5">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-brand-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400">Configure your category preferences, feeds, and account security.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Settings Navigation */}
        <div className="sm:col-span-1 space-y-1">
          {[
            { id: 'interests', label: 'Feed Preferences', icon: Sparkles },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Auth', icon: Shield },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === sec.id
                    ? 'bg-slate-800 text-brand-400 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Settings Details Card */}
        <div className="sm:col-span-3 p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          {activeSection === 'interests' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Category Feed Interests</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which category topics are prioritized in your "For You" algorithmic feed.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((cat) => {
                  const isSelected = interests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleInterest(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button size="sm" variant="primary" className="text-xs">
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-100">Notification Alerts</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-200">Push Notifications for Interactions</span>
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    className="accent-brand-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-200">Email Digest for Followed Categories</span>
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="accent-brand-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-100">Security & Authentication</h3>
              <p className="text-xs text-slate-400">Manage your password and active sessions.</p>
              <Button size="sm" variant="secondary" className="text-xs">
                Update Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
