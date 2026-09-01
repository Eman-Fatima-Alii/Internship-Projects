import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#method", label: "Method" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? y / max : 0);

      if (y < 120) {
        setActive("#top");
        return;
      }

      const viewportCenter = window.innerHeight * 0.35;
      let current = "#top";

      for (const l of LINKS) {
        const el = document.querySelector(l.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom > 0) {
            current = l.href;
          }
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleLinkClick = (href) => {
    setActive(href);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-md"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a
          href="#top"
          onClick={() => handleLinkClick("#top")}
          className="group flex items-center gap-2.5 font-display font-bold tracking-tight text-base sm:text-lg select-none"
        >
          <div className="relative w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-xs group-hover:border-[var(--accent)] transition-colors">
            <span className="font-mono text-xs font-black text-[var(--accent)]">EF</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight font-display font-bold text-sm sm:text-[15px]">
              Eman Fatima
            </span>
            <span className="font-mono text-[9px] text-[var(--muted)] tracking-wider uppercase font-semibold">
              Full Stack · AI
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm backdrop-blur-lg">
          {LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => handleLinkClick(l.href)}
                className={`relative px-4 py-1.5 rounded-full font-mono text-[11.5px] uppercase tracking-wider font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-[var(--accent-ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--accent)] shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Action & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <motion.a
            href="#contact"
            onClick={() => handleLinkClick("#contact")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-mono font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.a>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => handleLinkClick(l.href)}
                    className={`flex items-center justify-between p-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                      active === l.href
                        ? "bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px]">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <a
                href="#contact"
                onClick={() => handleLinkClick("#contact")}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-xs uppercase font-bold text-center"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Page Scroll Progress Indicator */}
      <div className="progress-bar absolute bottom-0 inset-x-0" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}

