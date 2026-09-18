import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Check, Plus, Film, Briefcase, Newspaper, GraduationCap, Cpu, Trophy } from 'lucide-react';
import { Button } from '../../components/common/Button';

const fullCategories = [
  {
    id: '1',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: Film,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/10',
    description: 'Movies, music, streaming web series, pop culture, gaming, and creative entertainment.',
    subcategories: ['Movies', 'Music', 'Web Series', 'Memes', 'Gaming'],
    postsCount: '48.2k',
    followersCount: '18.9k',
    isFollowing: true,
  },
  {
    id: '2',
    name: 'Jobs & Careers',
    slug: 'jobs-careers',
    icon: Briefcase,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    description: 'Verified job openings, internship postings, freelancing gigs, and career growth guidance.',
    subcategories: ['Jobs', 'Internships', 'Freelancing', 'Career Advice', 'Hiring'],
    postsCount: '32.1k',
    followersCount: '24.5k',
    isFollowing: true,
  },
  {
    id: '3',
    name: 'News',
    slug: 'news',
    icon: Newspaper,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    description: 'Real-time verified national, international, technology, business, and global headlines.',
    subcategories: ['National', 'International', 'Technology', 'Business', 'Sports'],
    postsCount: '64.7k',
    followersCount: '31.2k',
    isFollowing: false,
  },
  {
    id: '4',
    name: 'Education',
    slug: 'education',
    icon: GraduationCap,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    description: 'Online learning courses, university study materials, competitive exams, and scholarships.',
    subcategories: ['Courses', 'Study Material', 'Exams', 'Scholarships'],
    postsCount: '19.4k',
    followersCount: '12.8k',
    isFollowing: false,
  },
  {
    id: '5',
    name: 'Technology',
    slug: 'technology',
    icon: Cpu,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    description: 'Artificial Intelligence, software engineering, startup innovations, and breakthrough gadgets.',
    subcategories: ['Artificial Intelligence', 'Programming', 'Startups', 'Gadgets'],
    postsCount: '58.3k',
    followersCount: '42.1k',
    isFollowing: true,
  },
  {
    id: '6',
    name: 'Sports',
    slug: 'sports',
    icon: Trophy,
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    description: 'Live scores, match highlights, analysis, cricket, football, basketball, and athletics.',
    subcategories: ['Cricket', 'Football', 'Basketball', 'Other Sports'],
    postsCount: '27.9k',
    followersCount: '15.6k',
    isFollowing: false,
  },
];

export const Categories = () => {
  const [categories, setCategories] = useState(fullCategories);

  const toggleFollow = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFollowing: !c.isFollowing } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-brand-400" />
          Content Categories
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Follow topics you care about to personalize your <strong>“For You”</strong> algorithm. Each category offers a dedicated feed stream and curated discussions.
        </p>
      </div>

      {/* Category Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`p-5 rounded-2xl glass-panel border ${cat.borderColor} flex flex-col justify-between space-y-4 hover:shadow-xl transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${cat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{cat.name}</h3>
                      <p className="text-xs text-slate-400">
                        {cat.postsCount} posts • {cat.followersCount} followers
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={cat.isFollowing ? 'secondary' : 'primary'}
                    icon={cat.isFollowing ? Check : Plus}
                    onClick={() => toggleFollow(cat.id)}
                    className="text-xs"
                  >
                    {cat.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cat.description}</p>

                {/* Subcategories tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  View Category Feed →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
