import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Intro from './sections/Intro'
import Hero from './sections/Hero'
import Work from './sections/Work'
import About from './sections/About'
import Process from './sections/Process'
import Playground from './sections/Playground'
import Contact from './sections/Contact'
import { reducedMotion } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)
  const [night, setNight] = useState(false)

  useEffect(() => { document.documentElement.dataset.theme = night ? 'night' : 'light' }, [night])
  const toggle = useCallback(() => setNight(n => !n), [])

  // one smooth-scroll engine, driven by GSAP's ticker
  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1 })
    ;(window as unknown as { __lenis: Lenis }).__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); delete (window as unknown as { __lenis?: Lenis }).__lenis }
  }, [])

  // lock scroll while loading
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden'; if (ready) ScrollTrigger.refresh() }, [ready])

  return (
    <>
      {!ready && <Loader onDone={() => setReady(true)} />}
      <Nav night={night} toggle={toggle} />
      <main>
        <Intro ready={ready} />
        <Hero />
        <Work />
        <About />
        <Process />
        <Playground night={night} toggle={toggle} />
        <Contact />
      </main>
    </>
  )
}
