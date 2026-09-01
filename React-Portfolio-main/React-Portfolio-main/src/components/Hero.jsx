import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles, Code2, Brain, MapPin, Zap } from "lucide-react";
import Marquee from "./Marquee";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";


gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { n: 3, prefix: "0", suffix: "", label: "Featured Projects", sub: "Production-ready & live" },
  { n: 5, prefix: "0", suffix: "", label: "Engineering Domains", sub: "AI, Full-Stack & ML" },
  { n: 100, prefix: "", suffix: "%", label: "End-to-End Ship", sub: "Architecture to Deploy" },
];

const MARQUEE_TECH = [
  "React 19",
  "Next.js",
  "Python",
  "AI Agents & RAG",
  "FastAPI",
  "TypeScript",
  "Node.js",
  "Tailwind CSS 4",
  "LangChain",
  "TensorFlow",
  "PostgreSQL",
  "Docker",
];

export default function Hero() {
  const sectionRef = useRef(null);
  const titleCharsRef = useRef([]);
  const countsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Character-by-character SplitText reveal animation
      if (titleCharsRef.current.length > 0) {
        gsap.fromTo(
          titleCharsRef.current,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.02,
            delay: 0.1,
          }
        );
      }

      // 2. Animated roll-up counters for stats with bidirectional ScrollTrigger
      countsRef.current.forEach((el, idx) => {
        if (!el) return;
        const target = STATS[idx].n;
        const countObj = { val: 0 };

        gsap.to(countObj, {
          val: target,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          onUpdate: () => {
            const formatted = STATS[idx].prefix + Math.round(countObj.val) + STATS[idx].suffix;
            el.textContent = formatted;
          },
        });
      });

      // 3. Smooth Hero Exit on Scroll
      gsap.to("[data-hero-stage]", {
        scale: 0.97,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const name1 = "EMAN";
  const name2 = "FATIMA";

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-8 overflow-hidden bg-grid-pattern"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="hero-mesh">
        <span style={{ width: 550, height: 550, top: -160, left: "5%", background: "var(--glow-1)" }} />
        <span style={{ width: 450, height: 450, top: -80, right: "5%", background: "var(--glow-2)" }} />
        <span style={{ width: 400, height: 400, bottom: -120, left: "35%", background: "var(--glow-3)" }} />
      </div>

      <div data-hero-stage className="relative z-10 max-w-6xl mx-auto w-full will-change-transform">
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Title, Subtitle, CTA & Channels */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <Reveal delay={60}>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs w-fit mb-4 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="radar-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider font-bold text-[var(--ink)]">
                  Available for Projects · Full-Stack + AI
                </span>
              </div>

              {/* Character Split Title */}
              <h1 className="font-display font-black tracking-tight leading-[0.92] text-[10.5vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.2vw] uppercase overflow-hidden">
                <div className="overflow-hidden whitespace-nowrap text-[var(--ink)]">
                  {name1.split("").map((char, i) => (
                    <span
                      key={i}
                      ref={(el) => (titleCharsRef.current[i] = el)}
                      className="inline-block will-change-transform"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
                <div className="overflow-hidden whitespace-nowrap gradient-text-accent mt-0.5">
                  {name2.split("").map((char, i) => (
                    <span
                      key={i + name1.length}
                      ref={(el) => (titleCharsRef.current[i + name1.length] = el)}
                      className="inline-block will-change-transform"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-[19px] leading-relaxed text-[var(--muted)] font-normal max-w-2xl">
                I build intelligent, production-grade products with AI woven in—from sleek, responsive
                <span className="text-[var(--ink)] font-medium"> Next.js & React</span> front ends to robust
                <span className="text-[var(--ink)] font-medium"> Python & Node.js</span> backends and LLM orchestration.
              </p>

              {/* Action Button Group */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Magnetic strength={0.25}>
                  <motion.a
                    href="#work"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center justify-center gap-2 font-mono font-bold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-ink)",
                      boxShadow: "0 8px 24px -6px var(--accent-glow)",
                    }}
                  >
                    <span>Explore Featured Work</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <motion.a
                    href="#method"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center justify-center gap-2 font-mono font-bold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full shadow-sm transition-all border cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    style={{
                      background: "var(--surface)",
                      color: "var(--ink)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <span>How I Build</span>
                    <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </motion.a>
                </Magnetic>
              </div>

              {/* Quick Tech Highlights Badge Row */}
              <div className="mt-8 flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Agentic LLM Systems</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  <span>Full-Stack Web</span>
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Glass Profile Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Reveal delay={90}>
              <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px]">
                {/* Background ambient lighting */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)] opacity-20 blur-xl group-hover:opacity-35 transition duration-700 pointer-events-none" />

                {/* Main Card Container */}
                <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300">
                  
                  {/* Portrait Image Container */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--bg-subtle)]">
                    <img
                      src="/eman.png"
                      alt="Eman Fatima"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent opacity-60" />
                    
                    {/* Live Location Tag on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-[var(--surface-solid)]/80 backdrop-blur-md border border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span className="font-mono text-[11px] font-semibold text-[var(--ink)]">
                          Pakistan · Remote
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[var(--accent)] px-2 py-0.5 rounded-md bg-[var(--accent-glow)]">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Floating Micro Tech Chips */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-4 px-3 py-1.5 rounded-xl bg-[var(--surface-solid)] border border-[var(--border)] shadow-xl flex items-center gap-2 backdrop-blur-md"
                  >
                    <Brain className="w-4 h-4 text-[var(--accent)]" />
                    <span className="font-mono text-[10.5px] font-bold text-[var(--ink)]">
                      AI & RAG
                    </span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -right-4 px-3 py-1.5 rounded-xl bg-[var(--surface-solid)] border border-[var(--border)] shadow-xl flex items-center gap-2 backdrop-blur-md"
                  >
                    <Code2 className="w-4 h-4 text-[var(--cyan)]" />
                    <span className="font-mono text-[10.5px] font-bold text-[var(--ink)]">
                      Full-Stack Dev
                    </span>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>

        </div>

        {/* Animated Metrics Bar */}
        <Reveal delay={160}>
          <div className="mt-14 sm:mt-18 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-y border-[var(--border)] py-6 sm:py-8">
            {STATS.map((s, idx) => (
              <div
                key={s.label}
                className="flex flex-col p-2 sm:p-3 rounded-2xl transition-colors hover:bg-[var(--surface)]"
              >
                <div
                  ref={(el) => (countsRef.current[idx] = el)}
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight text-[var(--accent)]"
                >
                  {s.prefix}{s.n}{s.suffix}
                </div>
                <div className="font-mono text-xs sm:text-[13px] font-bold text-[var(--ink)] mt-1.5 uppercase tracking-wide">
                  {s.label}
                </div>
                <div className="text-[12px] text-[var(--muted)] mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Live Tech Ticker */}
        <div className="mt-8 border-b border-[var(--border)] pb-8">
          <Marquee
            items={MARQUEE_TECH}
            speed={24}
            className="py-2 text-xs sm:text-sm font-mono font-medium text-[var(--muted)]"
          />
        </div>
      </div>
    </section>
  );
}

