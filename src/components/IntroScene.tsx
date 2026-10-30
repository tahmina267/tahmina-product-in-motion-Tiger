import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { intro, reducedMotion, useIsMobile } from '../lib/scroll'

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const LINE = new THREE.LineBasicMaterial({ color: '#ffffff' })
const DIM = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 })

type P3 = [number, number, number]
/** A wireframe capsule (or ellipsoid when len = 0) drawn as clean quad edges,. */
function Wire({ r, len = 0, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] }: { r: number; len?: number; pos?: P3; rot?: P3; scale?: P3 }) {
  const g = useMemo(() => new THREE.EdgesGeometry(len ? new THREE.CapsuleGeometry(r, len, 5, 14) : new THREE.SphereGeometry(r, 14, 10), 8), [r, len])
  return <lineSegments geometry={g} material={LINE} position={pos} rotation={rot} scale={scale} />
}

/** Leg = hip pivot -> upper capsule -> knee pivot -> lower capsule. Angles driven by a gallop cycle. */
function Leg({ x, z, offset, front, t }: { x: number; z: number; offset: number; front: boolean; t: React.RefObject<number> }) {
  const hip = useRef<THREE.Group>(null), knee = useRef<THREE.Group>(null)
  useFrame(() => {
    const ph = t.current * 9 + offset
    hip.current!.rotation.z = Math.sin(ph) * (front ? 0.9 : 0.8) + (front ? 0.1 : -0.15)
    knee.current!.rotation.z = (front ? -1 : 1) * (0.25 + Math.max(0, Math.sin(ph + (front ? -1.1 : 1.1))) * 1.0)
  })
  return (
    <group ref={hip} position={[x, 1.05, z]}>
      <Wire r={front ? 0.1 : 0.14} len={0.4} pos={[0, -0.28, 0]} />
      <group ref={knee} position={[0, -0.55, 0]}>
        <Wire r={0.07} len={0.42} pos={[0, -0.26, 0]} />
        <Wire r={0.09} pos={[0.07, -0.54, 0]} scale={[1.6, 0.6, 1]} />
      </group>
    </group>
  )
}

function Cheetah({ t }: { t: React.RefObject<number> }) {
  const body = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  useFrame(() => {
    const ph = t.current * 9
    body.current!.position.y = Math.abs(Math.sin(ph)) * 0.08
    body.current!.rotation.z = Math.sin(ph + 0.6) * 0.04
    tail.current!.rotation.z = -0.35 + Math.sin(ph - 0.8) * 0.18
  })
  return (
    <group ref={body}>
      <Wire r={0.3} len={1.2} pos={[0, 1.25, 0]} rot={[0, 0, Math.PI / 2]} scale={[1, 1, 1]} />
      <Wire r={0.22} len={0.5} pos={[0.95, 1.5, 0]} rot={[0, 0, -0.9]} />
      <Wire r={0.2} pos={[1.32, 1.7, 0]} scale={[1.5, 1, 0.95]} />
      <Wire r={0.06} pos={[1.34, 1.9, 0.12]} scale={[1, 1.2, 0.6]} />
      <Wire r={0.06} pos={[1.34, 1.9, -0.12]} scale={[1, 1.2, 0.6]} />
      <group ref={tail} position={[-0.95, 1.35, 0]}>
        <Wire r={0.06} len={1.1} pos={[-0.55, 0, 0]} rot={[0, 0, Math.PI / 2]} />
        <Wire r={0.09} pos={[-1.2, 0, 0]} scale={[1.6, 1, 1]} />
      </group>
      <Leg x={0.65} z={0.2} offset={0} front t={t} />
      <Leg x={0.65} z={-0.2} offset={0.5} front t={t} />
      <Leg x={-0.7} z={0.2} offset={1.7} front={false} t={t} />
      <Leg x={-0.7} z={-0.2} offset={2.2} front={false} t={t} />
    </group>
  )
}

function Road({ t }: { t: React.RefObject<number> }) {
  const dashes = useRef<THREE.Group>(null)
  const L = 60
  const dashGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 0.01, 0.12)), [])
  const edgeGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-L / 2, 0, 0), new THREE.Vector3(L / 2, 0, 0)]), [])
  const items = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  useFrame(() => {
    dashes.current!.children.forEach((c, i) => { c.position.x = ((i * 2.5 - t.current * 14) % 60 + 60) % 60 - 30 })
  })
  return (
    <group>
      <group ref={dashes}>{items.map(i => <lineSegments key={i} geometry={dashGeo} material={LINE} position={[0, 0, 0]} />)}</group>
      {[-2.2, 2.2].map(z => <lineSegments key={z} geometry={edgeGeo} material={DIM} position={[0, 0, z]} />)}
    </group>
  )
}

const KEYS: { p: number; pos: P3; fov: number }[] = [
  { p: 0, pos: [1.2, 1.3, 5.6], fov: 46 },
  { p: 0.25, pos: [4.2, 0.6, 3.6], fov: 40 },
  { p: 0.5, pos: [-4.5, 1.8, 3], fov: 46 },
  { p: 0.75, pos: [0.6, 7.5, 1.4], fov: 42 },
  { p: 1, pos: [2, 3, 10.5], fov: 50 },
]
const tmp = new THREE.Vector3(), tgt = new THREE.Vector3()

function Rig({ t }: { t: React.RefObject<number> }) {
  const { camera } = useThree()
  const calm = reducedMotion()
  useFrame((state, dt) => {
    const zoom = state.size.width < state.size.height ? Math.min(2.4, 1 / Math.pow(state.size.width / state.size.height, 0.8)) : 1
    if (!calm) t.current += dt
    const p = intro.progress
    let i = 0
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++
    const a = KEYS[i], b = KEYS[i + 1], k = smooth(a.p, b.p, p)
    tmp.set((a.pos[0] + (b.pos[0] - a.pos[0]) * k + intro.mx * 0.8) * zoom, (a.pos[1] + (b.pos[1] - a.pos[1]) * k - intro.my * 0.5) * (p > 0.6 && p < 0.9 ? zoom : 1), (a.pos[2] + (b.pos[2] - a.pos[2]) * k) * zoom)
    camera.position.lerp(tmp, 0.12)
    ;(camera as THREE.PerspectiveCamera).fov += (a.fov + (b.fov - a.fov) * k - (camera as THREE.PerspectiveCamera).fov) * 0.1
    ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    camera.lookAt(tgt.set(0.2, 1, 0))
  })
  return null
}

export default function IntroScene() {
  const mobile = useIsMobile()
  const t = useRef(0)
  return (
    <Canvas aria-hidden dpr={[1, mobile ? 1.5 : 1.75]} camera={{ position: [1.2, 1.3, 5.6], fov: 46 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} style={{ position: 'absolute', inset: 0 }}>
      <Rig t={t} />
      <Cheetah t={t} />
      <Road t={t} />
    </Canvas>
  )
}
