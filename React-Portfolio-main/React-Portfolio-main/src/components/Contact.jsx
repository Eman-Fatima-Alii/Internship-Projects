import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Send, ArrowUpRight, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "./Icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";


const EMAIL = "emaanfatimaa2121@gmail.com";

const CHANNELS = [
  {
    key: "github",
    label: "GitHub",
    handle: "@Eman-Fatima-Alii",
    href: "https://github.com/Eman-Fatima-Alii/Internship-Projects",
    icon: GithubIcon,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "Eman Fatima",
    href: "https://www.linkedin.com/in/eman-fatima-34468a356",
    icon: LinkedinIcon,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    handle: "+92 327 0649825",
    href: "https://wa.me/923270649825",
    icon: WhatsAppIcon,
  },
];


const EMAILJS_PUBLIC_KEY = "DLivNyJrNwgPVnsYQ";
const EMAILJS_SERVICE_ID = "service_a1nc6q7";
const EMAILJS_TEMPLATE_ID = "template_p2us3ky";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            name: form.name,
            from_name: form.name,
            user_name: form.name,
            email: form.email,
            from_email: form.email,
            user_email: form.email,
            reply_to: form.email,
            to_email: EMAIL,
            to_name: "Eman Fatima",
            message: form.message,
            user_message: form.message,
            content: form.message,
            message_html: form.message,
            body: form.message,
          },
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Dynamic Glow Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--glow-1)] blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <Reveal direction="up" yOffset={24} once={false}>
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
              Initiate Collaboration
            </p>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--ink)]">
            Let's Build Something Exceptional
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            Have a product concept, an AI agent workflow, or looking for an engineering partner? Reach out directly or drop a message below.
          </p>
        </div>
      </Reveal>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Direct Connect & Channels */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 1-Click Copy Email Card */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-xs uppercase font-bold text-[var(--muted)] tracking-wider">
                Direct Email
              </span>
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            </div>

            <p className="font-mono text-sm sm:text-base font-bold text-[var(--ink)] break-all mb-5">
              {EMAIL}
            </p>

            <button
              type="button"
              onClick={copyEmail}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shadow-xs active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[var(--accent)]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          {/* Social Channels List */}
          <div className="flex flex-col gap-3">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <Magnetic key={ch.key} strength={0.15}>
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                          {ch.label}
                        </div>
                        <div className="font-mono text-xs text-[var(--muted)]">
                          {ch.handle}
                        </div>
                      </div>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </Magnetic>
              );
            })}
          </div>

        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--ink)] mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mb-8">
              Guaranteed response within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                    Your Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--ink)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--ink)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                  Project Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell me about what you're building, target timelines, or technical specifications..."
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--ink)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none"
                />
              </div>

              <Magnetic strength={0.2} className="w-full">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm uppercase font-bold tracking-wider transition-all duration-300 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-ink)",
                    boxShadow: "0 8px 24px -6px var(--accent-glow)",
                  }}
                >
                  {status === "sending" ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </Magnetic>

              {/* Status Feedback Banners */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent)] flex items-center gap-3 text-xs sm:text-sm font-mono text-[var(--accent)]"
                  >
                    <Check className="w-5 h-5 shrink-0" />
                    <span>Message delivered successfully! I will reply within 24 hours.</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs sm:text-sm font-mono text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Unable to send right now. Please email directly at {EMAIL}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}