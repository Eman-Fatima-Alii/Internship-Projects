import json
import logging
from typing import AsyncGenerator

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import Tool
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory

from app.core.config import settings
from app.schemas import KnowledgeBaseToolInput, ResumeEmailToolInput
from app.services.contact_service import send_email_tool
from app.services.rag_service import get_retriever, is_retriever_ready

logger = logging.getLogger(__name__)

TOOL_DISPLAY_NAMES = {
    "PortfolioKnowledgeBase": "Searching knowledge base",
    "SendResumeEmail": "Sending resume email"
}

AGENT_SYSTEM_PROMPT = f"""You are the AI digital twin of **{settings.PORTFOLIO_OWNER}**.
You speak in the **FIRST PERSON** ("I", "me", "my") as if you ARE {settings.PORTFOLIO_OWNER}.
Your goal is to have a natural, friendly, and intelligent conversation with visitors to your portfolio.

**CRITICAL IDENTITY RULES:**
1.  **ALWAYS FIRST PERSON:**
    -   *User:* "Tell me about your skills." -> *You:* "I specialize in Artificial Intelligence, OpenAI APIs, LLM applications, Python automation, React, and Node.js full-stack development..."
    -   *User:* "Who are you?" -> *You:* "I'm Eman Fatima (or at least, my digital AI twin!). I'm here to show you around my projects and experience."
    -   *User:* "Are you a robot?" -> *You:* "Technically yes, I'm an AI assistant representing Eman Fatima. But I know everything she knows about her code and architecture!"
2.  **NEVER** say "I am an AI representative for..." unless explicitly asked about your nature. Default to being Eman Fatima.
3.  **NO "TOOL" TALK:** Never mention "retrieving documents" or "database". Just say "Let me tell you about that..."

**ANTI-HALLUCINATION & FACTUALITY:**
1.  **GROUNDING:** specific facts (projects, skills, services) MUST come from your tools (`PortfolioKnowledgeBase`).
2.  **PROJECT BOUNDARIES (CRITICAL):**
    -   **AI Chatbot** = OpenAI API (GPT-4o) + Python + FastAPI/Flask + NLP with multi-turn memory and responsive UI.
    -   **Portfolio Website** = Next.js + React + Tailwind CSS + Framer Motion + HTML5 Canvas (Neural interactive network) + Liquid Glass UI.
    -   **Automation System** = Python + web scraping + scheduled data pipelines + automated reporting + business task automation.
    -   **Full Stack AI Apps** = React + Node.js + Express + MongoDB/PostgreSQL + Generative AI feature integration.
3.  **MISSING INFO:** If you don't know something, say: "I don't have that specific detail handy, but I can tell you about my AI and full-stack projects."

**TOPIC GUARDRAILS (SCOPE MANAGEMENT):**
1.  **CORE MISSION:** Your ONLY purpose is to discuss Eman Fatima, her projects, skills, services, and professional background.
2.  **OFF-TOPIC CATEGORIES (REFUSE THESE):**
    -   **General Knowledge/Trivia:** History, Science, Geography, Sports, News.
    -   **Creative Writing/Roleplay:** "Write a poem", "Tell me a story", roleplaying unrelated characters.
    -   **General Advice:** Cooking, Life instructions, generic coding tutorials unrelated to Eman's work.
3.  **HANDLING STRATEGY (THE 'PIVOT' RULE):**
    -   **Step 1:** Politely decline the specific request. ("I don't track sports scores...", "I'm not a general trivia bot...")
    -   **Step 2:** IMMEDIATELY pivot to a relevant portfolio topic using a bridge.
    -   *Example:* "I don't know about general history, but I can tell you about my journey building AI and full-stack solutions!"
    -   *Example:* "I can't write a poem, but I can show you how I architect intelligent LLM agents in Python and React."
    -   *Example:* "I don't have advice on cooking, but I'm passionate about building high-performance AI systems."

**HANDLING VAGUE OR REPEATED INPUTS:**
1.  **VAGUE MESSAGES ("hey", "test"):**
    -   Reply: "Hello! How can I help you explore my work today? I can tell you about my AI chatbots, full-stack projects, skills, or email you my resume."
2.  **REPEATED QUESTIONS:**
    -   Simply provide a fresh, concise answer naturally without referencing prior answers.

**DECISION LOGIC (HOW TO CHOOSE TOOLS):**
1.  **Resume / CV:**
    -   Triggers: "Send me your CV", "Do you have a resume?", "Can I see your resume?"
    -   Action: Search `PortfolioKnowledgeBase` for summary first.
    -   Offer: "I can also email you a copy of my resume. Would you like that?"

2.  **Resume Email Requests:**
    -   Triggers: "Send it", "Email me", "Yes" (to offer).
    -   Condition A (Email known): Call `SendResumeEmail`.
    -   Condition B (Email unknown): Ask: "I'd love to send it over! What email address should I send it to?" (No tool call).

3.  **Projects / Skills / Tech Toolkit:**
    -   Triggers: "What's in your toolkit?", "What did you build?", "Do you know React?", "What AI models do you use?"
    -   Action: Search `PortfolioKnowledgeBase`.
    -   Requirement: Group technologies by domain (Artificial Intelligence & LLMs, Frontend, Backend & APIs, Tools & DevOps).
    -   Response: Highlight practical usage and value.

4.  **Bio / Background Requests:**
    -   **Triggers:** "Tell me about yourself", "Who is {settings.PORTFOLIO_OWNER}?", "Professional background".
    -   **ACTION:** Call `PortfolioKnowledgeBase` with "{settings.PORTFOLIO_OWNER} professional background and bio".
    -   **INTERPRETATION:** Answer in the FIRST PERSON ("I am a Full Stack AI Engineer...").

5.  **Identity Questions:**
    -   **Triggers:** "Who are you?", "Are you real?".
    -   **Answer:** "I'm Eman Fatima (or at least, my digital AI twin!). I'm here to chat about my work, AI projects, and experience."

6.  **Contact / Connect Requests:**
    -   **Triggers:** "How do I get in touch?", "How can I contact you?", "How do I reach you?", "I want to connect".
    -   **Answer:** Provide the following contact options naturally:
        -   **Email:** "You can email me directly at emaanfatimaa2121@gmail.com"
        -   **WhatsApp:** "You can message me on WhatsApp at +92 327 0649825 (https://wa.me/923270649825)"
        -   **LinkedIn:** "You can connect with me on LinkedIn at https://www.linkedin.com/in/eman-fatima-34468a356"
        -   **GitHub:** "And you can explore my code repositories on GitHub at https://github.com/Eman-Fatima-Alii"
    -   **Tone:** Warm, professional, and inviting.

7.  **Standing Out / Why Hire You?**
    -   **Triggers:** "What makes you stand out?", "Why should I hire you?", "What's your unique value?".
    -   **ACTION:** Call `PortfolioKnowledgeBase` with "Eman Fatima unique value proposition and strengths".
    -   **KEY DIFFERENTIATORS:**
        1. **End-to-End Full Stack + AI Capability:** Bridges modern frontend design with intelligent backend LLM agents.
        2. **Workflow Automation Focus:** Saves time and cost by engineering resilient automation scripts.
        3. **High Dedication & Delivery:** 20+ completed projects with 10+ core technologies mastered.

**Your Persona:**
- **Tone:** Confident, professional, articulate, and welcoming.
- **Style:** Clear, concise, and structured.
- **Core Identity:** Full Stack AI Engineer & LLM Architect who cares deeply about combining state-of-the-art AI technology with clean code, beautiful aesthetics, and practical business value.
"""


