import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, RotateCcw } from 'lucide-react'
import { intro, scrollToId } from '../lib/scroll'
import { LINKS } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)
const IntroScene = lazy(() => import('../components/IntroScene'))

const PRESETS = ['#2260d9', '#0a0a0a', '#1c1712', '#000000', '#333333', '#666666', '#b3b3b3', '#ffffff']
const KEY = 'tahmina-motion-bg-v1'
const lenis = () => (window as unknown as { __lenis?: { scrollTo: (n: number | Element, o?: object) => void } }).__lenis

function BgEditor() {
  const [open, setOpen] = useState(false)
  const [hex, setHex] = useState('#2260d9')
  const apply = (v: string) => {
    setHex(v)
    if (/^#[0-9a-f]{6}$/i.test(v)) { document.documentElement.style.setProperty('--ink', v); try { localStorage.setItem(KEY, v) } catch { /* storage unavailable */ } }
  }
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v && /^#[0-9a-f]{6}$/i.test(v)) apply(v) } catch { /* ignore */ } }, [])
  return (
    <div className="hud-font absolute bottom-[calc(clamp(20px,2.2vw,44px)+68px)] right-[clamp(20px,2.2vw,44px)] z-20 text-white">
      <button className="hud-pill ml-auto" aria-expanded={open} onClick={() => setOpen(o => !o)}>BG</button>
      {open && (
        <div className="mt-2 w-[210px] rounded-2xl border border-white/25 bg-[#0a0a0af5] p-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="h-[26px] w-[26px] flex-none rounded-full border border-white/60" style={{ background: hex }} />
            <input aria-label="Background hex colour" value={hex} onChange={e => apply(e.target.value)} maxLength={7} className="min-w-0 flex-1 rounded-md border border-white/15 bg-[#161616] px-2 py-1.5 text-[11px] text-white" />
          </div>
          <div className="mt-2.5 flex gap-[7px]">{PRESETS.map(c => <button key={c} aria-label={`Use ${c}`} onClick={() => apply(c)} className="h-[17px] w-[17px] rounded-full border border-white/60 transition-transform hover:scale-125" style={{ background: c }} />)}</div>
          <button onClick={() => apply('#2260d9')} className="mt-2.5 w-full rounded-[7px] border border-white/15 py-1.5 text-[#999] tracking-[0.12em] hover:text-white">RESET</button>
        </div>
      )}
    </div>
  )
}

export default function Intro({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const mv = (e: PointerEvent) => { intro.mx = e.clientX / innerWidth - 0.5; intro.my = e.clientY / innerHeight - 0.5 }
    window.addEventListener('pointermove', mv)
    return () => window.removeEventListener('pointermove', mv)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.in-sub', { autoAlpha: 0 })
      gsap.set('.in-finale', { autoAlpha: 0, y: 16 })
      const track = root.current!
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: track, start: 'top top', end: '+=400%', pin: true, scrub: 0.6, anticipatePin: 1,
          onUpdate: (s) => { intro.progress = s.progress; track.style.setProperty('--p', String(s.progress)) } },
      })
      tl.to('.in-title', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.16)
        .fromTo('.in-sub', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.22)
        .to('.in-sub', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.46)
        .to('.in-cue', { autoAlpha: 0, duration: 0.08 }, 0.9)
        .to('.in-finale', { autoAlpha: 1, y: 0, duration: 0.06 }, 0.93)
        .to({}, { duration: 0.01 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (ready) gsap.from('.in-enter', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'power4.out', stagger: 0.08 })
  }, [ready])

  const replay = () => { const l = lenis(); if (l) l.scrollTo(0, { duration: 2.2 }); else window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const next = () => { const l = lenis(); const y = scrollY + innerHeight * 0.8; if (l) l.scrollTo(y, { duration: 0.9 }); else window.scrollTo({ top: y, behavior: 'smooth' }) }

  return (
    <section ref={root} id="intro" aria-label="Introduction" className="hud-font relative h-screen w-full overflow-hidden bg-[var(--ink)] text-white" style={{ ['--p' as string]: 0 }}>
      <Suspense fallback={null}><IntroScene /></Suspense>
      <p className="sr-only">Tahmina Sultana is an end-to-end product engineer working across product, UI/UX, frontend, QA and AI-native systems. Selected work includes Kova, Relay and Lattice.</p>

      <div className="pointer-events-none absolute inset-0 z-10 p-[clamp(20px,2.2vw,44px)]">
        {(['left-3 top-3 border-t border-l', 'right-3 top-3 border-t border-r', 'left-3 bottom-3 border-b border-l', 'right-3 bottom-3 border-b border-r'] as const).map(c => <span key={c} aria-hidden className={`corner ${c}`} />)}

        <div className="in-enter flex items-start justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-85"><path d="M8 1v14M1 8h14" /></svg>
            <span className="max-w-[175px] text-[11px] leading-[1.55] tracking-[0.12em] sm:max-w-none sm:text-[13px] sm:tracking-[0.24em]">TAHMINA / PRODUCT ENGINEER</span>
          </div>
          <button onClick={() => scrollToId('about')} className="pointer-events-auto flex items-center gap-2 text-xs tracking-[0.16em] transition-opacity hover:opacity-75 sm:text-[13px] sm:tracking-[0.24em]">ABOUT<ArrowUpRight size={13} aria-hidden /></button>
        </div>

        <div className="in-enter absolute bottom-[calc(clamp(20px,2.2vw,44px)+78px)] left-[clamp(20px,2.2vw,44px)]">
          <h1 className="in-title anton m-0 text-[clamp(56px,11vw,168px)] font-normal leading-[0.92] tracking-[0.005em]">DESIGN<br />BUILD</h1>
          <p className="in-sub absolute bottom-0 left-0 m-0 text-[clamp(30px,5vw,72px)] leading-[1.04]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Prompt.<br />Ship.</p>
        </div>

        <div className="in-enter absolute right-[clamp(20px,2.2vw,44px)] top-1/2 flex -translate-y-1/2 flex-col items-center gap-4 opacity-80" aria-hidden>
          <svg viewBox="0 0 28 28" width="23" height="23" fill="none" stroke="currentColor"><path d="m14 2 4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" /><circle cx="14" cy="14" r="3" /></svg>
          <div className="relative h-[170px] w-px bg-white/40">
            <span className="absolute left-0 top-0 w-px bg-white" style={{ height: 'calc(var(--p) * 100%)' }} />
            <span className="absolute -left-1 h-[9px] w-[9px] -mt-1 rounded-full bg-white" style={{ top: 'calc(var(--p) * 100%)' }} />
          </div>
          <span className="text-[10px] tracking-[0.22em] [writing-mode:vertical-rl]">PRODUCT / IN MOTION</span>
          <span className="h-[42px] w-px bg-current opacity-50" />
        </div>

        <div className="in-enter absolute inset-x-[clamp(20px,2.2vw,44px)] bottom-[clamp(20px,2.2vw,44px)] flex items-end justify-between">
          <button onClick={next} aria-label="Explore the next 3D scene" className="in-cue pointer-events-auto group flex items-center gap-[13px] text-xs tracking-[0.12em] transition-opacity hover:opacity-75 sm:text-sm sm:tracking-[0.24em]"><ArrowDown size={15} className="transition-transform group-hover:translate-y-[3px]" aria-hidden />SCROLL TO EXPLORE</button>
          <button onClick={replay} aria-label="Restart the journey" className="hud-pill pointer-events-auto"><RotateCcw size={15} aria-hidden />RESTART</button>
        </div>
      </div>

      <BgEditor />

      <nav aria-label="Portfolio actions" className="in-finale absolute bottom-[max(30px,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap text-[11px] tracking-[0.04em] sm:tracking-[0.16em]">
        <a href={LINKS.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-full border border-white bg-white px-3 text-[#111] transition hover:-translate-y-0.5 hover:bg-[#e6e6e6] sm:px-5">FULL PORTFOLIO ↗</a>
        <button onClick={replay} className="inline-flex min-h-[44px] items-center rounded-full border border-white/55 bg-[#0a0a0a24] px-3 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 sm:px-5">REPLAY JOURNEY</button>
        <button onClick={() => scrollToId('top')} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-white/55 bg-[#0a0a0a24] px-3 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 sm:px-5">ENTER SITE <ArrowDown size={12} aria-hidden /></button>
      </nav>
    </section>
  )
}
