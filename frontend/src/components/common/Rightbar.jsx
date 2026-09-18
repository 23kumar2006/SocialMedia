import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Building2, Flame, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { RoleBadge } from './Badge';

export const Rightbar = () => {
  // Demo trending topics and suggested creators
  const trendingTopics = [
    { tag: '#ArtificialIntelligence', category: 'Technology', count: '14.2k posts' },
    { tag: '#FullStackHiring', category: 'Jobs & Careers', count: '8.7k posts' },
    { tag: '#ChampionsLeague', category: 'Sports', count: '19.4k posts' },
    { tag: '#Oscars2026', category: 'Entertainment', count: '22.1k posts' },
    { tag: '#TechStartups', category: 'Technology', count: '6.5k posts' },
  ];

  const suggestedProfiles = [
    {
      name: 'OpenAI Labs',
      username: 'openailabs',
      role: 'organization',
      isVerified: true,
      bio: 'Researching and deploying safe artificial general intelligence.',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      username: 'elena_tech',
      role: 'creator',
      isVerified: true,
      bio: 'Cloud Architect & Tech Educator sharing weekly guides.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Global Tech News',
      username: 'technews_global',
      role: 'organization',
      isVerified: true,
      bio: 'Daily verified technology and venture capital news.',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <aside className="w-80 shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pl-3 space-y-5">
      {/* Trending Topics Card */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-slate-100">Trending Right Now</h3>
          </div>
          <Link to="/explore" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            Explore
          </Link>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((item, idx) => (
            <Link
              key={idx}
              to={`/explore?q=${encodeURIComponent(item.tag)}`}
              className="block p-2 rounded-xl hover:bg-slate-800/60 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.category}</span>
                <span className="text-[11px] text-slate-400">{item.count}</span>
              </div>
              <p className="text-sm font-bold text-slate-200 group-hover:text-brand-400 transition-colors mt-0.5">
                {item.tag}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Creators & Organizations */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">Suggested Accounts</h3>
          </div>
          <Link to="/explore?tab=creators" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {suggestedProfiles.map((prof, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2.5">
              <Link to={`/profile/${prof.username}`} className="flex items-start gap-2.5 group min-w-0">
                <img
                  src={prof.avatar}
                  alt={prof.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700 group-hover:ring-brand-500"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-brand-400 truncate">
                      {prof.name}
                    </p>
                    <RoleBadge role={prof.role} isVerified={prof.isVerified} />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">@{prof.username}</p>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5 h-7 shrink-0">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="px-3 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Status</a>
        </div>
        <p>© 2026 SocialSphere Enterprise Platform</p>
      </div>
    </aside>
  );
};
