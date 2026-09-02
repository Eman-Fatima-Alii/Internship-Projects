"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Sparkles, Play, Flame, Trophy, TrendingUp, Cpu } from "lucide-react";
import { proxiedImage } from "@/lib/imageProxy";

const STARTER_PROMPTS = [
  { icon: Flame, label: "Top Breaking Stories", prompt: "What are today's top breaking news headlines?" },
  { icon: Trophy, label: "Sports Updates", prompt: "Give me the latest cricket and sports updates" },
  { icon: TrendingUp, label: "Business & Economy", prompt: "What is happening in markets, economy, and business?" },
  { icon: Cpu, label: "Tech & Innovation", prompt: "Latest technology, AI, and science news" },
];

export default function ChatWidget({ country = "pk", onResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am your Pulse AI Assistant. Ask me anything about current global or regional events, live TV broadcast news, sports, or business — in English, Urdu, or Roman Urdu.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const handleSendPrompt = (promptText) => {
    setInput(promptText);
    sendMessage(promptText);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, country }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.error || "Something went wrong, please try again." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer,
          videos: data.videos || [],
        },
      ]);

      onResult?.({
        query: text,
        answer: data.answer,
        videos: data.videos || [],
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Network error — please check your connection and try again." },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI assistant" : "Open Pulse AI assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-indigo-600 dark:to-indigo-500 text-white rounded-full pl-4 pr-5 py-3.5 shadow-2xl hover:shadow-indigo-500/25 border border-white/20 transition-all cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
        </span>
        <Sparkles size={18} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
        <span className="font-sans font-semibold text-xs tracking-wide">
          {isOpen ? "Close Assistant" : "Pulse Assistant"}
        </span>
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[75vh] max-h-[600px] bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#070a0f] dark:via-indigo-950/60 dark:to-[#0b0f17] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="font-display font-bold text-base leading-tight">Pulse Assistant</p>
                  <p className="text-[11px] font-mono text-cyan-300/90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Live TV & News Intelligence
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                aria-label="Close assistant"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
              {/* Starter chips when only greeting */}
              {messages.length === 1 && (
                <div className="pt-2 pb-1 space-y-2">
                  <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                    Suggested topics:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STARTER_PROMPTS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendPrompt(item.prompt)}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.03] hover:border-indigo-500/40 dark:hover:border-indigo-500/30 text-left transition-all text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
                        >
                          <Icon size={14} className="text-indigo-500 shrink-0" />
                          <span className="truncate font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-md"
                        : "bg-slate-100/90 dark:bg-white/[0.06] text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/70 dark:border-white/[0.07] shadow-sm font-sans whitespace-pre-line"
                    }`}
                  >
                    <p>{m.text}</p>

                    {/* TV Broadcast video attachments */}
                    {m.videos?.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/10">
                        <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Verified Broadcast Coverage
                        </p>
                        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                          {m.videos.slice(0, 8).map((v) => (
                            <a
                              key={v.id}
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 w-36 group focus:outline-none"
                            >
                              <div className="w-36 h-20 rounded-xl overflow-hidden bg-slate-900 relative border border-slate-200/60 dark:border-white/10 shadow-sm">
                                {v.thumbnail && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={v.thumbnail}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                                    <Play size={11} className="fill-white ml-0.5" />
                                  </span>
                                </span>
                                {v.channel && (
                                  <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded truncate max-w-[90%]">
                                    {v.channel}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-tight mt-1.5 line-clamp-2 font-semibold">
                                {v.title}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2.5">
                    <Loader2 size={15} className="animate-spin text-indigo-500" />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Analyzing live feeds & broadcasts...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#070a0f]/90 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about breaking stories, updates..."
                className="flex-1 bg-slate-100/90 dark:bg-white/[0.06] rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none border border-slate-200/80 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-full p-2.5 disabled:opacity-40 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}