import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { reducedMotion } from '../lib/scroll'

/** Wraps a child and pulls it toward the pointer. Disabled on touch and for reduced motion. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' })
  return <span ref={ref} onPointerMove={move} onPointerLeave={leave} className="inline-block">{children}</span>
}
