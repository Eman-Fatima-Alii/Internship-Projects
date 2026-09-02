"use client";

import { RefreshCw, Activity, Sparkles } from "lucide-react";

export default function LiveStatusBar({ title, lastUpdated, status, onRefresh }) {
  const isRefreshing = status === "refreshing" || status === "loading";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-7 sm:h-8 rounded-full bg-gradient-to-b from-rose-500 via-indigo-500 to-cyan-400 shrink-0" aria-hidden />
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh feed"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <RefreshCw
            size={13}
            className={`${isRefreshing ? "animate-spin text-indigo-500" : "text-slate-400 dark:text-slate-500"}`}
          />
          <span>
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Syncing..."}
          </span>
        </button>
      </div>
    </div>
  );
}


