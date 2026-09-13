"use client"

import { motion } from "framer-motion"
import { FileText, Download, Printer, Mail, Github, Linkedin, ExternalLink, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ResumeEmbed() {
    const handlePrint = () => {
        window.print()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 md:py-6"
        >
            <Card className={cn(
                "overflow-hidden flex flex-col rounded-2xl",
                "bg-zinc-900/95 border border-white/10 backdrop-blur-xl",
                "shadow-2xl shadow-black/50"
            )}>
                {/* --- Header / Action Toolbar --- */}
                <div className="flex flex-wrap items-center justify-between p-4 border-b border-white/10 bg-white/5 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-base md:text-lg">Eman Fatima - Official Resume</h3>
                            <p className="text-xs text-zinc-400">Full Stack AI Engineer & LLM Architect</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/10 text-zinc-200"
                            onClick={handlePrint}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print / Save PDF
                        </Button>
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-white/10 shadow-lg shadow-indigo-500/25"
                            asChild
                        >
                            <a href="https://github.com/Eman-Fatima-Alii" target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-2" />
                                GitHub Profile
                            </a>
                        </Button>
                    </div>
                </div>

                {/* --- Interactive Resume Content Sheet --- */}
                <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto space-y-8 text-zinc-300 print:max-h-none print:p-0 print:text-black">
                    
                    {/* Header Details */}
                    <div className="border-b border-white/10 pb-6 print:border-zinc-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight print:text-black">
                                    Eman Fatima
                                </h1>
                                <p className="text-lg text-indigo-400 font-medium mt-1 print:text-indigo-600">
                                    Full Stack AI Engineer & LLM Architect
                                </p>
                            </div>

                            {/* Contact Badges */}
                            <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                                <a
                                    href="mailto:emaanfatimaa2121@gmail.com"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                    emaanfatimaa2121@gmail.com
                                </a>
                                <a
                                    href="https://wa.me/923270649825"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                                    +92 327 0649825
                                </a>
                                <a
                                    href="https://github.com/Eman-Fatima-Alii"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <Github className="w-3.5 h-3.5 text-indigo-400" />
                                    github.com/Eman-Fatima-Alii
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/eman-fatima-34468a356"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Professional Summary
                        </h2>
                        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base font-light">
                            Passionate Full Stack AI Engineer specializing in Artificial Intelligence, Machine Learning, Python, JavaScript, React, Node.js, REST APIs, workflow automation, and modern web architectures. Proven experience developing 20+ applications across AI agents, interactive chatbots, RAG retrieval pipelines, responsive web interfaces, and backend microservices with 100% dedication to high code quality and user experience.
                        </p>
                    </div>

                    {/* Key Metrics / Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-indigo-400">20+</span>
                            <span className="text-xs text-zinc-400">Projects Delivered</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-purple-400">10+</span>
                            <span className="text-xs text-zinc-400">Core Tech Stacks</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-pink-400">100%</span>
                            <span className="text-xs text-zinc-400">Project Commitment</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <span className="block text-2xl font-bold text-emerald-400">24/7</span>
                            <span className="text-xs text-zinc-400">Autonomous AI Twin</span>
                        </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Technical Skills & Core Competencies
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <h3 className="font-semibold text-indigo-300">Artificial Intelligence & LLMs</h3>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    OpenAI API (GPT-4o, GPT-3.5), Prompt Engineering, LangChain, RAG Systems, Vector Search, Machine Learning, NLP, Autonomous AI Agents.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <h3 className="font-semibold text-purple-300">Frontend Engineering</h3>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    React.js, Next.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Framer Motion, Glassmorphism & Liquid Glass UI, Responsive Web Design.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <h3 className="font-semibold text-pink-300">Backend & API Engineering</h3>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Python (FastAPI, Flask), Node.js, Express.js, RESTful APIs, Secure Authentication, PostgreSQL, SQLite, MongoDB.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <h3 className="font-semibold text-emerald-300">DevOps, Tools & Automation</h3>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Git, GitHub, Vercel, Render Deployment, VS Code, Postman API Testing, Python Automation Scripts, Web Scraping.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Projects */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                            Featured Key Projects
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white">Full-Stack AI Portfolio with Autonomous Agent</h3>
                                    <span className="text-xs text-indigo-400 font-mono">Next.js • FastAPI • LangChain • OpenAI</span>
                                </div>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Architected an AI-powered conversational portfolio using FastAPI, LangChain Agent with RAG knowledge base retrieval, and Next.js 15 responsive UI.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white">Interactive AI Chatbot Platform</h3>
                                    <span className="text-xs text-purple-400 font-mono">Python • FastAPI • OpenAI • NLP</span>
                                </div>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Engineered natural language understanding chatbot supporting streaming responses, multi-turn dialogue memory, and structured task resolution.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white">Business Workflow Automation Suite</h3>
                                    <span className="text-xs text-emerald-400 font-mono">Python • Scraping • REST APIs • Scheduling</span>
                                </div>
                                <p className="text-zinc-300 text-xs leading-relaxed">
                                    Created automated Python workflows for scheduled data scraping, automated email notifications, and business report generation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Core Services */}
                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            Specialized Services Offered
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-400">✔</span> Custom AI Chatbot & LLM Integration
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-400">✔</span> Modern Full-Stack Web App Development
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-400">✔</span> Python Backend APIs & Microservices
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-400">✔</span> Workflow & Task Automation Systems
                            </li>
                        </ul>
                    </div>

                </div>
            </Card>
        </motion.div>
    )
}