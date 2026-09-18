import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, Edit3, Grid, Bookmark, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { RoleBadge } from '../../components/common/Badge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { PostSkeleton } from '../../components/common/Loader';

export const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !username || username === currentUser?.username;

  // Profile data (current user or mock profile for demo)
  const profileUser = isOwnProfile
    ? currentUser || {
        name: 'Alex Rivera',
        username: 'alexrivera',
        role: 'creator',
        bio: 'Senior Software Architect & AI Researcher building next-gen scalable systems.',
        location: 'San Francisco, CA',
        website: 'https://alexrivera.dev',
        joinedDate: 'March 2024',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        followersCount: 1420,
        followingCount: 380,
        postsCount: 45,
        interests: ['technology', 'jobs-careers', 'education'],
      }
    : {
        name: 'Elena Rostova',
        username: username,
        role: 'creator',
        bio: 'Cloud Architect & Tech Educator sharing weekly guides.',
        location: 'Berlin, Germany',
        website: 'https://elenarostova.io',
        joinedDate: 'January 2025',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
        followersCount: 3890,
        followingCount: 412,
        postsCount: 88,
        interests: ['technology', 'news'],
      };

  return (
    <div className="space-y-5">
      {/* Profile Card & Cover Header */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-brand-900 via-purple-900 to-slate-900 relative">
          {profileUser?.coverImage && (
            <img
              src={profileUser.coverImage}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative inline-block">
              <img
                src={profileUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profileUser?.username}`}
                alt={profileUser?.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-dark-bg bg-dark-bg shadow-xl"
              />
            </div>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Button variant="secondary" size="sm" icon={Edit3} className="text-xs">
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="text-xs font-semibold px-4"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">{profileUser?.name}</h1>
                <RoleBadge role={profileUser?.role} isVerified={true} />
              </div>
              <p className="text-xs text-slate-400">@{profileUser?.username}</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {profileUser?.bio}
            </p>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 pt-1">
              {profileUser?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profileUser.location}
                </span>
              )}
              {profileUser?.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-brand-400 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {profileUser.website.replace('https://', '')}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined {profileUser?.joinedDate || 'recently'}
              </span>
            </div>

            {/* Stats Counter */}
            <div className="flex items-center gap-6 pt-2 text-xs border-t border-slate-800/80">
              <div>
                <span className="font-bold text-slate-100 mr-1">{profileUser?.postsCount || 0}</span>
                <span className="text-slate-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-slate-100 mr-1">{profileUser?.followersCount || 0}</span>
                <span className="text-slate-400">Followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-100 mr-1">{profileUser?.followingCount || 0}</span>
                <span className="text-slate-400">Following</span>
              </div>
            </div>

            {/* Selected Interests */}
            {profileUser?.interests && (
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400">Interests:</span>
                {profileUser.interests.map((catKey) => (
                  <CategoryBadge key={catKey} category={catKey} size="sm" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        {[
          { id: 'posts', label: 'Posts', icon: Grid },
          { id: 'saved', label: 'Saved', icon: Bookmark },
          { id: 'jobs', label: 'Specialized', icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-slate-800 text-brand-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Stream */}
      <div className="space-y-4">
        <PostSkeleton />
      </div>
    </div>
  );
};
