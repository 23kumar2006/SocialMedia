import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Image, Briefcase, Newspaper, Flame, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { PostCard } from '../../components/post/PostCard';
import { CreatePostModal } from '../../components/post/CreatePostModal';
import { PostSkeleton } from '../../components/common/Loader';
import { categoryMeta } from '../../components/common/CategoryBadge';
import api from '../../services/api';

const categoriesList = [
  { id: 'all', name: 'For You', slug: '' },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
  { id: 'jobs-careers', name: 'Jobs & Careers', slug: 'jobs-careers' },
  { id: 'news', name: 'News', slug: 'news' },
  { id: 'education', name: 'Education', slug: 'education' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'sports', name: 'Sports', slug: 'sports' },
];

export const Home = () => {
  const { categorySlug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you', 'following', 'trending'
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync category param with selection
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug.toLowerCase());
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  // Fetch posts based on category and tab
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        feedType: activeTab,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      };
      const res = await api.get('/posts', { params });
      if (res.data?.posts) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.warn('Backend offline or initializing; using demo stream fallback:', err);
      // Fallback demo posts
      setPosts([
        {
          _id: 'p_1',
          author: {
            name: 'Elena Rostova',
            username: 'elena_tech',
            role: 'creator',
            isVerified: true,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          },
          title: 'Building Scalable Micro-Frontends with React & Vite in 2026',
          content: 'Categorized social media is the cure to algorithmic fatigue. By organizing streams into distinct channels like Technology, Jobs, and Education, users regain agency over their digital time.',
          category: 'technology',
          subcategory: 'Programming',
          tags: ['#technology', '#react', '#architecture', '#webdev'],
          postType: 'standard',
          media: [
            { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
          ],
          likesCount: 142,
          commentsCount: 18,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: 'p_2',
          author: {
            name: 'Nexus Robotics Inc.',
            username: 'nexus_robotics',
            role: 'organization',
            isVerified: true,
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
          },
          title: 'Senior Full-Stack Engineer (React & Node.js)',
          content: 'We are expanding our core platform engineering team at Nexus Robotics. Join us in building distributed teleoperation and low-latency streaming tools.',
          category: 'jobs-careers',
          subcategory: 'Jobs',
          tags: ['#jobs', '#fullstack', '#hiring', '#react', '#nodejs'],
          postType: 'job',
          jobDetails: {
            companyName: 'Nexus Robotics Inc.',
            location: 'San Francisco, CA (Remote Option)',
            jobType: 'Full-Time',
            experienceLevel: 'Senior (4+ Years)',
            salaryRange: '$140,000 - $175,000 / yr + Equity',
            skills: ['React.js', 'Node.js', 'Socket.IO', 'MongoDB', 'Distributed Systems'],
            applyUrl: 'https://nexusrobotics.ai/careers/senior-fullstack',
          },
          likesCount: 89,
          commentsCount: 7,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: 'p_3',
          author: {
            name: 'Global Tech News',
            username: 'technews_global',
            role: 'organization',
            isVerified: true,
            avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
          },
          title: 'Global Semiconductor Alliance Announces Optical Computing Architecture',
          content: 'Breakthroughs in optical interconnects promise up to 10x reductions in AI training latency and power consumption across enterprise data centers.',
          category: 'news',
          subcategory: 'Technology',
          tags: ['#news', '#semiconductors', '#breakthrough', '#ai'],
          postType: 'news',
          newsDetails: {
            headline: 'Global Semiconductor Alliance Announces Next-Gen Optical Computing Architecture',
            summary: 'Breakthrough optical interconnects promise 10x energy reduction and ultra-low latency for AI data center clusters.',
            source: 'Nexus Global Newsroom',
            sourceUrl: 'https://technews.org/optical-computing-2026',
            isVerifiedSource: true,
          },
          likesCount: 95,
          commentsCount: 11,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, activeTab]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills Header Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Link
              key={cat.id}
              to={cat.slug ? `/category/${cat.slug}` : '/'}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 border ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              {cat.name}
            </Link>
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
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Trending
            </span>
          </button>
        </div>

        <button
          onClick={fetchPosts}
          className="p-2 text-slate-400 hover:text-brand-400 transition-colors"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-400 text-xs sm:text-sm border border-slate-800 transition-colors"
            >
              Share insights, post a job, share news, or start a discussion...
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Image className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Media</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span className="hidden sm:inline">Job Listing</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">News Post</span>
              </button>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs px-3.5 py-1.5 rounded-lg font-bold"
            >
              Publish
            </Button>
          </div>
        </div>
      )}

      {/* Main Dynamic Feeds Container */}
      <div className="space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(deletedId) => setPosts(posts.filter((p) => p._id !== deletedId))}
            />
          ))
        ) : (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No publications found</h3>
            <p className="text-xs text-slate-400">
              Be the first to create a post in this category!
            </p>
          </div>
        )}
      </div>

      {/* Post Creation Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};
