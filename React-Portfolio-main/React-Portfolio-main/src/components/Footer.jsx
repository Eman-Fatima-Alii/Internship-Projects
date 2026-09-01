import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "./Icons";


const GITHUB_PROFILE = "https://github.com/Eman-Fatima-Alii/Internship-Projects";
const LINKEDIN_PROFILE = "https://www.linkedin.com/in/eman-fatima-34468a356";
const WHATSAPP_LINK = "https://wa.me/923270649825";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)]/50 px-4 sm:px-6 md:px-8 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-mono text-xs font-black text-[var(--accent)] shadow-xs">
            EF
          </div>
          <div>
            <div className="font-display font-bold text-sm text-[var(--ink)]">
              Eman Fatima
            </div>
            <div className="font-mono text-xs text-[var(--muted)]">
              Full Stack AI Developer · Pakistan
            </div>
          </div>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
          <a href="#work" className="hover:text-[var(--accent)] transition-colors">Work</a>
          <a href="#skills" className="hover:text-[var(--accent)] transition-colors">Skills</a>
          <a href="#method" className="hover:text-[var(--accent)] transition-colors">Method</a>
          <a href="#about" className="hover:text-[var(--accent)] transition-colors">About</a>
          <a href="#contact" className="hover:text-[var(--accent)] transition-colors">Contact</a>
        </div>

        {/* Right: Socials & Back to top */}
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            <GithubIcon size={14} />
          </a>
          <a
            href={LINKEDIN_PROFILE}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            <LinkedinIcon size={14} />
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            <WhatsAppIcon size={14} />
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer shadow-xs"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>


      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[var(--border)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="font-mono text-[11px] text-[var(--muted)]">
          © {new Date().getFullYear()} Eman Fatima. All rights reserved.
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>Built with React 19, Tailwind CSS & Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}

