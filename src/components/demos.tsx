import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Check, Pause, Play, RotateCw } from 'lucide-react'
import { reducedMotion } from '../lib/scroll'

/* 1 — Constellation: stars dodge the cursor; click to connect */
export function Constellation() {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = cv.current!, ctx = c.getContext('2d')!
    let w = 0, h = 0, raf = 0, visible = true
    const mouse = { x: -999, y: -999 }
    type S = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number }
    let stars: S[] = []
    const links: [number, number][] = []
    const size = () => {
      const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2)
      w = r.width; h = r.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0)
      stars = Array.from({ length: Math.round(w * h / 4500) }, () => { const x = Math.random() * w, y = Math.random() * h; return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: 1 + Math.random() * 1.6 } })
      links.length = 0
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(c)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(c)
    const col = () => getComputedStyle(document.documentElement).getPropertyValue('--fg').trim()
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      const fg = col()
      ctx.strokeStyle = fg; ctx.globalAlpha = 0.5
      links.forEach(([a, b]) => { if (!stars[a] || !stars[b]) return; ctx.beginPath(); ctx.moveTo(stars[a].x, stars[a].y); ctx.lineTo(stars[b].x, stars[b].y); ctx.stroke() })
      ctx.fillStyle = fg
      for (const s of stars) {
        const dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.hypot(dx, dy)
        if (d < 90) { s.vx += dx / d * 0.9; s.vy += dy / d * 0.9 }
        s.vx += (s.ox - s.x) * 0.01; s.vy += (s.oy - s.y) * 0.01
        s.vx *= 0.9; s.vy *= 0.9; s.x += s.vx; s.y += s.vy
        ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill()
      }
    }
    draw()
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const leave = () => { mouse.x = mouse.y = -999 }
    let last = -1
    const click = (e: PointerEvent) => {
      pos(e); let best = -1, bd = 40
      stars.forEach((s, i) => { const d = Math.hypot(s.x - mouse.x, s.y - mouse.y); if (d < bd) { bd = d; best = i } })
      if (best < 0) return
      if (last >= 0 && last !== best) links.push([last, best])
      last = best
    }
    c.addEventListener('pointermove', pos); c.addEventListener('pointerleave', leave); c.addEventListener('pointerdown', click)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); c.removeEventListener('pointermove', pos); c.removeEventListener('pointerleave', leave); c.removeEventListener('pointerdown', click) }
  }, [])
  return <canvas ref={cv} className="h-full w-full touch-none" aria-label="Interactive constellation. Move the pointer to scatter stars; click stars in sequence to connect them." role="img" />
}

