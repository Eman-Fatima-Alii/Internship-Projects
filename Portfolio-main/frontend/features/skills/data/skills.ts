import { Bot, Code2, Database, Wrench } from "lucide-react"

export const skills = [
    {
        category: "Artificial Intelligence",
        icon: Bot,
        color: "from-indigo-400 to-purple-500",
        items: [
            { name: "OpenAI API" },
            { name: "Prompt Engineering" },
            { name: "LLM Applications" },
            { name: "Machine Learning" },
            { name: "AI Chatbots & Agents" },
        ],
    },
    {
        category: "Frontend Development",
        icon: Code2,
        color: "from-sky-400 to-blue-500",
        items: [
            { name: "React.js" },
            { name: "Next.js" },
            { name: "JavaScript (ES6+)" },
            { name: "HTML5 & CSS3" },
            { name: "Glassmorphism & UI" },
        ],
    },
    {
        category: "Backend & APIs",
        icon: Database,
        color: "from-emerald-400 to-teal-500",
        items: [
            { name: "Python Backends" },
            { name: "Node.js" },
            { name: "Express.js" },
            { name: "RESTful APIs" },
            { name: "Auth & Databases" },
        ],
    },
    {
        category: "Tools & DevOps",
        icon: Wrench,
        color: "from-amber-400 to-orange-500",
        items: [
            { name: "Git & GitHub" },
            { name: "VS Code" },
            { name: "Postman Testing" },
            { name: "Vercel Deployment" },
            { name: "Automation Tooling" },
        ],
    },
]
