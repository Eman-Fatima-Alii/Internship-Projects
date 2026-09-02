"use client";

import { useEffect, useState } from "react";
import { Search, X, Globe2, Bookmark, Sun, Moon, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import { COUNTRIES } from "@/lib/countries";
import { useTheme } from "@/lib/useTheme";
import Dropdown from "@/components/Dropdown";

export default function Header({
  activeCategory,
  onCategoryChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  bookmarkCount,
  onOpenBookmarks,
  country,
  onCountryChange,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Masthead Row */}
        <div className="flex items-center justify-between h-16 md:h-18 gap-3 sm:gap-6">
          {/* Logo & Live Time */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSearchChange("");
                onSearchSubmit("");
                onCategoryChange("general");
              }}
              className="group flex items-baseline gap-1 focus:outline-none"
            >
              <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white transition-colors">
                PULSE
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-glow-rose group-hover:scale-125 transition-transform duration-300" />
            </a>

            {/* Date & Time pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/[0.07] text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentDate}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{currentTime}</span>
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchValue);
              }}
              className="relative w-full flex items-center group"
            >
              <div className="absolute left-3.5 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                <Search size={15} />
              </div>
              <input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search breaking stories, topics, keywords..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.09] rounded-full text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900/90 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm"
              />
              {searchValue && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    onSearchChange("");
                    onSearchSubmit("");
                  }}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            >
              {mobileSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            {/* Country Selector Dropdown */}
            <Dropdown
              value={country}
              icon={Globe2}
              label="Select country for news"
              onSelect={onCountryChange}
              items={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            />

            {/* Saved Articles (Reading List) Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onOpenBookmarks}
              aria-label="Open reading list"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors shadow-sm text-xs font-medium"
            >
              <Bookmark size={15} className={bookmarkCount > 0 ? "text-indigo-500 fill-indigo-500/20" : "text-slate-400 dark:text-slate-500"} />
              <span className="hidden sm:inline">Saved</span>
              {bookmarkCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-sm">
                  {bookmarkCount}
                </span>
              )}
            </motion.button>

            {/* Dark / Light Theme Toggle */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{ scale: 0.88, rotate: 15 }}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm"
            >
              <AnimatePresence mode="wait" initial={false}>
                {!mounted ? (
                  <span className="w-4 h-4" />
                ) : theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="flex text-amber-400"
                  >
                    <Sun size={16} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="flex text-slate-700"
                  >
                    <Moon size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchValue);
                setMobileSearchOpen(false);
              }}
              className="md:hidden flex items-center gap-2 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-full px-3.5 py-2 overflow-hidden shadow-inner"
            >
              <Search size={15} className="text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                autoFocus
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search news, topics, keywords..."
                className="bg-transparent outline-none text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 flex-1 min-w-0"
              />
              {searchValue && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    onSearchChange("");
                    onSearchSubmit("");
                  }}
                  className="text-slate-400"
                >
                  <X size={14} />
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Category Pill Tabs Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 -mx-1 px-1 border-t border-slate-200/50 dark:border-white/[0.05]">
          {CATEGORIES.map((cat) => {
            const isActive = !searchValue && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSearchChange("");
                  onSearchSubmit("");
                  onCategoryChange(cat.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.05]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-indigo-600 dark:to-indigo-500 -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-rose-500 via-indigo-500 to-cyan-400 opacity-90" />
    </header>
  );
}


