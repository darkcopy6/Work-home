import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import { translateTextSimulated } from '../../i18n/translations';
import {
  MessageSquare,
  Send,
  Mic,
  Image,
  Paperclip,
  Smile,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Search,
  Sparkles,
  Lock,
  Globe,
  Play,
  Pause,
  ArrowLeft,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

export const MessagesChat: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    language,
    t,
    navigateTo,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [translateChat, setTranslateChat] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, messageInput);
    setMessageInput('');
  };

  const handleSendVoice = () => {
    if (!activeConversation) return;
    setIsRecordingVoice(false);
    sendMessage(activeConversation.id, 'Voice note (0:08)', 'audio', undefined, {
      audioDuration: 8,
    });
  };

  const handleSendMockImage = () => {
    if (!activeConversation) return;
    sendMessage(
      activeConversation.id,
      'Attached architecture diagram draft',
      'image',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      
      <div className="h-[760px] rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 overflow-hidden grid grid-cols-1 md:grid-cols-3">
        
        {/* Left Col: Conversations Thread List */}
        <div className={`md:block ${activeConversationId ? 'hidden md:block' : 'block'} border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40`}>
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{t('messages')}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                {conversations.length} Active
              </span>
            </h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {conversations.map((conv) => {
              const other = conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];
              const isSelected = activeConversation?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`cursor-pointer p-4 transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-l-4 border-teal-500'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={other.avatar}
                      alt={other.name}
                      className="h-11 w-11 rounded-2xl object-cover"
                    />
                    {other.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {other.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {conv.messages[conv.messages.length - 1]?.timestamp || '12:45 PM'}
                      </span>
                    </div>

                    {conv.jobTitle && (
                      <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 truncate">
                        {conv.jobTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Chat Conversation */}
        <div className={`md:col-span-2 ${!activeConversationId ? 'hidden md:flex' : 'flex'} flex-col h-full bg-white dark:bg-slate-900`}>
          
          {activeConversation ? (
            <>
              {/* Chat Header */}
              {(() => {
                const other = activeConversation.participants.find(p => p.id !== currentUser.id) || activeConversation.participants[0];
                return (
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveConversationId('')}
                        className="md:hidden p-1 text-slate-500 hover:text-slate-700"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>

                      <div className="relative">
                        <img
                          src={other.avatar}
                          alt={other.name}
                          className="h-10 w-10 rounded-2xl object-cover"
                        />
                        {other.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                          {other.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {other.online ? 'Active now' : 'Last seen 2h ago'} • {activeConversation.jobTitle || 'General Inquiry'}
                        </p>
                      </div>
                    </div>

                    {/* Chat Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTranslateChat(!translateChat)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                          translateChat
                            ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                            : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Globe className="h-3 w-3" />
                        <span>{translateChat ? 'Showing Translated' : 'Translate Chat'}</span>
                      </button>

                      <button
                        onClick={() => navigateTo('wallet')}
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Escrow Vault</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Messages Flow Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Security Banner */}
                <div className="mx-auto max-w-sm rounded-2xl bg-teal-50/70 p-2.5 text-center text-[11px] text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <span>Always keep contract payments inside WorkHome Escrow for 100% protection.</span>
                </div>

                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const displayContent = translateChat
                    ? translateTextSimulated(msg.content, language)
                    : msg.content;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs shadow-xs ${
                          isMe
                            ? 'bg-teal-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-xs'
                        }`}
                      >
                        {/* Audio Message */}
                        {msg.type === 'audio' ? (
                          <div className="flex items-center gap-3 py-1">
                            <button
                              onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                isMe ? 'bg-white text-teal-700' : 'bg-teal-600 text-white'
                              }`}
                            >
                              {playingAudioId === msg.id ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                            </button>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 h-3">
                                {[20, 60, 40, 80, 50, 90, 70, 40, 60].map((h, i) => (
                                  <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className={`w-1 rounded-full ${isMe ? 'bg-white/80' : 'bg-slate-400'}`}
                                  />
                                ))}
                              </div>
                              <span className={`text-[10px] mt-1 ${isMe ? 'text-teal-100' : 'text-slate-400'}`}>
                                {playingAudioId === msg.id ? 'Playing voice note...' : 'Voice Note (0:08)'}
                              </span>
                            </div>
                          </div>
                        ) : msg.type === 'image' ? (
                          <div>
                            <img
                              src={msg.fileUrl}
                              alt="attachment"
                              className="rounded-xl mb-2 max-h-48 w-full object-cover"
                            />
                            <p>{displayContent}</p>
                          </div>
                        ) : (
                          <p className="leading-relaxed whitespace-pre-wrap">{displayContent}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="h-3 w-3 text-teal-600" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                
                {isRecordingVoice ? (
                  <div className="flex items-center justify-between rounded-2xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                      <span className="text-xs font-bold font-mono">Recording Voice Note... 0:{recordingSeconds.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRecordingVoice(false)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendVoice}
                        className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                      >
                        Send Audio
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSendMockImage}
                        className="p-2 text-slate-400 hover:text-teal-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Attach image"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRecordingVoice(true)}
                        className="p-2 text-slate-400 hover:text-teal-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Record voice note"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message, ask a question, or clarify milestones..."
                      className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />

                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-40 transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Select a conversation to start messaging
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Communicate directly with clients or freelancers, share voice notes, and review escrow progress.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
