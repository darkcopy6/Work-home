import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Image,
  Send,
  Sparkles,
  CheckCircle2,
  MoreHorizontal,
  Bookmark,
  Layers,
  TrendingUp,
  Tag,
  Briefcase
} from 'lucide-react';

export const SocialFeed: React.FC = () => {
  const {
    posts,
    currentUser,
    likePost,
    addCommentToPost,
    createSocialPost,
    startOrOpenConversationWithUser,
    t,
  } = useApp();

  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);

  const tags = ['All', '#frontend', '#design', '#mobile', '#fullstack', '#cloud', '#hiring'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    createSocialPost(
      newPostText,
      postImagePreview || undefined,
      ['#portfolio', '#workhome', '#freelance']
    );

    setNewPostText('');
    setPostImagePreview(null);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommentToPost(postId, commentInput);
    setCommentInput('');
  };

  const handleAttachMockImage = () => {
    setPostImagePreview(
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    );
  };

  const filteredPosts = posts.filter(p => {
    if (selectedTag === 'All') return true;
    return p.tags.includes(selectedTag);
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
            <Layers className="h-3.5 w-3.5 text-teal-600" />
            <span>Professional Network & Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('communityFeed')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover case studies, work-in-progress demos, and engage with verified talents & employers worldwide
          </p>
        </div>
      </div>

      {/* Post Creator Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <textarea
            rows={3}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={`What project milestone, portfolio piece, or contract update are you working on, ${currentUser.name.split(' ')[0]}?`}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white resize-none"
          />
        </div>

        {postImagePreview && (
          <div className="relative rounded-2xl overflow-hidden max-h-48 border border-slate-200 dark:border-slate-800">
            <img src={postImagePreview} alt="attachment" className="w-full object-cover" />
            <button
              onClick={() => setPostImagePreview(null)}
              className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAttachMockImage}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              <Image className="h-4 w-4 text-teal-600" />
              <span>Attach Image</span>
            </button>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
            className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-40 transition-all"
          >
            Publish Post
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedTag === tag
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            {/* Author Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {post.authorName}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">{post.authorTitle} • {post.timestamp}</p>
                </div>
              </div>

              <button
                onClick={() => startOrOpenConversationWithUser(post.authorId, undefined, 'Project Inquiry')}
                className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 transition-colors"
              >
                Message
              </button>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Media Image */}
            {post.mediaUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img
                  src={post.mediaUrl}
                  alt="post media"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-500 transition-colors font-semibold"
                >
                  <Heart className={`h-4 w-4 ${post.likes > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-teal-600 transition-colors font-semibold"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentsCount} comments</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-semibold">
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>

            {/* Comment Drawer / Thread */}
            {activeCommentPostId === post.id && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-3">
                
                {/* Existing Comments */}
                <div className="space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <img src={c.authorAvatar} alt={c.authorName} className="h-7 w-7 rounded-xl object-cover mt-0.5" />
                      <div className="flex-1 rounded-xl bg-white p-2.5 shadow-2xs dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                          <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                    placeholder="Write a supportive reply or ask a technical question..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
