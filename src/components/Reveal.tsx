import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

/** Masked line-by-line headline reveal. Pass each line as a child string/node via `lines`. */
export function SplitHeading({ lines, as: Tag = 'h2', className = '' }: { lines: ReactNode[]; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.split-line > span', {
        yPercent: 110, rotate: 3, duration: 1.1, ease: 'power4.out', stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => <span key={i} className="split-line"><span>{l}</span></span>)}
    </Tag>
  )
}

/** Fade/slide children (`[data-r]` or the wrapper itself) in on scroll. */
export function Reveal({ children, className = '', delay = 0, stagger = false }: { children: ReactNode; className?: string; delay?: number; stagger?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(ref.current!.children) : ref.current
      gsap.from(targets, {
        y: 40, opacity: 0, duration: 1, delay, ease: 'power3.out', stagger: stagger ? 0.1 : 0,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [delay, stagger])
  return <div ref={ref} className={className}>{children}</div>
}
