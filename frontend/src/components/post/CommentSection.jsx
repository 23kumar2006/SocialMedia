import React, { useState, useEffect } from 'react';
import { Send, CornerDownRight, Heart } from 'lucide-react';
import { Button } from '../common/Button';
import { RoleBadge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const CommentSection = ({ postId, onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        if (res.data?.comments) {
          setComments(res.data.comments);
        }
      } catch (err) {
        console.warn('API error or demo mode fallback for comments:', err);
      }
    };
    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setLoading(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim(),
      });
      if (res.data?.comment) {
        setComments([...comments, { ...res.data.comment, replies: [] }]);
      }
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      // Local fallback
      const localComment = {
        _id: `comm_${Date.now()}`,
        author: user,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        replies: [],
      };
      setComments([...comments, localComment]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (parentId) => {
    if (!replyText.trim() || !isAuthenticated) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: replyText.trim(),
        parentComment: parentId,
      });

      const replyObj = res.data?.comment || {
        _id: `rep_${Date.now()}`,
        author: user,
        content: replyText.trim(),
        createdAt: new Date().toISOString(),
      };

      setComments((prev) =>
        prev.map((c) =>
          c._id === parentId
            ? { ...c, replies: [...(c.replies || []), replyObj] }
            : c
        )
      );

      setReplyingTo(null);
      setReplyText('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.warn('Failed to reply:', err);
    }
  };

  return (
    <div className="pt-3 border-t border-slate-800/80 space-y-3">
      {/* New Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'me'}`}
            alt={user?.name}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <input
            type="text"
            placeholder="Write a constructive comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={loading}
            icon={Send}
            className="px-2.5 h-8"
          />
        </form>
      ) : (
        <div className="p-2.5 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
          Please sign in to join the conversation.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-2.5 pt-1">
        {comments.map((comment) => (
          <div key={comment._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={comment.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.author?.username || 'user'}`}
                  alt={comment.author?.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-200">{comment.author?.name}</span>
                <RoleBadge role={comment.author?.role} isVerified={comment.author?.isVerified} />
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(comment.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-xs text-slate-300 pl-8 leading-relaxed">{comment.content}</p>

            {/* Reply trigger */}
            <div className="pl-8 flex items-center gap-4 text-[11px] text-slate-400">
              <button
                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                className="hover:text-brand-400 flex items-center gap-1 font-medium"
              >
                <CornerDownRight className="w-3 h-3" /> Reply
              </button>
            </div>

            {/* Reply Input Box */}
            {replyingTo === comment._id && (
              <div className="pl-8 pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-950 text-xs text-slate-100 placeholder-slate-500 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAddReply(comment._id)}
                  className="text-xs py-1 px-2.5 h-7"
                >
                  Reply
                </Button>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-8 space-y-2 pt-1 border-l-2 border-slate-800 ml-3">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="p-2 rounded-lg bg-slate-950/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={reply.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${reply.author?.username || 'user'}`}
                        alt={reply.author?.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-bold text-slate-200">{reply.author?.name}</span>
                    </div>
                    <p className="text-xs text-slate-300 pl-7">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
