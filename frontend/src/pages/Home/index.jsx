import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Sparkles, Image, Briefcase, Newspaper, Link2, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { CategoryBadge, categoryMeta } from '../../components/common/CategoryBadge';
import { PostSkeleton } from '../../components/common/Loader';

const categoriesList = [
  { id: 'all', name: 'All Feeds', slug: '' },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
  { id: 'jobs-careers', name: 'Jobs & Careers', slug: 'jobs-careers' },
  { id: 'news', name: 'News', slug: 'news' },
  { id: 'education', name: 'Education', slug: 'education' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'sports', name: 'Sports', slug: 'sports' },
];

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { setIsCreatePostOpen } = useOutletContext() || {};
  const [activeTab, setActiveTab] = useState('for-you');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-4">
      {/* Category Pills Header Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 border ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Primary Feed Filter Tabs */}
      <div className="flex items-center justify-between p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'for-you'
                ? 'bg-slate-800 text-brand-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              For You
            </span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'following'
                  ? 'bg-slate-800 text-brand-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Following
            </button>
          )}

          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trending'
                ? 'bg-slate-800 text-brand-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trending
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-3 hidden sm:block">
          {selectedCategory !== 'all' ? `Filter: ${selectedCategory}` : 'Personalized Engine'}
        </div>
      </div>

      {/* Post Creation Quick Launcher Box */}
      {isAuthenticated && (
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
            />
            <button
              onClick={() => setIsCreatePostOpen && setIsCreatePostOpen(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-400 text-xs sm:text-sm border border-slate-800 transition-colors"
            >
              Share insights, post a job, share news, or start a discussion...
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsCreatePostOpen && setIsCreatePostOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Image className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Media</span>
              </button>

              <button
                onClick={() => setIsCreatePostOpen && setIsCreatePostOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span className="hidden sm:inline">Job Listing</span>
              </button>

              <button
                onClick={() => setIsCreatePostOpen && setIsCreatePostOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">News Post</span>
              </button>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsCreatePostOpen && setIsCreatePostOpen(true)}
              className="text-xs px-3.5 py-1.5 rounded-lg"
            >
              Publish
            </Button>
          </div>
        </div>
      )}

      {/* Feed Container Placeholder (connected to API in subsequent phases) */}
      <div className="space-y-4">
        {/* Render Demonstration Posts */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Elena Tech"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-100">Elena Rostova</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Creator
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">@elena_tech • 2 hours ago</p>
              </div>
            </div>
            <CategoryBadge category="technology" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-100">
              Announcing next-gen open architecture for category-first social discovery!
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              SocialSphere organizes content into distinct channels like Entertainment, Jobs & Careers, Tech, and Education. This completely solves feed fatigue and delivers pure relevance.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-brand-400 hover:underline">#ArtificialIntelligence</span>
              <span className="text-xs text-brand-400 hover:underline">#Architecture</span>
              <span className="text-xs text-brand-400 hover:underline">#WebDev</span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
              alt="Post preview"
              className="w-full h-64 object-cover hover:scale-[1.01] transition-transform duration-300"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <span>❤️ 142 Likes</span>
            <span>💬 28 Comments</span>
            <span>🔄 12 Shares</span>
            <span>🔖 34 Saves</span>
          </div>
        </div>

        {/* Second Demo Post: Job Listing */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-100">Nexus Robotics Inc.</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Org
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">@nexus_robotics • 4 hours ago</p>
              </div>
            </div>
            <CategoryBadge category="jobs-careers" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Full-Time • Remote
              </span>
              <span className="text-xs font-bold text-emerald-400">$120,000 - $150,000 / yr</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Senior Full-Stack Engineer (React & Node.js)
            </h3>
            <p className="text-xs text-slate-300">
              We are looking for an experienced engineer to scale our distributed robotics teleoperation platform.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">React.js</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Node.js</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Socket.IO</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">MongoDB</span>
            </div>
          </div>
        </div>

        {/* Feed Skeleton */}
        <PostSkeleton />
      </div>
    </div>
  );
};
