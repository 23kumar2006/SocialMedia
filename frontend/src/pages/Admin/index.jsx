import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  FileText,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { RoleBadge } from '../../components/common/Badge';
import { CategoryBadge } from '../../components/common/CategoryBadge';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Demo stats
  const stats = [
    { label: 'Total Users', value: '28,450', change: '+12.4%', icon: Users, color: 'text-brand-400' },
    { label: 'Active Posts', value: '142,890', change: '+8.1%', icon: FileText, color: 'text-purple-400' },
    { label: 'Active Categories', value: '6 Core', change: '100% healthy', icon: Layers, color: 'text-emerald-400' },
    { label: 'Pending Reports', value: '7', change: '-4 today', icon: AlertTriangle, color: 'text-rose-400' },
  ];

  // Demo reports
  const [reports, setReports] = useState([
    {
      id: 'rep_1',
      type: 'Post',
      reason: 'Spam / Misleading Link',
      author: 'spambot99',
      reportedBy: 'elena_tech',
      date: '10 mins ago',
      status: 'pending',
    },
    {
      id: 'rep_2',
      type: 'Comment',
      reason: 'Harassment & Inappropriate Language',
      author: 'troll_user',
      reportedBy: 'alexrivera',
      date: '1 hour ago',
      status: 'pending',
    },
  ]);

  const dismissReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Enterprise Admin & Moderation</h1>
              <p className="text-xs text-slate-400">Platform governance, category controls & reports triage</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Admin Access
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{st.label}</span>
                <Icon className={`w-4 h-4 ${st.color}`} />
              </div>
              <p className="text-xl font-black text-slate-100">{st.value}</p>
              <p className="text-[11px] text-emerald-400 font-medium">{st.change}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {[
          { id: 'overview', label: 'Reports Queue' },
          { id: 'categories', label: 'Dynamic Categories' },
          { id: 'users', label: 'User Management' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab ? 'bg-slate-800 text-brand-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Reports Queue */}
      {activeTab === 'overview' && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Flagged Content Queue ({reports.length})
            </h3>
          </div>

          {reports.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {reports.map((rep) => (
                <div key={rep.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {rep.type}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{rep.reason}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Author: <strong className="text-slate-300">@{rep.author}</strong> • Reported by: @{rep.reportedBy} • {rep.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => dismissReport(rep.id)}
                      className="text-xs py-1 px-2.5 h-7"
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => dismissReport(rep.id)}
                      className="text-xs py-1 px-2.5 h-7"
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              All reported items have been reviewed!
            </div>
          )}
        </div>
      )}

      {/* Tab: Dynamic Categories */}
      {activeTab === 'categories' && (
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Dynamic Category Configuration
            </h3>
            <Button size="sm" variant="primary" icon={Plus} className="text-xs">
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Entertainment', 'Jobs & Careers', 'News', 'Education', 'Technology', 'Sports'].map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{c}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
