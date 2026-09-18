import React, { useState } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Sparkles, Building2, CheckCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    sender: { name: 'Elena Rostova', username: 'elena_tech', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    message: 'liked your post in Technology: "Announcing next-gen open architecture..."',
    time: '15m ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    sender: { name: 'Nexus Robotics', username: 'nexus_robotics', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' },
    message: 'commented on your job discussion: "Great perspective on distributed systems."',
    time: '2h ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'follow',
    sender: { name: 'Alex Vance', username: 'alexvance', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' },
    message: 'started following you.',
    time: '5h ago',
    isRead: true,
  },
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-brand-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-400" />
            Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Stay updated with your social & category interactions</p>
        </div>

        <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllAsRead} className="text-xs">
          Mark all read
        </Button>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        {['all', 'likes', 'comments', 'follows'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === f ? 'bg-slate-800 text-brand-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
              notif.isRead
                ? 'bg-slate-900/40 border-slate-800/60'
                : 'glass-panel border-brand-500/30 shadow-md shadow-brand-500/5'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={notif.sender.avatar}
                alt={notif.sender.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-800">
                {getIcon(notif.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-200 leading-snug">
                <span className="font-bold text-slate-100 mr-1">{notif.sender.name}</span>
                {notif.message}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
            </div>

            {!notif.isRead && (
              <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
