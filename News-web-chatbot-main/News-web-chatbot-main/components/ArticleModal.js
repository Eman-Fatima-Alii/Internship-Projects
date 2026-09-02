"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Bookmark, BookmarkCheck, Share2, Check, Clock, User, Sparkles } from "lucide-react";
import { timeAgo } from "@/lib/categories";
import { proxiedImage } from "@/lib/imageProxy";
import { getEditorialFallback } from "@/lib/newsImages";

export default function ArticleModal({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) {
  const [copied, setCopied] = useState(false);
  const fallbackPhoto = article ? getEditorialFallback(article.title, article.category) : null;
  const displayImage = article?.image ? proxiedImage(article.image) : fallbackPhoto;

  const handleShare = () => {
    if (!article?.url) return;
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#0b0f17] border border-slate-200/90 dark:border-white/10 w-full sm:max-w-2xl lg:max-w-3xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            {/* Hero Image Container */}
            <div className="h-60 sm:h-80 lg:h-96 bg-slate-900 dark:bg-black/60 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={article.title || ""}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== fallbackPhoto) {
                    e.currentTarget.src = fallbackPhoto;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />

              {/* Floating Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg"
              >
                <X size={18} />
              </button>

              {/* Source & Category overlay */}
              <div className="absolute bottom-4 left-5 right-5 z-10 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {article.source || "News"}
                </span>
                {article.category && (
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-[11px] font-medium capitalize border border-white/20">
                    {article.category}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 ml-auto">
                  <Clock size={12} />
                  {timeAgo(article.publishedAt)}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-snug text-balance">
                  {article.title}
                </h2>

                {article.author && (
                  <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <User size={13} className="text-indigo-500" />
                    <span>Reported by {article.author}</span>
                  </div>
                )}
              </div>

              {/* Main Body Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {article.description || "No full synopsis available for this story. Continue to the original publisher for full continuous coverage."}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 dark:border-white/[0.08]">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-indigo-500 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold hover:opacity-95 shadow-lg shadow-indigo-500/15 transition-all"
                >
                  <span>Read full story on {article.source || "Publisher"}</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={() => onToggleBookmark(article)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 dark:border-white/15 bg-slate-100/80 dark:bg-white/[0.06] text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10 transition-colors shadow-sm"
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck size={16} className="text-emerald-500" />
                      <span>Saved in Reading List</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} className="text-slate-500 dark:text-slate-400" />
                      <span>Save for later</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Copy story link"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-slate-200 dark:border-white/15 bg-slate-100/80 dark:bg-white/[0.06] text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10 transition-colors shadow-sm ml-auto"
                >
                  {copied ? (
                    <>
                      <Check size={15} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={15} className="text-slate-500 dark:text-slate-400" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}