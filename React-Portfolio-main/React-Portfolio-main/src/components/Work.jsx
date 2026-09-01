import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Terminal } from "lucide-react";
import { PROJECTS } from "../data/projects";
import ProjectIcon from "./ProjectIcon";
import { GithubIcon } from "./Icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";



const GITHUB_PROFILE = "https://github.com/Eman-Fatima-Alii/Internship-Projects";

function ProjectCard({ p, i }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 md:p-8 shadow-xl transition-all duration-300 hover:border-[var(--accent)] hover:shadow-2xl overflow-hidden"
      style={{
        boxShadow: isHovered
          ? "0 20px 40px -15px var(--accent-glow)"
          : "var(--card-shadow)",
      }}
    >
      {/* Dynamic ambient color glow behind the card on hover */}
      <div
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full opacity-10 group-hover:opacity-25 blur-3xl transition-opacity duration-500 pointer-events-none"
        style={{ background: p.gradient }}
      />

      <div>
        {/* Top Header: Tag & Number */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--accent)]">
              {p.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              {p.status}
            </span>
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-[var(--muted)]/40 group-hover:text-[var(--accent)] transition-colors">
            0{i + 1}
          </span>
        </div>

        {/* Project Visual Banner */}
        <div
          className="relative h-44 sm:h-52 md:h-56 rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-6"
          style={{ background: p.gradient }}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

          {/* Project Icon Badge */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 grid place-items-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <ProjectIcon icon={p.icon} className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
          </div>

          <span className="absolute bottom-3 left-4 z-10 font-mono text-[11px] font-bold uppercase tracking-widest text-white/80">
            {p.name}
          </span>
        </div>

        {/* Project Title & Description */}
        <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-2.5">
          {p.name}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-6 line-clamp-3">
          {p.desc}
        </p>

        {/* Stack Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {p.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--ink-secondary)]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
        <Magnetic strength={0.2}>
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] shadow-md transition-all duration-200 hover:scale-102"
          >
            <span>Live Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </Magnetic>

        <Magnetic strength={0.2}>
          <a
            href={p.github || GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--ink)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <GithubIcon size={14} />
            <span>Code</span>
          </a>
        </Magnetic>
      </div>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <Reveal direction="up" yOffset={24} once={false}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                Selected Portfolio
              </p>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--ink)]">
              Featured Production Builds
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
              Real-time applications, AI-integrated workflows, and responsive architectures engineered with production performance and clean code standards.
            </p>
          </div>

          <Magnetic strength={0.25}>
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-wider px-5 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm shrink-0"
            >
              <GithubIcon size={16} />
              <span>Explore GitHub Repos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </Magnetic>
        </div>
      </Reveal>

      {/* 3-Column Bento Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} p={p} i={i} />
        ))}
      </div>

      {/* Bottom Info Banner */}
      <Reveal delay={120} direction="up" yOffset={20} once={false}>
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-[var(--ink)]">
                Have a custom application or AI model in mind?
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                From initial technical specification to production cloud deployment, I ship fast.
              </p>
            </div>
          </div>

          <Magnetic strength={0.3}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-wider px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-md hover:scale-105 transition-transform shrink-0"
            >
              <span>Start A Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

