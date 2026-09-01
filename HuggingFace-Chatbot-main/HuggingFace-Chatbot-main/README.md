---
title: Nova AI Chatbot
emoji: 🌟
colorFrom: indigo
colorTo: pink
sdk: streamlit
sdk_version: 1.38.0
app_file: app.py
pinned: false
---

# 🌟 Nova AI Chatbot

Professional Streamlit chatbot powered by **LangChain**.

## 🚀 Deploy on Hugging Face Spaces

1. Naya Space banayein: https://huggingface.co/new-space
   - **SDK:** Streamlit select karein
   - Space create hone ke baad, is folder ki teenon files (`app.py`, `requirements.txt`, `README.md`) us Space ke repo mein upload/push kar dein (drag-drop ya git se).

2. **API Key set karein (zaroori):**
   - Apne Space ke **Settings → Variables and secrets** mein jayein
   - "New secret" par click karein
   - Name: `AI_API_KEY`
   - Value: apni API key
   - Save karein

3. Space khud restart ho kar build ho jayega — 1-2 minute mein live ho jayega.

## Local run karne ke liye

```bash
pip install -r requirements.txt
python -m streamlit run app.py
```

Local run ke liye is folder mein `.env` file bana kar `AI_API_KEY=your_key_here` daal dein.

## Notes
- API key kahin bhi code mein hardcode nahi hai — Space "Secrets" ya local `.env` se load hoti hai, is liye public repo mein bhi safe rehti hai.
- Response streaming ke sath aata hai (live typing effect).
- Sidebar se model aur creativity (temperature) change kar sakte hain.
