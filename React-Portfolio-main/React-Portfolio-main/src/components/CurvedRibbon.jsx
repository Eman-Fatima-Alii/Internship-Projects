import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TEXT =
  "✦ FULL STACK AI DEVELOPER ✦ MACHINE LEARNING & RAG ✦ REACT 19 & NEXT.JS ✦ PYTHON & FASTAPI ✦ PRODUCTION-READY BUILDS ✦ OPEN FOR WORK ✦ WORLDWIDE ✦";

export default function CurvedRibbon({
  text = DEFAULT_TEXT,
  className = "",
}) {
  const containerRef = useRef(null);
  const textPathRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textPath = textPathRef.current;
    if (!container || !textPath) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textPath,
        { attr: { startOffset: "-10%" } },
        {
          attr: { startOffset: "15%" },
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const repeatedText = `${text} ${text} ${text}`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative w-full overflow-hidden select-none pointer-events-none my-3 sm:my-6 z-20 ${className}`}
    >
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="w-full h-[90px] sm:h-[120px] md:h-[150px] block"
      >
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--cyan)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="ribbonBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--surface-solid)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--bg-subtle)" stopOpacity="0.9" />
          </linearGradient>

          <path
            id="ribbon-curve-path"
            d="M -200 110 C 200 180, 520 40, 900 110 C 1160 150, 1380 90, 1700 65"
            fill="none"
          />

          <filter id="ribbon-glow" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="var(--accent)" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Ambient background ribbon */}
        <path
          d="M -200 145 C 200 215, 520 75, 900 145 C 1160 185, 1380 125, 1700 100 L 1700 30 C 1380 55, 1160 115, 900 75 C 520 5, 200 145, -200 75 Z"
          fill="url(#ribbonBg)"
          stroke="url(#ribbonGrad)"
          strokeWidth="1.5"
          filter="url(#ribbon-glow)"
        />

        {/* Streaming text */}
        <text
          className="font-mono font-bold text-[13px] sm:text-[15px] md:text-[17px] uppercase tracking-wider"
          fill="var(--accent)"
          dy="6"
        >
          <textPath
            ref={textPathRef}
            href="#ribbon-curve-path"
            startOffset="0%"
            className="will-change-transform"
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

