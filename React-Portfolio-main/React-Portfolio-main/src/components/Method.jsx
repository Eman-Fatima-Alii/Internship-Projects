import { motion } from "framer-motion";
import { CheckCircle2, Cpu, FileCode2, Rocket, Sparkles, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";


const STEPS = [
  {
    n: "01",
    title: "Brief & Scope",
    desc: "Extracting exact technical requirements, user stories, and strict taste benchmarks.",
    icon: Sparkles,
  },
  {
    n: "02",
    title: "Architecture Spec",
    desc: "Designing the data schema, API contracts, security rules, and performance constraints.",
    icon: FileCode2,
  },
  {
    n: "03",
    title: "AI-Powered Build",
    desc: "Rapid modular implementation utilizing leading agentic models & LLM tooling.",
    icon: Cpu,
  },
  {
    n: "04",
    title: "Rigorous Review",
    desc: "Auditing every single git diff, running test suites, stress-testing edge cases & refactoring.",
    icon: ShieldCheck,
  },
  {
    n: "05",
    title: "Production Ship",
    desc: "Deployment to cloud infrastructure, DNS routing, domain setup, and performance tuning.",
    icon: Rocket,
  },
];

const TOOLS = [
  "CLAUDE CODE",
  "ANTIGRAVITY",
  "CURSOR / CODEX",
  "LANGGRAPH",
  "FASTAPI",
  "DOCKER",
  "POSTMAN",
];

export default function Method() {
  return (
    <section
      id="method"
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <Reveal direction="up" yOffset={24} once={false}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                Workflow & Process
              </p>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--ink)]">
              How I Build & Ship
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
              AI accelerates implementation 10x; the architecture, code review, unit tests, and production ship decision remain 100% human-verified.
            </p>
          </div>
        </div>
      </Reveal>

      {/* 5-Stage Engineering Roadmap Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xl transition-all select-none overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-black text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                    {step.n}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <span>Production Checked</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Tooling Ecosystem Marquee / Chips */}
      <Reveal delay={100} direction="up" yOffset={20} once={false}>
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-[var(--ink)]">
                AI Orchestration & Engineering Tooling
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                Leveraging the industry's state-of-the-art agentic tools to maximize velocity.
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] shrink-0">
              State-of-the-Art
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {TOOLS.map((tool) => (
              <Magnetic key={tool} strength={0.2}>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-default inline-block">
                  {tool}
                </span>
              </Magnetic>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}