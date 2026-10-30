import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { NAV } from '../lib/content'
import { scrollToId } from '../lib/scroll'
import Magnetic from './Magnetic'

export default function Nav({ night, toggle }: { night: boolean; toggle: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(scrollY > innerHeight * 4.9)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  const go = (id: string) => { setOpen(false); setTimeout(() => scrollToId(id.toLowerCase()), 50) }

  return (
    <>
      <a href="#work" onClick={(e) => { e.preventDefault(); go('work') }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--accent-fg)]">Skip to content</a>
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ y: scrolled ? 0 : -100, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md"
        style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
      >
        <div className="wrap flex h-16 items-center justify-between">
          <button onClick={() => go('top')} className="font-display text-xl italic" aria-label="Tahmina Sultana — back to top">Tahmina <span className="text-[var(--accent)]">Sultana</span></button>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map(n => <li key={n}><button onClick={() => go(n)} className="mono group relative py-2">{n}<span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-x-100" /></button></li>)}
          </ul>
          <div className="flex items-center gap-3">
            <span className="mono hidden items-center gap-2 lg:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />Open to work</span>
            <Magnetic><button onClick={toggle} aria-label={night ? 'Switch to day theme' : 'Switch to night theme'} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors">{night ? <Sun size={16} /> : <Moon size={16} />}</button></Magnetic>
            <button className="grid h-10 w-10 place-items-center md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(o => !o)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-label="Menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-40 flex flex-col justify-center bg-[var(--bg)] px-8 pt-16 md:hidden">
            {NAV.map((n, i) => <motion.button key={n} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06 }} onClick={() => go(n)} className="font-display border-b border-[var(--line)] py-4 text-left text-5xl italic"><span className="mono mr-4 align-top">0{i + 1}</span>{n}</motion.button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
