import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BookOpen, Search, User, Clock, ArrowLeft, Heart, Share2, HelpCircle } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const url = `/articles?search=${search}${selectedTag ? `&tag=${selectedTag}` : ''}`;
      const { data } = await API.get(url);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, selectedTag]);

  // Aggregate all tags from all articles to show a filter list
  const allTags = Array.from(
    new Set(articles.reduce((acc, art) => [...acc, ...art.tags], []))
  );

  if (selectedArticle) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-[-2px]" />
          <span>Back to Articles Directory</span>
        </button>

        {/* Article Cover */}
        {selectedArticle.coverImage && (
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 border border-neutral-100 shadow-inner">
            <img
              src={selectedArticle.coverImage}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selectedArticle.tags.map((tag, idx) => (
              <span
                key={idx}
                onClick={() => {
                  setSelectedTag(tag);
                  setSelectedArticle(null);
                }}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-all"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-950 leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-semibold uppercase mt-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center space-x-1">
              <User className="h-3.5 w-3.5 text-neutral-400" />
              <span>{selectedArticle.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              <span>{selectedArticle.readTime} read</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Published: {new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <article className="prose prose-emerald max-w-none text-sm sm:text-base leading-relaxed text-neutral-700 space-y-4 whitespace-pre-line">
          {selectedArticle.content}
        </article>

        {/* Bottom review disclaimer */}
        <div className="mt-12 bg-neutral-50/50 border border-neutral-100 rounded-2xl p-4 text-xs text-neutral-400 text-center">
          Written by professional practitioners of the Ayurveda Seasonal Advisory team. Always consult a physician for diagnostic guidelines.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-extrabold text-emerald-950">AyurVeda Insights Library</h1>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-1">
          Ancient Wisdom Mapped to Modern Lifestyles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Tag list & Search */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search bar */}
          <div className="bg-white border border-neutral-100 p-4 rounded-3xl shadow-sm">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Search Library</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 focus:border-emerald-500 focus:outline-none text-xs transition-colors"
              />
            </div>
          </div>

          {/* Tags cloud */}
          <div className="bg-white border border-neutral-100 p-4 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-50 pb-2">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Topics</span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.length === 0 ? (
                <span className="text-[11px] text-neutral-400 italic">No topics found.</span>
              ) : (
                allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Articles Listing */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl">
              <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm font-semibold">No articles found matching filters.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {articles.map((art) => (
                <div
                  key={art._id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* cover image left if exists */}
                  {art.coverImage && (
                    <div className="w-full md:w-44 h-32 rounded-2xl overflow-hidden shrink-0 border border-neutral-100">
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {art.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display font-bold text-neutral-900 text-lg hover:text-emerald-700 transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {art.content.replace(/[#*`]/g, '').slice(0, 160)}...
                    </p>

                    <div className="flex items-center space-x-3 text-[10px] text-neutral-400 font-semibold uppercase pt-2">
                      <span>By {art.author}</span>
                      <span>•</span>
                      <span>{art.readTime} read</span>
                      <span>•</span>
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
