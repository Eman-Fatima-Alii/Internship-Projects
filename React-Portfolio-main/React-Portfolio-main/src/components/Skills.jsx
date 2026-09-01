import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Code2, Cpu, Cloud, Search, Sparkles, Terminal } from "lucide-react";
import Reveal from "./Reveal";


const CATEGORIES = [
  { id: "all", label: "All Skills", icon: Sparkles },
  { id: "ai", label: "AI & LLM Orchestration", icon: Brain },
  { id: "frontend", label: "Frontend & UI", icon: Code2 },
  { id: "backend", label: "Backend & APIs", icon: Terminal },
  { id: "ml", label: "Machine Learning", icon: Cpu },
  { id: "cloud", label: "Cloud & DevOps", icon: Cloud },
];

const SKILLS_DATA = [
  // AI & Agents
  { name: "Claude Code", category: "ai", level: "Advanced", hot: true },
  { name: "RAG Pipelines", category: "ai", level: "Advanced", hot: true },
  { name: "Tool Calling", category: "ai", level: "Advanced", hot: true },
  { name: "Model Context Protocol (MCP)", category: "ai", level: "Advanced", hot: true },
  { name: "LangChain", category: "ai", level: "Proficient" },
  { name: "LangGraph", category: "ai", level: "Proficient" },
  { name: "Langflow", category: "ai", level: "Proficient" },
  { name: "Qdrant Vector DB", category: "ai", level: "Proficient" },
  { name: "Ollama", category: "ai", level: "Proficient" },
  { name: "Sub-Agents Architecture", category: "ai", level: "Advanced", hot: true },
  { name: "Prompt Engineering", category: "ai", level: "Advanced" },
  { name: "Antigravity", category: "ai", level: "Advanced", hot: true },
  { name: "Workflow Automation", category: "ai", level: "Proficient" },

  // Frontend
  { name: "React 19", category: "frontend", level: "Advanced", hot: true },
  { name: "Next.js", category: "frontend", level: "Advanced", hot: true },
  { name: "TypeScript", category: "frontend", level: "Advanced" },
  { name: "JavaScript (ES6+)", category: "frontend", level: "Advanced" },
  { name: "Tailwind CSS 4", category: "frontend", level: "Advanced", hot: true },
  { name: "GSAP & ScrollTrigger", category: "frontend", level: "Proficient" },
  { name: "Framer Motion", category: "frontend", level: "Advanced" },
  { name: "Vite", category: "frontend", level: "Advanced" },
  { name: "Three.js", category: "frontend", level: "Familiar" },

  // Backend
  { name: "Python", category: "backend", level: "Advanced", hot: true },
  { name: "FastAPI", category: "backend", level: "Advanced", hot: true },
  { name: "Node.js", category: "backend", level: "Advanced" },
  { name: "RESTful APIs", category: "backend", level: "Advanced" },
  { name: "WebSockets", category: "backend", level: "Proficient" },
  { name: "PostgreSQL", category: "backend", level: "Proficient" },
  { name: "Firebase / Firestore", category: "backend", level: "Proficient" },

  // Machine Learning
  { name: "TensorFlow", category: "ml", level: "Proficient" },
  { name: "PyTorch", category: "ml", level: "Proficient" },
  { name: "Scikit-Learn", category: "ml", level: "Advanced" },
  { name: "Pandas", category: "ml", level: "Advanced" },
  { name: "NumPy", category: "ml", level: "Advanced" },

  // Cloud & DevOps
  { name: "Docker", category: "cloud", level: "Proficient" },
  { name: "Git & GitHub Actions", category: "cloud", level: "Advanced", hot: true },
  { name: "Vercel & Render", category: "cloud", level: "Advanced" },
  { name: "Google Cloud Platform", category: "cloud", level: "Proficient" },
  { name: "Postman API Testing", category: "cloud", level: "Advanced" },
  { name: "Domains & DNS Config", category: "cloud", level: "Proficient" },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    return SKILLS_DATA.filter((skill) => {
      const matchesTab = activeTab === "all" || skill.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <section
      id="skills"
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <Reveal direction="up" yOffset={24} once={false}>
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
              Engineering Capabilities
            </p>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--ink)]">
            Full-Stack & AI Technology Stack
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
            A comprehensive toolbox spanning front-end craftsmanship, resilient backend architectures, and production-ready agentic LLM systems.
          </p>
        </div>
      </Reveal>

      {/* Interactive Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sm:mb-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm w-full md:w-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-[var(--accent-ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="skills-tab"
                    className="absolute inset-0 rounded-xl bg-[var(--accent)] shadow-xs"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs sm:text-sm text-[var(--ink)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        <AnimatePresence>
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md transition-all cursor-default select-none overflow-hidden"
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1 shrink-0" />
                {skill.hot && (
                  <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[var(--accent-glow)] text-[var(--accent)]">
                    Core
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {skill.name}
                </h4>
                <p className="font-mono text-[10px] uppercase text-[var(--muted)] mt-1 tracking-wider">
                  {skill.level}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty Search Fallback */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="font-mono text-sm text-[var(--muted)]">
            No technologies found matching "{searchQuery}".
          </p>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-12 sm:mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] font-mono text-[11px] sm:text-xs uppercase tracking-wider">
          <span>Continuous Integration</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <span>Strict Spec Verification</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <span>Pakistan · Worldwide Delivery</span>
        </div>
      </div>
    </section>
  );
}