/* 2 — Agent run: plan -> act -> stop at the risky step */
const AGENT = ['Plan: refund 3 duplicate charges', 'Act: look up customer #4821', 'Act: draft refund of $240', 'Risky: send money — needs approval']
export function AgentRun() {
  const [i, setI] = useState(-1)
  const [state, setState] = useState<'idle' | 'run' | 'wait' | 'done'>('idle')
  useEffect(() => {
    if (state !== 'run') return
    if (i >= AGENT.length - 1) { setState('wait'); return }
    const t = setTimeout(() => setI(n => n + 1), 900)
    return () => clearTimeout(t)
  }, [state, i])
  const start = () => { setI(0); setState('run') }
  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-2" aria-live="polite">
        {AGENT.map((s, n) => (
          <li key={s} className={`flex items-center gap-3 rounded border px-3 py-2 text-sm transition-all duration-500 ${n <= i ? 'border-[var(--fg)] opacity-100' : 'border-[var(--line)] opacity-30'} ${n === 3 && n <= i ? '!border-[var(--accent)] text-[var(--accent)]' : ''}`}>
            <span className="mono">{n <= i ? (n === 3 && state !== 'done' ? '!' : '✓') : '·'}</span>{s}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        {state === 'idle' || state === 'done' ? <button className="btn !px-4 !py-2" onClick={start}><Play size={12} />{state === 'done' ? 'Run again' : 'Run agent'}</button>
          : state === 'wait' ? <><button className="btn btn-solid !px-4 !py-2" onClick={() => setState('done')}><Check size={12} />Approve</button><button className="btn !px-4 !py-2" onClick={() => { setState('idle'); setI(-1) }}>Reject</button></>
            : <span className="mono flex items-center gap-2 py-2 text-[var(--muted)]"><Pause size={12} />Running…</span>}
      </div>
    </div>
  )
}

/* 3 — Streaming reply with tone switch */
const TONES = { Friendly: 'You spent $312 on food this month — about 18% more than usual. Two takeout weekends did most of it. Want a gentle cap?', Direct: 'Food: $312, up 18%. Takeout drove it. Set a $250 cap?' } as const
export function Streaming() {
  const [tone, setTone] = useState<keyof typeof TONES>('Friendly')
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'think' | 'stream' | 'done'>('think')
  const run = useRef(0)
  const go = (t: keyof typeof TONES) => {
    setTone(t); setText(''); setPhase('think')
    const id = ++run.current
    const full = TONES[t]
    setTimeout(() => {
      if (id !== run.current) return
      setPhase('stream'); let n = 0
      const tick = () => { if (id !== run.current) return; n += 2; setText(full.slice(0, n)); if (n < full.length) setTimeout(tick, 28); else setPhase('done') }
      tick()
    }, 1100)
  }
  useEffect(() => { go('Friendly'); return () => { run.current++ } }, [])
  return (
    <div className="flex h-full flex-col">
      <p className="mono text-[var(--muted)]">You: where did my money go?</p>
      <div className="mt-3 flex-1 rounded border border-[var(--line)] p-4 text-sm leading-relaxed" aria-live="polite">
        {phase === 'think' ? <span className="inline-block h-3 w-32 rounded" style={{ background: 'linear-gradient(90deg,var(--line),var(--accent),var(--line))', backgroundSize: '200% 100%', animation: 'shimmer 1.4s linear infinite' }} aria-label="Thinking" />
          : <>{text}{phase === 'stream' && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-[var(--accent)]" />}</>}
      </div>
      <div className="mt-4 flex gap-2" role="group" aria-label="Tone">
        {(Object.keys(TONES) as (keyof typeof TONES)[]).map(t => <button key={t} aria-pressed={tone === t} onClick={() => go(t)} className={`btn !px-4 !py-2 ${tone === t ? '!bg-[var(--fg)] !text-[var(--bg)]' : ''}`}>{t}</button>)}
      </div>
    </div>
  )
}

/* 4 — Hold to confirm (1.2s, pointer or Space/Enter) */
export function HoldConfirm() {
  const [p, setP] = useState(0)
  const [done, setDone] = useState(false)
  const raf = useRef(0), start = useRef(0)
  const stop = () => { cancelAnimationFrame(raf.current); start.current = 0; if (!done) { const back = () => setP(v => { if (v <= 0) return 0; raf.current = requestAnimationFrame(back); return Math.max(0, v - 0.06) }); back() } }
  const begin = () => {
    if (done || start.current) return
    cancelAnimationFrame(raf.current); start.current = performance.now() - p * 1200
    const tick = () => { const v = Math.min(1, (performance.now() - start.current) / 1200); setP(v); if (v >= 1) { setDone(true); start.current = 0 } else raf.current = requestAnimationFrame(tick) }
    tick()
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
      <p className="font-display text-3xl italic">{done ? 'Payroll sent.' : 'Send $84,200 payroll?'}</p>
      <button
        onPointerDown={begin} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
        onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); begin() } }}
        onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') stop() }}
        aria-label="Hold to confirm payroll. Hold for 1.2 seconds, or hold Space."
        className="relative h-14 w-64 touch-none select-none overflow-hidden rounded-full border border-[var(--fg)]">
        <span className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: `${p * 100}%` }} />
        <span className="mono relative flex h-full items-center justify-center mix-blend-normal">{done ? 'Confirmed ✓' : 'Hold to confirm'}</span>
      </button>
      {done && <button className="mono text-[var(--muted)] underline" onClick={() => { setDone(false); setP(0) }}>Reset</button>}
    </div>
  )
}

/* 5 — Day / night spring switch (toggles the whole site) */
export function DayNight({ night, toggle }: { night: boolean; toggle: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <button onClick={toggle} role="switch" aria-checked={night} aria-label="Night mode" className={`relative h-20 w-44 rounded-full border border-[var(--fg)] p-2 transition-colors duration-700 ${night ? 'bg-[#141830]' : 'bg-[#ffd9a0]'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 260, damping: 18 }} className={`block h-14 w-14 rounded-full ${night ? 'ml-auto bg-[#f1ead9] shadow-[inset_-10px_-4px_0_0_#9a95b8]' : 'bg-[#e0492b]'}`} />
      </button>
      <p className="mono text-[var(--muted)]">{night ? 'Night' : 'Daylight'} — switches the whole site</p>
    </div>
  )
}

/* 6 — Tilt card: pointer tilt with glare; click to flip */
export function TiltCard() {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 }), ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 })
  const [gx, setGx] = useState(50), [gy, setGy] = useState(50)
  const [flipped, setFlipped] = useState(false)
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    ry.set((x - 0.5) * 24); rx.set((0.5 - y) * 24); setGx(x * 100); setGy(y * 100)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <div className="flex h-full items-center justify-center [perspective:900px]">
      <motion.button onPointerMove={move} onPointerLeave={leave} onClick={() => setFlipped(f => !f)} aria-label="Business card. Click to flip." style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative h-44 w-72 max-w-full">
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ transformStyle: 'preserve-3d' }} className="absolute inset-0">
          <div className="absolute inset-0 flex flex-col justify-between rounded-xl bg-[#16120e] p-5 text-left text-[#f3ecde] [backface-visibility:hidden]">
            <span className="font-display text-2xl italic">Tahmina Sultana</span><span className="mono">Product Engineer</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl" style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.28), transparent 55%)` }} />
          </div>
          <div className="absolute inset-0 flex flex-col items-start justify-between rounded-xl bg-[var(--accent)] p-5 text-left text-[var(--accent-fg)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="font-display text-2xl italic">Prompt. Ship.</span><span className="mono flex items-center gap-2"><RotateCw size={12} /> Dhaka · Remote</span>
          </div>
        </motion.div>
      </motion.button>
    </div>
  )
}
