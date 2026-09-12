# AI Portfolio - Eman Fatima

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-v0.3-orange)](https://www.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991.svg)](https://openai.com/)

An intelligent, AI-powered interactive portfolio website for **Eman Fatima** (Full Stack AI Engineer & LLM Architect). This project replaces static scrolling with an interactive, conversational AI digital twin capable of discussing technical projects, answering domain-specific inquiries, performing semantic knowledge retrieval, and sending resume documents via email in real time.

---

## 🎯 Overview & AI Architecture

**AI Portfolio** transforms the traditional developer portfolio into a responsive, multi-turn conversational AI experience:

- **🤖 AI Digital Twin Agent**: Employs LangChain and OpenAI GPT-4o with fine-tuned persona prompts, guardrails, and anti-hallucination boundaries to represent Eman Fatima authentically.
- **🔍 Hybrid RAG (Retrieval-Augmented Generation)**: Combines **Semantic Search** (PostgreSQL + `pgvector` with OpenAI Embeddings) and **Keyword Search** (`BM25Retriever`) in an `EnsembleRetriever` to extract factual context from project files, resume summaries, and technical documentation.
- **🛠️ Agent Tool Calling**:
  - `PortfolioKnowledgeBase`: Automatically triggers semantic queries against the knowledge base when asked about projects, tech stack, or engineering philosophy.
  - `SendResumeEmail`: Autonomous tool that sends a copy of the resume via Resend/SMTP when requested by the visitor.
- **⚡ Real-Time Streaming (SSE)**: Streams incremental tokens and tool status events (*"🔍 Searching knowledge base..."*) directly to the client via Server-Sent Events with zero buffering.
- **🧠 Conversational Memory**: Persistent multi-turn chat session memory backed by Redis.
- **✨ Modern Liquid Glass UI**: Built with Next.js 14 App Router, React 18, Tailwind CSS 4, Framer Motion animations, interactive 2D canvas neural network, and Radix UI dialog primitives.
- **⌨️ Command Palette**: Quick navigation shortcuts (`/projects`, `/skills`, `/resume`, `/contact`).

---

## 🏗️ Project Structure

```text
Portfolio/
├── frontend/                          # Next.js 14 Application
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css              # Global styles, glassmorphism & animations
│   │   ├── layout.tsx               # Root layout & SEO metadata
│   │   └── page.tsx                 # Main AI chat interface page
│   ├── components/                  # Reusable UI components & providers
│   ├── features/                    # Modular feature architecture
│   │   ├── chat/                    # AI chat interface & streaming logic
│   │   │   ├── components/          # Chat window, bubbles, typing indicators
│   │   │   ├── context/             # Chat state management & SSE context
│   │   │   ├── hooks/               # useChat streaming hook
│   │   │   └── lib/                 # SSE client parser (@microsoft/fetch-event-source)
│   │   ├── sidebar/                 # Profile card, social links & drawer navigation
│   │   ├── projects/                # Project showcase carousel & data
│   │   ├── skills/                  # Categorized skills matrix
│   │   ├── resume/                  # Embedded PDF resume viewer & download
│   │   ├── contact/                 # Contact form modal
│   │   └── command-palette/         # Keyboard navigation palette
│   ├── lib/                         # App configuration & session utils
│   ├── services/                    # API client layer
│   └── public/                      # Static assets (profile.webp, resume.pdf)
│
├── backend/                          # FastAPI Backend Application
│   ├── app/
│   │   ├── core/                    # App settings, logging & rate limiter
│   │   │   ├── config.py            # Environment configuration (Pydantic Settings)
│   │   │   ├── logging.py           # Structured logging setup
│   │   │   └── limiter.py           # IP & Session rate limiting (SlowAPI)
│   │   ├── routers/                 # API route handlers
│   │   │   ├── chat.py              # Real-time SSE streaming chat endpoint
│   │   │   └── contact.py           # Contact form & resume delivery endpoint
│   │   ├── services/                # Business logic & AI services
│   │   │   ├── agent_service.py     # LangChain OpenAI Tools Agent & SSE streamer
│   │   │   ├── rag_service.py       # Hybrid RAG retriever (PGVector + BM25)
│   │   │   └── contact_service.py   # Resend / SMTP email service
│   │   ├── data/                    # Grounding knowledge base documents
│   │   │   ├── resume_summary.txt   # Professional resume & skills
│   │   │   ├── personal_background.txt # Bio & engineering values
│   │   │   ├── linkedin_summary.txt # LinkedIn profile grounding
│   │   │   └── projects/            # Detailed project documentation
│   │   │       ├── ai_chatbot.txt
│   │   │       ├── portfolio_website.txt
│   │   │       ├── automation_system.txt
│   │   │       └── fullstack_ai_apps.txt
│   │   └── main.py                  # FastAPI entry point & lifespan events
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend Docker container configuration
│   └── .env.example                 # Environment template
│
└── docker-compose.yml                # Multi-service container orchestration
```

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** & TypeScript
- **Tailwind CSS 4**
- **Framer Motion** (Fluid animations)
- **Radix UI** (Accessible dialog primitives)
- **Lucide Icons & React Icons**
- **HTML5 Canvas 2D API** (Interactive neural particle network)

### Backend & AI
- **FastAPI** (Python 3.10+) & Uvicorn ASGI
- **LangChain** (v0.3 Agent & Tooling ecosystem)
- **OpenAI GPT-4o** (LLM conversational engine)
- **PostgreSQL + pgvector** (Vector similarity embeddings)
- **Rank BM25** (In-memory exact keyword search)
- **Redis** (Multi-turn session chat history)
- **SlowAPI** (Session-aware rate limiting)
- **Resend** (Transactional email service)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ and pip
- **Docker and Docker Compose** (for local database services)
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **SMTP Email Credentials** - For contact form (Gmail, SendGrid, etc.)

### Option 1: Quick Start with Docker (Recommended)

This option uses Docker to run PostgreSQL and Redis locally, making setup much easier.

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Eman-Fatima-Alii/portfolio.git
cd Portfolio

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

#### 2. Environment Setup

Copy the environment template and configure it:

```bash
cp .env.example .env
```

(Optional) Configure frontend environment:

```bash
cp frontend/.env.example frontend/.env
```

Edit `.env` and fill in your API keys:

```bash
# Required: Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Required: Your email for contact form
MAIL_USERNAME="your.email@gmail.com"
MAIL_PASSWORD="your_app_password"
OWNER_EMAIL="your.email@gmail.com"

# The database and Redis URLs are pre-configured for Docker
# No changes needed for DATABASE_URL and REDIS_URL if using Docker
```

#### 3. Customize Identity & Content

1.  **Backend Data:** Edit files in `backend/app/data/` (resume.txt, projects.txt, etc) to match your profile.
2.  **Configuration:** Edit `backend/app/core/config.py` to set `PORTFOLIO_OWNER` and `RESUME_LINK`.
3.  **PDF Resume:** Replace `frontend/public/resume.pdf` with your own file.
4.  **Images:** Replace `frontend/public/profile.jpg` with your photo.

```bash
# Edit these files with your information:
# - resume.txt    (Your professional summary, experience, education)
# - projects.txt  (Your projects with descriptions and tech stacks)
# - skills.txt    (Your technical skills and expertise)
# - bio.txt       (Your background and story)
```

#### 4. Start Database Services

```bash
# Go back to project root
cd ../..

# Start PostgreSQL and Redis in the background
docker-compose up -d postgres redis

# Check that services are running
docker-compose ps
```

#### 5. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The backend will automatically ingest your portfolio data into the vector database on first startup.

#### 6. Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The application will be available at http://localhost:3000.

#### 7. Stopping Services

When you're done developing:

```bash
# Stop the application (Ctrl+C in both terminals)
# Stop Docker services
docker-compose down

# To also remove volumes (delete all data):
# docker-compose down -v
```

### Option 2: External Services

If you prefer using external services, like in production (Neon, Upstash, etc.):

1. Set up your PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Enable the `pgvector` extension
2. Set up your Redis instance on [Upstash](https://upstash.com)
3. Copy `backend/.env.example` to `backend/.env`
4. Replace the `DATABASE_URL` and `REDIS_URL` with your external service URLs
5. Continue with steps 1-3 and 5-6 from Option 1 (skip step 4)

### Option 3: Production Deployment (Self-Hosted)

To run the optimized production build (frontend + backend + DBs) on a single server (VPS):

1.  Clone repo and setup environment (steps 1-2 from Option 1).
2.  Run with the production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

This utilizes the multi-stage `frontend/Dockerfile` (target: `runner`) to build a standalone, optimized image (~100MB).

## 📝 Development Commands

**Note:** All `docker-compose` commands should be run from the **project root directory**.

| Command                          | Description                              |
| -------------------------------- | ---------------------------------------- |
| `docker-compose up`              | Start all services                       |
| `docker-compose up --build`      | Rebuild and start all services           |
| `docker-compose up -d`           | Start services in background (detached)  |
| `docker-compose down`            | Stop all services                        |
| `docker-compose down -v`         | Stop and remove volumes (delete data)    |
| `docker-compose logs -f`         | View logs from all services              |
| `docker-compose logs -f backend` | View backend logs only                   |
| `docker-compose ps`              | Check service status                     |
| `docker-compose restart backend` | Restart backend service only             |

## 🤖 How It Works

### AI Agent Architecture

The backend uses LangChain to create an intelligent AI agent with two primary tools:

1. **Portfolio Knowledge Base**: Vector search using RAG to retrieve relevant information from your portfolio documents
2. **Resume Email Tool**: Sends PDF resume via email to interested parties

### Data Flow

```
User Message → Frontend → FastAPI Backend → LangChain Agent
                             ↓
                    [Tool Selection]
                             ↓
        ┌────────────────────┴────────────────────┐
        ↓                                         ↓
Portfolio Knowledge Base              Resume Email Tool
(Vector Search in PostgreSQL)         (SMTP Email Service)
        ↓                                         ↓
    Retrieved Context                      Email Sent
        ↓                                         ↓
        └────────────────→ GPT-4 Response ←──────┘
                             ↓
                    Stream to Frontend (SSE)
                             ↓
                      Live Chat Display
```

### Knowledge Base Ingestion

On startup, the backend automatically:
1. Reads documents from `backend/app/data/`
2. Splits text into semantic chunks
3. Generates embeddings using OpenAI
4. Stores in PostgreSQL with pgvector extension
5. Enables semantic search for relevant information retrieval


## 🚀 Deployment

The application is designed to be deployed with:
- **Frontend** on [Vercel](https://vercel.com)
- **Backend** on [Render](https://render.com)

Both support automatic deployment on every push to the main branch.

**Note:** For production, use external database services like [Neon](https://neon.tech) for PostgreSQL and [Upstash](https://upstash.com) for Redis.


## 🧪 Testing

### Run Backend Tests

```bash
cd backend
python -m pytest

# With coverage
pytest --cov=app tests/
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [FastAPI Documentation](https://fastapi.tiangolo.com) - FastAPI framework
- [LangChain Documentation](https://python.langchain.com) - AI agent framework
- [OpenAI API Reference](https://platform.openai.com/docs) - GPT models
- [PostgreSQL + pgvector](https://github.com/pgvector/pgvector) - Vector similarity search
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container applications
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Eman Fatima**

- GitHub: [@Eman-Fatima-Alii](https://github.com/Eman-Fatima-Alii)
- LinkedIn: [Eman Fatima](https://www.linkedin.com/in/eman-fatima-34468a356)
- Email: [emaanfatimaa2121@gmail.com](mailto:emaanfatimaa2121@gmail.com)

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
</div>