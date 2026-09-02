export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/[0.08] mt-20 bg-white/60 dark:bg-[#070a0f]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                PULSE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-glow-rose" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live global news aggregation, TV broadcasts & real-time AI intelligence.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Powered by{" "}
              <a
                href="https://newsapi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline"
              >
                NewsAPI.org
              </a>
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Pulse News</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


