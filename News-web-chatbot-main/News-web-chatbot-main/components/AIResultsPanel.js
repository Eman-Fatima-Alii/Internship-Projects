"use client";

import { X, Sparkles, Tv, Play, ExternalLink } from "lucide-react";

// Displays AI Intelligence briefing from ChatWidget on top of the main feed
export default function AIResultsPanel({ result, onClose }) {
  if (!result || result.isGreeting) return null;

  return (
    <div className="mb-8 rounded-3xl border border-indigo-500/30 dark:border-indigo-500/20 bg-gradient-to-b from-white to-slate-50 dark:from-[#0b0f17] dark:to-[#0f172a] shadow-xl shadow-indigo-500/5 overflow-hidden animate-fadeIn">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#0f172a] dark:via-indigo-950/60 dark:to-[#0b0f17] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-display font-bold text-base sm:text-lg leading-tight">
              Pulse Intelligence Briefing
            </p>
            <p className="text-[11px] font-mono text-indigo-200/80">
              Query: "{result.query}"
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close AI results"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body content */}
      <div className="p-5 sm:p-7 space-y-5">
        <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
          {result.answer}
        </div>

        {/* Verified TV Broadcasts */}
        {result.videos?.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08]">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Live & Verified Broadcast Reports
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
              {result.videos.slice(0, 10).map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-48 sm:w-56 group focus:outline-none"
                >
                  <div className="w-48 sm:w-56 h-30 sm:h-34 rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-200/80 dark:border-white/10 shadow-sm group-hover:shadow-lg group-hover:border-indigo-500/40 transition-all duration-300">
                    {v.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-rose-600/90 group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={16} className="fill-white ml-0.5" />
                      </div>
                    </div>

                    {v.channel && (
                      <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-md truncate max-w-[85%] border border-white/10">
                        {v.channel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug mt-2.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold transition-colors">
                    {v.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


