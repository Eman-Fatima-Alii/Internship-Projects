import streamlit as st
from dotenv import load_dotenv
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage

# ---------------------------------------------------------
# Load Environment Variables
# ---------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Gemini AI Chatbot",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------
# Custom CSS - Modern, vibrant, glassmorphism-inspired
# ---------------------------------------------------------
st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }

        .stApp {
            background: radial-gradient(circle at 15% 0%, #1e1b4b 0%, #0f0c29 35%, #0a0a14 100%);
        }

        .hero {
            padding: 28px 32px;
            border-radius: 20px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.20) 50%, rgba(236,72,153,0.18) 100%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
        }
        .hero-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2.3rem;
            font-weight: 800;
            background: linear-gradient(90deg, #a5b4fc, #f0abfc, #fbcfe8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
        }
        .hero-sub {
            color: #cbd5e1;
            font-size: 1rem;
            margin-top: 6px;
            font-weight: 500;
        }
        .hero-badges {
            margin-top: 14px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 8px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            color: #e2e8f0;
        }

        [data-testid="stChatMessage"] {
            border-radius: 18px;
            padding: 6px 10px;
            margin-bottom: 6px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(6px);
        }
        [data-testid="stChatMessageAvatarUser"] {
            background: linear-gradient(135deg, #6366f1, #a855f7) !important;
        }
        [data-testid="stChatMessageAvatarAssistant"] {
            background: linear-gradient(135deg, #ec4899, #f59e0b) !important;
        }

        section[data-testid="stSidebar"] {
            background: linear-gradient(180deg, #12101f 0%, #0a0a14 100%);
            border-right: 1px solid rgba(255,255,255,0.06);
        }
        section[data-testid="stSidebar"] * {
            color: #e2e8f0;
        }
        section[data-testid="stSidebar"] h2, section[data-testid="stSidebar"] h3 {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            background: linear-gradient(90deg, #a5b4fc, #f0abfc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .stButton>button {
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.12);
            background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.20));
            color: #f1f5f9;
            font-weight: 600;
            transition: 0.25s;
        }
        .stButton>button:hover {
            border-color: transparent;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(236, 72, 153, 0.35);
        }

        .stTextInput>div>div>input, .stSelectbox>div>div {
            border-radius: 10px !important;
            background-color: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }

        [data-testid="stChatInput"] {
            border-radius: 16px;
            border: 1px solid rgba(168,85,247,0.35) !important;
            background: rgba(255,255,255,0.03);
        }

        .stSlider [data-baseweb="slider"] > div > div {
            background: linear-gradient(90deg, #6366f1, #ec4899) !important;
        }

        .empty-card {
            text-align: center;
            padding: 50px 20px;
            border-radius: 20px;
            background: rgba(255,255,255,0.03);
            border: 1px dashed rgba(255,255,255,0.15);
            color: #94a3b8;
        }
        .empty-card h3 {
            color: #e2e8f0;
            font-family: 'Poppins', sans-serif;
        }

        footer {visibility: hidden;}
        #MainMenu {visibility: hidden;}
    </style>
    """,
    unsafe_allow_html=True,
)


# ---------------------------------------------------------
# Helper: safely extract plain text from a LangChain message
# content, which can be a plain string OR a list of content
# blocks like [{'type': 'text', 'text': '...', 'extras': {...}}]
# (Gemini 3.x models return the structured form.)
# ---------------------------------------------------------
def extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict):
                if block.get("type") == "text":
                    parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return "".join(parts)
    return str(content)


# ---------------------------------------------------------
# Cached model client - avoids re-creating the client on
# every single message, which speeds up each turn.
# ---------------------------------------------------------
@st.cache_resource(show_spinner=False)
def get_llm(model_name: str, api_key: str, temperature: float):
    return ChatGoogleGenerativeAI(
        model=model_name,
        google_api_key=api_key,
        temperature=temperature,
    )


def stream_response(llm, history):
    """Yield text chunks as they arrive, so the UI updates live instead of waiting."""
    for chunk in llm.stream(history):
        text = extract_text(chunk.content)
        if text:
            yield text


# ---------------------------------------------------------
# Sidebar - Settings
# ---------------------------------------------------------
api_key_input = os.getenv("GOOGLE_API_KEY", "")

with st.sidebar:
    st.markdown("## ⚙️ Settings")

    model_name = st.selectbox(
        "Model",
        options=[
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
            "gemini-3.1-flash-lite",
            "gemini-3-pro",
        ],
        index=0,
        help="gemini-3.6-flash is Google's newest, fastest, and most token-efficient model (July 2026).",
    )

    temperature = st.slider(
        "Creativity (Temperature)",
        min_value=0.0,
        max_value=1.0,
        value=0.6,
        step=0.1,
    )

    st.markdown("---")

    if st.button("🗑️ Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    st.markdown("---")
    st.caption("✨ Built with **LangChain** + **Google Gemini** + **Streamlit**")

# ---------------------------------------------------------
# Hero Header
# ---------------------------------------------------------
st.markdown(
    f"""
    <div class="hero">
        <p class="hero-title">✨ Gemini AI Chatbot</p>
        <p class="hero-sub">Powered by LangChain + Google Gemini — ready to chat with you</p>
        <div class="hero-badges">
            <span class="badge">🤖 {model_name}</span>
            <span class="badge">🌡️ Temp: {temperature}</span>
            <span class="badge">🟢 Online</span>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------
# Session State - Chat History
# ---------------------------------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# ---------------------------------------------------------
# Render existing chat history
# ---------------------------------------------------------
for msg in st.session_state.messages:
    avatar = "🧑‍💻" if msg["role"] == "user" else "✨"
    with st.chat_message(msg["role"], avatar=avatar):
        st.markdown(msg["content"])

# ---------------------------------------------------------
# Empty state
# ---------------------------------------------------------
if not st.session_state.messages:
    st.markdown(
        """
        <div class="empty-card">
            <h3>👋 Welcome!</h3>
            <p>Type your message below to start chatting.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ---------------------------------------------------------
# Chat Input
# ---------------------------------------------------------
user_prompt = st.chat_input("Type your message here...")

if user_prompt:
    if not api_key_input:
        st.error("⚠️ GOOGLE_API_KEY not found. Add it to your .env file and restart the app.")
        st.stop()

    st.session_state.messages.append({"role": "user", "content": user_prompt})
    with st.chat_message("user", avatar="🧑‍💻"):
        st.markdown(user_prompt)

    history = []
    for msg in st.session_state.messages[:-1]:
        if msg["role"] == "user":
            history.append(HumanMessage(content=msg["content"]))
        else:
            history.append(AIMessage(content=msg["content"]))
    history.append(HumanMessage(content=user_prompt))

    with st.chat_message("assistant", avatar="✨"):
        try:
            llm = get_llm(model_name, api_key_input, temperature)
            response_text = st.write_stream(stream_response(llm, history))
        except Exception as e:
            response_text = f"❌ Error: {e}"
            st.markdown(response_text)

    st.session_state.messages.append({"role": "assistant", "content": response_text})