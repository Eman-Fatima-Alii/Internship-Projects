# Nouman Qamar Portfolio

A React + Vite + Tailwind CSS v4 portfolio, styled after adhivishnuportfolio.web.app
(same layout, marquee/ticker animations, light theme) with Muhammad Nouman Qamar's
own content: projects, skills, and contact info.

## Sections
- Hero name, stats, skills ticker
- Method "How I build" process steps
- Giant letter marquee "WORK" signature banner
- Work 3 project cards (AI Portfolio Website, Titanic ML Prediction, Secure Cloud Storage)
- Skills filterable tabs (Frontend / Backend / AI-ML / Tools)
- About bio + education timeline
- Contact email, phone, LinkedIn, GitHub

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Edit content

Everything lives in `src/components/`:
- `Hero.jsx` name, tagline, stats
- `Method.jsx` process steps
- `Work.jsx` project cards (edit the `PROJECTS` array)
- `Skills.jsx` skill groups (edit the `GROUPS` object)
- `About.jsx` bio, timeline, focus areas
- `Contact.jsx` email, phone, social links (edit the `LINKS` array)

Colors and fonts are set as CSS variables at the top of `src/index.css`.
