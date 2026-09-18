import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Flame, Sparkles, Building2, Users, Tag, Layers, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { CategoryBadge, categoryMeta } from '../../components/common/CategoryBadge';
import { RoleBadge } from '../../components/common/Badge';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'trending';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const categories = Object.keys(categoryMeta);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-400" />
          Explore & Discover
        </h1>
        <p className="text-sm text-slate-400">
          Search across structured categories, trending hashtags, verified organizations, and top creators.
        </p>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search keywords, posts, organizations, creators, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 pl-12 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 transition-all text-sm"
          />
        </div>

        {/* Explore Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
          {['trending', 'categories', 'creators', 'organizations', 'hashtags'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Explore by Category
          </h2>
          <Link to="/categories" className="text-xs text-brand-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((catKey) => {
            const meta = categoryMeta[catKey];
            const Icon = meta.icon;
            return (
              <Link
                key={catKey}
                to={`/category/${catKey}`}
                className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-brand-500/40 transition-all group flex flex-col justify-between h-28"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${meta.bg}`}>
                    <Icon className={`w-5 h-5 ${meta.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-brand-400">
                    {meta.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Explore feed</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trending Hashtags Section */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Trending Tags
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { tag: '#ArtificialIntelligence', count: '14,230 posts', category: 'Technology' },
            { tag: '#FullStackHiring', count: '8,750 posts', category: 'Jobs & Careers' },
            { tag: '#WebDevelopment', count: '12,400 posts', category: 'Technology' },
            { tag: '#StartupGrind', count: '6,100 posts', category: 'Jobs & Careers' },
            { tag: '#WorldCup2026', count: '29,800 posts', category: 'Sports' },
            { tag: '#MoviePremiere', count: '18,500 posts', category: 'Entertainment' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-200 hover:text-brand-400 cursor-pointer">
                  {item.tag}
                </p>
                <p className="text-[11px] text-slate-400">{item.count}</p>
              </div>
              <CategoryBadge category={item.category.toLowerCase().replace('&', '').replace(/\s+/g, '-')} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
