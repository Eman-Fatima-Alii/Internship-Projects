"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, BookmarkX, BookOpen, Clock, Trash2 } from "lucide-react";
import { timeAgo } from "@/lib/categories";
import { proxiedImage } from "@/lib/imageProxy";
import { getEditorialFallback } from "@/lib/newsImages";

export default function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  onToggleBookmark,
  onOpenArticle,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-2xl shadow-2xl overflow-y-auto no-scrollbar border-l border-slate-200/80 dark:border-white/10 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/10 sticky top-0 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-none">
                    Reading List
                  </h2>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {bookmarks.length} {bookmarks.length === 1 ? "saved story" : "saved stories"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close reading list"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {bookmarks.length === 0 ? (
                <div className="py-24 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200 dark:border-white/10">
                    <BookOpen size={22} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-slate-200 mb-2">
                    Your reading list is empty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Save any story by tapping the bookmark button on any article card to read later.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {bookmarks.map((article, idx) => {
                    const fallback = getEditorialFallback(article.title, article.category, idx);
                    const displayImg = article.image ? proxiedImage(article.image) : fallback;

                    return (
                      <motion.li
                        key={article.id || idx}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group p-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/15 hover:shadow-md transition-all cursor-pointer flex gap-3.5"
                        onClick={() => onOpenArticle(article)}
                      >
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 relative border border-slate-200/60 dark:border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={displayImg}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 mb-1">
                              <span className="text-rose-500 font-semibold">{article.source || "News"}</span>
                              <span>•</span>
                              <span>{timeAgo(article.publishedAt)}</span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {article.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-mono text-indigo-500 font-medium">Read article →</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(article);
                              }}
                              aria-label="Remove from reading list"
                              className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
                            >
                              <BookmarkX size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}