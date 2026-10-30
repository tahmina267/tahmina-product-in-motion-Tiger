import type { ReactNode } from 'react'
import { SplitHeading, Reveal } from '../components/Reveal'
import { AgentRun, Constellation, DayNight, HoldConfirm, Streaming, TiltCard } from '../components/demos'

function Cell({ n, title, sub, children, wide }: { n: string; title: string; sub: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`flex flex-col bg-[var(--bg)] p-6 ${wide ? 'lg:col-span-2' : ''}`}>
      <div className="mb-4 flex items-baseline justify-between"><h3 className="font-display text-2xl italic">{title}</h3><span className="mono text-[var(--muted)]">{n}</span></div>
      <p className="mono mb-5 text-[var(--muted)]">{sub}</p>
      <div className="h-64 flex-1">{children}</div>
    </div>
  )
}

export default function Playground({ night, toggle }: { night: boolean; toggle: () => void }) {
  return (
    <section id="playground" className="wrap scroll-mt-16 pt-28 md:pt-44">
      <p className="mono text-[var(--muted)]">Playground</p>
      <SplitHeading className="font-display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-light leading-[1.02] tracking-[-0.03em]" lines={['Motion, mischief and', <>things <em className="text-[var(--accent)]">nobody asked for.</em></>]} />
      <Reveal className="mt-14 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
        <Cell n="01" title="Constellation" sub="Canvas 2D · stars dodge the cursor, click to connect" wide><Constellation /></Cell>
        <Cell n="02" title="Agent run" sub="From Relay · plan → act → stop at the risky step"><AgentRun /></Cell>
        <Cell n="03" title="Streaming reply" sub="From Tally · shimmer, tokens, tone switch"><Streaming /></Cell>
        <Cell n="04" title="Hold to confirm" sub="From Kova · 1.2s hold, works with Space"><HoldConfirm /></Cell>
        <Cell n="05" title="Day / night" sub="Spring transition · switches the whole site"><DayNight night={night} toggle={toggle} /></Cell>
        <Cell n="06" title="Tilt card" sub="3D pointer tilt with glare · click to flip" wide><TiltCard /></Cell>
      </Reveal>
    </section>
  )
}
