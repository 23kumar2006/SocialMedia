import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Briefcase,
  Newspaper,
  ExternalLink,
  MoreHorizontal,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CategoryBadge } from '../common/CategoryBadge';
import { RoleBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { CommentSection } from './CommentSection';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const PostCard = ({ post, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const author = post.author || {};
  const isJob = post.postType === 'job' && post.jobDetails;
  const isNews = post.postType === 'news' && post.newsDetails;

  const handleLike = async () => {
    if (!isAuthenticated) return;
    if (likeLoading) return;

    // Optimistic UI update
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikesCount((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      setLikeLoading(true);
      await api.post(`/posts/${post._id}/like`);
    } catch (err) {
      // Revert if API fails
      setIsLiked(!nextIsLiked);
      setLikesCount((prev) => (!nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;
    setIsSaved(!isSaved);
    try {
      await api.post(`/posts/${post._id}/save`);
    } catch (err) {
      setIsSaved(isSaved);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'SocialSphere Post',
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
      alert('Post link copied to clipboard!');
    }
  };

  return (
    <article className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-slate-700/80 transition-all duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/profile/${author.username}`} className="shrink-0">
            <img
              src={author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${author.username || 'user'}`}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800 hover:ring-brand-500 transition-all"
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/${author.username}`}
                className="text-xs font-bold text-slate-100 hover:text-brand-400 transition-colors truncate"
              >
                {author.name || 'Anonymous User'}
              </Link>
              <RoleBadge role={author.role} isVerified={author.isVerified} />
            </div>
            <p className="text-[11px] text-slate-400">
              @{author.username || 'user'} •{' '}
              {new Date(post.createdAt || Date.now()).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <CategoryBadge category={post.category} />
          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Title & Content */}
      <div className="space-y-2">
        {post.title && (
          <h3 className="text-base font-bold text-slate-100 leading-snug">{post.title}</h3>
        )}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((t, idx) => (
              <Link
                key={idx}
                to={`/explore?q=${encodeURIComponent(t)}`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 hover:underline"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Specialized Job Listing Display */}
      {isJob && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {post.jobDetails.companyName}
              </span>
              <p className="text-sm font-bold text-slate-100 mt-0.5">{post.title || 'Job Opportunity'}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-black text-emerald-400 block">{post.jobDetails.salaryRange}</span>
              <span className="text-[11px] text-slate-400">{post.jobDetails.location} • {post.jobDetails.jobType}</span>
            </div>
          </div>

          {post.jobDetails.skills && post.jobDetails.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.jobDetails.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/20 text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {post.jobDetails.applyUrl && (
            <div className="pt-2">
              <a
                href={post.jobDetails.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Apply Now <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Specialized News Article Display */}
      {isNews && (
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
              <Newspaper className="w-3.5 h-3.5" />
              {post.newsDetails.source}
            </span>
            {post.newsDetails.isVerifiedSource && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Verified Source
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-100">{post.newsDetails.headline}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{post.newsDetails.summary}</p>
          {post.newsDetails.sourceUrl && (
            <a
              href={post.newsDetails.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline pt-1"
            >
              Read full coverage <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Media Attachments */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 max-h-96">
          <img
            src={post.media[0].url}
            alt="Post media"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Post Social Actions Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isLiked
                ? 'text-pink-500 bg-pink-500/10'
                : 'text-slate-400 hover:text-pink-400 hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmark / Save */}
        <button
          onClick={handleSave}
          className={`p-1.5 rounded-xl transition-colors ${
            isSaved
              ? 'text-brand-400 bg-brand-500/10'
              : 'text-slate-400 hover:text-brand-400 hover:bg-slate-800'
          }`}
          title={isSaved ? 'Saved to bookmarks' : 'Save post'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-400 text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}
    </article>
  );
};
