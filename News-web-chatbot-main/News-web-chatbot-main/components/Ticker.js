"use client";

import { Radio, Zap } from "lucide-react";

export default function Ticker({ articles, onOpenArticle }) {
  if (!articles || articles.length === 0) return null;

  const validArticles = articles.slice(0, 10).filter((a) => a.title);
  if (validArticles.length === 0) return null;

  // Duplicate the list so the CSS animation loops seamlessly
  const loop = [...validArticles, ...validArticles];

  return (
    <div className="w-full bg-[#070a0f] text-slate-100 overflow-hidden select-none border-b border-white/[0.08] shadow-sm relative z-30">
      <div className="flex items-center">
        {/* Glowing Live Beacon */}
        <div className="flex items-center gap-2 shrink-0 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider z-20 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="flex items-center gap-1">
            <Radio size={13} className="animate-pulse" />
            <span>BREAKING</span>
          </span>
        </div>

        {/* Scrolling Marquee */}
        <div className="relative flex-1 overflow-hidden py-2 group">
          <div className="flex whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]">
            {loop.map((article, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenArticle?.(article)}
                className="inline-flex items-center mx-5 text-xs sm:text-sm font-sans tracking-normal text-slate-300 hover:text-white transition-colors cursor-pointer focus:outline-none"
              >
                <span className="text-rose-400 font-mono font-semibold mr-2 text-[11px] uppercase tracking-wider">
                  [{article.source || "News"}]
                </span>
                <span className="hover:underline underline-offset-2">
                  {article.title}
                </span>
                <span className="ml-5 text-rose-500/60 font-bold">•</span>
              </button>
            ))}
          </div>

          {/* Fade edge mask */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#070a0f] to-transparent z-10" />
        </div>
      </div>
    </div>
  );
}


