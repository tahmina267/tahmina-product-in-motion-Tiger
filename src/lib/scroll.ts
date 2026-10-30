import { useEffect, useState } from 'react'

/** Shared intro scroll progress (0..1) and pointer, read inside the WebGL loop without re-rendering React. */
export const intro = { progress: 0, mx: 0, my: 0 }

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const on = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [bp])
  return m
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const l = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis
  if (l) l.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}
