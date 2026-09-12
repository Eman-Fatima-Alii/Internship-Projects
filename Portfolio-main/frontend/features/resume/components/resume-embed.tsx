"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ResumeEmbed() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Simple check to detect mobile devices to avoid bad iframe UX
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-4"
        >
            <Card className={cn(
                "overflow-hidden flex flex-col rounded-2xl",
                "bg-zinc-900/95 border border-white/10 backdrop-blur-xl",
                "shadow-2xl shadow-black/50"
            )}>
                {/* --- Header / Toolbar --- */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm md:text-base">Eman Fatima - Resume</h3>
                            <p className="text-xs text-zinc-400 hidden md:block">PDF Document • 2026</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white hover:bg-white/10 hidden md:flex"
                            asChild
                        >
                            <a href="/resume.pdf" download="EmanFatima_Resume.pdf">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-white/10"
                            asChild
                        >
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                            </a>
                        </Button>
                    </div>
                </div>

                {/* --- PDF Viewer / Fallback --- */}
                <div className="relative aspect-[16/10] md:aspect-[16/11] w-full bg-zinc-950 overflow-hidden">
                    {!isMobile ? (
                        <iframe
                            src="/resume.pdf#view=FitH&toolbar=0&navpanes=0"
                            className="w-full h-full border-0"
                            title="Eman Fatima - Resume PDF Viewer"
                        />
                    ) : (
                        // Mobile: Show a nice placeholder
                        <div
                            className="text-center p-8 space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                            <div
                                className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-zinc-500" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-300 font-medium">Preview not available on mobile</p>
                                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                                    Tap the button above to view the full PDF on your device.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                className="mt-4 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                                asChild
                            >
                                <a href="/resume.pdf" download="EmanFatima_Resume.pdf">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}