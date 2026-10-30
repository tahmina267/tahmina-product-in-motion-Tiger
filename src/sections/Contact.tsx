import { ArrowUpRight, MapPin } from 'lucide-react'
import { BlankSky } from '../components/Art'
import Magnetic from '../components/Magnetic'
import { SplitHeading } from '../components/Reveal'
import { LINKS } from '../lib/content'
import { scrollToId } from '../lib/scroll'

export default function Contact() {
  return (
    <>
      <section id="contact" className="scroll-mt-16 pt-28 md:pt-44">
        <div className="wrap">
          <p className="mono text-[var(--muted)]">Contact</p>
          <SplitHeading className="font-display mt-4 text-[clamp(3rem,10vw,9rem)] font-light leading-[0.98] tracking-[-0.04em]" lines={['Got a blank', <><em className="text-[var(--accent)]">sky</em> to paint?</>]} />
          <p className="mt-8 max-w-xl text-lg text-[var(--muted)]">Open to product design and design-engineering roles — remote or in Dhaka.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Magnetic><a className="btn btn-solid" href={LINKS.contact} target="_blank" rel="noreferrer">Say hi <ArrowUpRight size={14} /></a></Magnetic>
            <Magnetic><a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></Magnetic>
            <Magnetic><a className="btn" href={LINKS.portfolio} target="_blank" rel="noreferrer">Full portfolio <ArrowUpRight size={14} /></a></Magnetic>
          </div>
          <p className="mono mt-10 flex items-center gap-2 text-[var(--muted)]"><MapPin size={14} />Dhaka, Bangladesh</p>
        </div>
        <BlankSky className="mt-16 w-full text-[var(--fg)]" />
      </section>
      <footer className="border-t border-[var(--line)] py-8">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <p className="mono text-[var(--muted)]">© 2026 Tahmina Sultana</p>
          <nav aria-label="Footer" className="flex gap-6">
            <a className="mono hover:text-[var(--accent)]" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="mono hover:text-[var(--accent)]" href={LINKS.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
            <button className="mono hover:text-[var(--accent)]" onClick={() => scrollToId('intro')}>Replay journey ↑</button>
          </nav>
        </div>
      </footer>
    </>
  )
}
