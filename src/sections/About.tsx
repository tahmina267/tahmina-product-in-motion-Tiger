import { useState } from 'react'
import { Reveal, SplitHeading } from '../components/Reveal'
import { HATS } from '../lib/content'
import { LINKS } from '../lib/content'
import { StarGirl } from '../components/Art'

const TOOLS = ['Figma', 'FigJam', 'Framer', 'Protopie', 'React', 'TypeScript', 'Next.js', 'Tailwind', 'Storybook', 'Framer Motion', 'Three.js', 'Playwright', 'Claude', 'Cursor', 'Notion', 'Linear']

export default function About() {
  const [active, setActive] = useState(0)
  return (
    <section id="about" className="wrap scroll-mt-16 pt-28 md:pt-44">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mono text-[var(--muted)]">About</p>
          <SplitHeading className="font-display mt-4 text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.04] tracking-[-0.03em]" lines={['Designer by training,', <><em className="text-[var(--accent)]">engineer</em> by habit,</>, <><em className="text-[var(--accent)]">QA</em> by paranoia.</>]} />
        </div>
        <Reveal className="space-y-6 text-lg leading-relaxed text-[var(--muted)]">
          <p>No silos. Features travel from research to production-ready React and tests with one person holding the thread — fewer handoffs, fewer surprises.</p>
          <p>Graduated from North South University in 2025 in Dhaka, Bangladesh.</p>
          <div className="flex gap-6"><a className="mono border-b border-[var(--fg)] pb-1 text-[var(--fg)] hover:text-[var(--accent)]" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a className="mono border-b border-[var(--fg)] pb-1 text-[var(--fg)] hover:text-[var(--accent)]" href={LINKS.contact} target="_blank" rel="noreferrer">Contact</a></div>
        </Reveal>
      </div>

      <div className="mt-24 grid items-start gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="font-display text-4xl font-light italic md:text-5xl">Five hats, one person, fewer handoffs.</h3>
          <div className="mt-10 border-t border-[var(--line)]">
            {HATS.map((h, i) => (
              <button key={h.t} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={active === i}
                className="group grid w-full grid-cols-[3rem_1fr] items-baseline gap-2 border-b border-[var(--line)] py-6 text-left md:grid-cols-[4rem_14rem_1fr]">
                <span className="mono text-[var(--muted)]">0{i + 1}</span>
                <span className={`font-display text-3xl transition-all duration-300 md:text-4xl ${active === i ? 'translate-x-2 italic text-[var(--accent)]' : ''}`}>{h.t}</span>
                <span className="col-start-2 text-[var(--muted)] md:col-start-3"><span className="block">{h.d}</span><span className={`mono block overflow-hidden transition-all duration-500 ${active === i ? 'mt-2 max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>{h.x}</span></span>
              </button>
            ))}
          </div>
        </div>
        <div className="hidden lg:block"><div className="sticky top-28 rounded-t-full border border-[var(--line)] bg-[var(--card)] p-6 pb-0"><StarGirl className="w-full" /></div></div>
      </div>

      <div className="mt-20">
        <p className="mono text-[var(--muted)]">Tools of the trade</p>
        <ul className="mt-4 flex flex-wrap gap-2">{TOOLS.map(t => <li key={t} className="chip">{t}</li>)}</ul>
      </div>
    </section>
  )
}
