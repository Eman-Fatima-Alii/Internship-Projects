import type { ProjectItem } from "@/features/projects/components/projects-carousel";

export const projects: ProjectItem[] = [
    {
        id: 1,
        title: "AI Chatbot",
        category: "Artificial Intelligence & LLMs",
        description:
            "Intelligent conversational AI chatbot powered by OpenAI APIs with natural language understanding, contextual conversations, multi-turn memory, and a modern responsive interface.",
        techStack: ["OpenAI", "Python", "FastAPI", "NLP"],
        github: "https://github.com/Eman-Fatima-Alii",
        image: "/images/projects/ai-portfolio.webp",
    },
    {
        id: 2,
        title: "Portfolio Website",
        category: "UI/UX & Modern Web",
        description:
            "Modern responsive personal portfolio featuring Liquid Glass UI styling, glassmorphism, interactive HTML5 neural background canvas, and fluid micro-interactions.",
        techStack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
        github: "https://github.com/Eman-Fatima-Alii",
        image: "/images/projects/space-ease.webp",
    },
    {
        id: 3,
        title: "Automation System",
        category: "Python Automation",
        description:
            "Python automation solutions to eliminate repetitive manual workflows, execute scheduled data extraction, automated reporting pipelines, and business productivity tools.",
        techStack: ["Python", "Automation", "Scraping", "APIs"],
        github: "https://github.com/Eman-Fatima-Alii",
        image: "/images/projects/news-broadcaster.webp",
    },
    {
        id: 4,
        title: "Full Stack AI Apps",
        category: "Full-Stack Web Development",
        description:
            "End-to-end intelligent web applications integrating React frontends with Node.js and Python microservices, REST APIs, database persistence, and generative AI features.",
        techStack: ["React", "Node.js", "MongoDB", "REST APIs"],
        github: "https://github.com/Eman-Fatima-Alii",
        image: "/images/projects/yeet-chat.webp",
    },
];
