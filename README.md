# Tahmina Sultana — Product in Motion

A scroll-driven 3D portfolio for an end-to-end product engineer (product, UI/UX, frontend, QA and AI-native systems).

**Live:** https://tiger-3d-portfolio.vercel.app
**Full portfolio:** https://its-tahmina.vercel.app/

| Route | What it is |
|---|---|
| `/` | Cinematic 3D intro: a wireframe cheetah runs through scroll-driven scenes (`replica/`) |
| `/portfolio.html` | Full portfolio site: Work, About, Process, Playground, Contact (`src/`) |

## Why it's different

- **The portfolio is the demo.** Instead of a page of project cards, the first thing you see is a real-time 3D scene driven by your scroll position: DESIGN / BUILD, "Prompt. Ship.", then PRODUCT / IN MOTION.
- **A 3D animated cheetah as the hero.** The model is drawn as a white wireframe grid with a custom shader, running along a road while the camera moves through floating 3D UI cards, a glass chat panel, a switch and an ASCII finale.
- **Editorial HUD.** Corner brackets, a vertical progress gauge, Anton + IBM Plex Mono type, and a live background-colour picker (saved in `localStorage`).
- **Working playground, not screenshots.** The portfolio page includes six real interactive demos (below).
- **Built to load.** The animation data is pre-compressed and served as brotli, and the page falls back gracefully on browsers that can't run it.

## What was built

### `/` — 3D intro (`replica/`)
Plain Three.js, no build step.

- Loader, scroll-scrubbed camera rig, road, 3D cards, buttons, glass and ASCII scenes
- HUD: ABOUT, SCROLL TO EXPLORE, RESTART, BG COLOR; finale links "Full portfolio ↗" and "Replay journey"
- Respects `prefers-reduced-motion`
- Performance work on the 53 MB cheetah animation:
  - removed ~17 MB of per-frame normals that were never read
  - halved the frame count (the playback math interpolates between frames, speed unchanged)
  - brotli-compressed: **53 MB → 12 MB**
  - removed the `importmap` / `DecompressionStream` dependencies so older iOS and in-app browsers (WhatsApp, Instagram) can run it
  - added a fallback screen for no-WebGL or a load over 45 s

### `/portfolio.html` — React portfolio (`src/`)
- **Nav** with smooth anchor scrolling, mobile menu, day/night toggle
- **Hero** with headline, stats, illustration and a skills ticker
- **Selected Work:** Kova, Relay, Lattice, Vital and Tally, each with an animated visual, tags and hover tilt, plus four smaller projects
- **About:** five skill areas
- **Process:** six interactive steps
- **Playground:** constellation canvas, AI agent run, streaming reply, hold-to-confirm, day/night switch, 3D tilt-and-flip card
- **Contact** and footer

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, GSAP + ScrollTrigger, Framer Motion, Three.js, React Three Fiber, Lenis, Lucide.

## Develop

```bash
npm install
npm run dev      # portfolio at http://localhost:5173/portfolio.html
npm run build    # builds the portfolio, then copies replica/ over dist/
```

Deploy: `npx vercel deploy --prod` (headers for the brotli files are in `vercel.json`).

## Notes

- `replica/` contains the scene code and assets of the Product-in-Motion page at https://nyxa5qonhj35q.kimi.page, with its analytics script removed.
- Contact and case-study links currently point to the full portfolio. Replace them in `src/lib/content.ts`.
