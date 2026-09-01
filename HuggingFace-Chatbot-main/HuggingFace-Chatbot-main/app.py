import streamlit as st
from dotenv import load_dotenv
import os

from huggingface_hub import InferenceClient

# ---------------------------------------------------------
# Load Environment Variables
# ---------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Nova AI Chatbot",
    page_icon="🐋",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------
# Custom CSS - Navy blue, playful/cute mascot theme
# (unchanged from original design)
# ---------------------------------------------------------
st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');

        html, body, [class*="css"] {
            font-family: 'Nunito', sans-serif;
        }

        .stApp {
            background: #1b2f4e;
        }

        /* Mascot header card */
        .mascot-card {
            background: #22406b;
            border-radius: 24px;
            padding: 26px 30px;
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 18px;
            border: 2px solid #2f5488;
        }
        .mascot-emoji {
            font-size: 3rem;
            background: #1b2f4e;
            width: 76px;
            height: 76px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #6ec6ff;
            box-shadow: 0 0 0 4px rgba(110, 198, 255, 0.15);
        }
        .mascot-name {
            font-family: 'Baloo 2', sans-serif;
            font-size: 1.9rem;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
        }
        .mascot-tag {
            color: #a9c4e8;
            font-size: 0.95rem;
            margin-top: 4px;
        }

        .pill-row {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        .pill {
            background: #1b2f4e;
            border: 1px solid #3a6199;
            color: #cfe3ff;
            padding: 5px 14px;
            border-radius: 999px;
            font-size: 0.78rem;
            font-weight: 600;
        }
        .pill-dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #5eead4;
            margin-right: 6px;
        }

        /* Chat bubbles */
        .bubble-row {
            display: flex;
            margin-bottom: 12px;
        }
        .bubble-row.user { justify-content: flex-end; }
        .bubble-row.assistant { justify-content: flex-start; }
        .bubble {
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 20px;
            font-size: 0.96rem;
            line-height: 1.55;
        }
        .bubble.user {
            background: #6ec6ff;
            color: #0b2038;
            font-weight: 500;
            border-bottom-right-radius: 6px;
        }
        .bubble.assistant {
            background: #22406b;
            color: #eaf2ff;
            border: 1px solid #3a6199;
            border-bottom-left-radius: 6px;
        }
        .bubble-tag {
            font-size: 0.68rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            opacity: 0.6;
        }

        /* Sidebar */
        section[data-testid="stSidebar"] {
            background: #16283f;
            border-right: 1px solid #2f5488;
        }
        section[data-testid="stSidebar"] * { color: #dbe8fb; }
        section[data-testid="stSidebar"] h2, section[data-testid="stSidebar"] h3 {
            font-family: 'Baloo 2', sans-serif;
            color: #ffffff;
            font-weight: 700;
        }

        .stButton>button {
            border-radius: 14px;
            border: none;
            background: #6ec6ff;
            color: #0b2038;
            font-weight: 700;
        }
        .stButton>button:hover {
            background: #5eead4;
            color: #0b2038;
        }

        .stSelectbox>div>div, .stTextInput>div>div>input {
            border-radius: 12px !important;
            background: #22406b !important;
            border: 1px solid #3a6199 !important;
            color: #eaf2ff !important;
        }

        [data-testid="stChatInput"] {
            border-radius: 18px;
            border: 2px solid #3a6199 !important;
            background: #22406b;
        }

        .stSlider [data-baseweb="slider"] > div > div {
            background: #5eead4 !important;
        }

        .empty-card {
            text-align: center;
            padding: 55px 20px;
            border-radius: 22px;
            background: #22406b;
            border: 2px dashed #3a6199;
            color: #a9c4e8;
        }
        .empty-card h3 {
            color: #ffffff;
            font-family: 'Baloo 2', sans-serif;
        }

        footer {visibility: hidden;}
        #MainMenu {visibility: hidden;}
    </style>
    """,
    unsafe_allow_html=True,
)


# ---------------------------------------------------------
# Internal model registry.
# Left = friendly label shown in UI, Right = real Hugging Face
# model id actually sent to the API.
# ---------------------------------------------------------
MODEL_OPTIONS = {
    "Nova Flash (Fastest)": "meta-llama/Llama-3.3-70B-Instruct:fastest",
    "Nova Coder": "Qwen/Qwen2.5-Coder-32B-Instruct:fastest",
    "Nova Balanced": "Qwen/Qwen2.5-7B-Instruct-1M:fastest",
    "Nova Pro (Most Capable)": "deepseek-ai/DeepSeek-R1:fastest",
}


@st.cache_resource(show_spinner=False)
def get_client(model_id: str, token: str):
    return InferenceClient(model=model_id, token=token)


def stream_response(client, model_id, history, temperature):
    stream = client.chat_completion(
        model=model_id,
        messages=history,
        temperature=temperature,
        max_tokens=1024,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


# ---------------------------------------------------------
# API key comes only from environment - never shown in the UI.
# ---------------------------------------------------------
hf_token = os.getenv("HF_TOKEN", "")

# ---------------------------------------------------------
# Sidebar - Settings
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("## Settings")

    model_label = st.selectbox(
        "Model",
        options=list(MODEL_OPTIONS.keys()),
        index=0,
        help="Nova Flash is the fastest and most efficient option for everyday chatting.",
    )
    model_id = MODEL_OPTIONS[model_label]

    temperature = st.slider(
        "Creativity (Temperature)",
        min_value=0.0,
        max_value=1.0,
        value=0.6,
        step=0.1,
    )

    st.markdown("---")

    if st.button("Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    st.markdown("---")
    st.caption("Built with Hugging Face + Streamlit")

# ---------------------------------------------------------
# Session State - Chat History
# ---------------------------------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# ---------------------------------------------------------
# Mascot header
# ---------------------------------------------------------
st.markdown(
    f"""
    <div class="mascot-card">
        <div class="mascot-emoji">🐋</div>
        <div>
            <p class="mascot-name">Nova AI Chatbot</p>
            <p class="mascot-tag">Your friendly AI assistant, always ready to help</p>
            <div class="pill-row">
                <span class="pill">{model_label}</span>
                <span class="pill">Temp {temperature}</span>
                <span class="pill"><span class="pill-dot"></span>Online</span>
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------
# Render existing chat history as custom bubbles
# ---------------------------------------------------------
for msg in st.session_state.messages:
    role = msg["role"]
    tag = "You" if role == "user" else "Nova"
    st.markdown(
        f"""
        <div class="bubble-row {role}">
            <div class="bubble {role}">
                <div class="bubble-tag">{tag}</div>
                {msg["content"]}
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ---------------------------------------------------------
# Empty state
# ---------------------------------------------------------
if not st.session_state.messages:
    st.markdown(
        """
        <div class="empty-card">
            <h3>🐋 Say hello!</h3>
            <p>Type your message below to start chatting with Nova.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# ---------------------------------------------------------
# Chat Input
# ---------------------------------------------------------
user_prompt = st.chat_input("Type your message here...")

if user_prompt:
    if not hf_token:
        st.error("HF_TOKEN not found. Add it to your .env file (or platform secrets) and restart the app.")
        st.stop()

    st.session_state.messages.append({"role": "user", "content": user_prompt})

    # Build chat history in the plain dict format Hugging Face chat models expect
    history = [{"role": "system", "content": "You are Nova, a friendly AI assistant."}]
    for msg in st.session_state.messages:
        history.append({"role": msg["role"], "content": msg["content"]})

    try:
        client = get_client(model_id, hf_token)
        response_text = "".join(list(stream_response(client, model_id, history, temperature)))
    except Exception as e:
        response_text = f"Error: {e}"

    st.session_state.messages.append({"role": "assistant", "content": response_text})
    st.rerun()
