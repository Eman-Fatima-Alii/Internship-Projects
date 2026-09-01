import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "../data/projects";
import ProjectIcon from "./ProjectIcon";


const ROWS = [
  { text: "W", speed: 40 },
  { text: "O", speed: 34 },
  { text: "R", speed: 46 },
  { text: "K", speed: 30 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.94, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

function MockCard({ p, i, isMobile = false }) {
  return (
    <motion.a
      href={p.link || p.github || "#work"}
      target={p.link || p.github ? "_blank" : undefined}
      rel={p.link || p.github ? "noreferrer" : undefined}
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className={`glow-card group relative block rounded-2xl md:rounded-3xl border overflow-hidden shadow-2xl bg-[var(--surface)] transition-colors duration-300 flex flex-col justify-between cursor-pointer ${
        isMobile
          ? "w-[82vw] max-w-[320px] sm:max-w-[360px] shrink-0 snap-center select-none"
          : "h-full"
      }`}
      style={{ borderColor: "var(--border)", transformStyle: "preserve-3d", willChange: "transform, opacity" }}
    >
      {/* Top Browser Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-black/5" style={{ background: "rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 shadow-inner" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 shadow-inner" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 shadow-inner" />
        </div>
        <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold opacity-70 px-2 py-0.5 rounded bg-black/10 text-[var(--surface-ink)]">
          {p.tag}
        </span>
      </div>

      {/* Main Visual Header Area */}
      <div className="relative h-32 sm:h-44 md:h-52 grid place-items-center overflow-hidden group" style={{ background: p.gradient }}>
        {/* Animated background shapes/glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 opacity-70" />
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/20 blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        
        {/* Giant background number overlay */}
        <span
          className="absolute -right-2 -bottom-4 font-display font-black text-white/20 leading-none select-none pointer-events-none group-hover:scale-110 group-hover:text-white/30 transition-all duration-500 text-6xl sm:text-7xl md:text-8xl"
        >
          0{i + 1}
        </span>

        {/* Center Animated Icon Badge */}
        <div className="relative z-10 p-3.5 sm:p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <ProjectIcon icon={p.icon} className="w-7 h-7 sm:w-11 sm:h-11 text-white drop-shadow-md" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10 font-mono text-[9px] sm:text-[11px] uppercase tracking-wider font-bold bg-black/40 text-white backdrop-blur-md rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 border border-white/20 shadow-md">
          {p.status}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3.5 sm:p-5 md:p-6 flex-1 flex flex-col justify-between" style={{ background: "var(--surface)" }}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-display font-bold text-base sm:text-xl md:text-2xl tracking-tight" style={{ color: "var(--surface-ink)" }}>
              {p.name}
            </h3>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 grid place-items-center text-xs font-bold shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "var(--surface-ink)" }}>
              ↗
            </span>
          </div>
          <p className="text-xs sm:text-[13px] md:text-[14px] leading-relaxed line-clamp-2" style={{ color: "var(--surface-muted)" }}>
            {p.desc}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-md px-2 py-0.5 sm:px-2.5 sm:py-1 border border-black/10 bg-black/5"
              style={{ color: "var(--surface-ink)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function GiantMarquee() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll(".snap-center");
    if (!cards.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setCurrentIndex(closestIndex);
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll(".snap-center");
    if (cards[index]) {
      const card = cards[index];
      const scrollPosition = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % PROJECTS.length;
    scrollToIndex(next);
  };

  const prevSlide = () => {
    const prev = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    scrollToIndex(prev);
  };

  return (
    <div
      id="work"
      className="relative overflow-hidden select-none border-y border-[var(--border)] min-h-[580px] sm:min-h-[600px] md:min-h-[620px] py-8 md:py-16 flex flex-col justify-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Background Marquee Animated Text */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-90">
        {ROWS.map((row, i) => (
          <div key={i} className="overflow-hidden whitespace-nowrap leading-[0.8]" style={{ opacity: 0.92 - i * 0.06 }}>
            <div
              className="marquee-track font-display font-bold uppercase text-[24vw] md:text-[11vw]"
              style={{ color: "var(--coral)", animationDuration: `${row.speed}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
            >
              <span className="shrink-0 pr-8">{row.text.repeat(20)}</span>
              <span className="shrink-0 pr-8" aria-hidden="true">{row.text.repeat(20)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Overlay Cards Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {/* Desktop View: 3-column Grid (md and up) */}
        <div className="hidden md:flex w-full items-center justify-center px-4 sm:px-8 py-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full max-w-6xl grid grid-cols-3 gap-6 md:gap-8"
          >
            {PROJECTS.map((p, i) => (
              <MockCard key={p.name} p={p} i={i} />
            ))}
          </motion.div>
        </div>

        {/* Mobile View: Swipeable Horizontal Carousel (< md) */}
        <div className="block md:hidden w-full">
          {/* Touch-Scrollable Horizontal Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4.5 px-6 pb-2 scrollbar-none touch-pan-x items-stretch scroll-smooth"
            style={{
              scrollPaddingLeft: "1.5rem",
              scrollPaddingRight: "1.5rem",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {PROJECTS.map((p, i) => (
              <MockCard key={p.name} p={p} i={i} isMobile={true} />
            ))}
          </div>

          {/* Mobile Bottom Navigation Bar: Prev Button, Indicator Dots, Next Button */}
          <div className="flex items-center justify-between px-6 mt-4">
            <button
              onClick={prevSlide}
              aria-label="Previous project"
              className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--surface-ink)] font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              ←
            </button>

            {/* Interactive Pagination Dots */}
            <div className="flex items-center gap-2">
              {PROJECTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to project ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-[var(--accent)] shadow-sm"
                      : "w-2.5 bg-[var(--muted)]/40 hover:bg-[var(--muted)]/70"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next project"
              className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--surface-ink)] font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}