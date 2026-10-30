import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { StarGirl } from '../components/Art'
import Magnetic from '../components/Magnetic'
import { Reveal, SplitHeading } from '../components/Reveal'
import { LINKS, SKILLS } from '../lib/content'
import { scrollToId } from '../lib/scroll'

export default function Hero() {
  const row = [...SKILLS, ...SKILLS]
  return (
    <section id="top" className="relative pt-28 md:pt-36">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="mono mb-6 text-[var(--muted)]">Product · UI/UX · Frontend · QA · AI-native</p>
          <SplitHeading as="h2" className="font-display text-[clamp(2.8rem,8vw,7.2rem)] font-light leading-[0.98] tracking-[-0.035em]"
            lines={[<>I <em className="text-[var(--accent)]">design</em> the product,</>, <>prompt the <em className="text-[var(--accent)]">model</em>,</>, <>and ship the <em className="text-[var(--accent)]">code</em>.</>]} />
          <Reveal className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--muted)]" delay={0.2}>
            <p>I'm an end-to-end product engineer who bridges human needs and machine intelligence — research, UI, AI behaviour, React and testing, all by one person.</p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-4" delay={0.3}>
            <Magnetic><button onClick={() => scrollToId('work')} className="btn btn-solid">See the work <ArrowDown size={14} /></button></Magnetic>
            <Magnetic><a href={LINKS.contact} target="_blank" rel="noreferrer" className="btn">Get in touch <ArrowUpRight size={14} /></a></Magnetic>
          </Reveal>
          <Reveal className="mt-12 flex gap-12" delay={0.4}>
            <div><p className="font-display text-6xl font-light">9</p><p className="mono text-[var(--muted)]">End-to-end case studies</p></div>
            <div><p className="font-display text-6xl font-light">5</p><p className="mono text-[var(--muted)]">Disciplines, one person</p></div>
          </Reveal>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <StarGirl className="bob w-full drop-shadow-2xl" />
          <p className="mono mt-6 flex items-center justify-center gap-2 text-center text-[var(--muted)]"><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />Currently: Designing AI that knows when to ask</p>
        </div>
      </div>
      <div className="rule mt-24 overflow-hidden border-y border-[var(--line)] py-5" aria-label="Skills">
        <div className="flex w-max whitespace-nowrap" style={{ animation: 'ticker 38s linear infinite' }}>
          {row.map((s, i) => <span key={i} className="font-display flex items-center text-3xl italic md:text-4xl">{s}<span className="mx-8 text-[var(--accent)]" aria-hidden>✦</span></span>)}
        </div>
      </div>
    </section>
  )
}
