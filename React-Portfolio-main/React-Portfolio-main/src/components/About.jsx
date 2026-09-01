import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Clock, CheckCircle2, Code2, Brain, Cpu, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";


const PILLARS = [
  {
    title: "Full-Stack Architecture",
    desc: "From responsive, accessible React/Next.js interfaces to robust Python/Node backends and database schemas.",
    icon: Code2,
  },
  {
    title: "AI Orchestration & RAG",
    desc: "Seamlessly weaving LLMs, embeddings, vector databases, and autonomous agents into business logic.",
    icon: Brain,
  },
  {
    title: "Production-First Mindset",
    desc: "Writing maintainable, thoroughly tested code that ships with high performance, SEO, and zero downtime.",
    icon: Cpu,
  },
];

const HIGHLIGHTS = [
  "End-to-end product delivery from spec to deployment",
  "AI used to accelerate velocity, not substitute craftsmanship",
  "Available for worldwide remote contracts & full-time roles",
  "Clean code architecture, strict type safety & git hygiene",
];

function LivePakistanClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
      <Clock className="w-3.5 h-3.5" />
      <span>{time || "Loading..."} PKT (UTC+5)</span>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <Reveal direction="up" yOffset={24} once={false}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                About The Developer
              </p>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--ink)]">
              Engineering Value & Background
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
              Based in Pakistan and collaborating with teams worldwide to design, build, and deploy high-impact web and AI solutions.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Large Card: Bio & Location */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">
                <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="font-mono text-xs uppercase font-bold text-[var(--ink)]">
                  Pakistan · Worldwide Remote
                </span>
              </div>
              <LivePakistanClock />
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--ink)] leading-snug tracking-tight mb-4">
              Building full-stack web products with <span className="gradient-text-accent">AI woven in</span> from the ground up.
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-[var(--muted)] leading-relaxed mb-6">
              I specialize in bridging the gap between modern, responsive front-end design and sophisticated AI backend infrastructure. Whether building conversational LLM systems, real-time analytics platforms, or scalable full-stack web apps, I prioritize clean architecture, rapid iteration, and measurable business outcomes.
            </p>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="font-mono text-xs uppercase font-bold text-[var(--ink)]">
                Status: Available for hire
              </span>
            </div>

            <Magnetic strength={0.2}>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-[var(--accent)] hover:underline"
              >
                <span>Get in touch directly</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right Side: Key Pillars Cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="p-5 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[var(--ink)]">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Full-width Highlights Strip */}
        <div className="md:col-span-12 p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
          <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-4">
            Core Engineering Principles
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-[13px] text-[var(--ink-secondary)] leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