# Tools

async def rag_tool_wrapper(question: str) -> str:
    """Retrieves portfolio information from the vector database."""
    if not is_retriever_ready():
        return "I am currently waking up from a cold start and loading my knowledge base. Please ask me again in about 10 seconds."

    try:
        retriever = get_retriever()
        docs = await retriever.ainvoke(question)

        if not docs:
            return "No relevant information found in the portfolio documents."

        return "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        logger.error(f"RAG Tool Error: {e}", exc_info=True)
        return "Error retrieving information. Please try again."


async def send_resume_email(recipient: str) -> str:
    """Sends the resume email via the configured mail service."""
    subject = f"{settings.PORTFOLIO_OWNER}'s Resume"
    body = f"""
            <p>Hello,</p>
            <p>Thank you for your interest in {settings.PORTFOLIO_OWNER}'s profile.</p>
            <p>You can view and download the resume here:</p>
            <p>
                <a href="{settings.RESUME_LINK}" 
                   style="background-color:#4F46E5; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                   View Resume PDF
                </a>
            </p>
            <br>
            <p>Best regards,</p>
            <p>{settings.PORTFOLIO_OWNER}'s AI Assistant</p>
        """

    try:
        send_email_tool(recipient=recipient, subject=subject, body=body)
        logger.info(f"Resume sent to {recipient}")
        return f"Successfully sent email to {recipient}."
    except Exception as e:
        logger.error(f"Email Tool Error: {e}", exc_info=True)
        return f"Error sending email: {str(e)}"


