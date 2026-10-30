// Edit contact destinations here. Until personal channels are added they point to the full portfolio.
export const SITE = 'https://its-tahmina.vercel.app/'
export const LINKS = {
  portfolio: SITE,
  contact: SITE + '#contact',
  linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Tahmina%20Sultana',
}

export const NAV = ['Work', 'About', 'Process', 'Playground', 'Contact'] as const

export const SKILLS = ['Research', 'Product design', 'Design systems', 'Prompt & eval design', 'React + TypeScript', 'Motion', 'QA & accessibility']

export type Project = {
  n: string; name: string; cat: string; year: string; hook: string; desc: string; tags: string[]; kind: 'kova' | 'relay' | 'lattice' | 'vital' | 'tally'; hue: string
}
export const PROJECTS: Project[] = [
  { n: '01', name: 'Kova', cat: 'Fintech · Business banking', year: '2026', hook: 'Making a six-figure payroll feel boring.', desc: 'A multi-currency business account where approving payroll takes one calm, deliberate gesture — with a live balance chart and currency breakdown.', tags: ['Product', 'UI/UX', 'Frontend', 'QA'], kind: 'kova', hue: '#2c5b4a' },
  { n: '02', name: 'Relay', cat: 'AI agents · Automation', year: '2026', hook: 'An agent you actually let drive.', desc: 'Plan, act, and stop at the risky step. An agent workflow that shows its reasoning and hands control back before anything irreversible.', tags: ['Product', 'UI/UX', 'AI-native', 'QA'], kind: 'relay', hue: '#3b3a8f' },
  { n: '03', name: 'Lattice', cat: 'Edtech · 3D & AR', year: '2025', hook: 'Proteins you can hold in your hand.', desc: 'Interactive 3D molecules and AR overlays that turn biology textbooks into something students can rotate, pinch, and place on their desk.', tags: ['Product', 'UI/UX', 'Frontend', 'QA'], kind: 'lattice', hue: '#a2452c' },
  { n: '04', name: 'Vital', cat: 'Health · AI', year: '2025', hook: 'Health data, in one calm sentence.', desc: 'Wearable signals distilled into a single plain-language summary, with the model clearly flagging what it is unsure about.', tags: ['Product', 'UI/UX', 'AI-native', 'Frontend'], kind: 'vital', hue: '#8a3a5c' },
  { n: '05', name: 'Tally', cat: 'Personal finance · AI', year: '2025', hook: 'Money, explained like a friend.', desc: 'A finance companion that streams answers about your spending in a tone you choose — thinking shimmer, token streaming, no jargon.', tags: ['Product', 'UI/UX', 'AI-native', 'Frontend'], kind: 'tally', hue: '#7a5d12' },
]

export const SMALL = [
  { name: 'Margin', cat: 'Edtech · AI tutor', y: '2024', d: 'Hints, not answers.' },
  { name: 'Packed', cat: 'Agentic commerce', y: '2024', d: 'Tell it the trip; it packs the bag.' },
  { name: 'Telegram study', cat: 'Design-system study', y: '2024', d: 'Telegram for iOS, rebuilt.' },
  { name: 'Lakeside', cat: 'Interactive 3D · WebGL', y: '2026', d: 'A portfolio you can walk into.' },
]

export const HATS = [
  { t: 'Product', d: 'Finds the one job worth doing.', x: 'Discovery · JTBD · PRDs · Success metrics' },
  { t: 'UI/UX', d: 'Flows and systems that hold together.', x: 'IA · Interaction · Motion · Design tokens · WCAG 2.2' },
  { t: 'Frontend', d: 'Production-ready, typed, tested.', x: 'React · Next.js · TypeScript · Storybook · Three.js' },
  { t: 'QA', d: 'Paranoia, applied on purpose.', x: 'Test matrices · Playwright · VoiceOver · Bug bashes' },
  { t: 'AI-native', d: 'Models designed as part of the product.', x: 'Prompts · Evals · Guardrails · RAG & tool-use UX' },
]

export const STEPS = [
  { t: 'Frame', tag: 'Product', d: 'One-sentence job, a success metric, and a "not now" list before any pixels.' },
  { t: 'Sketch the behaviour', tag: 'AI-native', d: 'Including how the model behaves when it is wrong, slow, or unsure.' },
  { t: 'Design', tag: 'UI/UX', d: 'Flows, states, motion and copy. Empty, error and slow states first.' },
  { t: 'Build', tag: 'Frontend', d: 'React + TypeScript, tokens straight from Figma, pairing on every PR.' },
  { t: 'Break it', tag: 'QA', d: 'Test matrix, device lab, VoiceOver pass, and adversarial prompts.' },
  { t: 'Measure & tune', tag: 'Product', d: 'Ships behind a flag; reads the funnel and the transcripts, then adjusts.' },
]
