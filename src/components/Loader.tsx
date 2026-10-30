import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { reducedMotion } from '../lib/scroll'

export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const o = { v: 0 }
    const fast = reducedMotion()
    const tl = gsap.timeline({ onComplete: onDone })
    tl.to(o, { v: 100, duration: fast ? 0.3 : 2.2, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) })
      .to(root.current, { autoAlpha: 0, duration: fast ? 0.1 : 0.8, ease: 'power2.out' }, '+=0.15')
    return () => { tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={root} role="status" aria-label="Loading" className="hud-font fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[var(--ink)] text-[11px] tracking-[0.2em] text-white">
      <span aria-hidden className="anton absolute select-none leading-none tracking-[-0.06em] opacity-[0.075]" style={{ fontSize: 'min(58vw, 620px)' }}>TS</span>
      <span aria-hidden className="pointer-events-none absolute inset-6 border border-white/20" />
      <span>LOADING TAHMINA / IN MOTION {n}%</span>
    </div>
  )
}