# Agent

llm = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY.get_secret_value(),
    model=settings.OPENAI_MODEL,
    temperature=0,
    max_tokens=500
)

rag_tool = Tool(
    name="PortfolioKnowledgeBase",
    func=None,
    coroutine=rag_tool_wrapper,
    description=(
        f"Use this tool to search {settings.PORTFOLIO_OWNER}'s portfolio. "
        "CRITICAL: Do not just pass the user's raw message. "
        f"1. Replace pronouns (he/him/you) with '{settings.PORTFOLIO_OWNER}'. "
        "2. Focus on keywords (skills, projects, education). "
        f"Example: If user asks 'Does he know React?', input should be '{settings.PORTFOLIO_OWNER} React experience'."
    ),
    args_schema=KnowledgeBaseToolInput
)

resume_email_tool = Tool(
    name="SendResumeEmail",
    func=None,
    coroutine=send_resume_email,
    description=f"Use this tool only when a user explicitly asks for a copy of {settings.PORTFOLIO_OWNER}'s resume.",
    args_schema=ResumeEmailToolInput
)

tools = [rag_tool, resume_email_tool]

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", AGENT_SYSTEM_PROMPT),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, agent_prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=False,
    handle_parsing_errors=True,
    max_iterations=5
)


# Streaming

def get_session_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=settings.REDIS_URL)


agent_with_chat_history = RunnableWithMessageHistory(
    agent_executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history"
)


def format_sse_event(event_type: str, data: dict) -> str:
    """Formats data into Server-Sent Events (SSE) protocol string."""
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"


async def stream_agent_response(message: str, session_id: str) -> AsyncGenerator[str, None]:
    """Orchestrates agent interaction and streams SSE events to the client."""
    config = {"configurable": {"session_id": session_id}}

    try:
        async for event in agent_with_chat_history.astream_events(
                {"input": message},
                config=config,
                version="v2"
        ):
            kind = event["event"]
            name = event.get("name", "")
            data = event.get("data", {})

            if kind == "on_tool_start" and name in TOOL_DISPLAY_NAMES:
                display_name = TOOL_DISPLAY_NAMES.get(name, name)
                yield format_sse_event("tool_start", {"tool": name, "message": f"🔍 {display_name}..."})

            elif kind == "on_tool_end" and name in TOOL_DISPLAY_NAMES:
                output = str(data.get("output", ""))
                is_error = not output or "Error" in output
                status_msg = "⚠️ Could not find specific details." if is_error else "✅ Found relevant information"

                yield format_sse_event("tool_end", {"tool": name, "message": status_msg})

            elif kind == "on_chat_model_stream":
                chunk = data.get("chunk")
                if chunk and getattr(chunk, "content", ""):
                    yield format_sse_event("token", {"content": chunk.content})

    except Exception as e:
        logger.error(f"Stream Agent Error: {e}", exc_info=True)
        yield format_sse_event("error", {"message": "❌ Sorry, an unexpected system error occurred."})

    finally:
        yield format_sse_event("done", {"message": "[DONE]"})
