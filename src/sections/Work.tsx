import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProjectVisual } from '../components/Art'
import { Reveal, SplitHeading } from '../components/Reveal'
import { LINKS, PROJECTS, SMALL, type Project } from '../lib/content'
import { reducedMotion } from '../lib/scroll'

function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const tilt = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current!.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.01)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = '' }
  const flip = i % 2 === 1
  return (
    <motion.article initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group grid items-center gap-8 border-t border-[var(--line)] py-12 md:grid-cols-12 md:gap-12 md:py-16">
      <div className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        <div ref={ref} onPointerMove={tilt} onPointerLeave={reset} style={{ background: p.hue, transition: 'transform .4s ease-out' }} className="relative aspect-[3/2] overflow-hidden rounded-sm">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 50%)' }} />
          <div className="absolute inset-0 p-4 transition-transform duration-700 group-hover:scale-105"><ProjectVisual kind={p.kind} /></div>
          <span className="mono absolute left-4 top-4 text-white/80">{p.n} / 05</span>
          <span className="mono absolute right-4 top-4 text-white/80">{p.year}</span>
        </div>
      </div>
      <div className="md:col-span-5">
        <p className="mono text-[var(--muted)]">{p.cat}</p>
        <h3 className="font-display mt-3 text-6xl font-light tracking-[-0.03em] md:text-7xl">{p.name}</h3>
        <p className="font-display mt-4 text-2xl italic text-[var(--accent)]">{p.hook}</p>
        <p className="mt-4 leading-relaxed text-[var(--muted)]">{p.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{p.tags.map(t => <li key={t} className="chip">{t}</li>)}</ul>
        <a href={LINKS.portfolio} target="_blank" rel="noreferrer" className="mono group/l mt-7 inline-flex items-center gap-2 border-b border-[var(--fg)] pb-1 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors" aria-label={`Read the ${p.name} case study`}>
          Read the case study <ArrowUpRight size={14} className="transition-transform group-hover/l:translate-x-1 group-hover/l:-translate-y-1" />
        </a>
      </div>
    </motion.article>
  )
}

export default function Work() {
  return (
    <section id="work" className="wrap scroll-mt-16 pt-28 md:pt-40">
      <p className="mono text-[var(--muted)]">Selected work · 2024–2026</p>
      <SplitHeading className="font-display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-light leading-[1.02] tracking-[-0.03em]" lines={['Nine products, each from', <>first sketch to <em className="text-[var(--accent)]">shipped code.</em></>]} />
      <div className="mt-16">{PROJECTS.map((p, i) => <Card key={p.name} p={p} i={i} />)}</div>
      <p className="font-display mt-10 text-3xl italic">Smaller bets, same care.</p>
      <Reveal stagger className="mt-8 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
        {SMALL.map(s => (
          <a key={s.name} href={LINKS.portfolio} target="_blank" rel="noreferrer" className="group bg-[var(--bg)] p-6 transition-colors hover:bg-[var(--card)]">
            <p className="mono flex justify-between text-[var(--muted)]"><span>{s.cat}</span><span>{s.y}</span></p>
            <h4 className="font-display mt-10 text-3xl font-light">{s.name}</h4>
            <p className="mt-2 text-[var(--muted)]">{s.d}</p>
            <ArrowUpRight size={18} className="mt-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--accent)]" />
          </a>
        ))}
      </Reveal>
    </section>
  )
}
