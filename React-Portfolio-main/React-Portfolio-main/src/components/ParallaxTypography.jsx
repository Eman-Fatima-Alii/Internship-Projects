import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  { text: "W", speed: 1.8, dir: -1, color: "var(--accent)" },
  { text: "O", speed: 2.4, dir: 1, color: "var(--surface-muted)" },
  { text: "R", speed: 1.5, dir: -1, color: "var(--accent)" },
  { text: "K", speed: 2.8, dir: 1, color: "var(--surface-muted)" },
];

export default function ParallaxTypography({ className = "" }) {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((rowEl, i) => {
        if (!rowEl) return;
        const config = ROWS[i];
        const moveDist = 180 * config.speed * config.dir;

        gsap.fromTo(
          rowEl,
          { x: -moveDist * 0.5 },
          {
            x: moveDist * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-around overflow-hidden pointer-events-none select-none z-0 ${className}`}
      style={{ opacity: 0.15 }}
    >
      {ROWS.map((row, idx) => (
        <div key={idx} className="overflow-hidden whitespace-nowrap leading-[0.78]">
          <div
            ref={(el) => (rowsRef.current[idx] = el)}
            className="font-display font-black uppercase text-[26vw] md:text-[14vw] tracking-tighter"
            style={{
              color: row.color,
              willChange: "transform",
            }}
          >
            <span>{row.text.repeat(16)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
