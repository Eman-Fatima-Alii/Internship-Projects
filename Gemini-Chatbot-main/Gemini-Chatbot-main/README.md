# 🤖 Gemini AI Chatbot (Streamlit)

Professional Streamlit chatbot jo **LangChain** aur **Google Gemini** use karta hai.

## Features
- Real chat interface (message bubbles, avatars) — sirf single Q&A nahi
- Poori conversation history yaad rakhta hai (context-aware)
- Sidebar se model, temperature, aur API key change kar sakte hain
- "Clear Chat" button
- Dark, professional UI theme
- Error handling (galat API key ya model se crash nahi hoga)

## Setup (Local)

1. Is folder mein terminal khol kar virtual environment banayein (optional but recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate   # Mac/Linux
   ```

2. Requirements install karein:
   ```bash
   pip install -r requirements.txt
   ```

3. `.env.example` ko `.env` mein rename karein aur apni Gemini API key daal dein:
   ```
   GOOGLE_API_KEY=your_actual_key_here
   ```
   API key yahan se milegi: https://aistudio.google.com/app/apikey

4. App run karein:
   ```bash
   streamlit run app.py
   ```

5. Browser mein `http://localhost:8501` khul jayega.

## Notes
- **API key sirf ek dafa daalni parti hai** — `.env` file mein `GOOGLE_API_KEY` set karein, phir wo har baar automatically load ho jayegi, sidebar mein dobara type nahi karni paray gi.
- Default model **gemini-3.6-flash** hai (Google ka sab se naya Flash-tier model, July 2026 launch) — tez aur token-efficient.
- Agar koi model "NOT_FOUND" error de (Google models retire karta rehta hai), sidebar se doosra model select kar lein.
- Response ab **stream** hota hai (type hota hua dikhega) — pehle se kaafi fast mehsoos hoga.
- Deploy karne ke liye Streamlit Community Cloud, Render, ya Hugging Face Spaces use kar sakte hain — bas `GOOGLE_API_KEY` ko secret/environment variable ki tarah set karna hoga.
