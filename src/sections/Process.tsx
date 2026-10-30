import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SplitHeading } from '../components/Reveal'
import { STEPS } from '../lib/content'

export default function Process() {
  const [a, setA] = useState(0)
  return (
    <section id="process" className="scroll-mt-16 mt-28 bg-[var(--fg)] py-24 text-[var(--bg)] md:mt-44 md:py-36">
      <div className="wrap">
        <p className="mono opacity-60">Process</p>
        <SplitHeading className="font-display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-light leading-[1.02] tracking-[-0.03em]" lines={['I fall into the problem', <>before I draw a <em className="text-[var(--accent)]">screen.</em></>]} />
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <ol role="tablist" aria-label="Process steps" className="border-t border-[var(--bg)]/20">
            {STEPS.map((s, i) => (
              <li key={s.t} role="presentation">
                <button role="tab" aria-selected={a === i} onClick={() => setA(i)} onMouseEnter={() => setA(i)} onFocus={() => setA(i)}
                  className={`flex w-full items-baseline gap-5 border-b border-[var(--bg)]/20 py-5 text-left transition-opacity ${a === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                  <span className="mono">0{i + 1}</span>
                  <span className={`font-display text-3xl md:text-4xl ${a === i ? 'italic' : ''}`}>{s.t}</span>
                  <span className="mono ml-auto hidden sm:block">{s.tag}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[18rem] border border-[var(--bg)]/20 p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div key={a} role="tabpanel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.35 }}>
                <p className="font-display text-[9rem] font-light italic leading-none text-[var(--accent)] md:text-[12rem]">0{a + 1}</p>
                <p className="mono mt-2 opacity-60">{STEPS[a].tag}</p>
                <p className="font-display mt-4 text-3xl italic md:text-4xl">{STEPS[a].t}</p>
                <p className="mt-4 max-w-md text-lg leading-relaxed opacity-70">{STEPS[a].d}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--bg)]/10"><motion.div className="h-full bg-[var(--accent)]" animate={{ width: `${((a + 1) / STEPS.length) * 100}%` }} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
