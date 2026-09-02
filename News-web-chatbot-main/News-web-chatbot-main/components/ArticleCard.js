"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ArrowUpRight, Clock } from "lucide-react";
import { timeAgo } from "@/lib/categories";
import { proxiedImage } from "@/lib/imageProxy";
import { getEditorialFallback } from "@/lib/newsImages";

const CATEGORY_COLORS = {
  general: "from-rose-500/20 to-rose-500/5 text-rose-500 border-rose-500/20",
  technology: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
  business: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
  sports: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
  entertainment: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
  health: "from-teal-500/20 to-teal-500/5 text-teal-400 border-teal-500/20",
  science: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
};

export default function ArticleCard({
  article,
  index = 0,
  featured = false,
  onOpen,
  isBookmarked,
  onToggleBookmark,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const fallbackPhoto = getEditorialFallback(article.title, article.category, index);
  const displayImage = !imgFailed && article.image ? proxiedImage(article.image) : fallbackPhoto;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden glass-card cursor-pointer shadow-sm hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onClick={() => onOpen(article)}
    >
      <div
        className={`relative overflow-hidden bg-slate-900 dark:bg-black/50 ${
          featured ? "h-64 sm:h-80 md:h-96" : "h-48"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={article.title || ""}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Dark Gradient for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 pointer-events-none" />

        {/* Source and Category Tag Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold text-white uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-glow-rose" />
            <span className="truncate max-w-[130px]">{article.source || "News"}</span>
          </span>
          {article.category && (
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-slate-200 capitalize">
              {article.category}
            </span>
          )}
        </div>

        {/* Bookmark Quick Action Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article);
          }}
          aria-label={isBookmarked ? "Remove from reading list" : "Save to reading list"}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 rounded-full p-2 text-white transition-all shadow-md"
        >
          <motion.span
            key={isBookmarked ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {isBookmarked ? (
              <BookmarkCheck size={15} className="text-emerald-400" />
            ) : (
              <Bookmark size={15} className="text-slate-200 group-hover:text-white" />
            )}
          </motion.span>
        </motion.button>
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3">
        <div className="space-y-2">
          {/* Metadata timestamp */}
          <div className="flex items-center gap-2 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
            <Clock size={11} className="text-slate-400 dark:text-slate-500" />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          {/* Headline */}
          <h3
            className={`font-display font-semibold text-slate-900 dark:text-white leading-snug text-balance group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
              featured ? "text-xl sm:text-2xl md:text-3xl" : "text-base sm:text-lg"
            }`}
          >
            {article.title}
          </h3>

          {/* Description for featured article */}
          {featured && article.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 pt-1">
              {article.description}
            </p>
          )}
        </div>

        {/* Read More link hint */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
          <span>Read story</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}