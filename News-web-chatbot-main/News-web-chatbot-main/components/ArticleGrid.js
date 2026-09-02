"use client";

import { useEffect, useRef } from "react";
import { Newspaper, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import ArticleCard from "./ArticleCard";
import SkeletonCard from "./SkeletonCard";

export default function ArticleGrid({
  articles,
  status,
  error,
  onOpen,
  isBookmarked,
  onToggleBookmark,
  onRetry,
  hasMore,
  onLoadMore,
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore || status === "loading" || status === "loadingMore" || status === "error") {
      return;
    }
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && status !== "loadingMore") {
          onLoadMore();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, status, hasMore, articles.length]);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard featured />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-16 px-6 glass-card rounded-2xl max-w-lg mx-auto shadow-sm border border-rose-500/20">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
          Unable to Load Stories
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {error || "An unexpected error occurred while fetching the live news feed."}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-indigo-500 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md hover:opacity-95 transition-opacity"
        >
          <RefreshCw size={13} />
          Retry Connection
        </button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20 px-6 glass-card rounded-2xl max-w-lg mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4">
          <Newspaper size={24} />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
          No Stories Found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Try searching with different keywords like <span className="font-semibold text-slate-800 dark:text-slate-200">"Artificial Intelligence"</span> or select another category above.
        </p>
      </div>
    );
  }

  const [first, ...rest] = articles;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ArticleCard
          key={first.url || first.id}
          article={first}
          index={0}
          featured
          onOpen={onOpen}
          isBookmarked={isBookmarked(first.id)}
          onToggleBookmark={onToggleBookmark}
        />
        {rest.map((article, i) => (
          <ArticleCard
            key={article.url || article.id}
            article={article}
            index={i + 1}
            onOpen={onOpen}
            isBookmarked={isBookmarked(article.id)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {/* Invisible sentinel trigger for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-4 w-full my-4" aria-hidden />}

      {status === "loadingMore" && (
        <div className="flex justify-center py-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel text-xs font-mono text-slate-600 dark:text-slate-300 shadow-sm">
            <span className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span>Loading continuous feed…</span>
          </div>
        </div>
      )}

      {!hasMore && status !== "loadingMore" && articles.length > 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <Sparkles size={12} className="text-indigo-400" />
            <span>You have reached the end of current headlines</span>
          </div>
        </div>
      )}
    </>
  );
}


