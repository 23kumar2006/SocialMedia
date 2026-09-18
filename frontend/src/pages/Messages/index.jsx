import React, { useState } from 'react';
import { Send, Image, Smile, Search, MoreVertical, Phone, Video, CheckCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { RoleBadge } from '../../components/common/Badge';

const mockConversations = [
  {
    id: 'c1',
    user: {
      name: 'Elena Rostova',
      username: 'elena_tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'creator',
      isOnline: true,
    },
    lastMessage: 'Let us collaborate on the new React tutorial next week!',
    time: '10:45 AM',
    unread: 2,
  },
  {
    id: 'c2',
    user: {
      name: 'Nexus Robotics',
      username: 'nexus_robotics',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      role: 'organization',
      isOnline: false,
    },
    lastMessage: 'Your application for the Senior Full-Stack role has been received.',
    time: 'Yesterday',
    unread: 0,
  },
];

export const Messages = () => {
  const [conversations] = useState(mockConversations);
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'them', text: 'Hey there! How is SocialSphere coming along?', time: '10:40 AM' },
    { id: 'm2', sender: 'me', text: 'It is amazing! Category feeds are working smoothly.', time: '10:42 AM' },
    { id: 'm3', sender: 'them', text: 'Let us collaborate on the new React tutorial next week!', time: '10:45 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: 'me',
        text: inputMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] rounded-2xl glass-panel border border-slate-800 flex overflow-hidden">
      {/* Conversations List Panel */}
      <div className="w-full sm:w-80 border-r border-slate-800 flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3.5 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100 mb-2">Direct Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
          {conversations.map((conv) => {
            const isSelected = selectedConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-850' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                  />
                  {conv.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-dark-bg" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200 truncate">{conv.user.name}</p>
                    <span className="text-[10px] text-slate-500">{conv.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                </div>

                {conv.unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                    {conv.unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Thread Panel */}
      <div className="hidden sm:flex flex-1 flex-col bg-dark-bg/50">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConv.user.avatar}
                  alt={selectedConv.user.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-100">{selectedConv.user.name}</h3>
                    <RoleBadge role={selectedConv.user.role} />
                  </div>
                  <span className="text-[10px] text-emerald-400">Online</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-2 hover:text-white rounded-lg hover:bg-slate-800">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:text-white rounded-lg hover:bg-slate-800">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 hover:text-white rounded-lg hover:bg-slate-800">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-500 text-white rounded-br-xs shadow-md shadow-brand-500/20'
                          : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Image className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Button type="submit" size="sm" variant="primary" icon={Send} className="px-3" />
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
