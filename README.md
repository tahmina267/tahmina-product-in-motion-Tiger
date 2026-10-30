# Tahmina Sultana — Product in Motion

Scroll-driven 3D portfolio.

- `/` — the cinematic intro (`replica/`): plain Three.js, no build step. The cheetah data lives in `replica/cheetah/` and is served pre-compressed with brotli (see `vercel.json`).
- `/portfolio.html` — the full portfolio (`src/`): React, TypeScript, Tailwind, GSAP, Framer Motion, Three.js / React Three Fiber.

## Develop

```bash
npm install
npm run dev      # portfolio at http://localhost:5173/portfolio.html
npm run build    # builds the portfolio and copies replica/ over dist/
```
